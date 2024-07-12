import { Grid, makeStyles } from "@material-ui/core";
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../../../axios";
import CollapsibleTableContainer from "../../components/CollapsibleTableContainer";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  mainRoot: {
    padding: "2%",
    width: "112%",
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
}));

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
    <Grid container className={classes.mainRoot}>
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
    </Grid>
  );
};

export default ActivityLog;
