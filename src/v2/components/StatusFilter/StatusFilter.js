import { Grid, makeStyles, MenuItem, Select } from "@material-ui/core";
import ArrowDown from "../../../assets/v2/ArrowDown.svg";
import React from "react";

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
    maxHeight: 33,
    fontSize: 15,
    paddingLeft: "10px",
    color: "#84A391",
    fontFamily: "Manrope",
    width: 130,
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
    color: theme.v2.fonts.colors.blackShade1,
  },
}));

const StatusFilter = () => {
  const classes = useStyles();
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 300,
        maxWidth: 200,
        minWidth: 130,
      },
    },
  };

  return (
    <div style={{ marginLeft: "10px" }}>
      <Select
        variant="standard"
        className={classes.chooseCustSelect}
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
        defaultValue={"0"}
        MenuProps={MenuProps}
      >
        {[
          <MenuItem key={-1} value={"0"} className={classes.menulabels}>
            Status
          </MenuItem>,
          <MenuItem key={-1} value={"1"} className={classes.menulabels}>
            Status 1
          </MenuItem>,
          <MenuItem key={-1} value={"2"} className={classes.menulabels}>
            Status 2
          </MenuItem>,
          <MenuItem key={-1} value={"3"} className={classes.menulabels}>
            Status 3
          </MenuItem>,
        ]}
      </Select>
    </div>
  );
};

export default StatusFilter;
