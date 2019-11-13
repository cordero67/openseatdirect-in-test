import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

import Aux from "../hoc/Auxiliary/Auxiliary";

import CocinaCandelaLogo from "../assets/Cocina_Candela/cocinacandela21NEW.jpg";
import OSDLogo from "../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_32.png";
import TicketItem from "./TicketItem";
import styles from "./Order.module.css";

// hard coded event information
const eventDetails = {
  eventNum: "94106331593",
  //eventName: "Private Puerto Rican Dinner",
  eventName: "Chef's Table Dinner",
  eventCategory: "Food&Drink",
  eventStatus: "Scheduled",
  longDescription:
    "Experience a Puerto Rican gastronomy honoring the traditions of Taíno roots and the purity of ingredients. Prepared by Kenny Candelaria who's culinary career began as a child, preparing meals on the fogón with his grandparents in Puerto Rico and refined throughout the years by choosing the most natural, local ingredients available to him.",
  shortDescription: "An orgy of Puerto Rican food. No contraception required.",
  image: "",
  startDateTime: "December 12, 2019 - 8 PM",
  endDateTime: "2019-12-06 09:00:00.000Z",
  location: {
    venue: "Cocina Candela",
    //venue: "Cocina Candela",
    address1: "706 Bloomfield Ave",
    //address1: "706 Bloomfield Ave",
    address2: "",
    city: "Montclair",
    state: "NJ",
    postalCode: "07042"
  },
  organizer: "Dahday",
  cancelURL: "https://www.dahday.com/",
  eventURL: "/dahday-puertoricandinner",
  ticketName: "General Admission",
  ticketDescription: "Full eight course meal and live entertainment.",
  ticketAdditional: "",
  initialTicketsIssued: 30,
  currentTicketsAvailable: 30,
  ticketsSold: 0,
  initiaTicketPrice: 2050,
  currentTicketPrice: 2050,
  initialTicketFee: 0,
  currentTicketFee: 0,
  ticket2Name: "General Admission",
  ticket2Description:
    "Full seven course meal, 2 drinks and live entertainment.",
  ticket2Additional: " + 2 drinks",
  initialTicket2sIssued: 30,
  currentTicket2sAvailable: 30,
  ticket2sSold: 0,
  initialTicket2Price: 100,
  currentTicket2Price: 100,
  initialTicket2Fee: 0,
  currentTicket2Fee: 0,
  ticket3Name: "VIP",
  ticket3Description:
    "Full seven course meal and live entertainment with seat next to the stage.",
  ticket3Additional: "",
  initialTicket3sIssued: 30,
  currentTicket3sAvailable: 30,
  ticket3sSold: 0,
  initialTicket3Price: 125,
  currentTicket3Price: 125,
  initialTicket3Fee: 0,
  currentTicket3Fee: 0,
  ticket4Name: "VIP",
  ticket4Description:
    "Full seven course meal, 2 drinks and live entertainment with seat next to the stage.",
  ticket4Additional: " + 2 drinks",
  initialTicket4sIssued: 30,
  currentTicket4sAvailable: 30,
  ticket4sSold: 0,
  initialTicket4Price: 150,
  currentTicket4Price: 150,
  initialTicket4Fee: 0,
  currentTicket4Fee: 0,
  ticket5Name: "VIP",
  ticket5Description:
    "Full seven course meal, 2 drinks and live entertainment with seat next to the stage. You also get to meet the band before they go on stage",
  ticket5Additional: " + 2 drinks and band introduction",
  initialTicket5sIssued: 30,
  currentTicket5sAvailable: 30,
  ticket5sSold: 0,
  initialTicket5Price: 225,
  currentTicket5Price: 225,
  initialTicket5Fee: 0,
  currentTicket5Fee: 0
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
    eventName: eventDetails.eventName,
    ticketPrice: eventDetails.currentTicketPrice,
    ticketFee: eventDetails.currentTicketFee,
    ticketsSelected: 0,
    purchaseAmount: 0,
    ticketUrl: ""
  });

  // copies existing ticket order details from "localStorage"
  useEffect(() => {
    if (window.innerWidth < 790) {
      setMinView(true);
    } else {
      setMinView(false);
    }
  }, []);

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

  const ticket2 = {
    ticketName: eventDetails.ticket2Name,
    ticketAdditional: eventDetails.ticket2Additional,
    currentTicketPrice: eventDetails.currentTicket2Price,
    currentTicketFee: eventDetails.currentTicket2Fee,
    ticketsSelected: ticketPurchase.ticket2sSelected,
    ticketDescription: eventDetails.ticket2Description
  };

  const ticket3 = {
    ticketName: eventDetails.ticket3Name,
    ticketAdditional: eventDetails.ticket3Additional,
    currentTicketPrice: eventDetails.currentTicket3Price,
    currentTicketFee: eventDetails.currentTicket3Fee,
    ticketsSelected: ticketPurchase.ticket3sSelected,
    ticketDescription: eventDetails.ticket3Description
  };

  const ticket4 = {
    ticketName: eventDetails.ticket4Name,
    ticketAdditional: eventDetails.ticket4Additional,
    currentTicketPrice: eventDetails.currentTicket4Price,
    currentTicketFee: eventDetails.currentTicket4Fee,
    ticketsSelected: ticketPurchase.ticket4sSelected,
    ticketDescription: eventDetails.ticket4Description
  };

  const ticket5 = {
    ticketName: eventDetails.ticket5Name,
    ticketAdditional: eventDetails.ticket5Additional,
    currentTicketPrice: eventDetails.currentTicket5Price,
    currentTicketFee: eventDetails.currentTicket5Fee,
    ticketsSelected: ticketPurchase.ticket5sSelected,
    ticketDescription: eventDetails.ticket5Description
  };

  let ticketList = null;

  /*        onChange={event => {
          setTicketPurchase({
            ...ticketPurchase,
            ticketsSelected: event.target.value,
            purchaseAmount:
              event.target.value *
              (eventDetails.currentTicket2Price + eventDetails.currentTicket2Fee),
            ticketUrl: window.location.href
          });
        }}*/

  ticketList = (
    <Aux>
      <TicketItem name={ticket2}></TicketItem>
      <TicketItem name={ticket3}></TicketItem>
      <TicketItem name={ticket4}></TicketItem>
      <TicketItem name={ticket5}></TicketItem>
    </Aux>
  );

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
                {eventDetails.organizer} Presents: {eventDetails.location.venue}{" "}
                - {eventDetails.eventName}
              </div>
              <div
                style={{
                  fontSize: "1.0rem",
                  fontWeight: "400"
                }}
              >
                {eventDetails.location.address1}, {eventDetails.location.city},{" "}
                {eventDetails.location.state},{" "}
                {eventDetails.location.postalCode} -{" "}
                {eventDetails.startDateTime}
              </div>
            </div>
            <div className={styles.EventTicketSection}>
              <div className={styles.SectionHeader}>Tickets</div>
              <div className={styles.LeftGrid}>
                <div>
                  <div className={styles.TicketType}>
                    {eventDetails.ticketName} {eventDetails.ticketAdditional}
                  </div>
                  <div className={styles.TicketPrices}>
                    ${eventDetails.currentTicketPrice} +
                    <span className={styles.TicketFees}>
                      ${eventDetails.currentTicketFee} Fee
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
                          (eventDetails.currentTicketPrice +
                            eventDetails.currentTicketFee),
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
              {ticketList}
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
              <img alt="Cocina Candela Logo" />
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
