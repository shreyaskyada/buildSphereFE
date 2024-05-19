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
import React, { useCallback, useEffect, useState } from "react";
import DefaultImage from "../../assets/v2/DefaultImageIcon.svg";
import _ from "lodash";
import axios from "../../axios";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import DeleteIcon from "../../assets/v2/DeleteIcon.svg";
import ConfirmationModal from "./ConfirmationModal";
import { SHOW_ERROR_MESSAGE } from "../../store/actions/v2/message";
import { SHOW_LOADER } from "../../store/actions/v2/loader";
import { Autocomplete } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    outline: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "auto",
  },
  root2: {
    outline: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    overflow: "auto",
    marginTop: "5%",
  },
  paper: {
    outline: "none",
    borderRadius: 10,
    margin: "5% 20%",
    padding: "5% 5% 2% 5%",
  },
  paper2: {
    outline: "none",
    borderRadius: 10,
    margin: "5% 20%",
    padding: "2% 5% 2% 5%",
  },
  header: {
    fontSize: 26,
    color: theme.v2.fonts.colors.greenShade2,
  },
  label: {
    fontSize: 15,
    color: theme.v2.fonts.colors.darkFont2,
  },
  textfield: {
    "& .MuiInput-root": {
      border: `1px solid ${theme.v2.borders.lightGrey3}`,
      backgroundColor: theme.v2.fonts.colors.whiteFont,
      borderRadius: 5,
      fontSize: 14,
      maxHeight: 35,
    },
    "& .Mui-focused": {
      border: `2px solid ${theme.v2.borders.lightGreen}`,
    },
    "& .MuiFormHelperText-root": {
      border: 0,
    },
  },
  primaryImageContainer: {
    backgroundColor: theme.v2.backgrounds.greyBackground3,
    borderRadius: 10,
    cursor: "pointer",
    position: "relative",
  },
  primaryImage: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
  primaryDefaultImage: {},
  uploadImgText: {
    fontSize: 16,
    color: theme.v2.fonts.colors.greyShade2,
  },
  secondaryImageContainer: {
    backgroundColor: theme.v2.backgrounds.greyBackground3,
    borderRadius: 10,
    height: "23%",
    cursor: "pointer",
  },
  secondaryImage: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
  secondaryDefaultImageBtn: {
    height: "100%",
    backgroundColor: theme.v2.backgrounds.greyBackground3,
    "&:hover": {
      backgroundColor: theme.v2.backgrounds.greyBackground3,
    },
  },
  secondaryDefaultUnclicked: {
    border: 0,
  },
  secondaryDefaultClicked: {
    "&.MuiButton-outlined": {
      border: `3px solid ${theme.v2.borders.greenShade1}`,
    },
  },
  cancelBtn: {
    fontSize: 18,
    fontWeight: 400,
    padding: "1% 5%",
    border: 0,
    outline: 0,
    backgroundColor: theme.v2.backgrounds.greyBackground3,
    marginRight: "5%",
    "&:hover": {
      backgroundColor: theme.v2.backgrounds.lightGreyBackground,
    },
  },
  confirmBtn: {
    fontSize: 18,
    fontWeight: 400,
    padding: "1% 5%",
    border: 0,
    outline: 0,
    marginRight: "5%",
  },
  text: {
    fontSize: 18,
    fontWeight: 400,
    marginBottom: "5%",
  },
  imgBtn: {
    maxWidth: "100%",
    maxHeight: "100%",
    backgroundColor: theme.v2.backgrounds.greyBackground3,
    border: 0,
  },
  deleteBtn: {
    position: "absolute",
    bottom: "5%",
    right: "5%",
    padding: "5%",
    backgroundColor: theme.v2.backgrounds.darkBackgroundShade3,
    borderRadius: 10,
    cursor: "pointer",
  },
  deleteBtn2: {
    backgroundColor: theme.v2.backgrounds.redBackground,
    marginLeft: "5%",
    minWidth: window.innerWidth * 0.03,
    height: window.innerHeight * 0.06,
    "&:hover": {
      backgroundColor: theme.v2.backgrounds.redBackground,
    },
  },
  searchableDropdown: {
    "& .MuiInputBase-root": {
      height: 55,
    },
  },
}));

const ActivityDetailsModal = (props) => {
  const classes = useStyles();
  const jobsData = useSelector((state) => state.jobs);
  const dispatch = useDispatch();
  const edit = props.edit;
  const [error, setError] = useState({});
  const projectId = _.get(props, "projectId");
  const jobList = _.defaultTo(jobsData, []);
  const [job, setJob] = useState("");
  const [sheet, setSheet] = useState("");
  const [ld, setLd] = useState("");
  const [unit, setUnit] = useState("");

  const [defaultUnits, setDefaultUnits] = useState([]);
  const [units, setUnits] = useState([]);
  const [prevUnit, setPrevUnit] = useState();
  const [qty, setQty] = useState("");
  const [startDistance, setStartDistance] = useState("");
  const [stopDistance, setStopDistance] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [openDeleteConfirmation, setOpenDeleteConfirmtaion] = useState(false);
  const [showDefaultUnitsModal, setShowDefaultUnitsModal] = useState(false);
  const token = useSelector((state) => state.auth.token);

  const initializeData = useCallback(() => {
    setJob(_.defaultTo(_.get(jobList, [0, "id"]), ""));
    setSheet(_.defaultTo(_.get(props, ["data", "sheet_no"]), ""));
    setLd(_.defaultTo(_.get(props, ["data", "ld_no"]), ""));
    setUnit(_.defaultTo(_.get(props, ["data", "unit_id"]), ""));
    setPrevUnit(_.defaultTo(_.get(props, ["data", "unit_id"]), ""));
    setQty(
      _.get(props, ["data", "start_distance"])
        ? ""
        : _.get(props, ["data", "qty"])
    );
    setStartDistance(_.defaultTo(_.get(props, ["data", "start_distance"]), ""));
    setStopDistance(_.defaultTo(_.get(props, ["data", "stop_distance"]), ""));
    setSelectedFileIndex(0);
    let tFiles = [];
    if (_.get(props, ["data", "files"])) {
      const fileSplit = _.get(props, ["data", "files"]).split("|");
      fileSplit.forEach((file) => {
        tFiles.push({
          original: file,
          keep: true,
          file,
        });
      });
    }
    let length = 0;
    tFiles.forEach((file) => {
      if (file && file.keep) length++;
    });
    while (length < 4) {
      tFiles.push({ default: DefaultImage, keep: true });
      length++;
    }
    setFiles(tFiles);
  }, [jobList, props]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const validateFields = () => {
    if (!sheet) {
      setError({ sheet: "Sheet is mandatory" });
      return false;
    }
    if (!job) {
      setError({ job: "Job is mandatory" });
      return false;
    }
    if (!ld) {
      setError({ ld: "LD is mandatory" });
      return false;
    }
    if (!unit) {
      setError({ unit: "Unit is mandatory" });
      return false;
    }
    if (
      (!qty && (!startDistance || !stopDistance)) ||
      (qty && (startDistance || stopDistance))
    ) {
      setError({
        qty: "Either add Quantity or Reel Cut Start and Reel Cut End",
      });
      return false;
    }
    setError({});
    return true;
  };
  const submitData = async () => {
    if (validateFields()) {
      dispatch({ type: SHOW_LOADER });
      const formData = new FormData();
      formData.append("project_id", projectId);
      formData.append("job_id", job);
      formData.append("ld_no", ld);
      formData.append("sheet_no", sheet);
      formData.append("unit_id", unit);
      formData.append("created_by", _.get(props, ["data", "created_by"]));
      // eslint-disable-next-line
      if (unit != prevUnit) formData.append("prev_unit_id", prevUnit);
      if (qty) formData.append("planned_qty", qty);
      if (startDistance) formData.append("start_distance", startDistance);
      if (stopDistance) formData.append("stop_distance", stopDistance);
      const filesToRemove = [];
      files.forEach((file) => {
        if (!file.file && file.original) filesToRemove.push(file.original);
        if (file.keep && !file.default && !file.original)
          formData.append("files", file.actual);
      });
      formData.append("remove_files", JSON.stringify(filesToRemove));
      try {
        let result;
        if (edit) {
          result = await axios.patch(
            `/actuals/${props.data.id}?p=project:${projectId}`,
            formData,
            {
              headers: {
                Authorization: token,
              },
            }
          );
        } else
          result = await axios.post(
            `/actuals?p=project:${projectId}`,
            formData,
            {
              headers: {
                Authorization: token,
              },
            }
          );
        if (result.status === 200) {
          props.refresh();
          props.onClose();
        }
      } catch (err) {}
    }
  };
  const addFile = (file) => {
    if (file.type) {
      const fileObj = {
        file: URL.createObjectURL(file),
        keep: true,
        actual: file,
        default: false,
      };
      files[selectedFileIndex] = fileObj;
      setFiles([...files]);
    }
  };
  const removeFile = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (_.get(files, selectedFileIndex)) {
      files[selectedFileIndex].default = DefaultImage;
      files[selectedFileIndex].file = null;
    }
    setFiles((files) => [...files]);
  };
  const profile = useSelector((state) => JSON.parse(state.auth.profile));
  const groupId = _.get(profile, "group_id");
  const getUnits = useCallback(async () => {
    try {
      const result = await axios.get(
        `/groups/${groupId}/units?p=group:${groupId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        setUnits(
          _.get(result, ["data", "message"], []).map((unit) => {
            return {
              id: _.get(unit, "unit_id"),
              value: _.get(unit, ["unit", "unit_name"]),
            };
          })
        );
      }
    } catch (err) {}
  }, [token, groupId]);
  const getDefaultUnits = useCallback(async () => {
    try {
      const result = await axios.get(
        `/accountinfo/default-units?p=group:${groupId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        setDefaultUnits(_.get(result, ["data", "message"]) || []);
      }
    } catch (err) {
      console.log(err);
    }
  }, [token, groupId]);
  useEffect(() => {
    getUnits();
  }, [getUnits]);

  const deleteActivity = async () => {
    try {
      const result = await axios.delete(
        `/actuals/${_.get(props, ["data", "id"])}?p=project:${
          props.projectId
        }&unit_id=${_.get(props, ["data", "unit_id"])}&created_by=${_.get(
          props,
          ["data", "created_by"]
        )}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        props.refresh();
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
  let tUnit;
  return (
    <>
      <Modal open={showDefaultUnitsModal} className={classes.root2}>
        <Paper className={classes.paper2}>
          <Grid container style={{ padding: "2%" }}>
            <Typography className={classes.text}>Select a unit</Typography>
            <Autocomplete
              options={defaultUnits || []}
              getOptionLabel={(option) => {
                if (!option) console.log(option);
                return option.unit_name || "";
              }}
              getOptionSelected={(option, value) => {
                if (option.id === value.id) {
                  tUnit = option;
                }
              }}
              value={tUnit}
              style={{ width: 300, marginBottom: "5%" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className={classes.searchableDropdown}
                  label="Select Unit"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid container style={{ padding: "2%" }}>
            <Grid item xs={5}>
              <Button
                fullwidth={"true"}
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  width: 110,
                  border: 0,
                  borderRadius: 5,
                  outline: 0,
                  backgroundColor: "#E2E2E2",
                  "&:hover": {
                    backgroundColor: "#E2E2E2",
                  },
                }}
                onClick={() => {
                  setShowDefaultUnitsModal(false);
                }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={5}>
              <Button
                fullwidth={"true"}
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  width: 110,
                  borderRadius: 5,
                  border: 0,
                  outline: 0,
                }}
                onClick={() => {
                  setShowDefaultUnitsModal(false);
                  setUnits((prev) => {
                    if (prev[0].new) {
                      prev[0] = {
                        id: _.get(tUnit, "id"),
                        value: _.get(tUnit, "unit_name"),
                        new: true,
                      };
                      return [...prev];
                    } else
                      return [
                        {
                          id: _.get(tUnit, "id"),
                          value: _.get(tUnit, ["unit_name"]),
                          new: true,
                        },
                        ...prev,
                      ];
                  });
                  setUnit(_.get(tUnit, ["id"]));
                }}
              >
                Select
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
      <ConfirmationModal
        open={openDeleteConfirmation}
        onCancel={() => {
          setOpenDeleteConfirmtaion(false);
        }}
        header={`Are you sure you want to delete this Activity?`}
        onConfirm={() => {
          deleteActivity();
          setOpenDeleteConfirmtaion(false);
        }}
      />
      <Modal open={props.open} className={classes.root}>
        <Paper className={classes.paper}>
          <input
            hidden={true}
            id="upload"
            type="file"
            accept=".jpg, .jpeg, .png, .pdf"
            onChange={(e) => {
              addFile(e.target.files[0]);
            }}
          />
          <Grid container spacing={6}>
            <Grid item container xs={6}>
              <Grid item container xs={12} style={{ paddingBottom: "5%" }}>
                <Typography className={classes.header}>
                  {edit ? "Edit" : "New"} Activity Details
                </Typography>
                {edit && (
                  <Button
                    className={classes.deleteBtn2}
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
              <Grid item xs={12} style={{ paddingBottom: "5%" }}>
                <Typography className={classes.label}>Job*</Typography>
                <TextField
                  select={true}
                  fullWidth={true}
                  variant="standard"
                  value={job}
                  onChange={(e) => {
                    setJob(e.target.value);
                  }}
                  className={classes.textfield}
                  helperText={error.job && error.job}
                  error={!_.isEmpty(error.job)}
                >
                  {jobList.map((job, index) => {
                    return (
                      <MenuItem key={index} value={job.id}>
                        {job.job_name}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Grid>
              <Grid item xs={12} style={{ paddingBottom: "5%" }}>
                <Typography className={classes.label}>Sheet*</Typography>
                <TextField
                  fullWidth={true}
                  variant="standard"
                  value={sheet}
                  className={classes.textfield}
                  helperText={error.sheet && error.sheet}
                  error={!_.isEmpty(error.sheet)}
                  onChange={(e) => {
                    setSheet(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} style={{ paddingBottom: "5%" }}>
                <Typography className={classes.label}>LD*</Typography>
                <TextField
                  fullWidth={true}
                  variant="standard"
                  value={ld}
                  className={classes.textfield}
                  helperText={error.ld && error.ld}
                  error={!_.isEmpty(error.ld)}
                  onChange={(e) => {
                    setLd(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} style={{ paddingBottom: "5%" }}>
                <Typography className={classes.label}>Unit*</Typography>
                <TextField
                  select={true}
                  fullWidth={true}
                  value={unit}
                  variant="standard"
                  className={classes.textfield}
                  helperText={error.unit && error.unit}
                  error={!_.isEmpty(error.unit)}
                  onChange={(e) => {
                    // eslint-disable-next-line
                    if (e.target.value != -1) setUnit(e.target.value);
                    else {
                      getDefaultUnits();
                      setShowDefaultUnitsModal(true);
                    }
                  }}
                >
                  {units.map((unit, index) => {
                    return (
                      <MenuItem key={index} value={unit.id}>
                        {unit.value}
                      </MenuItem>
                    );
                  })}
                  {
                    <MenuItem key={-1} value={-1}>
                      <b style={{ color: "#04A349" }}>+ More Units</b>
                    </MenuItem>
                  }
                </TextField>
              </Grid>
              <Grid item xs={12} style={{ paddingBottom: "5%" }}>
                <Typography className={classes.label}>Quantity</Typography>
                <TextField
                  type="number"
                  fullWidth={true}
                  value={qty}
                  variant="standard"
                  className={classes.textfield}
                  helperText={error.qty && error.qty}
                  error={!_.isEmpty(error.qty)}
                  onChange={(e) => {
                    setQty(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} style={{ paddingBottom: "5%" }}>
                <Typography className={classes.label}>
                  Reel Cut Start(ft)
                </Typography>
                <TextField
                  type="number"
                  fullWidth={true}
                  variant="standard"
                  value={startDistance}
                  className={classes.textfield}
                  helperText={error.start_distance && error.start_distance}
                  error={!_.isEmpty(error.start_distance)}
                  onChange={(e) => {
                    setStartDistance(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography className={classes.label}>
                  Reel Cut End(ft)
                </Typography>
                <TextField
                  type="number"
                  fullWidth={true}
                  value={stopDistance}
                  variant="standard"
                  className={classes.textfield}
                  helperText={error.stop_distance && error.stop_distance}
                  error={!_.isEmpty(error.stop_distance)}
                  onChange={(e) => {
                    setStopDistance(e.target.value);
                  }}
                />
              </Grid>
            </Grid>
            <Grid item container xs={6} justify="space-evenly">
              <Grid
                item
                xs={8}
                container
                justify="center"
                alignItems="center"
                className={classes.primaryImageContainer}
                onClick={() => {
                  document.getElementById("upload").click();
                }}
              >
                {_.get(files, [selectedFileIndex, "keep"]) &&
                  _.get(files, [selectedFileIndex, "file"]) && (
                    <>
                      <img
                        className={classes.primaryImage}
                        src={_.get(files, [selectedFileIndex, "file"])}
                        alt="selected"
                      />
                      <img
                        src={DeleteIcon}
                        alt="Delete"
                        className={classes.deleteBtn}
                        onClick={removeFile}
                      />
                    </>
                  )}
                {_.get(files, [selectedFileIndex, "keep"]) &&
                  _.get(files, [selectedFileIndex, "default"]) && (
                    <Grid
                      item
                      xs={12}
                      container
                      style={{ flexDirection: "column" }}
                      justify="center"
                      alignItems="center"
                    >
                      <img
                        className={classes.primaryDefaultImage}
                        src={DefaultImage}
                        alt="default"
                      />
                      <Typography className={classes.uploadImgText}>
                        Upload Image
                      </Typography>
                    </Grid>
                  )}
              </Grid>
              <Grid
                item
                xs={3}
                container
                style={{ overflowY: "auto" }}
                justify="center"
                alignItems="center"
              >
                {files.map((file, index) => {
                  return (
                    <Grid
                      key={index}
                      item
                      index={index}
                      className={classes.secondaryImageContainer}
                    >
                      {_.get(file, "keep") && _.get(file, "file") && (
                        <Button
                          variant="outlined"
                          className={clsx(classes.secondaryDefaultImageBtn)}
                          onClick={setSelectedFileIndex.bind(this, index)}
                        >
                          <img
                            className={classes.secondaryImage}
                            src={_.get(file, "file")}
                            alt="selected"
                          />
                        </Button>
                      )}
                      {_.get(file, "keep") && _.get(file, "default") && (
                        <Button
                          variant="outlined"
                          onClick={setSelectedFileIndex.bind(this, index)}
                          className={clsx(
                            classes.secondaryDefaultImageBtn,
                            {
                              [classes.secondaryDefaultUnclicked]:
                                index !== selectedFileIndex,
                            },
                            {
                              [classes.secondaryDefaultClicked]:
                                index === selectedFileIndex,
                            }
                          )}
                        >
                          <img src={DefaultImage} alt="default" />
                        </Button>
                      )}
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
            <Grid item container xs={12} justify="flex-end">
              <Button
                variant="outlined"
                className={classes.cancelBtn}
                onClick={props.onClose}
              >
                Cancel
              </Button>
              <Button
                variant="outlined"
                className={classes.confirmBtn}
                onClick={submitData.bind(this)}
              >
                Confirm
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </>
  );
};

export default ActivityDetailsModal;
