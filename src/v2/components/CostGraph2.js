import { Paper, makeStyles } from "@material-ui/core";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

import ChartDataLabels from "chartjs-plugin-datalabels";
import Chart from "chart.js/auto";

Chart.register(ChartDataLabels);

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

const CostGraph2 = ({ projectsData }) => {
  const classes = useStyles();
  const [amountPlannedData, setAmountPlannedData] = useState([]);
  const [amountCompletedData, setAmountCompletedData] = useState([]);

  const [projectNames, setProjectNames] = useState([]);
  const [remainingRevenue, setRemainingRevenue] = useState([]);
  const [revenueOverPlan, setRevenueOverPlan] = useState([]);

  useEffect(() => {
    let plannedData = projectsData.map((data, index) => {
      return data.planned_value / 1000;
    });

    const completedData = projectsData.map((data) => {
      return data.actual_value / 1000;
    });

    let deltaData = projectsData.map((data) => {
      return (data.planned_value - data.actual_value) / 1000;
    });

    deltaData[2] = -900;

    const remaining_revenue = deltaData.map((delta) => {
      if (delta > 0) return delta;

      return null;
    });

    const revenue_over_plan = deltaData.map((delta) => {
      if (delta < 0) return Math.abs(delta);

      return null;
    });

    const projectName = projectsData.map((data) => {
      return data.project_name;
    });

    setAmountPlannedData(plannedData);
    setAmountCompletedData(completedData);

    setRemainingRevenue(remaining_revenue);
    setRevenueOverPlan(revenue_over_plan);
    setProjectNames(projectName);
  }, [projectsData]);

  const options = {
    annotation: {
      annotations: [
        {
          type: "line",
          mode: "horizontal",
          scaleID: "y",
          value: 5,
          borderColor: "rgb(75, 192, 192)",
          borderWidth: 4,
          label: {
            enabled: false,
            content: "Test label",
          },
        },
      ],
    },
    responsive: true,
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          color: "#417E5A",
          font: {
            size: 7,
          },
        },
        grid: {
          color: "#DCF4EE",
        },
      },

      y: {
        position: "left",
        ticks: {
          count: 11,
          callback: function (value) {
            return "$ " + Math.abs(Math.floor(value)) + "k";
          },
          color: "#417E5A",
          font: {
            size: 9,
          },
        },
        grid: {
          display: true,
          color: "#DCF4EE",
        },
      },

      y1: {
        position: "right",
        ticks: {
          count: 11,
          callback: function (value) {
            return "$ " + Math.floor(value) + "k";
          },
          color: "#417E5A",
          font: {
            size: 9,
          },
        },
        grid: {
          display: false,
          color: "#DCF4EE",
        },
      },
    },

    plugins: {
      datalabels: {
        display: false,
        color: "#123C23",
        font: {
          size: 10,
          weight: "bold",
        },
        anchor: "end",
        offset: -20,
        align: "start",
        formatter: (value) => {
          return `$ ${Math.floor(value)}k`;
        },
      },

      legend: {
        align: "end",
        labels: {
          boxWidth: 17,
          boxHeight: 17,
        },
      },

      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            label += "$" + (context.raw * 1000).toLocaleString();
            return label;
          },
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
    labels: projectNames,
    datasets: [
      {
        label: "Amount Completed",
        borderColor: "#123C23",
        data: amountCompletedData,

        pointBackgroundColor: "#0CA14A",
        pointBorderColor: "#123C23",
        datalabels: {
          display: false,
        },
      },
      {
        label: "Amount Planned",
        borderColor: "#5E9875",
        data: amountPlannedData,
        yAxisID: "y1",
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: "#5E9875",
        borderDash: [5, 3],
        datalabels: {
          display: false,
        },
      },
      {
        label: "Remaining Revenue",
        type: "bar",
        backgroundColor: "#C2E9A0",
        data: remainingRevenue,
        yAxisID: "y1",
        barThickness: 18,
      },
      {
        label: "Revenue Over Plan",
        type: "bar",
        backgroundColor: "#5E9875",
        data: revenueOverPlan,
        yAxisID: "y1",
        barThickness: 18,
      },
    ],
  };

  return (
    <Paper className={classes.paper}>
      <h2 className={classes.title}>Plan vs Actual Cost</h2>
      <Line data={data} options={options} height={170} />
    </Paper>
  );
};

export default CostGraph2;
