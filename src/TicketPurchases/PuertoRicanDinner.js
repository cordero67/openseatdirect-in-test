import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Container } from "react-bootstrap";
import DropIn from "braintree-web-drop-in-react";

import {
  getBraintreeClientToken,
  getExpressBraintreeClientToken,
  processPayment,
  processExpressPayment
} from "./apiCore";
import { isAuthenticated } from "../auth/index";
import Aux from "../hoc/Auxiliary/Auxiliary";

import Logo from "../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_32.png";
import dahdayLogo from "../assets/dahday/dahday-white-logo-small.png";
import CocinaCandelaLogo from "../assets/Cocina_Candela/shimp-rice-cocina-candela-nj.jpg";

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
  pathName: "/puerto-rican-dinner"
};

const PueroRicanDinner = props => {
  // ticket purchase data
  const [ticketPurchase, setTicketPurchase] = useState({
    ticketsSelected: 0,
    purchaseAmount: 0,
    fullName: "",
    email: "",
    creditcard: ""
  });

  // added straight from Udemy course code
  // this variable is for the Braintree interface
  const [data, setData] = useState({
    success: false,
    clientToken: true,
    error: "",
    instance: {},
    address: ""
  });

  // ALTERNATE TO getToken() CODE: getExpressToken()
  // defines the function that retrieves the Braintree token
  // this represents parts "1" and "2" of the Braintree interaction
  const getExpressToken = () => {
    getExpressBraintreeClientToken().then(data => {
      if (data.error) {
        setData({ ...data, error: data.error });
      } else {
        //  setData({ ...data, clientToken: data.clientToken });
        setData({ clientToken: data.clientToken });
      }
    });
  };

  /*
  // ALTERNATE TO getExpressToken() CODE: getToken()
  // defines the function that retrieves the Braintree token
  // this represents parts "1" and "2" of the Braintree interaction
  const getToken = (userID, token) => {
    getBraintreeClientToken(userID, token).then(data => {
      if (data.error) {
        setData({ ...data, error: data.error });
      } else {
        //  setData({ ...data, clientToken: data.clientToken });
        setData({ clientToken: data.clientToken });
      }
    });
  };
  */

  // OVER-WRITE OF getToken() FOR getExpressToken()
  // calls for the Braintree token upon the loading of this component
  useEffect(() => {
    getExpressToken();
    //getToken(userID, token);
  }, []);

  // determines if user is logged-in and retreives their id
  //const userID = isAuthenticated() && isAuthenticated().user._id;

  // determines if user is logged-in and retreives their token
  const token = isAuthenticated() && isAuthenticated().token;

  const [showTicketSelection, setShowTicketSelection] = useState(true);

  const [showTicketPayment, setShowTicketPayment] = useState(false);

  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);

  // modifies state variables to only show "Ticket Payment" window
  const purchaseTicketHandler = event => {
    setShowTicketSelection(false);
    setShowTicketPayment(true);
    setShowPaymentConfirm(false);
  };

  // modifies state variables to only show "Ticket Selection" window
  const changeOrderHandler = event => {
    event.preventDefault();
    setShowTicketSelection(true);
    setShowTicketPayment(false);
    setShowPaymentConfirm(false);
  };

  // modifies state variables to only show "Payment Confirm" window
  // NEED TO SEND TICKET AMOUNT TO "EventList" AND REGISTER TICKETS PURCHASED
  const purchaseConfirmHandler = () => {
    setTicketPurchase({
      // add event
      ticketsSelected: 0,
      purchaseAmount: 0,
      fullName: "",
      email: "",
      creditcard: ""
    });
    setShowTicketSelection(false);
    setShowTicketPayment(false);
    setShowPaymentConfirm(true);
  };

  // resets all state variables back to defualt values
  // reroutes user back to events page
  const cancelOrderHandler = event => {
    // clears successful ticket purchase information
    setTicketPurchase({
      ticketsSelected: 0,
      purchaseAmount: 0,
      fullName: "",
      email: "",
      creditcard: ""
    });
    setShowTicketSelection(true);
    setShowTicketPayment(false);
    setShowPaymentConfirm(false);

    //<Link to="/video">Cancel Order</Link>;
  };

  // ALTERNATE TO buy() CODE: expressBuy()
  // sends payment method and total amount to the backend/server
  const expressBuy = () => {
    let nonce;
    let getNonce = data.instance
      .requestPaymentMethod()
      .then(data => {
        console.log(data);
        nonce = data.nonce;
        console.log(
          "send nonce and total to process: ",
          nonce,
          ticketPurchase.purchaseAmount
        );
        // UNCOMMENT FROM HERE
        const paymentTicketData = {
          paymentMethodNonce: nonce,
          amount: ticketPurchase.purchaseAmount,
          eventID: 100,
          email: ticketPurchase.email,
          ticketsSelected: ticketPurchase.ticketsSelected
        };

        // need to send
        processExpressPayment(paymentTicketData)
          .then(response => {
            console.log(response);
            setData({ ...data, success: response.success });
            // empty cart
            // create order
            purchaseConfirmHandler();
          })
          .catch(error => console.log(error));
        // TO HERE
      })
      .catch(error => {
        console.log("dropin error: ", error);
        setData({ ...data, error: error.message });
      });
  };

  /*
  // ALTERNATE TO expressBuy() CODE: buy()
  // sends payment method and total amount to the backend/server
  const buy = () => {
    // sends the nonce to the server
    // the "nonce" is defined as the "data.instance.requestPaymentMethod()"
    let nonce;
    // "data.instance" is created when "<DropIn>" is rendered in the line "onInstance={instance => (data.instance = instance)}"
    // that line established a Braintree connection in order to complete part "3" of the interaction
    // "data.instance.requestPaymentMethod()" requests the "nonce" from Braintree
    let getNonce = data.instance
      .requestPaymentMethod()
      .then(data => {
        console.log(data);
        // assigns the Braintree nonce "data.nonce" to the "nonce"
        // this is part "3' of the Braintree interaction"
        nonce = data.nonce;
        // nonce consists of the card type and card number
        // nonce will be sent to the backend as 'paymentMethodNonce'
        // "purchaseAmount" will also be sent to the backend
        console.log(
          "send nonce and total to process: ",
          nonce,
          ticketPurchase.purchaseAmount
        );
        // UNCOMMENT FROM HERE
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: ticketPurchase.purchaseAmount
        };

        // need to send
        processPayment(userID, token, paymentData)
          .then(response => {
            console.log(response);
            setData({ ...data, success: response.success });
            // empty cart
            // create order
            purchaseConfirmHandler();
          })
          .catch(error => console.log(error));
        // TO HERE
      })
      .catch(error => {
        console.log("dropin error: ", error);
        setData({ ...data, error: error.message });
      });
  };
*/
  const showError = error => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = success => (
    <div
      className="alert alert-info"
      style={{ display: success ? "" : "none" }}
    >
      <h2>Thank you for your ticket purchase!!! </h2>
      <h2>Your payment was recieved successfully</h2>
      <h2>You will be receiving an email shortly with your order details.</h2>
    </div>
  );

  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: "" })}>
      {data.clientToken !== null && ticketPurchase.ticketsSelected > 0 ? (
        <div>
          {/*this establishes a Braintree connection in order to complete
          part "3" of the interaction*/}
          <DropIn
            options={{
              authorization: data.clientToken,
              paypal: {
                flow: "vault"
              },
              venmo: {}
            }}
            onInstance={instance => (data.instance = instance)}
          />
          <button onClick={expressBuy} className="btn btn-success">
            Submit Payment
          </button>
        </div>
      ) : (
        <div>
          <h5>NO DROP IN RETURNED</h5>
        </div>
      )}
    </div>
  );

  let ticketSelection = null;
  let purchaseSelection = null;
  let purchaseConfirmation = null;

  // Ticket Selection Window details
  if (showTicketSelection) {
    ticketSelection = (
      <Aux>
        <div>{puertoRicoEvent.description1}</div>
        <br></br>
        <div>{puertoRicoEvent.description2}</div>
        <br></br>
        <div>
          <img src={CocinaCandelaLogo} />
        </div>
        <br></br>
        <div className="row">
          <div className="col-8">
            <h3>Event Details:</h3>
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

          <div className="col-4">
            <h3>Purchase Summary:</h3>
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
                  <button onClick={purchaseTicketHandler}>Checkout</button>
                </h6>
              </div>
              <div className="col-5">
                <h6>
                  <button onClick={cancelOrderHandler}>
                    <Link to="/">Cancel Order</Link>
                  </button>
                </h6>
              </div>
              <div className="col-3">
                <h6>
                  <button>
                    <a href="https://www.dahday.com/">dahday</a>
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
  } else {
    ticketSelection = (
      <Aux>
        <div>
          <h3>Ticket Selection Form DISABLED</h3>
        </div>
      </Aux>
    );
  }

  // Ticket Purchase Window details
  if (showTicketPayment) {
    purchaseSelection = (
      <Aux>
        <h1>Pay for your tickets</h1>
        <h3>Purchase Summary</h3>

        <h4>{puertoRicoEvent.eventName}</h4>
        <h5>
          {ticketPurchase.ticketsSelected} Tickets: $
          {ticketPurchase.purchaseAmount}
        </h5>
        <h3>Enter your information</h3>

        <form>
          <br></br>
          <h5>
            <input
              type="text"
              name="fullName"
              value={ticketPurchase.fullName}
              placeholder="Full Name"
              required
              onChange={event =>
                setTicketPurchase({
                  ...ticketPurchase,
                  fullName: event.target.value
                })
              }
            />
            Full Name
          </h5>

          <h5>
            <input
              type="email"
              name="emailAddress"
              value={ticketPurchase.email}
              placeholder="Email Address"
              required
              onChange={event =>
                setTicketPurchase({
                  ...ticketPurchase,
                  email: event.target.value
                })
              }
            />
            Email Address
          </h5>
        </form>
        <h5>{showDropIn()}</h5>
        <h5>{showError(data.error)}</h5>
      </Aux>
    );
  } else {
    purchaseSelection = (
      <Aux>
        <h3>Ticket Payment Form DISABLED</h3>
      </Aux>
    );
  }

  if (showPaymentConfirm) {
    purchaseConfirmation = (
      <Aux>
        <h1>Thank you for your purchase</h1>
        <h5>{showSuccess(data.success)}</h5>
      </Aux>
    );
  } else {
    purchaseConfirmation = (
      <Aux>
        <h3>Purchase Confimation Message DISABLED</h3>
      </Aux>
    );
  }

  return (
    <Aux>
      <Container>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div>
          <h1>{puertoRicoEvent.eventName}</h1>
        </div>
        <br></br>

        <h5>{ticketSelection}</h5>
        <h5>{purchaseSelection}</h5>
        <h5>{purchaseConfirmation}</h5>
        <br></br>

        <div style={{ color: "red" }}>
          <h5>FOR OSD EYES ONLY</h5>
          <h6>Tickets selected: {ticketPurchase.ticketsSelected}</h6>
          <h6>Purchase amount: {ticketPurchase.purchaseAmount}</h6>
          <h6>Full Name: {ticketPurchase.fullName}</h6>
          <h6>E-mail Address: {ticketPurchase.email}</h6>
          <h6>Tickets issued: {puertoRicoEvent.ticketsIssued}</h6>
          <h6>Tickets available: {puertoRicoEvent.ticketsAvailable}</h6>
          <h6>Tickets sold: {puertoRicoEvent.ticketsSold}</h6>
        </div>
      </Container>
    </Aux>
  );
};

export default PueroRicanDinner;
