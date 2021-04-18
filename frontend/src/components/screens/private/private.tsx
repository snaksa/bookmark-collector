import React from 'react';
import {Box, Grid, Button, Typography} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import {useHistory} from "react-router";
import {useAuth} from "../../../hooks/useAuth";
import Sidebar from "./sidebar/sidebar";
import useStyle from './styles';

export default function SidebarOption({screen}: any) {
  const classes = useStyle();
  const {onLogout} = useAuth();
  const history = useHistory();

  const logout = () => {
    onLogout();
    history.push('/login');
  }

  return (
    <Box className={classes.main}>
      <Container maxWidth='lg'>
        <Typography color='primary'>Logged</Typography>
        <Button onClick={logout}>Log Out</Button>
        <Grid container direction='row' spacing={8}>
          <Grid item>
            <Sidebar/>
          </Grid>
          <Grid item>
            {screen}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}