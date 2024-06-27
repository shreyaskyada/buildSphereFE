import React from "react";

const Circle = ({ color, pct }) => {
  const r = 9;
  const circ = 2 * Math.PI * r;
  const strokePct = ((100 - pct) * circ) / 100;
  return (
    <circle
      r={r}
      cx={175}
      cy={25}
      fill="transparent"
      stroke={strokePct !== circ ? color : ""}
      strokeWidth={"5px"}
      strokeDasharray={circ}
      strokeDashoffset={pct ? strokePct : 0}
    ></circle>
  );
};

const Text = ({ percentage }) => {
  return (
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize={"8px"}
      fill="#59A77B"
    >
      {percentage.toFixed(0)}
    </text>
  );
};

const ProgressCircle = ({ percentage, circleColor, progressCircleColor }) => {
  return (
    <svg width={50} height={50}>
      <g transform={`rotate(-90 ${"100 100"})`}>
        <Circle color={circleColor} />
        <Circle color={progressCircleColor} pct={percentage} />
      </g>
      <Text percentage={percentage} />
    </svg>
  );
};

export default ProgressCircle;
