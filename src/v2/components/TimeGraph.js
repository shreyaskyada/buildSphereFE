import { Paper, makeStyles } from "@material-ui/core";
import React from "react";
import { Bar } from "react-chartjs-2";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "42.8%",
    borderRadius: 10,
    padding: "2%",
    paddingTop: 0,
    boxShadow: "none",
    margin: "2%",
    marginRight: 0,
    marginTop: 0,
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#113C23",
  },
}));

const options = {
  responsive: true,
  indexAxis: "y",
  scales: {
    x: {
      min: -200,
      max: 200,
      position: "left",
      ticks: {
        callback: function (value, index, values) {
          return value + "%";
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

    y: {
      reverse: true,
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
    "Project 8",
  ],
  datasets: [
    {
      label: "% Completed",
      type: "bar",
      backgroundColor: "#417E5A",
      data: [56, 123, 34, 23, 19, 5, 92, 63],
      datalabels: {
        display: false,
      },
    },
    {
      label: "Time Remaining",
      type: "bar",
      backgroundColor: "#C2E9A0",
      data: [-127, -118, -178, -33, -22, -87, -64, -62],
      datalabels: {
        display: false,
      },
    },
  ],
};

const TimeGraph = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <h2 className={classes.title}>Time Left vs % $ Complete</h2>
      <Bar data={data} options={options} height={170} />
    </Paper>
  );
};

export default TimeGraph;
