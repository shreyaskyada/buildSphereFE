import React from "react";
import { Button as MuiButton } from "@material-ui/core";
import { useStyles } from "./buttonStyle";
import clsx from "clsx";

const Button = ({ className, children, ...props }) => {
  const classes = useStyles();
  return (
    <MuiButton
      variant="contained"
      className={clsx(classes.root, className)}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
