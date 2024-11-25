// src/components/reusable/SharedDialog.tsx
import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

interface SharedDialogProps {
  open: boolean;
  title: string;
  content: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

const SharedDialog: React.FC<SharedDialogProps> = ({
  open,
  title,
  content,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="dialog-title">
      <DialogTitle id="dialog-title">{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color="secondary">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SharedDialog;
