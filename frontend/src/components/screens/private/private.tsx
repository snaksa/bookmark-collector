import React, {useState} from 'react';
import {Box, Grid, Button, IconButton, TextField, InputAdornment} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import {useHistory} from "react-router";
import {useAuth} from "../../../hooks/useAuth";
import Sidebar from "./sidebar/sidebar";
import useStyle from './styles';
import {Add as AddIcon, Clear as ClearIcon} from "@material-ui/icons";
import useHttpPost from "../../../hooks/useHttpPost";
import {useDispatch} from "react-redux";
import {addNewBookmark} from "../../../redux/bookmarks/bookmarks.actions";

export default function SidebarOption({screen}: any) {
  const classes = useStyle();
  const {onLogout} = useAuth();
  const history = useHistory();

  const [showNewUrl, setShowNewUrl] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');
  const {execute: createBookmark} = useHttpPost('bookmarks');

  const dispatch = useDispatch();

  const logout = () => {
    onLogout();
    history.push('/login');
  }

  const handleNewUrl = () => {
    createBookmark({
      url: url
    }).then((data) => {
      setShowNewUrl(false);
      dispatch(addNewBookmark(data));
    });
  }

  return (
    <Box className={classes.main}>
      <Container maxWidth={false} className={classes.header}>
        <Container maxWidth='lg'>
          <Grid
            container
            spacing={1}
            direction='row'
            justify={'flex-end'}
            alignItems='center'
          >
            {
              showNewUrl ? <>
                  <Grid item md={6}>
                    <TextField
                      size='small'
                      fullWidth={true}
                      variant='outlined'
                      placeholder='Save a URL https://...'
                      className={classes.urlTextField}
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AddIcon/>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Button variant='contained' color='primary' size='medium' onClick={handleNewUrl}>Add</Button>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={() => setShowNewUrl(false)}>
                      <ClearIcon/>
                    </IconButton>
                  </Grid>
                </>
                :
                <Grid item>
                  <IconButton onClick={() => setShowNewUrl(true)}>
                    <AddIcon/>
                  </IconButton>
                </Grid>
            }
            <Grid item>
              <Button onClick={logout}>Log Out</Button>
            </Grid>
          </Grid>
        </Container>
      </Container>
      <Container maxWidth='lg'>
        <Grid container direction='row' spacing={8}>
          <Grid item md={2} lg={2}>
            <Sidebar/>
          </Grid>
          <Grid item md={10} lg={10}>
            {screen}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}