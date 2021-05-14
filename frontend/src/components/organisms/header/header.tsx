import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Popover,
  TextField,
} from "@material-ui/core";
import { Add as AddIcon, Clear as ClearIcon } from "@material-ui/icons";
import useStyles from "./styles";
import { useAuth } from "../../../hooks/useAuth";
import { useHistory } from "react-router";
import useHttpPost from "../../../hooks/useHttpPost";
import { useDispatch, useSelector } from "react-redux";
import { addNewBookmark } from "../../../redux/bookmarks/bookmarks.actions";
import {
  initializedUserDetails,
  initializeUserDetails,
} from "../../../redux/user/user.actions";
import useHttpGet from "../../../hooks/useHttpGet";

export default function Header() {
  const classes = useStyles();

  const { onLogout } = useAuth();
  const history = useHistory();

  const [showNewUrl, setShowNewUrl] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const { execute: createBookmark } = useHttpPost("bookmarks");

  const dispatch = useDispatch();

  const logout = () => {
    onLogout();
    history.push("/login");
  };

  const handleNewUrl = () => {
    createBookmark({
      url: url,
    }).then((data) => {
      setShowNewUrl(false);
      dispatch(addNewBookmark(data));
    });
  };

  const { fetch: fetchUserDetails } = useHttpGet(`auth/me`, {}, true);
  const currentUser = useSelector((state: any) => state.user.details);
  useEffect(() => {
    if (!currentUser.initialized) {
      dispatch(initializeUserDetails());
      fetchUserDetails().then((data) => {
        dispatch(initializedUserDetails(data));
      });
    }
  }, []);

  const [anchorEl, setAnchorEl] = React.useState<any>(null);

  const handleClick = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewProfileClick = () => {
    history.push("/my-profile");
    handleClose();
  };

  return (
    <Container maxWidth={false} className={classes.header}>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justify={"space-between"}
          alignItems="center"
        >
          <Grid item>
            <img
              className={classes.logo}
              alt={"Logo"}
              src={
                "https://assets.getpocket.com/web-ui/assets/pocket-logo-light-mode.9a20614bbcbaf69b221df81a80daa73d.svg"
              }
            />
          </Grid>
          <Grid item>
            <Grid
              container
              spacing={1}
              direction="row"
              justify={"flex-end"}
              alignItems="center"
            >
              {showNewUrl ? (
                <>
                  <Grid item md={6}>
                    <TextField
                      size="small"
                      fullWidth={true}
                      variant="outlined"
                      placeholder="Save a URL https://..."
                      className={classes.urlTextField}
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AddIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      size="medium"
                      onClick={handleNewUrl}
                    >
                      Add
                    </Button>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={() => setShowNewUrl(false)}>
                      <ClearIcon />
                    </IconButton>
                  </Grid>
                </>
              ) : (
                <Grid item>
                  <IconButton onClick={() => setShowNewUrl(true)}>
                    <AddIcon />
                  </IconButton>
                </Grid>
              )}
              <Grid item>
                <Avatar onClick={handleClick} className={classes.avatar}>
                  {currentUser.initialized
                    ? `${currentUser.data.firstName[0]}${currentUser.data.lastName[0]}`
                    : ""}
                </Avatar>
              </Grid>
              <Grid item>
                <Popover
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <Grid container direction="column" className={classes.menu}>
                    <Grid
                      item
                      className={classes.menuItem}
                      onClick={handleViewProfileClick}
                    >
                      <div>Sinan</div>
                      <div className={classes.viewProfile}>View Profile</div>
                    </Grid>
                    <Grid item>
                      <Divider className={classes.divider} />
                    </Grid>
                    <Grid item className={classes.menuItem}>
                      Change Password
                    </Grid>
                    <Grid item>
                      <Divider className={classes.divider} />
                    </Grid>
                    <Grid item className={classes.menuItem} onClick={logout}>
                      Log Out
                    </Grid>
                  </Grid>
                </Popover>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
}