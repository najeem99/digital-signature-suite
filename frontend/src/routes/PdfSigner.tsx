// pages/PdfSignerPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PdfScribbler from "../components/shared/PdfScribbler";
import axiosInstance from "../api/axiosInstance";
import { CircularProgress, Box } from "@mui/material";

const PdfSignerPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("signed.pdf");
  const [signMarking, setSignMarking] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false); // new state
  const [error, setError] = useState<string | null>(null);

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
        setSignMarking(response.data.signMarking || {});
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

  const onUploadPdf = async (blob: Blob) => {
    setUploading(true); // start spinner
    try {
      const formData = new FormData();
      formData.append("file", blob, fileName);
      await axiosInstance.post(`/v1/docs/sign-documents/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("PDF saved locally and uploaded successfully!");
      navigate("/dashboard-signer"); // redirect to documents list
    } catch (err) {
      console.error(err);
      console.error("Error generating/uploading PDF");
    } finally {
      setUploading(false); // stop spinner
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!fileUrl) return <div>No PDF found.</div>;

  return (
    <>
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
        onUploadSuccess={() => console.log("Uploaded successfully")}
        onUploadPdf={onUploadPdf}
      />
    </>
  );
};

export default PdfSignerPage;
