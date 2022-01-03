import React, { useState, useEffect, Fragment } from "react";

import { API } from "../../config.js";
import { PayPalButton } from "react-paypal-button-v2";

import Spinner from "../../components/UI/Spinner/Spinner";
import classes from "./Checkout.module.css";

// defines the PayPal "purchase_units.items" value populated from "ticketOrder"
let paypalArray = [];

const Checkout = (props) => {
  //console.log("PayPal props guestInformation: ", props.guestInformation);
  //console.log("PayPal props customerInformation: ", props.customerInformation);
  const [display, setDisplay] = useState("main"); // defines panel displayed: main, spinner, paypal

  useEffect(() => {
    populatePaypalArray();
  }, []);

  // LOOKS GOOD 12/15/2021
  const calculateTimeLeft = () => {
    let timeElapsed = new Date(props.orderExpiration) - new Date();
    let elapsedTime = {
      days: Math.floor(timeElapsed / (1000 * 60 * 60 * 24)),
      hours: Math.floor((timeElapsed / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((timeElapsed / 1000 / 60) % 60),
      seconds: Math.floor((timeElapsed / 1000) % 60),
    };
    return elapsedTime;
  };

  // LOOKS GOOD 12/15/2021
  const timeRemaining = () => {
    if (+new Date(props.orderExpiration) >= +new Date()) {
      let twoDigitSec;
      if (calculateTimeLeft().seconds < 10) {
        twoDigitSec = "0" + calculateTimeLeft().seconds;
      } else {
        twoDigitSec = calculateTimeLeft().seconds;
      }

      return (
        <div style={{ fontSize: "16px", textAlign: "center" }}>
          Ticket reservation expires in {calculateTimeLeft().minutes}:
          {twoDigitSec}
        </div>
      );
    } else {
      props.clicked();
    }
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // runs the "timeLeft" hook every 1000 milliseconds === 1 second
  // this causes the page to refresh which updates the time expired numbers
  // these numbers are fed by the "calculateTimeLeft()" function
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  // sets the PayPal "purchase_units.items" value
  const populatePaypalArray = () => {
    paypalArray = [];
    props.ticketInfo.forEach((item) => {
      if (item.ticketsSelected > 0) {
        let newElement;
        newElement = {
          name: `${props.event.eventTitle}: ${item.ticketName}`,
          sku: item.ticketID,
          unit_amount: {
            currency_code: props.orderTotals.currencyAbv,
            value: item.ticketPrice.toString(),
          },
          quantity: item.ticketsSelected.toString(),
        };
        paypalArray.push(newElement);
      }
    });
    console.log("paypalArray: ", paypalArray);
  };

  // LOOKS GOOD 12/15/2021
  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  // submits paypal transaction information to the server
  const payPalPurchase = (details) => {
    setDisplay("spinner");
    let order = {
      eventNum: props.event.eventNum,
      totalAmount: props.orderTotals.finalPurchaseAmount,
      paypalId: details.id, // not required if “isFree === true”
    };

    if (props.orderTotals.finalPurchaseAmount === 0) {
      order.isFree = true;
    } else {
      order.isFree = false;
    }

    let tickets = [];
    props.ticketInfo.forEach((item) => {
      if (item.ticketsSelected > 0) {
        let tempObject = {};
        tempObject.ticketID = item.ticketID;
        tempObject.ticketsSelected = item.ticketsSelected;
        tickets.push(tempObject);
        if (
          item.ticketsSelected > 0 &&
          "form" in item.ticketPriceFunction &&
          item.ticketPriceFunction.form === "promo" &&
          item.adjustedTicketPrice !== item.ticketPrice
        ) {
          order.promo = item.ticketPriceFunction.args[0].name;
        }
      }
    });

    order.tickets = tickets;

    let url;
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (props.customerInformation.sessionToken !== "") {
      url = `${API}/tixorder/signed_place_neworder`;

      console.log("signed order: ", order);

      myHeaders.append(
        "Authorization",
        `Bearer ${props.customerInformation.sessionToken}`
      );
    } else {
      url = `${API}/tixorder/unsigned_place_neworder`;

      order.guestFirstname = props.customerInformation.firstname;
      order.guestLastname = props.customerInformation.lastname;
      order.guestEmail = props.customerInformation.email;

      console.log("unsigned order: ", order);
    }

    let fetcharg = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(order),
    };

    fetch(url, fetcharg)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        props.display(true);
      })
      .catch((error) => {
        console.log("paymentOnSuccess() error.message: ", error.message);
        props.display(false);
      });
  };

  // LOOKS GOOD 12/15/2021
  const loadingSpinner = () => {
    if (display === "spinner") {
      return (
        <div>
          <Spinner />
        </div>
      );
    } else {
      return null;
    }
  };

  // NEED TO DETERMINE HOW TO HANDLE ERROR FOR PAYPAL BUTTONS NOT SHOWING UP
  const showPayPal = (
    <div>
      <PayPalButton
        onButtonReady={() => {}}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: props.orderTotals.currencyAbv,
                  value: props.orderTotals.finalPurchaseAmount.toString(),

                  breakdown: {
                    item_total: {
                      currency_code: props.orderTotals.currencyAbv,
                      value: props.orderTotals.fullPurchaseAmount.toString(),
                    },
                    discount: {
                      currency_code: props.orderTotals.currencyAbv,
                      value: props.orderTotals.discountAmount.toString(),
                    },
                  },
                },
                items: paypalArray,
              },
            ],
          });
        }}
        options={{
          clientId: props.event.accountId.paypalExpress_client_id,
          currency: props.orderTotals.currencyAbv,
        }}
        onSuccess={(details, data) => {
          console.log("inside onSuccess, paypal details: ", details);
          props.display("paypal");
          //payPalPurchase(details); // executes call to backend with PayPal order data
        }}
        onCancel={(data) => {
          console.log("onCancel 'data': ", data);
        }}
        onError={(err) => {
          console.log("error occurs: ", err);
          props.display("paypal");
        }}
      />
    </div>
  );

  const mainDisplay = () => {
    if (display === "main") {
      return (
        <div>
          {timeRemaining()}
          <br></br>
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            PayPal Checkout
          </span>
          <br></br>
          <br></br>
          <div style={{ paddingBottom: "20px" }}>
            Back to{" "}
            <button
              className={classes.BlueText}
              onClick={() => {
                console.log("clicked cancel link");
                props.clicked();
              }}
            >
              Ticket Selection
            </button>
          </div>
          <span className={classes.TicketType}>Payment Information</span>
          <br></br>
          <span className={classes.TicketTypeSmall}>
            Select a Payment Method
          </span>
          <br></br>
          <br></br>
          {showPayPal}
        </div>
      );
    } else return null;
  };

  return (
    <div>
      {loadingSpinner()}
      {mainDisplay()}
      {/*paypalStatus()*/}
    </div>
  );
};
export default Checkout;
