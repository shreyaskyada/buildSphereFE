import {
  Button,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import LeftBannerAuth from "../components/LeftBannerAuth";
import axios from "../../axios";

import Eye from "../../assets/v2/Eye.svg";
import { LOGIN_ACTION } from "../../store/actions/auth";
import { ROUTE_HOME } from "../../helpers/endpoints";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { SHOW_ERROR_MESSAGE } from "../../store/actions/v2/message";
import { Redirect } from "react-router-dom";
const queryString = require("query-string");

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "10% 5%",
  },
  header: {
    fontSize: 25,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.blackShade1,
    paddingBottom: "5%",
  },
  subHeader: {
    fontSize: 16,
    color: theme.v2.fonts.colors.blackShade1,
    paddingBottom: "5%",
  },
  label: {
    fontSize: 16,
    color: theme.v2.fonts.colors.blackShade1,
    paddingBottom: "1%",
  },
  btn: {
    marginTop: "5%",
    padding: "2% 5%",
    fontSize: 18,
    fontWeight: 400,
  },
  focuseedotp: {
    outlineColor: theme.v2.borders.lightGreen,
  },
  sendotpagainlink: {
    textDecoration: "underline",
    fontSize: 14,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.greenShade1,
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

const ForceChangePassword = (props) => {
  const classes = useStyles();

  const [error, setError] = useState({});

  const [showPassword, setShowPassword] = useState();
  const [password, setPassword] = useState();
  const [showConfirmPassword, setShowConfirmPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const parsed = queryString.parse(props.location.search);

  const verifyPasswords = () => {
    const pattern = new RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,25}$"
    );
    if (
      !pattern.test(password) ||
      password.length < 8 ||
      password.length > 25
    ) {
      setError({
        password: `Must contain at least one number and one uppercase and
          lowercase letter, and at least 8 or more characters`,
      });
      return false;
    }
    if (password !== confirmPassword) {
      setError({
        confirmPassword: `Password and Confirm Password don't match`,
      });
      return false;
    }
    setError({});
    return true;
  };
  const dispatch = useDispatch();

  const submitNewPass = async () => {
    if (verifyPasswords()) {
      try {
        const result = await axios.post(
          "/password/admin",
          {
            password,
          },
          {
            headers: {
              Authorization: parsed.q,
            },
          }
        );
        if (result.status === 200) {
          const profile = result.data.message;
          const token = _.get(result, ["headers", "authorization"]);
          localStorage.setItem("token", token);
          localStorage.setItem("profile", JSON.stringify(profile));
          dispatch({
            type: LOGIN_ACTION,
            token,
            profile: JSON.stringify(profile),
          });
          props.history.replace(ROUTE_HOME);
        }
      } catch (err) {
        dispatch({
          type: SHOW_ERROR_MESSAGE,
          data:
            _.get(err, ["response", "data", "message"]) ||
            "Something went wrong",
        });
      }
    }
  };

  if (!_.get(parsed, "q")) {
    return <Redirect to={ROUTE_HOME} />;
  }

  return (
    <Grid container>
      <LeftBannerAuth />
      <Grid item xs={6} className={classes.root}>
        <>
          <Grid item xs={12}>
            <Typography className={classes.header}>
              Please create a password
            </Typography>
          </Grid>
        </>

        <>
          <Grid item xs={12}>
            <Typography className={classes.subHeader}>
              Type and confirm a secure new password
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.label}>New Password</Typography>
            <TextField
              type={showPassword ? "text" : "password"}
              className={classes.textfield}
              helperText={error.password && error.password}
              error={Boolean(error.password)}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              style={{ width: 400 }}
              value={password}
              InputProps={{
                endAdornment: (
                  <img
                    src={Eye}
                    alt="show"
                    style={{ cursor: "pointer" }}
                    onClick={setShowPassword.bind(this, !showPassword)}
                  />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} style={{ paddingTop: "2%" }}>
            <Typography className={classes.label}>Confirm Password</Typography>
            <TextField
              type={showConfirmPassword ? "text" : "password"}
              className={classes.textfield}
              helperText={error.confirmPassword && error.confirmPassword}
              error={Boolean(error.confirmPassword)}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              style={{ width: 400 }}
              value={confirmPassword}
              InputProps={{
                endAdornment: (
                  <img
                    src={Eye}
                    alt="show"
                    style={{ cursor: "pointer" }}
                    onClick={setShowConfirmPassword.bind(
                      this,
                      !showConfirmPassword
                    )}
                  />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button onClick={submitNewPass.bind(this)} className={classes.btn}>
              Sign in with New Password
            </Button>
          </Grid>
        </>
      </Grid>
    </Grid>
  );
};

export default ForceChangePassword;
