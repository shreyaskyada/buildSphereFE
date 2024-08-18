import {
  Backdrop,
  FormHelperText,
  Grid,
  makeStyles,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
} from "@material-ui/core";
import { ReactComponent as Cross } from "../../../assets/v2/CloseIcon.svg";
import ArrowDown from "../../../assets/v2/ArrowDown.svg";
import React, { useState } from "react";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import axios from "../../../axios";
import { SHOW_ERROR_MESSAGE } from "../../../store/actions/v2/message";
import { HIDE_LOADER, SHOW_LOADER } from "../../../store/actions/v2/loader";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  paper: {
    // width: "51vw",
    borderRadius: "24px",
    paddingLeft: "55px",
    paddingRight: "55px",
    paddingTop: "60px",
    paddingBottom: "60px",
    outline: 0,
    // [theme.breakpoints.down(1400)]: {
    //   width: "57vw",
    // },
    // [theme.breakpoints.down(1350)]: {
    //   width: "65vw",
    // },
    // [theme.breakpoints.down(660)]: {
    //   width: "80vw",
    // },
  },
  arrowContainer: {
    backgroundColor: "#E5FAE7",
    height: 18,
    width: 18,
    borderRadius: "50%",
    pointerEvents: "none",
    position: "absolute",
    right: "10px",
  },
  select: {
    border: "2px solid #DBF4EE",
    height: "40px",
    fontSize: "14px",
    color: "#113C23",
    fontWeight: 500,
    paddingLeft: "10px",
    fontFamily: "Manrope",
    width: "348px",
    backgroundColor: "white",
    "&.Mui-focused": {
      border: "2px solid #4BCE82",
    },
    "& .MuiSelect-select": {
      backgroundColor: "white",
      "&:focus": {
        backgroundColor: "white",
      },
    },
    [theme.breakpoints.down(1180)]: {
      width: "300px",
    },
    [theme.breakpoints.down(1035)]: {
      width: "250px",
    },
    [theme.breakpoints.down(890)]: {
      width: "220px",
    },
    [theme.breakpoints.down(800)]: {
      width: "27vw",
    },
    [theme.breakpoints.down(660)]: {
      width: "35vw",
    },
  },

  placeholder: {
    opacity: 0.5,
  },

  menulabels: {
    fontFamily: "Manrope",
    backgroundColor: theme.v2.backgrounds.whiteBackground,
    fontSize: 14,
    fontWeight: 500,
    color: theme.v2.fonts.colors.blackShade1,
  },
  textField: {
    "& .MuiInput-root": {
      height: "40px",
      width: "348px",
      fontWeight: 500,
      backgroundColor: "white",
      paddingLeft: "10px",
      fontFamily: "Manrope",
      fontSize: "14px",
      border: "2px solid #DBF4EE",
      [theme.breakpoints.down(1180)]: {
        width: "300px",
      },
      [theme.breakpoints.down(1035)]: {
        width: "250px",
      },
      [theme.breakpoints.down(890)]: {
        width: "220px",
      },
      [theme.breakpoints.down(800)]: {
        width: "27vw",
      },
      [theme.breakpoints.down(660)]: {
        width: "35vw",
      },
    },
    "& .MuiInputBase-input::placeholder": {
      color: "#84A391",
      //   opacity: 1,
    },
    "& .MuiInputBase-input:not(:placeholder-shown)": {
      color: "#113C23",
    },
    "& .Mui-focused": {
      border: "2px solid #4BCE82",
    },

    "& .MuiFormHelperText-root": {
      border: 0,
    },
  },
}));

const AddUserModal = ({
  showAddUserModal,
  setShowAddUserModal,
  setSuccessMsg,
}) => {
  const classes = useStyles();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [selectedValueOfRole, setSelectedValueOfRole] = useState("0");
  const [email, setEmail] = useState("");
  const [error, setError] = useState({});
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => JSON.parse(state.auth.profile));
  const groupId = _.get(profile, "group_id");
  const dispatch = useDispatch();

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 300,
        width: 347,
        marginTop: 50,
        marginLeft: -10,
      },
    },
  };

  const validateData = () => {
    if (!firstName) {
      setError({ firstName: "Please enter a first name" });
      return false;
    }
    if (!lastName) {
      setError({ lastName: "Please enter a last name" });
      return false;
    }
    if (!email) {
      setError({ email: "Please enter your email" });
      return false;
    }
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(String(email).toLowerCase())) {
      setError({ email: "Invalid Email" });
      return false;
    }
    if (!role) {
      setError({ role: "please select a role" });
      return false;
    }
    setError({});
    return true;
  };

  const handleAddUser = async () => {
    if (validateData()) {
      try {
        const obj = {
          email,
          role,
          first_name: firstName,
          last_name: lastName,
        };
        dispatch({ type: SHOW_LOADER, data: 1 });
        const result = await axios.post(
          `/groups/${groupId}/members?p=group:${groupId}`,
          obj,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        dispatch({ type: HIDE_LOADER });
        setShowAddUserModal(false);
        if (result.status === 200) {
          setSuccessMsg("New User Added Successfully!");
        }
      } catch (err) {
        dispatch({ type: HIDE_LOADER });
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
    <Modal
      open={showAddUserModal}
      className={classes.root}
      BackdropComponent={Backdrop}
      BackdropProps={{
        classes: {
          root: classes.backdrop,
        },
      }}
    >
      <Paper className={classes.paper}>
        <div className="addUserTopBar">
          <h4 className="newUserText">New User</h4>
          <div
            className="userModalCloseIcon"
            onClick={() => {
              setShowAddUserModal(false);
            }}
          >
            <Cross style={{ width: "14px", height: "14px" }} />
          </div>
        </div>
        <div className="addUser1stRow">
          <div>
            <p className="firstNameText">First Name</p>
            <TextField
              variant={"standard"}
              className={classes.textField}
              placeholder="First Name"
              fullWidth={true}
              helperText={error.firstName}
              error={Boolean(error.firstName)}
              onChange={(e) => {
                if (error.firstName) {
                  setError({});
                }
                setFirstName(e.target.value);
              }}
            />
          </div>
          <div>
            <p className="lastNameText">Last Name</p>
            <TextField
              variant={"standard"}
              className={classes.textField}
              placeholder="Last Name"
              fullWidth={true}
              helperText={error.lastName}
              error={Boolean(error.lastName)}
              onChange={(e) => {
                if (error.lastName) {
                  setError({});
                }
                setLastName(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="addUser2ndRow">
          <div>
            <p className="emailText">Email</p>
            <TextField
              variant={"standard"}
              className={classes.textField}
              placeholder="Your Email"
              fullWidth={true}
              helperText={error.email}
              error={Boolean(error.email)}
              onChange={(e) => {
                if (error.email) {
                  setError({});
                }
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <p className="userRoleText">User Role</p>
            <Select
              variant="standard"
              className={classes.select}
              value={selectedValueOfRole}
              style={{
                color: `${selectedValueOfRole !== "0" ? "#113C23" : "#84A391"}`,
              }}
              IconComponent={() => {
                return (
                  <Grid
                    className={classes.arrowContainer}
                    container
                    justify="center"
                    alignItems="center"
                  >
                    <img src={ArrowDown} alt="Down" style={{ height: "4px" }} />
                  </Grid>
                );
              }}
              onChange={(e) => {
                if (error.role) {
                  setError({});
                }
                setSelectedValueOfRole(e.target.value);
                setRole(e.target.value);
              }}
              defaultValue={"0"}
              MenuProps={MenuProps}
              inputProps={{
                classes: {
                  select:
                    selectedValueOfRole === "0" ? classes.placeholder : "",
                },
              }}
            >
              <MenuItem
                key={0}
                value={"0"}
                disabled
                className={classes.menulabels}
              >
                Select a user role
              </MenuItem>

              <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>

              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="FIELD_USER">Field User</MenuItem>
              <MenuItem value="INSPECTOR">Inspector</MenuItem>
            </Select>
            <FormHelperText style={{ color: "red" }}>
              {error.role}
            </FormHelperText>
          </div>
        </div>
        <div>
          <button className="createUserBtn" onClick={handleAddUser}>
            <p>Add User</p>
          </button>
        </div>
      </Paper>
    </Modal>
  );
};

export default AddUserModal;
