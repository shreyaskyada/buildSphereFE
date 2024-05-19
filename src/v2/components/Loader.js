import React from "react";
import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 100000,
    color: "#fff",
  },
  paper: {
    backgroundColor: theme.palette.primary.main,
    width: "80%",
    [theme.breakpoints.up("md")]: {
      width: "60%",
    },
    padding: theme.spacing(2, 4, 3),
  },
  getBtn: {
    width: 300,
    height: 60,
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.text.secondary,
    textAlign: "center",
    "&:hover": {
      backgroundColor: "#2c3b6d",
    },
  },
}));

const Loader = (props) => {
  const classes = useStyles();
  const showLoader = useSelector((state) => state.loader);
  return (
    <Backdrop
      className={classes.backdrop}
      open={showLoader > 0}
      transitionDuration={1500}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loader;
