import {
  Button,
  Collapse,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../assets/v2/Card.svg";
import RightTick from "../../assets/v2/RightTick.svg";
import axios from "../../axios";
import _ from "lodash";
import moment from "moment";
import {
  SHOW_ERROR_MESSAGE,
  SHOW_SUCCESS_MESSAGE,
} from "../../store/actions/v2/message";
import InvoicesTemplate from "../components/InvoicesTemplate";
import { HIDE_LOADER, SHOW_LOADER } from "../../store/actions/v2/loader";
import ConfirmationModal from "../components/ConfirmationModal";
import { INVOICE_RECIPIENTS_STATUS } from "../../GlobalConstants";
import clsx from "clsx";
import {
  ROUTE_ACCOUNTS_SUBSCRIPTION,
  ROUTE_PAY_NOW,
} from "../../helpers/endpoints";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "5%",
    overflow: "auto",
  },
  header: {
    fontSize: 25,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.blackShade1,
    paddingBottom: "5%",
  },
  firstSection: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: theme.v2.backgrounds.darkBackground,
    padding: "7% 10%",
  },
  firstSectionText: {
    color: theme.v2.fonts.colors.whiteFont,
    fontSize: 16,
    fontWeight: "bold",
  },
  secondSection: {
    border: `1px solid ${theme.v2.borders.lightGrey3}`,
    padding: "8%",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  subSection: {
    backgroundColor: theme.v2.backgrounds.greyBackground3,
    fontSize: 25,
    fontWeight: "bold",
    padding: "5% 0%",
    borderRadius: 10,
  },
  lineItem: {
    borderBottom: `1px solid ${theme.v2.borders.darkShade2}`,
    padding: "3% 0%",
  },
  lineItemBold: {
    borderTop: `1px solid ${theme.v2.borders.blackShade1}`,
    padding: "3% 0%",
  },
  totalTypo: {
    fontSize: 25,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.blackShade1,
  },
  priceTypo: {
    fontSize: 33,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.blueShade1,
  },
  totalTypo1: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.blackShade1,
  },
  priceTypo1: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.blueShade1,
  },
  paymentText: {
    marginTop: "5%",
    marginBottom: "2%",
    fontSize: 25,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.blackShade1,
  },
  visaText: {
    paddingLeft: "2%",
    fontSize: 16,
    color: theme.v2.fonts.colors.blackShade1,
  },
  btnText: {
    width: 200,
    padding: "5%",
    fontSize: 18,
    color: theme.v2.fonts.colors.whiteFont,
  },
  recipientsContainer: {
    padding: "2% 3%",
    borderRadius: 5,
    border: `1px solid ${theme.v2.borders.lightGrey3}`,
  },
  recipientsText: {
    fontSize: 16,
    color: theme.v2.fonts.colors.blackShade1,
  },
  textfield: {
    paddingTop: "2%",
  },
  tableHeader: {
    fontSize: 16,
    fontWeight: 500,
    color: theme.v2.fonts.colors.darkFont,
    marginBottom: "2%",
  },
  tableRow: {
    border: `1px solid ${theme.v2.borders.lightGrey}`,
    borderRadius: 5,
    padding: "2% 0%",
  },
  tableCell: {
    fontSize: 16,
    color: theme.v2.fonts.colors.darkFont,
  },
  downloadBtn: {
    padding: "5%",
    border: `1px solid ${theme.v2.borders.lightGrey}`,
    borderRadius: 5,
    backgroundColor: theme.v2.backgrounds.whiteBackground,
    color: theme.v2.fonts.colors.darkFont,
    "&:hover": {
      backgroundColor: theme.v2.backgrounds.whiteBackground,
    },
  },
  cancelText: {
    fontSize: 16,
    color: theme.v2.fonts.blackShade1,
  },
  greenText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.greenShade4,
  },
  redText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.redShade1,
  },
  cancelSubBtn: {
    marginTop: "2%",
    backgroundColor: theme.v2.backgrounds.redBackground,
    padding: "1% 2%",
    fontSize: 18,
  },
  imageInitialsContainer: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: theme.v2.backgrounds.greenBackground,
  },
  imageInitials: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.v2.fonts.colors.blackShade1,
  },
  updatepaymentbtn: {
    width: 190,
    fontSize: 14,
    marginLeft: "4%",
    height: 50,
  },
  deletepaymentbtn: {
    width: 190,
    fontSize: 14,
    marginLeft: "4%",
    height: 50,
    backgroundColor: theme.v2.backgrounds.redBackground,
    "&:hover": {
      backgroundColor: theme.v2.backgrounds.redBackground,
    },
  },

  addingNewCardbtn: {
    width: 190,
    fontSize: 14,
    marginLeft: "4%",
    height: 50,
    backgroundColor: theme.v2.backgrounds.blueBackgroundShade1,
    "&:hover": {
      backgroundColor: theme.v2.backgrounds.blueBackgroundShade1,
    },
  },
  role: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Roboto",
    textAlign: "center",
    color: theme.v2.fonts.colors.blueShade1,
  },
  date: {
    fontSize: 12,
    fontFamily: "Roboto",
    textAlign: "center",
  },
  tableHeaderEx: {
    fontSize: 20,
    fontWeight: "bold",
    padding: "5% 0%",
    borderRadius: 10,
    textAlign: "center",
  },
  adminrole: {
    color: theme.v2.fonts.colors.greenShade2,
  },
  inspectorRole: {
    color: theme.v2.fonts.colors.redShade2,
  },
}));

const LicenseSubscription = (props) => {
  const classes = useStyles();
  const [showTick, setShowTick] = useState(false);
  const [error, setError] = useState({});
  const [email, setEmail] = useState();
  const [existingSubsc, setExistingSubsc] = useState({});
  const [invoiceRecipients, setInvoiceRecipients] = useState([]);
  const [isCancelled, setIsCancelled] = useState(false);
  const [cards, setCards] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [openDeleteConfirmation, setOpenDeleteConfirmtaion] = useState(false);
  const [
    openInvoiceRecipientConfirmation,
    setOpenInvoiceRecipientConfirmation,
  ] = useState(false);
  const [recipientSelected, setRecipientSelected] = useState();
  const [invoiceData, setInvoiceData] = useState();
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => JSON.parse(state.auth.profile));
  const groupId = _.get(profile, "group_id");
  const [deleteCardData, setDeleteCardData] = useState(null);
  const [expandExtraCharges, setExpandExtraCharges] = useState(false);
  const currDate = moment().utc();
  const no_plan = useSelector((state) => state.no_plan);

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

  const getInvoiceRecipients = useCallback(async () => {
    try {
      const result = await axios.get(
        `groups/${groupId}/invoicerecipients?p=group:${groupId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        setInvoiceRecipients(_.get(result, ["data", "message"]));
      }
    } catch (err) {}
  }, [token, groupId]);
  useEffect(() => {
    getInvoiceRecipients();
  }, [getInvoiceRecipients]);

  const isValidEmail = () => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(String(email).toLowerCase())) {
      setError({ email: "Invalid Email" });
      return false;
    }
    setError({});
    return true;
  };

  const sendInvitation = async () => {
    try {
      if (isValidEmail()) {
        const result = await axios.post(
          `groups/${groupId}/invoicerecipients?p=group:${groupId}`,
          {
            email,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (result.status === 200) {
          dispatch({
            type: SHOW_SUCCESS_MESSAGE,
            data: `The invitation is sent to the user`,
          });
          setEmail("");
          getInvoiceRecipients();
        }
      }
    } catch (err) {
      dispatch({
        type: SHOW_ERROR_MESSAGE,
        data:
          _.get(err, ["response", "data", "message"]) || "Something went wrong",
      });
    }
  };

  const removeInvoiceRecipient = async () => {
    const result = await axios.delete(
      `/groups/${groupId}/invoicerecipients/${recipientSelected}?p=group:${groupId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (result.status === 200) {
      getInvoiceRecipients();
    }
  };

  const cancelSubscription = async () => {
    const result = await axios.post(
      `/groups/${groupId}/cancelsubscription?p=group:${groupId}`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (result.status === 200) {
      setIsCancelled(_.get(result, ["data", "message", "is_cancelled"]));
    }
  };

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
        setCards(_.get(result, ["data", "message"]));
      }
    } catch (err) {}
  }, [groupId, token]);

  useEffect(() => {
    getCards();
  }, [getCards]);

  const dispatch = useDispatch();

  const getBillingHistory = useCallback(async () => {
    try {
      const result = await axios.get(
        `/groups/${groupId}/billinghistory?p=group:${groupId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        setBillingHistory(_.get(result, ["data", "message"]));
      }
    } catch (err) {}
  }, []);

  useEffect(() => {
    getBillingHistory();
  }, [getBillingHistory]);

  const inviteRecipientAgain = async (email) => {
    try {
      const result = await axios.post(
        `/groups/${groupId}/resendinvitation/${email}?p=group:${groupId}`,
        null,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (result.status === 200) {
        dispatch({
          type: SHOW_SUCCESS_MESSAGE,
          data: `The invitation is sent again to the user`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCardDetails = async () => {
    try {
      await axios.delete(
        `/groups/${groupId}/cards/${_.get(deleteCardData, [
          "id",
        ])}?p=group:${groupId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setCards((prev) =>
        prev.filter((card) => card.id !== _.get(deleteCardData, ["id"]))
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ConfirmationModal
        open={openInvoiceRecipientConfirmation}
        onCancel={() => {
          setOpenInvoiceRecipientConfirmation(false);
        }}
        header={`Are you sure you want to remove this invoice recipient?`}
        onConfirm={() => {
          removeInvoiceRecipient();
          setOpenInvoiceRecipientConfirmation(false);
        }}
      />
      <ConfirmationModal
        open={openDeleteConfirmation}
        onCancel={() => {
          setOpenDeleteConfirmtaion(false);
        }}
        header={`Are you sure you want to cancel your subscription?`}
        onConfirm={() => {
          cancelSubscription();
          setOpenDeleteConfirmtaion(false);
        }}
      />

      <ConfirmationModal
        open={deleteCardData}
        onCancel={() => {
          setDeleteCardData(null);
        }}
        header={`Are you sure you want to delete the card ending ${_.get(
          deleteCardData,
          ["card", "last4"]
        )}?`}
        onConfirm={() => {
          deleteCardDetails();
          setDeleteCardData(null);
        }}
      />
      {no_plan && (
        <div className={classes.root}>
          <div className={classes.paymentText}>No Plan subscribed</div>
          <Button
            onClick={() => {
              props.history.push(ROUTE_ACCOUNTS_SUBSCRIPTION);
            }}
            style={{
              borderRadius: 10,
            }}
          >
            Subscribe Now
          </Button>
        </div>
      )}
      {!no_plan && (
        <Grid container className={classes.root}>
          {invoiceData && (
            <InvoicesTemplate
              {...invoiceData}
              onClose={() => {
                setInvoiceData(null);
                dispatch({ type: HIDE_LOADER, data: 1 });
              }}
            />
          )}
          <Grid item xs={6}>
            <Grid item xs={12}>
              <Typography className={classes.header}>
                Current License Subscriptions
              </Typography>
            </Grid>
            <Grid item xs={12} container className={classes.firstSection}>
              <Grid item xs={12}>
                <Typography className={classes.firstSectionText}>
                  Next Billing Date
                </Typography>
                <Typography className={classes.firstSectionText}>
                  {existingSubsc.end_date
                    ? moment(existingSubsc.end_date).format("Do MMMM YYYY")
                    : moment().format("Do MMMM YYYY")}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.secondSection}>
              <Grid
                item
                xs={12}
                container
                justify="center"
                className={classes.subSection}
              >
                <Grid item xs={4}>
                  Description
                </Grid>
                <Grid item xs={2}>
                  Rate
                </Grid>
                <Grid item xs={2}>
                  Qty
                </Grid>
                <Grid item xs={3}>
                  Subtotal
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                container
                justify="center"
                className={classes.lineItem}
              >
                <Grid item xs={4}>
                  Admin license(s)
                </Grid>
                <Grid item xs={2}>
                  $&nbsp;{existingSubsc.admin_rate || "50.00"}
                </Grid>
                <Grid item xs={2}>
                  {existingSubsc.admins || 0}
                </Grid>
                <Grid item xs={3} container justify="center">
                  $&nbsp;
                  {(existingSubsc.admin_rate || 0) *
                    (existingSubsc.admins || 0)}
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                container
                justify="center"
                className={classes.lineItem}
              >
                <Grid item xs={4}>
                  Field license(s)
                </Grid>
                <Grid item xs={2}>
                  $&nbsp;{existingSubsc.field_user_rate || "20.00"}
                </Grid>
                <Grid item xs={2}>
                  {existingSubsc.field_users || 0}
                </Grid>
                <Grid item xs={3} container justify="center">
                  $&nbsp;
                  {(existingSubsc.field_user_rate || 0) *
                    (existingSubsc.field_users || 0)}
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                container
                justify="center"
                className={classes.lineItem}
                style={{ border: 0 }}
              >
                <Grid item xs={4}>
                  Inspector license(s)
                </Grid>
                <Grid item xs={2}>
                  $&nbsp;{existingSubsc.inspector_rate || "50.00"}
                </Grid>
                <Grid item xs={2}>
                  {existingSubsc.inspectors || 0}
                </Grid>
                <Grid item xs={3} container justify="center">
                  $&nbsp;
                  {(existingSubsc.inspector_rate || 0) *
                    (existingSubsc.inspectors || 0)}
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                container
                justify="space-around"
                className={classes.lineItemBold}
              >
                <Grid item xs={5}>
                  <Typography className={classes.totalTypo1}>
                    Extra Users Charge
                  </Typography>
                </Grid>
                <Grid item xs={5} container justify="flex-end">
                  <Typography className={classes.priceTypo1}>
                    $&nbsp;{existingSubsc.extra}&nbsp;
                  </Typography>

                  <Button
                    onClick={() => {
                      setExpandExtraCharges((prev) => !prev);
                    }}
                  >
                    {expandExtraCharges ? "Hide Details" : "View Details"}
                  </Button>
                </Grid>
              </Grid>
              <Collapse in={expandExtraCharges}>
                <Grid
                  item
                  xs={12}
                  container
                  justify="center"
                  className={classes.lineItemBold}
                >
                  <Grid item xs={3} className={classes.tableHeaderEx}>
                    Role
                  </Grid>
                  <Grid item xs={3} className={classes.tableHeaderEx}>
                    Name
                  </Grid>
                  <Grid item xs={3} className={classes.tableHeaderEx}>
                    Start{" "}
                  </Grid>
                  <Grid item xs={3} className={classes.tableHeaderEx}>
                    End
                  </Grid>

                  <br />
                  <br />

                  {existingSubsc &&
                    existingSubsc.activeUsers &&
                    existingSubsc.activeUsers.map((admin) => {
                      return (
                        <>
                          <Grid
                            item
                            xs={3}
                            className={clsx([
                              classes.role,
                              {
                                [classes.adminrole]: admin.role === "ADMIN",
                                [classes.inspectorRole]:
                                  admin.role === "INSPECTOR",
                              },
                            ])}
                          >
                            {admin.role}
                          </Grid>
                          <Grid item xs={3} className={classes.date}>
                            {_.get(admin, ["first_name"], "")}
                          </Grid>
                          <Grid item xs={3} className={classes.date}>
                            {moment(admin.start_date).format("MM/DD/YYYY")}
                          </Grid>
                          <Grid item xs={3} className={classes.date}>
                            {admin.end_date
                              ? moment(admin.end_date).format("MM/DD/YYYY")
                              : ""}
                          </Grid>
                        </>
                      );
                    })}
                </Grid>
              </Collapse>
              <Grid
                item
                xs={12}
                container
                justify="space-around"
                className={classes.lineItemBold}
              >
                <Grid item xs={5}>
                  <Typography className={classes.totalTypo}>Total</Typography>
                </Grid>
                <Grid item xs={5} container justify="flex-end">
                  <Typography className={classes.priceTypo}>
                    $&nbsp;
                    {(
                      Number(existingSubsc.total) + Number(existingSubsc.extra)
                    ).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>

              <Grid xs={12} item container justify="flex-end">
                <Button
                  disabled={
                    moment(existingSubsc.end_date).diff(moment(), "days") >= 1
                  }
                  style={{ width: 124, height: 50, fontSize: 18 }}
                  onClick={() => {
                    props.history.push(ROUTE_PAY_NOW);
                  }}
                >
                  Pay Now
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} />
          <Grid item xs={12}>
            <Typography className={classes.paymentText}>Payment</Typography>
          </Grid>
          {cards.map((card, index) => {
            return (
              <Grid
                item
                xs={12}
                container
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <img src={Card} alt="Card" />
                <Typography className={classes.visaText}>
                  Visa ending in{" "}
                  <strong>{_.get(card, ["card", "last4"])}</strong> expiring on{" "}
                  <strong>
                    {_.get(card, ["card", "exp_month"])}/
                    {_.get(card, ["card", "exp_year"])}
                  </strong>
                </Typography>

                <Button
                  className={classes.deletepaymentbtn}
                  onClick={setDeleteCardData.bind(this, { ...card, index })}
                >
                  <Typography className={classes.btnText}>
                    Delete Payment
                  </Typography>
                </Button>
              </Grid>
            );
          })}

          <Grid item xs={12}>
            <Typography className={classes.paymentText}>
              Invoice Recipients
            </Typography>
          </Grid>
          <Grid item xs={6} className={classes.recipientsContainer}>
            <Typography className={classes.recipientsText}>
              A copy of the invoice will be sent to the following recipients:
            </Typography>
            <TextField
              fullWidth={true}
              value={email}
              placeholder={"Add More Invoice Recipients"}
              className={classes.textfield}
              InputProps={{
                endAdornment: showTick && (
                  <img
                    src={RightTick}
                    alt="Save"
                    style={{ cursor: "pointer" }}
                    onClick={sendInvitation}
                  />
                ),
              }}
              onChange={(e) => {
                if (e.target.value.length > 0) {
                  setShowTick(true);
                  setEmail(e.target.value);
                } else {
                  setShowTick(false);
                  setEmail();
                }
              }}
              error={error.email}
              helperText={error.email && error.email}
            />
            {invoiceRecipients.map((recipient, index) => {
              return (
                <Grid
                  key={index}
                  container
                  style={{
                    paddingTop: "5%",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Grid
                    className={classes.imageInitialsContainer}
                    container
                    justify="center"
                    alignItems="center"
                    item
                  >
                    <Typography className={classes.imageInitials}>
                      {(_.get(recipient, ["email"]) || "")
                        .substring(0, 1)
                        .toUpperCase()}
                      {(_.get(recipient, ["email"]) || "")
                        .substring(1, 2)
                        .toUpperCase()}
                    </Typography>
                  </Grid>
                  <Grid item container xs={6} style={{ paddingLeft: "5%" }}>
                    <Grid item xs={12}>
                      {_.get(recipient, ["email"]) || ""}
                    </Grid>
                  </Grid>
                  <Grid item xs={4} container justify="flex-end">
                    {_.get(recipient, ["status"]) ==
                      INVOICE_RECIPIENTS_STATUS[0] && (
                      <Button
                        style={{ borderRadius: 5 }}
                        onClick={() => {
                          inviteRecipientAgain(_.get(recipient, ["email"]));
                        }}
                      >
                        Re Invite
                      </Button>
                    )}
                    &nbsp;
                    {index != 0 && (
                      <Button
                        style={{ borderRadius: 5 }}
                        onClick={() => {
                          setRecipientSelected(_.get(recipient, ["email"]));
                          setOpenInvoiceRecipientConfirmation(true);
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
          <Grid item xs={12} style={{ paddingTop: "5%" }}>
            <Typography className={classes.paymentText}>
              Billing History
            </Typography>
          </Grid>
          <Grid item xs={12} container style={{ paddingTop: "2%" }}>
            <Grid
              item
              xs={2}
              className={classes.tableHeader}
              container
              justify="center"
            >
              START DATE
            </Grid>
            <Grid
              item
              xs={2}
              className={classes.tableHeader}
              container
              justify="center"
            >
              END DATE
            </Grid>
            <Grid
              item
              xs={2}
              className={classes.tableHeader}
              container
              justify="center"
            >
              INVOICE ID
            </Grid>
            <Grid
              item
              xs={3}
              className={classes.tableHeader}
              container
              justify="center"
            >
              AMOUNT PAID
            </Grid>
            <Grid
              item
              xs={3}
              className={classes.tableHeader}
              container
              justify="center"
            >
              DOWNLOAD
            </Grid>
          </Grid>
          {billingHistory.map((item, index) => {
            return (
              <Grid
                key={index}
                item
                xs={12}
                container
                style={{ paddingTop: "2%" }}
                alignItems="center"
                className={classes.tableRow}
              >
                <Grid
                  item
                  xs={2}
                  className={classes.tableCell}
                  container
                  justify="center"
                >
                  {moment(_.get(item, "start_date")).format("YYYY-MM-DD")}
                </Grid>
                <Grid
                  item
                  xs={2}
                  className={classes.tableCell}
                  container
                  justify="center"
                >
                  {moment(_.get(item, "end_date")).format("YYYY-MM-DD")}
                </Grid>
                <Grid
                  item
                  xs={2}
                  className={classes.tableCell}
                  container
                  justify="center"
                >
                  {_.get(item, ["payment", "invoice_id"])}
                </Grid>
                <Grid
                  item
                  xs={3}
                  className={classes.tableCell}
                  container
                  justify="center"
                >
                  ${_.get(item, ["payment", "amount"])}
                </Grid>
                <Grid
                  item
                  xs={3}
                  className={classes.tableCell}
                  container
                  justify="center"
                >
                  <Button
                    variant="outlined"
                    className={classes.downloadBtn}
                    onClick={() => {
                      setInvoiceData(item);
                      dispatch({ type: SHOW_LOADER });
                    }}
                  >
                    DOWNLOAD
                  </Button>
                </Grid>
              </Grid>
            );
          })}
          <Grid item xs={12} style={{ paddingTop: "5%" }}>
            <Typography className={classes.paymentText}>
              Cancel Your Subscription
            </Typography>
          </Grid>
          {/* <Grid item xs={12}>
        <Typography className={classes.cancelText}>
          Canceling this subscription will greatly impact your account.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography className={classes.cancelText}>
          Please read further to see what will change. You can also modify your
          subscription to avoid cancelling your account.
        </Typography>
      </Grid>
      <Grid item xs={12} style={{ paddingTop: "3%" }}>
        <Typography className={classes.greenText}>Do's:</Typography>
      </Grid>
      <Grid item xs={12}>
        <ul>
          <li>View the details of your account</li>
          <li>Access your invoices</li>
          <li>
            Let the members you added keep access to their personal accounts
          </li>
        </ul>
      </Grid>
      <Grid item xs={12} style={{ paddingTop: "3%" }}>
        <Typography className={classes.redText}>Dont's:</Typography>
      </Grid>
      <Grid item xs={12}>
        <ul>
          <li>Edit or add new details to your account </li>
        </ul>
      </Grid> */}
          <Grid item xs={12}>
            <Button
              className={classes.cancelSubBtn}
              onClick={() => {
                if (!isCancelled) setOpenDeleteConfirmtaion(true);
                else cancelSubscription();
              }}
            >
              {isCancelled ? `Activate Subscription` : `Cancel Subscription`}
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default LicenseSubscription;
