import {
  Button,
  Checkbox,
  Grid,
  makeStyles,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core";
import _ from "lodash";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "../../axios";
import {
  ROUTE_FORCE_CHANGE_PASSWORD,
  ROUTE_HOME,
  ROUTE_RESET,
} from "../../helpers/endpoints";
import { LOGIN_ACTION } from "../../store/actions/auth";
import { SHOW_ERROR_MESSAGE } from "../../store/actions/v2/message";
import LeftBannerAuth from "../components/LeftBannerAuth";

const h = window.innerHeight;

const useStyles = makeStyles((theme) => ({
  leftContainer: {
    backgroundColor: theme.v2.backgrounds.darkBackground,
    paddingLeft: "10%",
    height: h,
  },
  leftContainerHeader: {
    color: theme.v2.fonts.colors.whiteShade1,
    fontSize: 31,
    fontWeight: 200,
  },
  leftContainerText: {
    color: theme.v2.fonts.colors.whiteShade1,
    fontSize: 16,
  },
  leftContainerText2: {
    color: theme.v2.fonts.colors.whiteShade1,
    fontSize: 14,
  },
  rightContainer: {
    paddingRight: "5%",
    paddingLeft: "10%",
    height: h,
  },
  rightTextFirst: {
    fontSize: 16,
    fontWeight: 200,
  },
  rightTextSecond: {
    fontSize: 16,
    fontWeight: 600,
    color: "#a9def9",
    textDecorationLine: "none",
    "&:hover": {
      cursor: "pointer",
      textDecorationLine: "underline",
    },
  },
  rightSignupContainer: {
    paddingTop: "5%",
    display: "flex",
    flexDirection: "row",
  },
  loginText: {
    fontSize: 32,
    fontWeight: 700,
    color: "#1D1D1F",
    marginBottom: "8px",
  },
  label: {
    fontSize: 16,
    fontColor: theme.v2.fonts.colors.blackShade1,
    paddingTop: "2%",
    paddingBottom: "2%",
  },
  loginBtnText: {
    fontSize: 18,
    fontWeight: 600,
    color: theme.v2.fonts.colors.whiteFont,
  },
  rememberMe: {
    color: theme.v2.fonts.colors.brownShade1,
    fontSize: 14,
    fontWeight: 400,
  },
  forgotPwd: {
    color: "#a9def9",
    fontSize: 14,
    fontWeight: 600,
    textDecorationLine: "none",
    cursor: "pointer",
    "&:hover": {
      textDecorationLine: "underline",
    },
  },
}));

const GreenCheckbox = withStyles((theme) => ({
  root: {
    color: theme.v2.checkboxes.green,
    "&$checked": {
      color: theme.v2.checkboxes.green,
    },
  },
  checked: {},
}))((props) => <Checkbox color="default" {...props} />);

const Login = (props) => {
  const classes = useStyles();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const dispatch = useDispatch();
  const validateRequest = () => {
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
    if (!password) {
      setError({ password: "Password is mandatory" });
      return false;
    }
    if (password.length < 6) {
      setError({ password: "Password should be atleast 6 characters long" });
      return false;
    }
    setError({});
    return true;
  };
  const submitForLogin = async () => {
    if (validateRequest()) {
      setLoading(true);
      try {
        const result = await axios.post("/login/web", {
          email,
          password,
        });
        if (result.status === 200) {
          const token = _.get(result, ["headers", "authorization"]);
          if (_.get(result, ["data", "message", "is_new_user"])) {
            props.history.push(`${ROUTE_FORCE_CHANGE_PASSWORD}?q=${token}`);
          } else {
            const profile = _.get(result, ["data", "message"]);
            localStorage.setItem("token", token);
            localStorage.setItem("profile", JSON.stringify(profile));
            dispatch({
              type: LOGIN_ACTION,
              token,
              profile: JSON.stringify(profile),
            });
            props.history.push(ROUTE_HOME);
          }
        }
      } catch (err) {
        dispatch({
          type: SHOW_ERROR_MESSAGE,
          data:
            _.get(err, ["response", "data", "message"]) ||
            "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <Grid container>
      <LeftBannerAuth />
      <Grid item container md={7} xs={12} className={classes.rightContainer}>
        <Grid
          item
          xs={12}
          container
          className={classes.rightSignupContainer}
          justify="flex-end"
        >
          <Typography className={classes.rightTextFirst}>
            Don't have an account?&nbsp;
          </Typography>
          <span
            onClick={() => {
              props.history.push("/signup");
            }}
            className={classes.rightTextSecond}
          >
            Sign Up Now
          </span>
        </Grid>
        <Grid item xs={12} style={{ paddingTop: 0.1 * h }}>
          <Typography className={classes.loginText}>Login</Typography>
        </Grid>
        <Grid item xs={12} style={{ paddingRight: "40%" }}>
          <Typography className={classes.label}>Email</Typography>
          <TextField
            variant="standard"
            placeholder="Enter your Email id"
            fullWidth={true}
            helperText={error.email}
            error={error.email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Typography className={classes.label}>Enter your password</Typography>
          <TextField
            type="password"
            variant="standard"
            placeholder="Enter your password"
            fullWidth={true}
            helperText={error.password}
            error={error.password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            container
            spacing={3}
          >
            <Grid
              item
              xs={6}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <GreenCheckbox />
              <Typography className={classes.rememberMe}>
                Remember Me
              </Typography>
            </Grid>
            <Typography
              className={classes.forgotPwd}
              onClick={() => {
                props.history.push(ROUTE_RESET);
              }}
            >
              Forgot Password?
            </Typography>
          </Grid>
        </Grid>
        <Grid style={{ paddingBottom: 0.3 * h }}>
          <Button
            disableElevation
            variant="contained"
            disabled={loading}
            style={{ 
              width: 180, 
              height: 52, 
              borderRadius: 12,
              backgroundColor: loading ? "#cccccc" : "#a9def9",
              color: "#ffffff",
              boxShadow: loading ? "none" : "0px 4px 12px rgba(169, 222, 249, 0.4)",
              transition: "all 0.3s ease"
            }}
            onClick={submitForLogin.bind(this)}
          >
            <Typography className={classes.loginBtnText}>
              {loading ? "Logging in..." : "Login"}
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Login;
