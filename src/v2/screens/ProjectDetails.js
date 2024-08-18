import {
  Button,
  Grid,
  makeStyles,
  TextField,
  Typography,
  Tooltip,
  withStyles,
  Paper,
} from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import _ from "lodash";
import Search from "../../assets/v2/Search.svg";
import CollapsibleTableContainer from "../components/CollapsibleTableContainer";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios";
import { useHistory } from "react-router-dom";
import ActivityDetailsModal from "../components/ActivityDetailsModal";
import JobsModal from "../components/JobsModal";
import moment from "moment";
import { ADD_JOBS } from "../../store/actions/v2/jobs";
import { ADD_UNITS } from "../../store/actions/v2/units";
import UnitsNeedPricingModal from "../components/UnitsNeedPricingModal";
import clsx from "clsx";
import { calculateTimeBudgetObject } from "../../helpers/date";
import Graphs from "../components/Graphs";
import {
  getNormalizeIsolatedAndCumulativeGraphData,
  roundData,
} from "../../helpers/utils";
import EditUnit from "../components/EditUnit";
import SafetyAudit from "../components/Reports/SafetyAudit";
import { HIDE_LOADER, SHOW_LOADER } from "../../store/actions/v2/loader";
import InspectionReport from "../components/Reports/InspectionReport";
import { defaultGraphData } from "../../helpers/utils";
import Scroll from "react-scroll";
import { REPORT_TYPES } from "../../GlobalConstants";
import Projects from "./Projects";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.v2.backgrounds.lightBlueBackground,
    padding: "1%",
    minHeight: "100vh",
  },
  paper: {
    width: "100%",
    borderRadius: 10,
    padding: "2%",
    border: `1px solid ${theme.v2.borders.lightGrey}`,
    margin: "2%",
  },
  customerName: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.blackShade2,
  },
  projectName: {
    fontSize: 18,
    color: theme.v2.fonts.colors.darkFont,
  },
  status: {
    paddingLeft: "1%",
    fontSize: 16,
    fontWeight: "bold",
  },
  progressBarEmpty: {
    width: 350,
    height: 10,
    border: `1px solid ${theme.v2.borders.lightGrey1}`,
    borderRadius: "10px",
    backgroundColor: theme.v2.backgrounds.lightGreyBackground,
    display: "flex",
    alignItems: "center",
  },
  progressBarFilled: {
    maxWidth: "100%",
    zIndex: 100,
    borderRadius: "10px",
    backgroundColor: theme.v2.backgrounds.greenBackgroundShade3,
    cursor: "pointer",
  },
  search: {
    "& .MuiInput-root": {
      backgroundColor: theme.v2.backgrounds.whiteBackground,
      border: `1px solid ${theme.v2.borders.lightGrey}`,
      borderRadius: 10,
      color: theme.v2.fonts.colors.greyShade1,
      fontSize: 16,
      fontWeight: 600,
      padding: "0 5%",
    },
    paddingBottom: "2%",
  },
  label: {
    fontSize: 12,
    color: theme.v2.fonts.colors.darkFont,
  },
  primaryText: {
    fontSize: 30,
  },
  secondaryText: {
    fontSize: 18,
  },
  btn: {
    alignItems: "flex-end",
    border: 0,
    outline: "none",
  },
  btnGreen: {
    backgroundColor: theme.v2.backgrounds.greenBackgroundShade3,
  },
  btnRed: {
    backgroundColor: theme.v2.backgrounds.redBackground,
  },
  btnYellow: {
    backgroundColor: theme.v2.backgrounds.yellowBackgroundShade2,
  },
  btnBlue: {
    backgroundColor: theme.v2.backgrounds.blueBackgroundShade1,
  },
  btnGrey: {
    backgroundColor: theme.v2.backgrounds.lightGreyBackground,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 14,
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
  greyFont: {
    color: theme.v2.fonts.colors.greyShade6,
  },
  defaultTooltipText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  greenTooltipText: {
    color: theme.v2.fonts.colors.greenShade4,
  },
}));

const CustomTooltip = withStyles((theme) => ({
  arrow: {
    color: theme.v2.backgrounds.blueBackgroundShade3,
  },
  tooltip: {
    backgroundColor: theme.v2.backgrounds.blueBackgroundShade3,
    color: theme.v2.fonts.colors.whiteFont,
    maxWidth: 150,
    fontSize: 16,
    fontWeight: "bold",
    border: 0,
    borderRadius: 5,
  },
}))(Tooltip);

const reloadWindow = () => {
  window.location.reload();
};

const COLORS = ["Green", "Yellow", "Red"];

const getColorFromTimeAndUnit = (time, unit) => {
  if (time <= 19 && (unit === "Days" || unit === "Day")) return COLORS[2];
  else if (time <= 29 && (unit === "Days" || unit === "Day")) return COLORS[1];
  else return COLORS[0];
};

let formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const ProjectDetails = (props) => {
  const classes = useStyles();
  const [data, setData] = useState({});
  const [graphData, setGraphData] = useState([]);
  const pathnameSplit = props.location.pathname.split("/");
  const projectId = pathnameSplit[pathnameSplit.length - 1];
  let scrollTo;
  const scroller = Scroll.animateScroll;
  if (_.get(props, ["location", "hash"])) {
    scrollTo = props.location.hash.replace("#", "");
  }
  if (scrollTo === "reports") {
    scroller.scrollToBottom();
  } else scroller.scrollToTop();
  const token = useSelector((state) => state.auth.token);
  const groupId = useSelector((state) =>
    _.get(JSON.parse(_.get(state, ["auth", "profile"])), "group_id")
  );
  const history = useHistory();
  let progressPerc =
    (_.defaultTo(_.get(data, "actual_value"), 0) * 100) /
    _.defaultTo(_.get(data, "planned_value"), 1);
  progressPerc = roundData(progressPerc);
  let progressPerc24 =
    (_.defaultTo(_.get(data, "actual_value_24"), 0) * 100) /
    _.defaultTo(_.get(data, "planned_value"), 1);
  progressPerc24 = roundData(progressPerc24);

  const getProject = useCallback(async () => {
    try {
      const result = await axios.get(
        `/projects/${projectId}?p=project:${projectId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        setData(_.get(result, ["data", "message"]));
      } else {
        history.goBack();
      }
    } catch (err) {
      history.goBack();
    }
  }, [projectId, history, token]);

  useEffect(() => {
    getProject();
  }, [getProject]);

  const getRevenueForecast = useCallback(async () => {
    try {
      const result = await axios.get(
        `/projects/${projectId}/revenue?p=group:${groupId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        const tData = _.get(result, ["data", "message"]);
        setGraphData(getNormalizeIsolatedAndCumulativeGraphData(tData, "$"));
      }
    } catch (err) {}
  }, [groupId, token]);

  const getProjectProgress = async () => {
    try {
      const result = await axios.get(
        `/projects/${projectId}/progress?p=group:${groupId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        const tData = _.get(result, ["data", "message"]);
        setGraphData(
          getNormalizeIsolatedAndCumulativeGraphData(tData, null, "%")
        );
      }
    } catch (err) {}
  };

  const getUnitsPerWeek = async () => {
    try {
      const result = await axios.get(
        `/projects/${projectId}/unitsperweek?p=group:${groupId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        const tData = _.get(result, ["data", "message"]);
        const finalData = [];
        tData.forEach((data, index) => {
          if (index !== 0) {
            const currentWeek = moment(data.x, "WW-YYYY").week();
            let prevWeek = moment(
              finalData[finalData.length - 1].x,
              "WW-YYYY"
            ).week();
            while (currentWeek !== prevWeek + 1) {
              finalData.push({
                x: moment(finalData[finalData.length - 1].x, "W-MM-YYYY")
                  .add(1, "week")
                  .format("W-MM-YYYY"),
                y: 0,
              });
              prevWeek = moment(
                finalData[finalData.length - 1].x,
                "W-MM-YYYY"
              ).week();
            }
            finalData.push({
              x: moment(data.x, "WW-YYYY").format("W-MMM-YYYY"),
              y: data.y,
            });
          } else
            finalData.push({
              x: moment(data.x, "WW-YYYY").format("WW-YYYY"),
              y: data.y,
            });
        });
        while (finalData.length < 6) {
          finalData.push({
            x: moment(finalData[finalData.length - 1].x, "W-MMM-YYYY")
              .weekYear()
              .format("W-MMM-YYYY"),
            y: 0,
          });
        }
        // finalData.forEach((data) => {
        //   data.x = `${weekOfMonth(moment(data.x, "W-MMM-YYYY"))}${moment(
        //     data.x,
        //     "W-MMM-YYYY"
        //   ).format("-MMM-YYYY")}`;
        // });
        setGraphData(finalData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const changeGraph = (index) => {
    if (index === 0) {
      getRevenueForecast();
    }
    if (index === 1) {
      getProjectProgress();
    }
    if (index === 2) {
      getUnitsPerWeek();
    }
  };

  useEffect(() => {
    getRevenueForecast();
  }, [getRevenueForecast]);

  const timeBudgetValue = calculateTimeBudgetObject(data.pendDate, true).value;
  const timeBudgetUnits = calculateTimeBudgetObject(
    data.pendDate,
    true
  ).timeUnits;
  const color = getColorFromTimeAndUnit(timeBudgetValue, timeBudgetUnits);

  return (
    <Grid container className={classes.root}>
      <Grid
        item
        container
        xs={12}
        style={{ padding: "1% 0%" }}
        spacing={2}
        alignItems="center"
      >
        <Grid item xs={6}>
          <Typography className={classes.customerName}>
            {data.customer_name}
          </Typography>
          <Grid
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <Typography className={classes.projectName}>
              Project : {data.project_name}
            </Typography>
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
                },
                {
                  [classes.greyFont]: _.toLower(data.status) === "cancelled",
                }
              )}
            >
              {data.status}
            </Typography>
          </Grid>
          <CustomTooltip
            placement="bottom"
            title={
              <Grid container style={{ minWidth: 80 }} justify="space-around">
                <Grid item>
                  <Typography className={classes.defaultTooltipText}>
                    {`${progressPerc}%`}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography className={classes.greenTooltipText}>
                    {`(+${progressPerc24}%)`}
                  </Typography>
                </Grid>
              </Grid>
            }
            arrow
          >
            <div className={classes.progressBarEmpty}>
              <div
                className={classes.progressBarFilled}
                style={{
                  width: `${progressPerc}%`,
                  height: progressPerc < 2 ? "60%" : "100%",
                }}
              />
            </div>
          </CustomTooltip>
        </Grid>
        <Grid
          item
          xs={6}
          container
          spacing={1}
          alignItems="flex-end"
          justify="flex-end"
        >
          {/* <Grid item xs={7} container alignItems="flex-end">
            <TextField
              fullWidth={true}
              placeholder="Search"
              className={classes.search}
              InputProps={{
                endAdornment: <img src={Search} alt="Search" />,
              }}
            />
          </Grid> */}
          <Grid item xs={5} container spacing={1}>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                className={clsx(classes.btn, classes.btnGreen)}
              >
                <Typography className={classes.primaryText}>
                  {data.total_jobs || 0}
                </Typography>
                <Typography className={classes.secondaryText}>Jobs</Typography>
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                className={clsx(
                  classes.btn,
                  {
                    [classes.btnGreen]: color === COLORS[0],
                  },
                  {
                    [classes.btnYellow]: color === COLORS[1],
                  },
                  {
                    [classes.btnRed]: color === COLORS[2],
                  }
                )}
              >
                <Typography className={classes.primaryText}>
                  {timeBudgetValue}
                </Typography>
                <Typography className={classes.secondaryText}>
                  {timeBudgetUnits}
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Graphs
        header="Project Summary"
        data={graphData}
        onChange={changeGraph}
      />
      <Paper className={classes.paper}>
        <Projects projectId={projectId} />
      </Paper>
      <JobSummary projectId={projectId} {...data} />
      <UnitDetails projectId={projectId} />
      <ActivityDetails {...props} projectId={projectId} />
      <Reports
        projectId={projectId}
        type={_.get(props, ["location", "state", "type"])}
      />
    </Grid>
  );
};

const JobSummary = (props) => {
  const classes = useStyles();
  const projectId = props.projectId || "";
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortByIndex, setSortByIndex] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [openJobsModal, setOpenJobsModal] = useState(false);
  const [openJobsModalInEditMode, setOpenJobsModalInEditMode] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const dispatch = useDispatch();

  const filterData = (data) => {
    setFilters(data);
  };
  const JobTableSections = [
    { label: "All Jobs", onClick: filterData.bind(this, "all") },
    { label: "Ongoing Jobs", onClick: filterData.bind(this, "ongoing") },
    { label: "Recent Jobs", onClick: filterData.bind(this, "recent") },
    {
      label: "Jobs on Hold",
      onClick: filterData.bind(this, "hold"),
    },
    {
      label: "Cancelled Jobs",
      onClick: filterData.bind(this, "cancelled"),
    },
  ];
  const sortData = (field, index) => {
    if (sortByIndex === index) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortDirection("asc");
    }
    switch (field) {
      case "Job Number":
        setSortBy(`job`);
        setSortByIndex(index);
        break;
      case "Status":
        setSortBy(`status`);
        setSortByIndex(index);
        break;
      case "Progress":
        setSortBy(`progress`);
        setSortByIndex(index);
        break;
      case "Time Budget":
        setSortBy(`time_budget`);
        setSortByIndex(index);
        break;
      case "Planned Revenue":
        setSortBy(`planned_revenue`);
        setSortByIndex(index);
        break;
      case "Actual Revenue":
        setSortBy(`actual_revenue`);
        setSortByIndex(index);
        break;
      default:
        return "";
    }
  };
  const JobTableHeaders = [
    { label: "Job Number", onClick: sortData.bind(this, "Job Number", 0) },
    { label: "Status", onClick: sortData.bind(this, "Status", 1) },
    { label: "Progress", onClick: sortData.bind(this, "Progress", 2) },
    { label: "Time Budget", onClick: sortData.bind(this, "Time Budget", 3) },
    {
      label: "Planned Revenue",
      onClick: sortData.bind(this, "Planned Revenue", 4),
    },
    {
      label: "Actual Revenue",
      onClick: sortData.bind(this, "Actual Revenue", 5),
    },
  ];
  const token = useSelector((state) => state.auth.token);
  const getJobs = useCallback(async () => {
    try {
      const result = await axios.get(
        `/jobs?p=project:${projectId}&f=${filters}&s=${sortBy}:${sortDirection}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        setData(_.get(result, ["data", "message"]));
        dispatch({ type: ADD_JOBS, data: _.get(result, ["data", "message"]) });
      }
    } catch (err) {}
  }, [token, projectId, filters, sortBy, sortDirection, dispatch]);

  useEffect(() => {
    getJobs();
  }, [getJobs]);

  const editJob = (index) => {
    setSelectedData(_.get(data, index));
    setOpenJobsModalInEditMode(true);
  };

  return (
    <>
      <JobsModal
        open={openJobsModal || openJobsModalInEditMode}
        onClose={() => {
          setOpenJobsModal(false);
          setOpenJobsModalInEditMode(false);
        }}
        success={reloadWindow}
        edit={openJobsModalInEditMode}
        customer={props.customer_name}
        contractNo={props.contract_no}
        projectId={props.projectId}
        editData={selectedData}
      />
      <CollapsibleTableContainer
        header="Jobs Summary"
        table={{
          sections: JobTableSections,
          headers: JobTableHeaders,
          data: data.map((row) => {
            const perChange = roundData(
              (_.defaultTo(row.actual_value, 0) * 100) /
                _.defaultTo(row.planned_value, 1)
            );
            const perChange24 = roundData(
              (_.defaultTo(row.actual_value24, 0) * 100) /
                _.defaultTo(row.planned_value, 1)
            );
            const timeBudget = calculateTimeBudgetObject(row.end_date, true);
            const tClasses = clsx(
              classes.boldText,
              {
                [classes.greenFont]: _.toLower(row.status) === "ongoing",
              },
              {
                [classes.yellowFont]: _.toLower(row.status) === "on hold",
              },
              {
                [classes.redFont]: _.toLower(row.status) === "overdue",
              },
              {
                [classes.blueFont]: _.toLower(row.status) === "completed",
              }
            );
            return [
              {
                type: "default",
                value: row.job_name,
              },
              {
                type: "default",
                value: row.status,
                classes: tClasses,
              },
              {
                type: "projectProgress",
                value: perChange,
                field1: perChange24,
              },
              {
                type: "default",
                value: `${timeBudget.str}`,
                classes: tClasses,
              },
              {
                type: "default",
                value: `${formatter.format(
                  _.defaultTo(row.planned_value, 0).toFixed(2)
                )}`,
              },
              {
                type: "default",
                value: `${formatter.format(
                  _.defaultTo(row.actual_value, 0).toFixed(2)
                )}`,
              },
            ];
          }),
          sortDirection: sortDirection,
          sortBy: sortByIndex,
          edit: editJob,
        }}
        button={{
          header: "+ New Job",
          onClick: setOpenJobsModal.bind(this, true),
        }}
      />
    </>
  );
};

const useStylesUnits = makeStyles((theme) => ({
  redBtn: {
    backgroundColor: theme.v2.backgrounds.redBackground,
    width: 200,
    "&:hover": {
      backgroundColor: theme.v2.backgrounds.redBackground2,
    },
  },
  greyBtn: {
    backgroundColor: theme.v2.backgrounds.lightGreyBackground,
    width: 200,
    "&:hover": {
      backgroundColor: theme.v2.backgrounds.lightGreyBackground,
    },
  },
}));

const UnitDetails = (props) => {
  const classes = useStylesUnits();
  const projectId = props.projectId || "";
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [filters, setFilters] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortByIndex, setSortByIndex] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [queryFilters, setQueryFilters] = useState();
  const [openUnitsNeedPricing, setOpenUnitsNeedPricing] = useState(false);
  const [openEditUnit, setOpenEditUnit] = useState(false);
  const [editUnitData, setEditUnitData] = useState({});
  const units = useSelector((state) => state.units);
  const jobsData = useSelector((state) => state.jobs);
  const [cipUnits, setCipUnits] = useState([]);
  const [tableRowClasses, setTableRowClasses] = useState([]);

  const filterData = (filterBy, filterData) => {
    setFilters((filters) => {
      return { ...filters, [filterBy]: filterData || "" };
    });
  };
  const TableSections = [
    { label: "All Units", onClick: filterData.bind(this, "all") },
  ];
  const sortData = (field, index) => {
    if (sortByIndex === index) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortDirection("asc");
    }
    switch (field) {
      case "Units":
        setSortBy(`unit_name`);
        setSortByIndex(index);
        break;
      case "Unit Price":
        setSortBy(`unit_price`);
        setSortByIndex(index);
        break;
      case "PLN QTY":
        setSortBy(`planned_qty`);
        setSortByIndex(index);
        break;
      case "ACT QTY":
        setSortBy(`actual_qty`);
        setSortByIndex(index);
        break;
      case "PLN Value":
        setSortBy(`planned_value`);
        setSortByIndex(index);
        break;
      case "ACT Value":
        setSortBy(`actual_value`);
        setSortByIndex(index);
        break;
      default:
        return "";
    }
  };
  const TableHeaders = [
    { label: "Units", onClick: sortData.bind(this, "Units", 0) },
    { label: "Unit Price", onClick: sortData.bind(this, "Unit Price", 1) },
    { label: "PLN QTY", onClick: sortData.bind(this, "PLN QTY", 2) },
    { label: "ACT QTY", onClick: sortData.bind(this, "ACT QTY", 3) },
    {
      label: "PLN Value",
      onClick: sortData.bind(this, "PLN Value", 4),
    },
    {
      label: "Actual Value",
      onClick: sortData.bind(this, "ACT Value", 5),
    },
  ];
  const token = useSelector((state) => state.auth.token);
  const getUnits = useCallback(async () => {
    try {
      let filterString = ``;
      _.keys(filters).forEach((key) => {
        filterString += `${key}:${filters[key]}|`;
      });
      const result = await axios.get(
        `/units?p=project:${projectId}&f=${filterString}&s=${sortBy}:${sortDirection}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      let tCipUnits = [];
      let tableClasses = [];
      if (result.status === 200) {
        setOriginalData(_.get(result, ["data", "message"], []));
        setData(
          _.get(result, ["data", "message"], []).map((record) => {
            if (record.is_cip_unit) {
              tCipUnits.push(record);
              tableClasses.push("unresolvedCipUnit");
            } else if (record.is_initially_cip_unit)
              tableClasses.push("resolvedCipUnit");
            else tableClasses.push(null);
            return [
              {
                value: _.get(record, "unit_name"),
                type: "default",
              },
              {
                value: `${formatter.format(
                  _.get(record, "unit_price", 0).toFixed(2)
                )}`,
                type: "default",
              },
              {
                value: roundData(_.get(record, "planned_qty", 0)),
                type: "default",
              },
              {
                value: roundData(_.get(record, "actual_qty", 0)),
                type: "default",
              },
              {
                value: `${formatter.format(
                  (
                    _.get(record, "planned_qty", 0) *
                    _.get(record, "unit_price", 0)
                  ).toFixed(2)
                )}`,
                type: "default",
              },
              {
                value: `${formatter.format(
                  (
                    _.get(record, "actual_qty", 0) *
                    _.get(record, "unit_price", 0)
                  ).toFixed(2)
                )}`,
                type: "default",
              },
            ];
          })
        );
        setCipUnits(tCipUnits);
        setTableRowClasses(tableClasses);
      }
    } catch (err) {}
  }, [token, projectId, filters, sortBy, sortDirection]);
  useEffect(() => {
    getUnits();
  }, [getUnits]);
  useEffect(() => {
    setQueryFilters([
      {
        label: "Unit",
        values: [
          {
            value: "",
            name: "All",
          },
          ...units.map((unit) => {
            return {
              value: unit.unit_id,
              name: _.get(unit, ["unit", "unit_name"]),
            };
          }),
        ],
        onChange: (e) => {
          filterData("unit", e.target.value);
        },
      },
      {
        label: "Job",
        values: [
          {
            value: "",
            name: "All",
          },
          ...jobsData.map((job) => {
            return {
              value: job.id,
              name: job.job_name,
            };
          }),
        ],
        onChange: (e) => {
          filterData("job", e.target.value);
        },
      },
    ]);
  }, [jobsData, units]);

  const editUnit = (index) => {
    const unit = _.get(originalData, index);
    setEditUnitData({
      projectId,
      unit_name: unit.unit_name,
      id: unit.id,
      price: unit.unit_price,
    });
    setOpenEditUnit(true);
  };

  return (
    <>
      <EditUnit
        open={openEditUnit}
        onClose={setOpenEditUnit.bind(this, false)}
        unit={editUnitData}
        refresh={reloadWindow}
      />
      <UnitsNeedPricingModal
        open={openUnitsNeedPricing}
        onClose={setOpenUnitsNeedPricing.bind(this, false)}
        units={cipUnits}
        projectId={projectId}
        refresh={reloadWindow}
      />
      <CollapsibleTableContainer
        header="Unit Details"
        table={{
          rowClasses: tableRowClasses,
          sections: TableSections,
          headers: TableHeaders,
          data: data,
          sortDirection: sortDirection,
          sortBy: sortByIndex,
          edit: editUnit,
        }}
        button={
          cipUnits.length > 0 && {
            header: "Unit Needs Pricing",
            onClick: setOpenUnitsNeedPricing.bind(this, true),
            classes: classes.redBtn,
          }
        }
        filters={queryFilters}
      />
    </>
  );
};

const ActivityDetails = (props) => {
  const projectId = props.projectId || "";
  const groupId = useSelector((state) =>
    _.get(JSON.parse(_.get(state, ["auth", "profile"])), "group_id")
  );
  const [data, setData] = useState([]);
  const [units, setUnits] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("");
  const [sortByIndex, setSortByIndex] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [openActivityModal, setOpenActivityModal] = useState(false);
  const jobsData = useSelector((state) => state.jobs);
  const [queryFilters, setQueryFilters] = useState();
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const filterData = (filterBy, filterData) => {
    setFilters((filters) => {
      return { ...filters, [filterBy]: filterData || "" };
    });
  };
  const removeFilter = (filterBy) => {
    delete filters[filterBy];
    setFilters({ ...filters });
  };
  const TableSections = [
    {
      label: "All Activities",
      onClick: removeFilter.bind(this, "recent", ""),
    },
    {
      label: "Recent Activities",
      onClick: filterData.bind(
        this,
        "recent",
        moment().subtract(15, "d").format("YYYY-MM-DD")
      ),
    },
  ];
  const sortData = (field, index) => {
    if (sortByIndex === index) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortDirection("asc");
    }
    switch (field) {
      case "User":
        setSortBy(`user`);
        setSortByIndex(index);
        break;
      case "Sheet":
        setSortBy(`sheet`);
        setSortByIndex(index);
        break;
      case "Ld":
        setSortBy(`ld`);
        setSortByIndex(index);
        break;
      case "Unit":
        setSortBy(`unit`);
        setSortByIndex(index);
        break;
      case "Qty":
        setSortBy(`qty`);
        setSortByIndex(index);
        break;
      case "Date":
        setSortBy(`date`);
        setSortByIndex(index);
        break;
      default:
        return "";
    }
  };
  const TableHeaders = [
    { label: "User", onClick: sortData.bind(this, "User", 0) },
    { label: "Sheet", onClick: sortData.bind(this, "Sheet", 1) },
    { label: "AP", onClick: sortData.bind(this, "Ld", 2) },
    { label: "Unit", onClick: sortData.bind(this, "Unit", 3) },
    {
      label: "Qty",
      onClick: sortData.bind(this, "Qty", 4),
    },
    {
      label: "Date",
      onClick: sortData.bind(this, "Date", 5),
    },
  ];
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const getUnits = useCallback(async () => {
    try {
      const result = await axios.get(
        `/groups/${groupId}/units?p=group:${groupId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        setUnits(_.get(result, ["data", "message"]));

        dispatch({ type: ADD_UNITS, data: _.get(result, ["data", "message"]) });
      }
    } catch (err) {
      console.log(err);
    }
  }, [groupId, token, dispatch]);

  const getData = useCallback(async () => {
    try {
      let filterString = ``;
      _.keys(filters).forEach((key) => {
        filterString += `${key}:${filters[key]}|`;
      });
      const result = await axios.get(
        `/actuals?p=project:${projectId}&f=${`${filterString}`}&s=${sortBy}:${sortDirection}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        setData(_.get(result, ["data", "message"]));
      }
    } catch (err) {
      console.log(err);
    }
  }, [token, projectId, filters, sortBy, sortDirection]);

  useEffect(() => {
    getData();
  }, [getData]);
  useEffect(() => {
    getUnits();
  }, [getUnits]);
  useEffect(() => {
    setQueryFilters([
      {
        label: "Unit",
        values: [
          {
            value: "",
            name: "All",
          },
          ...units.map((unit) => {
            return {
              value: unit.unit_id,
              name: _.get(unit, ["unit", "unit_name"]),
            };
          }),
        ],
        onChange: (e) => {
          filterData("unit", e.target.value);
        },
      },
      {
        label: "Job",
        values: [
          {
            value: "",
            name: "All",
          },
          ...jobsData.map((job) => {
            return {
              value: job.id,
              name: job.job_name,
            };
          }),
        ],
        onChange: (e) => {
          filterData("job", e.target.value);
        },
      },
    ]);
  }, [jobsData, units]);
  const editActivityDetails = (index) => {
    setEditData(_.get(data, index));
    setEditMode(true);
    setOpenActivityModal(true);
  };

  return (
    <>
      <ActivityDetailsModal
        open={openActivityModal}
        onClose={setOpenActivityModal.bind(this, false)}
        {...props}
        refresh={reloadWindow}
        edit={editMode}
        data={editData}
      />
      <CollapsibleTableContainer
        header="Activity Details"
        table={{
          sections: TableSections,
          headers: TableHeaders,
          data: data.map((row) => {
            return [
              {
                type: "default",
                value: `${_.defaultTo(
                  _.get(row, "first_name"),
                  ""
                )} ${_.defaultTo(_.get(row, "last_name"), "")}`,
              },
              {
                type: "default",
                value: _.get(row, "sheet_no"),
              },
              {
                type: "default",
                value: _.get(row, "ld_no"),
              },
              {
                type: "default",
                value: _.get(row, "unit_name"),
              },
              {
                type: "default",
                value: _.get(row, "qty"),
              },
              {
                type: "default",
                value: moment(row.updatedAt).format("MM/DD/YYYY"),
              },
            ];
          }),
          sortDirection: sortDirection,
          sortBy: sortByIndex,
          onClickRow: (index) => {
            setOpenActivityModal(true);
            setEditMode(true);
            setEditData(data[index]);
          },
          edit: editActivityDetails,
        }}
        button={{
          header: "+ New Unit",
          onClick: () => {
            setEditMode(false);
            setEditData();
            setOpenActivityModal(true);
          },
        }}
        filters={queryFilters}
      />
    </>
  );
};

const Reports = (props) => {
  const projectId = props.projectId;
  const [data, setData] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [sortByIndex, setSortByIndex] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [downloadSafetyData, setDownloadSafetyData] = useState();
  const [downloadInspectionData, setDownloadInspectionData] = useState();
  const [reportType, setReportType] = useState(
    _.get(props, ["type"]) || REPORT_TYPES[0]
  );
  const [failedReport, setFailedReport] = useState(
    _.get(props, ["type"]) ? true : false
  );
  let selectedHeader = 0;
  if (_.get(props, ["type"]) && _.get(props, ["type"]) === REPORT_TYPES[0]) {
    selectedHeader = 1;
  }
  if (_.get(props, ["type"]) && _.get(props, ["type"]) === REPORT_TYPES[1]) {
    selectedHeader = 3;
  }
  const token = useSelector((state) => state.auth.token);
  const fetchData = useCallback(async () => {
    try {
      const url =
        reportType === REPORT_TYPES[0]
          ? `/reports/inspectionreport?p=project:${projectId}&f=${`failed:${failedReport}`}&s=${sortBy}:${sortDirection}`
          : `/reports/safetyaudit?p=project:${projectId}&filters=${`failed:${failedReport}`}&s=${sortBy}:${sortDirection}`;

      console.log("ürl", url);
      const result = await axios.get(url, {
        headers: {
          Authorization: token,
        },
      });
      if (result.status === 200) {
        console.log(data.message);
        setData(_.get(result, ["data", "message"]));
      }
    } catch (err) {}
  }, [token, projectId, failedReport, sortBy, sortDirection, reportType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setFilters = (reportType, isFailed) => {
    setReportType(reportType);
    setFailedReport(isFailed);
  };

  const TableSections = [
    {
      label: "Inspection Reports",
      onClick: setFilters.bind(this, REPORT_TYPES[0], false),
    },
    {
      label: "Failed Inspection Reports",
      onClick: setFilters.bind(this, REPORT_TYPES[0], true),
    },
    {
      label: "Safety Reports",
      onClick: setFilters.bind(this, REPORT_TYPES[1], false),
    },
    {
      label: "Failed Safety Reports",
      onClick: setFilters.bind(this, REPORT_TYPES[1], true),
    },
  ];
  const sortData = (field, index) => {
    if (sortByIndex === index) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortDirection("asc");
    }
    switch (field) {
      case "inspector":
        setSortBy(`inspector`);
        setSortByIndex(index);
        break;
      case "job":
        setSortBy(`job`);
        setSortByIndex(index);
        break;
      case "sheet":
        setSortBy(`sheet`);
        setSortByIndex(index);
        break;
      case "contractor":
        setSortBy(`contractor`);
        setSortByIndex(index);
        break;
      case "location":
        setSortBy(`location`);
        setSortByIndex(index);
        break;
      case "date":
        setSortBy(`date`);
        setSortByIndex(index);
        break;
      default:
        return "";
    }
  };
  const TableHeaders = [
    { label: "Inspector", onClick: sortData.bind(this, "inspector", 0) },
    { label: "Job", onClick: sortData.bind(this, "job", 1) },
    {
      label: reportType === REPORT_TYPES[0] ? "Sheet" : "Contractor",
      onClick:
        reportType === REPORT_TYPES[0]
          ? sortData.bind(this, "sheet", 2)
          : sortData.bind(this, "contractor", 2),
    },
    {
      label: "Work Location",
      onClick: sortData.bind(this, "location", 3),
    },
    { label: "Date", onClick: sortData.bind(this, "date", 4) },
    {
      label: "Download",
      active: false,
    },
  ];
  const dispatch = useDispatch();
  const downloadReport = async (index) => {
    dispatch({ type: SHOW_LOADER, data: 1 });

    if (reportType === REPORT_TYPES[0]) {
      try {
        const dataL = data[index];
        const result = await axios.get(
          `reports/adminreportdata?p=project:${_.get(dataL, [
            "project_id",
          ])}&job=${_.get(dataL, "job_id")}&sheet=${_.get(
            dataL,
            "sheet_no"
          )}&ld=${_.get(dataL, "ld_no")}&unit=${_.get(dataL, "unit_id")}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (result.status === 200) {
          setDownloadInspectionData(_.get(result, ["data", "message"]));
        }
      } catch (err) {}
    } else {
      setDownloadSafetyData(data[index]);
    }
  };
  const onCloseSafety = () => {
    dispatch({ type: HIDE_LOADER, data: 1 });
    setDownloadSafetyData();
  };

  const onCloseInspection = () => {
    dispatch({ type: HIDE_LOADER, data: 1 });
    setDownloadInspectionData();
  };

  return (
    <>
      {downloadSafetyData && (
        <SafetyAudit {...downloadSafetyData} onClose={onCloseSafety} />
      )}
      {downloadInspectionData && (
        <InspectionReport
          {...downloadInspectionData}
          onClose={onCloseInspection}
        />
      )}
      <CollapsibleTableContainer
        header="Reports"
        table={{
          selectedHeader,
          sections: TableSections,
          headers: TableHeaders,
          data: data.map((row, index) => {
            return [
              {
                type: "default",
                value:
                  reportType === REPORT_TYPES[0]
                    ? _.defaultTo(
                        `${_.get(row, ["first_name"]) || ""} ${
                          _.get(row, ["last_name"]) || ""
                        }`,
                        ""
                      )
                    : `${_.get(row, ["user", "first_name"]) || ""} ${
                        _.get(row, ["user", "last_name"]) || ""
                      }`,
              },
              {
                type: "default",
                value:
                  reportType === REPORT_TYPES[0]
                    ? _.defaultTo(_.get(row, ["job_name"]), "")
                    : _.get(row, ["job", "job_name"]),
              },
              {
                type: "default",
                value:
                  reportType === REPORT_TYPES[0]
                    ? _.defaultTo(_.get(row, ["sheet_no"]), "")
                    : _.defaultTo(_.get(row, ["contractor"]), ""),
              },
              {
                type: "default",
                value:
                  reportType === REPORT_TYPES[0]
                    ? _.defaultTo(_.get(row, ["ld_no"]), "")
                    : _.defaultTo(_.get(row, ["work_location"]), ""),
              },
              {
                type: "default",
                value: moment(
                  _.get(row, ["updatedat"]) || _.get(row, ["updatedAt"])
                ).format("MM/DD/YYYY"),
              },
              {
                type: "download",
                color: "#696969",
                onClick: downloadReport.bind(this, index),
              },
            ];
          }),
          sortDirection: sortDirection,
          sortBy: sortByIndex,
        }}
      />
    </>
  );
};

export default ProjectDetails;
