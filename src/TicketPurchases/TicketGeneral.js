import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

import Aux from "../hoc/Auxiliary/Auxiliary";

import CocinaCandelaLogo from "../assets/Cocina_Candela/store_sign.jpg";
import OSDLogo from "../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_32.png";

import styles from "./Order.module.css";

/*
eventbright
790px
1140px

OSD
1140px
*/

// hard coded event information
const eventDetails = {
  eventID: "0001",
  //eventName: "Private Puerto Rican Dinner",
  eventName: "PPRD",
  eventCategory: "Food&Drink",
  eventStatus: "Scheduled",
  longDescription:
    "Experience a Puerto Rican gastronomy honoring the traditions of Taíno roots and the purity of ingredients. Prepared by Kenny Candelaria who's culinary career began as a child, preparing meals on the fogón with his grandparents in Puerto Rico and refined throughout the years by choosing the most natural, local ingredients available to him.",
  shortDescription: "An orgy of Puerto Rican food. No contraception required.",
  image: "",
  startDateTime: "2019-12-06 08:01:00.000Z",
  endDateTime: "2019-12-06 09:00:00.000Z",
  location: {
    venue: "CC",
    //venue: "Cocina Candela",
    address1: "706",
    //address1: "706 Bloomfield Ave",
    address2: "",
    city: "Montclair",
    state: "NJ",
    postalCode: "10001"
  },
  organizer: "Dahday",
  cancelURL: "https://www.dahday.com/",
  eventURL: "/dahday-puertoricandinner",
  ticketType: "General Admission",
  ticketDescription: "No chair, but you get your ass in the door",
  ticketAdditional: "",
  initialTicketsIssued: 30,
  currentTicketsAvailable: 30,
  ticketsSold: 0,
  initiaTicketPrice: 75,
  currentTicketPrice: 75,
  initialTicketFee: 1,
  currentTicketFee: 1,
  ticket2Type: "General Admission",
  ticket2Description:
    "No chair, but you get your ass in the door, plus a bottle of boozes!",
  ticket2Additional: " + 1 Bottle of Ripple",
  initialTicket2sIssued: 30,
  currentTicket2sAvailable: 30,
  ticket2sSold: 0,
  initialTicket2Price: 100,
  currentTicket2Price: 100,
  initialTicket2Fee: 2,
  currentTicket2Fee: 2,
  ticket3Type: "VIP",
  ticket3Description: "Not only do you get in the door, you also get a chair!",
  ticket3Additional: "",
  initialTicket3sIssued: 30,
  currentTicket3sAvailable: 30,
  ticket3sSold: 0,
  initialTicket3Price: 125,
  currentTicket3Price: 125,
  initialTicket3Fee: 3,
  currentTicket3Fee: 3,
  ticket4Type: "VIP",
  ticket4Description:
    "Not only do you get in the door, you also get a chair and a bottle of booze!",
  ticket4Additional: " + 1 Bottle of Ripple",
  initialTicket4sIssued: 30,
  currentTicket4sAvailable: 30,
  ticket4sSold: 0,
  initialTicket4Price: 150,
  currentTicket4Price: 150,
  initialTicket4Fee: 4,
  currentTicket4Fee: 4,
  ticket5Type: "VIP",
  ticket5Description:
    "Not only do you get in the door, you also get a chair, a bottle of booze and a warm special someone!",
  ticket5Additional: " + 1 Bottle of Ripple PLUS",
  initialTicket5sIssued: 30,
  currentTicket5sAvailable: 30,
  ticket5sSold: 0,
  initialTicket5Price: 225,
  currentTicket5Price: 225,
  initialTicket5Fee: 5,
  currentTicket5Fee: 5
};

const SingleEvent = () => {
  const [ticketPurchase, setTicketPurchase] = useState({
    eventID: eventDetails.eventID,
    eventName: eventDetails.eventName,
    ticketPrice: eventDetails.currentTicketPrice,
    ticketFee: eventDetails.currentTicketFee,
    ticketsSelected: 0,
    purchaseAmount: 0
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
    console.log(window.innerWidth);
    if (window.innerWidth < 790) {
      setMinView(true);
      console.log("Total Amount");
    } else {
      setMinView(false);
      console.log("HIDDEN");
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
            {ticketPurchase.ticketsSelected} X {eventDetails.ticketType}
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
                    {eventDetails.ticketType} {eventDetails.ticketAdditional}
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
                            eventDetails.currentTicketFee)
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
              <div className={styles.LeftGrid}>
                <div>
                  <div className={styles.TicketType}>
                    {eventDetails.ticket2Type} {eventDetails.ticket2Additional}
                  </div>
                  <div className={styles.TicketPrices}>
                    ${eventDetails.currentTicket2Price} +
                    <span className={styles.TicketFees}>
                      ${eventDetails.currentTicket2Fee} Fee
                    </span>
                  </div>
                </div>
                <div className={styles.TicketAmount}>
                  <select className={styles.SelectionBox}>
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                  </select>
                </div>
              </div>
              <div className={styles.EventDescription}>
                {eventDetails.ticket2Description}
              </div>
              <hr style={{ border: "1px solid#F2F2F2" }} />
              <div className={styles.LeftGrid}>
                <div>
                  <div className={styles.TicketType}>
                    {eventDetails.ticket3Type} {eventDetails.ticket3Additional}
                  </div>
                  <div className={styles.TicketPrices}>
                    ${eventDetails.currentTicket3Price} +
                    <span className={styles.TicketFees}>
                      ${eventDetails.currentTicket3Fee} Fee
                    </span>
                  </div>
                </div>
                <div className={styles.TicketAmount}>
                  <select className={styles.SelectionBox}>
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                  </select>
                </div>
              </div>
              <div className={styles.EventDescription}>
                {eventDetails.ticket3Description}
              </div>
              <hr style={{ border: "1px solid#F2F2F2" }} />
              <div className={styles.LeftGrid}>
                <div>
                  <div className={styles.TicketType}>
                    {eventDetails.ticket4Type} {eventDetails.ticket4Additional}
                  </div>
                  <div className={styles.TicketPrices}>
                    ${eventDetails.currentTicket4Price} +
                    <span className={styles.TicketFees}>
                      ${eventDetails.currentTicket4Fee} Fee
                    </span>
                  </div>
                </div>
                <div className={styles.TicketAmount}>
                  <select className={styles.SelectionBox}>
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                  </select>
                </div>
              </div>
              <div className={styles.EventDescription}>
                {eventDetails.ticket4Description}
              </div>
              <hr style={{ border: "1px solid#F2F2F2" }} />
              <div className={styles.LeftGrid}>
                <div>
                  <div className={styles.TicketType}>
                    {eventDetails.ticket5Type} {eventDetails.ticket5Additional}
                  </div>
                  <div className={styles.TicketPrices}>
                    ${eventDetails.currentTicket5Price} +
                    <span className={styles.TicketFees}>
                      ${eventDetails.currentTicket5Fee} Fee
                    </span>
                  </div>
                </div>
                <div className={styles.TicketAmount}>
                  <select className={styles.SelectionBox}>
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                  </select>
                </div>
              </div>
              <div className={styles.EventDescription}>
                {eventDetails.ticket5Description}
              </div>
              <hr style={{ border: "1px solid#F2F2F2" }} />
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
