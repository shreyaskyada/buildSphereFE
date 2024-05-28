import {
  Grid,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import DashboardProject from "../components/DashboardProject";
import _ from "lodash";
import clsx from "clsx";
import ArrowDown from "../../assets/v2/ArrowDown.svg";
import CollapsibleTableContainer from "../components/CollapsibleTableContainer";
import axios from "../../axios";
import { useSelector } from "react-redux";
import Skull from "../../assets/v2/Skull.svg";
import moment from "moment";
import Graphs from "../components/Graphs";
import { getNormalizeIsolatedAndCumulativeGraphData } from "../../helpers/utils";
import CostGraph from "../components/CostGraph";
import RevenueGraph from "../components/RevenueGraph";
import TimeGraph from "../components/TimeGraph";
import PerformersTable from "../components/PerformersTable";

const useStyles = makeStyles((theme) => ({
  mainRoot: {
    padding: "2%",
    backgroundColor: "#F1F8F5",
  },
  mainHeader: {
    fontSize: 30,
    fontWeight: "bold",
  },
  welcomeTxt: {
    paddingLeft: "3%",
    paddingBottom: "1%",
    fontSize: 35,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.blackShade1,
  },
  paper: {
    width: "100%",
    borderRadius: 10,
    padding: "2%",
    border: `1px solid ${theme.v2.borders.lightGrey}`,
    margin: "2%",
  },
  headers: {
    fontSize: 30,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.blackShade1,
  },
  root: {
    margin: "1%",
    marginTop: "5%",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
  },
  header: {
    marginRight: "0.5%",
    padding: "1.5% 3% 1% 3%",
    fontSize: 16,
    color: theme.v2.fonts.colors.darkFont,
    border: `1px solid ${theme.v2.borders.lightGrey}`,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
  },
  headerSelected: {
    backgroundColor: theme.v2.backgrounds.lightGreyBackground,
    color: theme.v2.fonts.colors.blackShade2,
    fontWeight: "bold",
  },
  tableContainer: {
    backgroundColor: theme.v2.backgrounds.lightGreyBackground,
    padding: "1%",
    marginTop: -2,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    border: `1px solid ${theme.v2.borders.lightGrey}`,
    width: "97%",
  },
  sortBy: {
    fontSize: 14,
    color: theme.v2.fonts.colors.standard,
  },
  sortBySelect: {
    maxHeight: 40,
    fontSize: 14,
    color: theme.v2.fonts.colors.blackShade1,
    width: 170,
    padding: "2%",
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
  chooseCustSelect: {
    marginLeft: "2%",
    maxHeight: 40,
    fontSize: 14,
    color: theme.v2.fonts.colors.blackShade1,
    width: 220,
    padding: "2%",
    backgroundColor: theme.v2.backgrounds.whiteBackground,
    border: `1px solid ${theme.v2.borders.lightGrey}`,
    "& .MuiSelect-select": {
      backgroundColor: theme.v2.backgrounds.whiteBackground,
      "&:focus": {
        backgroundColor: theme.v2.backgrounds.whiteBackground,
      },
    },
  },
  menulabels: {
    backgroundColor: theme.v2.backgrounds.whiteBackground,
    fontSize: 14,
    color: theme.v2.fonts.colors.blackShade1,
  },
  admin: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.greenShade2,
    width: "60%",
  },
  field: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.blueShade1,
    width: "60%",
  },
  inspector: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.redShade2,
    width: "60%",
  },
  default: {
    fontSize: 16,
    color: theme.v2.fonts.colors.darkFont,
  },
}));

const Dashboard = (props) => {
  const classes = useStyles();
  const [selectedHeader, setSelectedHeader] = useState(0);
  const [data, setData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState();
  const [sortDirection, setSortDirection] = useState("asc");
  const [graphData, setGraphData] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) =>
    JSON.parse(_.get(state, ["auth", "profile"]))
  );
  const groupId = useSelector((state) =>
    _.get(JSON.parse(_.get(state, ["auth", "profile"])), "group_id")
  );
  const getProjectsData = useCallback(async () => {
    try {
      const url = `/groups/${groupId}/projects?p=group:${groupId}&filters=project:${
        filters.project || ""
      }|customer:${filters.customer || ""}&sort_by=${
        sortBy || ""
      }&sort_direction=${sortDirection}`;
      const result = await axios.get(url, {
        headers: {
          Authorization: token,
        },
      });
      console.log(url);
      if (result.status === 200) {
        console.log(result.data.message);
        setData(_.get(result, ["data", "message"]) || []);
      }
    } catch (err) {
      console.log(err);
    }
  }, [groupId, token, filters, sortBy, sortDirection]);

  const getCustomers = useCallback(async () => {
    try {
      const result = await axios.get(
        `/groups/${groupId}/customers?p=group:${groupId}&sortBy`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        setCustomers(_.get(result, ["data", "message"]) || []);
      }
    } catch (err) {}
  }, [groupId, token]);

  const getRevenueForecast = useCallback(async () => {
    try {
      const result = await axios.get(
        `/groups/${groupId}/revenue?p=group:${groupId}`,
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
    } catch (err) {
      console.log(err);
    }
  }, [groupId, token]);

  const getProjectProgress = async () => {
    try {
      const result = await axios.get(
        `/groups/${groupId}/progress?p=group:${groupId}`,
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

  const weekOfMonth = (m) => {
    return m.week() - moment(m).startOf("month").week() + 1;
  };

  const getUnitsPerWeek = async () => {
    try {
      const result = await axios.get(
        `/groups/${groupId}/unitsperweek?p=group:${groupId}`,
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
              "W-MMM-YYYY"
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
              x: moment(data.x, "WW-YYYY").format("W-MMM-YYYY"),
              y: data.y,
            });
        });
        while (finalData.length < 6) {
          finalData.push({
            x: moment(finalData[finalData.length - 1].x, "W-MMM-YYYY")
              .add(1, "week")
              .format("W-MMM-YYYY"),
            y: 0,
          });
        }
        finalData.forEach((data) => {
          data.x = `${weekOfMonth(moment(data.x, "W-MMM-YYYY"))}${moment(
            data.x,
            "W-MMM-YYYY"
          ).format("-MMM-YYYY")}`;
        });
        setGraphData(finalData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRevenueForecast();
  }, [getRevenueForecast]);

  useEffect(() => {
    getProjectsData();
  }, [getProjectsData]);

  useEffect(() => {
    getCustomers();
  }, [getCustomers]);

  const makeFilters = (data, value) => {
    switch (data) {
      case "Open Projects":
        setFilters((filter) => {
          return { ...filter, project: "Open" };
        });
        break;
      case "Recent Projects":
        setFilters((filter) => {
          return { ...filter, project: "Recent" };
        });
        break;
      case "Completed Projects":
        setFilters((filter) => {
          return { ...filter, project: "Completed" };
        });
        break;
      case "Cancelled Projects":
        setFilters((filter) => {
          return { ...filter, project: "Cancelled" };
        });
        break;
      case "Customer":
        setFilters((filter) => {
          return { ...filter, customer: value };
        });
        break;
      default:
        setFilters((filter) => {
          return { ...filter, project: "All" };
        });
    }
  };
  const setSorting = (value) => {
    setSortDirection(value.includes("desc") ? "desc" : "asc");
    switch (value) {
      case "actual_value_desc":
        setSortBy("actual_value");
        break;
      case "actual_value_asc":
        setSortBy("actual_value");
        break;
      case "end_date_desc":
        setSortBy("end_date");
        break;
      case "end_date_asc":
        setSortBy("end_date");
        break;
      case "actual_value_24_desc":
        setSortBy("actual_value_24");
        break;
      case "actual_value_24_asc":
        setSortBy("actual_value_24");
        break;
      default:
        setSortBy("");
    }
  };
  const headers = [
    { label: "All Projects", onClick: makeFilters.bind(this, "All Projects") },
    {
      label: "Open Projects",
      onClick: makeFilters.bind(this, "Open Projects"),
    },
    {
      label: "Recent Projects",
      onClick: makeFilters.bind(this, "Recent Projects"),
    },
    {
      label: "Completed Projects",
      onClick: makeFilters.bind(this, "Completed Projects"),
    },
    {
      label: "Cancelled Projects",
      onClick: makeFilters.bind(this, "Cancelled Projects"),
    },
  ];
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
  return (
    <Grid container className={classes.mainRoot}>
      <Grid item xs={12}>
        <Typography className={classes.welcomeTxt}>
          Welcome, {_.get(profile, "first_name") || ""}
        </Typography>
      </Grid>
      <CostGraph />
      <RevenueGraph />
      <TimeGraph />
      <PerformersTable />
      <Graphs header="Summary" data={graphData} onChange={changeGraph} />
      <Paper className={classes.paper} elevation={0}>
        <Grid container>
          <Grid item xs={6}>
            <Typography className={classes.mainHeader}>
              Project Summary
            </Typography>
          </Grid>
          <Grid item xs={6} container justify="flex-end">
            <Select
              variant="standard"
              className={classes.sortBySelect}
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
              inputProps={{
                placeholder: "Sort By",
              }}
              onChange={(e) => {
                setSorting(e.target.value);
              }}
              defaultValue={"0"}
            >
              <MenuItem key={-1} value={"0"} className={classes.menulabels}>
                Sort By
              </MenuItem>
              <MenuItem
                value={"actual_value_desc"}
                className={classes.menulabels}
              >
                $$$ to $ - Highest to Lowest
              </MenuItem>
              <MenuItem
                value={"actual_value_asc"}
                className={classes.menulabels}
              >
                $ to $$$ - Lowest to Highest
              </MenuItem>
              <MenuItem value={"end_date_asc"} className={classes.menulabels}>
                Completion - Due early
              </MenuItem>
              <MenuItem value={"end_date_desc"} className={classes.menulabels}>
                Completion - Due late
              </MenuItem>
              <MenuItem
                value={"actual_value_24_desc"}
                className={classes.menulabels}
              >
                % Change - Highest to Lowest
              </MenuItem>
              <MenuItem
                value={"actual_value_24_asc"}
                className={classes.menulabels}
              >
                % Change - Lowest to Highest
              </MenuItem>
            </Select>
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
                    <img src={ArrowDown} alt="Down" />
                  </Grid>
                );
              }}
              onChange={(e) => {
                makeFilters("Customer", e.target.value);
              }}
              defaultValue={"0"}
            >
              {[
                <MenuItem key={-1} value={"0"} className={classes.menulabels}>
                  -- Select Customer --
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
          </Grid>
        </Grid>
        <Grid container className={classes.root}>
          <Grid container className={classes.headerContainer}>
            {headers.map((header, index) => {
              return (
                <div
                  key={`Head_${index}`}
                  className={clsx(classes.header, {
                    [classes.headerSelected]: selectedHeader === index,
                  })}
                  onClick={() => {
                    setSelectedHeader(index);
                    header.onClick && header.onClick();
                  }}
                >
                  {_.get(header, "label")}
                </div>
              );
            })}
          </Grid>
          <Grid container className={classes.tableContainer}>
            {data.map((row, index) => {
              return (
                <DashboardProject
                  data={row}
                  key={index}
                  history={props.history}
                />
              );
            })}
            {data.length === 0 && (
              <Grid
                style={{
                  width: "100%",
                  minHeight: 300,
                  flexDirection: "column",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                }}
              >
                <img
                  src={Skull}
                  alt="default"
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 40,
                  }}
                />
                <Typography className={classes.default}>No data</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Paper>
      <ActivityLog history={props.history} />
    </Grid>
  );
};

const getDate = (date) => {
  const time = moment(date);
  const now = moment();
  const diffInMin = now.diff(time, "minute");
  if (diffInMin < 60) return [`${diffInMin} mins ago`];
  const diffInHour = now.diff(time, "hour");
  if (diffInHour < 24) return [`${diffInHour} hours ago`];
  const diffInDay = now.diff(time, "day");
  if (diffInDay < 7) return [`${diffInDay} days ago`];
  const diffInWeek = now.diff(time, "week");
  if (diffInWeek < 2) return [`${diffInWeek} weeks ago`];
  return time.format("MM-DD-YY");
};

const ActivityLog = (props) => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortByIndex, setSortByIndex] = useState(0);
  const [sortDirection, setSortDirection] = useState("asc");
  const ActivitySections = [{ label: "All Activities" }];
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
      case "Role":
        setSortBy(`role`);
        setSortByIndex(index);
        break;
      case "Activity":
        setSortBy(`activity`);
        setSortByIndex(index);
        break;
      case "Date/Time":
        setSortBy(`date`);
        setSortByIndex(index);
        break;
      case "Project":
        setSortBy(`project_id`);
        setSortByIndex(index);
        break;
      default:
        return "";
    }
  };
  const ActivityHeaders = [
    { label: "User", onClick: sortData.bind(this, "User", 0) },
    { label: "Project", onClick: sortData.bind(this, "Project", 1) },

    { label: "Role", onClick: sortData.bind(this, "Role", 2) },
    { label: "Activity", onClick: sortData.bind(this, "Activity", 3) },
    { label: "Date/Time", onClick: sortData.bind(this, "Date/Time", 4) },
  ];
  const token = useSelector((state) => state.auth.token);
  const groupId = useSelector((state) =>
    _.get(JSON.parse(_.get(state, ["auth", "profile"])), "group_id")
  );
  const getActivities = useCallback(async () => {
    try {
      const filter = filters.user ? `user:${filters.user}` : "";
      const result = await axios.get(
        `/groups/${groupId}/activities?p=group:${groupId}&filters=${filter}&sort_by=${sortBy}&sort_direction=${sortDirection}`,
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
  }, [groupId, token, filters, sortBy, sortDirection]);
  useEffect(() => {
    getActivities();
  }, [getActivities]);

  const getUsers = useCallback(async () => {
    try {
      const result = await axios.get(
        `/groups/${groupId}/users?p=group:${groupId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        setUsers(_.get(result, ["data", "message"]));
      }
    } catch (err) {
      console.log(err);
    }
  }, [groupId, token]);
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const makeFilters = (type, value) => {
    switch (type) {
      case "user": {
        setFilters(() => {
          return { user: value };
        });
        break;
      }
      default:
        break;
    }
  };
  return (
    <CollapsibleTableContainer
      header="Activity Log"
      select={{
        setValue: makeFilters.bind(this, "user"),
        items: users.map((user) => {
          return {
            name: `${_.get(user, ["user", "first_name"]) || ""} ${
              _.get(user, ["user", "last_name"]) || ""
            }`,
            value: _.get(user, "user_id"),
          };
        }),
      }}
      table={{
        sections: ActivitySections,
        headers: ActivityHeaders,
        onClickRow: (index) => {
          if (_.get(data, [index, "project_id"])) {
            props.history.push(`/projects/${data[index].project_id}`);
          }
        },
        data: data.map((row, index) => {
          return [
            {
              type: "defaultImage",
              value: row.first_name || "",
              field1: row.file_url || "",
              field2: {
                first_name: row.first_name,
                last_name: row.last_name,
              },
            },
            {
              type: "clickableText",
              value: row.contract_no,
            },
            {
              type: "default",
              value: _.startCase(_.toLower(row.role)) || "",
              classes:
                row.role === "FIELD_USER"
                  ? classes.field
                  : row.role === "INSPECTOR"
                  ? classes.inspector
                  : classes.admin,
            },
            {
              type: "default",
              value: _.startCase(
                `${row.activity_type}ed ${row.activity_subject}`
              ).replace("ee", "e"),
            },
            {
              type: "default",
              value: getDate(row.createdAt),
            },
          ];
        }),
        sortDirection: sortDirection,
        sortBy: sortByIndex,
      }}
    />
  );
};

export default Dashboard;
