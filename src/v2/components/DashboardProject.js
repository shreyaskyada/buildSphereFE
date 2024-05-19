import {
  Grid,
  makeStyles,
  Popover,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { useCallback, useState } from "react";
import { ReactComponent as Bell } from "../../assets/v2/Bell.svg";
import { ReactComponent as UnitsNeedPricing } from "../../assets/v2/UnitsNeedPricing.svg";
import { ReactComponent as FailedInspection } from "../../assets/v2/FailedInspection.svg";
import { ReactComponent as FailedSafetyReports } from "../../assets/v2/FailedSafetyReports.svg";
import { ReactComponent as ActualVsPlanned } from "../../assets/v2/ActualVsPlanned.svg";
import ClosedJob from "../../assets/v2/ClosedJob.svg";
import CompletedJob from "../../assets/v2/CompletedJob.svg";
import CancelledJob from "../../assets/v2/CancelledJob.svg";
import HoldJob from "../../assets/v2/HoldJob.svg";
import OpenJob from "../../assets/v2/OpenJob.svg";
import { ReactComponent as SandTimer } from "../../assets/v2/SandTimer.svg";
import CrossSmall from "../../assets/v2/CrossSmall.svg";
import moment from "moment";
import { calculateTimeBudgetObject } from "../../helpers/date";
import _ from "lodash";
import clsx from "clsx";
import UnitsNeedPricingModal from "../components/UnitsNeedPricingModal";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { ROUTE_PROJECTS } from "../../helpers/endpoints";
import { REPORT_TYPES } from "../../GlobalConstants";

const useStyles = makeStyles((theme) => ({
  container: {
    borderRadius: 10,
    margin: "1%",
    padding: "2%",
    backgroundColor: theme.v2.backgrounds.whiteBackground,
  },
  customer: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.blackShade2,
    cursor: "pointer"
  },
  project: {
    fontSize: 16,
    color: theme.v2.fonts.colors.darkFont2,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
  },
  greenFont: {
    color: theme.v2.fonts.colors.greenShade2,
  },
  yellowFont: {
    color: theme.v2.fonts.colors.yellowShade1,
  },
  redFont: {
    color: theme.v2.fonts.colors.redShade1,
  },
  blueFont: {
    color: theme.v2.fonts.colors.blueShade1,
  },
  createdBy: {
    paddingLeft: "5%",
    fontSize: 14,
    color: theme.v2.fonts.colors.greyShade5,
  },
  emptyBar: {
    marginTop: "0%",
    borderRadius: 10,
    border: `1px solid ${theme.v2.borders.lightGrey1}`,
    backgroundColor: theme.v2.backgrounds.lightGreyBackground,
    height: 18,
    display: "flex",
    alignItems: "center",
  },
  filledBar: {
    maxWidth: "100%",
    borderRadius: 10,
    backgroundColor: theme.v2.backgrounds.greenBackgroundShade3,
  },
  issues: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.blackShade2,
    padding: "0% 2%",
  },
  view: {
    textDecoration: "underline",
    fontSize: 14,
    fontWeight: 500,
    color: theme.v2.fonts.colors.greenShade1,
    cursor: "pointer",
  },
  popupLabels: {
    fontSize: 16,
    color: theme.v2.fonts.colors.darkFont,
  },
  popupSection: {
    padding: "5%",
    border: `1px solid ${theme.v2.borders.lightGrey}`,
  },
  popupHeader: {
    padding: "4% 5%",
    backgroundColor: theme.v2.backgrounds.redBackground,
  },
  popupLabelHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.whiteFont,
  },
  jobsSection: {
    paddingBottom: "1%",
    borderRadius: 10,
    border: `1px solid ${theme.v2.borders.lightGrey}`,
  },
  jobsHeader: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: theme.v2.backgrounds.greenBackgroundShade3,
    padding: "2% 10%",
  },
  noOfJobs: {
    fontSize: 33,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.whiteFont,
  },
  totalJobs: {
    fontSize: 18,
    color: theme.v2.fonts.colors.whiteFont,
  },
  jobsCount: {
    fontSize: 18,
    color: theme.v2.fonts.colors.darkFont2,
    display: "flex",
    justifyContent: "center",
    paddingTop: "10%",
  },
  completionPerc: {
    fontSize: 18,
    color: theme.v2.fonts.colors.darkFont2,
  },
  emptyJobProgressBar: {
    borderRadius: 10,
    border: 0,
    height: 18,
  },
  emptyJobRedProgressBar: {
    backgroundColor: theme.v2.backgrounds.redBackgroundShade3,
  },
  emptyJobYellowProgressBar: {
    backgroundColor: theme.v2.backgrounds.yellowBackgroundShade4,
  },
  emptyJobGreenProgressBar: {
    backgroundColor: theme.v2.backgrounds.greenBackgroundShade8,
  },
  filledJobProgressBar: {
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    height: 18,
  },
  filledJobRedProgressBar: {
    backgroundColor: theme.v2.backgrounds.redBackground,
  },
  filledJobYellowProgressBar: {
    backgroundColor: theme.v2.backgrounds.yellowBackgroundShade3,
  },
  filledJobGreenProgressBar: {
    backgroundColor: theme.v2.backgrounds.greenBackgroundShade7,
  },
  filledCompletely: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  redTimer: {
    fill: theme.v2.backgrounds.redBackground,
  },
  yellowTimer: {
    fill: theme.v2.backgrounds.yellowBackgroundShade3,
  },
  greenTimer: {
    fill: theme.v2.backgrounds.greenBackgroundShade7,
  },
  timePrefix: {
    fontSize: 18,
    color: theme.v2.fonts.colors.darkFont2,
  },
  timeSuffix: {
    fontSize: 14,
    color: theme.v2.fonts.colors.greyShade5,
  },
  border: {
    marginTop: "5%",
    border: `1px solid ${theme.v2.borders.lightGrey3}`,
    width: "90%",
  },
  boldTooltipText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  defaultTooltipText: {
    fontSize: 12,
  },
  notificationNo: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 20,
    border: `2px solid ${theme.v2.fonts.colors.redShade1}`,
    top: "2%",
    left: "3%",
    fontSize: 12,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.redShade1,
    backgroundColor: theme.v2.backgrounds.whiteBackground,
  },
  notificationNoMain: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: 15,
    height: 15,
    borderRadius: 15,
    border: `2px solid ${theme.v2.fonts.colors.whiteFont}`,
    top: "2%",
    left: -5,
    fontSize: 12,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.whiteFont,
    backgroundColor: theme.v2.backgrounds.redBackground,
  },
}));

const CustomTooltip = withStyles((theme) => ({
  arrow: {
    color: theme.v2.backgrounds.greenBackgroundShade3,
  },
  tooltip: {
    backgroundColor: theme.v2.backgrounds.greenBackgroundShade3,
    color: theme.v2.fonts.colors.whiteFont,
    maxWidth: 150,
    fontSize: 16,
    fontWeight: "bold",
    border: 0,
    borderRadius: 10,
  },
}))(Tooltip);

const reloadWindow = () => {
  window.location.reload();
};

const DashboardProject = (props) => {
  const data = props.data || {};
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState();
  const [units, setUnits] = useState([]);
  const [openUnitsNeedPricingModal, setOpenUnitsNeedPricingModal] =
    useState(false);
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const token = useSelector((state) => state.auth.token);
  const getCipUnits = useCallback(async () => {
    try {
      const result = await axios.get(`/units/cipunits?p=project:${data.id}`, {
        headers: {
          Authorization: token,
        },
      });
      if (result.status === 200) {
        setUnits(
          _.get(result, ["data", "message"], []).map((row) => {
            return {
              id: _.get(row, "unit_id"),
              unit_name: _.get(row, ["unit", "unit_name"]),
            };
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  }, [data, token]);

  const goToProject = (projectId, scrollTo, state) => {
    if (scrollTo)
      state
        ? props.history.push(`${ROUTE_PROJECTS}/${projectId}#${scrollTo}`, {
          ...state,
        })
        : props.history.push(`${ROUTE_PROJECTS}/${projectId}#${scrollTo}`);
    else
      state
        ? props.history.push(`${ROUTE_PROJECTS}/${projectId}`, { ...state })
        : props.history.push(`${ROUTE_PROJECTS}/${projectId}`);
  };

  let percTotal = ((data.actual_value || 0) * 100) / (data.planned_value || 1);
  const unitsNeedPricing = parseInt(_.get(data, "cip_units") || 0) > 0;
  const failedSafetyReports = parseInt(_.get(data, "safety_audit") || 0) > 0;

  const failedInspectionReports =
    parseInt(_.get(data, "inspection_report") || 0) > 0;
  const actualValueGreaterThenPlanned = percTotal > 100;
  const showNotifications =
    unitsNeedPricing ||
    failedSafetyReports ||
    failedInspectionReports ||
    actualValueGreaterThenPlanned;


  const noOfNotifications =
    (unitsNeedPricing ? 1 : 0) +
    (failedSafetyReports ? 1 : 0) +
    (failedInspectionReports ? 1 : 0) +
    (actualValueGreaterThenPlanned ? 1 : 0);
  if (percTotal !== 0) percTotal = Math.round(parseFloat(percTotal).toFixed(2));
  let percTotal24 =
    ((data.actual_value_24 || 0) * 100) / (data.planned_value || 1);
  if (percTotal24 !== 0)
    percTotal24 = Math.round(parseFloat(percTotal24).toFixed(2));
  const totalJobs =
    parseInt(data.Cancelled || 0) +
    parseInt(data.Completed || 0) +
    parseInt(data["On Hold"] || 0) +
    parseInt(data.Overdue || 0) +
    parseInt(data.Ongoing || 0);
  const totalDays = moment(data.end_date).diff(data.start_date, "days");
  const startDate = moment(data.start_date).isAfter(moment())
    ? moment(data.start_date)
    : moment();
  const daysLeft = startDate.isAfter(moment(data.end_date))
    ? 0
    : moment(data.end_date).diff(startDate, "days");
  const denominator = totalDays === 0 ? 1 : totalDays;
  let timeBudgetPerc = (daysLeft * 100) / denominator;
  timeBudgetPerc = Math.ceil(timeBudgetPerc);
  let years = 0;
  let months = 0;
  let days = 0;
  let tData = {};
  if (data.end_date) {
    tData = calculateTimeBudgetObject(data.end_date, false, "all");
    years = _.get(tData, "years") || 0;
    months = _.get(tData, "months") || 0;
    days = _.get(tData, "days") || 0;
  }
  return (
    <>
      <UnitsNeedPricingModal
        open={openUnitsNeedPricingModal}
        units={units}
        onClose={setOpenUnitsNeedPricingModal.bind(this, false)}
        refresh={reloadWindow}
        projectId={data.id}
      />
      <Grid container className={classes.container} justify="space-between">
        <Grid item xs={7} container>
          <Grid item xs={12}>
            <span className={classes.customer} onClick={() => {
              goToProject(props.data.id)
            }}>
              {data.customer_name || ""}
            </span>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.project}>
              Project : {data.contract_no || ""}
            </Typography>
          </Grid>
          <Grid item xs={2} container justify="flex-end">
            <Typography
              className={clsx(
                classes.status,
                {
                  [classes.greenFont]: _.toLower(data.status) === "ongoing",
                },
                {
                  [classes.yellowFont]: _.toLower(data.status) === "on hold",
                },
                {
                  [classes.redFont]: _.toLower(data.status) === "overdue",
                },
                {
                  [classes.blueFont]: _.toLower(data.status) === "completed",
                }
              )}
            >
              {data.status || ""}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography className={classes.createdBy}>
              Created By: {data.first_name || ""}
            </Typography>
          </Grid>
          <CustomTooltip
            arrow
            title={
              <React.Fragment>
                <Grid
                  item
                  xs={12}
                  container
                  style={{ minWidth: 150, maxWidth: "100%" }}
                  alignItems="center"
                >
                  <Typography className={classes.boldTooltipText}>{`${percTotal || 0
                    }%`}</Typography>
                  <Typography className={classes.defaultTooltipText}>
                    &nbsp; {`(+${percTotal24 || 0}%)`}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  container
                  style={{ minWidth: 150, maxWidth: "100%" }}
                  alignItems="center"
                >
                  <Typography className={classes.boldTooltipText}>
                    $ {data.actual_value || 0}
                  </Typography>
                  <Typography className={classes.defaultTooltipText}>
                    &nbsp; (+${data.actual_value_24 || 0})
                  </Typography>
                </Grid>
              </React.Fragment>
            }
          >
            <Grid item xs={8} className={classes.emptyBar}>
              <Grid
                item
                className={classes.filledBar}
                style={{
                  width: `${percTotal}%`,
                  height: percTotal < 4 ? 10 : 17,
                }}
              />
            </Grid>
          </CustomTooltip>
          <Grid
            item
            xs={12}
            container
            style={{
              marginTop: "10%",
              display: "flex",
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              position: "relative",
              visibility: showNotifications ? "visible" : "hidden",
            }}
          >
            <Bell alt="Notifications" fill={"#1D1D1F"} />
            <Typography className={classes.notificationNoMain}>
              {noOfNotifications}
            </Typography>
            <Typography className={classes.issues}>Project Issues</Typography>
            {/* <ReadyToBill
              style={{ fill: readyToBill ? "#E36767" : "#4196CB" }}
            /> */}
            {unitsNeedPricing && <Tooltip title='Units need pricing'><UnitsNeedPricing style={{ fill: "#E36767" }} /></Tooltip>}
            {failedInspectionReports && <Tooltip title='Failed inspection reports'><FailedInspection style={{ fill: "#E36767" }} /></Tooltip>}
            {failedSafetyReports && <Tooltip title='Failed safety reports'><FailedSafetyReports
              style={{
                fill: "#E36767",
                stroke: "#E36767",
              }}
            /></Tooltip>}
            {actualValueGreaterThenPlanned && <Tooltip title='Actual value greater than planned'><ActualVsPlanned
              style={{
                fill: "#E36767",
              }}
            /></Tooltip>}
            <Grid
              style={{ paddingLeft: "2%", cursor: "pointer" }}
              onClick={handlePopoverOpen}
            >
              <Typography className={classes.view}>View</Typography>
            </Grid>
            <Popover
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              onClose={handlePopoverClose}
            >
              <Grid container style={{ width: 450 }}>
                <Grid
                  item
                  xs={12}
                  container
                  className={classes.popupHeader}
                  alignItems="center"
                >
                  <Grid item xs={1} container>
                    <Bell alt="Notifications" fill={"#ffffff"} />
                    <Typography className={classes.notificationNo}>
                      {noOfNotifications}
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography className={classes.popupLabelHeader}>
                      Project Issues
                    </Typography>
                  </Grid>
                  <Grid item xs={3} container justify="center">
                    <img
                      src={CrossSmall}
                      alt="Close"
                      style={{ cursor: "pointer" }}
                      onClick={handlePopoverClose}
                    />
                  </Grid>
                </Grid>
                {/* <Grid
                item
                xs={12}
                container
                className={classes.popupSection}
                alignItems="center"
              ></Grid> */}
                {/* {readyToBill && (
                  <Grid
                    item
                    xs={12}
                    container
                    className={classes.popupSection}
                    alignItems="center"
                  >
                    <Grid item xs={2} container>
                      <ReadyToBill fill="#E36767" />
                    </Grid>
                    <Grid item xs={7}>
                      <Typography className={classes.popupLabels}>
                        Ready To Bill
                      </Typography>
                    </Grid>
                    <Grid item xs={3} justify="center" container>
                      <Typography
                        className={classes.view}
                        onClick={goToProject.bind(
                          this,
                          _.get(data, "id"),
                          null,
                          null
                        )}
                      >
                        View
                      </Typography>
                    </Grid>
                  </Grid>
                )} */}
                {unitsNeedPricing && (
                  <Grid
                    item
                    xs={12}
                    container
                    className={classes.popupSection}
                    alignItems="center"
                  >
                    <Grid item xs={2}>
                      <UnitsNeedPricing fill="#E36767" />
                    </Grid>
                    <Grid item xs={7}>
                      <Typography className={classes.popupLabels}>
                        Units need pricing
                      </Typography>
                    </Grid>
                    <Grid item xs={3} justify="center" container>
                      <Typography
                        className={classes.view}
                        onClick={() => {
                          getCipUnits();
                          setOpenUnitsNeedPricingModal(true);
                        }}
                      >
                        View
                      </Typography>
                    </Grid>
                  </Grid>
                )}
                {actualValueGreaterThenPlanned && (
                  <Grid
                    item
                    xs={12}
                    container
                    className={classes.popupSection}
                    alignItems="center"
                  >
                    <Grid item xs={2}>
                      <ActualVsPlanned fill="#E36767" />
                    </Grid>
                    <Grid item xs={7}>
                      <Typography className={classes.popupLabels}>
                        {`Actual Value > Planned Value`}
                      </Typography>
                    </Grid>
                    <Grid item xs={3} justify="center" container>
                      <Typography
                        className={classes.view}
                        onClick={goToProject.bind(
                          this,
                          _.get(data, "id"),
                          null,
                          null
                        )}
                      >
                        View
                      </Typography>
                    </Grid>
                  </Grid>
                )}
                {failedInspectionReports && (
                  <Grid
                    item
                    xs={12}
                    container
                    className={classes.popupSection}
                    alignItems="center"
                  >
                    <Grid item xs={2}>
                      <FailedInspection fill="#E36767" />
                    </Grid>
                    <Grid item xs={7}>
                      <Typography className={classes.popupLabels}>
                        Failed Inspection
                      </Typography>
                    </Grid>
                    <Grid item xs={3} justify="center" container>
                      <Typography
                        className={classes.view}
                        onClick={goToProject.bind(
                          this,
                          _.get(data, "id"),
                          "reports",
                          { type: REPORT_TYPES[0] }
                        )}
                      >
                        View
                      </Typography>
                    </Grid>
                  </Grid>
                )}
                {failedSafetyReports && (
                  <Grid
                    item
                    xs={12}
                    container
                    className={classes.popupSection}
                    alignItems="center"
                  >
                    <Grid item xs={2}>
                      <FailedSafetyReports fill="#E36767" stroke="#E36767" />
                    </Grid>
                    <Grid item xs={7}>
                      <Typography className={classes.popupLabels}>
                        Failed Safety Reports
                      </Typography>
                    </Grid>
                    <Grid item xs={3} justify="center" container>
                      <Typography
                        className={classes.view}
                        onClick={goToProject.bind(
                          this,
                          _.get(data, "id"),
                          "reports",
                          { type: REPORT_TYPES[1] }
                        )}
                      >
                        View
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Popover>
          </Grid>
        </Grid>
        <Grid item xs={3} container className={classes.jobsSection}>
          <Grid item xs={12} container className={classes.jobsHeader}>
            <Grid item xs={2} container alignItems="flex-end">
              <Typography className={classes.noOfJobs}>{totalJobs}</Typography>
            </Grid>
            <Grid item xs={10} container alignItems="flex-end">
              <Typography className={classes.totalJobs}>
                &nbsp;&nbsp;Total Jobs
              </Typography>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            container
            justify="space-evenly"
            style={{ paddingTop: "5%" }}
          >
            <Grid item style={{ paddingTop: "1%" }}>
              <Tooltip title='Closed'>
                <img src={ClosedJob} alt="Closed" /></Tooltip>
              <Typography className={classes.jobsCount}>
                {data.Overdue || 0}
              </Typography>
            </Grid>
            <Grid item>
              <Tooltip title='Open'><img src={OpenJob} alt="Open" /></Tooltip>
              <Typography
                className={classes.jobsCount}
                style={{ paddingTop: 0 }}
              >
                {data.Ongoing || 0}
              </Typography>
            </Grid>
            <Grid item style={{ paddingTop: "1%" }}>
              <Tooltip title='On Hold'><img src={HoldJob} alt="On Hold" /></Tooltip>
              <Typography className={classes.jobsCount}>
                {data["On Hold"] || 0}
              </Typography>
            </Grid>
            <Grid item style={{ paddingTop: "1%" }}>
              <Tooltip title='Completed'><img src={CompletedJob} alt="Completed" /></Tooltip>
              <Typography className={classes.jobsCount}>
                {data.Completed || 0}
              </Typography>
            </Grid>
            <Grid item style={{ paddingTop: "1%" }}>
              <Tooltip title='Cancelled'><img src={CancelledJob} alt="Cancelled" /></Tooltip>
              <Typography className={classes.jobsCount}>
                {data.Cancelled || 0}
              </Typography>
            </Grid>
            <Grid container item xs={12}>
              <hr className={classes.border} />
            </Grid>
            <Grid
              item
              xs={12}
              container
              justify="space-evenly"
              style={{ paddingTop: "1%" }}
            >
              <Grid item xs={1} container justify="flex-start">
                <Tooltip title='Planned Time Left'><SandTimer
                  alt="timer"
                  className={clsx({
                    [classes.redTimer]: timeBudgetPerc <= 10,
                    [classes.yellowTimer]:
                      timeBudgetPerc < 25 && timeBudgetPerc > 10,
                    [classes.greenTimer]: timeBudgetPerc >= 25,
                  })}
                /></Tooltip>
                <Typography className={classes.completionPerc}>
                  {timeBudgetPerc}%
                </Typography>
              </Grid>
              <Grid
                item
                xs={9}
                container
                justify="flex-end"
                className={clsx(classes.emptyJobProgressBar, {
                  [classes.emptyJobRedProgressBar]: timeBudgetPerc <= 10,
                  [classes.emptyJobYellowProgressBar]:
                    timeBudgetPerc < 25 && timeBudgetPerc > 10,
                  [classes.emptyJobGreenProgressBar]: timeBudgetPerc >= 25,
                })}
              >
                <Grid
                  item
                  className={clsx(classes.filledJobProgressBar, {
                    [classes.filledCompletely]: timeBudgetPerc > 95,
                    [classes.filledJobRedProgressBar]: timeBudgetPerc <= 10,
                    [classes.filledJobYellowProgressBar]:
                      timeBudgetPerc < 25 && timeBudgetPerc > 10,
                    [classes.filledJobGreenProgressBar]: timeBudgetPerc >= 25,
                  })}
                  style={{
                    width: `${timeBudgetPerc || 0.1}%`,
                    backgroundColor: timeBudgetPerc === 0 ? "white" : "", // to prevent padding in case of 0% time remaining
                    justifyContent: "flex-end",
                  }}
                ></Grid>
                <Grid
                  item
                  xs={12}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                >
                  <Typography className={classes.timePrefix}>
                    {years}
                  </Typography>
                  <Typography className={classes.timeSuffix}>y</Typography>
                  <Typography className={classes.timePrefix}>
                    &nbsp;&nbsp;{months}
                  </Typography>
                  <Typography className={classes.timeSuffix}>m</Typography>
                  <Typography className={classes.timePrefix}>
                    &nbsp;&nbsp;{days}
                  </Typography>
                  <Typography className={classes.timeSuffix}>d</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardProject;
