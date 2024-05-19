import { Button, Grid, makeStyles, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import LeftBannerAuth from "../../components/LeftBannerAuth";
import OtpInput from "react-otp-input";
import * as moment from "moment";
import axios from "../../../axios";
import {
  ROUTE_ACCOUNTS_SUBSCRIPTION,
  SIGNUP,
  SIGNUP_GENERATE_OTP,
  SIGNUP_SUBMIT_OTP,
} from "../../../helpers/endpoints";
import { LOGIN_ACTION } from "../../../store/actions/auth";
import { useDispatch } from "react-redux";
import { SHOW_ERROR_MESSAGE } from "../../../store/actions/v2/message";

const _ = require("lodash");
const OTP_TIMER = 60;
let timercount = OTP_TIMER;
let timerObj;

const useStyles = makeStyles((theme) => ({
  rightContainer: {
    paddingRight: "5%",
    paddingLeft: "5%",
  },
  logintxt: {
    fontSize: 16,
    fontWeight: 200,
    paddingTop: "5%",
  },
  logintxtbtn: {
    color: theme.v2.fonts.colors.greenShade1,
    textDecorationLine: "underline",
    textDecorationColor: theme.v2.fonts.colors.greenShade1,
    fontWeight: "bold",
    "&:hover": {
      cursor: "pointer",
    },
  },
  formHeading: {
    fontSize: 25,
    fontWeight: "bold",
    paddingTop: "4%",
  },
  labelformfields: {
    fontSize: 16,
    paddingBottom: "3%",
  },
  formitemwrapper: {
    paddingTop: "5%",
    paddingRight: "2%",
  },
  formtextfield: {
    width: "100%",
  },
  sendotpbtn: {
    height: 50,
    width: 160,
    fontSize: 18,
  },
  focuseedotp: {
    outlineColor: theme.v2.borders.lightGreen,
  },
  unfocussedotp: {
    outlineWidth: 0,
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

const Signup = (props) => {
  const classes = useStyles();
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    mname: "",
    email: "",
    password: "",
    otpEnabled: false,
    otp: "",
  });

  const [timer, setTimer] = useState(OTP_TIMER);
  const [otpErr, setOtpErr] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    if (form.otpEnabled) {
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
  }, [form.otpEnabled, setTimer]);

  const resendOtpHandler = async () => {
    try {
      setOtpErr("");
      await axios.post(`${SIGNUP}/${SIGNUP_GENERATE_OTP}`, {
        email: form.email,
      });
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
    } catch (err) {
      dispatch({
        type: SHOW_ERROR_MESSAGE,
        data:
          _.get(err, ["response", "data", "message"]) || "Something went wrong",
      });
    }
  };

  const generateOtpHandler = () => {

    const pwd = form.password;

    if (!pwd || pwd.length < 8) {
      dispatch({
        type: SHOW_ERROR_MESSAGE,
        data: "Password should be min 8 characters"
      });

      return
    }

    const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,25}$/;
    const isValid = pattern.test(pwd)

    if (!isValid) {
      dispatch({
        type: SHOW_ERROR_MESSAGE,
        data: "Password must contain at least one number and one uppercase and lowercase letter,one special character, and at least 8 or more characters"
      });

      return;

    }


    axios
      .post(`${SIGNUP}/${SIGNUP_GENERATE_OTP}`, { email: form.email })
      .then(() => {
        setForm((prev) => ({ ...prev, otpEnabled: true }));
      })
      .catch((err) => {
        dispatch({
          type: SHOW_ERROR_MESSAGE,
          data:
            _.get(err, ["response", "data", "message"]) ||
            "Something went wrong",
        });
      });
  };

  const onFormChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const verifyOtpHandler = async () => {
    setOtpErr("");
    const otp = form.otp;
    if (!otp) {
      setOtpErr("Invalid OTP");
      return;
    }
    if (otp.length !== 6) {
      setOtpErr("Invalid OTP");
      return;
    }
    if (!Number(otp)) {
      setOtpErr("Invalid OTP");
      return;
    }
    const request = { ...form };
    delete request.otpEnabled;
    try {
      const response = await axios.post(
        `${SIGNUP}/${SIGNUP_SUBMIT_OTP}`,
        request
      );
      const profile = response.data.message;
      const token = _.get(response, ["headers", "authorization"]);
      localStorage.setItem("token", token);
      localStorage.setItem("profile", JSON.stringify(profile));
      dispatch({
        type: LOGIN_ACTION,
        token,
        profile: JSON.stringify(profile),
      });
      props.history.replace(ROUTE_ACCOUNTS_SUBSCRIPTION);
    } catch (err) {
      dispatch({
        type: SHOW_ERROR_MESSAGE,
        data:
          _.get(err, ["response", "data", "message"]) || "Something went wrong",
      });
      setOtpErr("Invalid OTP");
    }
  };

  return (
    <Grid container>
      <LeftBannerAuth />
      <Grid item md={7} xs={12} className={classes.rightContainer}>
        {!form.otpEnabled && (
          <Grid container>
            <Grid xs={12} item container justify="flex-end">
              <span className={classes.logintxt}>
                Already a member?{" "}
                <span
                  className={classes.logintxtbtn}
                  onClick={() => {
                    props.history.goBack();
                  }}
                >
                  Login
                </span>
              </span>
            </Grid>

            <Grid xs={12} item container>
              <div className={classes.formHeading}>Sign Up to RUS2BILL</div>
              <form
                style={{ width: "100%" }}
                onSubmit={(e) => {
                  e.preventDefault();
                  generateOtpHandler();
                }}
              >
                <Grid xs={12} item container>
                  <Grid xs={12} md={4} item className={classes.formitemwrapper}>
                    <div className={classes.labelformfields}>First Name*</div>
                    <TextField
                      variant="standard"
                      className={classes.formtextfield}
                      required={true}
                      type="text"
                      placeholder="Your first name"
                      value={form.fname}
                      name="fname"
                      onChange={onFormChangeHandler}
                    />
                  </Grid>
                  <Grid xs={12} md={4} item className={classes.formitemwrapper}>
                    <div className={classes.labelformfields}>Middle Name</div>
                    <TextField
                      variant="standard"
                      className={classes.formtextfield}
                      type="text"
                      placeholder="Your middle name"
                      value={form.mname}
                      name="mname"
                      onChange={onFormChangeHandler}
                    />
                  </Grid>
                  <Grid xs={12} md={4} item className={classes.formitemwrapper}>
                    <div className={classes.labelformfields}>Last Name*</div>
                    <TextField
                      variant="standard"
                      className={classes.formtextfield}
                      required={true}
                      type="text"
                      placeholder="Your last name"
                      value={form.lname}
                      name="lname"
                      onChange={onFormChangeHandler}
                    />
                  </Grid>
                  <Grid xs={12} md={6} item className={classes.formitemwrapper}>
                    <div className={classes.labelformfields}>Email Id*</div>
                    <TextField
                      variant="standard"
                      className={classes.formtextfield}
                      required={true}
                      type="email"
                      placeholder="e.g. name@gmail.com"
                      value={form.email}
                      name="email"
                      onChange={onFormChangeHandler}
                    />
                  </Grid>
                  <Grid xs={12} md={6} item className={classes.formitemwrapper}>
                    <div className={classes.labelformfields}>Password*</div>
                    <TextField
                      variant="standard"
                      className={classes.formtextfield}
                      required={true}
                      type="password"
                      placeholder="********"
                      inputProps={{
                        pattern:
                          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,25}$",
                        minLength: 8,
                        maxLength: 25,
                      }}
                      value={form.password}
                      name="password"
                      onChange={onFormChangeHandler}
                    />
                    <div style={{ fontSize: 9 }}>
                      Must contain at least one number and one uppercase and
                      lowercase letter, and at least 8 or more characters
                    </div>
                  </Grid>
                  <Grid xs={12} item className={classes.formitemwrapper}>
                    <Button className={classes.sendotpbtn} type="submit">
                      Send OTP
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        )}
        {form.otpEnabled && (
          <Grid container>
            <Grid
              xs={12}
              item
              container
              justify="flex-end"
              style={{ paddingTop: "5%" }}
            >
              <span className={classes.logintxt}></span>
            </Grid>

            <Grid xs={12} item container>
              <div className={classes.formHeading}>OTP verification</div>
              <form
                style={{ width: "100%" }}
                onSubmit={(e) => {
                  e.preventDefault();
                  verifyOtpHandler();
                }}
              >
                <Grid
                  xs={12}
                  item
                  container
                  className={classes.formitemwrapper}
                >
                  <Grid xs={12} item>
                    We have sent an OTP to your <b>email inbox</b>.&nbsp; Please
                    insert that OTP to complete your verification.
                  </Grid>
                  <Grid xs={12} md={8} item className={classes.formitemwrapper}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <OtpInput
                        value={form.otp}
                        onChange={(otp) => {
                          setForm((prev) => ({ ...prev, otp }));
                        }}
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
                      />{" "}
                      &nbsp;
                      {timer >= 0 ? (
                        <span>
                          {moment({})
                            .startOf("day")
                            .seconds(timer)
                            .format("mm:ss")}
                        </span>
                      ) : (
                        <span
                          className={classes.sendotpagainlink}
                          onClick={resendOtpHandler}
                        >
                          Send OTP again
                        </span>
                      )}
                    </div>
                  </Grid>

                  <Grid xs={12} item className={classes.formitemwrapper}>
                    <Button className={classes.sendotpbtn} type="submit">
                      Submit
                    </Button>
                  </Grid>
                  {otpErr && (
                    <Grid xs={12} item>
                      <span style={{ color: "red", fontSize: 10 }}>
                        {otpErr}
                      </span>
                    </Grid>
                  )}
                </Grid>
              </form>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default Signup;
