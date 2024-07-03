import React, { useState } from "react";
import {
  Grid,
  MenuItem,
  Modal,
  Paper,
  Select,
  makeStyles,
  Backdrop,
  TextField,
} from "@material-ui/core";
import ArrowDown from "../../../assets/v2/ArrowDown.svg";
import Upload from "../../../assets/v2/Upload.svg";
import Download from "../../../assets/v2/Download.svg";
import { ReactComponent as Cross } from "../../../assets/v2/CloseIcon.svg";
import { KeyboardDatePicker } from "@material-ui/pickers";
import Calendar from "../../../assets/v2/Calendar.svg";
import "./style.css";

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
    height: "557px",
    width: "832px",
    borderRadius: "24px",
    paddingLeft: "55px",
    paddingTop: "60px",
    outline: 0,
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
    border: "2px solid #4BCE82",
    height: "40px",
    fontSize: "14px",
    color: "#113C23",
    fontWeight: 500,
    paddingLeft: "10px",
    fontFamily: "Manrope",
    width: "348px",
    backgroundColor: "white",
    "& .MuiSelect-select": {
      backgroundColor: "white",
      "&:focus": {
        backgroundColor: "white",
      },
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
    paddingLeft: "15px",

    "& .MuiInput-root": {
      height: "40px",
      width: "160px",
      fontWeight: 500,
      backgroundColor: "white",
      paddingLeft: "10px",
      fontFamily: "Manrope",
      fontSize: "15px",
      border: "2px solid #DBF4EE",
    },
    "& .MuiInputBase-input::placeholder": {
      color: "#84A391",
      //   opacity: 1,
    },
    "& .MuiInputBase-input:not(:placeholder-shown)": {
      color: "#113C23",
    },
    "& .Mui-focused": {
      border: `1px solid ${theme.v2.borders.lightGreen}`,
    },

    "& .MuiFormHelperText-root": {
      border: 0,
    },
  },

  textField2: {
    "& .MuiInput-root": {
      height: "40px",
      width: "344px",
      fontWeight: 500,
      backgroundColor: "white",
      paddingLeft: "10px",
      fontFamily: "Manrope",
      fontSize: "14px",
      border: "2px solid #DBF4EE",
    },
    "& .MuiInputBase-input::placeholder": {
      color: "#84A391",
      //   opacity: 1,
    },
    "& .MuiInputBase-input:not(:placeholder-shown)": {
      color: "#113C23",
    },
    "& .Mui-focused": {
      border: `1px solid ${theme.v2.borders.lightGreen}`,
    },

    "& .MuiFormHelperText-root": {
      border: 0,
    },
  },
}));

const CreateProjectModal = ({
  showCreateProjectModal,
  setShowCreateProjectModal,
}) => {
  const classes = useStyles();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startPlaceholder, setStartPlaceholder] = useState("Start");
  const [endPlaceholder, setEndPlaceholder] = useState("End");
  const [selectedValue, setSelectedValue] = useState("0");

  const PopoverProps = {
    PaperProps: {
      style: { marginTop: 10 },
    },
  };
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

  const closeCreateProjectModal = () => {
    setShowCreateProjectModal(false);
  };

  return (
    <Modal
      open={showCreateProjectModal}
      className={classes.root}
      BackdropComponent={Backdrop}
      BackdropProps={{
        classes: {
          root: classes.backdrop,
        },
      }}
    >
      <Paper className={classes.paper}>
        <div className="createProjectTopBar">
          <h4 className="newProjectText">New Project</h4>
          <div className="closeIconContainer" onClick={closeCreateProjectModal}>
            <Cross style={{ width: "14px", height: "14px" }} />
          </div>
        </div>
        <div className="projectModal1stRow">
          <div>
            <p className="customerText">Customer</p>
            <Select
              variant="standard"
              className={classes.select}
              // style={{ color: `${selectedValue !== "0" ? "#113C23" : "#84A391"}` }}
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
              // onChange={(e) => {
              //   setSelectedValue(e.target.value);
              //   setFilters({ ...filters, customer: e.target.value, project: "0" });
              // }}
              // defaultValue={"0"}
              MenuProps={MenuProps}
            >
              {[
                <MenuItem key={0} value={"0"} className={classes.menulabels}>
                  Customer 1
                </MenuItem>,
                <MenuItem key={1} value={"1"} className={classes.menulabels}>
                  Customer 2
                </MenuItem>,
                <MenuItem key={2} value={"2"} className={classes.menulabels}>
                  Customer 3
                </MenuItem>,
              ]}
            </Select>
          </div>
          <div>
            <p className="dateText">Date</p>
            <div style={{ display: "flex" }}>
              <Grid item xs={6}>
                <KeyboardDatePicker
                  fullWidth={true}
                  autoOk={true}
                  disableToolbar
                  variant="inline"
                  format="MM/DD/YYYY"
                  id="date-picker-inline"
                  value={startDate}
                  placeholder={startPlaceholder}
                  onFocus={() => setStartPlaceholder("mm/dd/yyyy")}
                  onBlur={() => setStartPlaceholder("Start")}
                  onChange={(date) => {
                    setStartDate(date ? date.format("MM/DD/YYYY") : null);
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  PopoverProps={PopoverProps}
                  InputProps={{
                    autoComplete: "off",
                  }}
                  className={classes.textField}
                  keyboardIcon={
                    <img
                      src={Calendar}
                      alt="calendar"
                      style={{ height: "16px", width: "15px" }}
                    />
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <KeyboardDatePicker
                  fullWidth={true}
                  autoOk={true}
                  disableToolbar
                  variant="inline"
                  format="MM/DD/YYYY"
                  id="date-picker-inline"
                  value={endDate}
                  placeholder={endPlaceholder}
                  onFocus={() => setEndPlaceholder("mm/dd/yyyy")}
                  onBlur={() => setEndPlaceholder("End")}
                  onChange={(date) => {
                    setEndDate(date ? date.format("MM/DD/YYYY") : null);
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  PopoverProps={PopoverProps}
                  InputProps={{
                    autoComplete: "off",
                  }}
                  className={classes.textField}
                  keyboardIcon={
                    <img
                      src={Calendar}
                      alt="calendar"
                      style={{ height: "16px", width: "15px" }}
                    />
                  }
                />
              </Grid>
            </div>
          </div>
        </div>
        <div className="projectModal2ndRow">
          <div>
            <p className="projectNameText">Project Name*</p>
            <TextField
              variant={"standard"}
              className={classes.textField2}
              placeholder="Project Name"
              fullWidth={true}
              //   helperText={error.projectName}
              //   error={Boolean(error.projectName)}
              //   onChange={(e) => {
              //     setProjectName(e.target.value);
              //   }}
            />
          </div>
          <div>
            <p className="projectNameText">Project ID*</p>
            <TextField
              variant={"standard"}
              className={classes.textField2}
              placeholder="Project ID"
              fullWidth={true}
              //   helperText={error.projectName}
              //   error={Boolean(error.projectName)}
              //   onChange={(e) => {
              //     setProjectName(e.target.value);
              //   }}
            />
          </div>
        </div>
        <div className="projectModal3rdRow">
          <div>
            <p className="uploadUnitsText">Upload Units</p>
            <div className="uploadUnits">
              <img src={Upload} alt="Upload" />
              <p>
                Drag & Drop or
                <span style={{ color: "#0CA14A" }}> Choose File</span> to upload
                units
              </p>
            </div>
          </div>
          <div>
            <div className="contractNumberContainer">
              <p className="customerText">Contract Number</p>
              <Select
                variant="standard"
                className={classes.select}
                style={{
                  color: `${selectedValue !== "0" ? "#113C23" : "#84A391"}`,
                  border: "2px solid #DBF4EE",
                }}
                IconComponent={() => {
                  return (
                    <Grid
                      className={classes.arrowContainer}
                      container
                      justify="center"
                      alignItems="center"
                    >
                      <img
                        src={ArrowDown}
                        alt="Down"
                        style={{ height: "4px" }}
                      />
                    </Grid>
                  );
                }}
                onChange={(e) => {
                  setSelectedValue(e.target.value);
                }}
                defaultValue={"0"}
                MenuProps={MenuProps}
                inputProps={{
                  classes: {
                    select: selectedValue === "0" ? classes.placeholder : "",
                  },
                }}
              >
                {[
                  <MenuItem
                    key={0}
                    value={"0"}
                    disabled
                    className={classes.menulabels}
                  >
                    Contract Number
                  </MenuItem>,
                  <MenuItem key={1} value={"1"} className={classes.menulabels}>
                    Contract 1
                  </MenuItem>,
                  <MenuItem key={2} value={"2"} className={classes.menulabels}>
                    Contract 2
                  </MenuItem>,
                ]}
              </Select>
            </div>
            <button className="downloadUnitsBtn">
              <p>Download Units Template</p>
              <img src={Download} alt="Download" />
            </button>
          </div>
        </div>
        <div>
          <button className="createProjectBtn">Create Project</button>
        </div>
      </Paper>
    </Modal>
  );
};

export default CreateProjectModal;
