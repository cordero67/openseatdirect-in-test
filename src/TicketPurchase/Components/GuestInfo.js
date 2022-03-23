import React, { useState, useEffect, Fragment } from "react";
//import { API } from "../config.js";

import { DateRange } from "../Resources/PricingFunctions";
//import Spinner from "../components/UI/Spinner/Spinner";
import GuestForm from "./GuestForm";
import AuthenticationModal from "../Modals/AuthenticationModal";
import classes from "./GuestInfo.module.css";

const GuestInfo = (props) => {
  //console.log("props: ", props);
  const [modalStatus, setModalStatus] = useState(false); // defines 'authenticationModal' display status

  // LOOKS GOOD
  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

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
      //this will cause it to error
      props.clicked();
    }
  };

  const authenticate = () => {
    return (
      <AuthenticationModal
        show={modalStatus}
        zeroCart={false}
        start={"signin"}
        vendorIntent={false}
        closeModal={(exit) => {
          setModalStatus(false);
          console.log("Exit requested: ", exit);
          if (!exit) {
            console.log("Signup/in occurred");
            props.submit();
          }
        }}
      />
    );
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
            Log in
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

  return (
    <div>
      {mainDisplay()}
      {authenticate()}
    </div>
  );
};
export default GuestInfo;
