import { Paper, makeStyles } from "@material-ui/core";
import _ from "lodash";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import "./styles.css";

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
    fontSize: "18px",
    fontWeight: "600",
    color: "#113C23",
  },
}));

const TimeGraph = ({ projectsData }) => {
  const [projectNames, setProjectNames] = useState([]);
  const [remainingRevenue, setRemainingRevenue] = useState([]);
  const [remainingTime, setRemainingTime] = useState([]);
  const chartRef = useRef(null);
  const classes = useStyles();

  useEffect(() => {
    const remaining_revenue = projectsData.map((data) => {
      const rr = data.planned_value - data.actual_value;
      return rr < 0 ? 0 : (rr * 100) / data.planned_value;
    });

    setRemainingRevenue(remaining_revenue);

    const total_days = projectsData.map((data) => {
      const endDate = new Date(
        moment(_.defaultTo(_.get(data, "pactual_end_date"), new Date())).format(
          "YYYY-MM-DD"
        )
      );

      const startDate = new Date(
        moment(
          _.defaultTo(_.get(data, "pactual_start_date"), new Date())
        ).format("YYYY-MM-DD")
      );

      return (endDate - startDate) / (1000 * 3600 * 24);
    });

    const remaining_days = projectsData.map((data) => {
      const endDate = new Date(
        moment(_.defaultTo(_.get(data, "pactual_end_date"), new Date())).format(
          "YYYY-MM-DD"
        )
      );

      const currentDate = new Date(
        moment(_.defaultTo(new Date())).format("YYYY-MM-DD")
      );

      const rd = (endDate - currentDate) / (1000 * 3600 * 24);
      return rd < 0 ? 0 : rd;
    });

    const remaining_time = remaining_days.map((days, index) => {
      return days === 0 ? 0 : ((days * 100) / total_days[index]) * -1;
    });

    setRemainingTime(remaining_time);

    const projectName = projectsData.map((data) => {
      return data.project_name;
    });

    setProjectNames(projectName);
  }, [projectsData]);

  const options = {
    responsive: true,
    indexAxis: "y",
    scales: {
      x: {
        min: -100,
        max: 100,
        ticks: {
          callback: function (value, index, values) {
            return Math.abs(value) + "%";
          },
          color: "#123C23",
          font: {
            size: 12,
          },
        },
        grid: {
          display: true,
          color: (context) => {
            return context.tick.value === 0 ? "#A5C4C9" : "#DCF4EE";
          },
        },
      },

      y: {
        stacked: true,
        ticks: {
          color: "#123C23",
          font: {
            size: 10,
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
        containerID: "custom-legend3",
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
            label += Math.abs(context.raw).toLocaleString() + "%";
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
        label: "Remaining Revenue",
        type: "bar",
        backgroundColor: "#417E5A",
        hoverBackgroundColor: "#417E5A",
        data: remainingRevenue,
        barThickness: 16,
        datalabels: {
          display: true,
          color: "#417E5A",
          font: {
            size: 12,
            weight: "bold",
            family: "Manrope, sans-serif",
          },
          anchor: "start",
          align: -45,
          formatter: (value) => {
            return `${Math.floor(Math.abs(value))}%`;
          },
        },
      },
      {
        label: "Remaining Time",
        type: "bar",
        backgroundColor: "#C2E9A0",
        hoverBackgroundColor: "#C2E9A0",
        data: remainingTime,
        barThickness: 16,

        datalabels: {
          display: true,
          color: "#113C23",
          font: {
            size: 12,
            weight: "bold",
            family: "Manrope, sans-serif",
          },

          anchor: "end",
          align: 225,
          formatter: (value) => {
            return `${Math.floor(Math.abs(value))}%`;
          },
        },
      },
    ],
  };

  useEffect(() => {
    const chart = chartRef.current;

    if (chart) {
      const legendContainer = document.getElementById("legend3");

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
        <h2 className={classes.title}>Remaining Time vs Revenue</h2>
        <div id="legend3"></div>
      </div>

      <Bar
        ref={chartRef}
        data={data}
        options={options}
        height={200}
        plugins={[
          {
            id: "custom-legend3",
            beforeInit: function (chart) {
              chart.generateLegend = function () {
                const datasets = this.data.datasets;
                let legendHtml = '<ul class="custom-legend3">';

                datasets.forEach((dataset, index) => {
                  legendHtml += `
                      <li>
                        <div class="legendSymbol">
                      
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
    </Paper>
  );
};

export default TimeGraph;
