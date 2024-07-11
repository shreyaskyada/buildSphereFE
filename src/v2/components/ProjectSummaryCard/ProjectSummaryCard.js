import React from "react";
import "./styles.css";
import ProjectSummaryChart from "./ProjectSummaryChart";
import _ from "lodash";
import moment from "moment";
import ProjectIssues from "./ProjectIssues";
import { Grid, Tooltip, Typography, withStyles } from "@material-ui/core";

const CustomTooltip = withStyles(() => ({
  arrow: {
    color: "#00530C",
  },
  tooltip: {
    marginTop: "7px",
    backgroundColor: "#00530C",
    color: "white",
    maxWidth: 200,
    border: 0,
    borderRadius: 10,
  },
}))(Tooltip);

const ProjectSummaryCard = ({ id, project, history, startDate, endDate }) => {
  const projectProgress = Math.floor(
    (project.actual_value * 100) / (project.planned_value || 1)
  );

  const currentDate = new Date(
    moment(_.defaultTo(new Date())).format("YYYY-MM-DD")
  );

  const totalDays = (endDate - startDate) / (1000 * 3600 * 24);
  var completedDays;
  var timeProgress;

  if (currentDate < endDate) {
    completedDays =
      (currentDate - startDate) / (1000 * 3600 * 24) < 0
        ? 0
        : (currentDate - startDate) / (1000 * 3600 * 24);

    timeProgress = Math.ceil(
      totalDays === 0 ? 0 : (completedDays * 100) / totalDays
    );
  } else {
    timeProgress = 100;
  }

  return (
    <>
      <div className="projectSummaryCardContainer">
        <div className="projectSummaryCardTop">
          <div className="topLeft">
            <h3 className="projectName">{project.project_name}</h3>
            <p className="projectProgress">
              Project Progress
              <span style={{ color: "#0CA14A", fontWeight: "bold" }}>
                {" "}
                {projectProgress > 100 ? 100 : projectProgress}
                {"%"}
              </span>
            </p>
            <CustomTooltip
              arrow
              title={
                <React.Fragment>
                  <Grid
                    item
                    xs={12}
                    container
                    style={{ maxWidth: "100%" }}
                    alignItems="center"
                  >
                    <Typography style={{ fontSize: "12px" }}>
                      Project Progress: {projectProgress}%
                    </Typography>
                  </Grid>
                </React.Fragment>
              }
            >
              <div className="progressBar">
                <div
                  className="innerProgressBar1"
                  style={{
                    width: `${projectProgress < 100 ? projectProgress : 100}%`,
                  }}
                ></div>
                <div
                  className="innerProgressBar2"
                  style={{
                    width: `${
                      projectProgress < timeProgress
                        ? timeProgress - projectProgress
                        : 0
                    }%`,
                  }}
                ></div>
                <div className="innerProgressBarSymbol"></div>
              </div>
            </CustomTooltip>

            <p className="projectSchedule">
              {timeProgress}% of the time completed
            </p>
          </div>

          <div className="topRight">
            <ProjectIssues history={history} project={project} />
          </div>
        </div>

        <div className="projectSummaryCardBottom">
          <p className="jobStatus">{project.status}</p>
          <div className="projectSummaryChart">
            <ProjectSummaryChart id={id} project={project} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectSummaryCard;
