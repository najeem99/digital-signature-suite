// components/SuccessDialog.tsx
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface SuccessDialogProps {
  open: boolean;
  message: string;
  onClose?: () => void;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ open, message, onClose }) => {
  const navigate = useNavigate();

  const handleOk = () => {
    if (onClose) onClose();
    navigate("/home"); // redirect to home
  };

  return (
    <Dialog open={open} onClose={handleOk}>
      <DialogTitle>Success</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOk} variant="contained" color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessDialog;
