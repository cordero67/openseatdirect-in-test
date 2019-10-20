import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { Container } from "react-bootstrap";

import Aux from "../hoc/Auxiliary/Auxiliary";

import Logo from "../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_32.png";
import dahdayLogo from "../assets/dahday/dahday-white-logo-updated-5-9-18-1small.png";
import CocinaCandelaLogo1 from "../assets/Cocina_Candela/shimp-rice-cocina-candela-nj.jpg";
import CocinaCandelaLogo2 from "../assets/Cocina_Candela/store_signNEW.jpg";

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
  ticketPrice: 75,
  pathName: "/dahday-puertoricandinner"
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

  let ticketSelection = null;

  // defines "ticketSelection" details
  ticketSelection = (
    <Aux>
      <div>
        <h1>{puertoRicoEvent.eventName}: Ticket Selection</h1>
      </div>
      <br></br>
      <div>{puertoRicoEvent.description1}</div>
      <br></br>
      <div>{puertoRicoEvent.description2}</div>
      <br></br>
      <div>
        <img src={CocinaCandelaLogo1} />
        <img src={CocinaCandelaLogo2} />
      </div>
      <br></br>
      <div className="row">
        <div className="col-9">
          <h3>Event Details</h3>
          <h5>
            {puertoRicoEvent.venue} - {puertoRicoEvent.location}
          </h5>
          <h5>
            {puertoRicoEvent.date} at {puertoRicoEvent.time}
          </h5>
          <h5>${puertoRicoEvent.ticketPrice} per ticket</h5>
          <form>
            <br></br>

            <h5>
              Number of Tickets:
              <input
                type="number"
                name="ticketsSelected"
                min="0"
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
            </h5>
            <br></br>
          </form>
        </div>

        <div className="col-3">
          <h3>Order Summary</h3>
          <h5>{ticketPurchase.ticketsSelected} Tickets selected</h5>
          <h5>
            Total price ( {ticketPurchase.ticketsSelected} x $
            {puertoRicoEvent.ticketPrice} ): ${ticketPurchase.purchaseAmount}
          </h5>
          <h5>That's it, no hidden fees!!!</h5>
          <br></br>

          <div className="row">
            <div className="col-4">
              <h6>
                <button onClick={purchaseTicketHandler}>
                  <Link to="/dahday-puertoricandinner-checkout">Checkout</Link>
                </button>
              </h6>
            </div>
            <div className="col-8">
              <h6>
                <button>
                  <a href="https://www.dahday.com/">Cancel</a>
                </button>
              </h6>
            </div>
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <div className="row">
        <div className="col-10">
          <h6>
            Presented by
            <a href="https://www.dahday.com/">
              <img src={dahdayLogo} />
            </a>
          </h6>
        </div>
        <div className="col-2">
          <h6>
            Powered by
            <NavLink to="/" exact>
              <img src={Logo} />
            </NavLink>
          </h6>
        </div>
      </div>

      <br></br>
      <br></br>
    </Aux>
  );

  return (
    <Aux>
      <Container>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <h5>{ticketSelection}</h5>
        <br></br>

        <div style={{ color: "red" }}>
          <h5>FOR OSD EYES ONLY</h5>
          <h6>Tickets selected: {ticketPurchase.ticketsSelected}</h6>
          <h6>Purchase amount: {ticketPurchase.purchaseAmount}</h6>
          <h6>Tickets issued: {puertoRicoEvent.ticketsIssued}</h6>
          <h6>Tickets available: {puertoRicoEvent.ticketsAvailable}</h6>
          <h6>Tickets sold: {puertoRicoEvent.ticketsSold}</h6>
        </div>
      </Container>
    </Aux>
  );
};

export default PueroRicanDinnerTickets;
