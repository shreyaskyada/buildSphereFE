import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import "./styles.css";

const ProjectSummaryChart = ({ id }) => {
  const [chartInstance, setChartInstance] = useState(null);

  const options = {
    rotation: 86 * Math.PI,
    plugins: {
      datalabels: {
        display: false,
      },
      htmlLegend: {
        containerID: id,
      },
      legend: {
        display: false,
      },

      tooltip: {
        enabled: true,
        filter: function (tooltipItem) {
          return tooltipItem.label !== "";
        },
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  const data = {
    labels: ["Completed", "In Progress", "Paused", "Cancelled", ""],
    datasets: [
      {
        data: [9, 3, 4, 14, 30],
        backgroundColor: [
          "#00530C",
          "#59A77B",
          "#E3BD68",
          "#E36767",
          "#E3E3E3",
        ],
        borderWidth: 0,
      },
    ],
  };

  const total = 30;

  const plugins = [
    {
      id: "textCenter",
      beforeDraw: function (chart) {
        const width = chart.width,
          height = chart.height,
          ctx = chart.ctx;
        ctx.restore();
        const fontSize = (height / 114).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";
        const text = total.toString(),
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 2;
        ctx.fillText(text, textX, textY);
        ctx.save();
      },

      afterDatasetsDraw: function (chart) {
        const ctx = chart.ctx;
        const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;
        const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
        const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#DBF4EE";
        ctx.stroke();
        ctx.restore();
      },
    },
    {
      id: id,
      beforeInit: function (chart) {
        chart.generateLegend = function () {
          let legendHtml = ` 
          <div class="jobsSummary">
          <div class="jobsSummary1">
            <div class="completed">
              <span></span>
              <p>Completed (9)</p>
            </div>
            <div class="paused">
              <span></span>
              <p>Paused (4)</p>
            </div>
          </div>
          <div class="jobsSummary2">
            <div class="inProgress">
              <span></span>
              <p>In Progress (3)</p>
            </div>
            <div class="cancelled">
              <span></span>
              <p>Cancelled (14)</p>
            </div>
          </div>
        </div>
        `;
          return legendHtml;
        };
      },
    },
  ];

  const addEventListener = (legendItem, index) => {
    legendItem[0].addEventListener("click", () => {
      chartInstance.toggleDataVisibility(index);
      chartInstance.update();
    });
  };

  useEffect(() => {
    if (chartInstance) {
      const legendContainer = document.getElementById(id);
      if (legendContainer) {
        legendContainer.innerHTML = chartInstance.generateLegend();

        const legendItem1 = legendContainer.getElementsByClassName("completed");
        const legendItem2 =
          legendContainer.getElementsByClassName("inProgress");
        const legendItem3 = legendContainer.getElementsByClassName("paused");
        const legendItem4 =
          legendContainer.getElementsByClassName("cancelled ");

        addEventListener(legendItem1, 0);
        addEventListener(legendItem2, 1);
        addEventListener(legendItem3, 2);
        addEventListener(legendItem4, 3);
      }
    }
  }, [chartInstance]);

  return (
    <>
      <div style={{ display: "flex" }}>
        <div className="chartContainer">
          <Doughnut
            ref={(ref) => setChartInstance(ref)}
            data={data}
            options={options}
            plugins={plugins}
          />
        </div>
        <div id={id}></div>
      </div>
    </>
  );
};

export default ProjectSummaryChart;
