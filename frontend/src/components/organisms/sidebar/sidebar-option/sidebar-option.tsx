import React from "react";
import { Button } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import useStyles from "./styles";
import { useHistory } from "react-router";

interface SidebarOptionProps {
  to: string;
  title: string;
  icon: JSX.Element;
}

export default function SidebarOption({
  to,
  title,
  icon,
}: SidebarOptionProps): JSX.Element {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const isActive = location.pathname === to;

  const onClick = () => {
    history.push(to);
  };

  return (
    <Button
      disableRipple={true}
      fullWidth={true}
      onClick={onClick}
      classes={{ root: `${classes.root} ${isActive ? classes.active : ""}` }}
    >
      <div className={classes.content}>
        <div className={classes.icon}>{icon}</div>
        <div className={classes.title}>{title}</div>
      </div>
    </Button>
  );
}
