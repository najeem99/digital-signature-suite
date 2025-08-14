import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1A73E8",
      light: "#4A90F2",
      dark: "#0F4C81",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#F2994A",
      light: "#F5B36C",
      dark: "#B2632B",
      contrastText: "#ffffff",
    },
    success: {
      main: "#27AE60",
      light: "#6FCF97",
      dark: "#1F7A46",
      contrastText: "#ffffff",
    },
    error: {
      main: "#EB5757",
      light: "#FF7B7B",
      dark: "#B22222",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#F2C94C",
      light: "#F5D15C",
      dark: "#B2912D",
      contrastText: "#000000",
    },
    info: {
      main: "#2D9CDB",
      light: "#56B4F0",
      dark: "#176FA0",
      contrastText: "#ffffff",
    },
    background: {
      default: "#F9FAFB",
      paper: "#ffffff",
    },
    text: {
      primary: "#2E2E2E",
      secondary: "#616161",
      disabled: "#9E9E9E",
    },
    divider: "rgba(0, 0, 0, 0.12)",
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif", // changed font
    h1: { fontWeight: 700, color: "#1A73E8" },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 500 },
    body1: { color: "#2E2E2E" },
    body2: { color: "#616161" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          padding: "8px 20px",
          fontWeight: 500,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            transform: "translateY(-2px)",
          },
        },
        containedPrimary: {
          background: "#1A73E8",
          color: "#fff",
          "&:hover": {
            background: "#0F4C81",
          },
        },
        containedSecondary: {
          background: "#F2994A",
          color: "#fff",
          "&:hover": {
            background: "#B2632B",
          },
        },
        outlinedPrimary: {
          borderColor: "#1A73E8",
          color: "#1A73E8",
          "&:hover": {
            background: "#E3F2FD",
          },
        },
        outlinedSecondary: {
          borderColor: "#F2994A",
          color: "#F2994A",
          "&:hover": {
            background: "#FFF4E6",
          },
        },
      },
    },
  },
});

export default theme;
