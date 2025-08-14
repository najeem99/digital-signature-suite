import React, { useEffect, useState, useRef } from "react";
import { pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Paper,
  Backdrop,
} from "@mui/material";
import ConfirmBoxesDialog from "../components/PdfAnnotationMarker/ConfirmBoxesDialog";
import PdfAnnotationMarker from "../components/PdfAnnotationMarker/PdfAnnotationMarker";
import SuccessDialog from "../components/PdfAnnotationMarker/SuccessDialog";
import axiosInstance from "../api/axiosInstance";
import type { OnDocumentLoadSuccess } from "react-pdf/dist/shared/types.js";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

interface DraggableBox {
  id: string;
  label: string;
  x: number;
  y: number;
}

const PdfSignatureMarker: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageWidth, setPageWidth] = useState<number>(800);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [boxesPerPage, setBoxesPerPage] = useState<Record<number, DraggableBox[]>>({});
  const [selectedLabel, setSelectedLabel] = useState<string>("sign here");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageOpen, setMessageOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const labels = ["sign here", "name", "date"];

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPageNumber(1);
      setBoxesPerPage({});
    }
  };

  const onDocumentLoadSuccess = (data: OnDocumentLoadSuccess) => {
    setNumPages(data?.numPages);
  };

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber((prev) => (numPages ? Math.min(prev + 1, numPages) : prev));

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) setPageWidth(containerRef.current.offsetWidth - 20);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const boxes = boxesPerPage[pageNumber] || [];

  const handleAddBoxToState = (page: number, newBox: DraggableBox) => {
    setBoxesPerPage((prev) => ({
      ...prev,
      [page]: [...(prev[page] || []), newBox],
    }));
  };

  const cursorStyle = boxes.find((b) => b.label === selectedLabel) ? "move" : "crosshair";

  const handleUpload = () => setConfirmOpen(true);

  const handleConfirm = async (assignedUserId: string) => {
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("assignedToId", assignedUserId);
      formData.append("signMarking", JSON.stringify(boxesPerPage));

      await axiosInstance.post("/v1/docs/request-sign", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Document submitted successfully for signature!");
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("Failed to submit document for signature. Please try again.");
    } finally {
      setUploading(false);
      setConfirmOpen(false);
      setMessageOpen(true);

      // Auto navigate after 2 seconds
      setTimeout(() => {
        navigate("/dashboard-uploader");
      }, 2000);
    }
  };

  const handleDragData = (boxIndex: number, startBox: DraggableBox, dx: number, dy: number) => {
    setBoxesPerPage((prev) => {
      const pageBoxes = [...(prev[pageNumber] || [])];
      pageBoxes[boxIndex] = { ...startBox, x: startBox.x + dx, y: startBox.y + dy };
      return { ...prev, [pageNumber]: pageBoxes };
    });
  };

  return (
    <Layout>
      <Box
        ref={containerRef}
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          py: 4,
          gap: 3,
        }}
      >
        <Paper sx={{ p: 3, width: "100%", maxWidth: 900, textAlign: "center", mb: 2 }}>
          <Typography variant="h5" gutterBottom>
            Upload and Mark Annotations in PDF for Signature
          </Typography>
          <Button variant="contained" component="label">
            Choose PDF
            <input type="file" hidden accept="application/pdf" onChange={onFileChange} />
          </Button>
        </Paper>

        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            flexDirection: "column",
          }}
          open={loading || uploading}
        >
          <CircularProgress color="inherit" />
          <Typography variant="body1" sx={{ mt: 2 }}>
            {loading ? "Loading PDF..." : "Uploading..."}
          </Typography>
        </Backdrop>

        {file && (
          <PdfAnnotationMarker
            file={file}
            pageNumber={pageNumber}
            numPages={numPages}
            pageWidth={pageWidth}
            boxes={boxes}
            cursorStyle={cursorStyle}
            labels={labels}
            selectedLabel={selectedLabel}
            loading={loading}
            pageRef={pageRef}
            goToPrevPage={goToPrevPage}
            goToNextPage={goToNextPage}
            onAddBox={handleAddBoxToState}
            addDataToBoxes={handleDragData}
            setSelectedLabel={setSelectedLabel}
            handleUpload={handleUpload}
            onLoadSuccess={onDocumentLoadSuccess}
          />
        )}

        <ConfirmBoxesDialog
          open={confirmOpen}
          boxesPerPage={boxesPerPage}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirm}
        />

        <SuccessDialog
          open={messageOpen}
          message={message || ""}
          onClose={() => {
            setMessageOpen(false);
            navigate("/dashboard-uploader");
          }}
        />
      </Box>
    </Layout>
  );
};

export default PdfSignatureMarker;
