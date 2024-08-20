import React from "react";
import { Modal, Paper, makeStyles, Backdrop } from "@material-ui/core";
import { ReactComponent as Cross } from "../../../assets/v2/CloseIcon.svg";
import { ReactComponent as WarningIcon } from "../../../assets/v2/Warning.svg";
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
    borderRadius: "24px",
    paddingBottom: "50px",
    paddingTop: "50px",
    outline: 0,
  },
}));

const DeleteContractModal = ({
  showDeleteContractModal,
  setShowDeleteContractModal,
}) => {
  const classes = useStyles();
  return (
    <Modal
      open={showDeleteContractModal}
      className={classes.root}
      // BackdropComponent={Backdrop}
      // BackdropProps={{
      //   classes: {
      //     root: classes.backdrop,
      //   },
      // }}
    >
      <Paper className={classes.paper}>
        <div className="deleteModalTopBar">
          <div
            className="deleteModalCloseIconContainer"
            onClick={() => {
              setShowDeleteContractModal(false);
            }}
          >
            <Cross style={{ width: "14px", height: "14px" }} />
          </div>
        </div>
        <div className="deleteModalBody">
          <h4 className="deleteContractText">Delete Contract ?</h4>
          <div className="deleteInfo">
            <p>Are you sure you want to delete the contract?</p>
            <p>You can’t undo this action.</p>
          </div>
          <div className="warningBox">
            <div>
              <WarningIcon />
            </div>
            <div>
              <h5 className="warningText">Warning</h5>
              <p className="warningInfo">
                All <span style={{ fontWeight: "bold" }}>5 Projects</span> and
                <span style={{ fontWeight: "bold" }}> 498 Jobs</span> related to
                this <br /> contract will also get Deleted!
              </p>
            </div>
          </div>
          <div className="deleteModalBtn">
            <button
              className="cancelBtn"
              onClick={() => {
                setShowDeleteContractModal(false);
              }}
            >
              Cancel
            </button>
            <button className="deleteBtn">Delete</button>
          </div>
        </div>
      </Paper>
    </Modal>
  );
};

export default DeleteContractModal;
