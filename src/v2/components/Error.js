import React from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useDispatch, useSelector } from "react-redux";
import { HIDE_ERROR } from "../../store/actions/v2/error";

const Error = () => {
  const error = useSelector((state) => state.error);
  const dispatch = useDispatch();
  const errorConfirmedHandler = () => {
    dispatch({ type: HIDE_ERROR });
  };

  return (
    <Snackbar
      open={error.open}
      autoHideDuration={6000}
      onClose={errorConfirmedHandler}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={errorConfirmedHandler} severity="error">
        {error.message}
      </Alert>
    </Snackbar>
  );
};

export default Error;
