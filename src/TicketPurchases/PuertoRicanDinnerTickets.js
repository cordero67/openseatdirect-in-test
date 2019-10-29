import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

import Aux from "../hoc/Auxiliary/Auxiliary";

import CocinaCandelaLogo from "../assets/Cocina_Candela/shimp-rice-cocina-candela-nj.jpg";
import styles from "./TicketPurchases.module.css";

// hard coded event information
const puertoRicoEvent = {
  eventID: "0001",
  eventName: "Private Puerto Rican Dinner",
  venue: "Cocina Candela",
  location: "706 Bloomfield Ave, Montclair, NJ",
  time: "8:00 pm",
  date: "November 1, 2019",
  description1:
    "Experience a Puerto Rican gastronomy honoring the traditions of Taíno roots and the purity of ingredients. Prepared by Kenny Candelaria who's culinary career began as a child, preparing meals on the fogón with his grandparents in Puerto Rico and refined throughout the years by choosing the most natural, local ingredients available to him.",
  description2: "Private event limited to 30 guests.",
  ticketsIssued: 30,
  ticketsAvailable: 30,
  ticketsSold: 0,
  ticketPrice: 75
};

// NEW EVENT DETAIL VARIABLE
const eventDetails = {
  eventID: "0001",
  eventName: "Private Puerto Rican Dinner",
  eventCategory: "Food&Drink",
  eventStatus: "Scheduled",
  longDescription:
    "Experience a Puerto Rican gastronomy honoring the traditions of Taíno roots and the purity of ingredients. Prepared by Kenny Candelaria who's culinary career began as a child, preparing meals on the fogón with his grandparents in Puerto Rico and refined throughout the years by choosing the most natural, local ingredients available to him.",
  shortDescription: "Private event limited to 30 guests.",
  image: "",
  startDateTime: "2019-12-06 08:01:00.000Z",
  endDateTime: "2019-12-06 09:00:00.000Z",
  location: {
    venue: "Cocina Candela",
    address1: "706 Bloomfield Ave",
    address2: "",
    city: "Montclair",
    state: "NJ",
    postalCode: "10001"
  },
  organizer: "Dahday",
  cancelURL: "https://www.dahday.com/",
  eventURL: "/dahday-puertoricandinner",
  ticketType: "General Admission",
  initialTicketsIssued: 30,
  currentTicketsAvailable: 30,
  ticketsSold: 0,
  initialTicketPrice: 75,
  currentTicketPrice: 75
};

const PueroRicanDinnerTickets = () => {
  // sets ticket purchase data variable
  const [ticketPurchase, setTicketPurchase] = useState({
    eventID: puertoRicoEvent.eventID,
    eventName: puertoRicoEvent.eventName,
    ticketPrice: puertoRicoEvent.ticketPrice,
    ticketsSelected: 0,
    purchaseAmount: 0
  });

  // copies existing ticket order details from "localStorage"
  useEffect(() => {
    if (localStorage.getItem("order")) {
      const newOrder = JSON.parse(localStorage.getItem("order"));
      setTicketPurchase({
        ...ticketPurchase,
        eventID: newOrder.eventID,
        eventName: newOrder.eventName,
        ticketPrice: newOrder.ticketPrice,
        ticketsSelected: newOrder.ticketsSelected,
        purchaseAmount: newOrder.purchaseAmount
      });
    }
  }, []);

  // modifies state variables to only show "Ticket Payment" window
  const purchaseTicketHandler = event => {
    if (typeof window !== "undefined") {
      // "localStorage" property allows access the Storage object for a document's origin
      // the stored data is saved across browser sessions and has no expiration time, even when window is closed
      // "setItem()" adds order information to "localStorage" with a key of "order" and a value of "JSON.stringify(data)"
      localStorage.setItem("order", JSON.stringify(ticketPurchase));
    }
  };

  // removes "order" from "localStorage"
  const cancelOrderHandler = () => {
    localStorage.removeItem("order");
  };

  // determines whether or not the "Checkout" button is enabled
  let validTicketAmount =
    ticketPurchase.ticketsSelected > 0 && ticketPurchase.ticketsSelected < 30;
  let checkoutButton = null;

  if (validTicketAmount) {
    checkoutButton = (
      <div style={{ color: "white" }}>
        <button onClick={purchaseTicketHandler} className={styles.ButtonWhite}>
          <Link to="/dahday-puertoricandinner-checkout">Checkout</Link>
        </button>
      </div>
    );
  } else {
    checkoutButton = (
      <div>
        <div style={{ color: "white" }}>
          <button disabled={!validTicketAmount} className={styles.ButtonGrey}>
            Checkout
          </button>
        </div>
      </div>
    );
  }

  let ticketSelection = null;

  // defines "ticketSelection" details
  ticketSelection = (
    <Aux>
      <div>{puertoRicoEvent.description1}</div>
      <br></br>
      <div>{puertoRicoEvent.description2}</div>
      <br></br>
      <div>
        <img src={CocinaCandelaLogo} alt="Cocina Candela Logo" />
      </div>
      <br></br>
      <br></br>
      <div className="row" styles={{ position: "fixed" }}>
        <div style={{ paddingTop: "20px" }} className="col-7">
          <span className={styles.SubSectionHeader}>Event Details</span>
          <br></br>
          <div className={styles.SubBody}>
            {puertoRicoEvent.venue}
            <br></br>
            {puertoRicoEvent.location}
            <br></br>
            {puertoRicoEvent.date} at {puertoRicoEvent.time}
            <br></br>${puertoRicoEvent.ticketPrice} per ticket
            <br></br>
            <br></br>
            <span className={styles.SubSectionHeader}>Ticket Selection</span>
            <form>
              <div className="row">
                <div className="col-5">Number of Tickets:</div>
                <div className="col-5">
                  <select
                    style={{
                      width: "70px",
                      height: "50px"
                    }}
                    type="number"
                    name="ticketsSelected"
                    value={ticketPurchase.ticketsSelected}
                    required
                    onChange={event => {
                      setTicketPurchase({
                        ...ticketPurchase,
                        ticketsSelected: event.target.value,
                        purchaseAmount:
                          event.target.value * puertoRicoEvent.ticketPrice
                      });
                    }}
                  >
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                  </select>
                </div>
              </div>
              <h5></h5>
            </form>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#F1F1F1",
            paddingLeft: "30px",
            paddingTop: "20px"
          }}
          className="col-5"
        >
          <span className={styles.SubSectionHeader}>Order Summary</span>
          <br></br>
          <div className={styles.SubBody}>
            <div className="row">
              <div className="col-10">
                {ticketPurchase.ticketsSelected} x {ticketPurchase.eventName}
              </div>
              <div
                style={{
                  textAlign: "right",
                  paddingRight: "25px"
                }}
                className="col-2"
              >
                ${ticketPurchase.purchaseAmount}
              </div>
            </div>
            <hr style={{ border: "1px solid#C0C0C0" }} />
            <div className="row">
              <div className="col-10">Sub-Total</div>
              <div
                style={{
                  textAlign: "right",
                  paddingRight: "25px"
                }}
                className="col-2"
              >
                ${ticketPurchase.purchaseAmount}
              </div>
            </div>
            <div className="row">
              <div className="col-10">Processing fees:</div>
              <div
                style={{
                  textAlign: "right",
                  paddingRight: "25px"
                }}
                className="col-2"
              >
                $0
              </div>
            </div>
            <hr style={{ border: "1px solid#C0C0C0" }} />
            <div className="row">
              <div className="col-10">Total</div>

              <div
                style={{
                  textAlign: "right",
                  paddingRight: "25px"
                }}
                className="col-2"
              >
                ${ticketPurchase.purchaseAmount}
              </div>
            </div>
          </div>
          <br></br>
          <div className="row">
            <div className="col-6">{checkoutButton}</div>
            <div className="col-6">
              <button
                onClick={cancelOrderHandler}
                className={styles.ButtonWhite}
              >
                <a href="https://www.dahday.com/">Cancel</a>
              </button>
            </div>
            <br></br>
            <br></br>
          </div>
        </div>
      </div>
    </Aux>
  );

  return (
    <Aux>
      <div className={styles.ContentBoxLarge}>
        <div className={styles.SectionHeader}>{puertoRicoEvent.eventName}</div>
        <br></br>
        <br></br>
        <div className={styles.Body}>{ticketSelection}</div>
      </div>
    </Aux>
  );
};

export default PueroRicanDinnerTickets;

/*
              <div className="row">
                <div className="col-5">Number of Tickets:</div>
                <div className="col-5">
                  <input
                    className={styles.TicketBox}
                    type="number"
                    name="ticketsSelected"
                    min="1"
                    max={puertoRicoEvent.ticketsAvailable}
                    step="1"
                    value={ticketPurchase.ticketsSelected}
                    placeholder=""
                    required
                    onChange={event => {
                      setTicketPurchase({
                        ...ticketPurchase,
                        ticketsSelected: event.target.value,
                        purchaseAmount:
                          event.target.value * puertoRicoEvent.ticketPrice
                      });
                    }}
                  />
                </div>
              </div>

        <div style={{ color: "red" }}>
          <h5>FOR OSD EYES ONLY</h5>
          <h6>Tickets selected: {ticketPurchase.ticketsSelected}</h6>
          <h6>Purchase amount: {ticketPurchase.purchaseAmount}</h6>
          <h6>Tickets issued: {puertoRicoEvent.ticketsIssued}</h6>
          <h6>Tickets available: {puertoRicoEvent.ticketsAvailable}</h6>
          <h6>Tickets sold: {puertoRicoEvent.ticketsSold}</h6>
        </div>
*/
