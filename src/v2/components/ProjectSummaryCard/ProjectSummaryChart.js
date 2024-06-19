import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import "./styles.css";

const ProjectSummaryChart = ({ id, project }) => {
  const [chartInstance, setChartInstance] = useState(null);
  const completed = Number(project.Completed);
  const paused = Number(project["On Hold"]);
  const ongoing = Number(project.Ongoing);
  const cancelled = Number(project.Cancelled);
  const totalJobs = completed + paused + ongoing + cancelled;
  const chartData = [completed, ongoing, paused, cancelled];

  const options = {
    rotation: -90,
    circumference: 180,
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
    },
  };

  const data = {
    labels: ["Completed", "In Progress", "Paused", "Cancelled"],
    datasets: [
      {
        data: chartData,
        backgroundColor: ["#00530C", "#59A77B", "#E3BD68", "#E36767"],
        borderWidth: 0,
      },
    ],
  };

  const total = totalJobs;

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
          textY = height / 1.5;
        ctx.fillText(text, textX, textY);
        ctx.save();
      },

      afterDatasetsDraw: function (chart) {
        const ctx = chart.ctx;
        const meta = chart.getDatasetMeta(0);
        const innerRadius = meta.data[0].innerRadius;
        const outerRadius = meta.data[0].outerRadius;
        const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
        const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 1.33;

        ctx.save();
        ctx.beginPath();

        ctx.moveTo(centerX - outerRadius, centerY);
        ctx.lineTo(centerX - innerRadius, centerY);

        ctx.moveTo(centerX + innerRadius, centerY);
        ctx.lineTo(centerX + outerRadius, centerY);

        ctx.lineWidth = 3;
        ctx.strokeStyle = "#DBF4EE";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, Math.PI, 2 * Math.PI);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#DBF4EE";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, Math.PI, 2 * Math.PI);
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
              <p>Completed (${completed})</p>
            </div>
            <div class="paused">
              <span></span>
              <p>Paused (${paused})</p>
            </div>
          </div>
          <div class="jobsSummary2">
            <div class="inProgress">
              <span></span>
              <p>In Progress (${ongoing})</p>
            </div>
            <div class="cancelled">
              <span></span>
              <p>Cancelled (${cancelled})</p>
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
