const moment = require("moment");

module.exports.roundData = (floatValue) => {
  if (Number(floatValue))
    return Math.round(parseFloat(floatValue * 100).toFixed(2)) / 100;
  return 0;
};

const defaultGraphData = () => {
  return [
    {
      x: moment().format("MMM-YYYY"),
      y: 0,
    },
    {
      x: moment().add(1, "month").format("MMM-YYYY"),
      y: 0,
    },
    {
      x: moment().add(2, "month").format("MMM-YYYY"),
      y: 0,
    },
    {
      x: moment().add(3, "month").format("MMM-YYYY"),
      y: 0,
    },
    {
      x: moment().add(4, "month").format("MMM-YYYY"),
      y: 0,
    },
    {
      x: moment().add(5, "month").format("MMM-YYYY"),
      y: 0,
    },
  ];
};

module.exports.getNormalizeIsolatedAndCumulativeGraphData = (
  graphData,
  yAxisPrefix,
  yAxisSuffix
) => {
  let isolatedData = [];
  let cumulativeData = [];
  graphData.forEach((data, index) => {
    if (index != 0) {
      const currentMonth = moment(data.x, "MM-YYYY");
      let prevMonth = moment(
        isolatedData[isolatedData.length - 1].x,
        "MMM-YYYY"
      );
      while (
        isolatedData.length < 6 &&
        currentMonth.subtract(1, "month").month() != prevMonth.month()
      ) {
        isolatedData.push({
          x: moment(isolatedData[isolatedData.length - 1].x, "MMM-YYYY")
            .add(1, "month")
            .format("MMM-YYYY"),
          y: 0,
        });
        prevMonth = moment(isolatedData[isolatedData.length - 1].x, "MMM-YYYY");
      }
      isolatedData.push({
        x: moment(data.x, "MM-YYYY").format("MMM-YYYY"),
        y: data.y,
      });
    } else
      isolatedData.push({
        x: moment(data.x, "MM-YYYY").format("MMM-YYYY"),
        y: data.y,
      });
  });
  if (isolatedData.length === 0) {
    isolatedData = defaultGraphData();
  }
  while (isolatedData.length < 6) {
    isolatedData.push({
      x: moment(isolatedData[isolatedData.length - 1].x, "MMM-YYYY")
        .add(1, "month")
        .format("MMM-YYYY"),
      y: 0,
    });
  }
  let sumTillLastvalue = 0;
  isolatedData.forEach((data) => {
    cumulativeData.push({
      x: data.x,
      y: data.y + sumTillLastvalue,
    });
    sumTillLastvalue += data.y || 0;
  });
  return [
    { data: isolatedData, label: "Isolative", yAxisSuffix, yAxisPrefix },
    { data: cumulativeData, label: "Cumulative", yAxisSuffix, yAxisPrefix },
  ];
};
