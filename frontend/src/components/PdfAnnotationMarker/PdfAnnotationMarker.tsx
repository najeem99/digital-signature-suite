import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { Box, CircularProgress, Paper } from "@mui/material";
import PdfToolbar from "./PdfToolbar";
import type { OnDocumentLoadSuccess } from "react-pdf/dist/shared/types.js";
import { LABEL_AND_COLORS } from "../../constants/labelColors";

interface DraggableBox {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface PdfAnnotationMarkerProps {
  file: File | null;
  pageNumber: number;
  numPages: number | null;
  boxes: DraggableBox[];
  cursorStyle: string;
  labels: string[];
  selectedLabel: string;
  loading: boolean;
  pageRef: React.RefObject<HTMLDivElement>;
  goToPrevPage: () => void;
  goToNextPage: () => void;
  addDataToBoxes: (boxIndex: number, startBox: DraggableBox, dx: number, dy: number) => void;
  setSelectedLabel: (label: string) => void;
  handleUpload: () => void;
  onLoadSuccess: (data: OnDocumentLoadSuccess) => void;
  onAddBox: (pageNumber: number, newBox: DraggableBox) => void;
}

const PdfAnnotationMarker: React.FC<PdfAnnotationMarkerProps> = ({
  file,
  pageNumber,
  numPages,
  boxes,
  cursorStyle,
  labels,
  selectedLabel,
  loading,
  pageRef,
  goToPrevPage,
  goToNextPage,
  addDataToBoxes,
  setSelectedLabel,
  handleUpload,
  onLoadSuccess,
  onAddBox,
}) => {
  const [containerWidth, setContainerWidth] = useState<number>(600);

  useEffect(() => {
    if (!pageRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });

    observer.observe(pageRef.current);
    return () => observer.disconnect();
  }, []);

  if (!file) return null;

  const handleDrag = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const boxIndex = boxes.findIndex((b) => b.id === id);
    if (boxIndex === -1) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startBox = boxes[boxIndex];

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!pageRef.current) return;
      const rect = pageRef.current.getBoundingClientRect();
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let newX = startBox.x + dx / rect.width;
      let newY = startBox.y + dy / rect.height;

      newX = Math.max(0, Math.min(1, newX));
      newY = Math.max(0, Math.min(1, newY));

      addDataToBoxes(boxIndex, startBox, newX - startBox.x, newY - startBox.y);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleAddBox = (e: React.MouseEvent) => {
    if (!pageRef.current) return;
    if (boxes.find((b) => b.label === selectedLabel)) return;

    const rect = pageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const newBox: DraggableBox = {
      id: Date.now().toString(),
      label: selectedLabel,
      x,
      y,
    };

    onAddBox(pageNumber, newBox);
  };

  return (
    <Paper
      sx={{
        p: 3,
        width: "100%",
        maxWidth: 900,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <PdfToolbar
        labels={labels}
        selectedLabel={selectedLabel}
        setSelectedLabel={setSelectedLabel}
        pageNumber={pageNumber}
        numPages={numPages}
        goToPrevPage={goToPrevPage}
        goToNextPage={goToNextPage}
        handleUpload={handleUpload}
        boxes={boxes}
      />

      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}

      <Box
        ref={pageRef}
        onClick={handleAddBox}
        sx={{
          cursor: cursorStyle,
          width: "100%",
          overflow: "hidden",
          border: "2px solid",
          borderColor: "primary.main",
          borderRadius: 1,
          position: "relative",
        }}
      >
        <Document
          file={file}
          onLoadError={(err) => console.error("Error loading PDF:", err)}
          onLoadSuccess={onLoadSuccess}
        >
          <Page
            pageNumber={pageNumber}
            width={containerWidth} // <-- dynamically set width
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>

        {boxes.map((box) => (
          <Box
            key={box.id}
            onMouseDown={(e) => handleDrag(e, box.id)}
            sx={{
              position: "absolute",
              top: `${box.y * pageRef.current!.getBoundingClientRect().height}px`,
              left: `${box.x * pageRef.current!.getBoundingClientRect().width}px`,
              px: 1,
              py: 0.5,
              fontSize: "0.75rem",
              cursor: "move",
              border: `2px solid ${LABEL_AND_COLORS[box.label] || "#000"}`,
              backgroundColor: `${LABEL_AND_COLORS[box.label] || "#000"}33`,
              color: LABEL_AND_COLORS[box.label] || "#000",
              borderRadius: 0.5,
            }}
          >
            {box.label}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default PdfAnnotationMarker;
