import { Paper, makeStyles } from "@material-ui/core";
import React from "react";
import { Line } from "react-chartjs-2";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "42.8%",
    borderRadius: 10,
    paddingTop: 0,
    padding: "2%",
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
      offset: true,
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
      max: 200,
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
  labels: ["Feb", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Actual Revenue",
      borderColor: "#113C23",
      data: [20, 60, 80, 100],
      pointBackgroundColor: "#C2E9A0",
      pointBorderColor: "#113C23",
      datalabels: {
        display: false,
      },
    },

    {
      label: "Forecast Revenue",
      borderColor: "#113C23",
      data: [null, null, null, 100, 140, 165],
      pointBackgroundColor: "#FBFBFB",
      pointBorderColor: "#113C23",
      borderDash: [5, 3],
      datalabels: {
        display: false,
      },
    },
  ],
};

const RevenueGraph = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <h2 className={classes.title}>Revenue Forecast</h2>
      <Line data={data} options={options} height={170} />
    </Paper>
  );
};

export default RevenueGraph;
