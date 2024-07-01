import { Button, Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import TableContainer from "../components/Table";
import AddProjectModal from "../components/AddProjectModal";
import EditProjectModal from "../components/EditProjectModal";
import axios from "../../axios";
import { useSelector } from "react-redux";
import _ from "lodash";
import { calculateTimeBudgetObject } from "../../helpers/date";
import { roundData } from "../../helpers/utils";
import clsx from "clsx";
import { ROUTE_PROJECTS } from "../../helpers/endpoints";

const useStyles = makeStyles((theme) => ({
  header: {
    fontSize: 35,
    color: theme.v2.fonts.colors.greenShade2,
    marginRight: "2%",
    fontWeight: "bold",
  },
  header1: {
    color: theme.v2.fonts.colors.darkBackground,
    fontSize: 35,
    marginRight: "2%",
    fontWeight: "bold",
  },
  btn: {
    padding: "1%",
    minWidth: 150,
    borderWidth: 0,
  },
  btnText: {
    fontSize: 18,
  },
  greenFont: {
    fontWeight: "bold",
    fontSize: 14,
    color: theme.v2.fonts.colors.greenShade2,
  },
  yellowFont: {
    fontWeight: "bold",
    fontSize: 14,
    color: theme.v2.fonts.colors.yellowShade1,
  },
  redFont: {
    fontWeight: "bold",
    fontSize: 14,
    color: theme.v2.fonts.colors.redShade1,
  },
  blueFont: {
    fontWeight: "bold",
    fontSize: 14,
    color: theme.v2.fonts.colors.blueShade1,
  },
}));

const Projects = (props) => {
  const classes = useStyles();
  const [openAddProjectModal, setOpenAddProjectModal] = useState(false);
  const [openEditProjectModal, setOpenEditProjectModal] = useState(false);
  const [editProjectData, setEditProjectData] = useState({});
  const [dataFetched, setDataFetched] = useState([]);
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortByIndex, setSortByIndex] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const projectId = props.projectId;
  const filterData = (data) => {
    setFilters(data);
  };
  const ProjectTableSections = [
    { label: "All projects", onClick: filterData.bind(this, "all") },
    { label: "Open projects", onClick: filterData.bind(this, "open") },
    { label: "Recent projects", onClick: filterData.bind(this, "recent") },
    {
      label: "Completed projects",
      onClick: filterData.bind(this, "completed"),
    },
    {
      label: "Cancelled projects",
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
      case "Customer":
        setSortBy(`customer`);
        setSortByIndex(index);
        break;
      case "Contract":
        setSortBy(`contract_no`);
        setSortByIndex(index);
        break;
      case "Project":
        setSortBy(`project_name`);
        setSortByIndex(index);
        break;
      case "Job":
        setSortBy(`total_jobs`);
        setSortByIndex(index);
        break;
      case "Status":
        setSortBy(`status`);
        setSortByIndex(index);
        break;
      case "Progress":
        setSortBy(`customer`);
        setSortByIndex(index);
        break;
      case "Time Budget":
        setSortBy(`customer`);
        setSortByIndex(index);
        break;
      case "Revenue":
        setSortBy(`actual_value:${sortDirection}`);
        setSortByIndex(index);
        break;
      default:
        return "";
    }
  };
  const onClickRow = (index) => {
    props.history.push(
      `${ROUTE_PROJECTS}/${_.get(dataFetched, [index, "project_Id"])}`
    );
  };
  const ProjectTableHeaders = [
    { label: "Customer", onClick: sortData.bind(this, "Customer", 0) },
    // { label: "Contract", onClick: sortData.bind(this, "Contract", 1) },
    { label: "Project", onClick: sortData.bind(this, "Project", 2) },
    { label: "Job", onClick: sortData.bind(this, "Job", 3) },
    { label: "Status", onClick: sortData.bind(this, "Status", 4) },
    { label: "Progress", onClick: sortData.bind(this, "Progress", 5) },
    { label: "Time Budget", onClick: sortData.bind(this, "Time Budget", 6) },
    { label: "Revenue", onClick: sortData.bind(this, "Revenue", 7) },
  ];
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => JSON.parse(state.auth.profile));
  const groupId = _.get(profile, "group_id");
  const getProjects = useCallback(async () => {
    try {
      const result = await axios.get(
        `/projects?p=group:${groupId}&f=${filters}&s=${sortBy}:${sortDirection}`,
        {
          headers: { Authorization: token },
        }
      );
      if (result && result.status === 200) {
        setDataFetched(_.get(result, ["data", "message"], []));
        let dataSet = _.get(result, ["data", "message"], []).map((record) => {
          let progress =
            (_.defaultTo(_.get(record, "actual_value"), 0) * 100) /
            _.defaultTo(_.get(record, "planned_value"), 1);
          progress = roundData(progress);
          let progress24 =
            (_.defaultTo(_.get(record, "actual_value24"), 0) * 100) /
            _.defaultTo(_.get(record, "planned_value"), 1);
          progress24 = roundData(progress);
          const tClasses = clsx(
            {
              [classes.greenFont]: _.toLower(record.status) === "ongoing",
            },
            {
              [classes.yellowFont]: _.toLower(record.status) === "on hold",
            },
            {
              [classes.redFont]: _.toLower(record.status) === "overdue",
            },
            {
              [classes.blueFont]: _.toLower(record.status) === "completed",
            }
          );
          if (projectId) {
            if (projectId == _.get(record, "project_Id")) {
              return [
                {
                  value: _.get(record, "customer_name"),
                  type: "default",
                },
                // { value: _.get(record, "contract_no"), type: "defaultUppercase" },
                { value: _.get(record, "project_name"), type: "default" },
                { value: _.get(record, "total_jobs"), type: "default" },
                {
                  value: _.get(record, "status"),
                  type: "default",
                  classes: tClasses,
                },
                {
                  value: progress,
                  type: "projectProgress",
                  field1: progress24,
                },
                {
                  value: calculateTimeBudgetObject(
                    _.get(record, "pendDate"),
                    true
                  ).str,
                  type: "default",
                  classes: tClasses,
                },
                {
                  value: `$ ${roundData(
                    _.defaultTo(_.get(record, "actual_value"), 0)
                  )}`,
                  type: "revenue",
                  field1: _.defaultTo(_.get(record, "actual_value"), 0),
                },
              ];
            } else {
              return null;
            }
          }
          return [
            {
              value: _.get(record, "customer_name"),
              type: "default",
            },
            // { value: _.get(record, "contract_no"), type: "defaultUppercase" },
            { value: _.get(record, "project_name"), type: "default" },
            { value: _.get(record, "total_jobs"), type: "default" },
            {
              value: _.get(record, "status"),
              type: "default",
              classes: tClasses,
            },
            { value: progress, type: "projectProgress", field1: progress24 },
            {
              value: calculateTimeBudgetObject(_.get(record, "pendDate"), true)
                .str,
              type: "default",
              classes: tClasses,
            },
            {
              value: `$ ${roundData(
                _.defaultTo(_.get(record, "actual_value"), 0)
              )}`,
              type: "revenue",
              field1: _.defaultTo(_.get(record, "actual_value"), 0),
            },
          ];
        });

        setData(dataSet.filter((item) => !!item));
      }
    } catch (err) {}
  }, [token, groupId, filters, sortBy, sortDirection, projectId]);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  const editProject = (index) => {
    setEditProjectData(_.get(dataFetched, index));
    setOpenEditProjectModal(true);
  };

  return (
    <Grid container style={{ flexDirection: "column" }}>
      <EditProjectModal
        open={openEditProjectModal}
        onClose={setOpenEditProjectModal.bind(this, false)}
        data={editProjectData}
        refresh={getProjects}
      />
      {!projectId && (
        <AddProjectModal
          open={openAddProjectModal}
          onClose={setOpenAddProjectModal.bind(this, false)}
          refresh={getProjects}
        />
      )}
      <Grid container style={{ padding: "2%" }}>
        <Grid container style={{ flexDirection: "row" }}>
          <Typography
            className={clsx({
              [classes.header1]: Boolean(projectId),
              [classes.header]: !Boolean(projectId),
            })}
          >
            {projectId ? "Project Details" : "Projects"}
          </Typography>
          {!projectId && (
            <Button
              variant="outlined"
              className={classes.btn}
              onClick={setOpenAddProjectModal.bind(this, true)}
            >
              <Typography className={classes.btnText}>Add Project</Typography>
            </Button>
          )}
        </Grid>
      </Grid>
      <Grid container style={{ padding: "1%", paddingTop: "0%" }}>
        <TableContainer
          sections={projectId ? [] : ProjectTableSections}
          headers={ProjectTableHeaders}
          data={data}
          sortDirection={sortDirection}
          sortBy={sortByIndex}
          onClickRow={onClickRow}
          edit={editProject}
        />
      </Grid>
    </Grid>
  );
};

export default Projects;
