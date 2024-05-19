import {
  Button,
  Checkbox,
  Grid,
  ListItemText,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../../../axios";
import {
  API_PLANS,
  API_PLANS_DEFAULT,
  AP_ACCOUNT_INFO,
  ROUTE_PAYMENTS,
} from "../../../helpers/endpoints";
import Tick from "../../../assets/v2/RightTick.svg";
import DropDown from "../../../assets/v2/DropdownGreen.svg";

const _ = require("lodash");

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "1%",
    [theme.breakpoints.up("md")]: {
      padding: "5%",
    },
  },
  defaultPlanWrapper: {
    minWidth: "80%",
    minHeight: "50vh",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.v2.borders.lightGrey,
    borderRadius: 10,
    overflow: "hidden",
    paddingBottom: "5%",
  },
  heading: {
    textAlign: "center",
    backgroundColor: theme.v2.backgrounds.greenBackgroundShade3,
    paddingTop: "10%",
    paddingBottom: "10%",
    color: theme.v2.fonts.colors.whiteFont,
    fontSize: 25,
  },
  featuresWrapper: {
    paddingTop: "15%",
    paddingLeft: "15%",
  },
  includestxt: {
    fontSize: 16,
    color: theme.v2.fonts.colors.greenShade1,
  },
  featurelist: {
    paddingLeft: "15%",
    lineHeight: "150%",
    fontSize: 12,
    color: theme.v2.fonts.colors.darkFont,
  },
  linecolor: {
    backgroundColor: theme.v2.fonts.colors.whiteShade1,
  },
  plancurrency: {
    color: theme.v2.fonts.colors.greenShade1,
    fontSize: 18,
    position: "absolute",
    top: "12%",
  },
  plancost: {
    color: theme.v2.fonts.colors.greenShade1,
    fontWeight: "bold",
    fontSize: 37,
  },
  planttenure: { color: theme.v2.fonts.colors.greenShade1, fontSize: 16 },
  plannote: {
    paddingLeft: "15%",
    paddingBottom: "6%",
    color: theme.v2.fonts.colors.darkFont,
    fontSize: 12,
  },
  form: {
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  formheading: {
    fontSize: 25,
    fontWeight: "bold",
  },
  formitemwrapper: {
    paddingTop: "10%",
    width: "90%",
  },
  formtextfield: {
    width: "100%",
  },
  labelformfields: {
    fontSize: 16,
    paddingBottom: "3%",
  },
  imagewrapper: {
    width: 120,
    height: 130,
    backgroundColor: theme.v2.backgrounds.lightBlueBackground,
    borderRadius: 5,
    marginTop: "32%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    [theme.breakpoints.down("sm")]: {
      marginTop: "10%",
    },
    "&:hover": {
      cursor: "pointer",
    },
  },
  sendotpbtn: {
    height: 50,
    width: 160,
    fontSize: 18,
  },
  uploadtxt: {
    fontSize: 16,
    color: theme.v2.fonts.colors.greyShade6,
    paddingTop: "5%",
  },
}));

const countEmployees = {
  1: "1-20  employees",
  2: "21-50  employees",
  3: "50+  employees",
};

const Subscription = (props) => {
  const classes = useStyles();
  const [defaultPlan, setDefaultPlan] = useState();
  const token = useSelector((state) => _.get(state, ["auth", "token"]));
  const groupId = useSelector((state) =>
    _.get(JSON.parse(_.get(state, ["auth", "profile"])), "group_id")
  );
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    employees: 1,
    file: "",
  });
  const fetchDefaultPlan = useCallback(async () => {
    axios
      .get(`${API_PLANS}/${API_PLANS_DEFAULT}`)
      .then(({ data }) => {
        setDefaultPlan(data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [setDefaultPlan]);

  const fetchAccountInfo = useCallback(() => {
    axios
      .get(`${AP_ACCOUNT_INFO}?p=group:${groupId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((result) => {
        const data = _.get(result, "data") || {};
        if (data.message) {
          setForm({
            name: data.message.name,
            email: data.message.email,
            phone: data.message.phone,
            employees: 1,
            image_url: data.message.image,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  useEffect(() => {
    fetchDefaultPlan();
    fetchAccountInfo();
  }, [fetchDefaultPlan, fetchAccountInfo]);

  const onFormChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const proceedToPayHandler = async () => {
    const formData = new FormData();
    if (form.file) {
      formData.append("file", form.file);
    }
    formData.append("name", form.name);
    formData.append("email", form.email);
    if (form.phone) {
      formData.append("phone", form.phone);
    }
    formData.append("size", countEmployees[form.employees]);
    try {
      await axios.post(`${AP_ACCOUNT_INFO}?p=group:${groupId}`, formData, {
        headers: {
          Authorization: token,
          "Content-type": "multipart/form-data",
        },
      });
      props.history.push(
        `${ROUTE_PAYMENTS}?id=${_.get(defaultPlan, "id")}&p=${_.get(
          defaultPlan,
          "cost"
        )}`
      );
    } catch (err) {}
  };

  const selectFileHandler = () => {
    document.getElementById("profile").click();
  };
  const updateFilehandler = (file) => {
    setForm({ ...form, file });
  };
  return (
    <Grid container className={classes.root}>
      <Grid item xs={9} sm={7} md={3}>
        <div className={classes.defaultPlanWrapper}>
          <div className={classes.heading}>
            <span>Account activation</span>
          </div>
          <div className={classes.featuresWrapper}>
            <div className={classes.includestxt}>Includes</div>
          </div>
          <ul style={{ listStyleType: "none" }} className={classes.featurelist}>
            <li>
              <img src={Tick} alt={"Tick"} width={15} height={15} />
              &nbsp;&nbsp;{_.get(defaultPlan, "admin_account")} admin account
            </li>
            <li>
              <img src={Tick} alt={"Tick"} width={15} height={15} /> &nbsp;
              {`+${_.get(defaultPlan, "user_account")}`} Free Field user account
            </li>
            <li>
              <img src={Tick} alt={"Tick"} width={15} height={15} />
              &nbsp;&nbsp;{_.get(defaultPlan, "rus_credits")} Free Rus Credits
            </li>
            <li>
              <img src={Tick} alt={"Tick"} width={15} height={15} />
              &nbsp;&nbsp;{_.get(defaultPlan, "free_training")} Free Training
            </li>
          </ul>

          <div
            style={{ padding: "10%", paddingTop: "2%", paddingBottom: "5%" }}
          >
            <div style={{ position: "relative" }}>
              <span className={classes.plancurrency}>$</span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className={classes.plancost}>
                {_.get(defaultPlan, "cost")}
              </span>
              &nbsp;&nbsp;
              <span className={classes.planttenure}>
                {_.get(defaultPlan, "tenure")}
              </span>
            </div>
            <hr className={classes.linecolor} />
          </div>

          <div
            className={classes.plannote}
            style={{ fontWeight: "600", fontSize: 12 }}
          >
            Please note:
          </div>
          <div className={classes.plannote}>
            Adding more accounts will get
            <br /> billed on your credit/debit card on
            <br /> per account basis.
          </div>
        </div>
      </Grid>
      <Grid item xs={12} sm={4} md={8} className={classes.form} container>
        <form
          style={{ width: "100%" }}
          onSubmit={(e) => {
            e.preventDefault();
            proceedToPayHandler();
          }}
        >
          <Grid container>
            <Grid item xs={12} className={classes.formheading}>
              Account Information
            </Grid>
            <Grid xs={12} md={7} item>
              <div className={classes.formitemwrapper}>
                <div className={classes.labelformfields}>Business Name*</div>
                <TextField
                  variant="standard"
                  className={classes.formtextfield}
                  type="text"
                  placeholder="Enterprise Name"
                  name="name"
                  required={true}
                  value={form.name}
                  onChange={onFormChangeHandler}
                />
              </div>
              <div className={classes.formitemwrapper}>
                <div className={classes.labelformfields}>Business Email*</div>
                <TextField
                  variant="standard"
                  className={classes.formtextfield}
                  type="email"
                  placeholder="Your Business Email"
                  name="email"
                  required={true}
                  value={form.email}
                  onChange={onFormChangeHandler}
                />
              </div>
              <div className={classes.formitemwrapper}>
                <div className={classes.labelformfields}>Phone Number</div>
                <TextField
                  variant="standard"
                  className={classes.formtextfield}
                  type="text"
                  placeholder="Your Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={onFormChangeHandler}
                />
              </div>
            </Grid>
            <Grid xs={12} md={4} item>
              <div className={classes.imagewrapper} onClick={selectFileHandler}>
                <input
                  onChange={(e) => {
                    updateFilehandler(e.target.files[0]);
                  }}
                  accept="image/png, image/gif, image/jpeg"
                  hidden={true}
                  type="file"
                  id="profile"
                  //value={form.file}
                />
                {!form.file && (
                  <img
                    alt="upload"
                    src="upload.svg"
                    style={{ width: 25, height: 25 }}
                  />
                )}
                {!form.file && (
                  <div className={classes.uploadtxt}>Upload Logo</div>
                )}
                {form.file && (
                  <img
                    alt="profile"
                    src={URL.createObjectURL(form.file)}
                    style={{ width: 120, height: 120 }}
                  />
                )}
              </div>
            </Grid>
            <Grid xs={12} md={7} item>
              <div className={classes.formitemwrapper}>
                <div className={classes.labelformfields}>Business size </div>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  className={classes.formtextfield}
                  value={form.employees}
                  name="employees"
                  onChange={onFormChangeHandler}
                  renderValue={(selected) => {
                    return <ListItemText primary={countEmployees[selected]} />;
                  }}
                  // InputProps={{
                  //   endAdornment: <img src={DropDown} alt={"select"} />,
                  // }}
                >
                  <MenuItem value={1}>
                    <Checkbox checked={Boolean(form.employees === 1)} />
                    <ListItemText primary={countEmployees[1]} />
                  </MenuItem>
                  <MenuItem value={2}>
                    <Checkbox checked={Boolean(form.employees === 2)} />
                    <ListItemText primary={countEmployees[2]} />
                  </MenuItem>
                  <MenuItem value={3}>
                    <Checkbox checked={Boolean(form.employees === 3)} />
                    <ListItemText primary={countEmployees[3]} />
                  </MenuItem>
                </Select>
              </div>
            </Grid>
            <Grid
              xs={12}
              md={7}
              item
              style={{ paddingTop: "5%", paddingRight: "5%" }}
              container
              justify="flex-end"
            >
              <Button className={classes.sendotpbtn} type="submit">
                Proceed to Pay
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default Subscription;
