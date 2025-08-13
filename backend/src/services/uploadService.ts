import cloudinary from "../config/cloudinary";
import { v2 as cloudinaryV2 } from "cloudinary";
import streamifier from "streamifier";
import multer from "multer";

export const uploadPDF = async (
  file: Express.Multer.File,
  filename?: string // optional custom file name
) => {
  return new Promise<{ url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",          // for PDF / other files
        public_id: filename?.replace(/\.[^/.]+$/, ""), // remove extension if exists
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result!.secure_url, public_id: result!.public_id });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export const getPDFUrl = async (public_id: string) => {
  return cloudinary.url(public_id, { resource_type: "raw", sign_url: true });
};
