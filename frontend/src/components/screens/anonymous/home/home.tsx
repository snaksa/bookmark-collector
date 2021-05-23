import React from "react";
import { Container, Grid } from "@material-ui/core";
import { NavLink } from "react-router-dom";

export default function HomeScreen(): JSX.Element {
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
