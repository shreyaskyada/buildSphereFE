import { Drawer, makeStyles, IconButton } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import Logo from "../../assets/v2/Logo.svg";
import { ReactComponent as Logout } from "../../assets/v2/Logout.svg";
import { ReactComponent as Home } from "../../assets/v2/Home.svg";
import { ReactComponent as Projects } from "../../assets/v2/Projects.svg";
import { ReactComponent as Profile } from "../../assets/v2/Profile.svg";
import { ReactComponent as ActivityLog } from "../../assets/v2/ActivityLog.svg";
import { ReactComponent as Contracts } from "../../assets/v2/ContractIcon.svg";
import { LOGOUT_ACTION } from "../../GlobalConstants";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router";
import {
  ROUTE_HOME,
  ROUTE_PROFILE,
  ROUTE_PROJECTS,
  ROUTE_ACTIVITY_LOG,
  ROUTE_CONTRACTS,
  ROUTE_INSPECTION_CHECKLIST_LIBRARY,
} from "../../helpers/endpoints";
import _ from "lodash";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: "104px",
    backgroundColor: "#113C23",
    display: "flex",
    alignItems: "center",
    padding: "32px 0",
    paddingBottom: "12px",
    boxSizing: "border-box",
  },
  logo: {
    transform: "translateX(7px)",
  },
  label: {
    fontSize: "10px",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    transition: "all 0.3s ease-in-out",
    opacity: 0.5,
    "& p": {
      color: "#113C23",
      transition: "all 0.3s ease-in-out",
    },
    "&:hover p": {
      color: "#FFFFFF",
    },
    "&:hover": {
      opacity: 1,
    },
  },
  iconContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginTop: "74px",
    flex: 1,
  },
  active: {
    opacity: 1,
  },
  logoutButton: {
    padding: 0,
    "& .MuiIconButton-label": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  },
}));

const sidebarItems = [
  {
    label: "Dashboard",
    icon: <Home />,
    pathname: ROUTE_HOME,
  },
  {
    label: "Contracts",
    icon: <Contracts />,
    pathname: ROUTE_CONTRACTS,
  },
  {
    label: "Projects",
    icon: <Projects />,
    pathname: ROUTE_PROJECTS,
  },
  // {
  //   label: "Inspection Checklist",
  //   icon: <Projects />,
  //   pathname: ROUTE_INSPECTION_CHECKLIST_LIBRARY,
  // },
  {
    label: "Activity Log",
    icon: <ActivityLog />,
    pathname: ROUTE_ACTIVITY_LOG,
  },
  {
    label: "Profile",
    icon: <Profile />,
    pathname: ROUTE_PROFILE,
  },
];

const SideDrawer = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <Drawer
      variant="permanent"
      className={classes.drawer}
      classes={{
        paper: classes.drawer,
      }}
    >
      <NavLink to="/">
        <img
          src={Logo}
          className={classes.logo}
          alt={"Logo"}
          style={{ height: "46px" }}
        />
      </NavLink>

      <div className={classes.iconContainer}>
        {sidebarItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.pathname}
            activeClassName={classes.active}
            className={classes.label}
          >
            {item.icon}
            <p>{item.label}</p>
          </NavLink>
        ))}
      </div>
      <div>
        <IconButton
          activeClassName={classes.active}
          className={clsx(classes.label, classes.logoutButton)}
          role="button"
          onClick={() => {
            localStorage.clear();
            dispatch({ type: LOGOUT_ACTION });
          }}
        >
          <Logout />
          <p>Logout</p>
        </IconButton>
      </div>
    </Drawer>
  );
};

export default withRouter(SideDrawer);
