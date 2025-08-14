import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

// Pages
import Welcome from "./welcome/welcome";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Home from "./routes/Home";
import PdfViewer from "./routes/PdfViewer";
import PdfSignatureMarker from "./routes/PdfSignatureMarker";
import UploaderDashboard from "./routes/UploaderDashboard";
import SignerDashboard from "./routes/SignerDashboard";
import PdfSignerPage from "./routes/PdfSigner";
import ReviewSignedDocuments from "./routes/ReviewSignedDocuments";
export default function AppRoutes() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Welcome />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/home" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/home" />}
        />

        {/* Protected Route */}
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/view-pdf"
          element={user ? <PdfViewer /> : <Navigate to="/login" />}
        />
        <Route
          path="/pdf-sign-marker"
          element={user ? <PdfSignatureMarker /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard-uploader"
          element={user ? <UploaderDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard-signer"
          element={user ? <SignerDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/sign-pdf/:id"
          element={user ? <PdfSignerPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/review-pdf/:id"
          element={user ? <ReviewSignedDocuments /> : <Navigate to="/login" />}
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
