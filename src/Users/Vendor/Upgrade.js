import React, { useEffect, useState, Fragment } from "react";

import stripeImg from "../../assets/Stripe/Stripe wordmark - blurple (small).png";

import payPalImg from "../../assets/PayPal/PayPal.PNG";

import {
  API,
  PAYPAL_USE_SANDBOX,
  SUBSCRIPTION_PROMO_CODE_1,
  SUBSCRIPTION_PROMO_CODE_2,
  SUBSCRIPTION_PROMO_CODE_3,
  SUBSCRIPTION_PROMO_CODE_4,
  SUBSCRIPTION_PROMO_CODE_5,
  SUBSCRIPTION_PROMO_CODE_6,
  SUBSCRIPTION_PROMO_CODE_7,
  SUBSCRIPTION_PROMO_CODE_8,
} from "../../config";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Button, Popup } from "semantic-ui-react";
import { PayPalButton } from "react-paypal-button-v2";

import RadioForm from "./RadioForm";

import classes from "./Upgrade.module.css";

import Spinner from "../../components/UI/Spinner/SpinnerNew"; // experimental..

const Upgrade = (props) => {
  console.log("PROPS: ", props);
  // UPDATE WHEN A NEW PLAN IS INTRODUCED
  const [values, setValues] = useState({
    accountName: "",
    accountEmail: "",
    accountPhone: "",
    accountUrl: "",
    inputError: "",
    paypal_plan_id: "P-3E209303AY287713HMDN3PLQ", // default value is production monthly plan
    paypal_plan_id_full: "", // default plan for "FULL" ticket plan selection view
    paypal_plan_id_discount: "", // default plan for "DISCOUNT" ticket plan selection view
    paypal_plan_id_forFree: "", // default plan for "FORFREE" ticket plan selection view
    paypal_plan_id_growPR: "", // default plan for "FORFREE" ticket plan selection view
    paypal_plan_id_old: "", // default plan for "OLD" ticket plan selection view
    paypal_plan_id_oldDiscounted: "", // default plan for "OLDDISCOUNTED" ticket plan selection view
    paypal_plan_id_freeSubscription: "", // default plan for "FREESUBSCRIPTION" ticket plan selection view
    paypalExpress_client_id: "", // vendor's clientID not OSD's
    paypalExpress_client_secret: "", // vendor's secret not OSD's
  });
  console.log("values: ", values);

  // LOOKS GOOD
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
      SUBSCRIPTION_PROMO_CODE_6,
      SUBSCRIPTION_PROMO_CODE_7,
      SUBSCRIPTION_PROMO_CODE_8,
    ],
  });

  // summary, organization, ticket, payment, receipt, paypal, completed, failedFetch
  const [pageView, setPageView] = useState("gatewayPage");
  const [preFetchView, setPreFetchView] = useState("");
  const [loading, setLoading] = useState("false");

  // LOOKS GOOD
  // object deconstruction
  const {
    accountName,
    accountEmail,
    accountPhone,
    accountUrl,
    paypal_plan_id,
    paypal_plan_id_full,
    paypal_plan_id_discount,
    paypal_plan_id_forFree,
    paypal_plan_id_growPR,
    paypal_plan_id_old,
    paypal_plan_id_oldDiscounted,
    paypal_plan_id_freeSubscription,
    paypalExpress_client_id,
    paypalExpress_client_secret,
  } = values;

  // LOOKS GOOD
  const getStatus = () => {
    //console.log("Entering 'getStatus'");
    let tempData = JSON.parse(localStorage.getItem("user"));
    //console.log("tempData: ", tempData);
    if ("accountId" in tempData.user) {
      return tempData.user.accountId.status;
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
        id: "P-5DT364104U926810EL5FRXSY", // Bondirectly PayPal Sandbox subscription
      },
      annually: {
        name: "$169 annually",
        id: "P-5YA13382D9271245EL5FRXTA", // Bondirectly PayPal Sandbox subscription
      },
      monthlyDiscounted: {
        name: "$15 monthly: 6 weeks free",
        id: "P-5DT364104U926810EL5FRXSY", // Bondirectly PayPal Sandbox subscription
      },
      annuallyDiscounted: {
        name: "$149 annually: discounted",
        id: "P-5YA13382D9271245EL5FRXTA", // Bondirectly PayPal Sandbox subscription
      },
      monthlyFreeTrial: {
        name: "$15 monthly: 3 months free",
        id: "P-3U3085871T847894PL5FRXTI", // Bondirectly PayPal Sandbox subscription
      },
      annualGrowPR: {
        name: "$169 annually: $149 first year",
        id: "P-3U3085871T847894PL5FRXTI", // Bondirectly PayPal Sandbox subscription
      },
      annuallyOldPrice: {
        name: "$70 annually",
        id: "P-6UY26644UT426184FL5FRXTI", // Bondirectly PayPal Sandbox subscription
      },
      annuallyOldPriceDiscounted: {
        name: "$50 annually",
        id: "P-3YH13849H69051131MAIHPGY", // Bondirectly PayPal Sandbox subscription
      },
      freeSubscription: {
        name: "FREE SUBSCRIPTION",
        id: "", // OSD PayPal Production subscription
      },
      clientId:
        "AVtX1eZelPSwAZTeLo2-fyj54NweftuO8zhRW1RSHV-H7DpvEAsiLMjM_c14G2fDG2wuJQ1wOr5etzj7", // Bondirectly PayPal Sandbox ClientId
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
      annualGrowPR: {
        name: "$169 annually: $149 first year",
        id: "P-8T757325FM2761033MF5677Y", // Bondirectly PayPal Sandbox subscription
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

  // LOOKS GOOD
  const updatePageView = () => {
    console.log("inside updatePageView");
    if (props.initialView === "sub") {
      console.log("payment");
      setPageView("payment");
    } else if (getStatus() === 0 || getStatus() === 1 || getStatus() === 2) {
      console.log("gateway");
      setPageView("gateway");
    } else if (getStatus() === 4 || getStatus() === 5) {
      console.log("payment");
      setPageView("payment");
    } else if (getStatus() === 6) {
      console.log("paypal");
      setPageView("paypal");
    } else if (getStatus() === 8) {
      console.log("completed");
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
      console.log("Account Name: ", tempUser.user.accountId.accountName);
      console.log("User Name: ", tempUser.user.username);
      console.log(
        tempUser.user.accountId.accountName === tempUser.user.username
      );
      /*
      if (
        tempUser.user.accountId.accountName &&
        tempUser.user.username &&
        tempUser.user.accountId.accountName === tempUser.user.username
      ) {
        tempBuyerInfo.accountName = "";
      } else */
      if (tempUser.user.accountId.accountName) {
        tempBuyerInfo.accountName = tempUser.user.accountId.accountName;
      }

      if (tempUser.user.accountId.accountEmail) {
        tempBuyerInfo.accountEmail = tempUser.user.accountId.accountEmail;
      }

      if (tempUser.user.accountId.accountPhone) {
        tempBuyerInfo.accountPhone = tempUser.user.accountId.accountPhone;
      }

      if (tempUser.user.accountId.accountUrl) {
        tempBuyerInfo.accountUrl = tempUser.user.accountId.accountUrl;
      }

      if (tempUser.user.accountId.status) {
        tempBuyerInfo.status = tempUser.user.accountId.status;
      }

      if (tempUser.user.accountId.paypalExpress_client_id) {
        tempBuyerInfo.paypalExpress_client_id =
          tempUser.user.accountId.paypalExpress_client_id;
      }

      if (tempUser.user.accountId.paypalExpress_client_secret) {
        tempBuyerInfo.paypalExpress_client_secret =
          tempUser.user.accountId.paypalExpress_client_secret;
      }

      if (PAYPAL_USE_SANDBOX === true) {
        console.log(
          "PAYPAL_USE_SANDBOX is ",
          PAYPAL_USE_SANDBOX,
          " Sandbox true"
        );
        tempBuyerInfo.paypal_plan_id_full = "P-5DT364104U926810EL5FRXSY"; // sandbox monthly full price
        tempBuyerInfo.paypal_plan_id_discount = "P-5DT364104U926810EL5FRXSY"; // sandbox monthly full price
        tempBuyerInfo.paypal_plan_id_forFree = "P-3U3085871T847894PL5FRXTI"; // sandbox monthly full price
        tempBuyerInfo.paypal_plan_id_growPR = "P-3U3085871T847894PL5FRXTI"; // sandbox monthly full price
        tempBuyerInfo.paypal_plan_id_old = "P-6UY26644UT426184FL5FRXTI"; // sandbox monthly full price
        tempBuyerInfo.paypal_plan_id_oldDiscounted =
          "P-3YH13849H69051131MAIHPGY"; // sandbox monthly full price
        tempBuyerInfo.paypal_plan_id_freeSubscription = ""; // production FREE SUBSCRIPTION no PayPal
        if (!tempUser.user.accountId.paypal_plan_id) {
          tempBuyerInfo.paypal_plan_id = "P-5DT364104U926810EL5FRXSY"; // sandbox monthly full price
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
        tempBuyerInfo.paypal_plan_id_growPR = "P-8T757325FM2761033MF5677Y"; // production monthly 3 months free
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

  // THIS ASSIGNS THE "paypal_plan_id" VARIABLE TO THE SELECTED PLAN
  const radioChangePayment = (event, value, name) => {
    let tempValues = { ...values };
    tempValues[name] = value.value;
    tempValues.paypal_plan_id = value.value;
    console.log("tempValues: ", tempValues);
    setValues(tempValues);
  };

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

  // GROWPR promo code plans
  const growPRPlan = [
    {
      label: subscriptions.annualGrowPR.name,
      value: subscriptions.annualGrowPR.id,
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
    if (
      promoCodeDetails.appliedPromoCode === SUBSCRIPTION_PROMO_CODE_1 ||
      promoCodeDetails.appliedPromoCode === SUBSCRIPTION_PROMO_CODE_6 ||
      promoCodeDetails.appliedPromoCode === SUBSCRIPTION_PROMO_CODE_7
    ) {
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
      promoCodeDetails.appliedPromoCode === SUBSCRIPTION_PROMO_CODE_8
    ) {
      return growPRPlan;
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
    if (
      promoCodeDetails.appliedPromoCode === "OSD20" ||
      promoCodeDetails.appliedPromoCode === "HEAMEDIAGROUP" ||
      promoCodeDetails.appliedPromoCode === "LIGHTOFGOLD"
    ) {
      console.log("OSD20");
      console.log("paypal_plan_id: ", paypal_plan_id);
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
          {paypal_plan_id ? showPayPal() : null}
        </Fragment>
      );
    } else if (promoCodeDetails.appliedPromoCode === "TRYFORFREE") {
      console.log("TRYFORFREE");
      console.log("paypal_plan_id: ", paypal_plan_id);
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
          {paypal_plan_id ? showPayPal() : null}
        </Fragment>
      );
    } else if (promoCodeDetails.appliedPromoCode === "GROWPR") {
      console.log("GROWPR");
      console.log("paypal_plan_id: ", paypal_plan_id);
      console.log("paypal_plan_id_growPR: ", paypal_plan_id_growPR);
      return (
        <Fragment>
          <RadioForm
            details={shownPlans()}
            group="eventTypeGroup"
            current={paypal_plan_id_growPR}
            change={(event, value) => {
              radioChangePayment(event, value, "paypal_plan_id_growPR");
            }}
          />
          <br></br>
          {paypal_plan_id ? showPayPal() : null}
        </Fragment>
      );
    } else if (promoCodeDetails.appliedPromoCode === "OSD70") {
      console.log("OSD70");
      console.log("paypal_plan_id: ", paypal_plan_id);
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
          {paypal_plan_id ? showPayPal() : null}
        </Fragment>
      );
    } else if (promoCodeDetails.appliedPromoCode === "OSD50") {
      console.log("OSD50");
      console.log("paypal_plan_id: ", paypal_plan_id);
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
          {paypal_plan_id ? showPayPal() : null}
        </Fragment>
      );
    } else if (promoCodeDetails.appliedPromoCode === "OSDFREE") {
      console.log("OSDFREE");
      console.log("paypal_plan_id: ", paypal_plan_id);
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
          {paypal_plan_id ? (
            showPayPal()
          ) : (
            <div style={{ textAlign: "center", paddingTop: "20px" }}>
              <button
                className={classes.ButtonGreen}
                onClick={() => {
                  submitFreeSub();
                }}
              >
                Confirm selection
              </button>
            </div>
          )}
        </Fragment>
      );
    } else {
      console.log("NO PROMOS");
      console.log("paypal_plan_id: ", paypal_plan_id);
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
          {paypal_plan_id ? showPayPal() : null}
        </Fragment>
      );
    }
  };

  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      console.log("STATUS IS NOT GOOD");
      throw Error(response.status);
    }
    console.log("STATUS IS GOOD");
    console.log("response: ", response);
    return response;
  };

  const submitFreeSub = () => {
    let tempData = JSON.parse(localStorage.getItem("user"));
    let accountNum = tempData.user.accountId.accountNum;
    console.log("tempData: ", tempData);
    const authstring = `Bearer ${props.token}`;
    fetch(`${API}/accounts/${accountNum}/subscription/nopay`, {
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
        console.log("MADE IT PAST handleErrors");
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
          console.log("error in if then else");
          setPageView("receiptErrorPage");
        }
      }) // add .catch block for failed response from server, press "continue" button to go to paypal clientId model
      .catch((err) => {
        console.log("error in .then .catch");
        setPageView("receiptErrorPage");
      });
  };

  // THIS LOOKS GOOD
  // change plan_id value to be a variable value depending on $10 or $35 choice, right now its the same
  const showPayPal = () => {
    console.log("paypal_plan_id: ", paypal_plan_id);
    console.log("subscriptions.clientId: ", subscriptions.clientId);
    return (
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
                //return fetch(`${API}/paypal/subscription/${props.userid}`, {
                return fetch(
                  `${API}/accounts/${props.accountNum}/subscription/paypal-express/subscribe`,
                  {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                      Authorization: authstring,
                    },
                    body: JSON.stringify({
                      data: data,
                      details: details,
                      promoCode: promoCodeDetails.appliedPromoCode,
                    }),
                  }
                )
                  .then(handleErrors)
                  .then((response) => {
                    console.log("MADE IT PAST handleErrors");
                    console.log("response: ", response);
                    return response.json();
                  })
                  .then((response) => {
                    console.log("response: ", response);
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
                      console.log("inside else");
                      setPageView("receiptErrorPage");
                    }
                  }) // add .catch block for failed response from server, press "continue" button to go to paypal clientId model
                  .catch((err) => {
                    console.log("Inside inner .catch");
                    setPageView("receiptErrorPage");
                  });
              })
              .catch((err) => {
                console.log("Inside outer .catch");
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
  };

  const submitStripe = () => {
    //setDisplay("spinner");
    //setShowSpinner(true);
    /*
    setSubmissionStatus({
      message: "",
      error: false,
      redirect: "",
    });
    */

    let tempUser = JSON.parse(localStorage.getItem("user"));
    let sessionToken = tempUser.token;
    let accountNum = tempUser.user.accountId.accountNum;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${sessionToken}`);
    console.log("myHeaders: ", myHeaders);

    console.log(
      "Account Number: ",
      accountNum,
      " sessionToken: ",
      sessionToken
    );

    let url = `${API}/accounts/${accountNum}/subscription/stripe/onboard1-genlink`;
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
    };
    console.log("fetching with: ", url, fetchBody);

    fetch(url, fetchBody)
      .then((res) => res.json())
      .then((response) => {
        console.log("made it inside the .then");
        window.location.href = response.url;
      })
      .catch(function (err) {
        console.info(err + " url: " + url);
        /*
        setSubmissionStatus({
          message: "Stripe connection is down, please try later",
          error: true,
          redirect: "gateway",
        });
        setDisplay("error");
        */
      });
  };

  const gatewayPage = () => {
    return (
      <div className={classes.DisplayPanel}>
        <div className={classes.Modal}>
          <div className={classes.BlankCanvas}>
            <div
              style={{
                paddingTop: "40px",
                paddingBottom: "20px",
                fontSize: "22px",
                fontWeight: "600",
              }}
            >
              How to Get Paid Instantly.
            </div>
            <div
              style={{
                fontSize: "16px",
                liineHeight: "25px",
                paddingBottom: "20px",
              }}
            >
              Select the payment gateway where you will instantly receive your
              ticket sales revenues.
            </div>
            <div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "165px 165px",
                  columnGap: "10px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                }}
              >
                <button
                  style={{
                    background: "white",
                    width: "160",
                    border: "1px solid lightgrey",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  <img
                    src={stripeImg}
                    alt="STRIPE"
                    width="140px"
                    height="auto"
                    cursor="pointer"
                    onClick={() => {
                      console.log("selecting Stripe");
                      submitStripe();
                    }}
                  ></img>
                </button>
                <button
                  style={{
                    background: "white",
                    width: "160",
                    border: "1px solid lightgrey",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  <img
                    src={payPalImg}
                    alt="PAYPAL"
                    width="140px"
                    height="auto"
                    cursor="pointer"
                    onClick={() => {
                      console.log("selecting PayPal");
                      setPageView("paypal");
                    }}
                  ></img>
                </button>
              </div>
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
      if (
        inputtedPromoCode === "OSD20" ||
        inputtedPromoCode === "HEAMEDIAGROUP" ||
        inputtedPromoCode === "LIGHTOFGOLD"
      ) {
        tempValues.paypal_plan_id = tempValues.paypal_plan_id_discount;
      } else if (inputtedPromoCode === "TRYFORFREE") {
        tempValues.paypal_plan_id = tempValues.paypal_plan_id_forFree;
      } else if (inputtedPromoCode === "GROWPR") {
        tempValues.paypal_plan_id = tempValues.paypal_plan_id_growPR;
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
      promoCodeDetails.appliedPromoCode === "GROWPR" ||
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
          Select your plan and submit payment:
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
          <div className={classes.PaymentCanvas}>
            <div
              style={{
                paddingTop: "40px",
                fontSize: "22px",
                fontWeight: "600",
              }}
            >
              Select Your Plan!
            </div>
            {paymentInstructions()}
            {promoOption()}
            {paymentPanel()}
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
            Step 2 of 3: Payment Confirmation
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
              Continue
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
            Step 2 of 3: Payment Confirmation
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
            Please do not resubmit payment.
          </div>
        </div>
      </div>
    );
  };

  const paypalPage = () => {
    return (
      <div className={classes.DisplayPanel}>
        <div>
          <div className={classes.PaypalCanvas}>
            <div
              style={{
                paddingTop: "40px",
                fontSize: "22px",
                fontWeight: "600",
              }}
            >
              Enter Paypal account information.
            </div>
            <div style={{ fontSize: "16px", paddingTop: "20px" }}>
              Please provide your PayPal Client ID and Secret located{" "}
              <a
                style={{
                  fontSize: "16px",
                  color: "blue",
                  border: "none",
                  backgroundColor: "white",
                  cursor: "pointer",
                  display: "inlineBlock",
                  outline: "none",
                }}
                href="https://developer.paypal.com/developer/applications/"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
              .
            </div>
            <div style={{ fontSize: "16px", paddingTop: "20px" }}>
              Can't find your Client ID and Secret
            </div>
            <div
              style={{
                fontSize: "16px",
                paddingTop: "20px",
                paddingBottom: "20px",
              }}
            >
              <a
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
                href="https://drive.google.com/file/d/1ozk3BKzLwLEpzQJCqX7FwAIF0897im0H/view?usp=sharing"
                target="_blank"
                rel="noreferrer"
              >
                Additional instructions.
              </a>
            </div>
            <div
              style={{
                fontSize: "16px",
                paddingTop: "0px",
                paddingBottom: "40px",
              }}
            >
              <a
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
                href="https://www.youtube.com/watch?v=gXAsubSL-1I"
                target="_blank"
                rel="noreferrer"
              >
                Instructional Video.
              </a>
            </div>

            <div
              style={{ paddingBottom: "20px", width: "700px", height: "85px" }}
            >
              <label style={{ width: "700px", fontSize: "15px" }}>
                Paypal Client ID <span style={{ color: "red" }}>* </span>
                <Popup
                  position="right center"
                  content="Your ID will only be used to route payments directly to your PayPal account."
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
                  content="Your Paypal Secret will only be used to validate PayPal payments made to your account."
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
            <div
              style={{
                textAlign: "center",
                paddingTop: "40px",
                paddingBottom: "10px",
              }}
            >
              <button
                className={classes.ButtonGreen}
                style={{ width: "700px" }}
                disabled={
                  !paypalExpress_client_id || !paypalExpress_client_secret
                }
                onClick={() => {
                  //let url = `${API}/account/${props.userid}`;
                  let url = `${API}/accounts/${props.accountNum}`;
                  let fetcharg = {
                    method: "POST",
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

                      if (data.status) {
                        console.log("INSIDE data.status");
                        let tempData = JSON.parse(localStorage.getItem("user"));
                        console.log("tempData: ", tempData);
                        tempData.user.accountId = data.result;
                        localStorage.setItem("user", JSON.stringify(tempData));
                        updatePageView();
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
                Submit your Paypal information
              </button>
            </div>
            <div>
              <button
                className={classes.ButtonGrey}
                style={{ width: "700px" }}
                onClick={() => {
                  setPageView("gateway");
                }}
              >
                Return to gateway selection
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
          Completed
        </div>
        <div className={classes.CompleteCanvas}>
          <div className={classes.CompleteHeaderLine}>
            Congratulations, you are now ready to create an event with paid
            tickets.
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
              Get started
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
          System error
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
        case "gateway":
          return gatewayPage();
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
          return gatewayPage();
      }
    } else {
      return <Spinner />;
    }
  };

  return (
    <div>
      <div className={classes.DisplayPanelTitle}>Upgrade to Pro Plan</div>

      {loading ? null : mainDisplay()}
    </div>
  );
};

export default Upgrade;
