import express from "express";
import multer from "multer";
import { protect } from "../middlewares/authMiddleware";
import { uploadPdfController, getPdfController } from "../controllers/uploadController";

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: Cloudinary URL of the uploaded PDF
 *                   example: "https://res.cloudinary.com/dqqtuvlcv/raw/upload/v1755160766/test-file"
 *                 public_id:
 *                   type: string
 *                   description: Cloudinary public ID of the uploaded PDF
 *                   example: "test-file"
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Internal server error
 */
// POST upload PDF
router.post("/", protect, upload.single("file"), uploadPdfController);

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
// GET PDF by public_id
router.get("/:public_id", protect, getPdfController);

export default router;
