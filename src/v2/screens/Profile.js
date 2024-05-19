import {
  Grid,
  makeStyles,
  TextField,
  Typography,
  Button,
} from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios";
import _ from "lodash";
import { UPDATE_ACTION } from "../../store/actions/auth";

const width = window.outerWidth;

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "10%",
  },
  myProfileHeader: {
    fontSize: 35,
    color: theme.v2.fonts.colors.greenShade2,
  },
  label: {
    fontSize: 16,
    color: theme.v2.fonts.colors.blackShade1,
  },
  textfield: {
    height: 30,
    backgroundColor: theme.v2.backgrounds.lightBlueBackground,
    border: 0,
    borderRadius: 10,
  },
  imageContainer: {
    borderRadius: 10,
    border: `1px solid ${theme.v2.borders.lightGrey}`,
    height: width / 9,
    cursor: "pointer",
  },
  changePhotoHeader: {
    fontSize: 16,
    color: theme.v2.fonts.colors.whiteFont,
  },
  imageHeaderContainer: {
    padding: "2% 0%",
    backgroundColor: theme.v2.backgrounds.greenBackground,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  save: {
    border: 0,
    outline: 0,
    marginTop: "6%",
    fontSize: 18,
    padding: "1% 2%",
  },
}));

const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];

const Profile = (props) => {
  const classes = useStyles();
  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState({});
  const [error, setError] = useState({});
  const [change, setChange] = useState(false);
  const isValid = () => {
    console.log("called");
    if (!firstName) {
      setError({ firstName: "First Name is mandatory" });
      return false;
    } else if (!lastName) {
      setError({ lastName: "Last Name is mandatory" });
      return false;
    } else if (!mobile) {
      setError({ mobile: "Mobile Number is mandatory" });
      return false;
    } else if (!mobile) {
      setError({ mobile: "Mobile Number is mandatory" });
      return false;
    } else if (mobile.length > 10) {
      setError({
        mobile: "Mobile Number should not have more than 10 digits",
      });
      return false;
    } else if (!email) {
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
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => JSON.parse(state.auth.profile));
  const groupId = _.get(profile, "group_id");
  const dispatch = useDispatch();
  const saveChanges = async () => {
    if (change && isValid()) {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("mobile", mobile);
      formData.append("email", email);
      if (file && file.actual) {
        formData.append("file", file.actual);
      }
      try {
        const result = await axios.put(
          `/profile?p=group:${groupId}`,
          formData,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (result.status === 200) {
          const tProfile = JSON.stringify(_.get(result, ["data", "message"]));
          localStorage.setItem("profile", tProfile);
          dispatch({
            type: UPDATE_ACTION,
            profile: tProfile,
          });
        }
      } catch (err) {}
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

  const getData = useCallback(async () => {
    try {
      const result = await axios.get(`/profile?p=group:${groupId}`, {
        headers: {
          Authorization: token,
        },
      });
      if (result.status === 200) {
        const data = _.get(result, ["data", "message"]);
        setEmail(data.email || "");
        setFirstName(data.first_name || "");
        setlastName(data.last_name || "");
        setMobile(data.mobile || "");
        if (_.get(data, ["user_files", 0])) {
          setFile({
            file: _.get(data, ["user_files", 0, "file_url"]),
          });
        }
      }
    } catch (err) {}
  }, [groupId, token]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} style={{ marginBottom: "5%" }}>
        <Typography className={classes.myProfileHeader}>My Profile</Typography>
      </Grid>
      <Grid item container xs={6} spacing={4}>
        <Grid item xs={6}>
          <Typography className={classes.label}>First Name*</Typography>
          <TextField
            fullWidth={true}
            inputProps={{ maxLength: 50 }}
            className={classes.textfield}
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setChange(true);
            }}
            helperText={error.firstName && error.firstName}
            error={Boolean(error.firstName)}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.label}>Last Name*</Typography>
          <TextField
            fullWidth={true}
            inputProps={{ maxLength: 50 }}
            className={classes.textfield}
            value={lastName}
            onChange={(e) => {
              setlastName(e.target.value);
              setChange(true);
            }}
            helperText={error.lastName && error.lastName}
            error={Boolean(error.lastName)}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.label}>Mobile No*</Typography>
          <TextField
            fullWidth={true}
            type="Number"
            className={classes.textfield}
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value);
              setChange(true);
            }}
            InputProps={{
              startAdornment: (
                <Typography style={{ paddingRight: "1%" }}>+1 </Typography>
              ),
            }}
            helperText={error.mobile && error.mobile}
            error={Boolean(error.mobile)}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography className={classes.label}>Email Id*</Typography>
          <TextField
            fullWidth={true}
            inputProps={{ maxLength: 50 }}
            className={classes.textfield}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setChange(true);
            }}
            helperText={error.email && error.email}
            error={Boolean(error.email)}
          />
        </Grid>
      </Grid>
      <Grid item xs={1} />
      <Grid
        item
        container
        xs={2}
        alignItems="flex-end"
        justify="center"
        className={classes.imageContainer}
        onClick={() => {
          document.getElementById("upload").click();
        }}
      >
        {!_.isEmpty(file) && (
          <img
            src={file.file}
            alt="profile"
            style={{
              width: "100%",
              height: "100%",
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              objectFit: "contain",
            }}
          />
        )}
        <Grid
          item
          xs={12}
          container
          className={classes.imageHeaderContainer}
          justify="center"
        >
          <Typography className={classes.changePhotoHeader}>
            Change Photo
          </Typography>
        </Grid>
      </Grid>
      <input
        type="file"
        id="upload"
        hidden={true}
        accept=".jpg, .jpeg, .png, .pdf"
        onChange={(e) => {
          uploadFile(e.target.files[0]);
        }}
      />
      <Grid item xs={12}>
        <Button
          variant="outlined"
          className={classes.save}
          onClick={saveChanges}
        >
          Save Changes
        </Button>
      </Grid>
    </Grid>
  );
};

export default Profile;
