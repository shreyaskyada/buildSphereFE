import {
  Button,
  Grid,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
  Tooltip
} from "@material-ui/core";
import React, { useState } from "react";
import CollapseScreen from "../../assets/v2/CollapseScreen.svg";
import UncollapseScreen from "../../assets/v2/UncollapseScreen.svg";

import Filter from "../../assets/v2/Filter.svg";

import _ from "lodash";
import TableContainer from "./Table";
import clsx from "clsx";
import ArrowDown from "../../assets/v2/ArrowDown.svg";
import FullscreenIcon from '../../assets/v2/FullScreen.svg';
import FullscreenExitIcon from '../../assets/v2/ExitFullScreen.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 10,
    border: `1px solid ${theme.v2.borders.lightGrey}`,
    padding: "2%",
    margin: "2%",
    backgroundColor: theme.v2.backgrounds.whiteBackground,
  },
  rootFullscreen: {
    position: "fixed",
    backgroundColor: theme.v2.backgrounds.whiteBackground,
    padding: "1%",
    height: "100%",
    width: "100%",
    top: 0,
    left: 0,
    zIndex: 10000,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.blackShade1,
  },
  collapseScreen: {
    cursor: "pointer",
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: theme.v2.backgrounds.redBackground,
  },
  fullScreen: {
    cursor: "pointer",
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: theme.v2.backgrounds.greenBackgroundShade3,
  },
  search: {
    "& .MuiInput-root": {
      backgroundColor: theme.v2.backgrounds.whiteBackground,
      border: `1px solid ${theme.v2.borders.lightGrey}`,
      borderRadius: 5,
      color: theme.v2.fonts.colors.greyShade1,
      fontSize: 16,
      fontWeight: 600,
    },
  },
  headerBtn: {
    fontSize: 18,
    fontWeight: 400,
    padding: "5%",
    width: 150,
    border: 0,
  },
  filterHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.darkFont,
    padding: "0% 2%",
  },
  filterSelect: {
    "& .MuiInput-root": {
      backgroundColor: theme.v2.backgrounds.whiteBackground,
      border: `1px solid ${theme.v2.borders.lightGrey}`,
      borderRadius: 5,
      color: theme.v2.fonts.colors.greyShade1,
      width: 200,
    },
  },
  sortBy: {
    fontSize: 14,
    color: theme.v2.fonts.colors.standard,
  },
  selectContainer: {
    maxHeight: 40,
    fontSize: 14,
    color: theme.v2.fonts.colors.blackShade1,
    width: 170,
    padding: "5%",
    backgroundColor: theme.v2.backgrounds.whiteBackground,
    border: `1px solid ${theme.v2.borders.lightGrey}`,
    "& .MuiSelect-select": {
      backgroundColor: theme.v2.backgrounds.whiteBackground,
      "&:focus": {
        backgroundColor: theme.v2.backgrounds.whiteBackground,
      },
    },
  },
  sortBtn: {
    width: 100,
  },
  arrowContainer: {
    backgroundColor: theme.v2.backgrounds.greenBackgroundShade4,
    height: 25,
    width: 25,
    borderRadius: 25,
    padding: "5%",
    zIndex: 1000,
  },
}));

const CollapsibleTableContainer = (props) => {
  const classes = useStyles();
  const header = props.header || "";
  const [openContainer, setOpenContainer] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
  const button = _.get(props, ["button"]) || "";
  const select = _.get(props, ["select"]) || null;
  const filters = props.filters || [];
  const table = props.table || [];
  return (
    <Grid
      container
      className={clsx({
        [classes.root]: !fullScreen,
        [classes.rootFullscreen]: fullScreen,
      })}
    >
      <Grid container style={{ width: "100%", maxHeight: 70 }}>
        <Grid
          item
          xs={6}
          container
          spacing={1}
          alignItems="center"
          justify={"flex-start"}
        >
          <Grid item>
            <Typography className={classes.header}>{header}</Typography>
          </Grid>
          {/* <Grid item>
            <img
              src={DownloadArrow}
              alt="download"
              style={{ cursor: "pointer" }}
            />
          </Grid> */}
          {button && (
            <Grid item style={{ marginLeft: "5%" }}>
              <Button
                variant="outlined"
                className={clsx(classes.headerBtn, {
                  [button.classes]: Boolean(button.classes),
                })}
                onClick={button.onClick}
              >
                {_.get(button, "header")}
              </Button>
            </Grid>
          )}
        </Grid>
        <Grid
          item
          xs={6}
          container
          justify="flex-end"
          spacing={2}
          alignItems="center"
        >
          {select && (
            <Grid item>
              <Select
                variant="standard"
                className={classes.selectContainer}
                IconComponent={() => {
                  return (
                    <Grid
                      className={classes.arrowContainer}
                      container
                      justify="center"
                      alignItems="center"
                    >
                      <img src={ArrowDown} alt="Down" />
                    </Grid>
                  );
                }}
                onChange={(e) => {
                  if (_.get(props, ["select", "setValue"]))
                    _.get(props, ["select", "setValue"])(e.target.value);
                }}
                defaultValue={"0"}
              >
                <MenuItem key={-1} value={"0"} className={classes.menulabels}>
                  Select User
                </MenuItem>
                {_.get(select, "items", []).map((item, index) => {
                  return (
                    <MenuItem
                      key={index}
                      value={_.get(item, "value")}
                      className={classes.menulabels}
                    >
                      {_.get(item, "name")}
                    </MenuItem>
                  );
                })}
              </Select>
            </Grid>
          )}
          {/* <Grid item xs={9}>
            <TextField
              fullWidth={true}
              placeholder="Search"
              className={classes.search}
              InputProps={{
                endAdornment: <img src={Search} alt="Search" />,
              }}
            />
          </Grid> */}
          <Grid item xs={1} container justify="flex-end">
            <Grid
              item
              className={classes.fullScreen}
              container
              justify="center"
              alignItems="center"
              onClick={() => {
                setFullScreen(!fullScreen);
                setOpenContainer(true);
              }}
            >
              {/* <img src={fullScreen ? FitToScreen : FullScreen} alt="max" /> */}
              {!fullScreen ?
                <Tooltip title='Enter full screen'>

                  <img src={FullscreenIcon} alt='full screen' />
                </Tooltip> : <Tooltip title='Exit full screen'>

                  <img src={FullscreenExitIcon} alt='full screen' /></Tooltip>}
            </Grid>
          </Grid>
          <Grid item xs={1} container justify="flex-end">
            <Grid
              item
              className={classes.collapseScreen}
              container
              justify="center"
              alignItems="center"
              onClick={setOpenContainer.bind(this, !openContainer)}
            >
              <img
                src={openContainer ? CollapseScreen : UncollapseScreen}
                alt="min"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        style={{
          margin: "2% 0%",
          display: openContainer ? "flex" : "none",
          maxHeight: 70,
        }}
        spacing={2}
      >
        {filters.map((filter, index) => {
          return (
            <Grid container item xs={4} key={index} alignItems="center">
              <img src={Filter} alt="filter" />
              <Typography className={classes.filterHeader}>
                {filter.label}
              </Typography>
              <TextField
                select
                className={classes.filterSelect}
                onChange={filter.onChange}
              >
                {_.get(filter, "values", []).map((filter, index) => {
                  return (
                    <MenuItem key={index} value={filter.value}>
                      {filter.name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>
          );
        })}
      </Grid>
      <Grid container style={{ display: openContainer ? "block" : "none" }}>
        <TableContainer
          selectedHeader={_.get(table, "selectedHeader") || 0}
          sections={_.get(table, ["sections"]) || []}
          headers={_.get(table, ["headers"]) || []}
          data={_.get(table, ["data"]) || []}
          sortDirection={_.get(table, ["sortDirection"]) || ""}
          sortBy={_.get(table, ["sortBy"]) || ""}
          onClickRow={_.get(table, ["onClickRow"]) || null}
          rowClasses={_.get(table, ["rowClasses"]) || null}
          edit={_.get(table, ["edit"]) || null}
          deleterow={_.get(table, ["deleterow"]) || null}
          inviteUserAgain={_.get(table, ["inviteUserAgain"]) || null}
        />
      </Grid>
      {fullScreen && (
        <Grid container style={{ height: 500, display: "hidden" }}></Grid>
      )}
    </Grid>
  );
};

export default CollapsibleTableContainer;
