// services/pdfService.ts
import { PrismaClient } from "@prisma/client";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary";

const prisma = new PrismaClient();

export const uploadPDFToCloudinary = (file: Express.Multer.File, filename?: string) => {
  return new Promise<{ url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        // public_id: filename?.replace(/\.[^/.]+$/, ""),
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result!.secure_url, public_id: result!.public_id });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export const savePdfDetails = async (data: {
  fileName: string;
  url: string;
  public_id: string;
  userId: number;
  assignedToId?: number;
  signMarking?: any;
  status: 'WAITING_FOR_SIGNER' | 'WAITING_FOR_APPROVAL' | 'REJECTED' | 'ACCEPTED';
}) => {
  return prisma.pdfFile.create({
    data: {
      fileName: data.fileName,
      url: data.url,
      public_id: data.public_id,
      userId: data.userId,
      assignedToId: data.assignedToId,
      signMarking: data.signMarking || {},
      status: data.status || 'WAITING_FOR_SIGNER',
    },
  });
};

export const getPdfsByStatusAndUser = async (
  userId: number,
  statuses: ('WAITING_FOR_SIGNER' | 'WAITING_FOR_APPROVAL' | 'REJECTED' | 'ACCEPTED')[]
) => {
  return prisma.pdfFile.findMany({
    where: {
      status: { in: statuses },
      OR: [
        { userId },
        { assignedToId: userId },
      ],
    },
    select: {
      id: true,
      fileName: true,
      url: true,
      public_id: true,
      userId: true,
      assignedToId: true,
      signMarking: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: { id: true, name: true }  // only select needed fields
      },
      assignedTo: {
        select: { id: true, name: true }  // only select needed fields
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getPdfById = async (id: number) => {
  return prisma.pdfFile.findUnique({
    where: { id },
    select: {
      id: true,
      fileName: true,
      url: true,
      public_id: true,
      userId: true,
      assignedToId: true,
      signMarking: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: { id: true, name: true }  // only select needed fields
      },
      assignedTo: {
        select: { id: true, name: true }  // only select needed fields
      },
    },
  });
};

export const updatePdfDetails = async (id: number, data: {
  fileName?: string;
  url?: string;
  public_id?: string;
  assignedToId?: number;
  status?: 'WAITING_FOR_SIGNER' | 'WAITING_FOR_APPROVAL' | 'REJECTED' | 'ACCEPTED';
}) => {
  return prisma.pdfFile.update({
    where: { id },
    data: {
      ...(data.fileName && { fileName: data.fileName }),
      ...(data.url && { url: data.url }),
      ...(data.public_id && { public_id: data.public_id }),
      ...(data.assignedToId !== undefined && { assignedToId: data.assignedToId }),
      ...(data.status && { status: data.status }),
    },
  });
};
