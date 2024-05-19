import {
  Button,
  Grid,
  makeStyles,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Cross from "../../assets/v2/Cross.svg";
import Attachment from "../../assets/v2/Attachment.svg";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "5% 20%",
    borderRadius: 10,
    border: 0,
    outline: 0,
    padding: "5%",
  },
  header: {
    fontSize: 26,
    color: theme.v2.fonts.colors.greenShade2,
  },
  label: {
    fontSize: 15,
    fontWeight: 500,
    color: theme.v2.fonts.colors.darkFont2,
    marginBottom: "1%",
  },
  textfield: {
    "& .MuiInput-root": {
      backgroundColor: theme.v2.backgrounds.whiteBackground,
      border: `1px solid ${theme.v2.borders.darkShade2}`,
      fontSize: 12,
    },
    marginBottom: "2%",
  },
  textfieldMultiline: {
    "& .MuiInput-root": {
      backgroundColor: theme.v2.backgrounds.whiteBackground,
      border: `1px solid ${theme.v2.borders.darkShade2}`,
      fontSize: 12,
      height: 100,
    },
    marginBottom: "2%",
  },
  btn: {
    padding: "2% 5%",
    fontSize: 18,
    fontWeight: 400,
  },
  errorText: {
    fontSize: 10,
    color: "#f44336",
  },
  file: {
    padding: "2%",
    backgroundColor: theme.v2.backgrounds.greyBackground3,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.darkFont,
    marginBottom: "5%",
  },
}));

const ApprovalModal = (props) => {
  const classes = useStyles();
  const [from, setFrom] = useState("");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState();
  const [error, setError] = useState({});
  const attachFile = (file) => {
    if (!file) {
      return;
    }
    if (file.type) {
      if (
        file.type !== "application/pdf" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/jpg" &&
        file.type !== "image/png"
      ) {
        setError({ file: "Please upload a png/jpeg/jpg/pdf file only" });
        return;
      } else setFile(file);
    } else {
      setError({ file: `Please upload a valid file only` });
      return;
    }
    setError({ file: null });
  };
  const removeFile = (file) => {
    setFile();
  };
  const saveChanges = () => {
    if (!from) {
      setError({
        from: "Approval Taken from is mandatory",
      });
      return;
    }
    if (!reason) {
      setError({
        reason: "Mention rerason for change is mandatory",
      });
      return;
    }
    if (!file) {
      setError({
        file: "Upload an approval attachment",
      });
      return;
    }
    props.setApproval({
      from,
      reason,
      file,
    });
    props.onClose();
  };
  useEffect(() => {
    setFile();
    setReason("");
    setFrom("");
    setError({});
  }, [props]);
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Paper className={classes.paper}>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Typography className={classes.header}>
              Change Planned End Dates
            </Typography>
          </Grid>
          <Grid item xs={6} container justify="flex-end">
            <img
              src={Cross}
              alt="Close"
              style={{ cursor: "pointer" }}
              onClick={props.onClose}
            />
          </Grid>
          <Grid item xs={12} style={{ marginTop: "2%" }}>
            <Typography className={classes.label}>
              Approval Taken from*
            </Typography>
            <TextField
              fullWidth={true}
              className={classes.textfield}
              placeholder="Name"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
              }}
              inputProps={{ maxLength: 50 }}
              helperText={error.from && error.from}
              error={Boolean(error.from)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.label}>
              Mention reason for change*
            </Typography>
            <TextField
              fullWidth={true}
              className={classes.textfieldMultiline}
              placeholder="Reason"
              multiline={true}
              rows={5}
              value={reason}
              inputProps={{ maxLength: 500 }}
              onChange={(e) => {
                setReason(e.target.value);
              }}
              helperText={error.reason && error.reason}
              error={Boolean(error.reason)}
            />
          </Grid>
          {file && (
            <Grid
              item
              xs={12}
              className={classes.file}
              container
              alignItems="center"
            >
              <Grid item xs={6}>
                {file.name}
              </Grid>
              <Grid item xs={6} container justify="flex-end">
                <img
                  src={Cross}
                  alt="Close"
                  style={{ cursor: "pointer", color: "white" }}
                  height={20}
                  onClick={removeFile}
                />
              </Grid>
            </Grid>
          )}
          <Grid item xs={6}>
            <Button
              className={classes.btn}
              onClick={() => {
                document.getElementById("attach").click();
              }}
              startIcon={<img src={Attachment} alt="attachment" />}
            >
              Attach Approval
            </Button>
            {error.file && (
              <Typography className={classes.errorText}>
                {error.file}
              </Typography>
            )}
          </Grid>
          <Grid item xs={6} container justify="flex-end">
            <Button className={classes.btn} onClick={saveChanges}>
              Save Changes
            </Button>
          </Grid>
          <input
            type="file"
            id="attach"
            hidden={true}
            onChange={(e) => {
              attachFile(e.target.files[0]);
            }}
          />
        </Grid>
      </Paper>
    </Modal>
  );
};

export default ApprovalModal;
