import {
  Button,
  Grid,
  makeStyles,
  Modal,
  Paper,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import GreenLogo from "../../assets/v2/GreenLogo.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    borderRadius: 10,
    margin: "20% 30%",
    outline: 0,
  },
  confirmationTxt: {
    fontSize: 16,
    color: theme.v2.fonts.colors.darkFont,
  },
  cancelBtn: {
    height: 50,
    width: 150,
    fontSize: 18,
    fontWeight: "400",
    color: theme.v2.fonts.colors.blackShade2,
    backgroundColor: theme.v2.backgrounds.greyBackground3,
    "&:hover": {
      backgroundColor: theme.v2.backgrounds.greyBackground3,
    },
  },
  saveBtn: {
    height: 50,
    width: 150,
    fontSize: 18,
    fontWeight: "400",
  },
  deleteBtn: {
    backgroundColor: theme.v2.backgrounds.redBackground,
    "&:hover": {
      backgroundColor: theme.v2.backgrounds.greyBackground3,
    },
  },
}));

const ConfirmationModal = (props) => {
  const classes = useStyles();
  const confirmationText =
    props.header || "Are you sure you want to make these changes?";

  return (
    <Modal open={props.open} className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container style={{ padding: "10%" }}>
          <Grid item xs={12} style={{ padding: "10% 0%" }}>
            <img src={GreenLogo} alt="Logo" />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.confirmationTxt}>
              {confirmationText}
            </Typography>
          </Grid>
          <Grid container item xs={12} style={{ paddingTop: "5%" }}>
            <Grid item xs={5}>
              <Button
                fullwidth={true}
                className={classes.cancelBtn}
                onClick={props.onCancel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={5}>
              <Button
                fullwidth={true}
                className={clsx(classes.saveBtn, {
                  [classes.deleteBtn]: props.delete,
                })}
                onClick={props.onConfirm}
              >
                {props.actionLabel || "Save"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

export default ConfirmationModal;
