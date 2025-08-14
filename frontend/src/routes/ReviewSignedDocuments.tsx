// pages/ReviewSignedDocuments.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PdfUrlViewer from "../components/shared/PdfUrlViewer";
import axiosInstance from "../api/axiosInstance";
import {
  CircularProgress,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
} from "@mui/material";
import Layout from "../components/Layout";

const ReviewSignedDocuments: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("signed.pdf");
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

  // Message Dialog states
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    const fetchPdfUrl = async () => {
      if (!id) {
        setError("No PDF ID provided in the URL.");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(`/v1/docs/${id}`);
        setFileUrl(response.data.url);
        setFileName(response.data.fileName || "signed.pdf");
      } catch (err: any) {
        if (err.response?.status === 403) {
          setError("You are not authorized to access this PDF.");
        } else if (err.response?.status === 404) {
          setError(`PDF with ID ${id} not found.`);
        } else {
          setError("An error occurred while fetching the PDF.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPdfUrl();
  }, [id]);

  const handleActionClick = (type: "approve" | "reject") => {
    setActionType(type);
    setConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!id || !actionType) return;

    setUploading(true);
    try {
      const payload = { status: actionType === "approve" ? "ACCEPTED" : "REJECTED" };
      await axiosInstance.post(`/v1/docs/document-action/${id}`, payload);

      setMessageText(`Document ${actionType}d successfully!`);
      setMessageType("success");
      setMessageOpen(true);
    } catch (err) {
      console.error(err);
      setMessageText(`Failed to ${actionType} document.`);
      setMessageType("error");
      setMessageOpen(true);
    } finally {
      setUploading(false);
      setConfirmOpen(false);
    }
  };

  const handleMessageClose = () => {
    setMessageOpen(false);
    if (messageType === "success") {
      navigate("/dashboard-uploader");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) {
    return (
      <Dialog open={true}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography color="error">{error}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate("/dashboard-uploader")}>OK</Button>
        </DialogActions>
      </Dialog>
    );
  }
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

      {/* Toolbar inside Paper */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          width: "100%",
          maxWidth: 800,
          margin: "0 auto",
          textAlign: "center",
          mb: 2,
          display: "flex",
          gap: 2,
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          color="success"
          onClick={() => handleActionClick("approve")}
        >
          Approve
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleActionClick("reject")}
        >
          Reject
        </Button>
      </Paper>

      {/* PDF Viewer */}
      <PdfUrlViewer fileUrl={fileUrl} />

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm {actionType}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {actionType} this document?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmAction}
            color={actionType === "approve" ? "success" : "error"}
          >
            {actionType?.toUpperCase()}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Persistent Message Dialog */}
      <Dialog open={messageOpen} onClose={handleMessageClose}>
        <DialogTitle>
          {messageType === "success" ? "Success" : "Error"}
        </DialogTitle>
        <DialogContent>
          <Typography
            color={messageType === "error" ? "error" : "primary"}
            sx={{ fontWeight: 500 }}
          >
            {messageText}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMessageClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default ReviewSignedDocuments;
