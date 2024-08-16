import React, { useCallback, useEffect, useState } from "react";
import "./styles.css";
import filterIcon from "../../../assets/v2/Filter.svg";
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
import TableNew from "../../components/Table/TableNew";

const Projects2 = (props) => {
  const [activeStatus, setActiveStatus] = useState("All");
  const [filters, setFilters] = useState("");
  const [projects, setProjects] = useState([]);
  const [showCreateContractModal, setShowCreateContractModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [customers, setCustomers] = useState([]);
  const [contracts, setContracts] = useState([]);

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
    {
      field: "customer_name",
      headerName: "Customer",
      sortable: true,
      format: (value) => value,
    },
    {
      field: "contract_name",
      headerName: "Contract",
      sortable: true,
      format: (value) => value,
    },
    {
      field: "project_name",
      headerName: "Project",
      sortable: true,
      format: (value) => value,
    },
    {
      field: "total_jobs",
      headerName: "Jobs",
      sortable: true,
      format: (value) => value,
    },
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      format: (value) => (
        <div
          style={{
            backgroundColor: statusColor[value],
            height: "16px",
            width: "16px",
            border: "5px solid #E5EDE6",
            borderRadius: "50%",
          }}
        ></div>
      ),
    },
    {
      field: "progress",
      headerName: "Progress",
      sortable: true,
      format: (value, row) => (
        <>
          <p
            style={{
              color: "#59A77B",
              fontSize: "10px",
              marginTop: "-18px",
              marginBottom: "5px",
              fontWeight: "700",
            }}
          >
            {value.toFixed(2)}%{`(+${row.progress24}%)`}
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
                width: `${value}%`,
                backgroundColor: "#59A77B",
                borderRadius: "11px",
              }}
            ></div>
          </div>
        </>
      ),
    },
    {
      field: "total_days",
      headerName: "Time Remaining",
      sortable: true,
      format: (value, row) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <ProgressCircle
            percentage={row.completedDays || 0}
            circleColor="#DCF4EE"
            progressCircleColor="#59A77B"
          />
          {row.months}
          {"m:"}
          {row.days}
          {"d"}
        </div>
      ),
    },
    {
      field: "actual_value",
      headerName: "Revenue",
      sortable: true,
      format: (value) => `+ $${Math.floor(value || 0)}`,
    },
  ];

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
      projects_[index].contract_name =
        projects_[index].contract_name || "ABZ12345";

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
    getProjects();
    getCustomers();
    getContracts();
  }, [getProjects, getCustomers, getContracts]);

  const handleRowClick = (project) => {
    props.history.push(`${ROUTE_PROJECTS}/${project.project_Id}`);
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
        <TableNew
          columns={columns}
          data={projects}
          cellStyles={cellStyles}
          handleRowClick={handleRowClick}
          cursorPointer={true}
        />
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
          getCustomers={getCustomers}
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
          getProjects={getProjects}
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
