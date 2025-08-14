// @ts-nocheck

// controllers/pdfController.ts
import { Request, Response } from "express";
import * as pdfService from "../services/pdfService";

export const requestDocumentSign = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    
    if (!req?.user) return res.status(401).json({ message: "Unauthorized" });
    console.log(req.user)
    if (req?.user?.role !== 'uploader') {
      return res.status(403).json({ message: "Forbidden: Only uploaders can request document signing." });
    }
    const { assignedToId, signMarking } = req.body;

    // Upload file to Cloudinary
    const cloudResult = await pdfService.uploadPDFToCloudinary(req.file, req.file.originalname);

    // Save metadata to DB
    const savedPdf = await pdfService.savePdfDetails({
      fileName: req.file.originalname,
      url: cloudResult.url,
      public_id: cloudResult.public_id,
      userId: Number(req?.user.id),
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
    console.log('role', req?.user?.role)
    const filter = req?.user?.role === 'signer' ? ['WAITING_FOR_SIGNER'] : ['WAITING_FOR_SIGNER', 'REJECTED', 'ACCEPTED', 'WAITING_FOR_APPROVAL'];
    const pdfs = await pdfService.getPdfsByStatusAndUser(userId, filter);
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

export const addSignedDocument = async (req: Request, res: Response) => {
  try {
    console.log("Adding signed document with file:", req);
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const id = Number(req?.params?.id);
    if (!id) return res.status(400).json({ message: "id is required to find existing data" });
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req?.user?.role !== 'signer') {
      return res.status(403).json({ message: "Forbidden: Only Signers are allowed to sign document." });
    }

    const pdf = await pdfService.getPdfById(id);
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    // Upload file to Cloudinary
    const cloudResult = await pdfService.uploadPDFToCloudinary(req.file, req.file.originalname);

    // Update info metadata to DB
    const savedPdf = await pdfService.updatePdfDetails(id, {
      fileName: req.file.originalname,
      url: cloudResult.url,
      public_id: cloudResult.public_id,
      assignedToId: pdf.userId,
      status: 'WAITING_FOR_APPROVAL'
    })



    res.json(savedPdf);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
export const onPdfApproveReject = async (req: Request, res: Response) => {
  try {
    console.log("Approving or rejecting PDF with id:", req.params.id);
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "id is required" });
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const pdf = await pdfService.getPdfById(id);
    if (!pdf) return res.status(404).json({ message: "PDF not found" });
    console.log(typeof pdf.assignedToId, typeof Number(req.user.id))
    if (pdf.assignedToId !== Number(req.user.id))
      return res.status(403).json({ message: "Not allowed" });

    const status = req.body.status as 'ACCEPTED' | 'REJECTED';
    if (!status) return res.status(400).json({ message: "Status is required" });

    const savedPdf = await pdfService.handlePdfApproveReject(id, status);

    res.json({ message: `Document ${pdf.fileName} updated successfully!`, pdf: savedPdf });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
