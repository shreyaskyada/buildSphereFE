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
import React, { useState } from "react";
import ArrowDown from "../../../assets/v2/ArrowDown.svg";
import Upload from "../../../assets/v2/Upload.svg";
import Download from "../../../assets/v2/Download.svg";
import { ReactComponent as Cross } from "../../../assets/v2/CloseIcon.svg";
import "./style.css";
import axios from "../../../axios";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
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
    width: "52vw",
    borderRadius: "24px",
    paddingLeft: "55px",
    paddingTop: "60px",
    paddingBottom: "60px",
    outline: 0,
    [theme.breakpoints.down(1400)]: {
      width: "57vw",
    },
    [theme.breakpoints.down(1350)]: {
      width: "65vw",
    },
    [theme.breakpoints.down(660)]: {
      width: "80vw",
    },
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
  chooseCustSelect: {
    border: "2px solid #DBF4EE",
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
    "&.Mui-focused": {
      border: "2px solid #4BCE82",
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

const CreateContractModal = ({
  showCreateContractModal,
  setShowCreateContractModal,
  customers,
  setSuccessMsg,
  getContracts,
}) => {
  const classes = useStyles();
  const [customer, setCustomer] = useState(null);
  const [selectedValueOfCustomer, setSelectedValueOfCustomer] = useState("0");
  const [contractNumber, setContractNumber] = useState(null);
  const [unitsFile, setUnitsFile] = useState(null);
  const [error, setError] = useState({});
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => JSON.parse(state.auth.profile));
  const groupId = _.get(profile, "group_id");
  const dispatch = useDispatch();
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 300,
        marginTop: 50,
        marginLeft: -10,
      },
    },
  };

  const closeCreateContractModal = () => {
    setShowCreateContractModal(false);
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

  const validateData = () => {
    if (customer === null) {
      setError({ customer: "Please select a customer" });
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

  const handleCreateContract = async () => {
    const isValid = validateData();

    if (isValid) {
      const formData = new FormData();
      formData.append("customer_id", customer);
      formData.append("contract_name", contractNumber);
      formData.append("file", unitsFile);
      try {
        dispatch({ type: SHOW_LOADER, data: 1 });
        const url = `/contracts?p=group:${groupId}`;
        const result = await axios.post(url, formData, {
          headers: {
            Authorization: token,
          },
        });
        dispatch({ type: HIDE_LOADER });
        setShowCreateContractModal(false);

        if (result.status === 200) {
          setSuccessMsg("New Contract Created Successfully!");
          getContracts();
        }
      } catch (err) {
        dispatch({ type: HIDE_LOADER });
        setShowCreateContractModal(false);

        dispatch({
          type: SHOW_ERROR_MESSAGE,
          data:
            _.get(err, ["response", "data", "message"]) ||
            "Something went wrong",
        });
      }
    }
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

  return (
    <Modal
      open={showCreateContractModal}
      className={classes.root}
      BackdropComponent={Backdrop}
      BackdropProps={{
        classes: {
          root: classes.backdrop,
        },
      }}
    >
      <Paper className={classes.paper}>
        <div className="createContractTopBar">
          <h4 className="newContractText">New Contract</h4>
          <div
            className="closeIconContainer"
            onClick={closeCreateContractModal}
          >
            <Cross style={{ width: "14px", height: "14px" }} />
          </div>
        </div>
        <div className="createContract1stRow">
          <div>
            <p className="customerText">Customer</p>
            <Select
              variant="standard"
              className={classes.chooseCustSelect}
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
            <p className="contractText">Contract Number</p>
            <TextField
              variant={"standard"}
              className={classes.textField}
              placeholder="Contract Number"
              fullWidth={true}
              helperText={error.contract}
              error={Boolean(error.contract)}
              onChange={(e) => {
                if (error.contract) {
                  setError({});
                }
                setContractNumber(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="unitsContainer">
          <div onDrop={handleDrop} onDragOver={handleDragOver}>
            <p className="uploadUnitsText">Upload Units</p>
            <div
              className="uploadUnits"
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
            <button
              className="downloadUnitsBtn"
              onClick={downloadUnitsTemplate.bind(this)}
            >
              <p>Download Units Template</p>
              <img src={Download} alt="Download" />
            </button>
          </div>
        </div>
        <div>
          <button className="createContractBtn" onClick={handleCreateContract}>
            Create Contract
          </button>
        </div>
      </Paper>
    </Modal>
  );
};

export default CreateContractModal;
