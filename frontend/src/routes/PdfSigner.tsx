// pages/PdfSignerPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PdfSigner from "../components/shared/PdfSigner";
import axiosInstance from "../api/axiosInstance";

const PdfSignerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("signed.pdf");
  const [loading, setLoading] = useState<boolean>(true);
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
        // Assuming API returns { url: string, fileName: string }
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!fileUrl) return <div>No PDF found.</div>;

  return (
    <PdfSigner
      fileUrl={fileUrl}
      fileName={fileName}
      onUploadSuccess={() => console.log("Uploaded successfully")}
    />
  );
};

export default PdfSignerPage;
