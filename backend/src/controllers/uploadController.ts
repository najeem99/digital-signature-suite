// controllers/uploadController.ts
import { Request, Response } from "express";
import * as uploadService from "../services/uploadService";

// POST /api/v1/upload
export const uploadPdfController = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await uploadService.uploadPDF(req.file, "test-file");
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/v1/upload/:public_id
export const getPdfController = async (req: Request, res: Response) => {
  try {
    const { public_id } = req.params;
    const url = await uploadService.getPDFUrl(public_id);
    res.redirect(url);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
