import express from "express";
import multer from "multer";
import * as uploadService from "../services/uploadService";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();
const upload = multer(); // memory storage

/**
 * @swagger
 * /api/v1/upload:
 *   post:
 *     summary: Upload a PDF file
 *     tags:
 *       - Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: PDF uploaded successfully
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Internal server error
 */
router.post("/",protect, upload.single("file"), async (req, res) => {
  console.log("File upload request received");
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await uploadService.uploadPDF(req.file,'test-file');
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/v1/upload/{public_id}:
 *   get:
 *     summary: Download a PDF by public ID
 *     tags:
 *       - Upload
 *     parameters:
 *       - in: path
 *         name: public_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cloudinary public ID of the PDF
 *     responses:
 *       302:
 *         description: Redirects to the PDF URL
 *       500:
 *         description: Internal server error
 */
router.get("/:public_id",protect, async (req, res) => {
  try {
    const { public_id } = req.params;
    const url = await uploadService.getPDFUrl(public_id);
    res.redirect(url);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
