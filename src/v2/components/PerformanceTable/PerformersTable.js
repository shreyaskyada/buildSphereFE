import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, makeStyles } from "@material-ui/core";
import skull from "../../../assets/v2/Skull.svg";
import { useEffect, useState } from "react";
import _ from "lodash";
import moment from "moment";
import "./style.css";
import { BorderBottom } from "@material-ui/icons";
import { ROUTE_PROJECTS } from "../../../helpers/endpoints";

const useStyles = makeStyles((theme) => ({
  table: {
    width: "100%",
  },

  paper: {
    width: "42.8%",
    borderRadius: 10,
    padding: "2%",
    paddingTop: 0,
    boxShadow: "none",
    margin: "2%",
    marginRight: 0,
    marginTop: 0,
    overflow: "auto",
    [theme.breakpoints.down(1360)]: {
      height: "520px",
    },
    [theme.breakpoints.down(1250)]: {
      width: "100%",
      marginRight: "2%",
      margin: "2%",
    },
  },

  title: {
    fontSize: "18px",
    fontWeight: "750",
    color: "#113C23",
    marginTop: "30px",
  },
}));

const PerformersTable = ({ projectsData, history }) => {
  const classes = useStyles();
  const [projectSignificance, setProjectSignificance] = useState([]);
  const [schedulePerformance, setSchedulePerformance] = useState([]);

  const styles = {
    border: "none",

    "& .MuiDataGrid-row:hover": {
      cursor: "pointer",
    },

    "& .MuiDataGrid-withBorderColor": {
      borderColor: "#DCF4EE",
    },
    ".MuiDataGrid-iconButtonContainer": {
      visibility: "visible !important",
    },
    "& .MuiDataGrid-sortIcon": {
      opacity: "inherit !important",
      color: "#417E5A",
      width: "13px",
      height: "13px",
      position: "absolute",
      padding: "2px",
      backgroundColor: "#DCF4EE",
      borderRadius: "50%",
      left: "0px",
    },

    "& .MuiDataGrid-columnHeaderTitleContainer": {
      display: "flex",
      flexDirection: "row-reverse",
      justifyContent: "flex-end",
      gap: "11px",
      marginLeft: "-20px",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      marginLeft: "10px",
      textOverflow: "clip",
      whiteSpace: "break-spaces",
      lineHeight: 1.2,
      fontSize: "8px",
      color: "#417E5A",
      fontFamily: "Manrope",
      fontWeight: "550",
      pointerEvents: "none",
      position: "absolute",
      left: "10px",
    },

    "& .MuiDataGrid-cellContent": {
      fontSize: "12px",
      color: "#123C23",
      fontFamily: "Manrope",
      fontWeight: "550",
      textAlign: "center",
      pointerEvents: "none",
    },
    "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
      outline: "none",
      border: "none",
    },
    "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
      {
        outline: "none",
      },
    "& .MuiDataGrid-row:last-child": {
      // borderBottom: "1px solid #DCF4EE",
    },
    "& .MuiDataGrid-cell:first-child": {
      borderLeft: "1px solid #DCF4EE",
    },
    "& .MuiDataGrid-cell:last-child": {
      borderRight: "1px solid #DCF4EE",
    },
    "& .MuiDataGrid-columnSeparator": {
      visibility: "hidden !important",
    },
    "& .MuiTouchRipple-root": {
      visibility: "hidden !important",
    },
  };

  const columns = [
    {
      field: "projectName",
      headerName: "Project Name",
      flex: 1.5,
      editable: false,
      sortable: false,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "projectSignificance",
      headerName: "Project Significance",
      type: "string",
      flex: 1,
      editable: false,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "schedulePerformance",
      headerName: "Schedule Performance",
      type: "number",
      flex: 1,
      editable: false,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "costPerformance",
      headerName: "Cost Performance",
      type: "number",
      flex: 1,
      editable: false,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "qualityPerformance",
      headerName: "Quality Performance",
      type: "string",
      flex: 1,
      editable: false,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "safetyPerformance",
      headerName: "Safety Performance",
      type: "string",
      flex: 1,
      editable: false,
      align: "left",
      headerAlign: "left",
    },
  ];

  const rows = projectSignificance?.map((significance, index) => {
    return {
      id: projectsData[index]?.project_Id || index,
      projectName: projectsData[index]?.project_name,
      projectSignificance: `${significance}%`,
      schedulePerformance: schedulePerformance[index],
      costPerformance: 1,
      qualityPerformance: "100%",
      safetyPerformance: "100%",
    };
  });

  const calculateProjectSignificance = () => {
    const sumOfPlannedValue = projectsData.reduce((sum, project) => {
      return sum + (Math.floor(project.planned_value) || 0);
    }, 0);

    const significance = projectsData.map((project) => {
      return (
        ((project.planned_value || 0) / (sumOfPlannedValue || 1)) *
        100
      ).toFixed(2);
    });

    setProjectSignificance(significance);
  };

  const calculateSchedulePerformance = () => {
    const currentDate = new Date(
      moment(_.defaultTo(new Date())).format("YYYY-MM-DD")
    );

    const performance = projectsData.map((project) => {
      const endDate = new Date(
        moment(
          _.defaultTo(_.get(project, "pactual_end_date"), new Date())
        ).format("YYYY-MM-DD")
      );

      const startDate = new Date(
        moment(
          _.defaultTo(_.get(project, "pactual_start_date"), new Date())
        ).format("YYYY-MM-DD")
      );

      const totalDays = (endDate - startDate) / (1000 * 3600 * 24) || 0;
      let completedDays = (currentDate - startDate) / (1000 * 3600 * 24) || 0;

      completedDays = completedDays > totalDays ? totalDays : completedDays;

      let plannedValue = 0;
      if (totalDays > 0) {
        plannedValue =
          (completedDays * (project.planned_value || 0)) / totalDays;
      }

      return plannedValue === 0
        ? 0
        : ((project.actual_value || 0) / plannedValue).toFixed(2);
    });

    setSchedulePerformance(performance);
  };

  useEffect(() => {
    calculateProjectSignificance();
    calculateSchedulePerformance();
  }, [projectsData]);

  const handleRowClick = (params) => {
    history.push(`${ROUTE_PROJECTS}/${params.id}`);
  };

  return (
    <Paper className={classes.paper}>
      <h2 className={classes.title}>Bottom Performers</h2>
      {projectsData.length > 0 && (
        <Box
          sx={{
            height: 445,
            width: "100%",
            border: "none",
            marginTop: "-10px",
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            rowHeight={35}
            disableRowSelectionOnClick
            hideFooter={true}
            disableColumnMenu={true}
            sx={styles}
            sortingOrder={["desc", "asc", null]}
            onRowClick={handleRowClick}
          />
        </Box>
      )}
      {projectsData.length === 0 && (
        <div className="tableNoData">
          <img
            src={skull}
            alt="default"
            style={{
              height: 40,
              width: 40,
              borderRadius: 40,
            }}
          />
          <p style={{ marginTop: "0px" }}>No Data</p>
        </div>
      )}
    </Paper>
  );
};

export default PerformersTable;
