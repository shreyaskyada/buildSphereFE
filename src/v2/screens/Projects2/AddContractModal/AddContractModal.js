import React from "react";
import { Modal } from "@material-ui/core";
import { useAddContractModalStyle } from "./addContractStyle";

const AddContractModal = ({ isOpen }) => {
  const classes = useAddContractModalStyle();
  return (
    <Modal open={true} className={classes.root}>
      {/* <Typography>New Contract</Typography> */}
      <div
        style={{
          backgroundColor: "#FFF",
        }}
      >
        <h1>Hlelo</h1>
      </div>
    </Modal>
  );
};

export default AddContractModal;
