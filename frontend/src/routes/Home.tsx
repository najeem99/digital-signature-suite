import React from "react";
import { useAuthStore } from "../store/authStore";
import Layout from "../components/Layout";
import { Box, Typography, Grid, Card, Avatar } from "@mui/material";
import UploadIcon from "@mui/icons-material/UploadFile";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReviewIcon from "@mui/icons-material/RateReview";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";

const roleResponsibilities: Record<string, { task: string; icon: React.ReactNode }[]> = {
  uploader: [
    { task: "Upload new PDF documents", icon: <UploadIcon /> },
    { task: "Track PDF statuses", icon: <TrackChangesIcon /> },
    { task: "Assign documents to signers", icon: <AssignmentIcon /> },
    { task: "Review rejected/approved PDFs", icon: <ReviewIcon /> },
  ],
  signer: [
    { task: "Sign assigned PDF documents", icon: <HowToRegIcon /> },
    { task: "Make sure everything is Correct", icon: <CheckCircleIcon /> },
   ],
};

const Home: React.FC = () => {
  const { user } = useAuthStore();
  if (!user) return null;

  const responsibilities = roleResponsibilities[user.role] || [];

  return (
    <Layout>
      {/* Animated Mid Background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          overflow: "hidden",
          background: "radial-gradient(circle at 30% 30%, #E3F2FD, transparent 70%), radial-gradient(circle at 70% 70%, #FCE4EC, transparent 70%)",
          animation: "bgMove 20s infinite alternate",
        }}
      />
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          mt: 6,
          px: 2,
          gap: 4,
          position: "relative",
        }}
      >
        {/* Welcome Header */}
        <Box textAlign="center">
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Welcome, {user.name}!
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Role: <strong>{user.role.toUpperCase()}</strong>
          </Typography>
        </Box>

        {/* Responsibilities Section */}
        <Box sx={{ width: "100%", maxWidth: 1000 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Your Responsibilities
          </Typography>
          <Grid container spacing={3} justifyContent="center" alignItems="stretch">
            {responsibilities.map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx} display="flex">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  style={{ width: "100%" }}
                >
                  <Card
                    sx={{
                      flexGrow: 1,
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      borderRadius: 3,
                      background: "#e0e0e0",
                      boxShadow: "9px 9px 16px #bebebe, -9px -9px 16px #ffffff",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "6px 6px 12px #bebebe, -6px -6px 12px #ffffff",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "primary.light",
                        width: 56,
                        height: 56,
                        mb: 2,
                      }}
                    >
                      {item.icon}
                    </Avatar>
                    <Typography variant="body1" fontWeight="medium">
                      {item.task}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Background animation CSS */}
      <style>{`
        @keyframes bgMove {
          0% { background-position: 0% 0%, 100% 100%; }
          50% { background-position: 50% 50%, 50% 50%; }
          100% { background-position: 100% 100%, 0% 0%; }
        }
      `}</style>
    </Layout>
  );
};

export default Home;
