import {
  Grid,
  makeStyles,
  Popover,
  TextField,
  Typography,
  Checkbox,
  withStyles,
} from "@material-ui/core";
import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import DropdownGreen from "../../assets/v2/DropdownGreen.svg";
import RightTick from "../../assets/v2/RightTick.svg";
import axios from "../../axios";
import _ from "lodash";
import { useSelector } from "react-redux";

const GreenCheckbox = withStyles((theme) => ({
  root: {
    color: theme.v2.checkboxes.green,
    "&$checked": {
      color: theme.v2.checkboxes.green,
    },
  },
  checked: {},
}))((props) => <Checkbox color="default" {...props} />);

const useStyles = makeStyles((theme) => ({
  customer: {
    fontSize: 20,
    color: theme.v2.fonts.colors.darkFont,
  },
  parentTextField: {
    "& .MuiInput-root": {
      backgroundColor: theme.v2.backgrounds.whiteBackground,
      border: `1px solid ${theme.v2.borders.darkShade2}`,
      fontSize: 12,
      color: theme.v2.fonts.colors.darkFont,
    },
  },
  innerTextField: {
    margin: "4%",
    "& .MuiInput-root": {
      backgroundColor: theme.v2.backgrounds.whiteBackground,
      border: `1px solid ${theme.v2.borders.darkShade2}`,
      fontSize: 20,
      color: theme.v2.fonts.colors.darkFont,
    },
  },
  popover: {
    "& .MuiPopover-paper": {
      border: `1px solid ${theme.v2.borders.darkShade2}`,
      borderTop: 0,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      width: "40vh",
      padding: "1% 0%",
    },
  },
  greenBackground: {
    backgroundColor: theme.v2.backgrounds.greenBackgroundShade4,
  },
}));

const CustomerDropdown = (props) => {
  const classes = useStyles();
  const value = props.value || "";
  const setValue = props.setValue;
  const error = props.error;
  const [customers, setCustomers] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => JSON.parse(state.auth.profile));
  const groupId = _.get(profile, "group_id");

  const getCustomers = useCallback(async () => {
    try {
      const result = await axios.get(
        `/groups/${groupId}/customers?p=group:${groupId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        setCustomers(
          _.defaultTo(_.get(result, ["data", "message"]), []).map(
            (customer) => {
              return {
                id: _.get(customer, "customer_id"),
                value: _.get(customer, ["customer", "name"]),
              };
            }
          )
        );
      }
    } catch (err) {}
  }, [groupId, token]);

  useEffect(() => {
    getCustomers();
  }, [getCustomers]);
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <Grid>
      <TextField
        fullWidth={true}
        value={value.value}
        id="customer"
        InputProps={{
          endAdornment: <img src={DropdownGreen} alt={"select"} />,
        }}
        aria-describedby={"popper"}
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}
        onChange={(e) => {
          setValue({ value: e.target.value });
        }}
        className={classes.parentTextField}
        helperText={error.customer}
        error={Boolean(error.customer)}
      />
      <Popover
        id="popper"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={setAnchorEl.bind(this, null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        elevation={0}
        className={classes.popover}
      >
        <Grid container>
          {customers.map((customer, index) => {
            return (
              <Grid
                item
                xs={12}
                key={index}
                style={{ marginBottom: "2%", padding: "0% 2%" }}
                className={clsx({
                  [classes.greenBackground]: value.id === customer.id,
                })}
                container
                alignItems="center"
              >
                <Grid item xs={2}>
                  <GreenCheckbox
                    checked={value.id === customer.id}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setValue({ value: customer.value, id: customer.id });
                      } else setValue(null);
                    }}
                  />
                </Grid>
                <Grid item xs={10}>
                  <Typography className={classes.customer}>
                    {customer.value}
                  </Typography>
                </Grid>
              </Grid>
            );
          })}
          <TextField
            className={classes.innerTextField}
            fullWidth={true}
            placeholder="Add customer"
            onChange={(e) => {
              setValue({ value: e.target.value });
            }}
            value={_.get(value, "value") || ""}
            InputProps={{
              endAdornment: <img src={RightTick} alt={"select"} />,
            }}
          />
        </Grid>
      </Popover>
    </Grid>
  );
};

export default CustomerDropdown;
