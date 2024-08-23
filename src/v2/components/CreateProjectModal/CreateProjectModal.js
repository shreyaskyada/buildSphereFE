import React, { useEffect, useState } from "react";
import {
  Grid,
  MenuItem,
  Modal,
  Paper,
  Select,
  makeStyles,
  Backdrop,
  TextField,
  FormHelperText,
} from "@material-ui/core";
import ArrowDown from "../../../assets/v2/ArrowDown.svg";
import Upload from "../../../assets/v2/Upload.svg";
import Download from "../../../assets/v2/Download.svg";
import { ReactComponent as Cross } from "../../../assets/v2/CloseIcon.svg";
import { KeyboardDatePicker } from "@material-ui/pickers";
import Calendar from "../../../assets/v2/CalenderNew.svg";
import "./style.css";
import moment from "moment";
import axios from "../../../axios";
import { HIDE_LOADER, SHOW_LOADER } from "../../../store/actions/v2/loader";
import { SHOW_ERROR_MESSAGE } from "../../../store/actions/v2/message";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";

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
    width: "780px",
    borderRadius: "24px",
    paddingLeft: "55px",
    paddingTop: "60px",
    paddingBottom: "70px",
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
      border: "2px solid #4BCE82",
    },
    "& .MuiFormHelperText-root": {
      border: 0,
    },
  },

  textField2: {
    "& .MuiInput-root": {
      height: "40px",
      width: "348px",
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
      border: "2px solid #4BCE82",
    },

    "& .MuiFormHelperText-root": {
      border: 0,
    },
  },
}));

const CreateProjectModal = ({
  showCreateProjectModal,
  setShowCreateProjectModal,
  customers,
  setSuccessMsg,
  contracts,
  getProjects,
}) => {
  const classes = useStyles();
  const [customer, setCustomer] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [projectName, setProjectName] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [contractNumber, setContractNumber] = useState(null);
  const [contractName, setContractName] = useState(null);
  const [unitsFile, setUnitsFile] = useState(null);
  const [error, setError] = useState({});
  const [startPlaceholder, setStartPlaceholder] = useState("Start");
  const [endPlaceholder, setEndPlaceholder] = useState("End");
  const [selectedValueOfContract, setSelectedValueOfContract] = useState("0");
  const [selectedValueOfCustomer, setSelectedValueOfCustomer] = useState("0");
  const [customerContracts, setCustomerContracts] = useState({});
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => JSON.parse(state.auth.profile));
  const groupId = _.get(profile, "group_id");
  const dispatch = useDispatch();

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

  const manageCustomerContracts = (customerId) => {
    if (!customerContracts?.[customerId]) {
      const tempContracts = contracts.filter((contract) => {
        return contract.customer_id === customerId;
      });
      setCustomerContracts((prev) => {
        return {
          ...prev,
          [customerId]: tempContracts,
        };
      });
    }
  };

  const closeCreateProjectModal = () => {
    setShowCreateProjectModal(false);
  };

  const downloadUnitsTemplate = async () => {
    try {
      const result = await axios.get(
        `/contracts/uploadedUnitsFile/${contractNumber}?p=group:${groupId}`,
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
    } catch (err) {}
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
        setUnitsFile(null);
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
    if (!customer) {
      setError({ customer: "Please select a customer" });
      return false;
    }

    if (!startDate) {
      setError({ startDate: "Please select a start date" });
      return false;
    }

    if (!moment(startDate, "MM/DD/YYYY", true).isValid()) {
      setError({ startDate: "Invalid date format" });
      return false;
    }

    if (!endDate) {
      setError({ endDate: "Please select an end date" });
      return false;
    }

    if (!moment(endDate, "MM/DD/YYYY", true).isValid()) {
      setError({ endDate: "Invalid date format" });
      return false;
    }

    if (startDate >= endDate) {
      setError({ startDate: "The start date should be before the end date." });
      return false;
    }

    if (!projectName) {
      setError({ projectName: "Please enter a Project Name" });
      return false;
    }

    if (!projectId) {
      setError({ projectId: "Please enter a Project Id" });
      return false;
    }

    if (!contractNumber) {
      setError({ contract: "Please select a contract number" });
      return false;
    }
    if (!unitsFile) {
      setError({ unitsFile: "Please upload the units data" });
      return false;
    }
    setError({});
    return true;
  };
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    setUploadedFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleCreateProject = async () => {
    const isValid = validateData();
    if (isValid) {
      const formData = new FormData();
      formData.append("customer_id", customer);
      formData.append("contract_no", projectId);
      formData.append("project_name", projectName);
      formData.append("contract_id", contractNumber);
      formData.append("contract_name", contractName);
      formData.append("start_date", moment(startDate).format("YYYY-MM-DD"));
      formData.append("end_date", moment(endDate).format("YYYY-MM-DD"));
      formData.append("file", unitsFile);
      try {
        dispatch({ type: SHOW_LOADER, data: 1 });
        const url = customer.id
          ? `/projects?p=customer:${customer.id}`
          : `/projects?p=group:${groupId}`;
        const result = await axios.post(url, formData, {
          headers: {
            Authorization: token,
          },
        });
        dispatch({ type: HIDE_LOADER });
        setShowCreateProjectModal(false);

        if (result.status === 200) {
          setSuccessMsg("New Project Created Successfully!");
          getProjects();
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
            <p className="customer_text">Customer</p>
            <Select
              variant="standard"
              className={classes.select}
              value={selectedValueOfCustomer}
              style={{
                color: `${
                  selectedValueOfCustomer !== "0" ? "#113C23" : "#84A391"
                }`,
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
                if (error.customer) {
                  setError({});
                }
                setSelectedValueOfCustomer(e.target.value);
                setCustomer(e.target.value);
                setSelectedValueOfContract("0");
                setContractNumber(null);
                manageCustomerContracts(e.target.value);
              }}
              defaultValue={"0"}
              MenuProps={MenuProps}
              inputProps={{
                classes: {
                  select:
                    selectedValueOfCustomer === "0" ? classes.placeholder : "",
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
                  Customer
                </MenuItem>,
                ...customers.map((customer, index) => {
                  return (
                    <MenuItem
                      key={index}
                      value={customer.customer_id}
                      className={classes.menulabels}
                    >
                      {customer.customer.name}
                    </MenuItem>
                  );
                }),
              ]}
            </Select>
            <FormHelperText style={{ color: "red" }}>
              {error.customer}
            </FormHelperText>
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
                    if (error.startDate) {
                      setError({});
                    }
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
                    if (
                      error.endDate ||
                      error.startDate ===
                        "The start date should be before the end date."
                    ) {
                      setError({});
                    }
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
                  helperText={error.endDate}
                  error={Boolean(error.endDate)}
                />
              </Grid>
            </div>
            <FormHelperText style={{ color: "red", marginLeft: "17px" }}>
              {error.startDate}
            </FormHelperText>
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
              value={projectName}
              helperText={error.projectName}
              error={Boolean(error.projectName)}
              onChange={(e) => {
                if (error.projectName) {
                  setError({});
                }
                setProjectName(e.target.value);
              }}
            />
          </div>
          <div>
            <p className="projectNameText">Project ID*</p>
            <TextField
              variant={"standard"}
              className={classes.textField2}
              style={{ marginLeft: "-5px" }}
              placeholder="Project ID"
              fullWidth={true}
              value={projectId}
              onChange={(e) => {
                if (error.projectId) {
                  setError({});
                }
                setProjectId(e.target.value);
              }}
              helperText={error.projectId}
              error={Boolean(error.projectId)}
            />
          </div>
        </div>
        <div className="projectModal3rdRow">
          <div onDrop={handleDrop} onDragOver={handleDragOver}>
            <p className="uploadUnitsText">Upload Units</p>
            <div
              className="projectUploadUnits"
              onClick={() => {
                document.getElementById("unitsTemplate").click();
              }}
            >
              <img src={Upload} alt="Upload" />
              <p>
                Drag & Drop or
                <span style={{ color: "#0CA14A" }}> Choose File</span> to upload
                units
              </p>
            </div>
            {error.unitsFile && (
              <FormHelperText style={{ color: "red" }}>
                {error.unitsFile}
              </FormHelperText>
            )}

            {unitsFile && (
              <FormHelperText style={{ color: "green" }}>
                {unitsFile.name}
              </FormHelperText>
            )}

            <input
              type="file"
              style={{ display: "none" }}
              id="unitsTemplate"
              onChange={(e) => {
                setUploadedFile(e.target.files[0]);
              }}
            />
          </div>
          <div>
            <div className="contractNumberContainer">
              <p className="contractText">Contract Number</p>
              <Select
                variant="standard"
                disabled={!customer}
                className={classes.select}
                value={selectedValueOfContract}
                style={{
                  color: `${
                    selectedValueOfContract !== "0" ? "#113C23" : "#84A391"
                  }`,
                  opacity: `${!customer ? "0.5" : "1"}`,
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
                  if (error.contract) {
                    setError({});
                  }

                  setContractName(e.currentTarget.id);
                  setSelectedValueOfContract(e.target.value);
                  setContractNumber(e.target.value);
                }}
                defaultValue={"0"}
                MenuProps={MenuProps}
                inputProps={{
                  classes: {
                    select:
                      selectedValueOfContract === "0"
                        ? classes.placeholder
                        : "",
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

                  customer &&
                    customerContracts[customer].map((contract, index) => {
                      return (
                        <MenuItem
                          key={index}
                          id={contract.contract_name}
                          value={contract.contract_id}
                          className={classes.menulabels}
                        >
                          {contract.contract_name}
                        </MenuItem>
                      );
                    }),
                ]}
              </Select>

              <FormHelperText style={{ color: "red" }}>
                {error.contract}
              </FormHelperText>
            </div>
            <button
              className="projectDownloadUnitsBtn"
              onClick={downloadUnitsTemplate.bind(this)}
              disabled={!contractNumber}
              style={{
                cursor: contractNumber ? "pointer" : "",
                opacity: contractNumber ? "1" : "0.5",
              }}
            >
              <p>Download Units Template</p>
              <img src={Download} alt="Download" />
            </button>
          </div>
        </div>
        <div>
          <button className="createProjectBtn" onClick={handleCreateProject}>
            Create Project
          </button>
        </div>
      </Paper>
    </Modal>
  );
};

export default CreateProjectModal;
