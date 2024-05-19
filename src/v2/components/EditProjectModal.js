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
import Calendar from "../../assets/v2/Calendar.svg";
import DeleteIcon from "../../assets/v2/delete.svg";
import { KeyboardDatePicker } from "@material-ui/pickers";
import _ from "lodash";
import moment from "moment";
import axios from "../../axios";
import { useDispatch, useSelector } from "react-redux";
import { withSnackbar } from "notistack";
import ConfirmationModal from "./ConfirmationModal";
import { SHOW_ERROR_MESSAGE } from "../../store/actions/v2/message";
import ApprovalModal from "./ApprovalModal";

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
  deleteBtn: {
    borderColor: theme.v2.backgrounds.redBackground,
    borderWidth: 2,
    borderStyle: 'solid',
    marginLeft: "5%",
    minWidth: window.innerWidth * 0.03,
    height: window.innerHeight * 0.06,
    backgroundColor: theme.v2.backgrounds.whiteBackground,
    color: theme.v2.backgrounds.redBackground,
    "&:hover": {
      backgroundColor: theme.v2.backgrounds.whiteBackground,

    },
  },
}));

const EditProjectModal = (props) => {
  const classes = useStyles();
  const data = _.get(props, "data");
  const [openDeleteConfirmation, setOpenDeleteConfirmtaion] = useState(false);
  const [projectName, setProjectName] = useState();
  const [contractNo, setContractNo] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [forecastStartDate, setForecastStartDate] = useState();
  const [forecastEndDate, setForecastEndDate] = useState();
  const [openApprovalModal, setOpenApprovalModal] = useState(false);
  const [actualDateApproval, setActualDateApproval] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    setOpenDeleteConfirmtaion(false);
    setProjectName(_.get(data, "project_name"));
    setContractNo(_.get(data, "contract_no"));
    setStartDate(
      moment(_.defaultTo(_.get(data, "pstartDate"), new Date())).format(
        "YYYY-MM-DD"
      )
    );
    setEndDate(
      moment(_.defaultTo(_.get(data, "pendDate"), new Date())).format(
        "YYYY-MM-DD"
      )
    );
    setForecastStartDate(
      moment(_.defaultTo(_.get(data, "pactual_start_date"), new Date())).format(
        "YYYY-MM-DD"
      )
    );
    setForecastEndDate(
      moment(_.defaultTo(_.get(data, "pactual_end_date"), new Date())).format(
        "YYYY-MM-DD"
      )
    );
    setActualDateApproval({});
  }, [data]);
  const [error, setError] = useState({});
  const isValidData = () => {
    if (!projectName) {
      setError({
        project_name: "Project Name is mandatory",
      });
      return false;
    } else if (!contractNo) {
      setError({
        contract_no: "Contract Number is mandatory",
      });
      return false;
    } else if (!startDate) {
      setError({
        start_date: "Start Date is mandatory",
      });
      return false;
    } else if (!endDate) {
      setError({
        end_date: "End Date is mandatory",
      });
      return false;
    } else if (!forecastStartDate) {
      setError({
        forecast_start_date: "Forecast Start Date is mandatory",
      });
      return false;
    } else if (!forecastEndDate) {
      setError({
        forecast_end_date: "Forecast End Date is mandatory",
      });
      return false;
    } else setError({});
    return true;
  };
  const token = useSelector((state) => state.auth.token);
  const submitEditData = async () => {
    if (isValidData()) {
      try {
        const formData = new FormData();
        if (
          moment(endDate).startOf('day').isAfter(
            moment(_.get(props, ["data", "pendDate"])).startOf('day')) || moment(endDate).startOf('day').isAfter(
              moment(_.get(props, ["data", "pendDate"])).startOf('day')
            )
        ) {

          if (!actualDateApproval || !actualDateApproval.file) {
            dispatch({
              type: SHOW_ERROR_MESSAGE,
              data:
                "Please attach approval details for changing  end date"
            });
            return;
          }
          formData.append(
            "forecast_approval",
            JSON.stringify({
              from: actualDateApproval.from,
              reason: actualDateApproval.reason,
              name: actualDateApproval.file.name,
            })
          );
          formData.append("files", actualDateApproval.file);
        }
        formData.append('project_name', projectName)
        formData.append("contract_no", contractNo);

        formData.append("start_date", moment(startDate).format("YYYY-MM-DD"));
        formData.append("end_date", moment(endDate).format("YYYY-MM-DD"));

        formData.append("actual_start_date", moment(forecastStartDate).format("YYYY-MM-DD"));
        formData.append("actual_end_date", moment(forecastEndDate).format("YYYY-MM-DD"));

        console.log(formData)

        const result = await axios.patch(
          `/projects/${data.project_Id}?p=customer:${data.customer}`,
          // {
          //   project_name: projectName,
          //   contract_no: contractNo,
          //   start_date: moment(startDate).format("YYYY-MM-DD"),
          //   end_date: moment(endDate).format("YYYY-MM-DD"),
          //   actual_start_date: moment(forecastStartDate).format("YYYY-MM-DD"),
          //   actual_end_date: moment(forecastEndDate).format("YYYY-MM-DD"),
          // },
          formData,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (result.status === 200) {
          props.refresh();
          props.enqueueSnackbar("Project Updated", { variant: "success" });
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
  const deleteProject = async () => {
    try {
      const result = await axios.delete(
        `/projects/${data.project_Id}?p=customer:${data.customer}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        props.refresh();
        props.onClose();
        props.enqueueSnackbar("Project Deleted", {
          variant: "success",
        });
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
        header={`Are you sure you want to delete this project?`}
        onConfirm={() => {
          deleteProject();
          setOpenDeleteConfirmtaion(false);
        }}
      />
      <ApprovalModal
        open={openApprovalModal}
        onClose={() => {
          setOpenApprovalModal(false);
        }}
        setApproval={setActualDateApproval}

      />
      <Modal open={props.open} className={classes.root}>
        <Paper className={classes.paper}>
          <Grid item container className={classes.firstContainer} spacing={4}>
            <Grid item xs={8} container alignItems="flex-end">
              <Typography className={classes.mainHeader}>
                Edit project
              </Typography>

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
                Edit actual end date project to your workflow by filling out the
                fields below.
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.label}>Project Name*</Typography>
              <TextField
                variant={"standard"}
                className={classes.textField}
                fullWidth={true}
                error={error.project_name}
                helperText={error.project_name}
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.label}>
                Project Contract Number*
              </Typography>
              <TextField
                variant={"standard"}
                className={classes.textField}
                fullWidth={true}
                error={error.contract_no}
                helperText={error.contract_no}
                value={contractNo}
                onChange={(e) => {
                  setContractNo(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.label}>Planned Start Date*</Typography>
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
                error={error.start_date}
                helperText={error.start_date}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.label}>Planned End Date*</Typography>
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

                    (moment(date).startOf('day').isAfter(
                      moment(_.get(props, ["data", "pendDate"])).startOf('day')
                    ) || moment(date).startOf('day').isBefore(
                      moment(_.get(props, ["data", "pendDate"])).startOf('day')
                    ))
                  ) {

                    setOpenApprovalModal(true);
                  }
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                className={classes.textField}
                keyboardIcon={<img src={Calendar} alt="calendar" />}
                error={error.end_date}
                helperText={error.end_date}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.label}>
                Forecast Start Date*
              </Typography>
              <KeyboardDatePicker
                fullWidth={true}
                autoOk={true}
                disableToolbar
                variant="inline"
                format="MM/DD/YYYY"
                id="date-picker-inline"
                value={forecastStartDate}
                placeholder="MM/DD/YYYY"
                onChange={(date) => {
                  setForecastStartDate(date.format("MM/DD/YYYY"));
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                className={classes.textField}
                keyboardIcon={<img src={Calendar} alt="calendar" />}
                error={error.forecast_start_date}
                helperText={error.forecast_start_date}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.label}>
                Forecast End Date*
              </Typography>
              <KeyboardDatePicker
                fullWidth={true}
                autoOk={true}
                disableToolbar
                variant="inline"
                format="MM/DD/YYYY"
                id="date-picker-inline"
                value={forecastEndDate}

                placeholder="MM/DD/YYYY"
                onChange={(date) => {
                  if (moment(date).startOf('day').isAfter(moment(endDate).startOf('day'))) {
                    dispatch({
                      type: SHOW_ERROR_MESSAGE,
                      data:
                        "Forecast end date cannot be after planned end date"
                    });
                    return
                  }
                  setForecastEndDate(date.format("MM/DD/YYYY"));
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                className={classes.textField}
                keyboardIcon={<img src={Calendar} alt="calendar" />}
                error={error.forecast_end_date}
                helperText={error.forecast_end_date}
              />
            </Grid>
            <Grid item xs={12} container justify="flex-end">
              <Button
                style={{ width: 180, height: 50, marginRight: 5 }}
                className={classes.deleteBtn}
                onClick={setOpenDeleteConfirmtaion.bind(this, true)}
                startIcon={<img
                  src={DeleteIcon}
                  alt="Delete Project"
                  style={{ cursor: "pointer" }}
                />}
              >
                <Typography style={{ fontSize: 18, padding: "5% 0%" }}>
                  Delete Project
                </Typography>
              </Button>
              <Button
                disableElevation
                style={{ width: 180, height: 50 }}
                onClick={submitEditData}
              >
                <Typography style={{ fontSize: 18, padding: "5% 0%" }}>
                  Save Project
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </>
  );
};

export default withSnackbar(EditProjectModal);
