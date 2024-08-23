import React, { useState } from "react";
import {
  Backdrop,
  makeStyles,
  MenuItem,
  Modal,
  Paper,
  Select,
} from "@material-ui/core";
import { ReactComponent as Cross } from "../../../assets/v2/CloseIcon.svg";
import "./style.css";
import { FormHelperText, Grid } from "@mui/material";
import ArrowDown from "../../../assets/v2/ArrowDown.svg";
import Download from "../../../assets/v2/Download.svg";
import Upload from "../../../assets/v2/Upload.svg";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../axios";
import { HIDE_LOADER, SHOW_LOADER } from "../../../store/actions/v2/loader";
import { SHOW_ERROR_MESSAGE } from "../../../store/actions/v2/message";
import DeleteContractModal from "../DeleteContractModal/DeleteContractModal";

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
    borderRadius: "24px",
    paddingLeft: "55px",
    paddingRight: "55px",
    paddingTop: "60px",
    paddingBottom: "60px",
    outline: 0,
  },
  editContractArrowContainer: {
    backgroundColor: "#E5FAE7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "18px",
    width: "18px",
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
}));

const EditContractModal = ({
  showEditContractModal,
  setShowEditContractModal,
  customers,
  contracts,
  setSuccessMsg,
  getContracts,
  getCustomers
}) => {
  const [selectedValueOfCustomer, setSelectedValueOfCustomer] = useState("0");
  const [customer, setCustomer] = useState(null);
  const [selectedValueOfContract, setSelectedValueOfContract] = useState("0");
  const [contractNumber, setContractNumber] = useState(null);
  const [contractName, setContractName] = useState(null);
  const [customerContracts, setCustomerContracts] = useState({});
  const [unitsFile, setUnitsFile] = useState(null);
  const [showDeleteContractModal, setShowDeleteContractModal] = useState(false);
  const [error, setError] = useState({});
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => JSON.parse(state.auth.profile));
  const groupId = _.get(profile, "group_id");

  const classes = useStyles();
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
        link.setAttribute("download", "Contract Units Template.xlsx");
        document.body.appendChild(link);
        link.click();
      }
    } catch (err) { }
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

  const handleSaveContract = async () => {
    const isValid = validateData();

    if (isValid) {
      const formData = new FormData();

      formData.append("file", unitsFile);

      try {
        dispatch({ type: SHOW_LOADER, data: 1 });
        const url = `/contracts/${contractNumber}?p=group:${groupId}`;
        const result = await axios.patch(url, formData, {
          headers: {
            Authorization: token,
          },
        });
        dispatch({ type: HIDE_LOADER });

        if (result.status === 200) {
          setSuccessMsg("New Contract Created Successfully!");
          setShowEditContractModal(false);
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

    // if (isValid) {
    //   const formData = new FormData();
    //   if (customer.id) {
    //     formData.append("customer_id", customer.id);
    //   } else {
    //     formData.append("new_customer", customer.name);
    //   }

    //   formData.append("contract_name", contractNumber);
    //   formData.append("file", unitsFile);
    //   try {
    //     dispatch({ type: SHOW_LOADER, data: 1 });
    //     const url = `/contracts?p=group:${groupId}`;
    //     const result = await axios.post(url, formData, {
    //       headers: {
    //         Authorization: token,
    //       },
    //     });
    //     dispatch({ type: HIDE_LOADER });
    //     setShowCreateContractModal(false);

    //     if (result.status === 200) {
    //       setSuccessMsg("New Contract Created Successfully!");
    //       getContracts();
    //       getCustomers();
    //     }
    //   } catch (err) {
    //     dispatch({ type: HIDE_LOADER });
    //     dispatch({
    //       type: SHOW_ERROR_MESSAGE,
    //       data:
    //         _.get(err, ["response", "data", "message"]) ||
    //         "Something went wrong",
    //     });
    //   }
    // }
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
    <>
      {showDeleteContractModal && (
        <DeleteContractModal
          showDeleteContractModal={showDeleteContractModal}
          setShowDeleteContractModal={setShowDeleteContractModal}
          setShowEditContractModal={setShowEditContractModal}
          contractNumber={contractNumber}
          setSuccessMsg={setSuccessMsg}
          getContracts={getContracts}
          getCustomers={getCustomers}
        />
      )}

      <Modal
        open={showEditContractModal}
        className={classes.root}
        BackdropComponent={Backdrop}
        BackdropProps={{
          classes: {
            root: classes.backdrop,
          },
        }}
      >
        <Paper className={classes.paper}>
          <div className="editContractTopBar">
            <h4 className="editContractText">Edit Contract</h4>
            <div
              className="editContractCloseIconContainer"
              onClick={() => {
                setShowEditContractModal(false);
              }}
            >
              <Cross style={{ width: "14px", height: "14px" }} />
            </div>
          </div>
          <div className="editContractModal1stRow">
            <div>
              <p className="contractText">Customer</p>
              <Select
                variant="standard"
                className={classes.select}
                value={selectedValueOfCustomer}
                style={{
                  color: `${selectedValueOfCustomer !== "0" ? "#113C23" : "#84A391"
                    }`,
                }}
                IconComponent={() => {
                  return (
                    <Grid className={classes.editContractArrowContainer}>
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
                    Select Customer
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
              <Select
                variant="standard"
                disabled={!customer}
                className={classes.select}
                value={selectedValueOfContract}
                style={{
                  color: `${selectedValueOfContract !== "0" ? "#113C23" : "#84A391"
                    }`,
                  opacity: `${!customer ? "0.5" : "1"}`,
                }}
                IconComponent={() => {
                  return (
                    <Grid className={classes.editContractArrowContainer}>
                      <img src={ArrowDown} alt="Down" style={{ height: "4px" }} />
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
                      selectedValueOfContract === "0" ? classes.placeholder : "",
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
                    Select Contract
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
          </div>
          <div>
            <div>
              <h3 className="unitListText">Unit List</h3>
              <div className="editContractModal2ndRow">
                <button
                  className="editContractDownloadUnitsBtn"
                  onClick={downloadUnitsTemplate.bind(this)}
                  disabled={!contractNumber}
                  style={{
                    cursor: contractNumber ? "pointer" : "",
                    opacity: contractNumber ? "1" : "0.5",
                  }}
                >
                  <img src={Download} alt="Download" />
                  <p>Download Current Unit List</p>
                </button>
                <div onDrop={handleDrop} onDragOver={handleDragOver}>
                  <button
                    className="editContractUploadUnitsBtn"
                    style={{
                      cursor: contractNumber ? "pointer" : "",
                      opacity: contractNumber ? "1" : "0.5",
                    }}
                    disabled={!contractNumber}
                    onClick={() => {
                      document.getElementById("unitsTemplate").click();
                    }}
                  >
                    <img src={Upload} alt="Download" />
                    <p>Upload Revised Unit List</p>
                  </button>

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
              </div>
            </div>
          </div>
          <div className="editContractModal3rdRow">
            <button className="saveContractBtn" onClick={handleSaveContract}>
              Save Contract
            </button>
            <p
              className="deleteContractBtn"
              onClick={() => {
                if (contractNumber) {
                  setShowDeleteContractModal(true);
                }
              }}
              style={{
                opacity: contractNumber ? 1 : 0.5,
                cursor: contractNumber ? "pointer" : "arrow",
              }}
            >
              Delete Contract
            </p>
          </div>
        </Paper>
      </Modal>
    </>
  );
};

export default EditContractModal;
