// pages/PdfSignerPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PdfScribbler from "../components/shared/PdfScribbler";
import axiosInstance from "../api/axiosInstance";
import {
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper,
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";
import Layout from "../components/Layout";

const PdfSignerPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("signed.pdf");
  const [signMarking, setSignMarking] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);

  // Dialog state for success/error messages
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");

  useEffect(() => {
    const fetchPdfUrl = async () => {
      if (!id) {
        setDialogTitle("Error");
        setDialogMessage("No PDF ID provided in the URL.");
        setDialogOpen(true);
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(`/v1/docs/${id}`);
        setFileUrl(response.data.url);
        setFileName(response.data.fileName || "signed.pdf");
        setSignMarking(response.data.signMarking || {});
      } catch (err: any) {
        if (err.response?.status === 403) {
          setDialogTitle("Unauthorized");
          setDialogMessage("You are not authorized to access this PDF.");
        } else if (err.response?.status === 404) {
          setDialogTitle("Not Found");
          setDialogMessage(`PDF with ID ${id} not found.`);
        } else {
          setDialogTitle("Error");
          setDialogMessage("An error occurred while fetching the PDF.");
        }
        setDialogOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPdfUrl();
  }, [id]);

  const onUploadPdf = async (blob: Blob) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", blob, fileName);
      await axiosInstance.post(`/v1/docs/sign-documents/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setDialogTitle("Success");
      setDialogMessage("PDF uploaded successfully!");
      setDialogOpen(true);
    } catch (err) {
      console.error("Error generating/uploading PDF", err);
      setDialogTitle("Error");
      setDialogMessage("Failed to upload PDF. Please try again.");
      setDialogOpen(true);
    } finally {
      setUploading(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    // Navigate after success
    if (dialogTitle === "Success") {
      navigate("/dashboard-signer");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!fileUrl) return <div>No PDF found.</div>;

  return (
    <Layout>
      {uploading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            zIndex: 9999,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <PdfScribbler
        fileUrl={fileUrl}
        fileName={fileName}
        signMarking={signMarking}
        onUploadPdf={onUploadPdf}
      />

      {/* Success/Error Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default PdfSignerPage;
