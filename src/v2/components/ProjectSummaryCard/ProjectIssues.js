import {
  Grid,
  Popover,
  Tooltip,
  Typography,
  makeStyles,
} from "@material-ui/core";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { ROUTE_PROJECTS } from "../../../helpers/endpoints";
import { ReactComponent as UnitsNeedPricing } from "../../../assets/v2/UnitsNeedPricing.svg";
import { ReactComponent as FailedInspection } from "../../../assets/v2/FailedInspection.svg";
import { ReactComponent as FailedSafetyReports } from "../../../assets/v2/FailedSafetyReports.svg";
import { ReactComponent as ActualVsPlanned } from "../../../assets/v2/ActualVsPlanned.svg";
import { ReactComponent as ReadyToBill } from "../../../assets/v2/ReadyToBill.svg";
import UnitsNeedPricingModal from "../../components/UnitsNeedPricingModal";
import CrossSmall from "../../../assets/v2/CrossSmall.svg";
import axios from "../../../axios";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  view: {
    textDecoration: "underline",
    fontSize: 14,
    fontWeight: 500,
    color: theme.v2.fonts.colors.greenShade1,
    cursor: "pointer",
  },
  popupContainer: {
    marginTop: 30,
  },
  popupLabels: {
    fontSize: 16,
    color: theme.v2.fonts.colors.darkFont,
  },
  popupSection: {
    padding: "5%",
    border: `1px solid ${theme.v2.borders.lightGrey}`,
  },
  popupHeader: {
    padding: "4% 5%",
    backgroundColor: theme.v2.backgrounds.redBackground,
  },
  popupLabelHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.whiteFont,
  },
}));

const reloadWindow = () => {
  window.location.reload();
};

const ProjectIssues = ({ history, project }) => {
  const [anchorEl, setAnchorEl] = useState();
  const [units, setUnits] = useState([]);
  const [clickedIssue, setClickedIssue] = useState("");
  const [openUnitsNeedPricingModal, setOpenUnitsNeedPricingModal] =
    useState(false);
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);

  const readyToBill = false;
  const unitsNeedPricing = parseInt(_.get(project, "cip_units") || 0) > 0;
  const actualValueGreaterThenPlanned =
    project.actual_value > project.planned_value;
  const failedInspection = false;
  const failedSafetyReports = false;

  const showProjectIssue =
    readyToBill ||
    unitsNeedPricing ||
    actualValueGreaterThenPlanned ||
    failedInspection ||
    failedSafetyReports;

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleClickedIssue = (e) => {
    setClickedIssue(e.currentTarget.id);
  };

  const getCipUnits = useCallback(async () => {
    try {
      const result = await axios.get(
        `/units/cipunits?p=project:${project.id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        setUnits(
          _.get(result, ["data", "message"], []).map((row) => {
            return {
              id: _.get(row, "unit_id"),
              unit_name: _.get(row, ["unit", "unit_name"]),
            };
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  }, [project, token]);

  const goToProject = (projectId, scrollTo, state) => {
    if (scrollTo)
      state
        ? history.push(`${ROUTE_PROJECTS}/${projectId}#${scrollTo}`, {
            ...state,
          })
        : history.push(`${ROUTE_PROJECTS}/${projectId}#${scrollTo}`);
    else
      state
        ? history.push(`${ROUTE_PROJECTS}/${projectId}`, { ...state })
        : history.push(`${ROUTE_PROJECTS}/${projectId}`);
  };

  return (
    <>
      {showProjectIssue && (
        <div>
          <UnitsNeedPricingModal
            open={openUnitsNeedPricingModal}
            units={units}
            onClose={setOpenUnitsNeedPricingModal.bind(this, false)}
            refresh={reloadWindow}
            projectId={project.id}
          />
          <p className="projectIssue">Project Issues</p>
          <div className="projectIssueSvgContainer">
            {readyToBill && (
              <Tooltip title="Ready to bill">
                <ReadyToBill
                  id="readyToBill"
                  onClick={(e) => {
                    handleClickedIssue(e);
                    handlePopoverOpen(e);
                  }}
                  style={{ fill: "#4196CB", height: "24px", cursor: "pointer" }}
                />
              </Tooltip>
            )}

            {unitsNeedPricing && (
              <Tooltip title="Units need pricing">
                <UnitsNeedPricing
                  id="unitsNeedPricing"
                  onClick={(e) => {
                    handleClickedIssue(e);
                    handlePopoverOpen(e);
                  }}
                  style={{ fill: "#E36767", height: "24px", cursor: "pointer" }}
                />
              </Tooltip>
            )}

            {actualValueGreaterThenPlanned && (
              <Tooltip title="Actual value greater than planned">
                <ActualVsPlanned
                  id="actualValueGreaterThenPlanned"
                  onClick={(e) => {
                    handleClickedIssue(e);
                    handlePopoverOpen(e);
                  }}
                  style={{
                    fill: "#E36767",
                    height: "24px",
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            )}

            {failedInspection && (
              <Tooltip title="Failed inspection reports">
                <FailedInspection
                  id="failedInspection"
                  onClick={(e) => {
                    handleClickedIssue(e);
                    handlePopoverOpen(e);
                  }}
                  style={{ fill: "#E36767", height: "24px", cursor: "pointer" }}
                />
              </Tooltip>
            )}

            {failedSafetyReports && (
              <Tooltip title="Failed safety reports">
                <FailedSafetyReports
                  id="failedSafetyReports"
                  onClick={(e) => {
                    handleClickedIssue(e);
                    handlePopoverOpen(e);
                  }}
                  style={{
                    fill: "#E36767",
                    stroke: "#E36767",
                    height: "24px",
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            )}

            <Popover
              anchorEl={anchorEl}
              className={classes.popupContainer}
              open={Boolean(anchorEl)}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              onClose={handlePopoverClose}
            >
              <Grid container style={{ width: 450 }}>
                <Grid
                  item
                  xs={12}
                  container
                  className={classes.popupHeader}
                  alignItems="center"
                >
                  <Grid item xs={8}>
                    <Typography className={classes.popupLabelHeader}>
                      Project Issues
                    </Typography>
                  </Grid>
                  <Grid item xs={3} container justify="center">
                    <img
                      src={CrossSmall}
                      alt="Close"
                      style={{ cursor: "pointer", marginLeft: "150px" }}
                      onClick={handlePopoverClose}
                    />
                  </Grid>
                </Grid>
                {unitsNeedPricing && clickedIssue === "unitsNeedPricing" && (
                  <Grid
                    item
                    xs={12}
                    container
                    className={classes.popupSection}
                    alignItems="center"
                  >
                    <Grid item xs={2}>
                      <UnitsNeedPricing fill="#E36767" />
                    </Grid>
                    <Grid item xs={7}>
                      <Typography className={classes.popupLabels}>
                        Units need pricing
                      </Typography>
                    </Grid>
                    <Grid item xs={3} justify="center" container>
                      <Typography
                        className={classes.view}
                        onClick={() => {
                          getCipUnits();
                          setOpenUnitsNeedPricingModal(true);
                        }}
                      >
                        View
                      </Typography>
                    </Grid>
                  </Grid>
                )}
                {actualValueGreaterThenPlanned &&
                  clickedIssue === "actualValueGreaterThenPlanned" && (
                    <Grid
                      item
                      xs={12}
                      container
                      className={classes.popupSection}
                      alignItems="center"
                    >
                      <Grid item xs={2}>
                        <ActualVsPlanned fill="#E36767" />
                      </Grid>
                      <Grid item xs={7}>
                        <Typography className={classes.popupLabels}>
                          {`Actual Value > Planned Value`}
                        </Typography>
                      </Grid>
                      <Grid item xs={3} justify="center" container>
                        <Typography
                          className={classes.view}
                          onClick={goToProject.bind(
                            this,
                            _.get(project, "id"),
                            null,
                            null
                          )}
                        >
                          View
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
              </Grid>
            </Popover>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectIssues;
