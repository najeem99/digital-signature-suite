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
    const pdfs = await pdfService.getPdfsByStatusAndUser(userId, ['WAITING_FOR_SIGNER', 'REJECTED', 'ACCEPTED']);
    res.json(pdfs);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getSignerDocumentById = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    console.log('🅰️', req?.params?.id)
    const id = req?.params?.id;
    if (!id) return res.status(400).json({ message: "PDF id is required" });

    const pdfId = Number(id);
    const pdf = await pdfService.getPdfById(pdfId);

    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    //  check if user can access
    const userId = Number(req.user.id);
    if (pdf.userId !== userId && pdf.assignedToId !== userId) {
      console.log('Unauthorized access attempt by user:', userId);
      console.log('PDF owner:', pdf.userId, 'Assigned to:', pdf.assignedToId);
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(pdf);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
