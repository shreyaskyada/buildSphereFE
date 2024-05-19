import {
  Button,
  Grid,
  makeStyles,
  Typography,
  Modal,
  Paper,
  CircularProgress,
  Checkbox,
} from "@material-ui/core";
import React, { useState } from "react";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import axios from "../../../axios";
import { API_PAYMENTS, ROUTE_HOME } from "../../../helpers/endpoints";
import { useDispatch, useSelector } from "react-redux";
import { SHOW_ERROR_MESSAGE } from "../../../store/actions/v2/message";

const _ = require("lodash");
const queryString = require("query-string");

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "1%",
    [theme.breakpoints.up("md")]: {
      padding: "5%",
    },
  },
  CardElement: {
    width: 250,
    marginTop: 10,
    marginBottom: 20,
    padding: "2%",
    backgroundColor: "white",
    borderRadius: 3,
  },
  CardCvcElement: {
    width: 70,
    borderRadius: 2,
    padding: "6%",
    backgroundColor: "white",
  },
  CardExpiryElement: {
    width: 60,
    borderRadius: 2,
    padding: "6%",
    backgroundColor: "white",
  },
  cardcontainer: {
    width: "70%",
    backgroundColor: theme.v2.backgrounds.darkBackground,
    paddingLeft: 30,
    borderRadius: 10,
    paddingTop: 20,
    paddingBottom: 30,
    position: "absolute",
    zIndex: 2,
  },
  backgroundCardContainer: {
    backgroundColor: theme.v2.backgrounds.greyBackgroundShade4,
    position: "absolute",
    zIndex: 1,
    height: 250,
    width: "70%",
    bottom: 10,
    right: 0,
    borderRadius: 10,
  },
  blackStripe: {
    marginTop: "14%",
    backgroundColor: theme.v2.backgrounds.darkBackground,
    height: 50,
  },
  label: {
    fontSize: 16,
    color: "white",
  },
  sendotpbtn: {
    height: 50,
    width: 160,
    fontSize: 18,
  },
  header: {
    fontSize: 25,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.blackShade1,
    marginBottom: "2%",
  },
  text: {
    paddingTop: "5%",
    fontSize: 12,
    color: theme.v2.fonts.colors.darkFont,
  },
  paper: {
    outline: "none",
    margin: "10%",
    padding: "5%",
    textAlign: "center",
  },
  modaltext: {
    fontSize: 20,
    color: theme.v2.fonts.colors.darkFont,
    paddingBottom: "5%",
  },
}));

const Payments = (props) => {
  const classes = useStyles();
  const stripe = useStripe();
  const elements = useElements();
  const [cardNo, setCardNo] = useState();
  const [cvv, setCvv] = useState();
  const [expiry, setExpiry] = useState();
  const [openModal, setOpenModal] = useState(false);
  const parsed = queryString.parse(props.location.search);
  const token = useSelector((state) => state.auth.token);
  const groupId = useSelector((state) =>
    _.get(JSON.parse(_.get(state, ["auth", "profile"])), "group_id")
  );
  const [saveCard, setSaveCard] = useState(true);
  const dispatch = useDispatch();
  const payHandler = async () => {
    if (!cardNo || !cvv || !expiry) return;
    if (!stripe || !elements) return;
    const cardnum = elements.getElement(CardNumberElement);
    if (!cardNo.complete || cardNo.error) return;
    if (!cvv.complete || cvv.error) return;
    if (!expiry.complete || expiry.error) return;

    try {
      setOpenModal(true);

      let resp;
      try {
        resp = await axios.post(
          `${API_PAYMENTS}/intent?p=group:${groupId}`,
          {
            cost: _.get(parsed, "p"),
            id: _.get(parsed, "id"),
            saved_card: saveCard,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
      } catch (error) {
        setOpenModal(false);

        if (_.get(error, ["response", "data", "message"])) {
          dispatch({
            type: SHOW_ERROR_MESSAGE,
            data:
              _.get(error, ["response", "data", "message"]) ||
              "Something went wrong",
          });
        }
      }

      if (!resp) return;

      const clientSecret = _.get(resp, ["data", "message"]);
      const paymentMethodReq = await stripe.createPaymentMethod({
        type: "card",
        card: cardnum,
      });
      if (paymentMethodReq.error) {
        console.log(paymentMethodReq.error.message);
        return;
      }

      const confirmobj = {
        payment_method: paymentMethodReq.paymentMethod.id,
      };

      if (saveCard) {
        confirmobj.setup_future_usage = "off_session";
      }
      const result = await stripe.confirmCardPayment(clientSecret, confirmobj);
      if (result.error) {
        //setup to retry or cancel payment
        console.log(result.error.message);
        return;
      }

      setTimeout(() => {
        setOpenModal(false);
        props.history.push(`${ROUTE_HOME}`);
      }, 4000);
    } catch (err) {
      setOpenModal(false);
      console.log(err);
    }
  };

  return (
    <>
      <Modal open={openModal}>
        <Paper className={classes.paper}>
          <Typography className={classes.modaltext}>
            We are confirming your transaction. Please don't refresh the page.
          </Typography>
          <CircularProgress />
        </Paper>
      </Modal>
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Typography className={classes.header}>
            Payment Information
          </Typography>
        </Grid>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            payHandler();
          }}
        >
          <Grid
            style={{
              width: 500,
              height: 300,
              position: "relative",
            }}
          >
            <div className={classes.cardcontainer}>
              <div
                className={classes.label}
                style={{ paddingTop: 20, paddingBottom: 30 }}
              >
                Paying <strong>${_.get(parsed, "p")}.00</strong>
              </div>
              <div className={classes.label}>Card Number</div>
              <CardNumberElement
                onChange={(e) => {
                  setCardNo(e);
                }}
                className={classes.CardElement}
                style={{
                  base: {},
                }}
              />
              <div style={{ display: "flex" }}>
                <div>
                  <div className={classes.label}>Expiry Date</div>
                  <div style={{ height: 15 }} />
                  <CardExpiryElement
                    className={classes.CardExpiryElement}
                    onChange={(e) => {
                      setExpiry(e);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className={classes.backgroundCardContainer}>
              <div className={classes.blackStripe} />
              <div style={{ position: "absolute", right: "5%", bottom: "15%" }}>
                <div className={classes.label}>CVC/CVV</div>
                <div style={{ height: 15 }} />
                <CardCvcElement
                  className={classes.CardCvcElement}
                  onChange={(e) => {
                    setCvv(e);
                  }}
                />
                <Typography className={classes.text}>
                  Last 3 or 4 Digits
                </Typography>
              </div>
            </div>
          </Grid>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Button className={classes.sendotpbtn} type="submit">
              Pay &nbsp;
              <strong>${_.get(parsed, "p")}.00</strong>
            </Button>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                fontSize: 12,
              }}
            >
              <Checkbox
                checked={saveCard}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setSaveCard(checked);
                }}
              />
              Save this card
            </div>
          </div>
        </form>
      </Grid>
    </>
  );
};

export default Payments;
