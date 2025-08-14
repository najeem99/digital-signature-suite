// controllers/pdfController.ts
import { Request, Response } from "express";
import * as pdfService from "../services/pdfService";

export const requestDocumentSign = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    console.log(req.user)
    const { assignedToId, signMarking } = req.body;

    // Upload file to Cloudinary
    const cloudResult = await pdfService.uploadPDFToCloudinary(req.file, req.file.originalname);

    // Save metadata to DB
    const savedPdf = await pdfService.savePdfDetails({
      fileName: req.file.originalname,
      url: cloudResult.url,
      public_id: cloudResult.public_id,
      userId: Number(req.user.id),
      assignedToId: assignedToId ? Number(assignedToId) : undefined,
      signMarking: signMarking ? JSON.parse(signMarking) : undefined,
      status: 'WAITING_FOR_SIGNER'
    });

    res.json(savedPdf);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
export const getSignerDocuments = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const userId = Number(req.user.id);
    const pdfs = await pdfService.getPdfsByStatusAndUser(userId,['WAITING_FOR_SIGNER', 'REJECTED', 'ACCEPTED']);
    res.json(pdfs);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
