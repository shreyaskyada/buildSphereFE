import { Grid, makeStyles, MenuItem, Select } from "@material-ui/core";
import ArrowDown from "../../../assets/v2/ArrowDown.svg";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  arrowContainer: {
    backgroundColor: "#E5FAE7",
    height: 18,
    width: 18,
    borderRadius: "50%",
    pointerEvents: "none",
    position: "absolute",
    right: "10px",
  },
  chooseCustSelect: {
    marginLeft: "2%",
    height: "32px",
    fontWeight: 500,
    fontSize: "12px",
    paddingLeft: "10px",
    fontFamily: "Manrope",
    width: "120px",
    backgroundColor: "white",
    "& .MuiSelect-select": {
      backgroundColor: "white",
      "&:focus": {
        backgroundColor: "white",
      },
    },
  },

  menulabels: {
    fontFamily: "Manrope",
    fontWeight: 500,
    backgroundColor: theme.v2.backgrounds.whiteBackground,
    fontSize: 14,
    color: theme.v2.fonts.colors.blackShade1,
  },
}));

const ProjectFilter = ({ projectsData, filters, setFilters }) => {
  const [selectedValue, setSelectedValue] = useState("0");
  const [projectsByContract, setProjectsByContract] = useState({});
  const [filterProjects, setFilterProjects] = useState([]);
  const [project, setProject] = useState("0");
  const classes = useStyles();

  useEffect(() => {
    if (filters?.contract && filters.contract !== "0") {
      if (!projectsByContract?.[filters?.contract]) {
        const tempContracts = projectsData.filter((project) => {
          return project.contract_id === filters?.contract;
        });
        setProjectsByContract((prev) => {
          return {
            ...prev,
            [filters?.contract]: tempContracts,
          };
        });
        setFilterProjects([...tempContracts]);
      } else {
        setFilterProjects([...projectsByContract[filters?.contract]]);
      }
    } else {
      setFilterProjects([...projectsData]);
    }
  }, [filters, projectsData]);

  useEffect(() => {
    if (filters?.project === "0") setSelectedValue("0");
  }, [filters]);

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 320,
        maxWidth: 200,
        minWidth: 130,
        marginTop: 50,
        marginLeft: -10,
      },
    },
  };

  return (
    <div style={{ marginLeft: "10px" }}>
      <Select
        variant="standard"
        className={classes.chooseCustSelect}
        style={{ color: `${selectedValue !== "0" ? "#113C23" : "#84A391"}` }}
        IconComponent={() => {
          return (
            <Grid
              className={classes.arrowContainer}
              container
              justify="center"
              alignItems="center"
            >
              <img src={ArrowDown} alt="Down" style={{ height: "4px" }} />
            </Grid>
          );
        }}
        onChange={(e) => {
          setSelectedValue(e.target.value);
          setProject(e.target.value);
          setFilters({ ...filters, project: e.target.value });
        }}
        value={filters?.project || project}
        defaultValue={"0"}
        MenuProps={MenuProps}
      >
        {[
          <MenuItem key={-1} value={"0"} className={classes.menulabels}>
            Project
          </MenuItem>,
          ...filterProjects.map((project, index) => {
            return (
              <MenuItem
                key={index}
                value={project.id}
                className={classes.menulabels}
              >
                {project.project_name}
              </MenuItem>
            );
          }),
        ]}
      </Select>
    </div>
  );
};

export default ProjectFilter;
