import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(1, 0),
    marginBottom: theme.spacing(8),
    borderBottom: "1px solid #ccc",
    boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.08)",
  },
  urlTextField: {
    backgroundColor: "#FFF",
  },
  logo: {
    height: "25px",
  },
  avatar: {
    cursor: "pointer",
    backgroundColor: theme.palette.primary.main,
  },
  menu: {
    minWidth: "230px",
  },
  menuItem: {
    cursor: "pointer",
    backgroundColor: theme.palette.background.default,
    fontWeight: "bold",
    padding: theme.spacing(3, 4),
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "#FFF",

      "& $viewProfile": {
        color: "#FFF",
      },
    },
  },
  viewProfile: {
    fontWeight: "lighter",
    color: "#8c877e",
  },
  divider: {
    backgroundColor: "#c3c0bb",
  },
}));

export default useStyles;
