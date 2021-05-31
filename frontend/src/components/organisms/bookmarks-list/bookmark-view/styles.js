import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  actions: {
    textAlign: "right",
  },
  link: {
    color: "inherit",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  title: {
    color: "#000",
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: theme.spacing(1),
  },
  noImage: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.palette.primary.light,
    boxSizing: "border-box",
    borderBottom: `8px solid ${theme.palette.primary.main}`,
    borderRadius: theme.spacing(1),
  },
  host: {
    color: "#66635c",
  },
}));

export default useStyles;
