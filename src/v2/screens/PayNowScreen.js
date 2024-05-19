import {
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  makeStyles,
  MenuItem,
  Modal,
  Paper,
  Select,
  Typography,
} from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import axios from "../../axios";
import _ from "lodash";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import clsx from "clsx";
import { SHOW_ERROR_MESSAGE } from "../../store/actions/v2/message";
import {
  API_PAYMENTS,
  API_PLANS,
  API_PLANS_DEFAULT,
  ROUTE_HOME,
} from "../../helpers/endpoints";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "5%",
    overflow: "auto",
  },
  dropdown: {
    width: "400",
  },
  CardCvcElement: {
    width: 50,
    borderRadius: 2,
    backgroundColor: "#F4F4F4",
    height: 30,
    paddingTop: 15,
    paddingLeft: 15,
    marginLeft: 10,
  },

  newcardbtn: {
    marginTop: 20,
    backgroundColor: theme.v2.backgrounds.blueBackgroundShade1,
    width: 193,
    height: 50,
    fontSize: 18,
    "&:hover": {
      backgroundColor: theme.v2.backgrounds.blueBackgroundShade1,
    },
  },
  newcardbtncancel: {
    backgroundColor: theme.v2.backgrounds.redBackground,

    "&:hover": {
      backgroundColor: theme.v2.backgrounds.redBackground,
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
  CardCvcElement1: {
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
    marginTop: 20,
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

const PayNow = (props) => {
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => JSON.parse(state.auth.profile));
  const groupId = _.get(profile, "group_id");
  const [existingSubsc, setExistingSubsc] = useState({});
  const [isCancelled, setIsCancelled] = useState(false);
  const [cards, setCards] = useState([]);
  const [cardSelected, setCardSelected] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const [cardNo, setCardNo] = useState();
  const [cvv, setCvv] = useState();
  const [expiry, setExpiry] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [newCard, setNewCard] = useState(false);
  const [savedCvv, setSavedCvv] = useState();
  const dispatch = useDispatch();
  const [defaultPlan, setDefaultPlan] = useState(null);

  const getExistingSubscription = useCallback(async () => {
    try {
      const result = await axios.get(
        `groups/${groupId}/currentsubscription?p=group:${groupId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        setExistingSubsc(_.get(result, ["data", "message"]));
      }
    } catch (err) {}
  }, [token, groupId]);
  useEffect(() => {
    getExistingSubscription();
  }, [getExistingSubscription]);

  const getSubscription = useCallback(async () => {
    try {
      const result = await axios.get(
        `/groups/${groupId}/subscriptionstatus?p=group:${groupId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        setIsCancelled(_.get(result, ["data", "message", "is_cancelled"]));
      }
    } catch (err) {}
  }, [token, groupId]);

  useEffect(() => {
    getSubscription();
  }, [getSubscription]);

  const getCards = useCallback(async () => {
    try {
      const result = await axios.get(
        `/groups/${groupId}/cards?p=group:${groupId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        if (_.get(result, ["data", "message"]).length > 0) {
          setCardSelected(_.get(result, ["data", "message", 0, "id"]));
        }
        setCards(_.get(result, ["data", "message"]));
      }
    } catch (err) {}
  }, [groupId, token, setCards, setCardSelected]);

  useEffect(() => {
    getCards();
  }, [getCards]);

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

  useEffect(() => {
    fetchDefaultPlan();
  }, [fetchDefaultPlan]);

  const payWithNewcard = async () => {
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
          `${API_PAYMENTS}/renew/intent?p=group:${groupId}`,
          {
            cost: Number(existingSubsc.total) + Number(existingSubsc.extra),
            id: _.get(defaultPlan, "id"),
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

  const payWithSavedCard = async () => {
    if (!cardSelected) {
      return;
    }

    if (!savedCvv) {
      return;
    }

    if (!savedCvv.complete || savedCvv.error) return;

    //create intent

    const csavedCardCvv = elements.getElement(CardCvcElement);

    setOpenModal(true);
    let resp;
    try {
      resp = await axios.post(
        `${API_PAYMENTS}/renew/intent?p=group:${groupId}`,
        {
          cost: Number(existingSubsc.total) + Number(existingSubsc.extra),
          id: _.get(defaultPlan, "id"),
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

    //confirm payment
    if (!resp) return;

    const clientSecret = _.get(resp, ["data", "message"]);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: cardSelected,
      payment_method_options: {
        card: {
          cvc: csavedCardCvv,
        },
      },
    });
    if (result.error) {
      //setup to retry or cancel payment
      console.log(result.error.message);
      return;
    }

    setTimeout(() => {
      setOpenModal(false);
      props.history.push(`${ROUTE_HOME}`);
      window.location.reload();
    }, 4000);
  };

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Typography className={classes.header}>Payment Information</Typography>
      </Grid>
      <Modal open={openModal}>
        <Paper className={classes.paper}>
          <Typography className={classes.modaltext}>
            We are confirming your transaction. Please don't refresh the page.
          </Typography>
          <CircularProgress />
        </Paper>
      </Modal>
      {newCard && (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              payWithNewcard();
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
                  Paying <strong></strong>
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
                <div
                  style={{ position: "absolute", right: "5%", bottom: "15%" }}
                >
                  <div className={classes.label}>CVC/CVV</div>
                  <div style={{ height: 15 }} />
                  <CardCvcElement
                    className={classes.CardCvcElement1}
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
                <strong>
                  ${Number(existingSubsc.total) + Number(existingSubsc.extra)}
                </strong>
              </Button>
              <Button
                className={clsx([
                  classes.newcardbtn,
                  {
                    [classes.newcardbtncancel]: newCard,
                  },
                ])}
                onClick={() => {
                  setNewCard((prev) => !prev);
                }}
              >
                {!newCard ? "+ Add new card" : "Use saved card"}
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
        </>
      )}
      {!newCard && (
        <>
          <Grid
            xs={12}
            item
            style={{
              paddingBottom: 15,
            }}
          >
            Select card
          </Grid>

          <Grid xs={12} item>
            {cards.length > 0 && (
              <div
                style={{
                  flexDirection: "row",
                  display: "flex",
                }}
              >
                <Select
                  className={classes.dropdown}
                  value={cardSelected}
                  onChange={(e) => setCardSelected(e.target.value)}
                >
                  {cards.map((card) => {
                    return (
                      <MenuItem
                        key={card.id}
                        value={card.id}
                        style={{
                          fontSize: 14,
                          alignItems: "center",
                        }}
                      >
                        <img
                          src="/card.svg"
                          alt=""
                          style={{
                            width: 17,
                          }}
                        />
                        &nbsp; Visa ending in&nbsp;
                        <strong>{_.get(card, ["card", "last4"])}</strong>&nbsp;
                        expiring on &nbsp;
                        <strong>
                          {_.get(card, ["card", "exp_month"])}/
                          {_.get(card, ["card", "exp_year"])}
                        </strong>
                      </MenuItem>
                    );
                  })}
                </Select>
                <div className={classes.CardCvcElement}>
                  <CardCvcElement
                    onChange={(e) => {
                      setSavedCvv(e);
                    }}
                  />
                </div>
              </div>
            )}
          </Grid>
        </>
      )}

      {!newCard && (
        <Grid xs={12} item>
          {!newCard && (
            <>
              <Button className={classes.sendotpbtn} onClick={payWithSavedCard}>
                Pay &nbsp;
                <strong>
                  ${Number(existingSubsc.total) + Number(existingSubsc.extra)}
                </strong>
              </Button>
              &nbsp;
            </>
          )}

          <Button
            className={clsx([
              classes.newcardbtn,
              {
                [classes.newcardbtncancel]: newCard,
              },
            ])}
            onClick={() => {
              setNewCard((prev) => !prev);
            }}
          >
            {!newCard ? "+ Add new card" : "Cancel"}
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default PayNow;
