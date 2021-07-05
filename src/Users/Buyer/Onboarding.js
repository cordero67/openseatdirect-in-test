import React, { useEffect, useState, Fragment } from "react";

import {
  API,
  PAYPAL_USE_SANDBOX,
  SUBSCRIPTION_PROMO_CODE_1,
  SUBSCRIPTION_PROMO_CODE_2,
  SUBSCRIPTION_PROMO_CODE_3,
  SUBSCRIPTION_PROMO_CODE_4,
  SUBSCRIPTION_PROMO_CODE_5,
} from "../../config";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Button, Popup } from "semantic-ui-react";

import { PayPalButton } from "react-paypal-button-v2";

import RadioForm from "./RadioForm";

import classes from "./BuyerAccount.module.css";

import Spinner from "../../components/UI/Spinner/SpinnerNew"; // experimental..

const Onboarding = (props) => {
  //console.log("PAYPAL_USE_SANDBOX: ", PAYPAL_USE_SANDBOX);
  //console.log("SUBSCRIPTION_PROMO_CODE_1: ", SUBSCRIPTION_PROMO_CODE_1);
  //console.log("SUBSCRIPTION_PROMO_CODE_2: ", SUBSCRIPTION_PROMO_CODE_2);
  //console.log("SUBSCRIPTION_PROMO_CODE_3: ", SUBSCRIPTION_PROMO_CODE_3);
  //console.log("SUBSCRIPTION_PROMO_CODE_4: ", SUBSCRIPTION_PROMO_CODE_4);
  //console.log("SUBSCRIPTION_PROMO_CODE_5: ", SUBSCRIPTION_PROMO_CODE_5);

  // UPDATE WHEN A NEW PLAN IS INTRODUCED
  const [values, setValues] = useState({
    accountName: "",
    accountEmail: "",
    accountPhone: "",
    accountUrl: "",
    ticketPlan: "tbd",
    inputError: "",
    paypal_plan_id: "P-3E209303AY287713HMDN3PLQ", // default value is production monthly plan
    paypal_plan_id_full: "", // default plan for "FULL" ticket plan selection view
    paypal_plan_id_discount: "", // default plan for "DISCOUNT" ticket plan selection view
    paypal_plan_id_forFree: "", // default plan for "FORFREE" ticket plan selection view
    paypal_plan_id_old: "", // default plan for "OLD" ticket plan selection view
    paypal_plan_id_oldDiscounted: "", // default plan for "OLDDISCOUNTED" ticket plan selection view
    paypal_plan_id_freeSubscription: "", // default plan for "FREESUBSCRIPTION" ticket plan selection view

    paypalExpress_client_id: "", // vendor's clientID not OSD's
    paypalExpress_client_secret: "", // vendor's secret not OSD's
  });

  console.log("values: ", values);

  const [promoCodeDetails, setPromoCodeDetails] = useState({
    available: false,
    applied: false,
    input: false,
    errorMessage: "",
    appliedPromoCode: "",
    inputtedPromoValue: "",
    lastInvalidPromoCode: "",
    // UPDATE WHEN A NEW PROMO CODE IS CREATED
    eventPromoCodes: [
      SUBSCRIPTION_PROMO_CODE_1,
      SUBSCRIPTION_PROMO_CODE_2,
      SUBSCRIPTION_PROMO_CODE_3,
      SUBSCRIPTION_PROMO_CODE_4,
      SUBSCRIPTION_PROMO_CODE_5,
    ],
  });

  // summary, organization, ticket, payment, receipt, paypal, completed, failedFetch
  const [pageView, setPageView] = useState("summary");
  const [preFetchView, setPreFetchView] = useState("");
  const [loading, setLoading] = useState("false");

  //const [isDisabled, setIsDisabled] = useState(true)
  const {
    accountName,
    accountEmail,
    accountPhone,
    accountUrl,
    ticketPlan,
    paypal_plan_id,
    paypal_plan_id_full,

    paypal_plan_id_discount,
    paypal_plan_id_forFree,
    paypal_plan_id_old,
    paypal_plan_id_oldDiscounted,
    paypal_plan_id_freeSubscription,
    paypalExpress_client_id,
    paypalExpress_client_secret,
  } = values;

  /*
  const getStatus = () => {
    let tempData = JSON.parse(localStorage.getItem("user"));
    console.log("tempData: ", tempData);
    if (
      "user" in tempData &&
      "accountId" in tempData.user &&
      "status" in tempData.user.accountId
    ) {
      console.log(
        "tempData.data.accountId.status: ",
        tempData.user.accountId.status
      );
      return tempData.user.accountId.status;
    } else {
      return 0;
    }
  };
*/

  // THIS FUNCTION LOOKS GOOD BUT NOT 100% CONFIRMED
  const getStatus = () => {
    console.log("Entering 'getStatus'");
    let tempData = JSON.parse(localStorage.getItem("user"));
    if ("user" in tempData && "accountId" in tempData.user) {
      let tempAccountId = tempData.user.accountId;
      console.log("accountId: ", tempAccountId);
      let hasLinkIds = false;
      let hasPaid = false;
      if (tempAccountId.ticketPlan === "free") {
        console.log("RETURNING A 7");
        return 7;
      }
      if (tempAccountId.ticketPlan === "comp") {
        hasPaid = true;
      }
      if (
        "paymentGatewayType" in tempAccountId &&
        tempAccountId.paymentGatewayType === "PayPalExpress" &&
        "paypalExpress_client_id" in tempAccountId &&
        "string" === typeof tempAccountId.paypalExpress_client_id
      ) {
        // has filled out paypal ClientId
        hasLinkIds = true;
      }
      if (
        "paymentGatewayType" in tempAccountId &&
        tempAccountId.paymentGatewayType === "PayPalMarketplace" &&
        "paypal_merchant_id" in tempAccountId &&
        "string" === typeof tempAccountId.paypal_merchant_id
      ) {
        // has filled out paypal MerchantId
        hasLinkIds = true;
      }
      if (
        "paypal_plan_id" in tempAccountId &&
        "string" === typeof tempAccountId.paypal_plan_id &&
        "accountPaymentStatus" in tempAccountId &&
        tempAccountId.accountPaymentStatus === "good"
      ) {
        hasPaid = true;
      }
      if (!hasPaid && !hasLinkIds) {
        //setAccountType("buyer");
        console.log("RETURNING A 4a");
        return 4;
      }
      if (!hasPaid && hasLinkIds) {
        //setAccountType("buyer");
        console.log("RETURNING A 5");
        return 5;
      }
      if (hasPaid && !hasLinkIds) {
        //setAccountType("buyer");
        console.log("RETURNING A 6");
        return 6;
      }
      if (hasPaid && hasLinkIds) {
        //setAccountType("issuer");
        console.log("RETURNING A 8");
        return 8;
      }
      //setAccountType("buyer");
      console.log("RETURNING A 4b");
      return 4;
    } else return 0;
  };

  let subscriptions;

  // THIS LOOKS GOOD EXCEPT FOR FREE YEAR PLAN ID
  // UPDATE WHEN A NEW PLAN IS INTRODUCED
  if (PAYPAL_USE_SANDBOX === true) {
    // PRODUCTION subscription plans (there are no Sandbox plans)
    subscriptions = {
      monthly: {
        name: "$15 monthly",
        id: "P-3E209303AY287713HMDN3PLQ", // OSD PayPal Production subscription
      },
      annually: {
        name: "$169 annually",
        id: "P-9P586954FE0229727MDN3RMQ", // OSD PayPal Production subscription
      },
      monthlyDiscounted: {
        name: "$15 monthly: 6 weeks free",
        id: "P-3MM32159H2853152CMDN3T6Q", // OSD PayPal Production subscription
      },
      annuallyDiscounted: {
        name: "$149 annually: discounted",
        id: "P-41592191WY6636644MDN3VOY", // OSD PayPal Production subscription
      },
      monthlyFreeTrial: {
        name: "$15 monthly: 3 months free",
        id: "P-0VY95999WV5246104MDOLPKI", // OSD PayPal Production subscription
      },
      annuallyOldPrice: {
        name: "$70 annually",
        id: "P-2K587859D1613454MMDOIAHA", // OSD PayPal Production subscription
      },
      annuallyOldPriceDiscounted: {
        name: "$50 annually",
        id: "P-74091125HK783123JMDOLLEA", // OSD PayPal Production subscription
      },
      freeSubscription: {
        name: "FREE SUBSCRIPTION",
        id: "", // OSD PayPal Production subscription
      },
      clientId:
        "ATOAhgR1qrhz7xQRVHyyyBnj73Ckga6swyGU-8gxFhyJRrkZgEYzaUhTwQx3BmF71lM-oiJC9VelNZDw", // OSD PayPal Production ClientId
    };
  } else {
    // PRODUCTION subscription plans
    subscriptions = {
      monthly: {
        name: "$15 monthly",
        id: "P-3E209303AY287713HMDN3PLQ", // OSD PayPal Production subscription
      },
      annually: {
        name: "$169 annually",
        id: "P-9P586954FE0229727MDN3RMQ", // OSD PayPal Production subscription
      },
      monthlyDiscounted: {
        name: "$15 monthly: 6 weeks free",
        id: "P-3MM32159H2853152CMDN3T6Q", // OSD PayPal Production subscription
      },
      annuallyDiscounted: {
        name: "$149 annually: discounted",
        id: "P-41592191WY6636644MDN3VOY", // OSD PayPal Production subscription
      },
      monthlyFreeTrial: {
        name: "$15 monthly: 3 months free",
        id: "P-0VY95999WV5246104MDOLPKI", // OSD PayPal Production subscription
      },
      annuallyOldPrice: {
        name: "$70 annually",
        id: "P-2K587859D1613454MMDOIAHA", // OSD PayPal Production subscription
      },
      annuallyOldPriceDiscounted: {
        name: "$50 annually",
        id: "P-74091125HK783123JMDOLLEA", // OSD PayPal Production subscription
      },
      freeSubscription: {
        name: "FREE SUBSCRIPTION",
        id: "", // OSD PayPal subscription
      },
      clientId:
        "ATOAhgR1qrhz7xQRVHyyyBnj73Ckga6swyGU-8gxFhyJRrkZgEYzaUhTwQx3BmF71lM-oiJC9VelNZDw", // OSD PayPal Production ClientId
    };
  }

  const updatePageView = () => {
    if (getStatus() === 0) {
      setPageView("summary");
    } else if (getStatus() === 4) {
      setPageView("ticket");
    } else if (getStatus() === 5) {
      setPageView("ticket");
    } else if (getStatus() === 6) {
      setPageView("paypal");
    } else if (getStatus() === 7 || getStatus() === 8) {
      setPageView("completed");
    }
  };

  // edit so that it is driven by the "status" value
  // only used by useEffect to populate the "values" object
  const updateValues = () => {
    let tempUser = JSON.parse(localStorage.getItem("user"));
    console.log("tempUser: ", tempUser);
    console.log("tempUser.user: ", tempUser.user);
    console.log("tempUser.user.accountId: ", tempUser.user.accountId);
    if ("user" in tempUser && "accountId" in tempUser.user) {
      let tempBuyerInfo = {};
      // populates the "tempBuyerInfo" (and "values") object with "user" object info
      if (tempUser.user.accountId.accountName)
        tempBuyerInfo.accountName = tempUser.user.accountId.accountName;

      if (tempUser.user.accountId.accountEmail)
        tempBuyerInfo.accountEmail = tempUser.user.accountId.accountEmail;

      if (tempUser.user.accountId.accountPhone)
        tempBuyerInfo.accountPhone = tempUser.user.accountId.accountPhone;

      if (tempUser.user.accountId.accountUrl)
        tempBuyerInfo.accountUrl = tempUser.user.accountId.accountUrl;

      if (tempUser.user.accountId.status)
        tempBuyerInfo.status = tempUser.user.accountId.status;

      if (tempUser.user.accountId.ticketPlan)
        tempBuyerInfo.ticketPlan = tempUser.user.accountId.ticketPlan;

      if (tempUser.user.accountId.paypalExpress_client_id)
        tempBuyerInfo.paypalExpress_client_id =
          tempUser.user.accountId.paypalExpress_client_id;

      if (tempUser.user.accountId.paypalExpress_client_secret)
        tempBuyerInfo.paypalExpress_client_secret =
          tempUser.user.accountId.paypalExpress_client_secret;

      if (PAYPAL_USE_SANDBOX === true) {
        console.log(
          "PAYPAL_USE_SANDBOX is ",
          PAYPAL_USE_SANDBOX,
          " Sandbox true"
        );
        tempBuyerInfo.paypal_plan_id_full = "P-3E209303AY287713HMDN3PLQ"; // production monthly full price
        tempBuyerInfo.paypal_plan_id_discount = "P-3MM32159H2853152CMDN3T6Q"; // production monthly discounted price
        tempBuyerInfo.paypal_plan_id_forFree = "P-0VY95999WV5246104MDOLPKI"; // production monthly 3 months free
        tempBuyerInfo.paypal_plan_id_old = "P-2K587859D1613454MMDOIAHA"; // production old annually full price
        tempBuyerInfo.paypal_plan_id_oldDiscounted =
          "P-74091125HK783123JMDOLLEA"; // production monthly full price
        tempBuyerInfo.paypal_plan_id_freeSubscription = ""; // production FREE SUBSCRIPTION no PayPal
        if (!tempUser.user.accountId.paypal_plan_id) {
          tempBuyerInfo.paypal_plan_id = "P-3E209303AY287713HMDN3PLQ"; // production monthly full price
        } else {
          tempBuyerInfo.paypal_plan_id = tempUser.user.accountId.paypal_plan_id;
        }
      } else {
        console.log(
          "PAYPAL_USE_SANDBOX is ",
          PAYPAL_USE_SANDBOX,
          " Sandbox false"
        );
        tempBuyerInfo.paypal_plan_id_full = "P-3E209303AY287713HMDN3PLQ"; // production monthly full price
        tempBuyerInfo.paypal_plan_id_discount = "P-3MM32159H2853152CMDN3T6Q"; // production monthly discounted price
        tempBuyerInfo.paypal_plan_id_forFree = "P-0VY95999WV5246104MDOLPKI"; // production monthly 3 months free
        tempBuyerInfo.paypal_plan_id_old = "P-2K587859D1613454MMDOIAHA"; // production old annually full price
        tempBuyerInfo.paypal_plan_id_oldDiscounted =
          "P-74091125HK783123JMDOLLEA"; // production monthly full price
        tempBuyerInfo.paypal_plan_id_freeSubscription = ""; // production FREE SUBSCRIPTION no PayPal
        if (!tempUser.user.accountId.paypal_plan_id) {
          tempBuyerInfo.paypal_plan_id = "P-3E209303AY287713HMDN3PLQ"; // production monthly full price
        } else {
          tempBuyerInfo.paypal_plan_id = tempUser.user.accountId.paypal_plan_id;
        }
      }

      setValues(tempBuyerInfo);
      console.log("tempBuyerInfo: ", tempBuyerInfo);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      updateValues();
      updatePageView();
    } else {
      window.location.href = "/auth";
    }
    setLoading(false);
  }, []);

  // api static variables
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const authstring = `Bearer ${props.token}`;
  myHeaders.append("Authorization", authstring);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const radioChange = (event, value, name) => {
    let tempValues = { ...values };
    tempValues[name] = value.value;
    console.log("tempValues: ", tempValues);
    console.log("tempValues.paypal_plan_id: ", tempValues.paypal_plan_id);
    setValues(tempValues);
    console.log("values: ", values);
  };

  // THIS ASSIGNS THE "paypal_plan_id" VARIABLE TO THE SELECTED PLAN
  const radioChangePayment = (event, value, name) => {
    let tempValues = { ...values };
    tempValues[name] = value.value;
    tempValues.paypal_plan_id = value.value;
    console.log("tempValues: ", tempValues);
    setValues(tempValues);
  };

  const ticketPlans = [
    { label: "Free Tickets: up to 500 free tickets per month", value: "free" },
    {
      label: "Paid Tickets: unlimited amount of paid and free tickets",
      value: "basicPaidQuarter",
    },
  ];

  // UPDATED FROM HERE
  // Detailed definition of subscription plans based on promo code entered
  // No promo code plans: DEFAULT SUBSCRIPTIONS
  const paymentPlans = [
    { label: subscriptions.monthly.name, value: subscriptions.monthly.id },
    { label: subscriptions.annually.name, value: subscriptions.annually.id },
  ];

  // OSD20 promo code plans
  const discountPlans = [
    {
      label: subscriptions.monthlyDiscounted.name,
      value: subscriptions.monthlyDiscounted.id,
    },
    {
      label: subscriptions.annuallyDiscounted.name,
      value: subscriptions.annuallyDiscounted.id,
    },
  ];

  // TRYFORFREE promo code plans
  const tryForFreePlan = [
    {
      label: subscriptions.monthlyFreeTrial.name,
      value: subscriptions.monthlyFreeTrial.id,
    },
  ];

  // OSD70 promo code plans
  const oldAnnualPlan = [
    {
      label: subscriptions.annuallyOldPrice.name,
      value: subscriptions.annuallyOldPrice.id,
    },
  ];

  // OSD50 promo code plans
  const oldAnnualDiscountedPlan = [
    {
      label: subscriptions.annuallyOldPriceDiscounted.name,
      value: subscriptions.annuallyOldPriceDiscounted.id,
    },
  ];

  // OSDFREE promo code plans
  const freeSubscriptionPlan = [
    {
      label: subscriptions.freeSubscription.name,
      value: subscriptions.freeSubscription.id,
    },
  ];

  // Determines pricing plans details to display based on promo code entered
  const shownPlans = () => {
    if (promoCodeDetails.appliedPromoCode === SUBSCRIPTION_PROMO_CODE_1) {
      return discountPlans;
    } else if (
      promoCodeDetails.appliedPromoCode === SUBSCRIPTION_PROMO_CODE_2
    ) {
      return tryForFreePlan;
    } else if (
      promoCodeDetails.appliedPromoCode === SUBSCRIPTION_PROMO_CODE_3
    ) {
      return oldAnnualPlan;
    } else if (
      promoCodeDetails.appliedPromoCode === SUBSCRIPTION_PROMO_CODE_4
    ) {
      return oldAnnualDiscountedPlan;
    } else if (
      promoCodeDetails.appliedPromoCode === SUBSCRIPTION_PROMO_CODE_5
    ) {
      return freeSubscriptionPlan;
    } else return paymentPlans;
  };
  // UPDATED TO HERE

  // UPDATE WHEN A NEW PLAN IS INTRODUCED BY ADDING A NEW '<RadioForm>' CODE
  // Displays subscription pricing options section based on promo code entered
  const paymentPanel = () => {
    console.log("Values info: ", values);
    if (promoCodeDetails.appliedPromoCode === "OSD20") {
      return (
        <Fragment>
          <RadioForm
            details={shownPlans()}
            group="eventTypeGroup"
            current={paypal_plan_id_discount}
            change={(event, value) => {
              radioChangePayment(event, value, "paypal_plan_id_discount");
            }}
          />
          <br></br>
          {ticketPlan !== "free" && paypal_plan_id ? showPayPal : null}
        </Fragment>
      );
    } else if (promoCodeDetails.appliedPromoCode === "TRYFORFREE") {
      console.log("paypal_plan_id_forFree: ", paypal_plan_id_forFree);
      return (
        <Fragment>
          <RadioForm
            details={shownPlans()}
            group="eventTypeGroup"
            current={paypal_plan_id_forFree}
            change={(event, value) => {
              radioChangePayment(event, value, "paypal_plan_id_forFree");
            }}
          />
          <br></br>
          {ticketPlan !== "free" && paypal_plan_id ? showPayPal : null}
        </Fragment>
      );
    } else if (promoCodeDetails.appliedPromoCode === "OSD70") {
      return (
        <Fragment>
          <RadioForm
            details={shownPlans()}
            group="eventTypeGroup"
            current={paypal_plan_id_old}
            change={(event, value) => {
              radioChangePayment(event, value, "paypal_plan_id_old");
            }}
          />
          <br></br>
          {ticketPlan !== "free" && paypal_plan_id ? showPayPal : null}
        </Fragment>
      );
    } else if (promoCodeDetails.appliedPromoCode === "OSD50") {
      return (
        <Fragment>
          <RadioForm
            details={shownPlans()}
            group="eventTypeGroup"
            current={paypal_plan_id_oldDiscounted}
            change={(event, value) => {
              radioChangePayment(event, value, "paypal_plan_id_oldDiscounted");
            }}
          />
          <br></br>
          {ticketPlan !== "free" && paypal_plan_id ? showPayPal : null}
        </Fragment>
      );
    } else if (promoCodeDetails.appliedPromoCode === "OSDFREE") {
      return (
        <Fragment>
          <RadioForm
            details={shownPlans()}
            group="eventTypeGroup"
            current={paypal_plan_id_freeSubscription}
            change={(event, value) => {
              radioChangePayment(
                event,
                value,
                "paypal_plan_id_freeSubscription"
              );
            }}
          />
          <br></br>
          {ticketPlan !== "free" && paypal_plan_id ? (
            showPayPal
          ) : (
            <div style={{ textAlign: "center", paddingTop: "20px" }}>
              <button
                className={classes.ButtonGreen}
                onClick={() => {
                  //setPageView("paypal");
                  submitFreeSub();
                }}
              >
                CONFIRM SELECTION
              </button>
            </div>
          )}
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <RadioForm
            details={shownPlans()}
            group="eventTypeGroup"
            current={paypal_plan_id_full}
            change={(event, value) => {
              radioChangePayment(event, value, "paypal_plan_id_full");
            }}
          />
          <br></br>
          {ticketPlan !== "free" && paypal_plan_id ? showPayPal : null}
        </Fragment>
      );
    }
  };

  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  const submitFreeSub = () => {
    let tempData = JSON.parse(localStorage.getItem("user"));
    let accountNum = tempData.user.accountId.accountNum;
    console.log("tempData: ", tempData);
    const authstring = `Bearer ${props.token}`;
    //"/accounts/:accountNum/subscription/payosd"
    fetch(`${API}/accounts/${accountNum}/subscription/payosd`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authstring,
      },
      body: JSON.stringify({
        promo: "OSDFREE",
      }),
    })
      .then(handleErrors)
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        // first show a success model with a continue button to go to paypal clientId model
        if (response.status) {
          console.log("fetch return got back data on organization:", response);
          let tempData = JSON.parse(localStorage.getItem("user"));
          console.log("tempData: ", tempData);
          tempData.user.accountId = response.result;
          localStorage.setItem("user", JSON.stringify(tempData));
          setPageView("receipt");
        } else {
          setPageView("receiptErrorPage");
        }
      }) // add .catch block for failed response from server, press "continue" button to go to paypal clientId model
      .catch((err) => {
        setPageView("receiptErrorPage");
      });
  };

  // THIS LOOKS GOOD
  // change plan_id value to be a variable value depending on $10 or $35 choice, right now its the same
  const showPayPal = (
    <div>
      <br></br>
      <PayPalButton
        onButtonReady={() => {}}
        createSubscription={(data, actions) => {
          return actions.subscription.create({
            plan_id: paypal_plan_id,
          });
        }}
        onCancel={(data) => {
          console.log("onCancel 'data': ", data);
        }}
        onApprove={(data, actions) => {
          return actions.subscription
            .get()
            .then(function (details) {
              console.log("details: ", details);
              const authstring = `Bearer ${props.token}`;
              console.log("about to send paypal object to server");
              return fetch(`${API}/paypal/subscription/${props.userid}`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: authstring,
                },
                body: JSON.stringify({
                  data: data,
                  details: details,
                }),
              })
                .then(handleErrors)
                .then((response) => {
                  return response.json();
                })
                .then((response) => {
                  // first show a success model with a continue button to go to paypal clientId model
                  if (response.status) {
                    console.log(
                      "fetch return got back data on organization:",
                      response
                    );
                    let tempData = JSON.parse(localStorage.getItem("user"));
                    console.log("tempData: ", tempData);
                    tempData.user.accountId = response.result;
                    localStorage.setItem("user", JSON.stringify(tempData));
                    setPageView("receipt");
                  } else {
                    setPageView("receiptErrorPage");
                  }
                }) // add .catch block for failed response from server, press "continue" button to go to paypal clientId model
                .catch((err) => {
                  setPageView("receiptErrorPage");
                });
            })
            .catch((err) => {
              window.alert("Problem with Paypal.");
            });
        }}
        onError={(err) => {
          console.log("error occurs: ", err);
          window.alert("Problem connecting with PayPal. Please try again.");
        }}
        options={{
          clientId: subscriptions.clientId,
          currency: "USD",
          vault: true,
        }}
        catchError={(err) => {
          console.log("error occurs: ", err);
          window.alert("Problem connecting with PayPal. Please try again.");
        }}
      />
    </div>
  );

  const summaryPage = () => {
    return (
      <div className={classes.DisplayPanel} style={{ textAlign: "center" }}>
        <div className={classes.SummaryHeader}>
          3 easy steps to start selling tickets and receiving your cash now!
        </div>
        <div
          style={{
            border: "1px solid #2F5596",
            backgroundColor: "#EFF3FA",
            marginLeft: "180px",
            marginRight: "180px",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          <div
            className={classes.SummaryGridTitle}
            style={{ fontWeight: "500" }}
          >
            <div>Step 1</div>
            <div>Step 2</div>
            <div>Step 3</div>
          </div>
          <div className={classes.SummaryGrid}>
            <div>Provide Minimal</div>
            <div>Select a</div>
            <div>Create Your</div>
          </div>
          <div className={classes.SummaryGrid}>
            <div>Organization Info</div>
            <div>Ticket Plan</div>
            <div>First Event</div>
          </div>
        </div>
        <div className={classes.SummaryFooter}>
          If you have 10 minutes to spare, you have time to sign up now.
        </div>

        <button
          className={classes.ButtonGreen}
          style={{ width: "630px" }}
          onClick={() => {
            setPageView("organization");
          }}
        >
          START EVENT CREATOR SIGNUP
        </button>
      </div>
    );
  };

  const orgPage = () => {
    return (
      <div className={classes.DisplayPanel}>
        <div
          style={{
            paddingTop: "40px",
            paddingBottom: "20px",
            paddingLeft: "80px",
            fontSize: "22px",
            fontWeight: "600",
          }}
        >
          Step 1: Basic Information about your Organization
        </div>
        <div className={classes.VendorCanvas}>
          <div
            style={{
              paddingTop: "10px",
              paddingBottom: "20px",
              width: "420px",
              height: "85px",
            }}
          >
            <label style={{ width: "420px", fontSize: "15px" }}>
              Organization Name<span style={{ color: "red" }}>*</span>
            </label>
            <input
              onFocus={() => {
                setValues({ ...values, inputError: "" });
              }}
              style={{
                border: "1px solid #8DADD4",
                borderRadius: "0px",
                backgroundColor: "#EFF3FA",
                width: "420px",
                height: "40px",
                paddingLeft: "10px",
              }}
              type="text"
              name="accountName"
              onChange={handleChange}
              value={accountName}
            />
          </div>

          <div
            style={{ paddingBottom: "20px", width: "420px", height: "85px" }}
          >
            <label style={{ width: "420px", fontSize: "15px" }}>
              Organization E-mail Address
            </label>
            <input
              onFocus={() => {
                setValues({ ...values, inputError: "" });
              }}
              style={{
                border: "1px solid #8DADD4",
                borderRadius: "0px",
                backgroundColor: "#EFF3FA",
                width: "420px",
                height: "40px",
                paddingLeft: "10px",
              }}
              type="text"
              name="accountEmail"
              onChange={handleChange}
              value={accountEmail}
            />
          </div>

          <div
            style={{ paddingBottom: "20px", width: "420px", height: "85px" }}
          >
            <label style={{ width: "420px", fontSize: "15px" }}>
              Organization Phone or Cell Number
            </label>
            <input
              onFocus={() => {
                setValues({ ...values, inputError: "" });
              }}
              style={{
                border: "1px solid #8DADD4",
                borderRadius: "0px",
                backgroundColor: "#EFF3FA",
                width: "420px",
                height: "40px",
                paddingLeft: "10px",
              }}
              type="text"
              name="accountPhone"
              onChange={handleChange}
              value={accountPhone}
            />
          </div>

          <div
            style={{ paddingBottom: "20px", width: "420px", height: "85px" }}
          >
            <label style={{ width: "420px", fontSize: "15px" }}>
              Organization Website
            </label>
            <input
              onFocus={() => {
                setValues({ ...values, inputError: "" });
              }}
              style={{
                border: "1px solid #8DADD4",
                borderRadius: "0px",
                backgroundColor: "#EFF3FA",
                width: "420px",
                height: "40px",
                paddingLeft: "10px",
              }}
              type="text"
              name="accountUrl"
              onChange={handleChange}
              value={accountUrl}
            />
          </div>
          <br></br>
          <div style={{ textAlign: "center", width: "420px", height: "85px" }}>
            <button
              className={classes.ButtonGreen}
              disabled={!accountName}
              onClick={() => {
                let methodType;
                if (getStatus() === 0) {
                  methodType = "POST";
                } else {
                  methodType = "PATCH";
                }
                console.log("methodType: ", methodType);
                let url = `${API}/account/${props.userid}`;
                let fetcharg = {
                  method: methodType,
                  headers: myHeaders,
                  body: JSON.stringify({
                    accountName: accountName,
                    accountEmail: accountEmail,
                    accountPhone: accountPhone,
                    accountUrl: accountUrl,
                  }),
                };
                console.log("fetching with: ", url, fetcharg);
                fetch(url, fetcharg)
                  .then(handleErrors)
                  .then((response) => {
                    console.log("then response: ", response);
                    return response.json();
                  })
                  .then((data) => {
                    console.log(
                      "fetch return got back data on organization:",
                      data
                    );

                    let tempData = JSON.parse(localStorage.getItem("user"));
                    console.log("tempData: ", tempData);
                    tempData.user.accountId = data.result;
                    localStorage.setItem("user", JSON.stringify(tempData));
                    if (data.status) {
                      switch (data.result.status) {
                        case 4:
                        case 5:
                          setPageView("ticket");
                          break;
                        case 6:
                          setPageView("payment");
                          break;
                        case 7:
                          setPageView("completed");
                          break;
                        case 8:
                          setPageView("completed");
                          break;
                        case 0:
                        default:
                          setPageView("summary");
                      }
                    } else {
                      // this is a frieldly error
                      let errmsg = "DEFAULT MESSAGE - Please try again";
                      if (data.message) {
                        errmsg = data.message;
                      }
                      window.alert(errmsg);
                    }
                  })
                  .catch((err) => {
                    setPreFetchView(pageView);
                    console.log(err);
                    setPageView("error");
                  });
              }}
            >
              SUBMIT YOUR ORGANIZATION INFORMATION
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ticketPageButton = () => {
    console.log("eventDetails.tickets");
    if (ticketPlan === "free") {
      return (
        <button
          className={classes.ButtonGreen}
          onClick={() => {
            let url = `${API}/account/${props.userid}`;
            let fetcharg = {
              method: "PATCH",
              headers: myHeaders,
              body: JSON.stringify({
                ticketPlan: ticketPlan,
              }),
            };
            console.log("fetching with: ", url, fetcharg);
            fetch(url, fetcharg)
              .then(handleErrors)
              .then((response) => {
                console.log("then response: ", response);
                return response.json();
              })
              .then((data) => {
                console.log("fetch return got back data on Free ticket:", data);

                let tempData = JSON.parse(localStorage.getItem("user"));
                console.log("tempData: ", tempData);
                tempData.user.accountId = data.result;
                localStorage.setItem("user", JSON.stringify(tempData));

                if (data.status) {
                  switch (data.result.status) {
                    case 4:
                    case 5:
                      setPageView("ticket");
                      break;
                    case 6:
                      setPageView("payment");
                      break;
                    case 7:
                      setPageView("completed");
                      break;
                    case 8:
                      setPageView("completed");
                      break;
                    case 0:
                    default:
                      setPageView("summary");
                  }
                } else {
                  // this is a frieldly error
                  let errmsg = "There was a error. please retry";
                  if (data.message) {
                    errmsg = data.message;
                  }
                }
              })
              .catch((err) => {
                setPreFetchView(pageView);
                console.log(err);
                setPageView("error");
              });
          }}
        >
          SUBMIT YOUR TICKET PLAN SELECTION
        </button>
      );
    } else if (ticketPlan === "basicPaidQuarter") {
      return (
        <button
          className={classes.ButtonGreen}
          onClick={() => {
            setPageView("payment");
          }}
        >
          SUBMIT YOUR TICKET PLAN SELECTION
        </button>
      );
    } else {
      return (
        <button className={classes.ButtonGreenOpac}>
          SUBMIT YOUR TICKET PLAN SELECTION
        </button>
      );
    }
  };

  const ticketPage = () => {
    return (
      <div className={classes.DisplayPanel}>
        <div>
          <div
            style={{
              paddingTop: "40px",
              paddingBottom: "30px",
              paddingLeft: "80px",
              fontSize: "22px",
              fontWeight: "600",
            }}
          >
            Step 2: Select a Ticket Plan
          </div>
          <div className={classes.PaymentCanvas}>
            <RadioForm
              details={ticketPlans}
              group="eventTypeGroup"
              current={ticketPlan}
              change={(event, value) => radioChange(event, value, "ticketPlan")}
            />
            <br></br>
            <br></br>
            <div
              style={{
                textAlign: "center",
                width: "420px",
                height: "85px",
                paddingLeft: "1px",
              }}
            >
              {ticketPageButton()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // THIS LOOKS GOOD
  const amendPromoCodeDetails = (inputtedPromoCode, promoCodeDetails) => {
    let tempPromoCodeDetails = { ...promoCodeDetails };
    tempPromoCodeDetails.applied = true;
    tempPromoCodeDetails.errorMessage = "Valid Promo Code";
    tempPromoCodeDetails.appliedPromoCode = inputtedPromoCode;
    tempPromoCodeDetails.inputtedPromoCode = "";
    tempPromoCodeDetails.lastInvalidPromoCode = "";
    console.log("UPDATED 'promoCodeDetails': ", tempPromoCodeDetails);
    return tempPromoCodeDetails;
  };

  // updates "promoCodeDetails", "ticketInfo" and "orderTotals" based on promo code change
  const applyPromoCodeHandler = (event, inputtedPromoCode) => {
    // first check if promo code is valid
    if (promoCodeDetails.eventPromoCodes.includes(inputtedPromoCode)) {
      console.log("valid code");
      setPromoCodeDetails(
        amendPromoCodeDetails(inputtedPromoCode, promoCodeDetails)
      );
      let tempValues = { ...values };
      // set "paypal_plan_id" to default value of that particular promo code
      if (inputtedPromoCode === "OSD20") {
        tempValues.paypal_plan_id = tempValues.paypal_plan_id_discount;
      } else if (inputtedPromoCode === "TRYFORFREE") {
        tempValues.paypal_plan_id = tempValues.paypal_plan_id_forFree;
      } else if (inputtedPromoCode === "OSD70") {
        tempValues.paypal_plan_id = tempValues.paypal_plan_id_old;
      } else if (inputtedPromoCode === "OSD50") {
        tempValues.paypal_plan_id = tempValues.paypal_plan_id_oldDiscounted;
      } else if (inputtedPromoCode === "OSDFREE") {
        tempValues.paypal_plan_id = "";
      } else {
        tempValues.paypal_plan_id = tempValues.paypal_plan_id_full;
      }
      setValues(tempValues);
    } else {
      let tempobject = { ...promoCodeDetails };
      tempobject.errorMessage = "Sorry, that promo code is invalid";
      tempobject.lastInvalidPromoCode = inputtedPromoCode;
      setPromoCodeDetails(tempobject);
    }
  };

  // THIS LOOKS GOOD
  const inputPromoCode = () => {
    if (promoCodeDetails.errorMessage === "Sorry, that promo code is invalid") {
      return (
        <Fragment>
          <div className={[classes.PromoGrid, classes.Red].join(" ")}>
            <input
              type="text"
              id="input box"
              className={classes.PromoCodeInputBoxRed}
              value={promoCodeDetails.inputtedPromoValue}
              onChange={(event) => {
                let tempobject = { ...promoCodeDetails };
                tempobject.inputtedPromoValue = event.target.value;
                tempobject.errorMessage = "";
                setPromoCodeDetails(tempobject);
              }}
            ></input>
            <button
              className={classes.PromoCodeButtonRed}
              onClick={(event) => {
                applyPromoCodeHandler(
                  event,
                  promoCodeDetails.inputtedPromoValue.toUpperCase()
                );
                let temp = { ...promoCodeDetails };
                temp.inputtedPromoValue = "";
                temp.errorMessage = "";
                setPromoCodeDetails(temp);
              }}
            >
              Clear
            </button>
          </div>
          <div style={{ color: "red", fontSize: "12px" }}>
            {promoCodeDetails.errorMessage !== ""
              ? promoCodeDetails.errorMessage
              : null}
          </div>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <div className={[classes.PromoGrid, classes.Blue].join(" ")}>
            <input
              type="text"
              id="input box"
              placeholder="Enter Promo Code"
              className={classes.PromoCodeInputBoxBlack}
              value={promoCodeDetails.inputtedPromoValue}
              onChange={(event) => {
                let tempDetails = { ...promoCodeDetails };
                tempDetails.inputtedPromoValue = event.target.value;
                tempDetails.errorMessage = "";
                console.log("promoCodeDetails: ", tempDetails);
                setPromoCodeDetails(tempDetails);
              }}
            ></input>
            <button
              onClick={(event) => {
                applyPromoCodeHandler(
                  event,
                  promoCodeDetails.inputtedPromoValue.toUpperCase()
                );
              }}
              className={classes.PromoCodeButtonBlue}
              disabled={!promoCodeDetails.inputtedPromoValue}
            >
              Apply
            </button>
          </div>
          <div style={{ color: "blue", fontSize: "12px" }}>
            {promoCodeDetails.errorMessage !== ""
              ? promoCodeDetails.errorMessage
              : null}
          </div>
        </Fragment>
      );
    }
  };

  // THIS LOOKS GOOD
  const clearPromoDetails = (promoCodeDetails) => {
    let tempPromoCodeDetails;
    tempPromoCodeDetails = { ...promoCodeDetails };
    tempPromoCodeDetails.applied = false;
    tempPromoCodeDetails.input = true;
    tempPromoCodeDetails.errorMessage = "";
    tempPromoCodeDetails.appliedPromoCode = "";
    tempPromoCodeDetails.inputtedPromoValue = "";
    tempPromoCodeDetails.lastInvalidPromoCode = "";
    console.log("UPDATED 'promoCodeDetails': ", tempPromoCodeDetails);
    return tempPromoCodeDetails;
  };

  // THIS LOOKS GOOD
  // creates contents inside promo code input form
  const promoOption = () => {
    if (promoCodeDetails.applied) {
      return (
        <Fragment>
          <div className={classes.AppliedPromoCode}>
            <FontAwesomeIcon
              className={classes.faCheckCircle}
              icon={faCheckCircle}
            />{" "}
            Code{" "}
            <span style={{ fontWeight: "600" }}>
              {(" ", promoCodeDetails.appliedPromoCode)}{" "}
            </span>
            applied.{" "}
            <span
              className={classes.RemovePromoCode}
              onClick={() => {
                console.log("inside remove");
                setPromoCodeDetails(clearPromoDetails(promoCodeDetails));
                let tempValues = { ...values };
                tempValues.paypal_plan_id = tempValues.paypal_plan_id_full;
                setValues(tempValues);
              }}
            >
              Remove
            </span>
          </div>
          <br></br>
        </Fragment>
      );
    } else if (promoCodeDetails.input) {
      return (
        <Fragment>
          {inputPromoCode()}
          <br></br>
        </Fragment>
      );
    } else if (!promoCodeDetails.input) {
      return (
        <Fragment>
          <div
            className={classes.EnterPromoCode}
            onClick={() => {
              let tempPromoCodeDetails;
              tempPromoCodeDetails = { ...promoCodeDetails };
              tempPromoCodeDetails.input = true;
              setPromoCodeDetails(tempPromoCodeDetails);
            }}
          >
            Enter Promo Code
          </div>
          <br></br>
        </Fragment>
      );
    }
  };

  const paymentInstructions = () => {
    if (
      promoCodeDetails.appliedPromoCode === "OSD50" ||
      promoCodeDetails.appliedPromoCode === "OSD70" ||
      promoCodeDetails.appliedPromoCode === "TRYFORFREE"
    ) {
      return (
        <div
          style={{
            fontSize: "16px",
            paddingTop: "30px",
            paddingBottom: "20px",
          }}
        >
          Submit your payment to PayPal:
        </div>
      );
    } else if (promoCodeDetails.appliedPromoCode === "OSDFREE") {
      return (
        <div
          style={{
            fontSize: "16px",
            paddingTop: "30px",
            paddingBottom: "20px",
          }}
        >
          Submit your plan:
        </div>
      );
    } else {
      return (
        <div
          style={{
            fontSize: "16px",
            paddingTop: "30px",
            paddingBottom: "20px",
          }}
        >
          Choose a plan and submit your payment to PayPal:
        </div>
      );
    }
  };

  const successStatement = () => {
    if (promoCodeDetails.appliedPromoCode === "OSDFREE") {
      return (
        <div
          style={{
            fontSize: "16px",
            paddingLeft: "80px",
            paddingTop: "20px",
            paddingBottom: "40px",
          }}
        >
          Thank you, your subscription was successfully received.
        </div>
      );
    } else {
      return (
        <div
          style={{
            fontSize: "16px",
            paddingLeft: "80px",
            paddingTop: "20px",
            paddingBottom: "40px",
          }}
        >
          Thank you, your payment was successfully received by PayPal.
        </div>
      );
    }
  };

  // Displays the entire subscription payment panel
  const paymentPage = () => {
    return (
      <div className={classes.DisplayPanel}>
        <div>
          <div
            style={{
              paddingTop: "40px",
              paddingLeft: "80px",
              fontSize: "22px",
              fontWeight: "600",
            }}
          >
            Step 2: Select a Subscription Plan
          </div>
          <div className={classes.PaymentCanvas}>
            {paymentInstructions()}
            {promoOption()}
            {paymentPanel()}
          </div>
          <div style={{ textAlign: "center", paddingTop: "10px" }}>
            <button
              className={classes.ButtonGrey}
              onClick={() => {
                setPageView("ticket");
              }}
            >
              BACK TO SELECT A TICKET PLAN
            </button>
          </div>
        </div>
      </div>
    );
  };

  const receiptPage = () => {
    return (
      <div className={classes.DisplayPanel}>
        <div>
          <div
            style={{
              paddingTop: "40px",
              paddingLeft: "80px",
              fontSize: "22px",
              fontWeight: "600",
            }}
          >
            Step 2: Payment Confirmation
          </div>
          <br></br>
          {successStatement()}
          <div style={{ textAlign: "center", paddingTop: "20px" }}>
            <button
              className={classes.ButtonGrey}
              onClick={() => {
                updatePageView();
              }}
            >
              CONTINUE
            </button>
          </div>
        </div>
      </div>
    );
  };

  const receiptErrorPage = () => {
    return (
      <div className={classes.DisplayPanel}>
        <div>
          <div
            style={{
              paddingTop: "40px",
              paddingLeft: "80px",
              fontSize: "22px",
              fontWeight: "600",
            }}
          >
            Step 2: Payment Confirmation
          </div>
          <br></br>
          <div
            style={{
              fontSize: "16px",
              paddingLeft: "80px",
              paddingTop: "20px",
              paddingBottom: "40px",
            }}
          >
            Thank you, your payment was successfully received by PayPal.
          </div>
          <div
            style={{
              fontSize: "16px",
              paddingLeft: "80px",
              paddingTop: "20px",
              paddingBottom: "40px",
            }}
          >
            OSD is experiences delays in processing your payment.
          </div>
          <div
            style={{
              fontSize: "16px",
              paddingLeft: "80px",
              color: "red",
              paddingTop: "20px",
              paddingBottom: "40px",
            }}
          >
            PLEASE DO NOT RESUBMIT A PAYMENT.
          </div>
        </div>
      </div>
    );
  };

  const paypalPage = () => {
    return (
      <div className={classes.DisplayPanel}>
        <div>
          <div
            style={{
              paddingTop: "40px",
              paddingLeft: "80px",
              fontSize: "22px",
              fontWeight: "600",
            }}
          >
            Step 2: Link Your Paypal Merchant Account
          </div>

          <div className={classes.PaypalCanvas}>
            <div style={{ fontSize: "16px", paddingTop: "20px" }}>
              Please provide the ClientId and Secret from your PayPal merchant
              account.
            </div>
            <div style={{ fontSize: "16px", paddingTop: "20px" }}>
              These items are located in the "My Apps & Credentials" section of
              your
              <button
                style={{
                  fontSize: "16px",
                  color: "blue",
                  border: "none",
                  backgroundColor: "white",
                  cursor: "pointer",
                  display: "inlineBlock",
                  outline: "none",
                }}
                onClick={() => {
                  window.location.href =
                    "https://developer.paypal.com/developer/applications/";
                }}
              >
                PayPal Dashboard.
              </button>
            </div>
            <div
              style={{
                fontSize: "16px",
                paddingTop: "20px",
                paddingBottom: "40px",
              }}
            >
              <button
                style={{
                  fontSize: "16px",
                  color: "blue",
                  border: "none",
                  backgroundColor: "white",
                  paddingLeft: "0px",
                  cursor: "pointer",
                  display: "inlineBlock",
                  outline: "none",
                }}
                onClick={() => {
                  window.location.href =
                    "https://drive.google.com/file/d/1ozk3BKzLwLEpzQJCqX7FwAIF0897im0H/view?usp=sharing";
                }}
              >
                Additional instructions.
              </button>
            </div>

            <div
              style={{ paddingBottom: "20px", width: "700px", height: "85px" }}
            >
              <label style={{ width: "700px", fontSize: "15px" }}>
                Paypal Client ID <span style={{ color: "red" }}>* </span>
                <Popup
                  position="right center"
                  content="Your ID will only be used..."
                  header="Paypal Client ID"
                  trigger={
                    <FontAwesomeIcon
                      color="blue"
                      cursor="pointer"
                      icon={faInfoCircle}
                    />
                  }
                />
              </label>
              <input
                onFocus={() => {
                  setValues({ ...values, inputError: "" });
                }}
                style={{
                  border: "1px solid #8DADD4",
                  borderRadius: "0px",
                  backgroundColor: "#EFF3FA",
                  width: "700px",
                  height: "40px",
                  paddingLeft: "10px",
                }}
                type="text"
                name="paypalExpress_client_id"
                onChange={handleChange}
                value={paypalExpress_client_id}
              />
            </div>
            <div>
              <label style={{ width: "700px", fontSize: "15px" }}>
                Paypal Secret <span style={{ color: "red" }}>* </span>
                <Popup
                  position="right center"
                  content="Your Paypal Secret will only be used..."
                  header="Paypal Secret"
                  trigger={
                    <FontAwesomeIcon
                      color="blue"
                      cursor="pointer"
                      icon={faInfoCircle}
                    />
                  }
                />
              </label>
              <input
                onFocus={() => {
                  setValues({ ...values, inputError: "" });
                }}
                style={{
                  border: "1px solid #8DADD4",
                  borderRadius: "0px",
                  backgroundColor: "#EFF3FA",
                  width: "700px",
                  height: "40px",
                  paddingLeft: "10px",
                }}
                type="text"
                name="paypalExpress_client_secret"
                onChange={handleChange}
                value={paypalExpress_client_secret}
              />
            </div>
            <div style={{ textAlign: "center", paddingTop: "40px" }}>
              <button
                className={classes.ButtonGreen}
                style={{ width: "700px" }}
                disabled={
                  !paypalExpress_client_id || !paypalExpress_client_secret
                }
                onClick={() => {
                  let url = `${API}/account/${props.userid}`;
                  let fetcharg = {
                    method: "PATCH",
                    headers: myHeaders,
                    body: JSON.stringify({
                      useSandbox: PAYPAL_USE_SANDBOX,
                      paymentGatewayType: "PayPalExpress",
                      paypalExpress_client_id: paypalExpress_client_id,
                      paypalExpress_client_secret: paypalExpress_client_secret,
                    }),
                  };
                  console.log("fetching with: ", url, fetcharg);
                  fetch(url, fetcharg)
                    .then(handleErrors)
                    .then((response) => {
                      console.log("then response: ", response);
                      return response.json();
                    })
                    .then((data) => {
                      console.log(
                        "fetch return got back data on PayPal:",
                        data
                      );

                      let tempData = JSON.parse(localStorage.getItem("user"));
                      console.log("tempData: ", tempData);
                      tempData.user.accountId = data.result;
                      localStorage.setItem("user", JSON.stringify(tempData));

                      if (data.status) {
                        switch (data.result.status) {
                          case 4:
                          case 5:
                            setPageView("ticket");
                            break;
                          case 6:
                            setPageView("payment");
                            break;
                          case 7:
                            setPageView("completed");
                            break;
                          case 8:
                            setPageView("completed");
                            break;
                          case 0:
                          default:
                            setPageView("summary");
                        }
                      } else {
                        // this is a frieldly error
                        let errmsg =
                          "unable to validate ClientId and secret at this time";
                        if (data.message) {
                          errmsg = data.message;
                        }
                        window.alert(errmsg);
                      }
                    })
                    .catch((err) => {
                      setPreFetchView(pageView);
                      console.log(err);
                      setPageView("error");
                    });
                }}
              >
                SUBMIT YOUR PAYPAL MERCHANT INFORMATION
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const completedPage = () => {
    return (
      <div className={classes.DisplayPanel}>
        <div
          style={{
            paddingTop: "40px",
            paddingLeft: "80px",
            fontSize: "22px",
            fontWeight: "600",
          }}
        >
          Step 3: Create an Event
        </div>
        <div className={classes.CompleteCanvas}>
          <div className={classes.CompleteHeaderLine}>
            Congratulations, you are now ready to create your first event.
          </div>
          <br></br>
          <div style={{ textAlign: "center" }}>
            <button
              style={{
                border: "1px solid #000",
                backgroundColor: "#008F00",
                color: "#fff",
                fontSize: "14px",
                width: "324px",
                height: "40px",
                fontWeight: "500",
              }}
              onClick={() => {
                window.location.href = "/myaccount";
              }}
            >
              GET STARTED
            </button>
          </div>
        </div>
      </div>
    );
  };

  const errorPage = () => {
    return (
      <div className={classes.DisplayPanel}>
        <div
          style={{
            paddingTop: "40px",
            paddingLeft: "80px",
            fontSize: "22px",
            fontWeight: "600",
          }}
        >
          SYSTEM ERROR
        </div>
        <div className={classes.SummaryHeader}>
          System error please go back and resubmit.
        </div>
        <div style={{ textAlign: "center" }}>
          <Button
            className={classes.SummaryButton}
            style={{
              backgroundColor: "white",
              border: "1px solid blue",
              color: "blue",
              padding: "0px",
            }}
            content="Go Back"
            onClick={() => {
              console.log("preFetchView: ", preFetchView);
              setPageView(preFetchView);
              setPreFetchView("");
            }}
          />
        </div>
      </div>
    );
  };

  const mainDisplay = () => {
    if (!loading) {
      console.log("event is NOT loading. pageView =", pageView);

      switch (pageView) {
        case "summary":
          return summaryPage();
        case "organization":
          return orgPage();
        case "ticket":
          return ticketPage();
        case "payment":
          return paymentPage();
        case "receipt":
          return receiptPage();
        case "receiptErrorPage":
          return receiptErrorPage();
        case "paypal":
          return paypalPage();
        case "completed":
          return completedPage();
        case "error":
          return errorPage();
        default:
          return summaryPage();
      }
    } else {
      return <Spinner />;
    }
  };

  return (
    <div>
      <div className={classes.DisplayPanelTitle}>Event Creator Signup</div>

      {loading ? null : mainDisplay()}
    </div>
  );
};

export default Onboarding;
