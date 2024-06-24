import {
  Button,
  Drawer,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { ReactComponent as RightChevron } from "../../assets/v2/RightChevron.svg";
import { ReactComponent as LeftChevron } from "../../assets/v2/LeftChevron.svg";
import Logo from "../../assets/v2/Logo.svg";
import LogoFull from "../../assets/v2/Rus2billlogo.svg";
import { ReactComponent as Logout } from "../../assets/v2/Logout.svg";
import { ReactComponent as Home } from "../../assets/v2/Home.svg";
import { ReactComponent as Projects } from "../../assets/v2/Projects.svg";
import { LOGOUT_ACTION } from "../../GlobalConstants";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router";
import {
  ROUTE_LICENSE_SUBSCRIPTION,
  ROUTE_HOME,
  ROUTE_MEMBERS,
  ROUTE_PROFILE,
  ROUTE_PROJECTS,
} from "../../helpers/endpoints";
import _ from "lodash";
const h = window.outerHeight;
const w = window.outerWidth;
const closedDrawerWidth = 0.05 * w;

const useStyles = makeStyles((theme) => ({
  drawerOpen: {
    width: 0.13 * w,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawer: {
    width: "104px",
  },
  drawerGrid: {
    height: h,
    paddingLeft: "7%",
    backgroundColor: "#113C23",
    overflowX: "hidden",
  },
  iconContainer: {
    display: "flex",
  },
  icon: {
    color: theme.v2.fonts.colors.darkFont,
  },
  iconSelected: {
    color: theme.v2.fonts.colors.whiteFont,
  },
  label: {
    fontSize: 16,
    color: theme.v2.fonts.colors.darkFont,
  },
  sublabel: {
    paddingLeft: "20%",
    fontSize: 14,
    color: theme.v2.fonts.colors.darkFont,
    textAlign: "right",
  },
  labelSelected: {
    fontWeight: "bold",
    color: theme.v2.fonts.colors.whiteFont,
  },
  selectedButton: {},
  btn: {
    background: "transparent",
    width: "80%",
    justifyContent: "flex-start",
    "&.MuiButtonBase-root": {
      height: 0.06 * h,
    },
    "&:hover": {
      backgroundColor: "#363837",
    },
  },
  chevron: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.v2.backgrounds.darkBackgroundShade2,
    },
  },
  imageContainer: {
    backgroundColor: theme.v2.backgrounds.greenBackground,
    height: h / 30,
    width: h / 30,
    borderRadius: h / 30,
  },
  imageText: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.blackShade1,
  },
  iconsub: {
    height: h / 25,
    width: h / 25,
    borderRadius: h / 25,
  },
}));

const SideDrawer = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [showSubRoutes, setShowSubRoutes] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(0);
  const [selectedSubLabel, setSelectedSubLabel] = useState(0);
  const dispatch = useDispatch();
  let profile = useSelector((state) => state.auth.profile);
  profile = JSON.parse(profile);
  useEffect(() => {
    switch (props.history.location.pathname) {
      case ROUTE_HOME:
        setSelectedLabel(0);
        break;
      case ROUTE_PROJECTS:
        setSelectedLabel(1);
        break;
      case ROUTE_PROFILE:
        setSelectedLabel(3);
        setSelectedSubLabel(0);
        break;
      case ROUTE_MEMBERS:
        setSelectedLabel(3);
        setSelectedSubLabel(1);
        break;
      case ROUTE_LICENSE_SUBSCRIPTION:
        setSelectedLabel(4);
        setSelectedSubLabel(1);
        break;
      // case ROUTE_PAYMENTS:
      //   setSelectedLabel(5);
      //   setSelectedSubLabel(2);
      //   break;
      default:
        break;
    }
    if (
      props.history.location.pathname.startsWith(ROUTE_PROFILE) ||
      props.history.location.pathname.startsWith(ROUTE_MEMBERS) ||
      props.history.location.pathname.startsWith(ROUTE_LICENSE_SUBSCRIPTION)
    )
      setShowSubRoutes(true);
    else setShowSubRoutes(false);
    if (props.history.location.pathname.startsWith(ROUTE_PROJECTS))
      setSelectedLabel(1);
  }, [props.history.location.pathname, setSelectedLabel]);
  const navigateToRoute = (route) => {
    props.history.push(route);
  };
  return (
    <Drawer
      variant="permanent"
      className={classes.drawer}
      classes={{
        paper: classes.drawer,
      }}
    >
      <Grid
        container
        item
        className={classes.drawerGrid}
        style={{ margin: 0, padding: 0 }}
      >
        <Grid container item xs={12}></Grid>
        <Grid
          container
          item
          xs={12}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "25px",
          }}
        >
          <img src={Logo} alt={"Logo"} style={{ height: "46px" }} />
        </Grid>
        <Grid
          container
          item
          xs={12}
          style={{
            paddingLeft: "10px",
            marginTop: "80px",
          }}
        >
          <Button
            variant="contained"
            startIcon={
              <Grid container>
                <Home
                  fill={selectedLabel === 0 ? "white" : "#696969"}
                  style={{
                    width: "30px",
                    height: "24px",
                    paddingLeft: "10px",
                  }}
                />
              </Grid>
            }
            className={clsx(classes.btn, {
              [classes.selectedButton]: selectedLabel === 0,
            })}
            onClick={navigateToRoute.bind(this, ROUTE_HOME)}
          ></Button>
        </Grid>
        <Grid container item xs={12} style={{ paddingLeft: "10px" }}>
          <Button
            variant="contained"
            startIcon={
              <Grid container>
                <Projects
                  fill={selectedLabel === 1 ? "white" : "#696969"}
                  style={{
                    width: "30px",
                    height: "24px",
                    paddingLeft: "10px",
                  }}
                />
              </Grid>
            }
            className={clsx(classes.btn, {
              [classes.selectedButton]: selectedLabel === 1,
            })}
            onClick={navigateToRoute.bind(this, ROUTE_PROJECTS)}
          ></Button>
        </Grid>
        <Grid container item xs={12} style={{ paddingLeft: "10px" }}>
          <Button
            variant="contained"
            startIcon={
              <Grid
                container
                style={{
                  paddingLeft: "8px",
                }}
              >
                {profile.file && (
                  <img
                    src={profile.file}
                    alt={"Logo"}
                    className={clsx(classes.iconsub, {
                      [classes.iconSelected]: selectedLabel === 3,
                    })}
                  />
                )}
                {!profile.file && (
                  <Grid container className={classes.imageContainer}>
                    <Typography className={classes.imageText}>
                      {_.get(profile, "first_name", "") &&
                        _.upperCase(
                          _.get(profile, "first_name", "").substring(0, 1)
                        )}
                      {_.get(profile, "last_name", "") &&
                        _.upperCase(
                          _.get(profile, "last_name", "").substring(0, 1)
                        )}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            }
            className={clsx(classes.btn, {
              [classes.selectedButton]: selectedLabel === 3,
            })}
            onClick={navigateToRoute.bind(this, ROUTE_PROFILE)}
          ></Button>
          {showSubRoutes && (
            <Grid
              container
              item
              justify="flex-end"
              style={{ marginRight: "10%" }}
            >
              <Button
                style={{ height: 40 }}
                variant="contained"
                className={clsx(classes.btn, {
                  [classes.selectedButton]:
                    selectedSubLabel === 0 && selectedLabel === 3,
                })}
                onClick={navigateToRoute.bind(this, ROUTE_PROFILE)}
              >
                {open ? (
                  <Typography
                    className={clsx(classes.sublabel, {
                      [classes.labelSelected]:
                        selectedSubLabel === 0 && selectedLabel === 3,
                    })}
                  >
                    Profile
                  </Typography>
                ) : (
                  ""
                )}
              </Button>
            </Grid>
          )}
          {showSubRoutes && (
            <Grid
              container
              item
              justify="flex-end"
              style={{ marginRight: "10%" }}
            >
              <Button
                style={{ height: 40 }}
                variant="contained"
                className={clsx(classes.btn, {
                  [classes.selectedButton]:
                    selectedSubLabel === 1 && selectedLabel === 3,
                })}
                onClick={navigateToRoute.bind(this, ROUTE_MEMBERS)}
              >
                {open ? (
                  <Typography
                    className={clsx(classes.sublabel, {
                      [classes.labelSelected]:
                        selectedSubLabel === 1 && selectedLabel === 3,
                    })}
                  >
                    Members
                  </Typography>
                ) : (
                  ""
                )}
              </Button>
            </Grid>
          )}
          {showSubRoutes && (
            <Grid
              container
              item
              justify="flex-end"
              style={{ marginRight: "10%" }}
            >
              <Button
                style={{ height: 40 }}
                variant="contained"
                className={clsx(classes.btn, {
                  [classes.selectedButton]:
                    selectedSubLabel === 1 && selectedLabel === 4,
                })}
                onClick={navigateToRoute.bind(this, ROUTE_LICENSE_SUBSCRIPTION)}
              >
                {open ? (
                  <Typography
                    className={clsx(classes.sublabel, {
                      [classes.labelSelected]:
                        selectedSubLabel === 1 && selectedLabel === 4,
                    })}
                  >
                    Subscription
                  </Typography>
                ) : (
                  ""
                )}
              </Button>
            </Grid>
          )}
        </Grid>
        <Grid
          container
          item
          xs={11}
          style={{
            paddingTop: showSubRoutes ? 0.2 * h : 0.35 * h,
            paddingLeft: "20px",
          }}
        >
          <Button
            variant="contained"
            startIcon={
              <Logout
                stroke={selectedLabel === 4 ? "white" : "#696969"}
                style={{ width: "21px", height: "20px", paddingLeft: "10px" }}
              />
            }
            className={clsx(classes.btn, {
              [classes.selectedButton]: selectedLabel === 4,
            })}
            onClick={() => {
              setSelectedLabel(4);
              localStorage.clear();
              dispatch({ type: LOGOUT_ACTION });
            }}
          ></Button>
        </Grid>
      </Grid>
    </Drawer>
  );
};

export default withRouter(SideDrawer);
