import React from "react";
import { Grid } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { NavLink } from "react-router-dom";

export default function HomeScreen() {
  return (
    <Container>
      <Grid container>
        <Grid item>
          <NavLink to={"/login"} exact>
            Login
          </NavLink>
        </Grid>
        <Grid item>
          <NavLink to={"/signup"} exact>
            SignUp
          </NavLink>
        </Grid>
      </Grid>
    </Container>
  );
}
