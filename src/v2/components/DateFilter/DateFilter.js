import { Grid, Typography, makeStyles } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import React, { useState } from "react";
import Calendar from "../../../assets/v2/CalenderNew.svg";

const useStyles = makeStyles((theme) => ({
  label: {
    fontSize: 10,
    fontWeight: 500,
    marginLeft: "15px",
    color: "#84A391",
    fontFamily: "Manrope",
    marginTop: "-6px",
  },

  textField: {
    paddingLeft: "15px",

    "& .MuiInput-root": {
      height: "32px",
      width: "132px",
      fontWeight: 500,
      backgroundColor: "white",
      paddingLeft: "10px",
      fontFamily: "Manrope",
      fontSize: "12px",
    },
    "& .MuiInputBase-input::placeholder": {
      color: "#84A391",
      opacity: 1,
    },
    "& .MuiInputBase-input:not(:placeholder-shown)": {
      color: "#113C23",
    },
    "& .Mui-focused": {
      border: `1px solid ${theme.v2.borders.lightGreen}`,
    },

    "& .MuiFormHelperText-root": {
      border: 0,
    },
  },
}));

const DateFilter = ({ filters, setFilters }) => {
  const classes = useStyles();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startPlaceholder, setStartPlaceholder] = useState("- Select -");
  const [endPlaceholder, setEndPlaceholder] = useState("- Select -");

  const PopoverProps = {
    PaperProps: {
      style: { marginTop: 10 },
    },
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <Grid item xs={6}>
        <Typography className={classes.label}>Start</Typography>
        <KeyboardDatePicker
          fullWidth={true}
          autoOk={true}
          disableToolbar
          variant="inline"
          format="MM/DD/YYYY"
          id="date-picker-inline"
          value={startDate}
          placeholder={startPlaceholder}
          onFocus={() => setStartPlaceholder("mm/dd/yyyy")}
          onBlur={() => setStartPlaceholder("- Select -")}
          onChange={(date) => {
            setStartDate(date ? date.format("MM/DD/YYYY") : null);
            setFilters({
              ...filters,
              startDate: date ? date.format("MM/DD/YYYY") : null,
            });
          }}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
          PopoverProps={PopoverProps}
          InputProps={{
            autoComplete: "off",
          }}
          className={classes.textField}
          keyboardIcon={
            <img
              src={Calendar}
              alt="calendar"
              style={{ height: "16px", width: "15px" }}
            />
          }
        />
      </Grid>
      <Grid item xs={6}>
        <Typography className={classes.label}>End</Typography>
        <KeyboardDatePicker
          fullWidth={true}
          autoOk={true}
          disableToolbar
          variant="inline"
          format="MM/DD/YYYY"
          id="date-picker-inline"
          value={endDate}
          placeholder={endPlaceholder}
          onFocus={() => setEndPlaceholder("mm/dd/yyyy")}
          onBlur={() => setEndPlaceholder("- Select -")}
          onChange={(date) => {
            setEndDate(date ? date.format("MM/DD/YYYY") : null);
            setFilters({
              ...filters,
              endDate: date ? date.format("MM/DD/YYYY") : null,
            });
          }}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
          PopoverProps={PopoverProps}
          InputProps={{
            autoComplete: "off",
          }}
          className={classes.textField}
          keyboardIcon={
            <img
              src={Calendar}
              alt="calendar"
              style={{ height: "16px", width: "15px" }}
            />
          }
        />
      </Grid>
    </div>
  );
};

export default DateFilter;
