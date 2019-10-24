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
    ticketPurchase.ticketsSelected > 0 && ticketPurchase.ticketsSelected < 31;
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
      <div>
        <h1>{puertoRicoEvent.eventName}: Ticket Selection</h1>
      </div>
      <br></br>
      <div>{puertoRicoEvent.description1}</div>
      <br></br>
      <div>{puertoRicoEvent.description2}</div>
      <br></br>
      <div>
        <img src={CocinaCandelaLogo} alt="Cocina Candela Logo" />
      </div>
      <br></br>
      <br></br>
      <div className="row">
        <div className="col-8">
          <h3>Event Details</h3>
          <br></br>
          <h5>{puertoRicoEvent.venue}</h5>
          <h5>{puertoRicoEvent.location}</h5>
          <h5>
            {puertoRicoEvent.date} at {puertoRicoEvent.time}
          </h5>
          <h5>${puertoRicoEvent.ticketPrice} per ticket</h5>
          <form>
            <br></br>

            <h5>
              <span style={{ color: "red" }}>OPTION 1</span>
            </h5>
            <h5>
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
            </h5>
            <br></br>
            <br></br>
            <br></br>
            <h5>
              <span style={{ color: "red" }}>OPTION 2</span>
            </h5>
            <div className="row">
              <div className="col-5">Number of Tickets:</div>
              <div className="col-5">
                <select
                  style={{
                    width: "60px",
                    height: "30px",
                    textAlign: "right"
                  }}
                  type="number"
                  name="ticketsSelected"
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
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                  <option>13</option>
                  <option>14</option>
                  <option>15</option>
                  <option>16</option>
                  <option>17</option>
                  <option>18</option>
                  <option>19</option>
                  <option>20</option>
                  <option>21</option>
                  <option>22</option>
                  <option>23</option>
                  <option>24</option>
                  <option>25</option>
                  <option>26</option>
                  <option>27</option>
                  <option>28</option>
                  <option>29</option>
                  <option>30</option>
                </select>
              </div>
            </div>
            <h5></h5>
          </form>
        </div>

        <div className="col-4">
          <h3>Order Summary</h3>
          <br></br>
          <h5>{ticketPurchase.ticketsSelected} Tickets selected</h5>
          <h5>
            Total price ( {ticketPurchase.ticketsSelected} x $
            {puertoRicoEvent.ticketPrice} ): ${ticketPurchase.purchaseAmount}
          </h5>
          <h5>That's it, no hidden fees!!!</h5>
          <br></br>
          {checkoutButton}
          <br></br>
          <button onClick={cancelOrderHandler} className={styles.ButtonWhite}>
            <a href="https://www.dahday.com/">Cancel</a>
          </button>
        </div>
      </div>
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
        <br></br>
        <h5>{ticketSelection}</h5>
        <br></br>
      </Container>
    </Aux>
  );
};

export default PueroRicanDinnerTickets;

/*

                <select
                  style={{
                    width: "60px",
                    height: "50px",
                    textAlign: "right"
                  }}
                  type="number"
                  name="ticketsSelected"
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
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                  <option>13</option>
                  <option>14</option>
                  <option>15</option>
                  <option>16</option>
                  <option>17</option>
                  <option>18</option>
                  <option>19</option>
                  <option>20</option>
                  <option>21</option>
                  <option>22</option>
                  <option>23</option>
                  <option>24</option>
                  <option>25</option>
                  <option>26</option>
                  <option>27</option>
                  <option>28</option>
                  <option>29</option>
                  <option>30</option>
                </select>


        <div style={{ color: "red" }}>
          <h5>FOR OSD EYES ONLY</h5>
          <h6>Tickets selected: {ticketPurchase.ticketsSelected}</h6>
          <h6>Purchase amount: {ticketPurchase.purchaseAmount}</h6>
          <h6>Tickets issued: {puertoRicoEvent.ticketsIssued}</h6>
          <h6>Tickets available: {puertoRicoEvent.ticketsAvailable}</h6>
          <h6>Tickets sold: {puertoRicoEvent.ticketsSold}</h6>
        </div>
*/
