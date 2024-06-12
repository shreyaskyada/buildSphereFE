import React from "react";
import "./styles.css";
import { ReactComponent as UnitsNeedPricing } from "../../../assets/v2/UnitsNeedPricing.svg";
import { ReactComponent as FailedInspection } from "../../../assets/v2/FailedInspection.svg";
import { ReactComponent as FailedSafetyReports } from "../../../assets/v2/FailedSafetyReports.svg";
import { ReactComponent as ActualVsPlanned } from "../../../assets/v2/ActualVsPlanned.svg";
import { ReactComponent as ReadyToBill } from "../../../assets/v2/ReadyToBill.svg";
import ProjectSummaryChart from "./ProjectSummaryChart";

const ProjectSummaryCard = ({ id }) => {
  return (
    <div className="projectSummaryCardContainer">
      <div className="projectSummaryCardTop">
        <div className="topLeft">
          <h3 className="projectName">Project Name</h3>
          <p className="projectProgress">
            Project Progress
            <span style={{ color: "#0CA14A", fontWeight: "bold" }}> 40%</span>
          </p>
          <div className="progressBar">
            <div className="innerProgressBar1"></div>
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
        <p className="jobStatus">
          Job
          <br />
          Status
        </p>
        <div className="projectSummaryChart">
          <ProjectSummaryChart id={id} />
        </div>
      </div>
    </div>
  );
};

export default ProjectSummaryCard;
