import React, { useState, useEffect, useRef } from "react";
import { pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import {
  Box,
} from "@mui/material";
import ConfirmBoxesDialog from "../components/PdfAnnotationMarker/ConfirmBoxesDialog";
import PdfAnnotationMarker from "../components/PdfAnnotationMarker/PdfAnnotationMarker";
import axiosInstance from "../api/axiosInstance";
import SuccessDialog from "../components/PdfAnnotationMarker/SuccessDialog";
import type { OnDocumentLoadSuccess } from "react-pdf/dist/shared/types.js";
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
  const [boxesPerPage, setBoxesPerPage] = useState<Record<number, DraggableBox[]>>({});
  const [selectedLabel, setSelectedLabel] = useState<string>("sign here");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const labels = ["sign here", "name", "date"];

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPageNumber(1);
      setBoxesPerPage({});
    }
  };

  const onDocumentLoadSuccess = (data: OnDocumentLoadSuccess) => {
    console.log("Document loaded successfully:", data);
    setNumPages(data?.numPages);
  };
  const onPageRenderStart = () => setLoading(true);
  const onPageRenderSuccess = () => setLoading(false);

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setPageNumber((prev) => (numPages ? Math.min(prev + 1, numPages) : prev));

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setPageWidth(containerRef.current.offsetWidth - 20);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const boxes = boxesPerPage[pageNumber] || [];



  const handleAddBoxToState = (page: number, newBox: DraggableBox) => {
    setBoxesPerPage((prev) => ({
      ...prev,
      [page]: [...(prev[page] || []), newBox]
    }));
  };



  const cursorStyle = boxes.find((b) => b.label === selectedLabel) ? "move" : "crosshair";

  const handleUpload = () => setConfirmOpen(true);

  const handleConfirm = async (assignedUserId: string) => {
    console.log("Boxes to upload:", assignedUserId);
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file); // PDF file
      formData.append("assignedToId", assignedUserId); // assignedToId from your curl
      formData.append("signMarking", JSON.stringify(boxesPerPage)); // your boxes JSON

      const response = await axiosInstance.post("/v1/docs/request-sign", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload successful:", response.data);
      setConfirmOpen(false);
      // show success dialog
      setSuccessOpen(true);

    } catch (error) {
      console.error("Error uploading PDF and boxes:", error);
    }
  };

  // Function to handle dragging of boxes data
  const handleDragData = (boxIndex: number, startBox: DraggableBox, dx: number, dy: number) => {
    setBoxesPerPage((prev) => {
      const pageBoxes = [...(prev[pageNumber] || [])];
      pageBoxes[boxIndex] = { ...startBox, x: startBox.x + dx, y: startBox.y + dy };
      console.log("Box moved:", pageBoxes[boxIndex], "on page", pageNumber);
      return { ...prev, [pageNumber]: pageBoxes };
    });
  }
  return (
    <Box ref={containerRef} className="flex flex-col items-center p-4 w-full min-h-screen">
      <input
        type="file"
        accept="application/pdf"
        onChange={onFileChange}
        className="mb-4 p-2 border rounded"
      />

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
        onAddBox={handleAddBoxToState} // pass callback

        // handleDrag={handleDrag}
        addDataToBoxes={handleDragData}
        setSelectedLabel={setSelectedLabel}
        handleUpload={handleUpload}
        onLoadSuccess={onDocumentLoadSuccess}
      />




      {/* Confirmation Dialog */}
      <ConfirmBoxesDialog
        open={confirmOpen}
        boxesPerPage={boxesPerPage}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />

      <SuccessDialog
        open={successOpen}
        message="Document submitted successfully for signature!"
        onClose={() => setSuccessOpen(false)}
      />
    </Box>
  );
};

export default PdfSignatureMarker;
