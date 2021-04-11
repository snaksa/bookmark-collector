import React from 'react';
import {Grid, Button} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import {NavLink} from 'react-router-dom';
import {useAuth} from "../../../hooks/useAuth";
import {useHistory} from "react-router";

export default function HomeScreen() {
  const {isAuthenticated, onLogout} = useAuth();
  const history = useHistory();
  console.log('isAuth', isAuthenticated);

  const logout = () => {
    onLogout();
    history.push('/login');
  }

  return (
    <Container>
      {
        isAuthenticated && <Grid container direction='column'>
          <Grid item>Authenticated</Grid>
          <Grid item><Button onClick={logout}>Log Out</Button></Grid>
        </Grid>
      }

      {
        !isAuthenticated && <Grid container direction="column">
          <Grid item>
            <NavLink to={'/login'} exact>Login</NavLink>
          </Grid>
          <Grid item>
            <NavLink to={'/signup'} exact>SignUp</NavLink>
          </Grid>
        </Grid>
      }
    </Container>
  );
}