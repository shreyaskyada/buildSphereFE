import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Paper, makeStyles } from "@material-ui/core";

const tableHead = [
  "Project Name",
  "Project Significance",
  "Schedule Performance",
  "Cost Performance",
  "Quality Performance",
  "Safety Performance",
];

const rows = [
  {
    "project name": "Lanc 12",
    "project significance": "$25.5",
    "schedule performance": "12.4%",
    "cost performance": "11.0%",
    "quality performance": "11.9%",
    "safety performance": "12.4",
  },
  {
    "project name": "Lanc 12",
    "project significance": "$25.5",
    "schedule performance": "12.4%",
    "cost performance": "11.0%",
    "quality performance": "11.9%",
    "safety performance": "12.4",
  },
  {
    "project name": "Lanc 12",
    "project significance": "$25.5",
    "schedule performance": "12.4%",
    "cost performance": "11.0%",
    "quality performance": "11.9%",
    "safety performance": "12.4",
  },
  {
    "project name": "Lanc 12",
    "project significance": "$25.5",
    "schedule performance": "12.4%",
    "cost performance": "11.0%",
    "quality performance": "11.9%",
    "safety performance": "12.4",
  },
  {
    "project name": "Lanc 12",
    "project significance": "$25.5",
    "schedule performance": "12.4%",
    "cost performance": "11.0%",
    "quality performance": "11.9%",
    "safety performance": "12.4",
  },
  {
    "project name": "Lanc 12",
    "project significance": "$25.5",
    "schedule performance": "12.4%",
    "cost performance": "11.0%",
    "quality performance": "11.9%",
    "safety performance": "12.4",
  },
  {
    "project name": "Lanc 12",
    "project significance": "$25.5",
    "schedule performance": "12.4%",
    "cost performance": "11.0%",
    "quality performance": "11.9%",
    "safety performance": "12.4",
  },
  {
    "project name": "Lanc 12",
    "project significance": "$25.5",
    "schedule performance": "12.4%",
    "cost performance": "11.0%",
    "quality performance": "11.9%",
    "safety performance": "12.4",
  },
  {
    "project name": "Lanc 12",
    "project significance": "$25.5",
    "schedule performance": "12.4%",
    "cost performance": "11.0%",
    "quality performance": "11.9%",
    "safety performance": "12.4",
  },
  {
    "project name": "Lanc 12",
    "project significance": "$25.5",
    "schedule performance": "12.4%",
    "cost performance": "11.0%",
    "quality performance": "11.9%",
    "safety performance": "12.4",
  },
];

const cellStyles = {
  paddingY: "5px",
  paddingX: "9px",
  fontSize: "10px",
  color: "#417E5A",
  borderColor: "#DCF4EE",
};

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
  },

  title: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#113C23",
  },
}));

const PerformersTable = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <h2 className={classes.title}>Bottom Performers</h2>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            {tableHead.map((th) => {
              return (
                <TableCell
                  sx={{
                    padding: "10px",
                    fontSize: "10px",
                    paddingY: "10px",
                    color: "#417E5A",
                    borderColor: "#DCF4EE",
                  }}
                >
                  {th}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={row["project name"] + index}
              sx={{ border: "1px solid #DCF4EE" }}
            >
              <TableCell sx={cellStyles}>{row["project name"]}</TableCell>
              <TableCell
                sx={{
                  paddingY: "5px",
                  paddingX: "9px",
                  paddingLeft: "20px",
                  fontSize: "10px",
                  color: "#417E5A",
                  borderColor: "#DCF4EE",
                }}
              >
                {row["project significance"]}
              </TableCell>
              <TableCell sx={cellStyles}>
                {row["schedule performance"]}
              </TableCell>
              <TableCell sx={cellStyles}>{row["cost performance"]}</TableCell>
              <TableCell sx={cellStyles}>
                {row["quality performance"]}
              </TableCell>
              <TableCell sx={cellStyles}>{row["safety performance"]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default PerformersTable;
