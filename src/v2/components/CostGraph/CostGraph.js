import { Paper, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import skull from "../../../assets/v2/Skull.svg";
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
    [theme.breakpoints.down(1250)]: {
      width: "100%",
      marginRight: "2%",
    },
  },

  title: {
    width: "32%",
    fontSize: "18px",
    fontWeight: "600",
    color: "#113C23",
    paddingLeft: "6%",
  },
}));

const CostGraph = ({ projectsData }) => {
  const classes = useStyles();
  const [amountPlannedData, setAmountPlannedData] = useState([]);
  const [amountCompletedData, setAmountCompletedData] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [remainingRevenue, setRemainingRevenue] = useState([]);
  const [revenueOverPlan, setRevenueOverPlan] = useState([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [chartInstance, setChartInstance] = useState(null);
  const [loading, setLoading] = useState(true);

  const chartHeight = screenWidth < 1250 ? 120 : 200;

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    let plannedData = projectsData.map((data, index) => {
      return data.planned_value || 0;
    });

    const completedData = projectsData.map((data) => {
      return data.actual_value || 0;
    });

    let deltaData = projectsData.map((data) => {
      return (data.planned_value || 0) - (data.actual_value || 0);
    });

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
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, [projectsData]);

  const options = {
    layout: {
      padding: {
        top: 10,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 0,
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
        min: 0,
        max:
          Math.max(...amountPlannedData, ...amountCompletedData) +
          (Math.max(...amountPlannedData, ...amountCompletedData) > 1000000
            ? 100000
            : 100000),
        ticks: {
          count: 11,
          display: projectNames.length <= 6,
          callback: function (value) {
            if (value <= 999) return `$ ${Math.floor(value)}`;

            if (value <= 999999) return `$ ${Math.floor(value / 1000)}k`;

            return `$ ${(value / 1000000).toFixed(2)}m`;
          },
          color: "#123C23",
          font: {
            size: 12,
            family: "Arial, sans-serif",
          },
        },
        grid: {
          drawTicks: projectNames.length <= 6,
          drawBorder: projectNames.length <= 6,
          color: "#DCF4EE",
        },
      },
    },

    plugins: {
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
          if (value !== null) {
            if (value <= 999) return `$ ${value.toFixed(2)}`;

            if (value <= 999999) return `$ ${(value / 1000).toFixed(2)}k`;

            return `$ ${(value / 1000000).toFixed(2)}m`;
          }
        },
      },
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
            label += "$" + Math.abs(context.raw).toLocaleString();
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

  const options2 = {
    layout: {
      padding: {
        bottom: 44,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          display: false,
        },
        grid: {
          drawTicks: false,
          borderColor: "#DCF4EE",
          color: "#DCF4EE",
        },
      },

      y: {
        min: 0,
        max:
          Math.max(...amountPlannedData, ...amountCompletedData) +
          (Math.max(...amountPlannedData, ...amountCompletedData) > 1000000
            ? 1000000
            : 100000),

        afterFit: (c) => {
          c.width = 80;
        },
        ticks: {
          count: 11,
          callback: function (value) {
            if (value <= 999) return `$ ${Math.floor(value)}`;

            if (value <= 999999) return `$ ${Math.floor(value / 1000)}k`;

            return `$ ${(value / 1000000).toFixed(2)}m`;
          },
          color: "#123C23",
          font: {
            size: 12,
            family: "Arial, sans-serif",
          },
        },
        grid: {
          borderColor: "#DCF4EE",
          color: "#DCF4EE",
        },
      },
    },

    plugins: {
      datalabels: { display: false },
      legend: {
        display: false,
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
      },
      {
        label: "Revenue Over Plan",
        type: "bar",
        backgroundColor: "#5E9875",
        hoverBackgroundColor: "#5E9875",
        data: revenueOverPlan,
        barThickness: 18,
      },
    ],
  };

  useEffect(() => {
    if (chartInstance) {
      const legendContainer = document.getElementById("legend");
      if (legendContainer) {
        legendContainer.innerHTML = chartInstance.generateLegend();

        const legendItems = legendContainer.getElementsByTagName("li");
        for (let i = 0; i < legendItems.length; i++) {
          legendItems[i].addEventListener("click", () => {
            const dataset = chartInstance.data.datasets[i];
            dataset.hidden = !dataset.hidden;
            chartInstance.update();
          });
        }
      }
    }
  }, [chartInstance]);

  return (
    <>
      <Paper className={classes.paper}>
        <div className="topBarContainer">
          <h2 className={classes.title}>Plan vs Actual Cost</h2>
          <div id="legend"></div>
        </div>

        {projectsData.length === 0 && !loading ? (
          <>
            <div className="costChartNoData">
              <img
                src={skull}
                alt="default"
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 40,
                }}
              />
              <p style={{ marginTop: "0px" }}>No data</p>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", width: "100%" }}>
            {projectNames.length > 6 && (
              <div style={{ width: "80px", marginRight: "-3px" }}>
                <Line
                  key={chartHeight}
                  options={options2}
                  height={chartHeight}
                />
              </div>
            )}

            <div
              style={{
                width: `${
                  projectNames.length <= 6
                    ? "calc(100% - 0px)"
                    : "calc(100% - 80px)"
                }`,
                overflowX: `${projectNames.length <= 6 ? "hidden" : "auto"}`,
                paddingLeft: `${projectNames.length <= 6 ? "30px" : "0px"}`,
              }}
            >
              <div
                style={{
                  minWidth: "100%",
                  width: `${projectNames.length * 80}px`,
                  height: "400px",
                  paddingBottom: `${projectNames.length <= 6 ? "0px" : "10px"}`,
                }}
              >
                <Line
                  key={chartHeight}
                  ref={(ref) => setChartInstance(ref)}
                  data={data}
                  options={options}
                  height={chartHeight}
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
          </div>
        )}
      </Paper>
    </>
  );
};

export default CostGraph;
