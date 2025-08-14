// PdfViewerWithToolbar.tsx
import React from "react";
import { Document, Page } from "react-pdf";
import { Box, Button, Typography, CircularProgress, Select, MenuItem } from "@mui/material";
import PdfToolbar from "./PdfToolbar";

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
}) => {
    if (!file) return null;

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
                        className="absolute border-2 border-blue-500 bg-blue-200/30 px-1 py-0.5 text-xs cursor-move"
                        style={{ top: box.y, left: box.x }}
                    >
                        {box.label}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default PdfViewerWithToolbar;
