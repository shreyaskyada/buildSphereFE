import {
  Button,
  Grid,
  makeStyles,
  MenuItem,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import Cross from "../../assets/v2/Cross.svg";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios";
import { withSnackbar } from "notistack";
import _ from "lodash";
import {
  SHOW_ERROR_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
} from "../../store/actions/v2/message";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    borderRadius: 10,
    margin: "5% 20% 15% 20%",
    outline: 0,
  },
  firstContainer: {
    padding: "5% 10%",
  },
  mainHeader: {
    color: theme.v2.fonts.colors.greenShade2,
    fontSize: 26,
  },
  paragraph: {
    fontSize: 15,
    fontWeight: 500,
    color: theme.v2.fonts.colors.darkFont2,
  },
  label: {
    fontSize: 15,
    fontWeight: 500,
    color: theme.v2.fonts.colors.darkFont2,
  },
  textField: {
    height: 30,
    "& .MuiInput-root": {
      backgroundColor: theme.v2.fonts.colors.whiteFont,
      border: `1px solid ${theme.v2.borders.darkShade2}`,
      borderRadius: 5,
      fontSize: 12,
      color: theme.v2.fonts.colors.darkFont,
    },
    "& .Mui-focused": {
      border: `2px solid ${theme.v2.borders.lightGreen}`,
    },
    "& .MuiFormHelperText-root": {
      border: 0,
    },
  },
}));

const AddProjectModal = (props) => {
  const classes = useStyles();
  const [email, setEmail] = useState();
  const [role, setRole] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [error, setError] = useState({});
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => JSON.parse(state.auth.profile));
  const groupId = _.get(profile, "group_id");
  const dispatch = useDispatch();

  const validateData = () => {
    if (!firstName) {
      setError({ firstName: "First Name is mandatory" });
      return false;
    }
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
    if (!role) {
      setError({ role: "Role is mandatory" });
      return false;
    }
    setError({});
    return true;
  };

  const createMember = async () => {
    if (validateData()) {
      try {
        const obj = {
          email,
          role,
          first_name: firstName,
        };
        if (lastName) obj.last_name = lastName;
        const result = await axios.post(
          `/groups/${groupId}/members?p=group:${groupId}`,
          obj,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (result.status === 200) {
          dispatch({
            type: SHOW_SUCCESS_MESSAGE,
            data: "An invitation is sent to the user",
          });
          props.onClose();
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

  return (
    <Modal open={props.open} className={classes.root}>
      <Paper className={classes.paper}>
        <Grid item container className={classes.firstContainer} spacing={4}>
          <Grid item xs={8} container alignItems="flex-end">
            <Typography className={classes.mainHeader}>Add Member</Typography>
          </Grid>
          <Grid item xs={4} container justify="flex-end">
            <img
              src={Cross}
              alt="Close"
              style={{ cursor: "pointer" }}
              onClick={props.onClose}
            />
          </Grid>
          <Grid item xs={12} style={{ paddingBottom: "5%", paddingTop: 0 }}>
            <Typography className={classes.paragraph}>
              Add a new member to your group
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.label}>
              Member First Name*
            </Typography>
            <TextField
              variant={"standard"}
              className={classes.textField}
              fullWidth={true}
              helperText={error.firstName}
              error={Boolean(error.firstName)}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.label}>Member Last Name</Typography>
            <TextField
              variant={"standard"}
              className={classes.textField}
              fullWidth={true}
              helperText={error.lastName}
              error={Boolean(error.lastName)}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.label}>Member Email*</Typography>
            <TextField
              variant={"standard"}
              className={classes.textField}
              fullWidth={true}
              helperText={error.email}
              error={Boolean(error.email)}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.label}>Role*</Typography>
            <TextField
              select={true}
              variant={"standard"}
              className={classes.textField}
              fullWidth={true}
              helperText={error.role}
              error={Boolean(error.role)}
              onChange={(e) => {
                setRole(e.target.value);
              }}
            >
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="FIELD_USER">Field User</MenuItem>
              <MenuItem value="INSPECTOR">Inspector</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} container justify="flex-end">
            <Button
              disableElevation
              style={{ width: 200, height: 50 }}
              onClick={createMember.bind(this)}
            >
              <Typography style={{ fontSize: 18, padding: "10% 0%" }}>
                Create Member
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

export default withSnackbar(AddProjectModal);
