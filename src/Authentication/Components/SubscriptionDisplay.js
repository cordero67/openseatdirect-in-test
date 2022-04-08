import React, { useState, useEffect, Fragment } from "react";

import Spinner from "../../components/UI/Spinner/SpinnerNew";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { PayPalButton } from "react-paypal-button-v2";

import RadioForm from "../../components/Forms/RadioForm";

import { SubscriptionPlans } from "../Resources/Variables";

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
  SUBSCRIPTION_PROMO_CODE_9,
  SUBSCRIPTION_PROMO_CODE_10,
  SUBSCRIPTION_PROMO_CODE_11,
  SUBSCRIPTION_PROMO_CODE_12,
  SUBSCRIPTION_PROMO_CODE_13,
} from "../../config";

import classes from "./Components.module.css";

const SubscriptionDisplay = (props) => {
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    error: false,
  });
  const { message, error } = submissionStatus;

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
      SUBSCRIPTION_PROMO_CODE_9,
      SUBSCRIPTION_PROMO_CODE_10,
      SUBSCRIPTION_PROMO_CODE_11,
      SUBSCRIPTION_PROMO_CODE_12,
      SUBSCRIPTION_PROMO_CODE_13,
    ],
  });

  // UPDATE WHEN A NEW PAYPAL PLAN IS INTRODUCED
  const [subValues, setSubValues] = useState({
    paypal_plan_id: "P-3E209303AY287713HMDN3PLQ", // default value is production monthly plan
    paypal_plan_id_full: "", // default plan for "FULL" ticket plan selection view
    paypal_plan_id_discount: "", // default plan for "DISCOUNT" ticket plan selection view
    paypal_plan_id_forFree: "", // default plan for "FORFREE" ticket plan selection view
    paypal_plan_id_growPR: "", // default plan for "FORFREE" ticket plan selection view
    paypal_plan_id_fiftyPercent: "", // default plan for "FORFREE" ticket plan selection view
    paypal_plan_id_old: "", // default plan for "OLD" ticket plan selection view
    paypal_plan_id_oldDiscounted: "", // default plan for "OLDDISCOUNTED" ticket plan selection view
    paypal_plan_id_freeSubscription: "", // default plan for "FREESUBSCRIPTION" ticket plan selection view
  });

  const {
    paypal_plan_id,
    paypal_plan_id_full,
    paypal_plan_id_discount,
    paypal_plan_id_forFree,
    paypal_plan_id_growPR,
    paypal_plan_id_fiftyPercent,
    paypal_plan_id_old,
    paypal_plan_id_oldDiscounted,
    paypal_plan_id_freeSubscription,
  } = subValues;

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("user") !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      if ("user" in tempUser && "accountId" in tempUser.user) {
        let tempBuyerInfo = {};

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
          tempBuyerInfo.paypal_plan_id_fiftyPercent =
            "P-3U3085871T847894PL5FRXTI"; // sandbox monthly full price
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
          tempBuyerInfo.paypal_plan_id_fiftyPercent =
            "P-9JU02589EP1173940MJALTXA"; // production annuall 50% off first year
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
        setSubValues(tempBuyerInfo);
        console.log("tempBuyerInfo: ", tempBuyerInfo);
      }
    } else {
      console.log("no user object");
    }
  }, []);

  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
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
      } else if (
        inputtedPromoCode === "TIGERWONOSD50" ||
        inputtedPromoCode === "FRIEND" ||
        inputtedPromoCode === "OPENSEATDIRECTFRIEND" ||
        inputtedPromoCode === "TIGERWON"
      ) {
        console.log(
          "tempSubValues.paypal_plan_id_fiftyPercent: ",
          tempSubValues.paypal_plan_id_fiftyPercent
        );
        tempSubValues.paypal_plan_id =
          tempSubValues.paypal_plan_id_fiftyPercent;
      } else if (inputtedPromoCode === "OSD70") {
        tempSubValues.paypal_plan_id = tempSubValues.paypal_plan_id_old;
      } else if (inputtedPromoCode === "OSD50") {
        tempSubValues.paypal_plan_id =
          tempSubValues.paypal_plan_id_oldDiscounted;
      } else if (
        inputtedPromoCode === "OSDFREE" ||
        inputtedPromoCode === "FREE"
      ) {
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

  const paymentInstructions = () => {
    console.log();
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
            paddingBottom: "20px",
          }}
        >
          Submit your payment to PayPal:
        </div>
      );
    } else if (
      promoCodeDetails.appliedPromoCode === "OSDFREE" ||
      promoCodeDetails.appliedPromoCode === "FREE"
    ) {
      return (
        <div
          style={{
            fontSize: "16px",
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
                setSubmissionStatus({ message: "", error: false });
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
                let tempobject = { ...promoCodeDetails };
                tempobject.inputtedPromoValue = event.target.value;
                tempobject.errorMessage = "";
                setPromoCodeDetails(tempobject);
              }}
              onFocus={() => {
                setSubmissionStatus({ message: "", error: false });
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
  // creates contents inside promo code input form
  const promoOption = () => {
    console.log("promoCodeDetails: ", promoCodeDetails);
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
              console.log("hit hyperlink");
              let tempPromoCodeDetails = { ...promoCodeDetails };
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

  const showDetail = () => {
    if (error) {
      return <div className={classes.ErrorText}>{message}</div>;
    } else return null;
  };

  let subscriptions = SubscriptionPlans();

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

  // GROWPR promo code plans
  const growPRPlan = [
    {
      label: subscriptions.annualGrowPR.name,
      value: subscriptions.annualGrowPR.id,
    },
  ];

  // OSD50 promo code plans
  const oldAnnualDiscountedPlan = [
    {
      label: subscriptions.annuallyOldPriceDiscounted.name,
      value: subscriptions.annuallyOldPriceDiscounted.id,
    },
  ];

  // FIFTYPERCENT promo code plans
  const fiftyPercentPlan = [
    {
      label: subscriptions.annualFiftyPercent.name,
      value: subscriptions.annualFiftyPercent.id,
    },
  ];

  // OSDFREE promo code plans
  const freeSubscriptionPlan = [
    {
      label: subscriptions.freeSubscription.name,
      value: subscriptions.freeSubscription.id,
    },
  ];

  // Detailed definition of subscription plans based on promo code entered
  // No promo code plans: DEFAULT SUBSCRIPTIONS
  const paymentPlans = [
    { label: subscriptions.monthly.name, value: subscriptions.monthly.id },
    { label: subscriptions.annually.name, value: subscriptions.annually.id },
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
      promoCodeDetails.appliedPromoCode === SUBSCRIPTION_PROMO_CODE_9 ||
      promoCodeDetails.appliedPromoCode === SUBSCRIPTION_PROMO_CODE_10 ||
      promoCodeDetails.appliedPromoCode === SUBSCRIPTION_PROMO_CODE_11 ||
      promoCodeDetails.appliedPromoCode === SUBSCRIPTION_PROMO_CODE_12
    ) {
      return fiftyPercentPlan;
    } else if (
      promoCodeDetails.appliedPromoCode === SUBSCRIPTION_PROMO_CODE_5 ||
      promoCodeDetails.appliedPromoCode === SUBSCRIPTION_PROMO_CODE_13
    ) {
      return freeSubscriptionPlan;
    } else return paymentPlans;
  };

  const handleFreeSub = (data) => {
    if (data.status) {
      let tempData = JSON.parse(localStorage.getItem("user"));
      tempData.user.accountId = data.result;
      localStorage.setItem("user", JSON.stringify(tempData));
      props.submit();
      props.spinnerChange(false);
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      props.displayChange("subscription");
      props.spinnerChange(false);
    }
  };

  const submitFreeSub = () => {
    const authstring = `Bearer ${props.sessionToken}`;
    fetch(`${API}/accounts/${props.accountNum}/subscription/nopay`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authstring,
      },
      body: JSON.stringify({
        promo: promoCodeDetails.appliedPromoCode,
      }),
    })
      .then(handleErrors)
      .then((response) => {
        console.log("MADE IT PAST handleErrors");
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data on free subscription:", data);
        handleFreeSub(data);
      })
      .catch((err) => {
        console.log("error.message: ", error.message);
        props.showError();
        props.spinnerChange(false);
      });
  };

  // change plan_id value to be a variable value depending on $10 or $35 choice, right now its the same
  const showPayPal = () => {
    return (
      <div>
        <PayPalButton
          onButtonReady={() => {}}
          createSubscription={(data, actions) => {
            return actions.subscription.create({
              plan_id: subValues.paypal_plan_id,
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
                const authstring = `Bearer ${props.sessionToken}`;
                console.log("about to send paypal object to server");
                props.spinnerChange(true);
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
                        props.displayChange("paidCongrats");
                      } else if (tempData.user.accountId.status === 6) {
                        props.displayChange("gateway");
                      } else {
                        props.displayChange("gateway");
                      }
                      props.spinnerChange(false);
                    } else {
                      console.log("inside else");
                      props.displayChange("paidCongrats");
                      props.spinnerChange(false);
                    }
                  }) // need better error handling
                  .catch((err) => {
                    console.log("Inside inner .catch");
                    props.displayChange("paidCongrats");
                    props.spinnerChange(false);
                  });
              })
              .catch((err) => {
                console.log("Inside outer .catch");
                window.alert("Problem with Paypal.");
                props.spinnerChange(false);
              });
          }}
          onError={(err) => {
            console.log("error occurs: ", err);
            window.alert("Problem connecting with PayPal. Please try again.");
            props.spinnerChange(false);
          }}
          options={{
            clientId: subscriptions.clientId,
            currency: "USD",
            vault: true,
          }}
          catchError={(err) => {
            console.log("error occurs: ", err);
            window.alert("Problem connecting with PayPal. Please try again.");
            props.spinnerChange(false);
          }}
        />
      </div>
    );
  };

  const radioChangeSubValues = (event, value, name) => {
    console.log("name: ", name);
    console.log("value: ", value);
    let tempSubValues = { ...subValues };
    tempSubValues[name] = value.value;
    tempSubValues["paypal_plan_id"] = value.value;
    console.log("tempSubValues: ", tempSubValues);
    setSubValues(tempSubValues);
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
    } else if (
      promoCodeDetails.appliedPromoCode === "TIGERWONOSD50" ||
      promoCodeDetails.appliedPromoCode === "FRIEND" ||
      promoCodeDetails.appliedPromoCode === "OPENSEATDIRECTFRIEND" ||
      promoCodeDetails.appliedPromoCode === "TIGERWON"
    ) {
      console.log("FIFTYPERCENT");
      console.log("paypal_plan_id: ", paypal_plan_id);
      console.log("paypal_plan_id_fiftyPErcent: ", paypal_plan_id_fiftyPercent);
      return (
        <Fragment>
          <RadioForm
            details={shownPlans()}
            group="eventTypeGroup"
            current={paypal_plan_id_fiftyPercent}
            change={(event, value) => {
              radioChangeSubValues(event, value, "paypal_plan_id_fiftyPercent");
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
    } else if (
      promoCodeDetails.appliedPromoCode === "OSDFREE" ||
      promoCodeDetails.appliedPromoCode === "FREE"
    ) {
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
                Confirm Selection
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

  // Displays the entire subscription payment panel
  const subscriptionForm = (
    <Fragment>
      {paymentInstructions()}
      {promoOption()}
      {paymentPanel()}
    </Fragment>
  );

  if (props.spinner) {
    return (
      <div className={classes.BlankCanvas} style={{ height: "453px" }}>
        <Spinner />
      </div>
    );
  } else {
    return (
      <div className={classes.BlankCanvas}>
        <div className={classes.Header}>
          <div>Select Your Plan!</div>
        </div>
        <div>
          {showDetail()}
          {subscriptionForm}
        </div>
      </div>
    );
  }
};

export default SubscriptionDisplay;
