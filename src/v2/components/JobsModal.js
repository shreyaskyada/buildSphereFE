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
import { KeyboardDatePicker } from "@material-ui/pickers";
import React, { useCallback, useEffect, useState } from "react";
import Cross from "../../assets/v2/Cross.svg";
import Calendar from "../../assets/v2/Calendar.svg";
import DownloadFile from "../../assets/v2/DownloadFile.svg";
import DownloadFile2 from "../../assets/v2/DownloadFile2.svg";
import Download from "../../assets/v2/Download.svg";
import Upload from "../../assets/v2/Upload.svg";
import _ from "lodash";
import axios from "../../axios";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import ApprovalModal from "./ApprovalModal";
import ConfirmationModal from "./ConfirmationModal";
import DeleteIcon from "../../assets/v2/DeleteIcon.svg";
import { SHOW_ERROR_MESSAGE } from "../../store/actions/v2/message";
import { SHOW_LOADER } from "../../store/actions/v2/loader";

const useStyles = makeStyles((theme) => ({
  root: {
    border: 0,
    outline: "none",
  },
  paper: {
    outline: "none",
    margin: "5% 20%",
    borderRadius: 10,
  },
  header: {
    fontSize: 26,
    color: theme.v2.fonts.colors.greenShade2,
  },
  para: {
    fontSize: 15,
    fontWeight: 600,
    color: theme.v2.fonts.colors.darkFont2,
  },
  creatJobText: {
    padding: "2% 2%",
    fontSize: 18,
    color: theme.v2.fonts.colors.whiteFont,
  },
  createJobBtn: {
    minWidth: 300,
    border: 0,
  },
  footer: {
    backgroundColor: theme.v2.backgrounds.darkBackground,
  },
  label: {
    fontSize: 15,
    fontWeight: 600,
    color: theme.v2.fonts.colors.darkFont2,
  },
  textfield: {
    "& .MuiInput-root": {
      backgroundColor: theme.v2.backgrounds.whiteBackground,
      border: `1px solid ${theme.v2.borders.darkShade2}`,
      fontSize: 12,
      color: theme.v2.fonts.colors.darkFont,
      height: 36,
    },
    "& .Mui-focused": {
      border: `2px solid ${theme.v2.borders.lightGreen}`,
    },
    "& .MuiFormHelperText-root": {
      border: 0,
    },
  },
  disabledTextfield: {
    "& .MuiInput-root": {
      backgroundColor: theme.v2.backgrounds.greyBackground3,
      border: `1px solid ${theme.v2.borders.darkShade2}`,
      fontSize: 12,
      color: theme.v2.fonts.colors.darkFont,
      height: 36,
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
  deleteBtn: {
    backgroundColor: theme.v2.backgrounds.redBackground,
    marginLeft: "5%",
    minWidth: window.innerWidth * 0.03,
    height: window.innerHeight * 0.06,
    "&:hover": {
      backgroundColor: theme.v2.backgrounds.redBackground,
    },
  },
}));

const JobsModal = (props) => {
  const editMode = props.edit;
  const classes = useStyles();
  const [error, setError] = useState({});
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [forecastDate, setForecastDate] = useState(moment());
  const [actualDate, setActualDate] = useState(moment());
  const [unitsFile, setUnitsFile] = useState();
  const [status, setStatus] = useState("Ongoing");
  const [jobNumber, setJobNumber] = useState("");
  const token = useSelector((state) => state.auth.token);
  const [openApprovalModal, setOpenApprovalModal] = useState(false);
  const [approvalType, setApprovalType] = useState();
  const [actualDateApproval, setActualDateApproval] = useState({});
  const [forecastDateApproval, setForecastDateApproval] = useState({});
  const [openDeleteConfirmation, setOpenDeleteConfirmtaion] = useState(false);
  const dispatch = useDispatch();
  const initializeData = useCallback(() => {
    setStartDate(
      editMode ? moment(_.get(props, ["editData", "start_date"])) : moment()
    );
    setEndDate(
      editMode ? moment(_.get(props, ["editData", "end_date"])) : moment()
    );
    setForecastDate(
      editMode ? moment(_.get(props, ["editData", "forecast_date"])) : moment()
    );
    setActualDate(
      editMode ? moment(_.get(props, ["editData", "actual_date"])) : moment()
    );
    setUnitsFile([]);
    setStatus(editMode ? _.get(props, ["editData", "status"]) : "Ongoing");
    setJobNumber(editMode ? _.get(props, ["editData", "job_name"]) : "");
    setOpenApprovalModal(false);
    setApprovalType();
    setActualDateApproval({});
    setForecastDateApproval({});
  }, [props, editMode]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const downloadUnitsTemplate = async () => {
    try {
      const result = await axios.get(
        `/projects/${props.projectId}/units?p=project:${props.projectId}`,
        {
          headers: {
            Authorization: token,
          },
          responseType: "blob",
        }
      );
      if (result.status === 200) {
        const url = URL.createObjectURL(new Blob([_.get(result, "data")]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "job_units.xlsx");
        document.body.appendChild(link);
        link.click();
      }
    } catch (err) { }
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

  const validateData = () => {
    if (!startDate) {
      setError({
        startDate: `This field is mandatory`,
      });
      return false;
    }
    if (!endDate) {
      setError({
        endDate: `This field is mandatory`,
      });
      return false;
    }
    if (!status) {
      setError({
        status: `This field is mandatory`,
      });
      return false;
    }
    if (!forecastDate) {
      setError({
        forecastDate: `This field is mandatory`,
      });
      return false;
    }
    if (!jobNumber) {
      setError({
        jobNumber: `This field is mandatory`,
      });
      return false;
    }
    if (!actualDate) {
      setError({
        actualDate: `This field is mandatory`,
      });
      return false;
    }
    if (!editMode && (!unitsFile || unitsFile.length === 0)) {
      setError({
        unitsFile: `Please upload units file`,
      });
      return false;
    }
    setError({});
    return true;
  };

  const addData = async () => {
    if (validateData()) {
      const formData = new FormData();
      formData.append("project_id", props.projectId);
      formData.append("job_name", jobNumber);
      formData.append("status", status);
      formData.append("start_date", moment(startDate).format("YYYY-MM-DD"));
      formData.append("end_date", moment(endDate).format("YYYY-MM-DD"));
      formData.append(
        "forecast_date",
        moment(forecastDate).format("YYYY-MM-DD")
      );
      formData.append("actual_date", moment(actualDate).format("YYYY-MM-DD"));
      formData.append("file", unitsFile);
      try {
        const result = await axios.post(
          `/jobs?p=project:${props.projectId}`,
          formData,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (result.status === 200) {
          props.success();
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

  const editData = async () => {
    if (validateData()) {
      const formData = new FormData();
      formData.append("project_id", props.projectId);
      formData.append("job_name", jobNumber);
      formData.append("status", status);
      formData.append("start_date", moment(startDate).format("YYYY-MM-DD"));
      formData.append("end_date", moment(endDate).format("YYYY-MM-DD"));
      formData.append(
        "forecast_date",
        moment(forecastDate).format("YYYY-MM-DD")
      );
      if (
        moment(endDate).startOf('day').isAfter(
          moment(_.get(props, ["editData", "end_date"])).startOf('day')) || moment(endDate).startOf('day').isAfter(
            moment(_.get(props, ["editData", "end_date"])).startOf('day')
          )
      ) {

        if (!forecastDateApproval || !forecastDateApproval.file) {
          dispatch({
            type: SHOW_ERROR_MESSAGE,
            data:
              "Please attach approval details for changing planned end date"
          });
          return;
        }
        formData.append(
          "forecast_approval",
          JSON.stringify({
            from: forecastDateApproval.from,
            reason: forecastDateApproval.reason,
            name: forecastDateApproval.file.name,
          })
        );
        formData.append("files", forecastDateApproval.file);
      }
      formData.append("actual_date", moment(actualDate).format("YYYY-MM-DD"));
      if (
        moment(actualDate).isAfter(
          moment(_.get(props, ["editData", "actual_date"]))
        )
      ) {
        formData.append(
          "actual_approval",
          JSON.stringify({
            from: actualDateApproval.from,
            reason: actualDateApproval.reason,
            name: actualDateApproval.file.name,
          })
        );
        formData.append("files", actualDateApproval.file);
      }
      try {
        dispatch({ type: SHOW_LOADER });
        const result = await axios.patch(
          `/jobs/${_.get(props, ["editData", "id"])}?p=project:${props.projectId
          }`,
          formData,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (result.status === 200) {
          props.success();
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

  const deleteJob = async () => {
    try {
      const result = await axios.delete(
        `/jobs/${_.get(props, ["editData", "id"])}?p=project:${props.projectId
        }`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        props.success();
        props.onClose();
      }
    } catch (err) {
      dispatch({
        type: SHOW_ERROR_MESSAGE,
        data:
          _.get(err, ["response", "data", "message"]) || "Something went wrong",
      });
    }
  };

  return (
    <>
      <ConfirmationModal
        open={openDeleteConfirmation}
        onCancel={() => {
          setOpenDeleteConfirmtaion(false);
        }}
        header={`Are you sure you want to delete this job?`}
        onConfirm={() => {
          deleteJob();
          setOpenDeleteConfirmtaion(false);
        }}
      />
      <ApprovalModal
        open={editMode && openApprovalModal}
        onClose={() => {
          setOpenApprovalModal(false);
        }}
        setApproval={
          approvalType === "forecastDate"
            ? setForecastDateApproval
            : setActualDateApproval
        }
      />
      <Modal open={props.open} className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container spacing={3} style={{ padding: "5%" }}>
            <Grid item xs={6} container alignItems="center">
              <Typography className={classes.header}>
                {props.edit ? "Edit" : "Add"} Job
              </Typography>
              {props.edit && (
                <Button
                  className={classes.deleteBtn}
                  onClick={setOpenDeleteConfirmtaion.bind(this, true)}
                >
                  <img
                    src={DeleteIcon}
                    alt="Delete Project"
                    style={{ cursor: "pointer" }}
                  />
                </Button>
              )}
            </Grid>
            <Grid item xs={6} container justify="flex-end">
              <img
                src={Cross}
                alt="Close"
                style={{ cursor: "pointer" }}
                onClick={props.onClose}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.para}>
                {props.edit
                  ? "Edit the existing job to your workflow by filling out the fields below"
                  : "Add a new job to your workflow by filling out the fields below"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.label}>Customer Name*</Typography>
              <TextField
                disabled={true}
                fullWidth={true}
                value={_.get(props, "customer", "")}
                className={classes.disabledTextfield}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.label}>
                Planned Start Date
              </Typography>
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
                className={classes.textfield}
                keyboardIcon={<img src={Calendar} alt="calendar" />}
                helperText={error.startDate && error.startDate}
                error={!_.isEmpty(error.startDate)}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.label}>Project ID*</Typography>
              <TextField
                disabled={true}
                fullWidth={true}
                helperText={error.projectId && error.projectId}
                error={!_.isEmpty(error.projectId)}
                className={classes.disabledTextfield}
                value={_.get(props, "contractNo", "")}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.label}>
                Planned End Date
              </Typography>
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
                  if (
                    editMode &&
                    (moment(date).startOf('day').isAfter(
                      moment(_.get(props, ["editData", "end_date"])).startOf('day')
                    ) || moment(date).startOf('day').isBefore(
                      moment(_.get(props, ["editData", "end_date"])).startOf('day')
                    ))
                  ) {
                    setApprovalType("forecastDate");
                    setOpenApprovalModal(true);
                  }
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                className={classes.textfield}
                keyboardIcon={<img src={Calendar} alt="calendar" />}
                helperText={error.endDate && error.endDate}
                error={!_.isEmpty(error.endDate)}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.label}>Status*</Typography>
              <TextField
                select={true}
                fullWidth={true}
                helperText={error.status && error.status}
                error={!_.isEmpty(error.status)}
                className={classes.textfield}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
                value={status}
              >
                <MenuItem value="Ongoing">Ongoing</MenuItem>
                {props.edit && <MenuItem value="Cancelled">Cancelled</MenuItem>}
                {props.edit && <MenuItem value="Completed">Completed</MenuItem>}
                {props.edit && <MenuItem value="On Hold">On Hold</MenuItem>}
                {props.edit && <MenuItem value="Overdue">Overdue</MenuItem>}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.label}>
                Forecast Completion Date
              </Typography>
              <KeyboardDatePicker
                fullWidth={true}
                autoOk={true}
                disableToolbar
                variant="inline"
                format="MM/DD/YYYY"
                id="date-picker-inline"
                value={forecastDate}
                placeholder="MM/DD/YYYY"
                onChange={(date) => {
                  setForecastDate(date.format("MM/DD/YYYY"));

                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                className={classes.textfield}
                keyboardIcon={<img src={Calendar} alt="calendar" />}
                helperText={error.forecastDate && error.forecastDate}
                error={!_.isEmpty(error.forecastDate)}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.label}>Job Number*</Typography>
              <TextField
                fullWidth={true}
                helperText={error.jobNumber && error.jobNumber}
                error={!_.isEmpty(error.jobNumber)}
                className={classes.textfield}
                value={jobNumber}
                onChange={(e) => {
                  setJobNumber(e.target.value);
                }}
              />
            </Grid>
            {/* <Grid item xs={6}>
              <Typography className={classes.label}>Actual Date*</Typography>
              <KeyboardDatePicker
                fullWidth={true}
                autoOk={true}
                disableToolbar
                variant="inline"
                format="MM/DD/YYYY"
                id="date-picker-inline"
                value={actualDate}
                placeholder="MM/DD/YYYY"
                onChange={(date) => {
                  setActualDate(date.format("MM/DD/YYYY"));
                  if (
                    editMode &&
                    moment(date).isAfter(
                      moment(_.get(props, ["editData", "actual_date"]))
                    )
                  ) {
                    setApprovalType("actualDate");
                    setOpenApprovalModal(true);
                  }
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                className={classes.textfield}
                keyboardIcon={<img src={Calendar} alt="calendar" />}
                helperText={error.actualDate && error.actualDate}
                error={!_.isEmpty(error.actualDate)}
              />
            </Grid> */}
            <Grid item xs={12} container justify="flex-end">
              <Button
                variant="outlined"
                className={classes.createJobBtn}
                onClick={editMode ? editData : addData}
              >
                <Typography className={classes.creatJobText}>
                  {editMode ? "Complete Submission" : "Create Job"}
                </Typography>
              </Button>
            </Grid>
          </Grid>
          {!editMode && (
            <Grid
              item
              container
              className={classes.footer}
              justify="space-evenly"
              style={{ padding: "5% 0%" }}
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
                    Upload Units
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
          )}
        </Paper>
      </Modal>
    </>
  );
};

export default JobsModal;
