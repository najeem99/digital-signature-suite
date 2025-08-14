import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
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

const SignerDashboard: React.FC = () => {
  const [pending, setPending] = useState<PdfFile[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchPdfs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("v1/docs");
      const pdfs: PdfFile[] = res.data;

      setPending(pdfs.filter((p) => p.status === "WAITING_FOR_SIGNER"));
    } catch (err) {
      console.error("Error fetching PDFs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPdf = (pdf: PdfFile) => {
    navigate(`/sign-pdf/${pdf.id}`);
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  const renderPdfSection = (title: string, pdfs: PdfFile[]) => (
    <Card sx={{ mb: 4, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
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
          Signer Dashboard
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container direction="column" spacing={2}>
            <Grid item>{renderPdfSection("Pending for Signature", pending)}</Grid>
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default SignerDashboard;
