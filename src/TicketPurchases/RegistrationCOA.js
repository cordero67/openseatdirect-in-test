import React, { useState, useEffect, Fragment } from "react";
import { NavLink } from "react-router-dom";
import queryString from "query-string";

import { API } from "../config.js";

import { MainContainerStyling } from "./Resources/Styling";
import Spinner from "../components/UI/Spinner/Spinner";

import classes from "./TicketSelection.module.css";

let eventDetails; // defines an event's NON ticket type specific information
let eventLogo = ""; // defines an event's image

let MainContainer = {};

const TicketSelection = () => {
  const [display, setDisplay] = useState("confirmation"); // defines panel displayed: main, spinner, confirmation, connection
  const [isRestyling, setIsRestyling] = useState(false); // defines styling variables

  const [customerInformation, setCustomerInformation] = useState({
    // defines contact information sent to server
    name: "",
    email: "",
    sessionToken: "",
    userId: "",
  });
  const [checkedAgreement, setCheckedAgreement] = useState(false);
  // LOOKS GOOD
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      setCustomerInformation({
        name: tempUser.user.name,
        email: tempUser.user.email,
        sessionToken: tempUser.token,
        userId: tempUser.user._id,
      });
    }
    //eventData(queryString.parse(window.location.search).eventID);
    stylingUpdate(window.innerWidth, window.innerHeight);
  }, []);
  // LOOKS GOOD
  const stylingUpdate = (inWidth, inHeight) => {
    setIsRestyling(true);
    // sets styling parameters
    MainContainer = MainContainerStyling(inWidth, inHeight);
    setIsRestyling(false);
  };
  // LOOKS GOOD
  // determines resized width and height of window
  window.onresize = function (event) {
    stylingUpdate(window.innerWidth, window.innerHeight);
  };
  // LOOKS GOOD
  const handleErrors = (response) => {
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };
  // LOOKS GOOD
  // defines and sets "loadingSpinner" view status
  const loadingSpinner = () => {
    if (display === "spinner") {
      return (
        <div className={classes.BlankCanvas}>
          <Spinner />
        </div>
      );
    } else return null;
  };
  // LOOKS GOOD
  // defines and sets "connectionStatus" view status
  const connectionStatus = (condition) => {
    if (display === "connection") {
      return (
        <div className={classes.BlankCanvas}>
          <div>
            System error.
            <br></br>Please try again later.
          </div>
          <div style={{ paddingTop: "20px" }}>
            <button
              className={classes.ButtonGrey}
              onClick={() => {
                window.location.href = `/events`;
              }}
            >
              CONTINUE
            </button>
          </div>
        </div>
      );
    } else return null;
  };

  // LOOKS GOOD
  // creates checkout/submit order button
  const submitButton = () => {
    if (checkedAgreement) {
      return (
        <button
          className={classes.ButtonGreen}
          onClick={() => {
            console.log("clicked");
            window.location.href = `/infofree`;
          }}
        >
          SUBMIT WAIVER
        </button>
      );
    } else {
      return (
        <button disabled={true} className={classes.ButtonGreenOpac}>
          SUBMIT WAIVER
        </button>
      );
    }
  };
  // LOOKS GOOD
  const releaseStatement = () => {
    if (display === "confirmation") {
      return (
        <div
          className={classes.BlankCanvas}
          style={{ textAlign: "left", color: "black", paddingTop: "40px" }}
        >
          <div
            style={{
              fontSize: "16px",
              paddingLeft: "40px",
              paddingRight: "40px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <img
                src="https://scontent.fewr1-5.fna.fbcdn.net/v/t1.0-9/1904017_10152293112811495_260293811_n.jpg?_nc_cat=105&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=YFXgyR1ZblYAX9W9H-o&_nc_ht=scontent.fewr1-5.fna&oh=4adee572922b184cf55ccee60d873a7c&oe=60816B92"
                style={{ width: "150px" }}
              />
            </div>
            <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
              <div>Clean Ocean Action</div>
              <div>April 17, 2021</div>
              <div>Spring Beach Sweeps</div>
            </div>
            <div
              style={{
                textAlign: "center",
                paddingTop: "15px",
                paddingBottom: "15px",
                fontWeight: "600",
              }}
            >
              COVID-19 WAIVER
            </div>
            <div style={{ paddingTop: "10px", paddingBottom: "20px" }}>
              By submitting this form, I hereby release and discharge COA and
              the Beach Sweeps sponsors, and their respective agents and
              employees from and against any and all liability, including for
              any losses, damages or injuries, including the contraction of a
              communicable disease, arising from my participation in the Beach
              Sweeps.
            </div>
            <input
              type="checkbox"
              value={checkedAgreement}
              onClick={() => {
                setCheckedAgreement(!checkedAgreement);
              }}
            />
            <label
              style={{
                paddingLeft: "10px",
                paddingTop: "20px",
                paddingBottom: "10px",
              }}
            >
              {" "}
              I have read and agree to this Waiver
            </label>
            <br></br>
            <br></br>
            <div style={{ textAlign: "center" }}>{submitButton()}</div>
          </div>
        </div>
      );
    } else return null;
  };

  return (
    <div style={MainContainer}>
      {loadingSpinner()}
      {releaseStatement()}
      {connectionStatus()}
    </div>
  );
};

export default TicketSelection;
