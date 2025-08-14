import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import axiosInstance from "../../api/axiosInstance";

interface DraggableBox {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface ConfirmBoxesDialogProps {
  open: boolean;
  boxesPerPage: Record<number, DraggableBox[]>;
  onClose: () => void;
  onConfirm: (assignedUserId: string) => void;
}

interface Signer {
  id: string;
  name: string;
  email: string;
}

const ConfirmBoxesDialog: React.FC<ConfirmBoxesDialogProps> = ({
  open,
  boxesPerPage,
  onClose,
  onConfirm,
}) => {
  const [signers, setSigners] = useState<Signer[]>([]);
  const [selectedSigner, setSelectedSigner] = useState("");
  const [error, setError] = useState("");

  // Fetch signers when dialog opens
  useEffect(() => {
    if (open) {
      axiosInstance
        .get("/auth/get-users?role=signer")
        .then((res) => setSigners(res.data))
        .catch((err) => console.error("Error fetching signers:", err));
    }
  }, [open]);

  const handleConfirm = () => {
    if (!selectedSigner) {
      setError("Please select an assignee");
      return;
    }
    setError("");
    onConfirm(selectedSigner);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm Box Selections</DialogTitle>
      <DialogContent>
        {/* Assign to Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }} error={!!error}>
          <InputLabel>Assign to</InputLabel>
          <Select
            value={selectedSigner}
            onChange={(e) => {
              setSelectedSigner(e.target.value);
              setError("");
            }}
          >
            {signers.map((signer) => (
              <MenuItem key={signer.id} value={signer.id}>
                {signer.name} ({signer.email})
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>

        {/* Boxes List */}
        {Object.keys(boxesPerPage).length === 0 ? (
          <Typography>No boxes added.</Typography>
        ) : (
          <List>
            {Object.entries(boxesPerPage).map(([page, boxes]) => (
              <ListItem key={page}>
                <ListItemText
                  primary={`Page ${page}`}
                  secondary={boxes.map((b) => b.label).join(", ")}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirm}
          disabled={!selectedSigner}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmBoxesDialog;
