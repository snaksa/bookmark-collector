import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  main: {
    cursor: "pointer",
    color: "#000",
    justifyContent: "flex-start",
    "&:hover": {
      backgroundColor: "transparent",
      color: theme.palette.primary.main,
    },
  },
  active: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  content: {
    display: "flex",
  },
  icon: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    display: "flex",
    alignItems: "center",
    marginLeft: theme.spacing(2),
  },
}));

export default useStyles;
