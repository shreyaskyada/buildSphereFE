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
import { withSnackbar } from "notistack";
import axios from "../../axios";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  paper: {
    outline: "none",
    margin: "5% 25%",
    borderRadius: 10,
    padding: "4%",
    height: "70vh",
    overflow: "auto",
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

const UnitsNeedPricingModal = (props) => {
  const classes = useStyles();
  const units = props.units;
  const [price, setPrice] = useState({});
  const token = useSelector((state) => state.auth.token);
  const onSubmit = async () => {
    try {
      const unitsWithPrice = [];
      _.keys(price).forEach((key) => {
        if (price[key]) {
          unitsWithPrice.push({
            unit_id: key,
            value: parseFloat(price[key]).toFixed(2),
          });
        }
      });
      if (unitsWithPrice.length > 0) {
        const result = await axios.patch(
          `/projects/${props.projectId}/units?p=project:${props.projectId}`,
          unitsWithPrice,
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
      } else {
        props.enqueueSnackbar("Please add a price to atleast 1 unit", {
          variant: "error",
        });
      }
    } catch (err) {
      props.enqueueSnackbar("Something went wrong", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    setPrice({});
  }, [props]);

  return (
    <Modal open={props.open}>
      <Paper className={classes.paper}>
        <Grid container style={{ marginBottom: "5%" }}>
          <Grid item xs={6}>
            <Typography className={classes.header}>
              Units Need Pricing
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
        </Grid>
        <Grid container spacing={2} justify="space-between">
          <Grid item xs={5} className={classes.subHeadersContainer}>
            <Typography className={classes.subHeaders}>Units</Typography>
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={6} className={classes.subHeadersContainer}>
            <Typography className={classes.subHeaders}>Price*</Typography>
          </Grid>
          {units.map((unit, index) => {
            return (
              <Grid
                item
                xs={12}
                key={index}
                container
                style={{ padding: "2% 0%" }}
              >
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
                      if (value) {
                        setPrice((prev) => {
                          return { ...prev, [unit.id]: value };
                        });
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <Typography style={{ fontSize: 14 }}>
                          $&nbsp;
                        </Typography>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            );
          })}
          <Grid item xs={12} container justify="flex-end">
            <Button className={classes.btn} onClick={onSubmit}>
              Save
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

export default withSnackbar(UnitsNeedPricingModal);
