import React, { useCallback, useEffect, useState } from "react";
import axios from "../../../axios";
import _ from "lodash";
import { useSelector } from "react-redux";
import moment from "moment";
import skull from "../../../assets/v2/Skull.svg";
import TableNew from "../../components/Table/TableNew";
import "./style.css";

const ActivityLog2 = (props) => {
  const [activeStatus, setActiveStatus] = useState("All");
  const [activities, setActivities] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => JSON.parse(state.auth.profile));
  const groupId = _.get(profile, "group_id");
  const activitiesFilterLabel = ["All", "Recent", "Failed"];

  const getDate = (date) => {
    const time = moment(date);
    const now = moment();
    const diffInMin = now.diff(time, "minute");
    if (diffInMin < 2) return `${diffInMin} min ago`;
    if (diffInMin < 60) return `${diffInMin} mins ago`;
    const diffInHour = now.diff(time, "hour");
    if (diffInHour < 2) return `${diffInHour} hour ago`;
    if (diffInHour < 24) return `${diffInHour} hours ago`;
    const diffInDay = now.diff(time, "day");
    if (diffInDay < 2) return `${diffInDay} day ago`;
    if (diffInDay < 7) return `${diffInDay} days ago`;
    const diffInWeek = now.diff(time, "week");
    if (diffInWeek < 2) return `${diffInWeek} week ago`;
    return time.format("MM-DD-YY");
  };

  const roleColor = {
    "Field User": "#1292E5",
    Inspector: "#E36767",
    Admin: "#00c04b",
    "Super Admin": "#0CA14A",
  };

  const activity = {
    "Field User": {
      borderColor: "rgba(18, 146, 229,0.2)",
      backgroundColor: "rgba(18, 146, 229,0.1)",
      color: "rgb(18, 146, 229)",
    },
    "Super Admin": {
      borderColor: "rgba(12, 161, 74,0.2)",
      backgroundColor: "rgba(12, 161, 74,0.1)",
      color: "rgb(12, 161, 74)",
    },
    Inspector: {
      borderColor: "rgba(227, 103, 103,0.2)",
      backgroundColor: "rgba(227, 103, 103,0.1)",
      color: "rgb(227, 103, 103)",
    },
    Admin: {
      borderColor: "rgba(0, 192, 75,0.2)",
      backgroundColor: "rgba(0, 192, 75,0.1)",
      color: "rgb(0, 192, 75)",
    },
  };

  const cellStyles = {
    paddingY: "7px",
    fontSize: "14px",
    color: "#123C23",
    fontWeight: "600",
    borderColor: "#DCF4EE",
    fontFamily: "Manrope",
  };

  const columns = [
    { field: "checkbox", headerName: "", width: 50, sortable: false },
    { field: "first_name", headerName: "User", sortable: true },
    { field: "project_name", headerName: "Project", sortable: true },
    {
      field: "role_new",
      headerName: "Role",
      sortable: true,
      format: (value) => (
        <span style={{ fontWeight: "bold", color: roleColor[value] }}>
          {value}
        </span>
      ),
    },
    {
      field: "activity_new",
      headerName: "Activity",
      sortable: true,
      format: (value, row) => (
        <div
          style={{
            width: "139px",
            minHeight: "27px",
            color: activity[row.role_new].color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid",
            borderColor: activity[row.role_new].borderColor,
            borderRadius: "14px",
            backgroundColor: activity[row.role_new].backgroundColor,
            fontWeight: "bold",
          }}
        >
          {value}
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Date/Time",
      sortable: true,
      format: getDate,
    },
  ];

  const getActivities = useCallback(async () => {
    try {
      const result = await axios.get(
        `/groups/${groupId}/activities?p=group:${groupId}&filters=""&sort_by=""&sort_direction=asc`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      let tempActivities = _.get(result, ["data", "message"]);

      tempActivities = tempActivities.map((activity) => {
        activity.project_name = activity.project_name || "";
        activity.role_new = _.startCase(_.toLower(activity.role));
        activity.activity_new = _.startCase(
          `${activity.activity_type}ed ${activity.activity_subject}`
        ).replace("ee", "e");

        return activity;
      });

      setActivities([...tempActivities]);
    } catch (err) {}
  }, [token, groupId]);

  useEffect(() => {
    getActivities();
  }, [getActivities]);

  const handleRowClick = (activity) => {
    if (activity.project_id) {
      props.history.push(`/projects/${activity.project_id}`);
    }
  };

  return (
    <div className="activityContainer">
      <div className="activityHeaderContainer">
        <div className="activityHeader">
          <p className="activityText">Activity</p>
        </div>
      </div>
      <div className="activityTable">
        <TableNew
          columns={columns}
          data={activities}
          cellStyles={cellStyles}
          handleRowClick={handleRowClick}
        />
        {activities.length === 0 && (
          <div className="activitiesNoData">
            <img
              src={skull}
              alt="default"
              style={{
                height: 60,
                width: 60,
              }}
            />
            <p style={{ marginTop: "0px", color: "#113C23" }}>No data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog2;
