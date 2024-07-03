import React, { useCallback, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import "./styles.css";
import filterIcon from "../../../assets/v2/Filter.svg";
import { Checkbox, TableContainer } from "@mui/material";
import ProgressCircle from "../../components/ProgressCircle/ProgressCircle";
import axios from "../../../axios";
import _ from "lodash";
import { useSelector } from "react-redux";
import moment from "moment";
import skull from "../../../assets/v2/Skull.svg";
import { ReactComponent as Plus } from "../../../assets/v2/Plus.svg";
import CreateContractModal from "../../components/CreateContractModal/CreateContractModal";
import CreateProjectModal from "../../components/CreateProjectModal/CreateProjectModal";
import { ROUTE_PROJECTS } from "../../../helpers/endpoints";
import SuccessMsgModal from "../../components/SuccessMsgModal/SuccessMsgModal";

const Projects2 = (props) => {
  const [activeStatus, setActiveStatus] = useState("All");
  const [filters, setFilters] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [projects, setProjects] = useState([]);
  const [progress, setProgress] = useState([]);
  const [remainingTime, setRemainingTime] = useState([]);
  const [showCreateContractModal, setShowCreateContractModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => JSON.parse(state.auth.profile));
  const groupId = _.get(profile, "group_id");
  const statusColor = {
    Ongoing: "#59A77B",
    "On hold": "#E3BD68",
    Completed: "#00530C",
    Cancelled: "#E36767",
  };

  const calculateProgress = (projects) => {
    const tempProgress = projects.map((project) => {
      const plannedValued = project.planned_value || 0;
      const completedValued = project.actual_value || 0;

      return plannedValued < 0
        ? 0
        : ((completedValued * 100) / plannedValued).toFixed(2);
    });

    setProgress(tempProgress);
  };

  const calculateRemainingTime = (projects) => {
    const remaining_days = projects.map((project, index) => {
      const endDate = new Date(
        moment(
          _.defaultTo(_.get(project, "pactual_end_date"), new Date())
        ).format("YYYY-MM-DD")
      );

      const currentDate = new Date(
        moment(_.defaultTo(new Date())).format("YYYY-MM-DD")
      );

      const rd = (endDate - currentDate) / (1000 * 3600 * 24);
      return rd < 0 ? 0 : rd;
    });

    const remaining_time = remaining_days.map((remaining_days) => {
      const months = Math.floor(remaining_days / 30);
      const days = remaining_days % 30;

      return { months: months, days: days };
    });

    setRemainingTime(remaining_time);
  };

  const getProjects = useCallback(async () => {
    try {
      const result = await axios.get(
        `/projects?p=group:${groupId}&f=${filters}&s=${sortBy}:${sortDirection}`,
        {
          headers: { Authorization: token },
        }
      );

      setProjects(_.get(result, ["data", "message"], []));

      calculateProgress(result.data.message);
      calculateRemainingTime(result.data.message);
    } catch (err) {}
  }, [token, groupId, filters, sortBy, sortDirection]);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  const projectsFilterLabel = [
    "All",
    "Open",
    "Recent",
    "Completed",
    "Cancelled",
  ];
  const tableHead = [
    "",
    "Customer",
    "Contract",
    "Project",
    "Job",
    "Status",
    "Progress",
    "Time Remaining",
    "Revenue",
  ];

  const cellStyles = {
    paddingY: "7px",
    fontSize: "15px",
    color: "#123C23",
    fontWeight: "550",
    borderColor: "#DCF4EE",
    fontFamily: "Manrope",
  };

  return (
    <div className="projectsContainer">
      <div className="projectsHeader">
        <p className="projectText">Projects</p>
        <div className="projectsFilter">
          <ul>
            {projectsFilterLabel.map((filter, index) => {
              return (
                <li
                  key={index}
                  id={filter}
                  className="filterName"
                  style={{
                    cursor: "pointer",
                    backgroundColor: activeStatus === filter ? "#113C23" : null,
                    color: activeStatus === filter ? "white" : null,
                  }}
                  onClick={(e) => {
                    setActiveStatus(e.currentTarget.id);
                    setFilters(filter.toLowerCase());
                  }}
                >
                  {filter}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="projectsStatus">
          <div className="projectsStatusRow1">
            <div className="statusCompleted">
              <div style={{ backgroundColor: "#00530C" }}></div>
              <p>Completed</p>
            </div>
            <div className="statusInProgress">
              <div style={{ backgroundColor: "#59A77B" }}></div>
              <p>In Progress</p>
            </div>
          </div>
          <div className="projectsStatusRow2">
            <div className="statusPaused">
              <div style={{ backgroundColor: "#E3BD68" }}></div>
              <p>Paused</p>
            </div>
            <div className="statusCancelled">
              <div style={{ backgroundColor: "#E36767" }}></div>
              <p>Cancelled</p>
            </div>
          </div>
        </div>
        <div className="projectFilter">
          <img src={filterIcon} alt="filterIcon" style={{ height: "17px" }} />
          <p className="filterText">Filters</p>
        </div>
      </div>
      <div className="projectsTable">
        <TableContainer sx={{ maxHeight: 640, borderRadius: "10px" }}>
          <Table stickyHeader aria-label="simple table">
            <TableHead>
              <TableRow>
                {tableHead.map((th) => {
                  return (
                    <TableCell
                      sx={{
                        fontSize: "10px",
                        paddingY: "10px",
                        color: "#113C23",
                        borderColor: "#DCF4EE",
                        fontFamily: "Manrope",
                        fontWeight: "650",
                      }}
                    >
                      {th}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>

            <TableBody>
              {projects.map((project, index) => (
                <TableRow
                  key={project.project_Id}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      background: "#F1F8F5",
                    },
                  }}
                  onClick={() => {
                    props.history.push(
                      `${ROUTE_PROJECTS}/${project.project_Id}`
                    );
                  }}
                >
                  <TableCell sx={{ ...cellStyles, paddingRight: 0, width: 0 }}>
                    <Checkbox
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      ...cellStyles,
                      width: "130px",
                    }}
                  >
                    {project.customer_name}
                  </TableCell>
                  <TableCell
                    sx={{
                      ...cellStyles,
                      width: "130px",
                    }}
                  >
                    ABZ12345
                  </TableCell>
                  <TableCell
                    sx={{
                      ...cellStyles,
                      width: "170px",
                    }}
                  >
                    {project.project_name}
                  </TableCell>
                  <TableCell
                    sx={{
                      ...cellStyles,
                      width: "60px",
                    }}
                  >
                    {project.total_jobs}
                  </TableCell>
                  <TableCell sx={cellStyles}>
                    <div
                      style={{
                        backgroundColor: statusColor[project.status],
                        height: "16px",
                        width: "16px",
                        border: "5px solid #E5EDE6",
                        borderRadius: "50%",
                      }}
                    ></div>
                  </TableCell>
                  <TableCell
                    sx={{
                      ...cellStyles,
                    }}
                  >
                    <p
                      style={{
                        color: "#59A77B",
                        fontSize: "10px",
                        marginTop: "-18px",
                        marginBottom: "5px",
                      }}
                    >
                      {progress[index]}%
                    </p>
                    <div
                      style={{
                        height: "5px",
                        width: "200px",
                        backgroundColor: "#DCF4EE",
                        borderRadius: "11px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          height: "9px",
                          width: `${progress[index]}%`,
                          backgroundColor: "#59A77B",
                          borderRadius: "11px",
                        }}
                      ></div>
                    </div>
                  </TableCell>
                  <TableCell
                    sx={{
                      ...cellStyles,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ProgressCircle
                      percentage={25}
                      circleColor="#DCF4EE"
                      progressCircleColor="#59A77B"
                    />
                    {remainingTime[index]?.months}
                    {"m:"}
                    {remainingTime[index]?.days}
                    {"d"}
                  </TableCell>
                  <TableCell
                    sx={{
                      ...cellStyles,
                      color: "#59A77B",
                      width: "150px",
                      fontWeight: "600",
                    }}
                  >
                    {"+ $"}
                    {Math.floor(project.actual_value || 0)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {projects.length === 0 && (
          <div className="projectsNoData">
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
      <div className="tableBtn">
        <button
          className="contractBtn"
          onClick={() => {
            setShowCreateContractModal(true);
          }}
        >
          <Plus fill="#0CA14A" /> <p>New Contract</p>
        </button>
        <button
          className="projectBtn"
          onClick={() => {
            setShowCreateProjectModal(true);
          }}
        >
          <Plus fill="#FAFBFB" /> <p>New Project</p>
        </button>
      </div>
      <CreateContractModal
        showCreateContractModal={showCreateContractModal}
        setShowCreateContractModal={setShowCreateContractModal}
      />
      <CreateProjectModal
        showCreateProjectModal={showCreateProjectModal}
        setShowCreateProjectModal={setShowCreateProjectModal}
      />
      <SuccessMsgModal successMsg={successMsg} setSuccessMsg={setSuccessMsg} />
    </div>
  );
};

export default Projects2;
