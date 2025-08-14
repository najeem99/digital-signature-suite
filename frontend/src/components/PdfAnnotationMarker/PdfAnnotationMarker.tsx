// PdfViewerWithToolbar.tsx
import React from "react";
import { Document, Page } from "react-pdf";
import { Box, CircularProgress } from "@mui/material";
import PdfToolbar from "./PdfToolbar";
import type { OnDocumentLoadSuccess } from "react-pdf/dist/shared/types.js";
import { LABEL_AND_COLORS } from "../../constants/labelColors"; // Assuming you have a constants file for label colors

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
    pageWidth: number;
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
    onAddBox: (pageNumber: number, newBox: DraggableBox) => void; // callback to add box
}

const PdfAnnotationMarker: React.FC<PdfAnnotationMarkerProps> = ({
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
    addDataToBoxes,
    setSelectedLabel,
    handleUpload,
    onLoadSuccess,
    onAddBox, // <-- new callback from parent

}) => {
    if (!file) return null;


    // Drag logic
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

            // Calculate proposed new position
            let newX = startBox.x + dx;
            let newY = startBox.y + dy;

            // Assuming a fixed box size (you can store width/height in box if needed)
            const boxWidth = 80;   // px (adjust as per your draggable box)
            const boxHeight = 30;  // px

            // Clamp to keep inside PDF boundaries
            if (newX < 0) newX = 0;
            if (newY < 0) newY = 0;
            if (newX + boxWidth > rect.width) newX = rect.width - boxWidth;
            if (newY + boxHeight > rect.height) newY = rect.height - boxHeight;

            // Update position with clamped values
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

        if (boxes.find((b) => b.label === selectedLabel)) {
            console.log(`Box for "${selectedLabel}" already exists on this page.`);
            return;
        }

        const rect = pageRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newBox: DraggableBox = {
            id: Date.now().toString(),
            label: selectedLabel,
            x,
            y
        };

        onAddBox(pageNumber, newBox); // tell parent to update state
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
                style={{
                    cursor: cursorStyle,
                    border: "2px solid #2196F3", // visible border around PDF
                    borderRadius: "4px",
                    overflow: "hidden", // ensures boxes can't visually go out
                }}
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
                            border: `2px solid ${LABEL_AND_COLORS[box.label] || "#000"}`,
                            backgroundColor: `${LABEL_AND_COLORS[box.label] || "#000"}33`, // translucent bg
                            color: LABEL_AND_COLORS[box.label] || "#000",
                        }}
                    >
                        {box.label}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default PdfAnnotationMarker;
