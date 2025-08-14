// routes/pdfRoutes.ts
import express from "express";
import multer from "multer";
import { protect } from "../middlewares/authMiddleware";
import { requestDocumentSign } from "../controllers/pdfController";

const router = express.Router();
const upload = multer(); // memory storage
/**
 * @swagger
 * /api/v1/request-sign:
 *   post:
 *     summary: Upload a PDF file with metadata
 *     tags:
 *       - PDF
 *     security:
 *       - bearerAuth: []   # Assuming JWT auth
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
 *                 description: PDF file to upload
 *               assignedToId:
 *                 type: integer
 *                 description: (Optional) ID of the user this PDF is assigned to
 *               signMarking:
 *                 type: string
 *                 description: (Optional) JSON string with signature positions
 *     responses:
 *       200:
 *         description: PDF uploaded and metadata saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 fileName:
 *                   type: string
 *                   example: "test-file.pdf"
 *                 url:
 *                   type: string
 *                   example: "https://res.cloudinary.com/dqqtuvlcv/raw/upload/v1755160766/test-file.pdf"
 *                 public_id:
 *                   type: string
 *                   example: "test-file"
 *                 userId:
 *                   type: integer
 *                   example: 2
 *                 assignedToId:
 *                   type: integer
 *                   nullable: true
 *                   example: 3
 *                 signMarking:
 *                   type: object
 *                   example: { "x": 100, "y": 200 }
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.post("/", protect, upload.single("file"), requestDocumentSign);

export default router;
