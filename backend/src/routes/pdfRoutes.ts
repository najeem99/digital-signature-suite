// routes/pdfRoutes.ts
import express from "express";
import multer from "multer";
import { protect } from "../middlewares/authMiddleware";
import { getSignerDocuments, requestDocumentSign } from "../controllers/pdfController";

const router = express.Router();
const upload = multer(); // memory storage
/**
 * @swagger
 * /api/v1/docs/request-sign:
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



router.post("/request-sign", protect, upload.single("file"), requestDocumentSign);

/**
 * @swagger
 * /api/v1/docs:
 *   get:
 *     summary: Get PDF documents assigned to the logged-in signer filtered by status
 *     tags:
 *       - PDF
 *     security:
 *       - bearerAuth: []   # JWT authentication
 *         schema:
 *           type: string
 *           description: Comma-separated list of statuses to filter (e.g., WAITING_FOR_SIGNER,REJECTED)
 *     responses:
 *       200:
 *         description: List of PDF documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   fileName:
 *                     type: string
 *                     example: "test-file.pdf"
 *                   url:
 *                     type: string
 *                     example: "https://res.cloudinary.com/dqqtuvlcv/raw/upload/v1755160766/test-file.pdf"
 *                   public_id:
 *                     type: string
 *                     example: "test-file"
 *                   userId:
 *                     type: integer
 *                     example: 2
 *                   assignedToId:
 *                     type: integer
 *                     nullable: true
 *                     example: 3
 *                   signMarking:
 *                     type: object
 *                     example: { "x": 100, "y": 200 }
 *                   status:
 *                     type: string
 *                     enum: [WAITING_FOR_SIGNER, WAITING_FOR_APPROVAL, REJECTED, ACCEPTED]
 *                     example: "WAITING_FOR_SIGNER"
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 2
 *                       name:
 *                         type: string
 *                         example: "Uploader Name"
 *                       email:
 *                         type: string
 *                         example: "uploader@example.com"
 *                   assignedTo:
 *                     type: object
 *                     nullable: true
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 3
 *                       name:
 *                         type: string
 *                         example: "Signer Name"
 *                       email:
 *                         type: string
 *                         example: "signer@example.com"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.get("/", protect, getSignerDocuments);

export default router;
