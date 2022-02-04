import React, { useState, useEffect, Fragment } from "react";
import queryString from "query-string";

import Spinner from "../../components/UI/Spinner/SpinnerNew";
import { PayPalButton } from "react-paypal-button-v2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

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

import RadioForm from "../Vendor/RadioForm";

import stripeImg from "../../assets/Stripe/Stripe wordmark - blurple (small).png";

import classes from "./Authentication.module.css";

import GoogleLogin from "./googleLogin";
import FBLogin from "./facebookLogin";


const Authentication = () => {
  const [subIntent, setSubIntent] = useState();
  console.log("subIntent: ", subIntent);

  const [authValues, setAuthValues] = useState({
    name: "",
    email: "",
    password: "",
    vendorIntent: "",
    temporary: "",
    reissued: false,
    //
    confirmation: "",
    resent: false,
    username: "",
    resetToken: "",
    sessionToken: "",
    userId: "",
    accountNum: "",
  });

  // UPDATE WHEN A NEW PLAN IS INTRODUCED
  const [subValues, setSubValues] = useState({
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
  console.log("subValues: ", subValues);

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
  } = subValues;

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
        "AYkP3Fg50QurkfBwfk7wL4DK8dHPras1f9IKca3IlUsmCm11I6VO4dXTUjZnPPEAhnVPTbRUZqj7vS3k",
      //"AVtX1eZelPSwAZTeLo2-fyj54NweftuO8zhRW1RSHV-H7DpvEAsiLMjM_c14G2fDG2wuJQ1wOr5etzj7", // Bondirectly PayPal Sandbox ClientId
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
        //"ATOAhgR1qrhz7xQRVHyyyBnj73Ckga6swyGU-8gxFhyJRrkZgEYzaUhTwQx3BmF71lM-oiJC9VelNZDw", // OSD PayPal Production ClientId
        "AYkP3Fg50QurkfBwfk7wL4DK8dHPras1f9IKca3IlUsmCm11I6VO4dXTUjZnPPEAhnVPTbRUZqj7vS3k",

      //"AVtX1eZelPSwAZTeLo2-fyj54NweftuO8zhRW1RSHV-H7DpvEAsiLMjM_c14G2fDG2wuJQ1wOr5etzj7", // Bondirectly PayPal Sandbox ClientId
    };
  }

  // transaction status variable
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    error: false,
  });

  const [display, setDisplay] = useState("spinner"); // spinner, signin, forgot, temporary, signup, confirmation, password, username, error

  const {
    name,
    email,
    password,
    temporary,
    reissued,
    //
    confirmation,
    resent,
    username,
    resetToken,
    sessionToken,
    userId,
    accountNum,
  } = authValues;

  const { message, error } = submissionStatus;

  // edit so that it is driven by the "status" value
  // only used by useEffect to populate the "values" object
  const updateSubValues = () => {
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

      setSubValues(tempBuyerInfo);
      console.log("tempBuyerInfo: ", tempBuyerInfo);
    }
  };

  useEffect(() => {
    let startingView = queryString.parse(window.location.search).new;
    let initialView = queryString.parse(window.location.search).view;
    console.log("initialView: ", initialView);

    if (initialView === "signin") {
      console.log("going to signin");
      setDisplay("signin");
      //
    } else if (initialView === "free") {
      console.log("going to signup");
      setSubIntent("free");
      setDisplay("signup");
      console.log("subIntent: ", subIntent);
      //
    } else if (initialView === "paid") {
      console.log("going to signup");
      //assign vendor intent field to paid
      setSubIntent("paid");
      setDisplay("signup");
      console.log("subIntent: ", subIntent);
      //
    } else if (initialView === "gateway") {
      console.log("going to gateway");
      setSubIntent("paid");
      updateSubValues();
      if (
        typeof window !== "undefined" &&
        localStorage.getItem(`user`) !== null
      ) {
        let tempUser = JSON.parse(localStorage.getItem("user"));
        console.log("tempUser: ", tempUser);
        if ("user" in tempUser && "token" in tempUser) {
          setAuthValues({
            name: "",
            email: tempUser.user.email,
            password: "",
            vendorIntent: "",
            temporary: "",
            reissued: false,
            //
            confirmation: "",
            resent: false,
            username: tempUser.user.username,
            resetToken: "",
            sessionToken: tempUser.token,
            userId: tempUser.user.accountId._id,
            accountNum: tempUser.user.accountId.accountNum,
          });

          console.log("inside gtwy useEffect");
        }

        setDisplay("gateway");
      }

      setDisplay("gateway");
      //
    } else if (initialView === "stripe") {
      console.log("going to stripe");
      setDisplay("paidCongrats");
      //
    } else if (initialView === "select") {
      console.log("going to stripe");
      setDisplay("selectPlan");
      //
    } else if (initialView === "error") {
      console.log("error");
      setDisplay("error");
      //
    } else if (!initialView) {
      if (
        typeof window !== "undefined" &&
        localStorage.getItem(`user`) !== null
      ) {
        let tempUser = JSON.parse(localStorage.getItem("user"));
        if ("user" in tempUser && "token" in tempUser) {
          window.location.href = "/myaccount";
        }
      } else {
        console.log("signin");
        setDisplay("signin");
      }
    } else {
      console.log("signin");
      setDisplay("signin");
    }
  }, []);

  // THIS ASSIGNS THE "paypal_plan_id" VARIABLE TO THE SELECTED PLAN
  const radioChangePayment = (event, value, name) => {
    let tempSubValues = { ...subValues };
    tempSubValues[name] = value.value;
    tempSubValues.paypal_plan_id = value.value;
    console.log("tempSubValues: ", tempSubValues);
    setSubValues(tempSubValues);
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

  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  const submitSignIn = () => {
    setDisplay("spinner");
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signin/email`;
    let information = {
      email: email,
      password: password,
    };
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information);
    fetch(url, fetchBody)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        handleSignIn(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setSubmissionStatus({
          message: "Server down please try again",
          error: true,
        });
        setDisplay("error");
      });
  };

  const submitForgot = () => {
    setDisplay("spinner");
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signin/sendcode`;
    let information = {
      email: email,
    };
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(information),
    };
    console.log("fetching with: ", url, fetchBody);
    fetch(url, fetchBody)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        handleForgot(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setDisplay("error");
      });
  };

  const submitTemporary = () => {
    setDisplay("spinner");
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signin/confirmcode`;
    let information = {
      email: email,
      confirm_code: temporary,
    };
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information);
    fetch(url, fetchBody)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        handleTemporary(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setDisplay("error");
      });
  };

  const submitReissue = () => {
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signin/sendcode`;
    let information = {
      email: email,
    };
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information);
    fetch(url, fetchBody)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        handleReissue(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setDisplay("error");
      });
  };

  const submitSignUp = () => {
    setDisplay("spinner");
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signup/email`;
    let information = {
      email: email,
      vendorIntent: subIntent,
    };
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information);
    fetch(url, fetchBody)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        handleSignUp(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setDisplay("error");
      });
  };

  const submitConfirmation = () => {
    setDisplay("spinner");
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signup/confirmcode`;
    let information = {
      email: email,
      vendorIntent: subIntent,
      confirm_code: confirmation,
    };
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information);
    fetch(url, fetchBody)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        handleConfirmation(data);
        updateSubValues();
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setDisplay("error");
      });
  };

  const submitPassword = () => {
    setDisplay("spinner");
    setSubmissionStatus({
      message: "",
      error: false,
    });
    //
    //
    //
    //
    //
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signup/password`;
    let information = {
      email: email,
      passwordToken: resetToken,
      password: password,
      vendorIntent: subIntent,
    };
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information);
    fetch(url, fetchBody)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        handlePassword(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setDisplay("error");
      });
  };

  const submitStripe = () => {
    setDisplay("spinner");
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${sessionToken}`);
    //myHeaders.append("Access-Control-Allow-Origin", "*");
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
      });
    /*
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        //handleUsername(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setDisplay("error");
      });
      */
  };

  const submitResend = () => {
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signup/resendcode`;
    let information = {
      email: email,
    };
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information);
    fetch(url, fetchBody)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        handleResend(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setDisplay("error");
      });
  };

  const handleSignIn = (data) => {
    if (data.status) {
      localStorage.setItem("user", JSON.stringify(data)); // KEEP
      setAuthValues({
        name: "",
        email: "",
        password: "",
        vendorIntent: "",
        temporary: "",
        reissued: false,
        //
        confirmation: "",
        resent: false,
        username: "",
        resetToken: "",
        sessionToken: "",
        userId: "",
        accountNum: "",
      });
      redirectUser();
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      setDisplay("signin");
      console.log("ERROR: ", data.error);
    }
  };

  const handleForgot = (data) => {
    if (data.status) {
      setAuthValues({
        name: "",
        email: data.user.email,
        password: "",
        vendorIntent: "",
        temporary: "",
        reissued: false,
        //
        confirmation: "",
        resent: false,
        username: "",
        resetToken: "",
        sessionToken: "",
        userId: "",
        accountNum: "",
      });
      setDisplay("temporary");
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      setDisplay("forgot");
      console.log("ERROR: ", data.error);
    }
  };

  const handleTemporary = (data) => {
    if (data.status) {
      localStorage.setItem("user", JSON.stringify(data)); // KEEP
      setAuthValues({
        name: "",
        email: "",
        password: "",
        vendorIntent: "",
        temporary: "",
        reissued: false,
        //
        confirmation: "",
        resent: false,
        username: "",
        resetToken: "",
        sessionToken: "",
        userId: "",
        accountNum: "",
      });
      redirectUser();
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      setDisplay("temporary");
      console.log("ERROR: ", data.error);
    }
  };

  const handleReissue = (data) => {
    if (data.status) {
      //
      setAuthValues({
        name: "",
        email: data.user.email,
        password: "",
        vendorIntent: "",
        temporary: "",
        reissued: true,
        //
        confirmation: "",
        resent: false,
        username: "",
        resetToken: "",
        sessionToken: "",
        userId: "",
        accountNum: "",
      });
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      console.log("ERROR: ", data.error);
    }
  };

  const handleSignUp = (data) => {
    console.log("data: ", data);
    console.log("data.status: ", data.status);
    if (data.status) {
      console.log("inside true handleSignUp");
      setAuthValues({
        name: "",
        email: data.user.email,
        password: "",
        // need to capture vendotIntent field from server response object
        vendorIntent: subIntent,
        temporary: "",
        reissued: false,
        //
        confirmation: "",
        resent: false,
        username: data.user.username,
        resetToken: "",
        sessionToken: "",
        userId: "",
        accountNum: "",
      });
      console.log("inside true handleSignUp");
      console.log("SUCCESS");
      setDisplay("confirmation");
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      setDisplay("signup");
      console.log("ERROR: ", data.error);
    }
  };

  const handleConfirmation = (data) => {
    console.log("data: ", data);
    if (data.status) {
      //
      localStorage.setItem("user", JSON.stringify(data)); // KEEP
      setAuthValues({
        name: "",
        email: data.user.email,
        password: "",
        // need to capture vendotIntent field from server response object
        vendorIntent: subIntent,
        temporary: "",
        reissued: false,
        //
        confirmation: "",
        resent: false,
        username: data.user.username,
        resetToken: data.user.passwordToken,
        sessionToken: "",
        userId: data.user.accountId._id,
        accountNum: data.user.accountId.accountNum,
      });
      console.log("SUCCESS");
      setDisplay("password");
    } else {
      console.log("Inside handleConfirmation false");
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      setDisplay("confirmation");
      console.log("ERROR: ", data.error);
    }
  };

  const handlePassword = (data) => {
    console.log("data: ", data);
    console.log("STATUS: ", data.status);
    if (data.status) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      console.log("user from local storage: ", tempUser);
      tempUser.token = data.token;
      localStorage.setItem("user", JSON.stringify(tempUser));
      setAuthValues({
        name: "",
        email: email,
        password: "",
        vendorIntent: "",
        temporary: "",
        reissued: false,
        //
        confirmation: "",
        resent: false,
        username: username,
        resetToken: "",
        sessionToken: data.token,
        userId: userId,
        accountNum: accountNum,
      });
      console.log("SUCCESS");
      if (subIntent === "paid") {
        setDisplay("gateway");
      } else if (subIntent === "free") {
        setDisplay("freeCongrats");
        console.log("CONGRATULATIONS");
      }
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      setDisplay("password");
      console.log("ERROR: ", data.error);
    }
  };

  const resetValues = () => {
    setAuthValues({
      name: "",
      email: "",
      password: "",
      vendorIntent: "",
      temporary: "",
      reissued: false,
      //
      confirmation: "",
      resent: false,
      username: "",
      resetToken: "",
      sessionToken: "",
      userId: "",
      accountNum: "",
    });
  };

  const handleResend = (data) => {
    if (data.status) {
      //
      setAuthValues({
        name: "",
        email: data.user.email,
        password: "",
        vendorIntent: "",
        temporary: "",
        reissued: false,
        //
        confirmation: "",
        resent: true,
        username: username,
        resetToken: "",
        sessionToken: "",
        userId: "",
        accountNum: "",
      });
      console.log("SUCCESS");
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      console.log("ERROR: ", data.error);
    }
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

  const redirectUser = () => {
    console.log("Redirect user");
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("user") !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      if ("token" in tempUser && "user" in tempUser) {
        window.location.href = "/myaccount";
      } else {
        setSubmissionStatus({
          message: "Server error please try again",
          error: true,
        });
        setDisplay("error");
      }
    } else {
      setSubmissionStatus({
        message: "Server error please try again",
        error: true,
      });
      setDisplay("error");
    }
  };

  const showDetail = () => {
    if (error) {
      return (
        <div style={{ color: "red", fontSize: "14px", paddingBottom: "20px" }}>
          {message}
        </div>
      );
      //
      //
      //
      //
      //
      //
    } else if (
      display === "signin" ||
      display === "forgot" ||
      display === "signup" ||
      display === "password"
    ) {
      return null;
    } else if (display === "temporary" && !reissued) {
      console.log("authValues: ", authValues);
      return (
        <Fragment>
          <div style={{ fontSize: "16px", paddingBottom: "10px" }}>
            Enter the 6-digit code sent to:
          </div>
          <div style={{ fontSize: "16px", paddingBottom: "20px" }}>{email}</div>
        </Fragment>
      );
    } else if (display === "temporary" && reissued) {
      console.log("authValues: ", authValues);
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          Confirmation code resent to your email.
        </div>
      );
    } else if (display === "confirmation" && !resent) {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          Enter the 6-digit code sent to your email:
        </div>
      );
    } else if (display === "confirmation" && resent) {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          A new 6-digit code was sent to your email,
          <br></br>
          please enter it below:
        </div>
      );
    } else if (display === "gateway") {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          The payment gateway determines how you will instantly receive revenues
          from ticket sales.
        </div>
      );
    } else if (display === "freeCongrats") {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          You have successfully signed up for a free account.
        </div>
      );
    } /*else if (display === "selectPlan") {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          Choose a plan and submit your payment to PayPal:
        </div>
      );
    } */
  };

  const signInForm = (
    <Fragment>
      <div style={{ paddingBottom: "20px", width: "100%", height: "85px" }}>
        <label style={{ fontSize: "15px" }}>E-mail Address</label>
        <input
          className={classes.InputBox}
          type="email"
          name="email"
          onChange={handleAuthValueChange}
          value={email}
        />
      </div>

      <div style={{ paddingBottom: "20px", width: "100%", height: "85px" }}>
        <label style={{ fontSize: "15px" }}>Password</label>
        <input
          className={classes.InputBox}
          type="password"
          name="password"
          onChange={handleAuthValueChange}
          value={password}
        />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            submitSignIn();
          }}
        >
          Sign In
        </button>
      </div>
      <center>Or</center>
      <GoogleLogin />
      <FBLogin />
    </Fragment>
  );

  const forgotForm = (
    <Fragment>
      <div style={{ paddingBottom: "20px", width: "100%", height: "85px" }}>
        <label style={{ fontSize: "15px" }}>E-mail Address</label>
        <input
          className={classes.InputBox}
          type="email"
          name="email"
          onChange={handleAuthValueChange}
          value={email}
        />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            submitForgot();
          }}
        >
          SUBMIT YOUR EMAIL
        </button>
      </div>
    </Fragment>
  );

  const temporaryForm = (
    <Fragment>
      <div style={{ paddingBottom: "20px", width: "100%", height: "85px" }}>
        <label style={{ fontSize: "15px" }}>Confirmation code</label>
        <input
          className={classes.InputBox}
          type="text"
          name="temporary"
          onChange={handleAuthValueChange}
          value={temporary}
        />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            submitTemporary();
          }}
        >
          SUBMIT CONFIRMATION CODE
        </button>
      </div>
    </Fragment>
  );

  const signUpForm = (
    <Fragment>
      <div style={{ paddingBottom: "20px", width: "100%", height: "85px" }}>
        <label style={{ fontSize: "15px" }}>E-mail Address</label>
        <input
          className={classes.InputBox}
          type="email"
          name="email"
          onChange={handleAuthValueChange}
          value={email}
        />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            submitSignUp();
          }}
        >
          SUBMIT YOUR EMAIL
        </button>
      </div>
    </Fragment>
  );

  const confirmationForm = (
    <Fragment>
      <div style={{ paddingBottom: "20px", width: "100%", height: "85px" }}>
        <label style={{ fontSize: "15px" }}>Confirmation Number</label>
        <input
          className={classes.InputBox}
          type="text"
          name="confirmation"
          onChange={handleAuthValueChange}
          value={confirmation}
        />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            submitConfirmation();
          }}
        >
          SUBMIT YOUR CODE
        </button>
      </div>
    </Fragment>
  );

  const passwordForm = (
    <Fragment>
      <div style={{ paddingBottom: "20px", width: "100%", height: "85px" }}>
        <label style={{ fontSize: "15px" }}>Password</label>
        <input
          className={classes.InputBox}
          type="text"
          name="password"
          onChange={handleAuthValueChange}
          value={password}
        />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            submitPassword();
          }}
        >
          REGISTER YOUR PASSWORD
        </button>
      </div>
    </Fragment>
  );

  const gatewayForm = (
    <Fragment>
      <div style={{ paddingTop: "10px", paddingBottom: "10px" }}>
        <button
          style={{
            background: "white",
            width: "160",
            border: "none",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <img
            src={stripeImg}
            alt="STRIPE"
            width="160"
            height="120"
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
            border: "none",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <img
            src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
            alt="PAYPAL"
            width="160"
            height="120"
            cursor="pointer"
            onClick={() => {
              console.log("selecting PayPal");
              setDisplay("paypal");
            }}
          ></img>
        </button>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.CancelButton}
          onClick={() => {
            redirectUser();
          }}
        >
          STAY WITH COMMUNITY ACCOUNT
        </button>
      </div>
    </Fragment>
  );

  const freeCongratsForm = (
    <Fragment>
      <div style={{ paddingTop: "10px", paddingBottom: "10px" }}></div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.CancelButton}
          onClick={() => {
            setDisplay("gateway");
          }}
        >
          I WANT TO UPGRADE MY ACCOUNT
        </button>
        <button
          className={classes.CancelButton}
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
  const showPayPal = (
    <div>
      <br></br>
      <div>PAYPAL FORM NEW</div>
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
              //const authstring = `Bearer ${props.token}`;
              console.log("about to send paypal object to server");
              //return fetch(`${API}/paypal/subscription/${props.userid}`, {
              return fetch(
                //`${API}/accounts/${props.accountNum}/subscription/paypal-express/subscribe`,
                {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    //Authorization: authstring,
                  },
                  body: JSON.stringify({
                    data: data,
                    details: details,
                    //promoCode: promoCodeDetails.appliedPromoCode,
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
                    //setPageView("receipt");
                  } else {
                    console.log("inside else");
                    //setPageView("receiptErrorPage");
                  }
                }) // add .catch block for failed response from server, press "continue" button to go to paypal clientId model
                .catch((err) => {
                  console.log("Inside inner .catch");
                  //setPageView("receiptErrorPage");
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
          //clientId:
          //  "AYkP3Fg50QurkfBwfk7wL4DK8dHPras1f9IKca3IlUsmCm11I6VO4dXTUjZnPPEAhnVPTbRUZqj7vS3k",
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
      console.log("!promoCodeDetails.input");
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
            Step 2 of 3: Select a Subscription Plan
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
                ////setPageView("organization");
              }}
            >
              BACK TO ORGANIZATION PAGE
            </button>
          </div>
        </div>
      </div>
    );
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
          Choose a plan and submit your payment to PayPal:
        </div>
      );
    }
  };

  // UPDATE WHEN A NEW PLAN IS INTRODUCED BY ADDING A NEW '<RadioForm>' CODE
  // Displays subscription pricing options section based on promo code entered
  const paymentPanel = () => {
    console.log("subValues info: ", subValues);
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
          {paypal_plan_id ? showPayPal : null}
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
          {paypal_plan_id ? showPayPal : null}
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
          {paypal_plan_id ? showPayPal : null}
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
          {paypal_plan_id ? showPayPal : null}
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
          {paypal_plan_id ? showPayPal : null}
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
            showPayPal
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
          {paypal_plan_id ? showPayPal : null}
        </Fragment>
      );
    }
  };

  const submitFreeSub = () => {
    let tempData = JSON.parse(localStorage.getItem("user"));
    let accountNum = tempData.user.accountId.accountNum;
    console.log("tempData: ", tempData);
    ////const authstring = `Bearer ${props.token}`;
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
          ////setPageView("receipt");
        } else {
          console.log("error in if then else");
          ////setPageView("receiptErrorPage");
        }
      }) // add .catch block for failed response from server, press "continue" button to go to paypal clientId model
      .catch((err) => {
        console.log("error in .then .catch");
        ////setPageView("receiptErrorPage");
      });
  };

  // Displays the entire subscription payment panel
  const selectPlanForm = (
    <div className={classes.DisplayPanel}>
      <div>
        <div className={classes.PaymentCanvas}>
          {paymentInstructions()}
          {promoOption()}
          {paymentPanel()}
        </div>
      </div>
    </div>
  );

  const paypalForm = (
    <Fragment>
      <div style={{ paddingTop: "10px", paddingBottom: "10px" }}></div>

      <div style={{ paddingBottom: "20px", width: "700px", height: "85px" }}>
        <label style={{ width: "700px", fontSize: "15px" }}>
          Paypal Client ID <span style={{ color: "red" }}>* </span>
        </label>
        <input
          onFocus={() => {
            setSubValues({ ...subValues, inputError: "" });
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
          onChange={handleSubValueChange}
          value={paypalExpress_client_id}
        />
      </div>
      <div>
        <label style={{ width: "700px", fontSize: "15px" }}>
          Paypal Secret <span style={{ color: "red" }}>* </span>
        </label>
        <input
          onFocus={() => {
            setSubValues({ ...subValues, inputError: "" });
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
          onChange={handleSubValueChange}
          value={paypalExpress_client_secret}
        />
      </div>
      <div style={{ textAlign: "center", paddingTop: "40px" }}>
        <button
          className={classes.ButtonGreen}
          style={{ width: "700px" }}
          disabled={!paypalExpress_client_id || !paypalExpress_client_secret}
          onClick={() => {
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
            console.log("fetching with: ", url, fetcharg);
            fetch(url, fetcharg)
              .then(handleErrors)
              .then((response) => {
                console.log("then response: ", response);
                return response.json();
              })
              .then((data) => {
                console.log("fetch return got back data on PayPal:", data);

                if (data.status) {
                  console.log("INSIDE data.status");
                  let tempData = JSON.parse(localStorage.getItem("user"));
                  console.log("tempData: ", tempData);
                  tempData.user.accountId = data.result;
                  localStorage.setItem("user", JSON.stringify(tempData));
                  //updatePageView();
                  setDisplay("selectPlan");
                } else {
                  // this is a friendly error
                  let errmsg =
                    "unable to validate ClientId and secret at this time";
                  if (data.message) {
                    errmsg = data.message;
                  }
                  window.alert(errmsg);
                  setDisplay("selectPlan");
                }
              })
              .catch((err) => {
                ////setPreFetchView(pageView);
                console.log(err);
                ////setPageView("error");
              });
          }}
        >
          SUBMIT YOUR PAYPAL MERCHANT INFORMATION
        </button>
      </div>
    </Fragment>
  );

  const detailsForm = (
    <Fragment>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.CancelButton}
          onClick={() => {
            setDisplay("gateway");
            //redirectUser();
          }}
        >
          CONTINUE
        </button>
      </div>
    </Fragment>
  );

  const errorForm = (
    <Fragment>
      <div
        style={{
          fontSize: "16px",
          color: "red",
          paddingBottom: "20px",
          width: "340px",
          height: "40px",
        }}
      >
        Please try again later
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            window.location.href = "/";
          }}
        >
          CONTINUE
        </button>
      </div>
    </Fragment>
  );

  const alternateSignInInputs = (
    <div className={classes.Alternates}>
      <div style={{ textAlign: "left" }}>
        <button
          className={classes.BlueText}
          onClick={() => {
            resetValues();
            setDisplay("forgot");
          }}
        >
          Forgot password?
        </button>
      </div>
      <div style={{ textAlign: "right" }}>
        <button
          className={classes.BlueText}
          onClick={() => {
            resetValues();
            setDisplay("signup");
          }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );

  const alternateTemporaryInputs = (
    <div className={classes.Alternates}>
      <div style={{ textAlign: "left" }}>
        <button
          className={classes.BlueText}
          onClick={() => {
            submitReissue();
          }}
        >
          Resend code
        </button>
      </div>
      <div style={{ textAlign: "right" }}>
        Back to{" "}
        <button
          className={classes.BlueText}
          onClick={() => {
            setDisplay("signin");
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );

  const alternateSignUpInputs = (
    <div className={classes.Alternates}>
      <div style={{ textAlign: "left" }}>
        Back to{" "}
        <button
          className={classes.BlueText}
          onClick={() => {
            setDisplay("signin");
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );

  const alternateConfirmationInputs = (
    <div className={classes.Alternates}>
      <div style={{ textAlign: "left" }}>
        <button
          className={classes.BlueText}
          onClick={() => {
            submitResend();
          }}
        >
          Resend code
        </button>
      </div>
    </div>
  );
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  const spinnerDisplay = () => {
    if (display === "spinner") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <Spinner />
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const signInDisplay = () => {
    if (display === "signin") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Log in to Open Seat Direct</div>
          </div>
          <div>
            {showDetail()}
            {signInForm}
            {alternateSignInInputs}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const forgotDisplay = () => {
    if (display === "forgot") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Trouble logging in?</div>
          </div>
          <div>
            {showDetail()}
            {forgotForm}
            {alternateSignUpInputs}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const temporaryDisplay = () => {
    if (display === "temporary") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Enter confirmation code</div>
          </div>
          <div>
            {showDetail()}
            {temporaryForm}
            {alternateTemporaryInputs}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const signUpDisplay = () => {
    if (display === "signup") {
      console.log("inside signup display");
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Tell us about yourself</div>
          </div>
          <div>
            {showDetail()}
            {signUpForm}
            {alternateSignUpInputs}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const confirmationDisplay = () => {
    if (display === "confirmation") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Enter confirmation code</div>
          </div>
          <div>
            {showDetail()}
            {confirmationForm}
            {alternateConfirmationInputs}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const passwordDisplay = () => {
    if (display === "password") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Create your password</div>
          </div>
          <div>
            {showDetail()}
            {passwordForm}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const gatewayDisplay = () => {
    if (display === "gateway") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Select a Payment Gateway</div>
          </div>
          <div>
            {showDetail()}
            {gatewayForm}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const freeCongratsDisplay = () => {
    if (display === "freeCongrats") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Success you know have a free account</div>
          </div>
          <div>
            {showDetail()}
            {freeCongratsForm}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const selectPlanDisplay = () => {
    if (display === "selectPlan") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Select a Subscription PlanNEW</div>
          </div>
          <div>
            {showDetail()}
            {selectPlanForm}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const paypalDisplay = () => {
    if (display === "paypal") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            Enter the ClientId and Secret from your PayPal merchant account.
          </div>
          <div>
            {showDetail()}
            {paypalForm}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const subDetailsDisplay = () => {
    if (display === "details") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Pro-Plan details</div>
          </div>
          <div>
            {/*showDetail()*/}
            {detailsForm}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const errorDisplay = () => {
    if (display === "error") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>System Error</div>
          </div>
          <div>{errorForm}</div>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className={classes.MainContainer}>
      <div className={classes.Modal}>
        {spinnerDisplay()}
        {signInDisplay()}
        {forgotDisplay()}
        {temporaryDisplay()}
        {signUpDisplay()}
        {confirmationDisplay()}
        {passwordDisplay()}
        {gatewayDisplay()}
        {paypalDisplay()}
        {selectPlanDisplay()}
        {subDetailsDisplay()}
        {freeCongratsDisplay()}
        {errorDisplay()}
      </div>
    </div>
  );
};

export default Authentication;
