import React, { useState, useEffect, Fragment } from "react";

//import { API } from "../config.js";

import { DateRange } from "../Resources/PricingFunctions";
//import Spinner from "../components/UI/Spinner/Spinner";
import GuestForm from "./GuestForm";
//import AuthenticationModal from "./Modals/AuthenticationModal";
import { loadTransactionInfo } from "../Resources/TicketSelectionFunctions";
import classes from "./CustomerInfo.module.css";

const CustomerInfoFree = (props) => {
  //console.log("props: ", props);
  //const [display, setDisplay] = useState("spinner"); // defines panel displayed: main, spinner, confirmation, connection

  const [modalStatus, setModalStatus] = useState(false); // defines 'authenticationModal' display status

  //const [isRestyling, setIsRestyling] = useState(false); // defines styling variables

  //const [transactionInfo, setTransactionInfo] = useState({}); // ticket transaction

  //const [orderStatus, setOrderStatus] = useState(false); // defines if order was successful

  // LOOKS GOOD
  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  /*
  // creates submit button to send free ticket information to server
  const checkoutButton = () => {
    if (orderTotals.ticketsPurchased > 0 && detailsMinimal()) {
      return (
        <button
          onClick={() => freeTicketHandler(false)}
          disabled={false}
          className={classes.ButtonGreen}
        >
          SUBMIT ORDER
        </button>
      );
    } else {
      return (
        <button disabled={true} className={classes.ButtonGreenOpac}>
          SUBMIT ORDER
        </button>
      );
    }
  };
  */
  /*
  // defines and sets "loadingSpinner" view status
  const loadingSpinner = () => {
    if (display === "spinner") {
      return (
        <div className={classes.Spinner}>
          <Spinner></Spinner>;
        </div>
      );
    } else return null;
  };
*/
  /*
  // CONTROLS "connectionStatus" VIEW
  const connectionStatus = () => {
    if (display === "connection") {
      return (
        <div className={classes.BlankCanvas}>
          <div>
            There is a problem with OSD Server in processing your tickets.
            Please try again later.
          </div>
        </div>
      );
    } else return null;
  };

  // defines "purchaseConfirmation" contents: contolled by "transactionStatus.success"
  const purchaseConfirmation = () => {
    if (display === "confirmation") {
      return (
        <div className={classes.BlankCanvas}>
          <div style={{ paddingTop: "20px" }}>
            <OrderConfirm
              transactionInfo={transactionInfo}
              orderStatus={orderStatus}
            ></OrderConfirm>
          </div>
        </div>
      );
    } else return null;
  };
*/
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

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // every 1000 milliseconds === 1 second the timer function runs
  // runs the "timeLeft" hook
  // causes the page to refresh which updates the time expired numbers
  // these numbers are fed by the "calculateTimeLeft()" function
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  const timeRemaining = () => {
    if (+new Date(props.orderExpiration) >= +new Date()) {
      let twoDigitSec;
      if (calculateTimeLeft().seconds < 10) {
        twoDigitSec = "0" + calculateTimeLeft().seconds;
      } else {
        twoDigitSec = calculateTimeLeft().seconds;
      }

      return (
        <div
          style={{
            fontSize: "16px",
            textAlign: "center",
            paddingBottom: "10px",
          }}
        >
          Ticket reservation expires in {calculateTimeLeft().minutes}:
          {twoDigitSec}
        </div>
      );
    } else {
      props.clicked();
    }
  };

  const mainDisplay = () => {
    return (
      <div>
        {timeRemaining()}
        <div className={classes.TicketType}>Contact Information</div>
        <div style={{ paddingBottom: "20px" }}>
          Continue as Guest or{" "}
          <button
            className={classes.BlueText}
            onClick={() => setModalStatus(true)}
          >
            Sign In
          </button>
        </div>{" "}
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
        <GuestForm
          guestInformation={props.guestInformation}
          changeField={props.changeField}
        />
      </div>
    );
  };

  return <div>{mainDisplay()}</div>;
};
export default CustomerInfoFree;

/*

    <div style={MainContainer}>
      {connectionStatus()}
      {loadingSpinner()}
      {mainDisplay()}
      {purchaseConfirmation()}
      <AuthenticationModal
        show={modalStatus}
        zeroCart={false}
        start={"signin"}
        vendorIntent={false}
        closeModal={() => setModalStatus(false)}
        submit={() => freeTicketHandler(true)}
      />
    </div>
    */
