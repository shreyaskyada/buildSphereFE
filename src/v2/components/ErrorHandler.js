import React from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import { withSnackbar } from "notistack";

const ErrorHandler = (props) => {
  const message = useSelector((state) => state.message);
  const error = _.get(message, "error");
  const success = _.get(message, "success");
  if (error)
    props.enqueueSnackbar(error, {
      variant: "error",
    });
  if (success)
    props.enqueueSnackbar(success, {
      variant: "success",
    });
  return <></>;
};

export default withSnackbar(ErrorHandler);
