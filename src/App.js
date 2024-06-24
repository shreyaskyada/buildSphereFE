import React, { useEffect, useState } from "react";
import "./App.css";
import { lazy } from "react";
import { Switch, withRouter, Route, Redirect } from "react-router-dom";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { Button, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import _ from "lodash";
import {
  ROUTE_ACCOUNTS_SUBSCRIPTION,
  ROUTE_HOME,
  ROUTE_LOGIN,
  ROUTE_SIGNUP,
  ROUTE_PROJECTS,
  ROUTE_PAYMENTS,
  ROUTE_RESET,
  ROUTE_PROFILE,
  ROUTE_MEMBERS,
  RESET_PASSWORD,
  ROUTE_LICENSE_SUBSCRIPTION,
  ROUTE_FORCE_CHANGE_PASSWORD,
  ROUTE_PAY_NOW,
  ROUTE_INSPECTION_DOWNLOAD,
} from "./helpers/endpoints";
import { useSelector } from "react-redux";
import Footer from "./v2/components/Footer/Footer";

// import ProjectDetails from "./v2/screens/ProjectDetails";
const ProjectDetails = lazy(() => import("./v2/screens/ProjectDetails"));
// import Projects from "./v2/screens/Projects";
const Projects = lazy(() => import("./v2/screens/Projects"));

// import SideDrawer from "./v2/components/SideDrawer";
const SideDrawer = lazy(() => import("./v2/components/SideDrawer"));
// import Login from "./v2/screens/Login";
const Login = lazy(() => import("./v2/screens/Login"));
// import Signup from "./v2/screens/Signup";
const Signup = lazy(() => import("./v2/screens/Signup"));
// import ErrorHandler from "./v2/components/ErrorHandler";
const ErrorHandler = lazy(() => import("./v2/components/ErrorHandler"));
// import Dashboard from "./v2/screens/Dashboard";
const Dashboard = lazy(() => import("./v2/screens/Dashboard"));
// import Subscription from "./v2/screens/Accounts/Subscription";
const Subscription = lazy(() => import("./v2/screens/Accounts/Subscription"));

// import Payments from "./v2/screens/Accounts/Payment";
const Payments = lazy(() => import("./v2/screens/Accounts/Payment"));
// import Profile from "./v2/screens/Profile";
const Profile = lazy(() => import("./v2/screens/Profile"));
// import Members from "./v2/screens/Members";
const Members = lazy(() => import("./v2/screens/Members"));

// import Reset from "./v2/screens/Reset";
const Reset = lazy(() => import("./v2/screens/Reset"));
// import LicenseSubscription from "./v2/screens/LicenseSubscription";
const LicenseSubscription = lazy(() =>
  import("./v2/screens/LicenseSubscription")
);
// import ForceChangePassword from "./v2/screens/ForceChangePassword";
const ForceChangePassword = lazy(() =>
  import("./v2/screens/ForceChangePassword")
);
// import PayNow from "./v2/screens/PayNowScreen";
const PayNow = lazy(() => import("./v2/screens/PayNowScreen"));

const RoutesWithoutSideDrawer = [
  ROUTE_LOGIN,
  ROUTE_SIGNUP,
  ROUTE_RESET,
  ROUTE_FORCE_CHANGE_PASSWORD,
  ROUTE_INSPECTION_DOWNLOAD,
];

function App(props) {
  const token = useSelector((state) => _.get(state, ["auth", "token"]));
  const expired = useSelector((state) => state.expired_license);
  const no_plan = useSelector((state) => state.no_plan);

  const [showPayButton, setShowPayButton] = useState(false);
  const [hidePlan, setHidePlan] = useState(false);
  useEffect(() => {
    setShowPayButton(expired);
  }, [expired, setShowPayButton]);

  useEffect(() => {
    setHidePlan(
      props.location.pathname == ROUTE_ACCOUNTS_SUBSCRIPTION ||
        props.location.pathname == ROUTE_PAYMENTS
    );
  }, [props.location.pathname, setHidePlan]);

  useEffect(() => {
    const { stripe, elements } = props;
  }, [props]);
  if (
    !token &&
    props.location.pathname !== ROUTE_LOGIN &&
    props.location.pathname !== ROUTE_RESET &&
    props.location.pathname !== ROUTE_SIGNUP &&
    props.location.pathname !== ROUTE_FORCE_CHANGE_PASSWORD &&
    props.location.pathname !== ROUTE_INSPECTION_DOWNLOAD
  ) {
    return <Redirect to={ROUTE_LOGIN} />;
  }
  console.log("app.js");
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      {showPayButton && (
        <div
          style={{
            height: 70,
            width: "100vw",
            backgroundColor: "#58A77A",
            position: "fixed",
            left: 0,
            zIndex: 9999,
            color: "white",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            Your payment is due, please pay now. &nbsp;&nbsp;
            <Button
              onClick={() => {
                props.history.push(ROUTE_LICENSE_SUBSCRIPTION);
              }}
              style={{
                backgroundColor: "white",
                color: "#58A77A",
                borderRadius: 10,
              }}
            >
              Pay Now
            </Button>
          </div>
          <IconButton onClick={setShowPayButton.bind(this, false)}>
            <CloseIcon
              style={{
                color: "white",
              }}
            />
          </IconButton>
        </div>
      )}
      {no_plan && !hidePlan && (
        <div
          style={{
            height: 70,
            width: "100vw",
            backgroundColor: "#E36767",
            position: "fixed",
            left: 0,
            zIndex: 9999,
            color: "white",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            You have not subscribed to a plan, please subscribe today.
            &nbsp;&nbsp;
            <Button
              onClick={() => {
                props.history.push(ROUTE_ACCOUNTS_SUBSCRIPTION);
              }}
              style={{
                backgroundColor: "white",
                color: "#58A77A",
                borderRadius: 10,
              }}
            >
              Subscribe Now
            </Button>
          </div>
        </div>
      )}
      <div style={{ display: "flex" }}>
        {!RoutesWithoutSideDrawer.includes(props.location.pathname) && (
          <SideDrawer />
        )}
        <ErrorHandler />
        <div>
          <Switch>
            {/* <Route
            path={ROUTE_INSPECTION_DOWNLOAD}
            exact
            component={InspectionReportDownload}
          /> */}
            <Route path={ROUTE_LOGIN} component={Login} />
            <Route path={ROUTE_SIGNUP} component={Signup} />
            <Route path={ROUTE_HOME} exact component={Dashboard} />
            <Route path={`${ROUTE_PROJECTS}/:id`} component={ProjectDetails} />
            <Route path={ROUTE_PROJECTS} exact component={Projects} />
            <Route path={ROUTE_PAYMENTS} component={Payments} />
            <Route
              path={ROUTE_ACCOUNTS_SUBSCRIPTION}
              component={Subscription}
            />
            <Route path={ROUTE_PROFILE} component={Profile} />
            <Route path={ROUTE_MEMBERS} component={Members} />
            <Route path={ROUTE_PAY_NOW} component={PayNow} />

            <Route
              path={ROUTE_LICENSE_SUBSCRIPTION}
              component={LicenseSubscription}
            />
            <Route
              path={ROUTE_ACCOUNTS_SUBSCRIPTION}
              exact
              component={Subscription}
            />
            <Route path={RESET_PASSWORD} exact component={Reset} />

            <Route
              path={ROUTE_FORCE_CHANGE_PASSWORD}
              exact
              component={ForceChangePassword}
            />
            <Route
              path={"/"}
              render={() => {
                return <Redirect to={ROUTE_HOME} />;
              }}
            />
          </Switch>
          {/* <Footer /> */}
        </div>
      </div>
    </MuiPickersUtilsProvider>
  );
}

export default withRouter(App);
