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
  Box,
  Avatar,
  Divider,
} from "@mui/material";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
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
      {/* Dialog Header */}
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar sx={{ bgcolor: "primary.main" }}>
          <AssignmentIndIcon />
        </Avatar>
        <Typography variant="h6">Review & Assign Signature Fields</Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Assign the selected fields to a signer and review the box placement before confirming.
        </Typography>

        {/* Assign to Dropdown */}
        <FormControl fullWidth sx={{ mb: 3 }} error={!!error}>
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

        <Divider sx={{ my: 2 }} />

        {/* Boxes List */}
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Selected Fields
        </Typography>

        {Object.keys(boxesPerPage).length === 0 ? (
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "grey.100",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No boxes have been added yet.
            </Typography>
          </Box>
        ) : (
          <List>
            {Object.entries(boxesPerPage).map(([page, boxes]) => (
              <ListItem key={page} sx={{ borderBottom: "1px solid #eee" }}>
                <ListItemText
                  primary={`Page ${page}`}
                  secondary={boxes.map((b) => b.label).join(", ")}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirm}
          disabled={!selectedSigner}
        >
          Confirm & Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmBoxesDialog;
