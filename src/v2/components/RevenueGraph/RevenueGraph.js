import { Paper, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import moment from "moment";
import _ from "lodash";
import "./styles.css";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "42.8%",
    borderRadius: 10,
    paddingTop: 0,
    padding: "2%",
    boxShadow: "none",
    margin: "2%",
    marginRight: 0,
    [theme.breakpoints.down(1250)]: {
      width: "100%",
      marginRight: "2%",
    },
  },
  title: {
    width: "35%",
    fontSize: "18px",
    fontWeight: "600",
    color: "#113C23",
  },
}));

const RevenueGraph = ({ projectsData }) => {
  const classes = useStyles();
  const [monthsLabel, setMonthsLabel] = useState([]);
  const [amountCompletedData, setAmountCompletedData] = useState([]);
  const [amountPlannedData, setAmountPlannedData] = useState([]);
  const [actualRevenue, setActualRevenue] = useState([]);
  const [forecastRevenue, setForecastRevenue] = useState([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [chartInstance, setChartInstance] = useState(null);

  const chartHeight = screenWidth < 1250 ? 120 : 200;

  const months = [
    "jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonth = Number(moment(new Date()).format("MM"));

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
    const plannedData = projectsData.map((data, index) => {
      return data.planned_value;
    });

    const completedData = projectsData.map((data) => {
      return data.actual_value;
    });

    const forecastMonth = projectsData.map((data) => {
      return Number(
        moment(_.defaultTo(_.get(data, "pactual_end_date"))).format("MM")
      );
    });

    let tempSum = {};

    forecastMonth.map((month, index) => {
      if (month <= currentMonth) {
        tempSum[month] = (tempSum[month] || 0) + completedData[index];
      } else {
        tempSum[month] = (tempSum[month] || 0) + plannedData[index];
      }
    });

    let tempPlannedData = [];
    let tempCompletedData = [];
    let tempActualRevenue = [];
    let tempForecastRevenue = [];

    const minMonth = Math.min(...forecastMonth);
    const maxMonth = Math.max(...forecastMonth);

    var sum = 0;

    for (let i = minMonth; i <= maxMonth; i++) {
      sum = sum + tempSum[i];
      if (i <= currentMonth) {
        tempCompletedData.push(tempSum[i]);
        tempPlannedData.push(null);

        if (i === currentMonth) {
          tempActualRevenue.push(sum);
          tempForecastRevenue.push(sum);
        } else {
          tempActualRevenue.push(sum);
          tempForecastRevenue.push(null);
        }
      } else {
        tempCompletedData.push(null);
        tempPlannedData.push(tempSum[i]);

        tempActualRevenue.push(null);
        tempForecastRevenue.push(sum);
      }
    }

    setActualRevenue(tempActualRevenue);
    setForecastRevenue(tempForecastRevenue);
    setAmountCompletedData(tempCompletedData);
    setAmountPlannedData(tempPlannedData);
    setMonthsLabel(months.slice(minMonth - 1, maxMonth));
  }, [projectsData]);

  const options = {
    layout: {
      padding: {
        top: 20,
      },
    },
    scales: {
      x: {
        offset: true,
        ticks: {
          color: "#417E5A",
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
        position: "left",
        ticks: {
          count: 11,
          callback: function (value) {
            if (value <= 999) return "$" + value;

            if (value <= 999999) return "$ " + value / 1000 + "k";

            return "$" + value / 1000000 + "m";
          },
          color: "#123C23",
          font: {
            size: 12,
            family: "Arial, sans-serif",
          },
        },
        grid: {
          color: "#DCF4EE",
        },
      },
    },

    plugins: {
      htmlLegend: {
        containerID: "custom-legend2",
      },
      legend: {
        display: false,
      },

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
        formatter: (value, context) => {
          let label = context.dataset.label || "";
          let index = context.dataIndex;
          let month = monthsLabel[index];

          if (
            label === "Forecast Revenue" &&
            month === months[currentMonth - 1]
          ) {
            return null;
          }

          if (value !== null) {
            if (value <= 999) return `$ ${value.toFixed(2)}`;

            if (value <= 999999) return `$ ${(value / 1000).toFixed(2)}k`;

            return `$ ${(value / 1000000).toFixed(2)}m`;
          }
        },
      },

      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            let month = context.label || "";
            if (
              label === "Forecast Revenue" &&
              month === months[currentMonth - 1]
            ) {
              return;
            }

            if (label) {
              label += ": ";
            }
            label += "$" + context.raw.toLocaleString();
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
    labels: monthsLabel,
    datasets: [
      {
        label: "Actual Revenue",
        borderColor: "#113C23",
        data: actualRevenue,
        pointBackgroundColor: "#C2E9A0",
        pointHoverBackgroundColor: "#C2E9A0",
        pointBorderColor: "#113C23",
        pointHoverRadius: 3,
      },

      {
        label: "Forecast Revenue",
        borderColor: "#113C23",
        data: forecastRevenue,
        pointBackgroundColor: "#FBFBFB",
        pointBorderColor: "#113C23",
        pointHoverRadius: 3,
        borderDash: [5, 3],
      },

      {
        label: "Amount Completed",
        type: "bar",
        backgroundColor: "#5E9875",
        data: amountCompletedData,
        barThickness: 18,
        datalabels: {
          display: false,
        },
      },

      {
        label: "Amount Planned",
        type: "bar",
        backgroundColor: "#C2E9A0",
        data: amountPlannedData,
        barThickness: 18,
        datalabels: {
          display: false,
        },
      },
    ],
  };

  useEffect(() => {
    if (chartInstance) {
      const legendContainer = document.getElementById("legend2");
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
    <Paper className={classes.paper}>
      <div className="topBarContainer">
        <h2 className={classes.title}>Revenue Forecast</h2>
        <div id="legend2"></div>
      </div>
      <div>
        <Line
          ref={(ref) => setChartInstance(ref)}
          key={chartHeight}
          data={data}
          options={options}
          height={chartHeight}
          plugins={[
            {
              id: "custom-legend2",
              beforeInit: function (chart) {
                chart.generateLegend = function () {
                  const datasets = this.data.datasets;
                  let legendHtml = '<ul class="custom-legend2">';

                  datasets.forEach((dataset, index) => {
                    legendHtml += `
                    <li>
                      <div class="legendSymbol">
                      <span class="legendSymbolSpan1"></span>
                      <span class="legendSymbolSpan2"></span>
                      </div>
                     <p class="legendText"> ${dataset.label} <br/> ${
                      index === 0
                        ? `<span class='legendSubText'>(Cumulative Values)</span>`
                        : ""
                    }
                    ${
                      index === 1
                        ? `<span class='legendSubText'>(Isolative Values)</span>`
                        : ""
                    }
                    </p>
                      
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
    </Paper>
  );
};

export default RevenueGraph;
