import React from "react";
import { Modal, Paper, makeStyles, Backdrop } from "@material-ui/core";
import { ReactComponent as Cross } from "../../../assets/v2/CloseIcon.svg";
import rightTick from "../../../assets/v2/RightTick.svg";

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
    height: "400px",
    width: "750px",
    borderRadius: "24px",
    paddingTop: "60px",
    outline: 0,
  },
}));

const SuccessMsgModal = ({ successMsg, setSuccessMsg }) => {
  const classes = useStyles();

  const closeModal = () => {
    setSuccessMsg("");
  };

  return (
    <Modal
      open={successMsg !== ""}
      className={classes.root}
      BackdropComponent={Backdrop}
      BackdropProps={{
        classes: {
          root: classes.backdrop,
        },
      }}
    >
      <Paper className={classes.paper}>
        <div className="successMsgTopBar">
          <div className="closeIconContainer" onClick={closeModal}>
            <Cross style={{ width: "14px", height: "14px" }} />
          </div>
        </div>
        <div className="successMsgBody">
          <img
            src={rightTick}
            alt="right icon"
            style={{ height: "45px", width: "45px" }}
          />
          <p className="successMsg">{successMsg}</p>
          <button className="dismissBtn" onClick={closeModal}>
            Dismiss
          </button>
        </div>
      </Paper>
    </Modal>
  );
};

export default SuccessMsgModal;
