// PdfViewerWithToolbar.tsx
import React from "react";
import { Document, Page } from "react-pdf";
import { Box, CircularProgress } from "@mui/material";
import PdfToolbar from "./PdfToolbar";
import type { OnDocumentLoadSuccess } from "react-pdf/dist/shared/types.js";

interface DraggableBox {
    id: string;
    label: string;
    x: number;
    y: number;
}

interface PdfViewerWithToolbarProps {
    file: File | null;
    pageNumber: number;
    numPages: number | null;
    pageWidth: number;
    boxes: DraggableBox[];
    cursorStyle: string;
    labels: string[];
    selectedLabel: string;
    loading: boolean;
    pageRef: React.RefObject<HTMLDivElement>;
    goToPrevPage: () => void;
    goToNextPage: () => void;
    handleAddBox: (e: React.MouseEvent) => void;
    handleDrag: (e: React.MouseEvent, id: string) => void;
    setSelectedLabel: (label: string) => void;
    handleUpload: () => void;
    onLoadSuccess: (data:OnDocumentLoadSuccess) => void;
}

const PdfViewerWithToolbar: React.FC<PdfViewerWithToolbarProps> = ({
    file,
    pageNumber,
    numPages,
    pageWidth,
    boxes,
    cursorStyle,
    labels,
    selectedLabel,
    loading,
    pageRef,
    goToPrevPage,
    goToNextPage,
    handleAddBox,
    handleDrag,
    setSelectedLabel,
    handleUpload,
    onLoadSuccess
}) => {
    if (!file) return null;

    // Define static colors per label
    const labelColors: Record<string, string> = {
        "sign here": "#1E88E5", // blue
        "name": "#43A047",      // green
        "date": "#F4511E",      // orange
        // add more labels if needed
    };

    return (
        <Box className="mt-4 w-full">
            {/* Toolbar */}
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

            {/* PDF Viewer */}
            {loading && (
                <Box className="flex justify-center items-center mb-2">
                    <CircularProgress />
                </Box>
            )}

            <Box
                ref={pageRef}
                className="relative inline-block"
                onClick={handleAddBox}
                style={{ cursor: cursorStyle }}
            >
                <Document
                    file={file}
                    onLoadError={(err) => console.error("Error loading PDF:", err)}
                    onLoadSuccess={onLoadSuccess}

                >
                    <Page
                        pageNumber={pageNumber}
                        width={pageWidth}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                    />
                </Document>

                {boxes.map((box) => (
                    <Box
                        key={box.id}
                        onMouseDown={(e) => handleDrag(e, box.id)}
                        className="absolute px-1 py-0.5 text-xs cursor-move"
                        style={{
                            top: box.y,
                            left: box.x,
                            border: `2px solid ${labelColors[box.label] || "#000"}`,
                            backgroundColor: `${labelColors[box.label] || "#000"}33`, // translucent bg
                            color: labelColors[box.label] || "#000",
                        }}
                    >
                        {box.label}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default PdfViewerWithToolbar;
