import React, { useEffect, useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, rgb } from "pdf-lib";
import { Box, Button, CircularProgress, Stack } from "@mui/material";
import axiosInstance from "../../api/axiosInstance";
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { saveAs } from "file-saver";
import { LABEL_AND_COLORS } from "../../constants/labelColors"; // Assuming you have a constants file for label colors

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

interface PdfSignerProps {
  fileUrl: string;
  fileName: string;
  onUploadSuccess?: () => void;
  signMarking?: Record<string, { x: number; y: number; id: string; label: string }[]>; // from API
  currentUserId?: string; // assigned signer ID
  onUploadPdf: (blob: Blob) => void;
}

interface Stroke {
  x: number;
  y: number;
}



const PdfScribbler: React.FC<PdfSignerProps> = ({ fileUrl, fileName, onUploadSuccess, signMarking, onUploadPdf }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [strokes, setStrokes] = useState<Record<number, Stroke[][]>>({});
  const [drawing, setDrawing] = useState<Stroke[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 600, height: 800 });

  useEffect(() => {
    console.log("signMarking changed:", signMarking);

  }, [signMarking])


  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDrawing([{ x: e.clientX - rect.left, y: e.clientY - rect.top }]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (drawing.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setDrawing([...drawing, { x: e.clientX - rect.left, y: e.clientY - rect.top }]);
  };

  const handleMouseUp = () => {
    if (!drawing.length) return;
    setStrokes({
      ...strokes,
      [currentPage]: [...(strokes[currentPage] || []), drawing],
    });
    setDrawing([]);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw existing strokes
    Object.entries(strokes).forEach(([pageStr, pageStrokes]) => {
      if (Number(pageStr) !== currentPage) return;
      pageStrokes.forEach(stroke => {
        ctx.beginPath();
        stroke.forEach((point, i) => {
          if (i === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    });

    // Draw current stroke
    if (drawing.length) {
      ctx.beginPath();
      drawing.forEach((point, i) => {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  useEffect(drawCanvas, [drawing, strokes, currentPage, pdfDimensions]);

  const generatePdf = async () => {
    setLoading(true);
    try {
      const existingPdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();

      for (const [pageStr, pageStrokes] of Object.entries(strokes)) {
        const pageIndex = Number(pageStr) - 1;
        const page = pages[pageIndex];
        const { width, height } = page.getSize();

        for (const stroke of pageStrokes) {
          const svgPoints = stroke.map(p => [
            p.x / pdfDimensions.width * width,
            (pdfDimensions.height - p.y) / pdfDimensions.height * height
          ]);

          for (let i = 1; i < svgPoints.length; i++) {
            const [x1, y1] = svgPoints[i - 1];
            const [x2, y2] = svgPoints[i];
            page.drawLine({
              start: { x: x1, y: y1 },
              end: { x: x2, y: y2 },
              thickness: 2,
              color: rgb(1, 0, 0)
            });
          }
        }

        // Add automatic labels like date
        signMarking?.[Number(pageStr)]?.forEach((mark) => {
          let text = mark.label;

          // If it's a "date" label, insert today's date
          if (mark.label?.toLowerCase() === "date") {
            text = new Date().toLocaleDateString("en-GB"); // DD/MM/YYYY
            // normalized 0-1 coordinates
            const xPos = mark.x * width;   // width = PDF page width in points
            const yPos = (0.99 - mark.y) * height; // flip Y axis

            // Log in a structured way for ChatGPT
            console.log(JSON.stringify({
              label: mark.label,
              originalX: mark.x,
              originalY: mark.y,
              pdfWidth: pdfDimensions.width,
              pdfHeight: pdfDimensions.height,
              calculatedX: xPos,
              calculatedY: yPos
            }, null, 2));

            page.drawText(text, {
              x: xPos,
              y: yPos,
              size: 12,
              color: rgb(0, 0, 0), // black text
            });
          }


        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      // Save locally for testing
      // saveAs(blob, `signed-${fileName}`);

      onUploadPdf(blob);

    } catch (err) {
      console.error(err);
      console.error("Error generating/uploading PDF");
    } finally {
      setLoading(false);
    }
  };


  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, numPages));

  return (
    <Box ref={containerRef} sx={{ position: "relative", display: "inline-block" }}>
      {/* PDF Document */}
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<CircularProgress />}
      >
        <Page
          pageNumber={currentPage}
          width={pdfDimensions.width}
          onRenderSuccess={({ width, height }) => {
            console.log("Page rendered:", currentPage, "Width:", width, "Height:", height);
            setPdfDimensions({ width, height });
          }}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>

      {/* Canvas overlay */}
      <canvas
        ref={canvasRef}
        width={pdfDimensions.width}
        height={pdfDimensions.height}
        style={{
          border: "2px solid #000", // match PdfViewerWithToolbar
          position: "absolute",
          top: 0,
          left: 0,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />


      {/* Sign Marking Overlays */}
      {pdfDimensions && signMarking?.[currentPage]?.map((mark) => {
        // mark.x and mark.y are normalized (0 to 1) relative to original PDF size
        const left = mark.x * pdfDimensions.width;
        const top = mark.y * pdfDimensions.height;;
        // Pick color based on label; fallback to grey if not found
        const color = LABEL_AND_COLORS[mark.label?.toLowerCase()] || "#9E9E9E";

        // Automatically fill "date" label with today's date
        const displayText =
          mark.label?.toLowerCase() === "date"
            ? new Date().toLocaleDateString("en-GB") // DD/MM/YYYY format
            : mark.label;

        return (
          <div
            key={mark.id}
            style={{
              position: "absolute",
              left: `${left}px`,
              top: `${top}px`,
              width: "unset",
              height: "20px",
              border: `2px dashed ${color}`,
              backgroundColor: `${color}1A`, // translucent background
              pointerEvents: "none",
              display: "flex",
              opacity: 0.8,
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              color: color,
              fontWeight: "bold",
            }}
          >
            {displayText}
          </div>
        );
      })}



      {/* Navigation & Save */}
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handlePrevPage} disabled={currentPage === 1}>Previous Page</Button>
        <Button variant="contained" onClick={handleNextPage} disabled={currentPage === numPages}>Next Page</Button>
        <Button variant="contained" color="primary" onClick={generatePdf} disabled={loading || Object.keys(strokes).length === 0}>
          {loading ? "Processing..." : "Save & Upload PDF"}
        </Button>
      </Stack>
    </Box>
  );
};

export default PdfScribbler;
