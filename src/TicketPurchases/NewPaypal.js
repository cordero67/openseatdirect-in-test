import React, { useState, useEffect, Fragment } from "react";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

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
                src="https://ncjar.com/templates/t3-ncjar/img/theme/ncjar-logo-5-x2.png"
                style={{ width: "320px" }}
              />
            </div>
            <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
              <div>
                NCJAR<span style={{ fontSize: "12px" }}>Ⓡ</span> Young
                Professionals Network
              </div>
              <div>April 17, 2021</div>
              <div>Beach Clean Up Community Service Project</div>
            </div>
            <div
              style={{
                textAlign: "center",
                paddingTop: "15px",
                paddingBottom: "15px",
                fontWeight: "600",
              }}
            >
              RELEASE STATEMENT
            </div>
            <div style={{ paddingTop: "10px", paddingBottom: "20px" }}>
              I hereby release and discharge North Central Jersey Association of
              Realtors, it's Trustees, Officers, Employees and Members from any
              and all liability, loss, damage, or injuries, including the
              contraction of a communicable disease such as Covid-19 arising
              from my volunatry participation in the "Beach Sweeps".
            </div>
            <input type="checkbox" />
            <label
              style={{
                paddingLeft: "10px",
                paddingTop: "20px",
                paddingBottom: "10px",
              }}
            >
              {" "}
              I have read and agree to the Release Statement
            </label>
            <div>
              <input
                className={classes.InputBox}
                type="text"
                name="fullName"
                style={{
                  width: "270px",
                  border: "none",
                  borderBottom: "1px solid grey",
                  outline: "none",
                  outlineBottom: "1px solid grey",
                  paddingBottom: "0px",
                }}
                //onChange={handleChange}
                //value={password}
              />
              <div
                style={{
                  fontSize: "14px",
                  paddingTop: "0px",
                  paddingBottom: "10px",
                }}
              >
                Full Name
              </div>
              <input
                className={classes.InputBox}
                type="date"
                name="signedDate"
                min="2021-03-13"
                max="2021-04-17"
                //onChange={handleChange}
                value="2021-03-14"
              />
            </div>
            <br></br>
            <div style={{ textAlign: "center" }}>
              <button
                className={classes.ButtonGreen}
                //onClick={() => props.submit(allTotal)}
              >
                SUBMIT RELEASE
              </button>
            </div>
          </div>
        </div>
      );
    } else return null;
  };

  return (
    <div style={MainContainer}>
      {loadingSpinner()}
      <PayPalScriptProvider options={{ "client-id": "test" }}>
        <PayPalButtons
          style={{ layout: "horizontal" }}
          createOrder={(data, actions) => {
            console.log("in createOrder w data=", data);
            console.log("in createOrder w actions=", actions);
            return fetch(
              "https://www.bondirectly.com/api/tixorder/us-mpp-create-order",
              {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify({
                  merchant_id: "9MBSKA59BGFY6",
                  eventNum: 59490622550,
                  totalAmount: 19.84,
                  isFree: false,
                  userPromo: "WWW", // optional
                  tickets: [
                    {
                      ticketID: "601d9a7a4e397b5e1815536e",
                      ticketsSelected: 1,
                      ticketPrice: 9.97,
                    },
                    {
                      ticketID: "601b6053ae64e54705209613",
                      ticketsSelected: 1,
                      ticketPrice: 9.87,
                    },
                  ],
                  firstname: "Peter",
                  lastname: "Pan",
                  email: "gual325@gmail.com",
                }),
              }
            )
              .then(function (res) {
                return res.json();
              })
              .then(function (data) {
                return data.id;
              });
          }}
          onApprove={(data, actions) => {
            console.log("in onApprove w data=", data);
            console.log("in onApprove w actions=", actions);
            return fetch(
              "https://bondirectly.com/api/tixorder/us-mpp-capture-order/" +
                data.orderID,
              {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                },
              }
            ).then(function (res) {
              if (!res.ok) {
                alert("Something went wrong");
              } else {
                alert("All good bitch");
              }
            });
          }}
          onError={(err) => {
            console.log("Error encountered");
            console.log("err: ", err);
          }}
          onCancel={() => {
            console.log("Order cancelled");
          }}
        />
      </PayPalScriptProvider>
      ;{connectionStatus()}
    </div>
  );
};

export default TicketSelection;
