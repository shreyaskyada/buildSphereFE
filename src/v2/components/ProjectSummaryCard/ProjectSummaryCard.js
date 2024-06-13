import React from "react";
import "./styles.css";
import { ReactComponent as UnitsNeedPricing } from "../../../assets/v2/UnitsNeedPricing.svg";
import { ReactComponent as FailedInspection } from "../../../assets/v2/FailedInspection.svg";
import { ReactComponent as FailedSafetyReports } from "../../../assets/v2/FailedSafetyReports.svg";
import { ReactComponent as ActualVsPlanned } from "../../../assets/v2/ActualVsPlanned.svg";
import { ReactComponent as ReadyToBill } from "../../../assets/v2/ReadyToBill.svg";
import ProjectSummaryChart from "./ProjectSummaryChart";

const ProjectSummaryCard = ({ id, project }) => {
  const projectProgress = Math.floor(
    (project.actual_value * 100) / project.planned_value
  );

  return (
    <div className="projectSummaryCardContainer">
      <div className="projectSummaryCardTop">
        <div className="topLeft">
          <h3 className="projectName">{project.project_name}</h3>
          <p className="projectProgress">
            Project Progress
            <span style={{ color: "#0CA14A", fontWeight: "bold" }}>
              {" "}
              {projectProgress}
              {"%"}
            </span>
          </p>
          <div className="progressBar">
            <div
              className="innerProgressBar1"
              style={{
                width: `${projectProgress < 100 ? projectProgress : 40}%`,
              }}
            ></div>
            <div className="innerProgressBar2"></div>
            <div className="innerProgressBarSymbol"></div>
          </div>
          <p className="projectSchedule">30% ahead of schedule</p>
        </div>
        <div className="topRight">
          <p className="projectIssue">Project Issues</p>
          <div className="projectIssueSvgContainer">
            <ReadyToBill style={{ fill: "#4196CB", height: "24px" }} />
            <UnitsNeedPricing style={{ fill: "#E36767", height: "24px" }} />
            <ActualVsPlanned style={{ fill: "#E36767", height: "24px" }} />
            <FailedInspection style={{ fill: "#E36767", height: "24px" }} />
            <FailedSafetyReports style={{ fill: "#E36767", height: "24px" }} />
          </div>
        </div>
      </div>

      <div className="projectSummaryCardBottom">
        <p className="jobStatus">{project.status}</p>
        <div className="projectSummaryChart">
          <ProjectSummaryChart id={id} project={project} />
        </div>
      </div>
    </div>
  );
};

export default ProjectSummaryCard;
