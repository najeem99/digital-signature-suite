import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import PdfThumbnail from "../components/shared/PdfThumbnail";

interface PdfFile {
  id: number;
  fileName: string;
  url: string;
  public_id: string;
  status: string;
  createdAt: string;
  user: { id: number; name: string };
  assignedTo: { id: number; name: string } | null;
}

const UploaderDashboard: React.FC = () => {
  const [pending, setPending] = useState<PdfFile[]>([]);
  const [signed, setSigned] = useState<PdfFile[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchPdfs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("v1/docs");
      const pdfs: PdfFile[] = res.data;

      setPending(pdfs.filter((p) => p.status === "WAITING_FOR_SIGNER"));
      setSigned(pdfs.filter((p) => p.status === "ACCEPTED"));
    } catch (err) {
      console.error("Error fetching PDFs:", err);
    } finally {
      setLoading(false);
    }
  };

  const onSelectPdf = (data: PdfFile) => {
    console.log("Selected PDF:", data);
    // navigate(`/pdf-marker/${data.id}`)
  }
  useEffect(() => {
    fetchPdfs();
  }, []);

  const renderPdfGrid = (pdfs: PdfFile[]) => (
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
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 6,
              },
            }}
            onClick={() => onSelectPdf(pdf) }
          >
            <PdfThumbnail url={pdf.url} width={150} />
            <Typography variant="subtitle1" fontWeight="bold" align="center">
              {pdf.fileName}
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

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Uploader Dashboard
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box mb={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Pending for Signature
            </Typography>
            {pending.length > 0 ? renderPdfGrid(pending) : <Typography>No pending documents.</Typography>}
          </Box>

          <Box mb={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Signed Documents
            </Typography>
            {signed.length > 0 ? renderPdfGrid(signed) : <Typography>No signed documents.</Typography>}
          </Box>
        </>
      )}
    </Container>
  );
};

export default UploaderDashboard;
