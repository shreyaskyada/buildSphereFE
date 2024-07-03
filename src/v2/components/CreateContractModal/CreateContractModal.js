import {
  Grid,
  MenuItem,
  Modal,
  Paper,
  Select,
  makeStyles,
  Backdrop,
} from "@material-ui/core";
import React from "react";
import ArrowDown from "../../../assets/v2/ArrowDown.svg";
import Upload from "../../../assets/v2/Upload.svg";
import Download from "../../../assets/v2/Download.svg";
import { ReactComponent as Cross } from "../../../assets/v2/CloseIcon.svg";
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
    height: "480px",
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
  chooseCustSelect: {
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

  menulabels: {
    fontFamily: "Manrope",
    backgroundColor: theme.v2.backgrounds.whiteBackground,
    fontSize: 14,
    fontWeight: 500,
    color: theme.v2.fonts.colors.blackShade1,
  },
}));

const CreateContractModal = ({
  showCreateContractModal,
  setShowCreateContractModal,
}) => {
  const classes = useStyles();
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

  const closeCreateContractModal = () => {
    setShowCreateContractModal(false);
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
        <div>
          <p className="CustomerText">Customer</p>
          <Select
            variant="standard"
            className={classes.chooseCustSelect}
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
        <div className="unitsContainer">
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
            <button className="downloadUnitsBtn">
              <p>Download Units Template</p>
              <img src={Download} alt="Download" />
            </button>
          </div>
        </div>
        <div>
          <button className="createContractBtn">Create Contract</button>
        </div>
      </Paper>
    </Modal>
  );
};

export default CreateContractModal;
