import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import Layout from "../components/Layout";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const PdfViewer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageWidth, setPageWidth] = useState<number>(800);
  const [loading, setLoading] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPageNumber(1);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onPageRenderStart = () => setLoading(true);
  const onPageRenderSuccess = () => setLoading(false);

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setPageNumber((prev) => (numPages ? Math.min(prev + 1, numPages) : prev));

  // Responsive PDF width
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setPageWidth(containerRef.current.offsetWidth - 20); // 20px padding
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout>
    <Box
      ref={containerRef}
      className="flex flex-col items-center p-4 w-full min-h-screen"
    >
      <input
        type="file"
        accept="application/pdf"
        onChange={onFileChange}
        className="mb-4 p-2 border rounded"
      />

      {file && (
        <Box className="mt-4 text-center w-full">
          {loading && (
            <Box className="flex justify-center items-center mb-2">
              <CircularProgress />
            </Box>
          )}

          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(err) => console.error("Error loading PDF:", err)}
          >
            <Page
              pageNumber={pageNumber}
              width={pageWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              onRenderSuccess={onPageRenderSuccess}
              onRenderError={(err) => console.error(err)}
              onRenderLoading={onPageRenderStart}
            />
          </Document>

          <Box className="mt-2 flex items-center justify-center space-x-2">
            <Button
              variant="contained"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
            >
              Previous
            </Button>
            <Typography>
              Page {pageNumber} of {numPages}
            </Typography>
            <Button
              variant="contained"
              onClick={goToNextPage}
              disabled={numPages ? pageNumber >= numPages : true}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}
    </Box>
    </Layout>
  );
};

export default PdfViewer;
