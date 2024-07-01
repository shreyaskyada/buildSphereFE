import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: "250px",
    padding: "16px 32px",
    backgroundColor: "#0CA14A",
    color: "#FFFFFF",
    fontFamily: "'Manrope', sans-serif",
    fontWeight: 600,
    "&:hover": {
      backgroundColor: "#04B349",
    },
    "&:disabled": {
      backgroundColor: "grey",
      color: "#ffffff",
    },
  },
}));
