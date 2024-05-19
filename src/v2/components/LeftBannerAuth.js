import { Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import Logo from "../../../src/assets/v2/LogoWithText.svg";
import StoreLogos from ".../../../src/assets/v2/StoreLogos.svg";
import moment from "moment";

const h = window.innerHeight;

const useStyles = makeStyles((theme) => ({
  leftContainer: {
    backgroundColor: theme.v2.backgrounds.darkBackground,
    paddingLeft: "10%",
    height: h,
  },
  leftContainerHeader: {
    color: theme.v2.fonts.colors.whiteShade1,
    fontSize: 31,
    fontWeight: 200,
  },
  leftContainerText: {
    color: theme.v2.fonts.colors.whiteShade1,
    fontSize: 16,
  },
  leftContainerText2: {
    color: theme.v2.fonts.colors.whiteShade1,
    fontSize: 14,
  },
}));

const year = moment().get("year").toString()
const LeftBannerAuth = (props) => {
  const classes = useStyles();

  return (
    <Grid item md={5} xs={12} container className={classes.leftContainer}>
      <Grid
        item
        xs={12}
        style={{
          paddingTop: 0.2 * h,
        }}
      >
        <img src={Logo} alt={"Logo"} />
      </Grid>
      <Grid item xs={12} style={{ paddingTop: "5%" }}>
        <Typography className={classes.leftContainerHeader}>
          A Revolution in Real Time
        </Typography>
        <Typography className={classes.leftContainerHeader}>
          Construction Management
        </Typography>
      </Grid>
      <Grid item xs={12} style={{ paddingTop: 0.4 * h }}>
        <Typography className={classes.leftContainerText}>
          Our User App is available on
        </Typography>
      </Grid>
      <Grid item xs={12} style={{ paddingTop: "2%", paddingBottom: "2%" }}>
        <img src={StoreLogos} alt={"store icons"} />
      </Grid>
      <Grid item xs={12} style={{ paddingBottom: 0.07 * h }}>
        <Typography className={classes.leftContainerText2}>
          (C) {year} Copilot Network LLC •  All rights reserved
        </Typography>
      </Grid>
    </Grid>
  );
};

export default LeftBannerAuth;
