import React, { useState, useEffect, Fragment } from "react";
import queryString from "query-string";

import SignInDisplay from "./Components/SignInDisplay";
import ForgotDisplay from "./Components/ForgotDisplay";
import TemporaryDisplay from "./Components/TemporaryDisplay";
import SignUpDisplay from "./Components/SignUpDisplay";
import ConfirmationDisplay from "./Components/ConfirmationDisplay";
import PasswordDisplay from "./Components/Password2";
import PaypalDisplay from "./Components/OpennodeDisplay";
import OpennodeDisplay from "./Components/OpennodeDisplay";

import Spinner from "../components/UI/Spinner/SpinnerNew";
import { PayPalButton } from "react-paypal-button-v2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { getStatus } from "../Resources/Utils";

import {
  API,
  PAYPAL_USE_SANDBOX,
  OPENNODE_USE_TEST,
  SUBSCRIPTION_PROMO_CODE_1,
  SUBSCRIPTION_PROMO_CODE_2,
  SUBSCRIPTION_PROMO_CODE_3,
  SUBSCRIPTION_PROMO_CODE_4,
  SUBSCRIPTION_PROMO_CODE_5,
  SUBSCRIPTION_PROMO_CODE_6,
  SUBSCRIPTION_PROMO_CODE_7,
  SUBSCRIPTION_PROMO_CODE_8,
} from "../config";

import { SubscriptionPlans } from "./Resources/Variables";

import RadioForm from "../components/Forms/RadioForm";

import stripeImg from "../assets/Stripe/Stripe wordmark - blurple (small).png";
import payPalImg from "../assets/PayPal/PayPal.PNG";
import opennodeImg from "../assets/Opennode/opennodeBtc.png";

import classes from "./Authentication.module.css";

const Authentication = () => {
  let initialView = queryString.parse(window.location.search).view;
  const [paidIntent, setPaidIntent] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const [authValues, setAuthValues] = useState({
    email: "",
    password: "",
    temporary: "",
    reissued: false,
    confirmation: "",
    resent: false,
    resetToken: "",
    sessionToken: "",
    userId: "",
    accountNum: "",
  });

  const {
    email,
    password,
    temporary,
    reissued,
    confirmation,
    resent,
    resetToken,
    sessionToken,
    userId,
    accountNum,
  } = authValues;

  // UPDATE WHEN A NEW PAYPAL PLAN IS INTRODUCED
  const [subValues, setSubValues] = useState({
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
    opennode_invoice_API_KEY: "", // vendors opennode api key
    opennode_auto_settle: "", // vendors request convesion to USD or keep in BTC?
    opennode_dev: "", // Boolean: dev=true for testnet BTC
  });

  const {
    inputError,
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
    opennode_invoice_API_KEY,
    opennode_auto_settle,
    opennode_dev,
  } = subValues;

  let subscriptions = SubscriptionPlans();

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

  // transaction status variable
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    error: false,
    redirect: "",
  });

  const { message, error, redirect } = submissionStatus;
  const [display, setDisplay] = useState("spinner"); // spinner, signin, forgot, temporary, signup, confirmation, password, error

  // edit so that it is driven by the "status" value
  const updateSubValues = () => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("user") !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      if ("user" in tempUser && "accountId" in tempUser.user) {
        let tempBuyerInfo = {};
        // populates the "tempBuyerInfo" (and "values") object with "user" object info
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
        if (tempUser.user.accountId?.opennode_invoice_API_KEY) {
          tempBuyerInfo.opennode_invoice_API_KEY =
            tempUser.user.accountId.opennode_invoice_API_KEY;
        }
        if (tempUser.user.accountId?.opennode_auto_settle) {
          tempBuyerInfo.opennode_auto_settle =
            tempUser.user.accountId.opennode_auto_settle;
        }
        if (tempUser.user.accountId?.opennode_dev) {
          tempBuyerInfo.opennode_auto_settle =
            tempUser.user.accountId.opennode_dev;
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
            tempBuyerInfo.paypal_plan_id =
              tempUser.user.accountId.paypal_plan_id;
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
            tempBuyerInfo.paypal_plan_id =
              tempUser.user.accountId.paypal_plan_id;
          }
        }
        if (OPENNODE_USE_TEST === true) {
          tempBuyerInfo.opennode_dev = true;
        } else {
          tempBuyerInfo.opennode_dev = false;
        }
        tempBuyerInfo.opennode_auto_settle = true;

        setSubValues(tempBuyerInfo);
        console.log("tempBuyerInfo: ", tempBuyerInfo);
      }
    } else {
      console.log("no user object");
    }
  };

  const updateAuthValues = () => {
    let tempUser = JSON.parse(localStorage.getItem("user"));
    localStorage.setItem("user", JSON.stringify(tempUser));
    setAuthValues({
      name: "",
      email: tempUser.user.email,
      password: "",
      temporary: "",
      reissued: false,
      confirmation: "",
      resent: false,
      resetToken: "",
      sessionToken: tempUser.token,
      userId: tempUser.user.accountId.userId,
      accountNum: tempUser.user.accountId.accountNum,
    });
  };

  useEffect(() => {
    console.log("initialView: ", initialView);
    let partialStatus = false;

    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      console.log("getStatus: ", getStatus());
      console.log("User status: ", tempUser.user.accountId.status);
      let status = getStatus();
      if ("user" in tempUser && "token" in tempUser) {
        partialStatus = true;
      }
      if (status === 8) {
        window.location.href = "/myaccount";
      } else if (initialView === "upgrade") {
        console.log("initialView: ", initialView, ", upgrade");
        setPaidIntent(true);
        updateSubValues();
        if (status === 1 || status === 4 || status === 6) {
          updateAuthValues();
          setDisplay("gateway");
        } else if (status === 5) {
          updateAuthValues();
          setDisplay("selectPlan");
        } else if (partialStatus) {
          setDisplay("password");
        } else {
          console.log("going to signin");
          setDisplay("signin");
        }
      } else if (initialView === "free") {
        console.log("initialView: ", initialView, ", free");
        setPaidIntent(false);
        updateSubValues();
        if (status === 1 || status === 4 || status === 6) {
          updateAuthValues();
          setDisplay("gateway");
        } else if (status === 5) {
          updateAuthValues();
          setDisplay("selectPlan");
        } else if (partialStatus) {
          setDisplay("password");
        } else {
          setDisplay("signup");
        }
      } else if (initialView === "paid") {
        console.log("initialView: ", initialView, ", paid");
        setPaidIntent(true);
        updateSubValues();
        if (status === 1 || status === 4 || status === 6) {
          updateAuthValues();
          setDisplay("gateway");
        } else if (status === 5) {
          updateAuthValues();
          setDisplay("selectPlan");
        } else if (partialStatus) {
          setDisplay("password");
        } else {
          setDisplay("signup");
        }
      } else {
        console.log("initialView: ", initialView, ", NONE");
        setPaidIntent(false);
        updateSubValues();
        if (status === 1 || status === 4 || status === 6) {
          updateAuthValues();
          setDisplay("gateway");
        } else if (status === 5) {
          updateAuthValues();
          setDisplay("selectPlan");
        } else if (partialStatus) {
          setDisplay("password");
        } else {
          console.log("going to signin");
          setDisplay("signin");
        }
      }
    } else {
      console.log("going to signin");
      setDisplay("signin");
    }
  }, []);

  // THIS ASSIGNS THE "paypal_plan_id" VARIABLE TO THE SELECTED PLAN
  const radioChangeSubValues = (event, value, name) => {
    let tempSubValues = { ...subValues };
    tempSubValues[name] = value.value;
    tempSubValues.paypal_plan_id = value.value;
    setSubValues(tempSubValues);
  };

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
      value: subscriptions.monthlyDiscounted.idn,
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

  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  const submitStripe = () => {
    setShowSpinner(true);
    setSubmissionStatus({
      message: "",
      error: false,
      redirect: "",
    });

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

    console.log("authValues: ", authValues);

    let url = `${API}/accounts/${accountNum}/subscription/stripe/onboard1-genlink`;
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
    };
    console.log("fetching with: ", url, fetchBody);

    fetch(url, fetchBody)
      .then(handleErrors)
      .then((res) => res.json())
      .then((response) => {
        console.log("made it inside the .then");
        window.location.href = response.url;
      })
      .catch(function (err) {
        console.info(err + " url: " + url);
        setSubmissionStatus({
          message: "Stripe connection is down, please try later",
          error: true,
          redirect: "gateway",
        });
        setDisplay("error");
        setShowSpinner(false);
      })
      .finally(() => {});
  };

  const resetValues = () => {
    setAuthValues({
      email: "",
      password: "",
      temporary: "",
      reissued: false,
      confirmation: "",
      resent: false,
      resetToken: "",
      sessionToken: "",
      userId: "",
      accountNum: "",
    });
  };

  const handleAuthValueChange = (event) => {
    setAuthValues({
      ...authValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubValueChange = (event) => {
    setSubValues({
      ...subValues,
      [event.target.name]: event.target.value,
    });
  };
  /*
  else if (tempData.user.accountId.status === 8) {
    props.displayChange("paidCongrats");
  }
  */

  const redirectUser = () => {
    console.log("Redirect user");
    let status = getStatus();
    if (status === 8) {
      window.location.href = "/myaccount";
    } else if (
      (status === 1 || status === 4 || status === 5 || status === 6) &&
      initialView === "free"
    ) {
      setDisplay("freeCongrats");
      setShowSpinner(false);
    } else if (
      (status === 1 || status === 4 || status === 6) &&
      (initialView === "upgrade" || initialView === "paid")
    ) {
      setDisplay("gateway");
      setShowSpinner(false);
    } else if (
      status === 5 &&
      (initialView === "upgrade" || initialView === "paid")
    ) {
      setDisplay("selectPlan");
      setShowSpinner(false);
    } else if (status === 1 || status === 4 || status === 5 || status === 6) {
      window.location.href = "/myaccount";
    } else {
      setSubmissionStatus({
        message: "Server error please try again",
        error: true,
        redirect: "",
      });
      setDisplay("error");
      setShowSpinner(false);
    }
  };

  const showDetail = () => {
    if (error) {
      return (
        <div
          style={{
            color: "red",
            fontSize: "14px",
            lineHeight: "25px",
            paddingBottom: "20px",
          }}
        >
          {message}
        </div>
      );
    } else if (display === "gateway") {
      return (
        <div
          style={{
            fontSize: "16px",
            liineHeight: "25px",
            paddingBottom: "20px",
          }}
        >
          Link to Stripe or Paypal to get your ticket sales revenue instantly in
          cash, or Opennode for bitcoin/lightning network.
        </div>
      );
    } else if (display === "freeCongrats") {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          <div>You now have a Free Forever Plan!</div>
          <div style={{ lineHeight: "25px" }}>
            You can issue an unlimited amount of free tickets.
          </div>
          <div>
            More details on this plan{" "}
            <a
              href="https://www.openseatdirect.com/#pricing-plans"
              target="blank"
              rel="noreferrer"
            >
              here
            </a>
            .
          </div>
        </div>
      );
    } else if (display === "paidCongrats") {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          <div>You now have a Pro Plan!</div>
          <div style={{ lineHeight: "25px" }}>
            You can issue an unlimited amount of free tickets.
          </div>
          <div>
            More details on this plan{" "}
            <a
              href="https://www.openseatdirect.com/#pricing-plans"
              target="blank"
              rel="noreferrer"
            >
              here
            </a>
            .
          </div>
        </div>
      );
    } else if (display === "paypal") {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          Can't find the Client ID and Secret?
          <div style={{ paddingLeft: "20px" }}>
            <a
              href="https://developer.paypal.com/developer/applications/"
              target="_blank"
              rel="noreferrer"
            >
              PayPal Dashboard
            </a>
          </div>
          <div style={{ paddingLeft: "20px" }}>
            <a
              href="https://drive.google.com/file/d/1ozk3BKzLwLEpzQJCqX7FwAIF0897im0H/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              Additional instructions
            </a>
          </div>
          <div style={{ paddingLeft: "20px" }}>
            <a
              href="https://www.youtube.com/watch?v=gXAsubSL-1I"
              target="_blank"
              rel="noreferrer"
            >
              Instructional video
            </a>
          </div>
        </div>
      );
    }
  };

  const regsuper =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const gatewayForm = (
    <Fragment>
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
              setDisplay("paypal");
            }}
          ></img>
        </button>
      </div>

      <div
        style={{
          width: "165px",
          textAlign: "center",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "89px",
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
            src={opennodeImg}
            alt="OPENNODE"
            width="150px"
            height="auto"
            cursor="pointer"
            onClick={() => {
              console.log("selecting Opennode");
              setDisplay("opennode");
            }}
          ></img>
        </button>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.ButtonGrey}
          onClick={() => {
            redirectUser();
          }}
        >
          STAY WITH FREE FOREVER PLAN
        </button>
      </div>
    </Fragment>
  );

  const freeCongratsForm = (
    <Fragment>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.ButtonBlue}
          onClick={() => {
            setDisplay("gateway");
          }}
        >
          UPGRADE TO A PRO PLAN
        </button>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.ButtonGrey}
          onClick={() => {
            window.location.href = "/myaccount";
          }}
        >
          GO TO MY DASHBOARD
        </button>
      </div>
    </Fragment>
  );

  const paidCongratsForm = (
    <Fragment>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.ButtonGrey}
          onClick={() => {
            window.location.href = "/myaccount";
          }}
        >
          GO TO MY DASHBOARD
        </button>
      </div>
    </Fragment>
  );

  // THIS LOOKS GOOD
  // change plan_id value to be a variable value depending on $10 or $35 choice, right now its the same
  const showPayPal = () => {
    //console.log("paypal_plan_id: ", paypal_plan_id);
    //console.log("subscriptions.clientId: ", subscriptions.clientId);
    return (
      <div>
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
                const authstring = `Bearer ${authValues.sessionToken}`;
                console.log("about to send paypal object to server");
                return fetch(
                  `${API}/accounts/${authValues.accountNum}/subscription/paypal-express/subscribe`,
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
                      let tempData = JSON.parse(localStorage.getItem("user"));
                      console.log("tempData: ", tempData);
                      tempData.user.accountId = response.result;
                      console.log("tempData: ", tempData);
                      console.log(
                        "tempData.user.accountID.status: ",
                        tempData.user.accountId.status
                      );
                      localStorage.setItem("user", JSON.stringify(tempData));
                      if (tempData.user.accountId.status === 8) {
                        setDisplay("paidCongrats");
                      } else if (tempData.user.accountId.status === 6) {
                        setDisplay("gateway");
                      } else {
                        setDisplay("gateway");
                      }
                    } else {
                      console.log("inside else");
                      setDisplay("paidCongrats");
                    }
                  }) // need better error handling
                  .catch((err) => {
                    console.log("Inside inner .catch");
                    setDisplay("paidCongrats");
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
    console.log("inputtedPromoCode: ", inputtedPromoCode);
    // first check if promo code is valid
    if (promoCodeDetails.eventPromoCodes.includes(inputtedPromoCode)) {
      console.log("valid code");
      setPromoCodeDetails(
        amendPromoCodeDetails(inputtedPromoCode, promoCodeDetails)
      );
      let tempSubValues = { ...subValues };
      console.log("tempSubValues: ", tempSubValues);
      // set "paypal_plan_id" to default value of that particular promo code
      if (
        inputtedPromoCode === "OSD20" ||
        inputtedPromoCode === "HEAMEDIAGROUP" ||
        inputtedPromoCode === "LIGHTOFGOLD"
      ) {
        tempSubValues.paypal_plan_id = tempSubValues.paypal_plan_id_discount;
      } else if (inputtedPromoCode === "TRYFORFREE") {
        tempSubValues.paypal_plan_id = tempSubValues.paypal_plan_id_forFree;
      } else if (inputtedPromoCode === "GROWPR") {
        tempSubValues.paypal_plan_id = tempSubValues.paypal_plan_id_growPR;
      } else if (inputtedPromoCode === "OSD70") {
        tempSubValues.paypal_plan_id = tempSubValues.paypal_plan_id_old;
      } else if (inputtedPromoCode === "OSD50") {
        tempSubValues.paypal_plan_id =
          tempSubValues.paypal_plan_id_oldDiscounted;
      } else if (inputtedPromoCode === "OSDFREE") {
        tempSubValues.paypal_plan_id = "";
      } else {
        tempSubValues.paypal_plan_id = tempSubValues.paypal_plan_id_full;
      }
      console.log(
        "tempSubValues.paypal_plan_id: ",
        tempSubValues.paypal_plan_id
      );
      setSubValues(tempSubValues);
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
              onFocus={() => {
                setSubmissionStatus({
                  message: "",
                  error: false,
                  redirect: "",
                });
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
              onFocus={() => {
                setSubmissionStatus({
                  message: "",
                  error: false,
                  redirect: "",
                });
              }}
            ></input>
            <button
              onClick={(event) => {
                console.log(
                  "promoCodeDetails.inputtedPromoValue: ",
                  promoCodeDetails.inputtedPromoValue
                );
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
      console.log("promoCodeDetails.applied");
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
                let tempSubValues = { ...subValues };
                tempSubValues.paypal_plan_id =
                  tempSubValues.paypal_plan_id_full;
                setSubValues(tempSubValues);
              }}
            >
              Remove
            </span>
          </div>
          <br></br>
        </Fragment>
      );
    } else if (promoCodeDetails.input) {
      console.log("promoCodeDetails.input");
      return (
        <Fragment>
          {inputPromoCode()}
          <br></br>
        </Fragment>
      );
    } else if (!promoCodeDetails.input) {
      //console.log("!promoCodeDetails.input");
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
            paddingBottom: "20px",
          }}
        >
          Select your plan and submit payment.
        </div>
      );
    }
  };

  // UPDATE WHEN A NEW PLAN IS INTRODUCED BY ADDING A NEW '<RadioForm>' CODE
  // Displays subscription pricing options section based on promo code entered
  const paymentPanel = () => {
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
              radioChangeSubValues(event, value, "paypal_plan_id_discount");
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
              radioChangeSubValues(event, value, "paypal_plan_id_forFree");
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
              radioChangeSubValues(event, value, "paypal_plan_id_growPR");
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
              radioChangeSubValues(event, value, "paypal_plan_id_old");
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
              radioChangeSubValues(
                event,
                value,
                "paypal_plan_id_oldDiscounted"
              );
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
              radioChangeSubValues(
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
              radioChangeSubValues(event, value, "paypal_plan_id_full");
            }}
          />
          <br></br>
          {paypal_plan_id ? showPayPal() : null}
        </Fragment>
      );
    }
  };

  const submitFreeSub = () => {
    let tempData = JSON.parse(localStorage.getItem("user"));
    let accountNum = tempData.user.accountId.accountNum;
    console.log("tempData: ", tempData);
    const authstring = `Bearer ${authValues.sessionToken}`;
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
          setDisplay("paidCongrats");
        } else {
          console.log("error in if then else");

          setSubmissionStatus({
            message: "Server down please try again",
            error: true,
            redirect: "selectPlan",
          });
          setDisplay("error");
        }
      }) // add .catch block for failed response from server, press "continue" button to go to paypal clientId model
      .catch((err) => {
        console.log("error in .then .catch");

        setSubmissionStatus({
          message: "Server down please try again",
          error: true,
          redirect: "selectPlan",
        });
        setDisplay("error");
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  // Displays the entire subscription payment panel
  const selectPlanForm = (
    <div className={classes.DisplayPanel}>
      <div className={classes.PaymentCanvas}>
        {paymentInstructions()}
        {promoOption()}
        {paymentPanel()}
      </div>
    </div>
  );

  const paypalForm = (
    <Fragment>
      <div style={{ paddingBottom: "20px", width: "340px" }}>
        <label style={{ width: "340px", fontSize: "15px" }}>
          Paypal Client ID <span style={{ color: "red" }}>* </span>
        </label>
        <input
          onFocus={() => {
            setSubValues({ ...subValues, inputError: "" });
          }}
          className={classes.InputBox}
          type="text"
          name="paypalExpress_client_id"
          onChange={handleSubValueChange}
          value={paypalExpress_client_id}
        />
      </div>
      <div>
        <label style={{ fontSize: "15px" }}>
          Paypal Secret <span style={{ color: "red" }}>* </span>
        </label>
        <input
          onFocus={() => {
            setSubValues({ ...subValues, inputError: "" });
          }}
          className={classes.InputBox}
          type="text"
          name="paypalExpress_client_secret"
          onChange={handleSubValueChange}
          value={paypalExpress_client_secret}
        />
      </div>
      <div style={{ textAlign: "center", paddingTop: "20px" }}>
        <button
          className={classes.ButtonBlue}
          disabled={!paypalExpress_client_id || !paypalExpress_client_secret}
          onClick={() => {
            //submitPaypal();

            console.log("Inside submitPaypal");
            //setDisplay("spinner");
            setShowSpinner(true);
            setSubmissionStatus({
              message: "",
              error: false,
              redirect: "",
            });
            // api static variables
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            const authstring = `Bearer ${authValues.sessionToken}`;
            myHeaders.append("Authorization", authstring);

            let url = `${API}/accounts/${authValues.accountNum}`;
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
            console.log(paypalExpress_client_id);
            console.log(paypalExpress_client_secret);

            console.log("fetching with: ", url, fetcharg);
            fetch(url, fetcharg)
              .then(handleErrors)
              .then((response) => {
                console.log("then response: ", response);
                return response.json();
              })
              .then((data) => {
                console.log("fetch return got back data on PayPal:", data);
                //handleConfirmation
                if (data.status) {
                  console.log("INSIDE data.status");
                  let tempData = JSON.parse(localStorage.getItem("user"));
                  console.log("tempData: ", tempData);
                  tempData.user.accountId = data.result;
                  localStorage.setItem("user", JSON.stringify(tempData));
                  //updatePageView();

                  if (tempData.user.accountId.status === 8) {
                    setDisplay("paidCongrats");
                  } else if (tempData.user.accountId.status === 5) {
                    setDisplay("selectPlan");
                  } else {
                    setDisplay("gateway");
                  }
                } else {
                  // this is a friendly error
                  let errmsg =
                    "unable to validate ClientId and secret at this time";
                  if (data.message) {
                    console.log("data.message exist");
                    console.log("data.message ", data.message);
                    errmsg = data.message;
                  }
                  console.log("errmsg: ", errmsg);
                  setSubmissionStatus({
                    message: errmsg,
                    error: true,
                    redirect: "paypal",
                  });
                  setDisplay("error");
                }
              })
              .catch((err) => {
                console.log(err);

                setSubmissionStatus({
                  message: "Server down please try again",
                  error: true,
                  redirect: "paypal",
                });
                setDisplay("error");
              })
              .finally(() => {
                setShowSpinner(false);
              });
          }}
        >
          SUBMIT YOUR PAYPAL DETAILS
        </button>
      </div>
      <div style={{ textAlign: "center", paddingTop: "20px" }}>
        <button
          className={classes.ButtonGrey}
          onClick={() => {
            setDisplay("gateway");
          }}
        >
          BACK TO GATEWAY SELECTION
        </button>
      </div>
      <div style={{ textAlign: "center", paddingTop: "20px" }}>
        <button
          className={classes.ButtonGrey}
          onClick={() => {
            redirectUser();
          }}
        >
          STAY WITH FREE FOREVER PLAN
        </button>
      </div>
    </Fragment>
  );

  const errorForm = () => {
    return (
      <Fragment>
        <div style={{ paddingTop: "10px" }}>
          <button
            className={classes.ButtonBlue}
            onClick={() => {
              console.log("redirect: ", redirect);
              let newDisplay = redirect;
              setSubmissionStatus({
                message: "",
                error: false,
                redirect: "",
              });
              setDisplay(newDisplay);
            }}
          >
            TRY AGAIN NOW
          </button>
        </div>
        <div style={{ paddingTop: "10px" }}>
          <button
            className={classes.ButtonGrey}
            onClick={() => {
              window.location.href = "/myaccount";
            }}
          >
            TRY AGAIN LATER
          </button>
        </div>
      </Fragment>
    );
  };

  const signInDisplay = () => {
    if (display === "signin") {
      return (
        <SignInDisplay
          authOrigin={true}
          //close={closeModal} NOT IN AUTH
          email={email}
          password={password}
          //expired={expired} NOT IN AUTH
          message={message}
          error={error}
          spinner={showSpinner}
          inputChange={handleAuthValueChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(display) => setDisplay(display)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          values={(input) => setAuthValues(input)}
          resetValues={() => resetValues()}
          submit={() => redirectUser()}
        ></SignInDisplay>
      );
    } else {
      return null;
    }
  };

  const forgotDisplay = () => {
    if (display === "forgot") {
      return (
        <ForgotDisplay
          //close={closeModal} NOT IN AUTH
          email={email}
          error={error}
          //expired={expired} NOT IN AUTH
          authOrigin={true}
          message={message}
          spinner={showSpinner}
          inputChange={handleAuthValueChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(display) => setDisplay(display)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          values={(input) => setAuthValues(input)}
          resetValues={() => resetValues()}
        ></ForgotDisplay>
      );
    } else {
      return null;
    }
  };

  const temporaryDisplay = () => {
    if (display === "temporary") {
      return (
        <TemporaryDisplay
          authOrigin={true}
          //close={closeModal} NOT IN AUTH
          email={email}
          message={message}
          reissued={reissued}
          temporary={temporary}
          error={error}
          spinner={showSpinner}
          inputChange={handleAuthValueChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setDisplay(modal)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          values={(input) => setAuthValues(input)}
          resetValues={() => resetValues()}
          submit={() => redirectUser()}
        ></TemporaryDisplay>
      );
    } else {
      return null;
    }
  };

  const signUpDisplay = () => {
    if (display === "signup") {
      return (
        <SignUpDisplay
          //close={closeModal} NOT IN AUTH
          email={email}
          error={error}
          authOrigin={true}
          //expired={expired} NOT IN AUTH
          message={message}
          password={password}
          spinner={showSpinner}
          inputChange={handleAuthValueChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setDisplay(modal)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          values={(input) => setAuthValues(input)}
          resetValues={() => resetValues()}
          submit={() => redirectUser()}
        ></SignUpDisplay>
      );
    } else {
      return null;
    }
  };

  const confirmationDisplay = () => {
    if (display === "confirmation") {
      return (
        <ConfirmationDisplay
          //close={closeModal} NOT IN AUTH
          email={email}
          error={error}
          message={message}
          authOrigin={true}
          resent={resent}
          confirmation={confirmation}
          spinner={showSpinner}
          inputChange={handleAuthValueChange}
          updateSub={updateSubValues}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setDisplay(modal)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          values={(input) => setAuthValues(input)}
        ></ConfirmationDisplay>
      );
    } else {
      return null;
    }
  };

  const passwordDisplay = () => {
    if (display === "password") {
      return (
        <PasswordDisplay
          //close={closeModal} NOT IN AUTH
          email={email}
          error={error}
          message={message}
          authOrigin={true}
          password={password}
          resetToken={resetToken}
          spinner={showSpinner}
          inputChange={handleAuthValueChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setDisplay(modal)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          values={(input) => setAuthValues(input)}
          submit={() => {
            if (initialView === "paid" || initialView === "upgrade") {
              setDisplay("gateway");
            } else {
              setDisplay("freeCongrats");
            }
          }}
        ></PasswordDisplay>
      );
    } else {
      return null;
    }
  };

  const gatewayDisplay = () => {
    let height = {};
    if (!error) {
      height = { height: "535px" };
    }
    if (display === "gateway") {
      if (showSpinner) {
        return (
          <div className={classes.BlankCanvas} style={height}>
            <Spinner />
          </div>
        );
      } else {
        return (
          <div className={classes.BlankCanvas} style={height}>
            <div className={classes.Header}>
              <div>How to Get Paid Instantly.</div>
            </div>
            <div>
              {showDetail()}
              {gatewayForm}
            </div>
          </div>
        );
      }
    } else {
      return null;
    }
  };

  const freeCongratsDisplay = () => {
    let height = {};
    if (!error) {
      height = { height: "290px" };
    }
    if (display === "freeCongrats") {
      if (showSpinner) {
        return (
          <div className={classes.BlankCanvas} style={height}>
            <Spinner />
          </div>
        );
      } else {
        return (
          <div className={classes.BlankCanvas} style={height}>
            <div className={classes.Header}>
              <div>Success!</div>
            </div>
            <div>
              {showDetail()}
              {freeCongratsForm}
            </div>
          </div>
        );
      }
    } else {
      return null;
    }
  };

  const paidCongratsDisplay = () => {
    let height = {};
    if (!error) {
      height = { height: "240px" };
    }
    if (display === "paidCongrats") {
      if (showSpinner) {
        return (
          <div className={classes.BlankCanvas} style={height}>
            <Spinner />
          </div>
        );
      } else {
        return (
          <div className={classes.BlankCanvas} style={height}>
            <div className={classes.Header}>
              <div>Success!</div>
            </div>
            <div>
              {showDetail()}
              {paidCongratsForm}
            </div>
          </div>
        );
      }
    } else {
      return null;
    }
  };

  const selectPlanDisplay = () => {
    //updateSubValues();
    let height = {};
    if (!error) {
      height = { height: "490px" };
    }
    if (display === "selectPlan") {
      if (showSpinner) {
        return (
          <div className={classes.BlankCanvas} style={height}>
            <Spinner />
          </div>
        );
      } else {
        return (
          <div className={classes.BlankCanvas} style={height}>
            <div className={classes.Header}>
              <div>Select Your Plan!</div>
            </div>
            <div>
              {showDetail()}
              {selectPlanForm}
            </div>
          </div>
        );
      }
    } else {
      return null;
    }
  };

  const paypalDisplay2 = () => {
    let height = {};
    if (!error) {
      height = { height: "500px" };
    }
    if (display === "paypal") {
      if (showSpinner) {
        return (
          <div className={classes.BlankCanvas} style={height}>
            <Spinner />
          </div>
        );
      } else {
        return (
          <div className={classes.BlankCanvas} style={height}>
            <div className={classes.Header}>Enter PayPal account info.</div>
            <div>
              {showDetail()}
              {paypalForm}
            </div>
          </div>
        );
      }
    } else {
      return null;
    }
  };

  const paypalDisplay = () => {
    if (display === "paypal") {
      return (
        <PaypalDisplay
          //authOrigin={true}
          //close={closeModal} NOT IN AUTH
          error={error}
          message={message}
          client={paypalExpress_client_id}
          secreat={paypalExpress_client_secret}
          sessionToken={authValues.sessionToken}
          accountNum={authValues.accountNum}
          spinner={showSpinner}
          inputChange={handleSubValueChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setDisplay(modal)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          submit={() => {
            if (getStatus() === 8) {
              setDisplay("paidCongrats");
            } else if (getStatus() === 5) {
              setDisplay("selectPlan");
            } else if (
              (getStatus() === 1, getStatus() === 4, getStatus() === 6)
            ) {
              setDisplay("gateway");
            } else setDisplay("signin");
          }}
        ></PaypalDisplay>
      );
    } else {
      return null;
    }
  };

  const opennodeDisplay = () => {
    if (display === "opennode") {
      return (
        <OpennodeDisplay
          authOrigin={true}
          //close={closeModal} NOT IN AUTH
          error={error}
          message={message}
          apiKey={opennode_invoice_API_KEY}
          settle={opennode_auto_settle}
          dev={opennode_dev}
          sessionToken={authValues.sessionToken}
          accountNum={authValues.accountNum}
          spinner={showSpinner}
          inputChange={handleSubValueChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setDisplay(modal)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          radioChange={(event, value, message) => {
            radioChangeSubValues(event, value, message);
          }}
          submit={() => {
            if (getStatus() === 8) {
              setDisplay("paidCongrats");
            } else if (getStatus() === 5) {
              setDisplay("selectPlan");
            } else if (
              (getStatus() === 1, getStatus() === 4, getStatus() === 6)
            ) {
              setDisplay("gateway");
            } else setDisplay("signin");
          }}
        ></OpennodeDisplay>
      );
    } else {
      return null;
    }
  };

  const errorDisplay = () => {
    let height = {};
    if (!error) {
      height = { height: "340px" };
    }
    if (display === "error") {
      if (showSpinner) {
        return (
          <div className={classes.BlankCanvas} style={height}>
            <Spinner />
          </div>
        );
      } else {
        return (
          <div className={classes.BlankCanvas} style={height}>
            <div className={classes.Header}>
              <div>System Error</div>
            </div>
            <div>{errorForm()}</div>
          </div>
        );
      }
    } else {
      return null;
    }
  };

  return (
    <div className={classes.MainContainer}>
      <div className={classes.Modal}>
        {signInDisplay()}
        {forgotDisplay()}
        {temporaryDisplay()}
        {signUpDisplay()}
        {confirmationDisplay()}
        {passwordDisplay()}
        {gatewayDisplay()}
        {paypalDisplay()}
        {opennodeDisplay()}
        {selectPlanDisplay()}
        {freeCongratsDisplay()}
        {paidCongratsDisplay()}
        {errorDisplay()}
      </div>
    </div>
  );
};

export default Authentication;
