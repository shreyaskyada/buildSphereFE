import { Paper, makeStyles } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "chart.js";
import "./styles.css";

Chart.register(ChartDataLabels);

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "44.8%",
    borderRadius: 10,
    padding: "2%",
    paddingLeft: 0,
    paddingTop: 0,
    boxShadow: "none",
    margin: "2%",
    marginRight: 0,
  },

  title: {
    width: "32%",
    fontSize: "18px",
    fontWeight: "600",
    color: "#113C23",
    paddingLeft: "6%",
  },

  revenueOverPlaneWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  revenueOverPlaneLabel: {
    color: "#417E5A",
    fontSize: "9px",
    fontWeight: 600,
    transform: "rotate(-90deg)",
  },

  remainingRevenueWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "200%",
  },

  remainingRevenueLabel: {
    color: "#417E5A",
    fontSize: "9px",
    fontWeight: 600,
    transform: "rotate(-90deg)",
  },
}));

const CostGraph = ({ projectsData }) => {
  const classes = useStyles();
  const [amountPlannedData, setAmountPlannedData] = useState([]);
  const [amountCompletedData, setAmountCompletedData] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [remainingRevenue, setRemainingRevenue] = useState([]);
  const [revenueOverPlan, setRevenueOverPlan] = useState([]);
  const chartRef = useRef(null);

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

    const remaining_revenue = deltaData.map((delta) => {
      if (delta > 0) return delta;

      return null;
    });

    const revenue_over_plan = deltaData.map((delta) => {
      if (delta < 0) return delta;

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
    responsive: true,
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          color: "#123C23",
          font: {
            size: 9,
            family: "Arial, sans-serif",
          },
        },
        grid: {
          color: "#DCF4EE",
        },
      },

      y: {
        min: (Math.max(...remainingRevenue) + 500) * -1,
        max: Math.max(...remainingRevenue) + 500,
        position: "left",
        reverse: true,

        ticks: {
          count: 11,
          callback: function (value) {
            return "$ " + Math.abs(Math.floor(value)) + "k";
          },

          color: "#123C23",
          font: {
            size: 12,
            family: "Arial, sans-serif",
          },
        },

        grid: {
          display: true,
          color: (context) => {
            return context.tick.value === 0 ? "#A5C4C9" : "#DCF4EE";
          },
        },
      },

      y1: {
        position: "right",
        min: 0,
        max: Math.max(...amountPlannedData) + 500,
        ticks: {
          count: 11,
          callback: function (value) {
            return "$ " + Math.floor(value) + "k";
          },
          color: "#123C23",
          font: {
            size: 12,
            family: "Arial, sans-serif",
          },
        },
        grid: {
          display: false,
          color: "#DCF4EE",
        },
      },
    },

    plugins: {
      htmlLegend: {
        containerID: "custom-legend",
      },
      legend: {
        display: false,
      },

      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            label += "$" + Math.abs(context.raw * 1000).toLocaleString();
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
        yAxisID: "y1",
        pointBackgroundColor: "#0CA14A",
        pointHoverBackgroundColor: "#0CA14A",
        pointHoverRadius: 3,
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
        pointHoverRadius: 3,
        borderDash: [5, 3],
        datalabels: {
          display: false,
        },
      },
      {
        label: "Remaining Revenue",
        type: "bar",
        backgroundColor: "#C2E9A0",
        hoverBackgroundColor: "#C2E9A0",
        data: remainingRevenue,
        barThickness: 18,
        datalabels: {
          display: true,
          color: "#113C23",
          font: {
            size: 12,
            weight: "bold",
            family: "Manrope, sans-serif",
          },
          anchor: "start",
          offset: -20,
          align: "end",
          formatter: (value) => {
            if (value !== null) return `$ ${Math.floor(value)}k`;
          },
        },
      },
      {
        label: "Revenue Over Plan",
        type: "bar",
        backgroundColor: "#5E9875",
        hoverBackgroundColor: "#5E9875",
        data: revenueOverPlan,
        barThickness: 18,
        datalabels: {
          display: true,
          color: "#113C23",
          font: {
            size: 12,
            weight: "bold",
            family: "Manrope, sans-serif",
          },
          anchor: "end",
          offset: -20,
          align: "start",
          formatter: (value) => {
            if (value !== null) return `$ ${Math.abs(Math.floor(value))}k`;
          },
        },
      },
    ],
  };

  useEffect(() => {
    const chart = chartRef.current;

    if (chart) {
      const legendContainer = document.getElementById("legend");

      if (legendContainer) {
        legendContainer.innerHTML = chart.generateLegend();

        const legendItems = legendContainer.getElementsByTagName("li");
        for (let i = 0; i < legendItems.length; i++) {
          legendItems[i].addEventListener("click", () => {
            const dataset = chart.data.datasets[i];
            dataset.hidden = !dataset.hidden;
            chart.update("active");
          });
        }
      }
    }
  }, [chartRef.current]);

  return (
    <Paper className={classes.paper}>
      <div className="topBarContainer">
        <h2 className={classes.title}>Plan vs Actual Cost</h2>
        <div id="legend"></div>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ width: "8%", paddingTop: "5%" }}>
          <div className={classes.revenueOverPlaneWrapper}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              shape-rendering="geometricPrecision"
              text-rendering="geometricPrecision"
              image-rendering="optimizeQuality"
              fill-rule="evenodd"
              clip-rule="evenodd"
              viewBox="0 0 404 511.5"
              fill="#417E5A"
              style={{ height: "12px" }}
            >
              <path
                fill-rule="nonzero"
                d="m219.24 72.97.54 438.53h-34.95l-.55-442.88L25.77 241.96 0 218.39 199.73 0 404 222.89l-25.77 23.58z"
              />
            </svg>
            <p className={classes.revenueOverPlaneLabel}>Revenue Over Plan</p>
          </div>
          <div className={classes.remainingRevenueWrapper}>
            <p className={classes.remainingRevenueLabel}>Remaining Revenue</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              shape-rendering="geometricPrecision"
              text-rendering="geometricPrecision"
              image-rendering="optimizeQuality"
              fill-rule="evenodd"
              clip-rule="evenodd"
              viewBox="0 0 404 511.51"
              fill="#417E5A"
              style={{ height: "12px" }}
            >
              <path
                fill-rule="nonzero"
                d="M184.29 442.88 184.83 0h34.95l-.54 438.53 158.99-173.49L404 288.61l-204.27 222.9L0 293.11l25.77-23.57z"
              />
            </svg>
          </div>
        </div>
        <div style={{ width: "92%" }}>
          <Line
            ref={chartRef}
            data={data}
            options={options}
            height={200}
            plugins={[
              {
                id: "custom-legend",
                beforeInit: function (chart) {
                  chart.generateLegend = function () {
                    const datasets = this.data.datasets;
                    let legendHtml = '<ul class="custom-legend">';

                    datasets.forEach((dataset, index) => {
                      legendHtml += `
                      <li>
                        <div class="legendSymbol">
                        <span class="legendSymbolSpan1"></span>
                        <span class="legendSymbolSpan2"></span>
                        </div>
                       <p class="legendText"> ${dataset.label}</p>
                      </li>
                    `;
                    });

                    legendHtml += "</ul>";
                    return legendHtml;
                  };
                },
              },
            ]}
          />
        </div>
      </div>
    </Paper>
  );
};

export default CostGraph;
