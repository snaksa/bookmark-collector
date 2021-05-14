import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  main: {
    backgroundColor: theme.palette.background.default,
  },
  scrollPaper: {
    alignItems: "baseline",
    paddingTop: 100,
  },
  actions: {
    padding: theme.spacing(4, 6),
  },
}));

export default useStyles;
