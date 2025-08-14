// PdfViewer.tsx
import React, { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Box, Button, Stack, CircularProgress } from "@mui/material";
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

interface PdfUrlViewerProps {
  fileUrl: string;
  width?: number; // optional page width
}

const PdfUrlViewer: React.FC<PdfUrlViewerProps> = ({ fileUrl, width = 600 }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
  };

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, numPages));

  return (
    <Box sx={{ display: "inline-block", position: "relative" }}>
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<CircularProgress />}
      >
        <Page
          pageNumber={currentPage}
          width={width}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>

      <Stack
        direction="row"
        spacing={2}
        sx={{ mt: 2 }}
        justifyContent="center"
        alignItems="center"
      >
        <Button variant="contained" onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous Page
        </Button>
        <Box>
          Page {currentPage} of {numPages}
        </Box>
        <Button variant="contained" onClick={handleNextPage} disabled={currentPage === numPages}>
          Next Page
        </Button>
      </Stack>

    </Box>
  );
};

export default PdfUrlViewer;
