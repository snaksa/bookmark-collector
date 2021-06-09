import React from "react";
import { Box, Grid, Snackbar } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import useStyle from "./styles";
import Header from "../../organisms/header/header";
import Sidebar from "../../organisms/sidebar/sidebar";
import { useNotification } from "../../../hooks/useNotifications";
import { Alert } from "@material-ui/lab";

interface SidebarOptionProps {
  screen: JSX.Element;
}

export default function PrivateRoute({
  screen,
}: SidebarOptionProps): JSX.Element {
  const classes = useStyle();

  const { open, message, onClose } = useNotification();

  return (
    <Box className={classes.root}>
      <Header />
      <Container maxWidth="lg">
        <Grid container direction="row" spacing={8}>
          <Grid item md={2} lg={2}>
            <Sidebar />
          </Grid>
          <Grid item md={10} lg={10}>
            {screen}
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={onClose}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Alert onClose={onClose} severity="error">
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
