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
import _ from "lodash";
import axios from "../../axios";
import { useDispatch, useSelector } from "react-redux";
import { SHOW_ERROR_MESSAGE } from "../../store/actions/v2/message";

const useStyles = makeStyles((theme) => ({
  paper: {
    outline: "none",
    margin: "5% 25%",
    borderRadius: 10,
    padding: "4%",
  },
  header: {
    fontSize: 26,
    color: theme.v2.fonts.colors.greenShade2,
  },
  subHeadersContainer: {
    backgroundColor: theme.v2.backgrounds.darkBackground,
    borderRadius: 5,
    padding: "2% 3%",
  },
  subHeaders: {
    fontSize: 15,
    color: theme.v2.fonts.colors.whiteFont,
    fontWeight: 500,
  },
  label: {
    paddingLeft: "5%",
    fontSize: 15,
    color: theme.v2.fonts.colors.greyShade4,
  },
  textfield: {
    "& .MuiInput-root": {
      backgroundColor: theme.v2.fonts.colors.whiteFont,
      border: `1px solid ${theme.v2.borders.darkShade2}`,
      borderRadius: 5,
      fontSize: 12,
      paddingLeft: "5%",
      color: theme.v2.fonts.colors.darkFont,
    },
    "& .Mui-focused": {
      border: `2px solid ${theme.v2.borders.lightGreen}`,
    },
    "& .MuiFormHelperText-root": {
      border: 0,
    },
  },
  btn: {
    marginTop: "5%",
    fontSize: 18,
    fontWeight: 400,
    padding: "1%",
    minWidth: 150,
    borderWidth: 0,
  },
}));

const EditUnit = (props) => {
  const classes = useStyles();
  const unit = props.unit;
  const [price, setPrice] = useState(_.get(unit, "price") || 0);
  const token = useSelector((state) => state.auth.token);
  const [error, setError] = useState({});
  const dispatch = useDispatch();
  const onSubmit = async () => {
    try {
      if (!price) {
        setError({
          price: "Price should be a valid value",
        });
        return false;
      }
      const result = await axios.patch(
        `/units/${unit.id}?p=project:${unit.projectId}`,
        {
          price,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        props.refresh();
        props.onClose();
      }
    } catch (err) {
      dispatch({
        type: SHOW_ERROR_MESSAGE,
        data:
          _.get(err, ["response", "data", "message"]) || "Something went wrong",
      });
    }
  };

  useEffect(() => {
    setPrice(unit.price);
  }, [unit.price]);

  return (
    <Modal open={props.open}>
      <Paper className={classes.paper}>
        <Grid container style={{ marginBottom: "5%" }}>
          <Grid item xs={6}>
            <Typography className={classes.header}>Edit Unit</Typography>
          </Grid>
          <Grid item xs={6} container justify="flex-end">
            <img
              src={Cross}
              alt="Close"
              style={{ cursor: "pointer" }}
              onClick={props.onClose}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} justify="space-between">
          <Grid item xs={5} className={classes.subHeadersContainer}>
            <Typography className={classes.subHeaders}>Unit</Typography>
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={6} className={classes.subHeadersContainer}>
            <Typography className={classes.subHeaders}>Price*</Typography>
          </Grid>
          <Grid item xs={12} container style={{ padding: "2% 0%" }}>
            <Grid item xs={6} container alignItems="center">
              <Typography className={classes.label}>
                {unit.unit_name}
              </Typography>
            </Grid>
            <Grid item xs={6} container alignItems="center">
              <TextField
                fullWidth={true}
                type="Number"
                className={classes.textfield}
                placeholder={`0`}
                onChange={(e) => {
                  const value = e.target.value;
                  setPrice(value);
                }}
                value={price}
                error={Boolean(error.price)}
                helperText={error.price && error.price}
                InputProps={{
                  startAdornment: (
                    <Typography style={{ fontSize: 14 }}>$&nbsp;</Typography>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} container justify="flex-end">
            <Button className={classes.btn} onClick={onSubmit}>
              Update
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

export default EditUnit;
