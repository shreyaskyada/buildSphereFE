import { Paper, makeStyles } from "@material-ui/core";
import React from "react";
import { Line } from "react-chartjs-2";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "42.8%",
    borderRadius: 10,
    padding: "2%",
    paddingTop: 0,
    boxShadow: "none",
    margin: "2%",
    marginRight: 0,
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#113C23",
  },
}));

const options = {
  responsive: true,
  scales: {
    x: {
      ticks: {
        color: "#417E5A",
        font: {
          size: 9,
        },
      },
      grid: {
        color: "#DCF4EE",
      },
    },

    y: {
      min: 0,
      max: 100,
      position: "left",
      ticks: {
        callback: function (value, index, values) {
          return "$ " + value + "k";
        },
        color: "#417E5A",
        font: {
          size: 9,
        },
      },
      grid: {
        color: "#DCF4EE",
      },
    },

    y1: {
      min: -30,
      max: 70,
      position: "right",
      ticks: {
        callback: function (value, index, values) {
          return "$ " + value + "k";
        },
        color: "#417E5A",
        font: {
          size: 9,
        },
      },
      grid: {
        color: "#DCF4EE",
      },
    },
  },

  plugins: {
    legend: {
      labels: {
        boxWidth: 17,
        boxHeight: 17,
      },
    },
  },

  elements: {
    line: {
      borderWidth: 1.5,
    },
  },
};

const data = {
  labels: [
    "Project 1",
    "Project 2",
    "Project 3",
    "Project 4",
    "Project 5",
    "Project 6",
    "Project 7",
  ],
  datasets: [
    {
      label: "Delta",
      fill: false,
      borderColor: "#113C23",
      data: [34, -16, 63, 53, 34, 52, 3],
      yAxisID: "y1",
    },
    {
      label: "Amount Completed",
      type: "bar",
      backgroundColor: "#417E5A",
      data: [45, 88, 32, 12, 8, 4, 23],
      barThickness: 18,
    },
    {
      label: "Amount Planned",
      type: "bar",
      backgroundColor: "#C2E9A0",
      data: [80, 72, 98, 63, 42, 52, 34],
      barThickness: 18,
    },
  ],
};

const CostGraph = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <h2 className={classes.title}>Plan vs Actual Cost</h2>

      <Line data={data} options={options} height={170} />
    </Paper>
  );
};

export default CostGraph;
