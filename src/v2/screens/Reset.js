import {
  Button,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import LeftBannerAuth from "../components/LeftBannerAuth";
import axios from "../../axios";
import OtpInput from "react-otp-input";
import moment from "moment";
import Eye from "../../assets/v2/Eye.svg";
import { LOGIN_ACTION } from "../../store/actions/auth";
import { ROUTE_HOME } from "../../helpers/endpoints";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { SHOW_ERROR_MESSAGE } from "../../store/actions/v2/message";

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

const OTP_TIMER = 60;
let timercount = OTP_TIMER;
let timerObj;

const Reset = (props) => {
  const classes = useStyles();
  const [stage, setStage] = useState(1);
  const [error, setError] = useState({});
  const [email, setEmail] = useState();
  const [otp, setOtp] = useState();
  const [timer, setTimer] = useState(OTP_TIMER);
  const [showPassword, setShowPassword] = useState();
  const [password, setPassword] = useState();
  const [showConfirmPassword, setShowConfirmPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const validateEmail = () => {
    if (!email) {
      setError({ email: "Email is mandatory" });
      return false;
    }
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(String(email).toLowerCase())) {
      setError({ email: "Invalid Email" });
      return false;
    }
    setError({});
    return true;
  };

  const sendOtp = async () => {
    if (validateEmail()) {
      try {
        const result = await axios.post("/reset/otp", { email });
        if (result.status === 200) {
          setStage(2);
        }
      } catch (err) {}
    }
  };

  const resendOtpHandler = async () => {
    try {
      await axios.post("/reset/otp", { email });
      if (timerObj) clearInterval(timerObj);
      timercount = OTP_TIMER + 1;
      timerObj = setInterval(() => {
        if (timercount < 0) {
          clearInterval(timerObj);
        } else {
          timercount = timercount - 1;
          setTimer(timercount);
        }
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const verifyOtp = () => {
    if (otp.length !== 6) {
      setError({ otp: `OTP should be of 6 digits` });
      return;
    }
    if (!Number(otp)) {
      setError({ otp: `Invalid OTP` });
      return;
    }
    setStage(3);
  };

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
        const result = await axios.post("/reset/password", {
          email,
          otp,
          password,
        });
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

  useEffect(() => {
    if (stage === 2) {
      if (timerObj) clearInterval(timerObj);
      timerObj = setInterval(() => {
        if (timercount < 0) {
          clearInterval(timerObj);
        } else {
          timercount = timercount - 1;
          setTimer(timercount);
        }
      }, 1000);
    } else {
      if (timerObj) clearInterval(timerObj);
    }
    return () => timerObj && clearInterval(timerObj);
  }, [stage, setTimer]);

  return (
    <Grid container>
      <LeftBannerAuth />
      <Grid item xs={6} className={classes.root}>
        {stage === 1 && (
          <>
            <Grid item xs={12}>
              <Typography className={classes.header}>
                Please enter your email
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.subHeader}>
                Please enter your email. We will send an otp on this email.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.label}>Your email</Typography>
              <TextField
                style={{ width: 400 }}
                className={classes.textfield}
                helperText={error.email && error.email}
                error={Boolean(error.email)}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button onClick={sendOtp.bind(this)} className={classes.btn}>
                Send OTP
              </Button>
            </Grid>
          </>
        )}
        {stage === 2 && (
          <>
            <Grid item xs={12}>
              <Typography className={classes.header}>
                Identity verification
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.subHeader}>
                An OTP has been sent to your email
              </Typography>
            </Grid>
            <Grid item container xs={12} alignItems="center">
              <Grid item xs={7}>
                <OtpInput
                  onChange={(otp) => {
                    setOtp(otp);
                  }}
                  value={otp}
                  numInputs={6}
                  isInputNum={true}
                  separator={<span>&nbsp;&nbsp;</span>}
                  inputStyle={{
                    width: 40,
                    height: 40,
                    borderWidth: 0,
                    backgroundColor: "#F4F4F4",
                  }}
                  focusStyle={classes.focuseedotp}
                />
                {error.otp && (
                  <Grid xs={12} item>
                    <span style={{ color: "red", fontSize: 10 }}>
                      {error.otp}
                    </span>
                  </Grid>
                )}
              </Grid>
              <Grid item xs={5}>
                {timer >= 0 ? (
                  <span>
                    {moment({}).startOf("day").seconds(timer).format("mm:ss")}
                  </span>
                ) : (
                  <span
                    className={classes.sendotpagainlink}
                    onClick={resendOtpHandler}
                  >
                    Send OTP again
                  </span>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button onClick={verifyOtp.bind(this)} className={classes.btn}>
                Submit
              </Button>
            </Grid>
          </>
        )}
        {stage === 3 && (
          <>
            <Grid item xs={12}>
              <Typography className={classes.header}>
                Create New Password
              </Typography>
            </Grid>
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
              <Typography className={classes.label}>
                Confirm Password
              </Typography>
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
              <Button
                onClick={submitNewPass.bind(this)}
                className={classes.btn}
              >
                Sign in with New Password
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default Reset;
