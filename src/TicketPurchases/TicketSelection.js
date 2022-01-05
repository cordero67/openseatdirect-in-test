import React, { useState, useEffect, Fragment } from "react";
import { NavLink } from "react-router-dom";
import queryString from "query-string";
import ReactHtmlParser from "html-react-parser";

import { API } from "../config.js";
import { getEventData, getEventImage } from "./Resources/apiCore";

import {
  loadEventDetails,
  loadTicketInfo,
  loadPromoCodeDetails,
  loadOrderTotals,
  changeOrderTotals,
  changeTicketInfo,
  amendPromoCodeDetails,
  amendTicketInfo,
  clearPromoDetails,
  clearTicketInfo,
  clearOrderTotals,
} from "./Resources/TicketSelectionFunctions";
import { DateRange } from "./Resources/PricingFunctions";
import {
  MainContainerStyling,
  MainGridStyling,
  EventTicketSectionStyling,
  OrderSummarySectionStyling,
  OrderSummarySectionAltStyling,
} from "./Resources/Styling";
import Spinner from "../components/UI/Spinner/Spinner";
import CartLink from "./Components/CartLink";
import OrderSummary from "./Components/OrderSummary";
import { OrderConfirm } from "./Components/OrderConfirms";
import { loadTransactionInfo } from "./Resources/TicketSelectionFunctions";

import DefaultLogo from "../assets/Get_Your_Tickets.png";
import OSDLogo from "../assets/OpenSeatDirect/BlueLettering_TransparentBackground_1024.png";

import TicketItem from "./Components/TicketItem";
import classes from "./TicketSelection.module.css";

let eventDetails; // defines an event's NON ticket type specific information
let eventLogo = ""; // defines an event's image

let MainContainer = {};
let MainGrid = {};
let EventTicketSection = {};
let OrderSummarySection = {};
let OrderSummarySectionAlt = {};

const TicketSelection = () => {
  console.log("You are in Ticket Selection");
  const [display, setDisplay] = useState("spinner"); // defines panel displayed: main, registration, spinner, confirmation, connection
  const [showDoublePane, setShowDoublePane] = useState(false); // defines single or double panel display on main page
  const [showOrderSummaryOnly, setShowOrderSummaryOnly] = useState(false); // defines panel display for a single panel display on main page

  const [isRestyling, setIsRestyling] = useState(false); // defines styling variables

  const [orderStatus, setOrderStatus] = useState(true); // defines if PayPal order was validated by server

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
  const [transactionInfo, setTransactionInfo] = useState({}); // ticket transaction
  const [registrationIndex, setRegistrationIndex] = useState(0);
  const [customerInformation, setCustomerInformation] = useState({
    // defines contact information sent to server
    name: "",
    email: "",
    sessionToken: "",
    userId: "",
  });

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

    eventData(queryString.parse(window.location.search).eventID);

    stylingUpdate(window.innerWidth, window.innerHeight);
  }, []);

  // receives Event Data from server and populates several control variables
  const eventData = (eventID) => {
    getEventData(eventID)
      .then((res) => {
        console.log(
          "Current TicketSelection: EVENT DATA OBJECT from Server: in 'getEventData()': ",
          res
        );
        //eventDetails = loadEventDetails(res);
        console.log("res.photoUrl2: ", res.photoUrl2);

        console.log("res.photoUrl1: ", res.photoUrl1);
        // asks for image if event is successfully imported
        // populates "photoUrl1" and "photoUrl2" fields with default images if not contained in event json
        if (!("photoUrl1" in res)) {
          res["photoUrl1"] =
            "https://imagedelivery.net/IF3fDroBzQ70u9_0XhN7Jg/cf557769-811d-44d6-8efc-cf75949d3100/public";
        }

        if (!("photoUrl2" in res)) {
          res["photoUrl2"] =
            "https://imagedelivery.net/IF3fDroBzQ70u9_0XhN7Jg/cf557769-811d-44d6-8efc-cf75949d3100/public";
        }
        console.log("res.photoUrl2: ", res.photoUrl2);

        console.log("res.photoUrl1: ", res.photoUrl1);

        console.log("res: ", res);

        eventDetails = loadEventDetails(res);
        //eventDetails = loadEventDetails(res);
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
          console.log("ticketInfo: ", loadTicketInfo(res));
          setTicketInfo(loadTicketInfo(res));
          setPromoCodeDetails(loadPromoCodeDetails(res, promoCodeDetails));
          setOrderTotals(loadOrderTotals(res));
        }

        setDisplay("main");
        /*
        getEventImage(eventID)
          .then((res) => {
            eventLogo = res;
          })
          .catch((err) => {
            eventLogo = DefaultLogo;
          })
          .finally(() => {
          });
          */
      })
      .catch((err) => {
        setDisplay("connection");
      });
  };

  const stylingUpdate = (inWidth, inHeight) => {
    setIsRestyling(true);
    if (inWidth < 790) {
      setShowDoublePane(false);
    } else {
      setShowDoublePane(true);
    }
    // sets styling parameters
    MainContainer = MainContainerStyling(inWidth, inHeight);
    MainGrid = MainGridStyling(inWidth, inHeight);
    EventTicketSection = EventTicketSectionStyling(inWidth, inHeight);
    OrderSummarySection = OrderSummarySectionStyling(inWidth, inHeight);
    OrderSummarySectionAlt = OrderSummarySectionAltStyling(inWidth, inHeight);
    setIsRestyling(false);
  };

  // determines resized width and height of window
  window.onresize = function (event) {
    stylingUpdate(window.innerWidth, window.innerHeight);
  };

  // toggles between "order pane" views
  const switchShowOrderSummary = (event) => {
    if (showOrderSummaryOnly) {
      setShowOrderSummaryOnly(false);
    } else {
      setShowOrderSummaryOnly(true);
    }
  };

  // clears entire "ticketInfo" object and "eventLogo", removes "cart" and "image" from "localStorage"
  const purchaseConfirmHandler = () => {
    eventDetails = {};
    setTicketInfo([]);
    setOrderTotals([]);
    eventLogo = "";
    let event = JSON.parse(localStorage.getItem("eventNum"));
    localStorage.removeItem(`cart_${event}`);
    localStorage.removeItem(`image_${event}`);
    localStorage.removeItem(`eventNum`);
  };
  // LOOKS GOOD
  const handleErrors = (response) => {
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };
  // LOOKS GOOD
  const freeTicketHandler = () => {
    //
    let email = customerInformation.email;
    let name = customerInformation.name;
    setTransactionInfo(
      loadTransactionInfo(eventDetails, orderTotals, ticketInfo, email, name)
    );

    let order = {
      eventNum: eventDetails.eventNum,
      totalAmount: orderTotals.finalPurchaseAmount,
    };

    if (orderTotals.finalPurchaseAmount === 0) {
      order.isFree = true;
    } else {
      order.isFree = false;
    }

    let tickets = [];
    ticketInfo.map((item) => {
      console.log("item: ", item);
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

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      `Bearer ${customerInformation.sessionToken}`
    );

    let url = `${API}/tixorder/signed_place_neworder`;
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
        purchaseConfirmHandler();
      });
    //
  };
  // LOOKS GOOD
  // determines new "ticketsPurchased" and "totalPurchaseAmount" in "orderTotals"
  const updateOrderTotals = (promoCode) => {
    setOrderTotals(changeOrderTotals(ticketInfo, orderTotals, promoCode));
  };
  // LOOKS GOOD
  // updates "promoCodeDetails", "ticketInfo" and "orderTotals" based on promo code change
  const applyPromoCodeHandler = (event, inputtedPromoCode) => {
    event.preventDefault();
    if (promoCodeDetails.eventPromoCodes.includes(inputtedPromoCode)) {
      setPromoCodeDetails(
        amendPromoCodeDetails(inputtedPromoCode, promoCodeDetails)
      );
      setTicketInfo(amendTicketInfo(inputtedPromoCode, ticketInfo));
      updateOrderTotals(inputtedPromoCode);
    } else {
      let tempobject = { ...promoCodeDetails };
      tempobject.errorMessage = "Sorry, that promo code is invalid";
      tempobject.lastInvalidPromoCode = inputtedPromoCode;
      setPromoCodeDetails(tempobject);
    }
  };
  // LOOKS GOOD
  // updates "promoCodeDetails", "ticketInfo" and "orderTotals" based on promo code removal
  const clearPromoCodes = () => {
    setPromoCodeDetails(clearPromoDetails(promoCodeDetails));
    setTicketInfo(clearTicketInfo(ticketInfo));
    setOrderTotals(clearOrderTotals(ticketInfo, orderTotals));
  };
  // LOOKS GOOD
  // creates promo code display
  const inputPromoCode = () => {
    if (promoCodeDetails.errorMessage === "Sorry, that promo code is invalid") {
      return (
        <form
          onSubmit={(event) => {
            applyPromoCodeHandler(
              event,
              promoCodeDetails.inputtedPromoValue.toUpperCase()
            );
          }}
        >
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
            />
            <button
              className={classes.PromoCodeButtonRed}
              onClick={() => {
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
        </form>
      );
    } else {
      return (
        <Fragment>
          <form
            onSubmit={(event) => {
              applyPromoCodeHandler(
                event,
                promoCodeDetails.inputtedPromoValue.toUpperCase()
              );
            }}
          >
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
                  setPromoCodeDetails(tempDetails);
                }}
              />
              <button
                className={classes.PromoCodeButtonBlue}
                disabled={!promoCodeDetails.inputtedPromoValue}
              >
                Apply
              </button>
            </div>
          </form>
          <div style={{ color: "blue", fontSize: "12px" }}>
            {promoCodeDetails.errorMessage !== ""
              ? promoCodeDetails.errorMessage
              : null}
          </div>
        </Fragment>
      );
    }
  };
  // LOOKS GOOD
  // creates contents inside promo code input form
  const promoOption = () => {
    if (!promoCodeDetails.available) {
      return null;
    } else if (promoCodeDetails.applied) {
      return (
        <div className={classes.AppliedPromoCode}>
          <ion-icon
            style={{ marginTop: "5px", fontSize: "16px", color: "black" }}
            name="checkmark-circle-outline"
          />{" "}
          Code{" "}
          <span style={{ fontWeight: "600" }}>
            {(" ", promoCodeDetails.appliedPromoCode)}{" "}
          </span>
          applied.{" "}
          <span
            className={classes.RemovePromoCode}
            onClick={() => {
              clearPromoCodes();
            }}
          >
            Remove
          </span>
        </div>
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
        </Fragment>
      );
    }
  };
  // LOOKS GOOD
  // updates "ticketInfo" and "orderTotals" after a change in tickets selected
  const updateTicketsSelected = (event, ticketType) => {
    setTicketInfo(changeTicketInfo(event, ticketType, ticketInfo));
    updateOrderTotals();
  };
  // LOOKS GOOD
  // creates checkout/submit order button
  // THIS IS NOT IN PRODUCTION CODE
  const checkoutButton = () => {
    if (
      // there is a registration requirement & total purchase amount > zero
      eventDetails.register &&
      "buttonLabel" in eventDetails.register &&
      "content" in eventDetails.register &&
      eventDetails.register.content.length > 0 &&
      orderTotals.ticketsPurchased > 0
    ) {
      return (
        <button
          onClick={() => {
            setDisplay("registration");
          }}
          className={classes.ButtonGreen}
        >
          {eventDetails.register.buttonLabel.toUpperCase()}
        </button>
      );
    } else if (
      // there is a registration requirement & total purchase amount > zero
      eventDetails.register &&
      "buttonLabel" in eventDetails.register &&
      "content" in eventDetails.register &&
      eventDetails.register.content.length > 0
    ) {
      return (
        <button disabled={true} className={classes.ButtonGreenOpac}>
          {eventDetails.register.buttonLabel.toUpperCase()}
        </button>
      );
    } else if (
      // there is NOT a registration requirement & a signed order of positive tickets and a zero total value
      orderTotals.finalPurchaseAmount === 0 &&
      orderTotals.ticketsPurchased > 0 &&
      customerInformation.sessionToken !== ""
    ) {
      return (
        <button onClick={freeTicketHandler} className={classes.ButtonGreen}>
          SUBMIT ORDER
        </button>
      );
    } else if (
      orderTotals.finalPurchaseAmount > 0 &&
      customerInformation.sessionToken !== ""
    ) {
      // there is NOT a registration requirement & a signed order of positive tickets and a positive total value
      return (
        <button
          onClick={() => {
            storeOrder();
          }}
          className={classes.ButtonGreen}
        >
          PROCEED TO CHECKOUT
        </button>
      );
    } else if (orderTotals.ticketsPurchased > 0) {
      // there is NOT a registration requirement & a unsigned order of positive tickets and a positive total value
      return (
        <button
          onClick={() => {
            storeOrder();
          }}
          className={classes.ButtonGreen}
        >
          PROCEED TO CHECKOUT
        </button>
      );
    } else {
      // there is NOT a registration requirement & a unsigned order of no tickets
      return (
        <button disabled={true} className={classes.ButtonGreenOpac}>
          PROCEED TO CHECKOUT
        </button>
      );
    }
  };
  // LOOKS GOOD
  // stores order and event information into "localStorage"
  const storeOrder = (/*orderId*/) => {
    //
    let signedIn = false;
    console.log("Inside 'storeOrder'");

    if (typeof window !== "undefined") {
      localStorage.setItem(
        `image_${eventDetails.eventNum}`,
        JSON.stringify(eventDetails.photoUrl2)
      );
      localStorage.setItem(`eventNum`, JSON.stringify(eventDetails.eventNum));

      localStorage.setItem(
        `cart_${eventDetails.eventNum}`,
        JSON.stringify({
          eventDetails: eventDetails,
          promoCodeDetails: promoCodeDetails,
          ticketInfo: ticketInfo,
          orderTotals: orderTotals,
          orderExpiration: new Date(+new Date() + 7 * 60000),
        })
      );
      if (localStorage.getItem(`user`) !== null) {
        signedIn = true;
      }
    }

    if (signedIn === true) {
      // user is signed in therefore skip guest info page
      console.log("eventDetails.gateway: ", eventDetails.gateway);
      if (eventDetails.gateway === "PayPalExpress") {
        window.location.href = "/checkout-paypalexpress";
      } else if (eventDetails.gateway === "PayPalMarketplace") {
        window.location.href = "/checkout-paypalmerchant";
      } else {
        // no gateway is found
        window.location.href = `/ed/${eventDetails.vanityLink}?eventID=${eventDetails.eventNum}`;
      }
    } else if (orderTotals.finalPurchaseAmount === 0) {
      window.location.href = "/infofree";
    } else {
      window.location.href = "/infopaid";
    }
    //
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
    //
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
    //
  };
  // LOOKS GOOD
  // creates event header with date/time range
  const eventHeader = () => {
    if (display === "main") {
      return (
        <Fragment>
          <div className={classes.EventTitle}>{eventDetails.eventTitle}</div>
          <div className={classes.EventDate}>
            <DateRange
              start={eventDetails.startDateTime}
              end={eventDetails.endDateTime}
            />
          </div>
        </Fragment>
      );
    } else return null;
  };
  // LOOKS GOOD
  // creates list of ticket types and ticket selection functionality
  const ticketItems = () => {
    if (display === "main") {
      return (
        <div>
          {ticketInfo.map((ticket, index) => {
            if (!ticket.isZombie) {
              return (
                <div key={index}>
                  <TicketItem
                    name={ticket}
                    key={ticket.ticketID}
                    onChange={(event) => {
                      updateTicketsSelected(event, ticket);
                    }}
                  />
                </div>
              );
            } else return null;
          })}
        </div>
      );
    } else return null;
  };
  // LOOKS GOOD
  // determines whether or not to display purchase amount
  const totalAmount = (show) => {
    if (display === "main" && !show && orderTotals.ticketsPurchased > 0) {
      return (
        <div>
          {orderTotals.currencySym}
          {orderTotals.finalPurchaseAmount}
        </div>
      );
    } else return null;
  };
  // LOOKS GOOD
  // determines whether or not to display cart and arrow
  const cartLink = (show) => {
    if (display === "main" && !show) {
      return (
        <CartLink
          onClick={switchShowOrderSummary}
          showStatus={showOrderSummaryOnly}
          orderTotals={orderTotals}
          showDoublePane={showDoublePane}
        />
      );
    } else return null;
  };
  // LOOKS GOOD
  // creates order summary section
  const orderSummary = () => {
    if (display === "main" && orderTotals.ticketsPurchased > 0) {
      return (
        <OrderSummary
          cancel={false}
          ticketOrder={ticketInfo}
          ticketCurrency={orderTotals.currencySym}
        />
      );
    } else if (display === "main" && orderTotals.ticketsPurchased <= 0) {
      return (
        <div className={classes.EmptyOrderSummary}>
          <ion-icon
            style={{ fontSize: "36px", color: "grey" }}
            name="cart-outline"
          />
        </div>
      );
    } else return null;
  };
  // LOOKS GOOD
  // creates order pane with image and order summary sections
  const orderPane = () => {
    console.log("eventDetails.photoUrl2: ", eventDetails.photoUrl2);
    console.log("eventDetails: ", eventDetails);
    if (showDoublePane) {
      return (
        <div>
          <img
            className={classes.Image}
            src={eventDetails.photoUrl2}
            //src={
            //   "https://imagedelivery.net/IF3fDroBzQ70u9_0XhN7Jg/cf557769-811d-44d6-8efc-cf75949d3100/public"
            //}
            alt="Event Logo Coming Soon!!!"
          />
          <div style={OrderSummarySection}>{orderSummary()}</div>
        </div>
      );
    } else {
      return (
        <Fragment>
          <div>
            <div style={OrderSummarySectionAlt}>{orderSummary()}</div>
          </div>
          <div className={classes.EventFooter}>
            <div className={classes.CartLink}>{cartLink(showDoublePane)}</div>
            <div className={classes.TotalAmount}>
              {totalAmount(showDoublePane)}
            </div>
            <div style={{ textAlign: "right" }}>{checkoutButton()}</div>
          </div>
        </Fragment>
      );
    }
  };
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
  //
  //
  //
  // LOOKS GOOD
  // creates ticket pane with promo form and ticket sections
  const ticketPane = () => {
    return (
      <div className={classes.MainItemLeft}>
        <div className={classes.EventHeader}>{eventHeader()}</div>
        <div style={EventTicketSection}>
          {promoOption()}
          {ticketItems()}
          <div className={classes.EventDescription}>
            Powered by{" "}
            <NavLink to="/" exact>
              <img
                className={classes.ImageBox}
                src={OSDLogo}
                alt="OpenSeatDirect Logo"
              />
            </NavLink>
          </div>
        </div>
        <div className={classes.EventFooter}>
          <div className={classes.CartLink}>{cartLink(showDoublePane)}</div>
          <div className={classes.TotalAmount}>
            {totalAmount(showDoublePane)}
          </div>
          <div style={{ textAlign: "right" }}>{checkoutButton()}</div>
        </div>
      </div>
    );
  };
  // LOOKS GOOD
  // defines main display with ticket and order panes
  const mainDisplay = () => {
    if (display === "main") {
      if (showDoublePane) {
        return (
          <div style={MainGrid}>
            {ticketPane()}
            {orderPane()}
          </div>
        );
      } else if (!showOrderSummaryOnly) {
        return <div style={MainGrid}>{ticketPane()}</div>;
      } else {
        return <div style={MainGrid}>{orderPane()}</div>;
      }
    } else return null;
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
            <OrderConfirm
              transactionInfo={transactionInfo}
              orderStatus={orderStatus}
            />
          </div>
        </div>
      );
    } else return null;
  };

  const disagreeButton = (
    <div style={{ textAlign: "center", paddingTop: "15px" }}>
      <button
        className={classes.ButtonRedLarge}
        onClick={() => {
          setRegistrationIndex(0);
          setDisplay("main");
        }}
      >
        I DISAGREE
      </button>
    </div>
  );

  const agreeButton = () => {
    if (display === "registration") {
      return (
        <div style={{ textAlign: "center", paddingTop: "15px" }}>
          <button
            className={classes.ButtonGreenLarge}
            onClick={() => {
              if (
                registrationIndex <
                eventDetails.register.content.length - 1
              ) {
                setRegistrationIndex(registrationIndex + 1);
              } else {
                if (
                  orderTotals.finalPurchaseAmount === 0 &&
                  orderTotals.ticketsPurchased > 0 &&
                  customerInformation.sessionToken !== ""
                ) {
                  // signed free order
                  // NEED TO DETERMINE IF A USER OR A GUEST
                  freeTicketHandler();
                } else if (
                  (orderTotals.finalPurchaseAmount > 0 &&
                    customerInformation.sessionToken !== "") ||
                  orderTotals.ticketsPurchased > 0
                ) {
                  // signed paid order or an unsigned order
                  storeOrder();
                } else {
                  // some other type of order
                }
              }
            }}
          >
            I AGREE
          </button>
        </div>
      );
    } else {
      return null;
    }
  };

  const registrationButtons = () => {
    if (window.innerWidth >= 500) {
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "180px 180px",
            columnGap: "20px",
            paddingLeft: "calc(50% - 190px)",
          }}
        >
          {disagreeButton}
          {agreeButton()}
        </div>
      );
    } else {
      return (
        <Fragment>
          {disagreeButton}
          {agreeButton()}
        </Fragment>
      );
    }
  };

  // LOOKS GOOD
  const registration = () => {
    if (display === "registration") {
      return (
        <div
          className={classes.BlankCanvas}
          style={{
            color: "black",
            fontSize: "16px",
            paddingTop: "40px",
          }}
        >
          <div
            style={{
              paddingLeft: "40px",
              paddingRight: "40px",
            }}
          >
            {ReactHtmlParser(eventDetails.register.content[registrationIndex])}
          </div>
          {registrationButtons()}
        </div>
      );
    } else return null;
  };

  return (
    //
    //
    //
    //
    //
    //
    //
    //
    //
    <div style={MainContainer}>
      {loadingSpinner()}
      {mainDisplay()}
      {registration()}
      {purchaseConfirmation()}
      {connectionStatus()}
    </div>
  );
};

export default TicketSelection;
