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
import { ReactComponent as DownArrow } from "../../../assets/v2/DownArrow.svg";
import { ReactComponent as UpArrow } from "../../../assets/v2/UpArrow.svg";

const Projects2 = (props) => {
  const [activeStatus, setActiveStatus] = useState("All");
  const [filters, setFilters] = useState("");
  const [projects, setProjects] = useState([]);
  const [defaultProjects, setDefaultProjects] = useState([]);
  const [sortedProjects, setSortedProjects] = useState({});
  const [showCreateContractModal, setShowCreateContractModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [customers, setCustomers] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [sortingInfo, setSortingInfo] = useState({});

  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => JSON.parse(state.auth.profile));
  const groupId = _.get(profile, "group_id");
  const statusColor = {
    Ongoing: "#59A77B",
    "On hold": "#E3BD68",
    Completed: "#00530C",
    Cancelled: "#E36767",
  };

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
    fontSize: "14px",
    color: "#123C23",
    fontWeight: "600",
    borderColor: "#DCF4EE",
    fontFamily: "Manrope",
  };

  const calculateProgress = (projects_) => {
    projects_.map((project, index) => {
      const plannedValued = project.planned_value || 0;
      const completedValued = project.actual_value || 0;
      const completedValued24 = project.actual_value_24 || 0;

      const progress =
        plannedValued === 0 ? 0 : (completedValued * 100) / plannedValued;
      const progress24 =
        plannedValued === 0 ? 0 : (completedValued24 * 100) / plannedValued;

      projects_[index].progress = progress;
      projects_[index].progress24 = progress24;

      return null;
    });
    setProjects([...projects_]);
    setDefaultProjects([...projects_]);
  };

  const calculateRemainingTime = (projects_) => {
    const remaining_days = projects_.map((project, index) => {
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

      const currentDate = new Date(
        moment(_.defaultTo(new Date())).format("YYYY-MM-DD")
      );

      let totalDays = (endDate - startDate) / (1000 * 3600 * 24);
      let completedDays = (currentDate - startDate) / (1000 * 3600 * 24);
      let rd = (endDate - currentDate) / (1000 * 3600 * 24);

      completedDays = completedDays < 0 ? 0 : completedDays;
      completedDays = completedDays > totalDays ? totalDays : completedDays;
      rd = rd < 0 ? 0 : rd;

      if (totalDays > 0)
        projects_[index].completedDays = Math.floor(
          (completedDays * 100) / totalDays
        );
      else projects_[index].completedDays = 0;

      projects_[index].total_days = rd;
      projects_[index].total_jobs = Number(projects_[index].total_jobs || 0);
      projects_[index].actual_value = projects_[index].actual_value || 0;

      return rd;
    });

    remaining_days.map((remaining_days, index) => {
      const months = Math.floor(remaining_days / 30);
      const days = remaining_days % 30;
      projects_[index].months = months;
      projects_[index].days = days;
      return null;
    });

    setProjects([...projects_]);
    setDefaultProjects([...projects_]);
  };

  const sort = (key) => {
    const projects_ = [...defaultProjects];
    const sorted_Projects = projects_.sort((a, b) => {
      if (a[key] < b[key]) {
        return -1;
      }
      if (a[key] > b[key]) {
        return 1;
      }
      return 0;
    });

    return sorted_Projects;
  };

  const manageSorting = () => {
    const sortByCustomer = sort("customer_name");
    setSortedProjects((prev) => {
      return {
        ...prev,
        Customer: {
          asc: [...sortByCustomer],
          dec: [...sortByCustomer.reverse()],
        },
      };
    });

    const sortByProject = sort("project_name");

    setSortedProjects((prev) => {
      return {
        ...prev,
        Project: {
          asc: [...sortByProject],
          dec: [...sortByProject.reverse()],
        },
      };
    });

    const sortByJobs = sort("total_jobs");

    setSortedProjects((prev) => {
      return {
        ...prev,
        Job: {
          asc: [...sortByJobs],
          dec: [...sortByJobs.reverse()],
        },
      };
    });

    const sortByRevenue = sort("actual_value");

    setSortedProjects((prev) => {
      return {
        ...prev,
        Revenue: {
          asc: [...sortByRevenue],
          dec: [...sortByRevenue.reverse()],
        },
      };
    });

    const sortByProgress = sort("progress");

    setSortedProjects((prev) => {
      return {
        ...prev,
        Progress: {
          asc: [...sortByProgress],
          dec: [...sortByProgress.reverse()],
        },
      };
    });

    const sortByTime = sort("total_days");

    setSortedProjects((prev) => {
      return {
        ...prev,
        "Time Remaining": {
          asc: [...sortByTime],
          dec: [...sortByTime.reverse()],
        },
      };
    });
  };

  const getProjects = useCallback(async () => {
    try {
      const result = await axios.get(
        `/projects?p=group:${groupId}&f=${filters}&s=:asc`,
        {
          headers: { Authorization: token },
        }
      );
      calculateProgress(result.data.message);
      calculateRemainingTime(result.data.message);
    } catch (err) {}
  }, [token, groupId, filters]);

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

  const getContracts = useCallback(async () => {
    try {
      const result = await axios.get(`/contracts?p=group:${groupId}`, {
        headers: {
          Authorization: token,
        },
      });
      setContracts(_.get(result, ["data", "message"]) || []);
    } catch (err) {}
  }, [groupId, token]);

  useEffect(() => {
    manageSorting();
  }, [defaultProjects]);

  useEffect(() => {
    getProjects();
    getCustomers();
    getContracts();
  }, [getProjects, getCustomers, getContracts]);

  const handleSorting = (e) => {
    const key = e.currentTarget.id;
    if (sortingInfo?.[key]) {
      if (sortingInfo[key] === null) {
        setSortingInfo({ [key]: "dec" });
        const temp = sortedProjects[key]?.dec;
        if (temp) setProjects([...temp]);
      }
      if (sortingInfo[key] === "dec") {
        setSortingInfo({ [key]: "asc" });
        const temp = sortedProjects[key]?.asc;
        if (temp) setProjects([...temp]);
      }
      if (sortingInfo[key] === "asc") {
        setSortingInfo({ [key]: null });
        setProjects([...defaultProjects]);
      }
    } else {
      setSortingInfo({ [key]: "dec" });
      const temp = sortedProjects[key]?.dec;
      if (temp) setProjects([...temp]);
    }
  };

  return (
    <div className="projectsContainer">
      <div className="projectsHeaderContainer">
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
                      backgroundColor:
                        activeStatus === filter ? "#113C23" : null,
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
        </div>
        <div className="projectFilter">
          <img src={filterIcon} alt="filterIcon" style={{ height: "17px" }} />
          <p className="filterText">Filters</p>
        </div>
      </div>
      <div className="projectsTable">
        <TableContainer sx={{ maxHeight: "100%", borderRadius: "10px" }}>
          <Table stickyHeader aria-label="simple table">
            <TableHead>
              <TableRow>
                {tableHead.map((th) => {
                  return (
                    <TableCell
                      id={th}
                      sx={{
                        fontSize: "12px",
                        paddingY: "10px",
                        color: "#113C23",
                        borderColor: "#DCF4EE",
                        fontFamily: "Manrope",
                        fontWeight: "650",
                        cursor: th !== "" && th !== "Status" ? "pointer" : "",
                      }}
                      onClick={th !== "" && th !== "Status" && handleSorting}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        {th}
                        {th !== "" && th !== "Status" && (
                          <div
                            style={{
                              height: "15px",
                              width: "15px",
                              borderRadius: "50%",
                              backgroundColor:
                                sortingInfo[th] && sortingInfo !== null
                                  ? "#DCF4EE"
                                  : "",

                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {sortingInfo[th] === "asc" ? (
                              <UpArrow style={{ height: "11px" }} />
                            ) : (
                              <DownArrow style={{ height: "11px" }} />
                            )}
                          </div>
                        )}
                      </div>
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
                        fontWeight: "700",
                      }}
                    >
                      {project.progress.toFixed(2)}%
                      {`(+${project.progress24}%)`}
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
                          width: `${project.progress}%`,
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
                      percentage={project?.completedDays || 0}
                      circleColor="#DCF4EE"
                      progressCircleColor="#59A77B"
                    />
                    {project?.months}
                    {"m:"}
                    {project?.days}
                    {"d"}
                  </TableCell>
                  <TableCell
                    sx={{
                      ...cellStyles,
                      color: "#59A77B",
                      width: "150px",
                      fontWeight: "650",
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
      {showCreateContractModal && (
        <CreateContractModal
          getContracts={getContracts}
          showCreateContractModal={showCreateContractModal}
          setShowCreateContractModal={setShowCreateContractModal}
          customers={customers}
          setSuccessMsg={setSuccessMsg}
        />
      )}
      {showCreateProjectModal && (
        <CreateProjectModal
          showCreateProjectModal={showCreateProjectModal}
          setShowCreateProjectModal={setShowCreateProjectModal}
          customers={customers}
          contracts={contracts}
          setSuccessMsg={setSuccessMsg}
        />
      )}
      {successMsg !== "" && (
        <SuccessMsgModal
          successMsg={successMsg}
          setSuccessMsg={setSuccessMsg}
        />
      )}
    </div>
  );
};

export default Projects2;
