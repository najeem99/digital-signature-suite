// PdfToolbar.tsx
import React from "react";
import { Box, Typography, Select, MenuItem, Button } from "@mui/material";

interface PdfToolbarProps {
  labels: string[];
  selectedLabel: string;
  setSelectedLabel: (label: string) => void;
  pageNumber: number;
  numPages: number | null;
  goToPrevPage: () => void;
  goToNextPage: () => void;
  handleUpload: () => void;
  boxes: { label: string; id: string }[]; // simplified for field check
}

const PdfToolbar: React.FC<PdfToolbarProps> = ({
  labels,
  selectedLabel,
  setSelectedLabel,
  pageNumber,
  numPages,
  goToPrevPage,
  goToNextPage,
  handleUpload,
  boxes,
}) => {
  return (
    <Box className="flex flex-col md:flex-row items-center justify-between p-3 rounded shadow-md bg-gray-100 mb-4 space-y-2 md:space-y-0 w-full">
      {/* Field selection */}
      <Box className="flex items-center space-x-2  "   >
        <Typography className="font-semibold">Place Field:</Typography>
        <Select
          value={selectedLabel}
          onChange={(e) => setSelectedLabel(e.target.value)}
          size="small"
          sx={{ minWidth: 140 }}
        >
          {labels.map((label) => (
            <MenuItem key={label} value={label}>
              {label}
            </MenuItem>
          ))}
        </Select>

       </Box>

      {/* Page navigation */}
      <Box className="flex items-center space-x-2 justify-center flex-1">
        <Button
          variant="contained"
          color="primary"
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
        >
          Previous
        </Button>
        <Typography className="px-2 font-medium">
          Page {pageNumber} of {numPages}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={goToNextPage}
          disabled={numPages ? pageNumber >= numPages : true}
        >
          Next
        </Button>
      </Box>

      {/* Upload button */}
      <Box>
        <Button onClick={handleUpload} variant="contained" color="primary">
          Upload
        </Button>
      </Box>
    </Box>
  );
};

export default PdfToolbar;
