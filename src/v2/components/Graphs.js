import { Grid, makeStyles, Paper, Radio, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "100%",
    borderRadius: 10,
    padding: "2%",
    border: `1px solid ${theme.v2.borders.lightGrey}`,
    margin: "2%",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.blackShade1,
  },
  options: {
    marginLeft: "3%",
    fontSize: 16,
    color: theme.v2.fonts.colors.darkFont,
  },
  radioRoot: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  icon: {
    borderRadius: "50%",
    width: 8,
    height: 8,
    boxShadow:
      "0px 0px 0px 5px white,0px 0px 0px 6px #A8A8A8,0px 0px 0px 9px #E2E2E2",
    backgroundColor: "white",
  },
  checkedIcon: {
    borderRadius: "50%",
    width: 8,
    height: 8,
    backgroundColor: "#1D1D1F",
    boxShadow:
      "0px 0px 0px 2px #1D1D1F,0px 0px 0px 5px white,0px 0px 0px 6px #49A053,0px 0px 0px 10px #C6DEC9",
  },
  desc: {
    marginTop: "10%",
    border: `1px solid ${theme.v2.borders.greenShade3}`,
    backgroundColor: theme.v2.backgrounds.greenBackgroundShade6,
    borderRadius: 10,
  },
  descHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.greenShade5,
    padding: "5%",
  },
  descPara: {
    fontSize: 12,
    color: theme.v2.fonts.colors.darkFont,
    padding: "5%",
    paddingTop: 0,
  },
}));

const getOptions = (yAxesPrefix, yAxesSuffix) => {
  return {
    plugins: {
      legend: true,
    },
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          beginAtZero: true,
          callback: (value, index, values) => {
            return `${yAxesPrefix || ""}${value}${yAxesSuffix || ""}`;
          },
        },
      },
      // yAxes: [
      //   {
      //     ticks: {
      //       beginAtZero: true,
      //       callback: (value, index, values) => {
      //         return `$ ${value}`;
      //       },
      //     },
      //   },
      // ],
    },
  };
};

const CustomRadioButton = (props) => {
  const classes = useStyles();
  return (
    <Radio
      className={classes.radioRoot}
      icon={<span className={classes.icon} />}
      checkedIcon={<span className={classes.checkedIcon} />}
      onChange={props.onChange}
      checked={props.selected === props.index}
    />
  );
};

const backgroundColors = ["rgb(65,150,203,0.2)", "rgb(208,244,212,0.2)"];
const borderColors = ["#4196CB", "#A0DBA7"];

const Graphs = (props) => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [radioButtonSelected, setRadioButtonSelected] = useState(0);
  const handleChange = (index) => {
    setRadioButtonSelected(index);
    props.onChange(index);
  };

  useEffect(() => {
    const labels = [];
    _.get(props, ["data", 0, "data"], []).forEach((dataset) => {
      labels.push(dataset.x);
    });
    const datasets = props.data.map((dataset, index) => {
      const ydata = [];
      _.get(dataset, "data", []).forEach((set) => {
        ydata.push(set.y);
      });
      return {
        label: dataset.label,
        data: ydata,
        fill: true,
        backgroundColor: backgroundColors[index],
        borderColor: borderColors[index],
        datalabels: {
          display: false,
        },
      };
    });
    setData({
      labels,
      datasets,
    });
  }, [props]);

  return (
    <Paper className={classes.paper}>
      <Grid container justify="space-between">
        <Grid item xs={12}>
          <Typography className={classes.header}>{props.header}</Typography>
        </Grid>
        <Grid item xs={3} style={{ paddingTop: "5%" }}>
          <Grid
            item
            xs={12}
            style={{
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
            }}
          >
            <CustomRadioButton
              onChange={handleChange.bind(this, 0)}
              selected={radioButtonSelected}
              index={0}
            />
            <Typography className={classes.options}>
              Revenue Forecast
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
              marginTop: "10%",
            }}
          >
            <CustomRadioButton
              onChange={handleChange.bind(this, 1)}
              selected={radioButtonSelected}
              index={1}
            />
            <Typography className={classes.options}>
              Project Progress
            </Typography>
          </Grid>
          {/* <Grid
            item
            xs={12}
            style={{
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
              marginTop: "10%",
            }}
          >
            <CustomRadioButton
              onChange={handleChange.bind(this, 2)}
              selected={radioButtonSelected}
              index={2}
            />
            <Typography className={classes.options}>Units per week</Typography>
          </Grid>*/}
          {/* <Grid item xs={11} className={classes.desc}>
            <Typography className={classes.descHeader}>
              {radioButtonSelected === 0
                ? "Revenue Forecast"
                : "Project Progress"}
            </Typography>
            <Typography className={classes.descPara}>
              {radioButtonSelected === 0
                ? `As of ${moment().format(
                    "MMM/DD"
                  )}, we estimate for the upcoming year on the amount of money your portfolio of projects will likely bring in`
                : `As of ${moment().format(
                    "MMM/DD"
                  )}, we estimate the timeline of completion for your portfolio of projects and jobs`}
            </Typography>
          </Grid> */}
        </Grid>
        <Grid item xs={9}>
          <Line
            options={getOptions(
              _.get(props, ["data", 0, "yAxisPrefix"]),
              _.get(props, ["data", 0, "yAxisSuffix"])
            )}
            data={data}
            height={350}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Graphs;
