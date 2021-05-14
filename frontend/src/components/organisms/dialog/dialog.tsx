import React from "react";
import {
  Button,
  Dialog as MaterialDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import useStyles from "./styles";

export default function Dialog({
  handleClose,
  actions,
  children,
  title,
  open,
}: any) {
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
        {actions.map((button: any) => (
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
