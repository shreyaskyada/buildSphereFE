import React, { useCallback, useEffect, useState } from "react";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../axios";
import _ from "lodash";
import { makeStyles, TextField } from "@material-ui/core";
import { UPDATE_ACTION } from "../../../store/actions/auth";
import Upload from "../../../assets/v2/Upload.svg";
import { HIDE_LOADER, SHOW_LOADER } from "../../../store/actions/v2/loader";
import { SHOW_ERROR_MESSAGE } from "../../../store/actions/v2/message";
import SuccessMsgModal from "../SuccessMsgModal/SuccessMsgModal";

const useStyles = makeStyles((theme) => ({
  textField: {
    "& .MuiInput-root": {
      height: "40px",
      width: "300px",
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
      color: "#1c3d5a",
    },
    "& .Mui-focused": {
      border: "2px solid #4BCE82",
    },

    "& .MuiFormHelperText-root": {
      border: 0,
    },
  },
}));

const UserProfile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [file, setFile] = useState(null);
  const [change, setChange] = useState(false);
  const [error, setError] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const dispatch = useDispatch();

  const classes = useStyles();

  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => JSON.parse(state.auth.profile));
  const groupId = _.get(profile, "group_id");

  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];

  const getData = useCallback(async () => {
    try {
      dispatch({ type: SHOW_LOADER, data: 1 });
      const result = await axios.get(`/profile?p=group:${groupId}`, {
        headers: {
          Authorization: token,
        },
      });
      dispatch({ type: HIDE_LOADER });
      if (result.status === 200) {
        const data = _.get(result, ["data", "message"]);
        setEmail(data.email || "");
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setMobile(data.mobile || "");
        setRole(data.role || "");
        if (_.get(data, ["user_files", 0])) {
          setFile({
            file: _.get(data, ["user_files", 0, "file_url"]),
          });
        }
      }
    } catch (err) {
      dispatch({ type: HIDE_LOADER });
    }
  }, [groupId, token]);

  useEffect(() => {
    getData();
  }, [getData]);

  const validateData = () => {
    if (!firstName) {
      setError({ firstName: "Please enter a first name" });
      return false;
    }
    if (!lastName) {
      setError({ lastName: "Please enter a last name" });
      return false;
    }
    if (!mobile) {
      setError({ mobile: "Please enter a mobile number" });
      return false;
    }
    if (mobile.length > 10) {
      setError({
        mobile: "Mobile Number should not have more than 10 digits",
      });
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

    setError({});
    return true;
  };

  const handleSaveUser = async () => {
    if (change && validateData()) {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("mobile", mobile);
      formData.append("email", email);
      if (file && file.actual) {
        formData.append("file", file.actual);
      }
      try {
        dispatch({ type: SHOW_LOADER, data: 1 });
        const result = await axios.put(
          `/profile?p=group:${groupId}`,
          formData,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        dispatch({ type: HIDE_LOADER });
        setChange(false);
        if (result.status === 200) {
          setSuccessMsg("Your Changes have been saved successfully!");
          const tProfile = JSON.stringify(_.get(result, ["data", "message"]));
          localStorage.setItem("profile", tProfile);
          dispatch({
            type: UPDATE_ACTION,
            profile: tProfile,
          });
        }
      } catch (err) {
        setChange(false);
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

  const uploadFile = (file) => {
    if (file && allowedFileTypes.includes(file.type)) {
      const fileObj = {
        file: URL.createObjectURL(file),
        actual: file,
      };
      setFile(fileObj);
      setChange(true);
    }
  };

  return (
    <div className="userProfileContainer">
      <div className="userProfileBody">
        <div>
          <div className="userProfileData1stRow">
            <div>
              <p className="userFirstName">First Name*</p>
              <TextField
                variant={"standard"}
                className={classes.textField}
                placeholder="First Name"
                value={firstName}
                fullWidth={true}
                helperText={error.firstName}
                error={Boolean(error.firstName)}
                onChange={(e) => {
                  if (error.firstName) {
                    setError({});
                  }
                  setChange(true);
                  setFirstName(e.target.value);
                }}
              />
            </div>
            <div>
              <p className="userLastName">Last Name*</p>
              <TextField
                variant={"standard"}
                className={classes.textField}
                placeholder="Last Name"
                value={lastName}
                fullWidth={true}
                helperText={error.lastName}
                error={Boolean(error.lastName)}
                onChange={(e) => {
                  if (error.lastName) {
                    setError({});
                  }
                  setChange(true);
                  setLastName(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="userProfileData2ndRow">
            <div>
              <p className="userEmail">Mobile no.*</p>
              <TextField
                variant={"standard"}
                className={classes.textField}
                placeholder="Your Mobile Number"
                value={mobile}
                fullWidth={true}
                helperText={error.mobile}
                error={Boolean(error.mobile)}
                onChange={(e) => {
                  if (error.mobile) {
                    setError({});
                  }
                  setChange(true);
                  setMobile(e.target.value);
                }}
              />
            </div>
            <div>
              <p className="userEmail">Email Id*</p>
              <TextField
                variant={"standard"}
                className={classes.textField}
                placeholder="Your Email"
                value={email}
                fullWidth={true}
                helperText={error.email}
                error={Boolean(error.email)}
                onChange={(e) => {
                  if (error.email) {
                    setError({});
                  }
                  setChange(true);
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div>
              <p className="userRole">Role</p>
              <div className="userRoleBox">
                {role !== "" &&
                  (role === "SUPER_ADMIN" ? "Super Admin" : "Admin")}
              </div>
            </div>
          </div>
          <div>
            <button className="saveUserBtn" onClick={handleSaveUser}>
              <p>Save Changes</p>
            </button>
          </div>
        </div>
        <div>
          {!file && (
            <div>
              {" "}
              <div
                className="uploadPhoto"
                onClick={() => {
                  document.getElementById("upload").click();
                }}
              >
                <img src={Upload} alt="Upload" style={{ height: "33px" }} />
                <span>Upload Photo</span>
              </div>
              <input
                type="file"
                id="upload"
                hidden={true}
                accept=".jpg, .jpeg, .png, .pdf"
                onChange={(e) => {
                  uploadFile(e.target.files[0]);
                }}
              />
            </div>
          )}
          {file && (
            <div>
              <img
                src={file.file}
                alt="profile"
                style={{
                  width: "200px",
                  height: "170px",
                  objectFit: "contain",
                }}
              />

              <button
                className="changePhotoBtn"
                onClick={() => {
                  document.getElementById("upload").click();
                }}
              >
                <p>Change Photo</p>
              </button>
              <input
                type="file"
                id="upload"
                hidden={true}
                accept=".jpg, .jpeg, .png, .pdf"
                onChange={(e) => {
                  uploadFile(e.target.files[0]);
                }}
              />
            </div>
          )}
        </div>
        {successMsg !== "" && (
          <SuccessMsgModal
            successMsg={successMsg}
            setSuccessMsg={setSuccessMsg}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
