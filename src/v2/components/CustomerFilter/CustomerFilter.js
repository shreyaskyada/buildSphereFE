import { Grid, makeStyles, MenuItem, Select } from "@material-ui/core";
import ArrowDown from "../../../assets/v2/ArrowDown.svg";
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
  arrowContainer: {
    backgroundColor: "#E5FAE7",
    height: 18,
    width: 18,
    borderRadius: "50%",
    pointerEvents: "none",
    position: "absolute",
    right: "10px",
  },
  chooseCustSelect: {
    marginLeft: "2%",
    height: "32px",
    fontSize: "12px",
    fontWeight: 500,
    paddingLeft: "10px",
    fontFamily: "Manrope",
    width: "120px",
    backgroundColor: "white",
    "& .MuiSelect-select": {
      backgroundColor: "white",
      "&:focus": {
        backgroundColor: "white",
      },
    },
  },

  menulabels: {
    fontFamily: "Manrope",
    backgroundColor: theme.v2.backgrounds.whiteBackground,
    fontSize: 14,
    fontWeight: 500,
    color: theme.v2.fonts.colors.blackShade1,
  },
}));

const CustomerFilter = ({ customers, filters, setFilters }) => {
  const [selectedValue, setSelectedValue] = useState("0");
  const classes = useStyles();
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 300,
        maxWidth: 200,
        minWidth: 130,
        marginTop: 50,
        marginLeft: -10,
      },
    },
  };

  return (
    <div style={{ marginLeft: "10px" }}>
      <Select
        variant="standard"
        className={classes.chooseCustSelect}
        style={{ color: `${selectedValue !== "0" ? "#113C23" : "#84A391"}` }}
        IconComponent={() => {
          return (
            <Grid
              className={classes.arrowContainer}
              container
              justify="center"
              alignItems="center"
            >
              <img src={ArrowDown} alt="Down" style={{ height: "4px" }} />
            </Grid>
          );
        }}
        onChange={(e) => {
          setSelectedValue(e.target.value);
          setFilters({ ...filters, customer: e.target.value, project: "0" });
        }}
        defaultValue={"0"}
        MenuProps={MenuProps}
      >
        {[
          <MenuItem key={-1} value={"0"} className={classes.menulabels}>
            Customer
          </MenuItem>,
          ...customers.map((cust, index) => {
            return (
              <MenuItem
                key={index}
                value={cust.customer_id}
                className={classes.menulabels}
              >
                {cust.customer.name}
              </MenuItem>
            );
          }),
        ]}
      </Select>
    </div>
  );
};

export default CustomerFilter;
