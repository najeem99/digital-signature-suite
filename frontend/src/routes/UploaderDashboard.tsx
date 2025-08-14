import React, { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress, Grid, Card, CardContent, Alert, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import PdfGrid from "../components/shared/PdfGrid";
import Layout from "../components/Layout";

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

const UploaderDashboard: React.FC = () => {
  const [pending, setPending] = useState<PdfFile[]>([]);
  const [waitingApproval, setWaitingApproval] = useState<PdfFile[]>([]);
  const [rejected, setRejected] = useState<PdfFile[]>([]);
  const [accepted, setAccepted] = useState<PdfFile[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchPdfs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("v1/docs");
      const pdfs: PdfFile[] = res.data;

      setPending(pdfs.filter((p) => p.status === "WAITING_FOR_SIGNER"));
      setWaitingApproval(pdfs.filter((p) => p.status === "WAITING_FOR_APPROVAL"));
      setRejected(pdfs.filter((p) => p.status === "REJECTED"));
      setAccepted(pdfs.filter((p) => p.status === "ACCEPTED"));
    } catch (err) {
      console.error("Error fetching PDFs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPdf = (pdf: PdfFile) => {
    if (pdf.status === "WAITING_FOR_APPROVAL") {
      navigate(`/review-pdf/${pdf.id}`);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

const renderPdfSection = (title: string, pdfs: PdfFile[], isPending = false) => (
  <Card sx={{ mb: 4, boxShadow: 3 }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
        {/* Only show the button for Pending section */}
        {title == 'Pending for Signature' && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/pdf-sign-marker")}
          >
            Add New Doc
          </Button>
        )}
      </Box>

      {pdfs.length > 0 ? (
        <PdfGrid pdfs={pdfs} onSelect={handleSelectPdf} truncateLength={25} />
      ) : (
        <Alert severity="info">No {title.toLowerCase()}.</Alert>
      )}
    </CardContent>
  </Card>
);


  return (
    <Layout>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Uploader Dashboard
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container direction="column" spacing={2}>
            <Grid item>{renderPdfSection("Pending for Signature", pending)}</Grid>
            <Grid item>{renderPdfSection("Waiting for Approval", waitingApproval)}</Grid>
            <Grid item>{renderPdfSection("Rejected Documents", rejected)}</Grid>
            <Grid item>{renderPdfSection("Approved Documents", accepted)}</Grid>
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default UploaderDashboard;
