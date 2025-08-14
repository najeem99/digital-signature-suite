import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/authRoutes"; // you'll create this
import uploadRoutes from "./routes/uploadRoutes"; // you'll create this
import pdfRoutes from "./routes/pdfRoutes"; // you'll create this
  import swaggerDocs from "./utils/swagger";
dotenv.config();

const app = express();
const prisma = new PrismaClient(); // Connect to PostgreSQL

// Middleware
app.use(cors());
app.use(express.json());

// Serve Swagger UI
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
// console.log(JSON.stringify(swaggerSpec, null, 2));
swaggerDocs(app, Number(process.env.PORT) || 5000);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/v1/upload", uploadRoutes);
 app.use("/api/v1/docs", pdfRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("PDF Signing Backend is running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL via Prisma");
    console.log(`🚀 Server running on port ${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);

  } catch (err) {
    console.error("❌ Failed to connect to database", err);
    process.exit(1);
  }
});
