import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  main: {
    backgroundColor: theme.palette.background.default,
  },
  header: {
    padding: theme.spacing(1, 0),
    marginBottom: theme.spacing(8),
    borderBottom: "1px solid #ccc",
  },
  urlTextField: {
    backgroundColor: "#FFF",
  },
}));

export default useStyles;
