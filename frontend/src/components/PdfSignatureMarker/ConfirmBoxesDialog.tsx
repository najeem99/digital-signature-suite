// ConfirmBoxesDialog.tsx
import React from "react";
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
} from "@mui/material";

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
  onConfirm: () => void;
}

const ConfirmBoxesDialog: React.FC<ConfirmBoxesDialogProps> = ({
  open,
  boxesPerPage,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm Box Selections</DialogTitle>
      <DialogContent>
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
        <Button variant="contained" color="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmBoxesDialog;
