import {
  Button,
  Grid,
  makeStyles,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Cross from "../../assets/v2/Cross.svg";
import DownloadFile from "../../assets/v2/DownloadFile.svg";
import DownloadFile2 from "../../assets/v2/DownloadFile2.svg";
import Download from "../../assets/v2/Download.svg";
import Upload from "../../assets/v2/Upload.svg";
import Calendar from "../../assets/v2/Calendar.svg";
import { KeyboardDatePicker } from "@material-ui/pickers";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios";
import { withSnackbar } from "notistack";
import CustomerDropdown from "./CustomerDropdown";
import _ from "lodash";
import { SHOW_ERROR_MESSAGE } from "../../store/actions/v2/message";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    borderRadius: 10,
    margin: "20% 20%",
    outline: 0,
  },
  firstContainer: {
    padding: "5% 10%",
  },
  secondContainer: {
    backgroundColor: theme.v2.backgrounds.darkBackground,
    padding: "5% 0%",
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
  downloadBtn: {
    backgroundColor: theme.v2.backgrounds.whiteBackground,
    justifyContent: "space-between",
    padding: "3% 10%",
    "&:hover": {
      backgroundColor: theme.v2.backgrounds.whiteBackground2,
    },
  },
  btnText: {
    fontSize: 18,
    color: theme.v2.fonts.colors.greenShade2,
  },
  btnError: {
    fontSize: 12,
    color: theme.v2.fonts.colors.redErrorMsg,
  },
  uploadedFileName: {
    fontSize: 12,
    color: theme.v2.fonts.colors.whiteFont,
  },
}));

const AddProjectModal = (props) => {
  const classes = useStyles();
  const [startDate, setStartDate] = useState(moment().format("MM/DD/YYYY"));
  const [endDate, setEndDate] = useState(moment().format("MM/DD/YYYY"));
  const [customer, setCustomer] = useState({});
  const [projectName, setProjectName] = useState();
  const [projectId, setProjectId] = useState();
  const [unitsFile, setUnitsFile] = useState();
  const [error, setError] = useState({});
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => JSON.parse(state.auth.profile));
  const groupId = _.get(profile, "group_id");
  const dispatch = useDispatch();

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = () => {
    setStartDate(moment().format("MM/DD/YYYY"));
    setEndDate(moment().format("MM/DD/YYYY"));
    setCustomer({});
    setProjectName();
    setProjectId();
    setUnitsFile();
    setError({});
  };

  const validateData = () => {
    if (!(customer.id || customer.value)) {
      setError({ customer: `Please select a customer` });
      return false;
    } else if (!startDate) {
      setError({ startDate: `Please select a Start Date` });
      return false;
    }
    if (!projectName) {
      setError({ projectName: `Please select a Project Name` });
      return false;
    }
    if (!endDate) {
      setError({ endDate: `Please select an End Date` });
      return false;
    }
    if (!projectId) {
      setError({ projectId: `Please select a Project Id` });
      return false;
    }
    if (!unitsFile) {
      setError({ unitsFile: `Please upload the units data` });
      return false;
    }
    setError({});
    return true;
  };

  const downloadUnitsTemplate = async () => {
    window.open(
      `${process.env.REACT_APP_API_BASE_URL}/files/project/units`.replace(
        "//f",
        "/f"
      ),
      "newTab"
    );
  };

  const setUploadedFile = (file) => {
    if (!file) {
      return;
    }
    if (file.type) {
      if (
        file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setError({ unitsFile: `Only .xlsx files are allowed` });
        return;
      }
      setUnitsFile(file);
    } else {
      let fileTemp = new File([file], file.name, {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      setUnitsFile(fileTemp);
    }
    setError({ unitsFile: null });
  };

  const createProject = async () => {
    if (validateData()) {
      const formData = new FormData();
      if (customer.id) formData.append("customer_id", customer.id);
      else formData.append("new_customer", customer.value);
      formData.append("contract_no", projectId);
      formData.append("project_name", projectName);
      formData.append("start_date", moment(startDate).format("YYYY-MM-DD"));
      formData.append("end_date", moment(endDate).format("YYYY-MM-DD"));
      formData.append("file", unitsFile);
      try {
        const url = customer.id
          ? `/projects?p=customer:${customer.id}`
          : `/projects?p=group:${groupId}`;
        const result = await axios.post(url, formData, {
          headers: {
            Authorization: token,
          },
        });
        if (result.status === 200) {
          props.refresh();
          props.enqueueSnackbar("Project Saved", {
            variant: "success",
          });
          initializeData();
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
            <Typography className={classes.mainHeader}>Add project</Typography>
          </Grid>
          <Grid item xs={4} container justify="flex-end">
            <img
              src={Cross}
              alt="Close"
              style={{ cursor: "pointer" }}
              onClick={() => {
                initializeData();
                props.onClose();
              }}
            />
          </Grid>
          <Grid item xs={12} style={{ paddingBottom: "5%", paddingTop: 0 }}>
            <Typography className={classes.paragraph}>
              Add a new project to your workflow by filling out the fields
              below.
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.label}>Customer Name*</Typography>
            <CustomerDropdown
              setValue={setCustomer}
              value={customer}
              error={error}
            />
            {/* <TextField
              variant={"standard"}
              className={classes.textField}
              fullWidth={true}
              helperText={error.customer}
              error={Boolean(error.customer)}
              onChange={(e) => {
                setCustomer(e.target.value);
              }}
            /> */}
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.label}>Start Date*</Typography>
            <KeyboardDatePicker
              fullWidth={true}
              autoOk={true}
              disableToolbar
              variant="inline"
              format="MM/DD/YYYY"
              id="date-picker-inline"
              value={startDate}
              placeholder="MM/DD/YYYY"
              onChange={(date) => {
                setStartDate(date.format("MM/DD/YYYY"));
              }}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              className={classes.textField}
              keyboardIcon={<img src={Calendar} alt="calendar" />}
              helperText={error.startDate}
              error={Boolean(error.startDate)}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.label}>Project Name*</Typography>
            <TextField
              variant={"standard"}
              className={classes.textField}
              fullWidth={true}
              helperText={error.projectName}
              error={Boolean(error.projectName)}
              onChange={(e) => {
                setProjectName(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.label}>End Date*</Typography>
            <KeyboardDatePicker
              fullWidth={true}
              autoOk={true}
              disableToolbar
              variant="inline"
              format="MM/DD/YYYY"
              id="date-picker-inline"
              value={endDate}
              placeholder="MM/DD/YYYY"
              onChange={(date) => {
                setEndDate(date.format("MM/DD/YYYY"));
              }}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              className={classes.textField}
              keyboardIcon={<img src={Calendar} alt="calendar" />}
              helperText={error.endDate}
              error={Boolean(error.endDate)}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.label}>Project ID*</Typography>
            <TextField
              variant={"standard"}
              className={classes.textField}
              fullWidth={true}
              helperText={error.projectId}
              error={Boolean(error.projectId)}
              onChange={(e) => {
                setProjectId(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={6} container justify="flex-end">
            <Button
              disableElevation
              style={{ width: 200, height: 50 }}
              onClick={createProject.bind(this)}
            >
              <Typography style={{ fontSize: 18, padding: "10% 0%" }}>
                Create Project
              </Typography>
            </Button>
          </Grid>
        </Grid>
        <Grid
          item
          container
          className={classes.secondContainer}
          justify="space-evenly"
        >
          <Grid item xs={5} container>
            <Button
              startIcon={<img src={DownloadFile} alt="File" />}
              endIcon={<img src={Download} alt="Download" />}
              className={classes.downloadBtn}
              fullWidth={true}
              onClick={downloadUnitsTemplate.bind(this)}
            >
              <Typography className={classes.btnText}>
                Download Units Template
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={5} container justify="center" alignItems="center">
            <Button
              startIcon={<img src={DownloadFile2} alt="File" />}
              endIcon={<img src={Upload} alt="Upload" />}
              className={classes.downloadBtn}
              fullWidth={true}
              onClick={() => {
                document.getElementById("unitsTemplate").click();
              }}
            >
              <Typography className={classes.btnText}>
                Attached Units
              </Typography>
            </Button>
            {error.unitsFile && (
              <Typography className={classes.btnError}>
                {error.unitsFile}
              </Typography>
            )}
            {unitsFile && (
              <Typography className={classes.uploadedFileName}>
                {unitsFile.name}
              </Typography>
            )}
            <input
              type="file"
              hidden={true}
              id="unitsTemplate"
              onChange={(e) => {
                setUploadedFile(e.target.files[0]);
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

export default withSnackbar(AddProjectModal);
