import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { CircularProgress, Box } from "@mui/material";
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

interface PdfThumbnailProps {
  url: string;
  width?: number;
}

const PdfThumbnail: React.FC<PdfThumbnailProps> = ({ url, width = 120 }) => {
  return (
    <Box sx={{ border: "1px solid #ccc", mr: 2 }}>
      <Document file={url} loading={<CircularProgress />}>
        <Page
          pageNumber={1}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          width={width}
        />
      </Document>
    </Box>
  );
};

export default PdfThumbnail;
