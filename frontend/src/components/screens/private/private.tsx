import React from "react";
import { Box, Grid } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import useStyle from "./styles";
import Header from "../../organisms/header/header";
import Sidebar from "../../organisms/sidebar/sidebar";

export default function SidebarOption({ screen }: any) {
  const classes = useStyle();

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
    </Box>
  );
}
