import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import PdfGrid from "../components/shared/PdfGrid";
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
      // setSigned(pdfs.filter((p) => p.status === "ACCEPTED")); // if needed later
    } catch (err) {
      console.error("Error fetching PDFs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPdf = (pdf: PdfFile) => {
    console.log("Selected PDF:", pdf);
    navigate(`/sign-pdf/${pdf.id}`);
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Signer Dashboard
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
            {pending.length > 0 ? (
              <PdfGrid
                pdfs={pending}
                onSelect={handleSelectPdf}
                truncateLength={20}
              />
            ) : (
              <Typography>No pending documents.</Typography>
            )}
          </Box>
        </>
      )}
    </Container>
  );
};

export default SignerDashboard;
