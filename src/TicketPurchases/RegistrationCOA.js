import React, { useState, useEffect, Fragment } from "react";

import { API } from "../config.js";
import { getEventData, getEventImage } from "./Resources/apiCore";
import { loadTransactionInfo } from "./Resources/TicketSelectionFunctions";
import {
  loadEventDetails,
  loadTicketInfo,
  loadPromoCodeDetails,
  loadOrderTotals,
} from "./Resources/TicketSelectionFunctions";

import { MainContainerStyling } from "./Resources/Styling";
import Spinner from "../components/UI/Spinner/Spinner";
import DefaultLogo from "../assets/Get_Your_Tickets.png";

import classes from "./TicketSelection.module.css";

let eventDetails; // defines an event's NON ticket type specific information
let eventLogo = ""; // defines an event's image

let MainContainer = {};

const TicketSelection = () => {
  const [display, setDisplay] = useState("main"); // defines panel displayed: main, spinner, confirmation, connection
  const [isRestyling, setIsRestyling] = useState(false); // defines styling variables
  const [orderStatus, setOrderStatus] = useState(true); // defines if PayPal order was validated by server

  const [transactionInfo, setTransactionInfo] = useState({}); // ticket transaction

  const [promoCodeDetails, setPromoCodeDetails] = useState({
    // defines event's specific promo codes
    available: false,
    applied: false,
    input: false,
    errorMessage: "",
    appliedPromoCode: "",
    inputtedPromoValue: "",
    lastInvalidPromoCode: "",
    eventPromoCodes: [],
  });
  const [ticketInfo, setTicketInfo] = useState([]); // ticket order specific ticket information
  const [orderTotals, setOrderTotals] = useState([]); // ticket order general info
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

    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null &&
      localStorage.getItem("eventNum") != null
    ) {
      let tempEventNum = localStorage.getItem(`eventNum`);
      let cart = JSON.parse(localStorage.getItem(`cart_${tempEventNum}`));
      setTicketInfo(cart.ticketInfo);
      setPromoCodeDetails(cart.promoCodeDetails);
      setOrderTotals(cart.orderTotals);
    }

    eventData("25657749347");
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
  // receives Event Data from server and populates several control variables
  const eventData = (eventID) => {
    getEventData(eventID)
      .then((res) => {
        console.log("EVENT DATA OBJECT from Server: ", res);
        eventDetails = loadEventDetails(res);
        console.log("eventDetails: ", eventDetails);
        // checks if an order exists in local storage
        if (
          typeof window !== "undefined" &&
          localStorage.getItem(`cart_${eventDetails.eventNum}`) !== null
        ) {
          let cart = JSON.parse(
            localStorage.getItem(`cart_${eventDetails.eventNum}`)
          );
          setTicketInfo(cart.ticketInfo);
          setPromoCodeDetails(cart.promoCodeDetails);
          setOrderTotals(cart.orderTotals);
        } else {
          console.log("ticketInfo: ", loadTicketInfo(res));
          if (res.tickets.length === 0) {
            window.location.href = `/ed/${eventDetails.vanityLink}?eventID=${eventDetails.eventNum}`;
          }
          setTicketInfo(loadTicketInfo(res));
          setPromoCodeDetails(loadPromoCodeDetails(res, promoCodeDetails));
          setOrderTotals(loadOrderTotals(res));
        }
        // asks for image if event is successfully imported
        getEventImage(eventID)
          .then((res) => {
            eventLogo = res;
          })
          .catch((err) => {
            eventLogo = DefaultLogo;
          })
          .finally(() => {
            setDisplay("main");
          });
      })
      .catch((err) => {
        setDisplay("connection");
      });
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
  const freeTicketHandler = () => {
    let email = customerInformation.email;
    let name = customerInformation.name;
    setTransactionInfo();
    loadTransactionInfo(eventDetails, orderTotals, ticketInfo, email, name);

    let order = {
      //eventNum: eventDetails.eventNum,
      eventNum: "25657749347",
      totalAmount: orderTotals.finalPurchaseAmount,
    };

    if (orderTotals.finalPurchaseAmount === 0) {
      order.isFree = true;
    } else {
      order.isFree = false;
    }

    let tickets = [];
    ticketInfo.map((item) => {
      if (item.adjustedTicketPrice === 0 && item.ticketsSelected > 0) {
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

    console.log("signed free ticket tickets: ", tickets);
    console.log("signed free ticket order: ", order);

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      `Bearer ${customerInformation.sessionToken}`
    );
    let url = `${API}/tixorder/signed_place_neworder/${customerInformation.userId}`;
    let fetcharg = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(order),
    };
    console.log("fetching with: ", url, fetcharg);
    console.log("Free ticket order: ", order);
    setDisplay("spinner");
    fetch(url, fetcharg)
      .then(handleErrors)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        setOrderStatus(data.status);
        setDisplay("confirmation");
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setDisplay("connection");
      })
      .finally(() => {
        let event = JSON.parse(localStorage.getItem("eventNum"));
        localStorage.removeItem(`cart_${event}`);
        localStorage.removeItem(`image_${event}`);
        localStorage.removeItem(`eventNum`);
      });
  };

  // LOOKS GOOD
  // clears entire "ticketInfo" object and "eventLogo", removes "cart" and "image" from "localStorage"
  const purchaseConfirmHandler = () => {
    eventDetails = {};
    ticketInfo = {};
    orderTotals = {};
    eventLogo = "";
    let event = JSON.parse(localStorage.getItem("eventNum"));
    localStorage.removeItem(`cart_${event}`);
    localStorage.removeItem(`image_${event}`);
    localStorage.removeItem(`eventNum`);
  };
  const submitWaiver = () => {
    if (customerInformation.sessionToken !== "") {
      console.log("Signed In User");
      freeTicketHandler();
    } else {
      window.location.href = `/infofree`;
    }
  };

  // LOOKS GOOD
  const purchaseConfirmation = () => {
    if (display === "confirmation") {
      return (
        <div
          className={classes.BlankCanvas}
          style={{ textAlign: "left", color: "black" }}
        >
          <div style={{ paddingTop: "20px" }}>
            <Fragment>
              <div
                style={{
                  fontWeight: "500",
                  fontSize: "24px",
                  paddingBottom: "20p",
                }}
              >
                Order Confirmation
              </div>
              <br></br>
              <div
                style={{
                  fontSize: "16px",
                  paddingBottom: "20px",
                }}
              >
                <div style={{ paddingBottom: "20px" }}>
                  Thank you, your order was received and is in process.
                </div>
                <div style={{ paddingBottom: "20px" }}>
                  OpenSeatDirect will be sending you an email that will contain
                  a pdf of your ticket(s) to print-at-home or to display on your
                  mobile device.
                </div>
                <div style={{ paddingBottom: "20px" }}>
                  If you do not receive this email by the end of today, please
                  contact the vendor.
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <button
                  className={classes.ButtonBlue}
                  onClick={() => {
                    window.location.href = "/events";
                  }}
                >
                  CONTINUE
                </button>
              </div>
            </Fragment>
          </div>
        </div>
      );
    } else return null;
  };

  // LOOKS GOOD
  const releaseStatement = () => {
    if (display === "main") {
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
            <br></br>
            <br></br>
            <div style={{ textAlign: "center" }}>
              <button
                className={classes.ButtonGreenLarge}
                onClick={() => {
                  console.log("clicked");
                  submitWaiver();
                }}
              >
                I AGREE TO THIS WAIVER
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
      {releaseStatement()}
      {purchaseConfirmation()}
      {connectionStatus()}
    </div>
  );
};

export default TicketSelection;
