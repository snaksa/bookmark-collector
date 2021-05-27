import React from "react";
import {
  Button,
  Dialog as MaterialDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import useStyles from "./styles";

interface DialogProps {
  handleClose: (event: Record<string, unknown>, reason: string) => void;
  // eslint-disable-next-line
  actions: { title: string; action: (...args: any[]) => void }[];
  children: React.ReactNode;
  title: string;
  open: boolean;
}

export default function Dialog({
  handleClose,
  actions,
  children,
  title,
  open,
}: DialogProps): JSX.Element {
  const classes = useStyles();

  return (
    <MaterialDialog
      fullWidth={true}
      maxWidth="sm"
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      classes={{ paper: classes.main, scrollPaper: classes.scrollPaper }}
    >
      <DialogTitle id="customized-dialog-title">{title}</DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions classes={{ spacing: classes.actions }}>
        {actions.map((button) => (
          <Button
            key={button.title}
            autoFocus
            onClick={button.action}
            color="primary"
            variant="contained"
          >
            {button.title}
          </Button>
        ))}
      </DialogActions>
    </MaterialDialog>
  );
}
