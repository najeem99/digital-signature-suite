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
