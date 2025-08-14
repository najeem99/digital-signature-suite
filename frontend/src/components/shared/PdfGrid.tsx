import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import PdfThumbnail from "./PdfThumbnail";
  
export interface PdfFile {
    id: number;
    fileName: string;
    url: string;
    public_id: string;
    status: string;
    createdAt: string;
    user: { id: number; name: string };
    assignedTo: { id: number; name: string } | null;
}

interface PdfGridProps {
  pdfs: PdfFile[];
  onSelect?: (pdf: PdfFile) => void; // Optional click handler
  truncateLength?: number; // Optional truncate length (default: 50)
}

export const PdfGrid: React.FC<PdfGridProps> = ({
  pdfs,
  onSelect,
  truncateLength = 50,
}) => {
  const truncate = (str: string, max = truncateLength) =>
    str.length > max ? `${str.slice(0, max - 3)}...` : str;

  return (
    <Grid container spacing={2}>
      {pdfs.map((pdf) => (
        <Grid item xs={12} sm={6} md={4} key={pdf.id}>
          <Paper
            sx={{
              p: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              cursor: onSelect ? "pointer" : "default",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": onSelect
                ? {
                    transform: "scale(1.05)",
                    boxShadow: 6,
                  }
                : {},
            }}
            onClick={onSelect ? () => onSelect(pdf) : undefined}
          >
            <PdfThumbnail url={pdf.url} width={150} />
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              align="center"
              title={pdf.fileName}
            >
              {truncate(pdf.fileName, truncateLength)}
            </Typography>
            <Typography variant="body2" align="center">
              Uploaded by: {pdf.user.name}
            </Typography>
            <Typography variant="body2" align="center">
              Status: <strong>{pdf.status}</strong>
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default PdfGrid;
