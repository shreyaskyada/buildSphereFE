import React, { useEffect, useState } from "react";
import { Modal, Paper, makeStyles, CircularProgress } from "@material-ui/core";
import { ReactComponent as Cross } from "../../../assets/v2/CloseIcon.svg";
import { ReactComponent as WarningIcon } from "../../../assets/v2/Warning.svg";
import "./style.css";
import axios from "../../../axios";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { SHOW_ERROR_MESSAGE } from "../../../store/actions/v2/message";

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
  contractNumber,
  setSuccessMsg,
  setShowEditContractModal,
  getContracts,
  getCustomers
}) => {
  const classes = useStyles();
  const [projectsAndJobsCounts, setProjectsAndJobsCounts] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => JSON.parse(state.auth.profile));
  const groupId = _.get(profile, "group_id");
  const dispatch = useDispatch();

  const getProjectsAndJobsCounts = async () => {
    setIsLoading(true);
    try {
      const url = `/contracts/projectAndJobsCount/${contractNumber}?p=group:${groupId}`;
      const result = await axios.get(url, {
        headers: {
          Authorization: token,
        },
      });
      setProjectsAndJobsCounts({
        jobCount: _.get(result, ["data", "message", "jobCount"]),
        projectCount: _.get(result, ["data", "message", "projectCount"])
      });
    } catch (error) {
      dispatch({
        type: SHOW_ERROR_MESSAGE,
        data:
          _.get(error, ["response", "data", "message"]) ||
          "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const onDeleteContractHandler = async () => {
    setIsLoading(true);
    try {
      const url = `/contracts/${contractNumber}?p=group:${groupId}`;
      await axios.delete(url, {
        headers: {
          Authorization: token,
        },
      });

      setSuccessMsg("Contract deleted successfully");
      setShowDeleteContractModal(false);
      setShowEditContractModal(false);
      getContracts();
      getCustomers();
    } catch (error) {
      dispatch({
        type: SHOW_ERROR_MESSAGE,
        data:
          _.get(error, ["response", "data", "message"]) ||
          "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getProjectsAndJobsCounts();
  }, []);

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
          {
            isLoading ? (
              <div style={{ height: "135px" }}>
                <CircularProgress color="inherit" />
              </div>
            ) :
              (<div className="warningBox">
                <div>
                  <WarningIcon />
                </div>
                <div>
                  <h5 className="warningText">Warning</h5>
                  <p className="warningInfo">
                    All <span style={{ fontWeight: "bold" }}>{projectsAndJobsCounts.projectCount} Projects</span> and
                    <span style={{ fontWeight: "bold" }}> {projectsAndJobsCounts.jobCount} Jobs</span> related to
                    this <br /> contract will also get Deleted!
                  </p>
                </div>
              </div>)
          }
          <div className="deleteModalBtn">
            <button
              className="cancelBtn"
              onClick={() => {
                setShowDeleteContractModal(false);
              }}
            >
              Cancel
            </button>
            <button className="deleteBtn" onClick={onDeleteContractHandler}>Delete</button>
          </div>
        </div>
      </Paper>
    </Modal>
  );
};

export default DeleteContractModal;
