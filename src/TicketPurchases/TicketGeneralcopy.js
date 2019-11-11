import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import queryString from "query-string";

import Aux from "../hoc/Auxiliary/Auxiliary";
import { getEventData } from "./apiCore";
import Spinner from "../components/UI/Spinner/Spinner";

import CocinaCandelaLogo from "../assets/Cocina_Candela/cocinacandela21NEW.jpg";
import OSDLogo from "../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_32.png";
import TicketItem from "./TicketItemcopy";
import styles from "./Order.module.css";

// hard coded event information
const eventDetails = {
  eventNum: "94106331593",
  //eventName: "Private Puerto Rican Dinner",
  eventTitle: "Chef's Table Dinner",
  eventCategory: "Food&Drink",
  eventStatus: "Scheduled",
  longDescription:
    "Experience a Puerto Rican gastronomy honoring the traditions of Taíno roots and the purity of ingredients. Prepared by Kenny Candelaria who's culinary career began as a child, preparing meals on the fogón with his grandparents in Puerto Rico and refined throughout the years by choosing the most natural, local ingredients available to him.",
  shortDescription: "An orgy of Puerto Rican food. No contraception required.",
  image: "",
  startDateTime: "December 12, 2019 - 8 PM",
  endDateTime: "2019-12-06 09:00:00.000Z",
  location: {
    venueName: "Cocina Candela",
    address1: "706 Bloomfield Ave",
    address2: "",
    city: "Montclair",
    state: "NJ",
    zipPostalCode: "07042"
  },
  organizerName: "Dahday",
  organizerUrl: "https://www.dahday.com/",
  eventURL: "/dahday-puertoricandinner",
  ticketName: "General Admission",
  ticketDescription: "Full seven course meal and live entertainment.",
  ticketsAvailable: 30,
  ticketPrice: 75,
  ticketFee: 0,
  ticket2Name: "General Admission + 2 drinks",
  ticket2Description:
    "Full seven course meal, 2 drinks and live entertainment.",
  ticket2sAvailable: 30,
  ticket2Price: 100,
  ticket2Fee: 0,
  ticket3Name: "VIP",
  ticket3Description:
    "Full seven course meal and live entertainment with seat next to the stage.",
  ticket3sAvailable: 30,
  ticket3Price: 125,
  ticket3Fee: 0,
  ticket4Name: "VIP + 2 drinks",
  ticket4Description:
    "Full seven course meal, 2 drinks and live entertainment with seat next to the stage.",
  ticket4sAvailable: 30,
  ticket4Price: 150,
  ticket4Fee: 0,
  ticket5Name: "VIP + 2 drinks and band introduction",
  ticket5Description:
    "Full seven course meal, 2 drinks and live entertainment with seat next to the stage. You also get to meet the band before they go on stage",
  ticket5sAvailable: 30,
  ticket5Price: 225,
  ticket5Fee: 0
};

const getDateStr = dt => {
  // returns pretty date string assuming UTC time sime
  // i.e.  'Sat Nov 2, 2019 6:30 PM'
  const mon = dt.getUTCMonth();
  const monstr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ][mon];
  const day = dt.getUTCDay();
  const dstr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][day];
  const udate = dt.getUTCDate();
  const yr = dt.getUTCFullYear();
  const min = dt.getUTCMinutes();
  const hr24 = dt.getUTCHours();
  const hr12 = hr24 % 12;
  hr12 = hr12 === 0 ? 12 : hr12;
  const ampm = hr24 > 11 ? " PM" : " AM";
  const mystr =
    dstr +
    " " +
    monstr +
    " " +
    udate +
    ", " +
    yr +
    " " +
    hr12 +
    ":" +
    min +
    ampm;
  return mystr;
};

const SingleEvent = () => {
  const [ticketPurchase, setTicketPurchase] = useState({
    eventNum: eventDetails.eventNum,
    eventName: eventDetails.eventTitle,
    ticketPrice: eventDetails.ticketPrice,
    ticketFee: eventDetails.ticketFee,
    ticketsSelected: 0,
    purchaseAmount: 0,
    ticketUrl: ""
  });

  const [isLoading, setIsLoading] = useState(true);

  let ticket2;
  let ticket3;
  let ticket4;
  let ticket5;

  let ticketTypesNEW = (
    <Aux>
      <div>NOTHING SHOWN</div>
    </Aux>
  );
  let ticketNEW;

  // copies existing ticket order details from "localStorage"
  useEffect(() => {
    ticketTypesNEW = (
      <Aux>
        <div>STILL NOTHING SHOWN</div>
      </Aux>
    );
    setIsLoading(true);
    if (window.innerWidth < 790) {
      setMinView(true);
    } else {
      setMinView(false);
    }
    eventData(queryString.parse(window.location.search).eventID);
  }, []);

  // defines the function that retrieves the Braintree token
  // this represents parts "1" and "2" of the Braintree interaction
  const eventData = eventID => {
    setIsLoading(true);
    getEventData(eventID)
      .then(res => {
        console.log("Event Data Received NOW", res);
        console.log("Ticket Info: ", res.ticket);
        console.log("Event Title: ", res.eventTitle);
        loadTicketInfo(res.ticket);
        mapLoadTicketInfo(res.ticket);
        setIsLoading(false);
      })
      .catch(err => {
        console.log("In the catch");
        setIsLoading(false);
      });
  };

  let ticketInfoArray = [];

  const ticketInfo = {
    ticketID: "empty",
    ticketType: "empty",
    ticketName: "empty",
    ticketDescription: "empty",
    ticketsAvailable: 0,
    ticketPrice: 0,
    ticketFee: 0,
    ticketsSelected: 0,
    maxTicketOrder: 0,
    minTicketOrder: 0
  };

  const mapLoadTicketInfo = ticket => {
    setIsLoading(true);
    ticket.map(item => {
      const newTicketItem = {
        ticketID: item._id,
        ticketType: item.ticketType,
        ticketName: item.ticketName,
        ticketDescription: item.ticketDescription,
        ticketsAvailable: item.remainingQuantity,
        ticketPrice: item.currentTicketPrice,
        ticketFee: 0,
        ticketsSelected: ticketPurchase.ticket2sSelected,
        maxTicketOrder: item.maxTicketsAllowedPerOrder,
        minTicketOrder: item.minTicketsAllowedPerOrder
      };
      ticketInfoArray.push(newTicketItem);
    });

    ticketNEW = {
      ticketName: ticketInfoArray[2].ticketName,
      ticketPrice: ticketInfoArray[2].ticketPrice,
      ticketFee: ticketInfoArray[2].ticketFee,
      // NEED TO REFACTOR "ticketsSelected"
      ticketsSelected: ticketPurchase.ticket2sSelected,
      ticketDescription: ticketInfoArray[2].ticketDescription
    };
    console.log("Before ticketTypeNew");
    ticketTypesNEW = (
      <Aux>
        <TicketItem name={ticketNEW}></TicketItem>
      </Aux>
    );
    console.log("After ticketTypeNew");

    console.log("ticketNEW.ticketName: ", ticketNEW.ticketName);
    console.log("Ticket Array: ", ticketInfoArray);
    setIsLoading(true);
    setIsLoading(false);
  };

  const loadTicketInfo = ticket => {
    setIsLoading(true);
    ticketInfo.ticketID = ticket[0]._id;
    ticketInfo.ticketType = ticket[0].ticketType;
    ticketInfo.ticketName = ticket[0].ticketName;
    ticketInfo.ticketDescription = ticket[0].ticketDescription;
    ticketInfo.ticketsAvailable = ticket[0].remainingQuantity;
    ticketInfo.ticketPrice = ticket[0].currentTicketPrice;
    ticketInfo.maxTicketOrder = ticket[0].maxTicketsAllowedPerOrder;
    ticketInfo.minTicketOrder = ticket[0].minTicketsAllowedPerOrder;
    console.log("Ticket Info: ", ticketInfo);

    setIsLoading(false);
  };

  const [minView, setMinView] = useState(false);
  const [showTicketSelection, setShowTicketSelection] = useState(true);

  // dynamically set the "showOrderSummary" variable
  window.onresize = function(event) {
    if (window.innerWidth < 790) {
      setMinView(true);
    } else {
      setMinView(false);
    }
  };

  const totalAmount = show => {
    if (show && ticketPurchase.purchaseAmount > 0) {
      return <div>${ticketPurchase.purchaseAmount}</div>;
    } else {
      return null;
    }
  };

  const cartLink = show => {
    if (show && ticketPurchase.purchaseAmount > 0) {
      return (
        <div>
          <button
            onClick={showOrderSummary}
            style={{
              color: "black",
              fontWeight: "600"
            }}
          >
            CART
          </button>
        </div>
      );
    } else {
      return null;
    }
  };

  const showOrderSummary = event => {
    setShowTicketSelection(false);
  };
  // modifies state variables to only show "Ticket Payment" window
  const purchaseTicketHandler = event => {
    if (typeof window !== "undefined") {
      // "localStorage" property allows access the Storage object for a document's origin
      // the stored data is saved across browser sessions and has no expiration time, even when window is closed
      // "setItem()" adds order information to "localStorage" with a key of "order" and a value of "JSON.stringify(data)"
      localStorage.setItem("order", JSON.stringify(ticketPurchase));
    }
  };

  let checkoutButton = null;

  // NEED TO STYLE
  if (ticketPurchase.ticketsSelected > 0) {
    checkoutButton = (
      <button
        onClick={purchaseTicketHandler}
        disabled={false}
        style={{
          height: "44px",
          width: "127px",
          backgroundColor: "#d1410c",
          color: "black",
          fontWeight: "600",
          border: "1px #d1410c",
          borderRadius: "8px"
        }}
      >
        <Link to="/checkout">Checkout</Link>
      </button>
    );
  } else {
    checkoutButton = (
      <button
        disabled={true}
        style={{
          height: "44px",
          width: "127px",
          backgroundColor: "#fff",
          color: "lightgrey",
          fontWeight: "600",
          border: "1px solid lightgrey",
          borderRadius: "8px"
        }}
      >
        Checkout
      </button>
    );
  }

  let orderSummary = null;

  // FULLY STYLED
  if (ticketPurchase.ticketsSelected > 0) {
    orderSummary = (
      <Aux>
        <div style={{ fontWeight: "600" }}>Order Summary</div>
        <br></br>
        <div className={styles.RightGrid}>
          <div style={{ fontWeight: "400" }}>
            {ticketPurchase.ticketsSelected} X {eventDetails.ticketName}
          </div>
          <div style={{ textAlign: "right" }}>
            ${ticketPurchase.ticketsSelected * ticketPurchase.ticketPrice}{" "}
          </div>
        </div>
        <hr style={{ border: "1px solid#B2B2B2" }} />
        <div className={styles.RightGrid}>
          <div style={{ fontWeight: "400" }}>Subtotal</div>
          <div style={{ textAlign: "right" }}>
            ${ticketPurchase.ticketsSelected * ticketPurchase.ticketPrice}{" "}
          </div>
        </div>
        <div className={styles.RightGrid}>
          <div style={{ fontWeight: "400" }}>Fees</div>
          <div style={{ textAlign: "right" }}>
            ${ticketPurchase.ticketsSelected * ticketPurchase.ticketFee}{" "}
          </div>
        </div>
        <hr style={{ border: "1px solid#B2B2B2" }} />
        <div className={styles.RightGrid}>
          <div style={{ fontWeight: "600" }}>Total</div>
          <div style={{ textAlign: "right" }}>
            $
            {ticketPurchase.ticketsSelected *
              (ticketPurchase.ticketPrice + ticketPurchase.ticketFee)}
          </div>
        </div>
      </Aux>
    );
  } else {
    orderSummary = <div></div>;
  }

  ticket2 = {
    ticketName: eventDetails.ticket2Name,
    ticketPrice: eventDetails.ticket2Price,
    ticketFee: eventDetails.ticket2Fee,
    // NEED TO REFACTOR "ticketsSelected"
    ticketsSelected: ticketPurchase.ticket2sSelected,
    ticketDescription: eventDetails.ticket2Description
  };

  ticket3 = {
    ticketName: eventDetails.ticket3Name,
    ticketPrice: eventDetails.ticket3Price,
    ticketFee: eventDetails.ticket3Fee,
    // NEED TO REFACTOR "ticketsSelected"
    ticketsSelected: ticketPurchase.ticket3sSelected,
    ticketDescription: eventDetails.ticket3Description
  };

  ticket4 = {
    ticketName: eventDetails.ticket4Name,
    ticketPrice: eventDetails.ticket4Price,
    ticketFee: eventDetails.ticket4Fee,
    // NEED TO REFACTOR "ticketsSelected"
    ticketsSelected: ticketPurchase.ticket4sSelected,
    ticketDescription: eventDetails.ticket4Description
  };

  ticket5 = {
    ticketName: eventDetails.ticket5Name,
    ticketPrice: eventDetails.ticket5Price,
    ticketFee: eventDetails.ticket5Fee,
    // NEED TO REFACTOR "ticketsSelected"
    ticketsSelected: ticketPurchase.ticket5sSelected,
    ticketDescription: eventDetails.ticket5Description
  };

  let ticketTypes = null;

  if (isLoading) {
    ticketTypes = (
      <Aux>
        <Spinner></Spinner>
      </Aux>
    );
  } else {
    ticketTypes = (
      <Aux>
        <TicketItem name={ticket2}></TicketItem>
        <TicketItem name={ticket3}></TicketItem>
        <TicketItem name={ticket4}></TicketItem>
        <TicketItem name={ticket5}></TicketItem>
      </Aux>
    );
  }

  let ticketSelection = null;

  if (showTicketSelection) {
    ticketSelection = (
      <div className={styles.MainContainer}>
        <div className={styles.MainGrid}>
          <div className={styles.MainItemLeft}>
            <div className={styles.EventHeader}>
              <div
                style={{
                  textOverflow: "clip ellipsis",
                  fontSize: "1.125rem",
                  fontWeight: "600"
                }}
              >
                {eventDetails.organizerName} Present:{" "}
                {eventDetails.location.venueName} - {eventDetails.eventTitle}
              </div>
              <div
                style={{
                  fontSize: "1.0rem",
                  fontWeight: "400"
                }}
              >
                {eventDetails.location.address1}, {eventDetails.location.city},{" "}
                {eventDetails.location.state},{" "}
                {eventDetails.location.zipPostalCode} -{" "}
                {eventDetails.startDateTime}
              </div>
            </div>
            <div className={styles.EventTicketSection}>
              <div className={styles.SectionHeader}>Tickets COPY</div>
              <div className={styles.LeftGrid}>
                <div>
                  <div className={styles.TicketType}>
                    {eventDetails.ticketName}
                  </div>
                  <div className={styles.TicketPrices}>
                    ${eventDetails.ticketPrice} +
                    <span className={styles.TicketFees}>
                      ${eventDetails.ticketFee} Fee
                    </span>
                  </div>
                </div>
                <div className={styles.TicketAmount}>
                  <select
                    type="number"
                    name="ticketsSelected"
                    required
                    value={ticketPurchase.ticketsSelected}
                    className={styles.SelectionBox}
                    onChange={event => {
                      setTicketPurchase({
                        ...ticketPurchase,
                        ticketsSelected: event.target.value,
                        purchaseAmount:
                          event.target.value *
                          (eventDetails.ticketPrice + eventDetails.ticketFee),
                        ticketUrl: window.location.href
                      });
                    }}
                  >
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                  </select>
                </div>
              </div>
              <div className={styles.EventDescription}>
                {eventDetails.ticketDescription}
              </div>
              <hr style={{ border: "1px solid#F2F2F2" }} />
              {ticketTypesNEW}
              {ticketTypes}
              <div className={styles.EventDescription}>
                Powered by{" "}
                <NavLink to="/" exact>
                  <img src={OSDLogo} alt="OpenSeatDirect Logo" />
                </NavLink>
              </div>
              <br></br>
            </div>
            <div className={styles.EventFooter}>
              <div
                style={{
                  paddingTop: "8px",
                  fontSize: "20px",
                  fontWeight: "600"
                }}
              >
                {cartLink(minView)}
              </div>
              <div
                style={{
                  textAlign: "right",
                  paddingRight: "10px",
                  paddingTop: "8px",
                  fontSize: "20px",
                  fontWeight: "600"
                }}
              >
                {totalAmount(minView)}
              </div>
              <div style={{ textAlign: "right" }}>{checkoutButton}</div>
            </div>
          </div>
          <div>
            <div className={styles.ImageBox}>
              <img src={CocinaCandelaLogo} alt="Cocina Candela Logo" />
            </div>
            <div className={styles.OrderSummary}>{orderSummary}</div>
          </div>
        </div>
      </div>
    );
  } else {
    ticketSelection = <div>ORDER SUMMARY COMING SOON</div>;
  }

  // FULLY STYLED
  return <Aux>{ticketSelection}</Aux>;
};

export default SingleEvent;

/*const [minView, setMinView] = useState(false);
  const [minViewMessage, setMinViewMessage] = useState("NO");
  const [showTicketSelection, setShowTicketSelection] = useState(true);

  // dynamically set the "showOrderSummary" variable
  window.onresize = function(event) {
    if (window.innerWidth < 790) {
      setMinView(true);
      setMinViewMessage("YES");
      console.log("window.innerWidth: ", window.innerWidth);
      console.log("setMinView: ", minView);
      console.log("window.innerHeight: ", window.innerHeight);
    } else {
      setMinView(false);
      setMinViewMessage("NO");
      console.log("window.innerWidth: ", window.innerWidth);
      console.log("setMinView: ", minView);
      console.log("window.innerHeight: ", window.innerHeight);
    }
  };
  */
