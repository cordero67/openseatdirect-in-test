import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Container } from "react-bootstrap";
import DropIn from "braintree-web-drop-in-react";

import {
  getExpressBraintreeClientToken,
  processExpressPayment
} from "./apiCore";
import Aux from "../hoc/Auxiliary/Auxiliary";

import Logo from "../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_32.png";
import dahdayLogo from "../assets/dahday/dahday-white-logo-updated-5-9-18-1small.png";
import CocinaCandelaLogo from "../assets/Cocina_Candela/shimp-rice-cocina-candela-nj.jpg";

const Checkout = props => {
  // ticket purchase data
  const [order, setOrder] = useState({
    eventID: "",
    eventName: "",
    ticketPrice: 0,
    ticketsSelected: 0,
    purchaseAmount: 0,
    fullName: "",
    email: ""
  });

  // this variable is for the Braintree interface
  const [data, setData] = useState({
    success: false,
    clientToken: true,
    error: "",
    instance: {},
    address: ""
  });

  // defines the function that retrieves the Braintree token
  // this represents parts "1" and "2" of the Braintree interaction
  const getExpressToken = () => {
    getExpressBraintreeClientToken().then(data => {
      if (data.error) {
        setData({ ...data, error: data.error });
      } else {
        setData({ ...data, clientToken: data.clientToken });
        // setData({ clientToken: data.clientToken });
        setShowTicketPayment(true);
      }
    });
  };

  // calls for the Braintree token upon the loading of this component
  // copies ticket order details from "localStorage"
  useEffect(() => {
    if (localStorage.getItem("ordr")) {
      const newOrder = JSON.parse(localStorage.getItem("ordr"));
      setOrder({
        ...order,
        eventID: newOrder.eventID,
        eventName: newOrder.eventName,
        ticketPrice: newOrder.ticketPrice,
        ticketsSelected: newOrder.ticketsSelected,
        purchaseAmount: newOrder.purchaseAmount
      });
    }
    getExpressToken();
  }, []);

  const [showTicketPayment, setShowTicketPayment] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);

  // modifies state variables to only show "Payment Confirm" window
  // NEED TO SEND TICKET AMOUNT TO "EventList" AND REGISTER TICKETS PURCHASED
  const purchaseConfirmHandler = () => {
    setOrder({
      eventID: "",
      eventName: "",
      ticketPrice: 0,
      ticketsSelected: 0,
      purchaseAmount: 0,
      fullName: "",
      email: ""
    });
    setShowTicketPayment(false);
    setShowPaymentConfirm(true);
    localStorage.removeItem("ordr");
  };

  // I MAY DELETE THIS SECTION
  // resets all state variables back to defualt values
  // reroutes user back to events page
  const cancelOrderHandler = event => {
    // clears successful ticket purchase information
    setOrder({
      eventID: "",
      eventName: "",
      ticketPrice: 0,
      ticketsSelected: 0,
      purchaseAmount: 0,
      fullName: "",
      email: ""
    });
    setShowTicketPayment(false);
    setShowPaymentConfirm(false);
  };

  // NEED TO WORK ON THIS SECTION
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
          order.purchaseAmount
        );
        // UNCOMMENT FROM HERE
        const paymentTicketData = {
          paymentMethodNonce: nonce,
          amount: order.purchaseAmount,
          eventID: 100,
          email: order.email,
          ticketsSelected: order.ticketsSelected
        };

        // need to send to backend
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
      <h2>Your payment was received successfully</h2>
      <h2>You will be receiving an email shortly with your order details.</h2>
    </div>
  );

  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: "" })}>
      {data.clientToken !== null && order.ticketsSelected > 0 ? (
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

  let purchaseSelection = null;
  let purchaseConfirmation = null;

  // Ticket Purchase Window details
  if (showTicketPayment) {
    purchaseSelection = (
      <Aux>
        <div className="row">
          <div className="col-7">
            <h3>Contact Information</h3>
            <form>
              <h5>
                <input
                  type="text"
                  name="fullName"
                  value={order.fullName}
                  placeholder="Full Name*"
                  required
                  onChange={event =>
                    setOrder({
                      ...order,
                      fullName: event.target.value
                    })
                  }
                />
              </h5>

              <h5>
                <input
                  type="email"
                  name="emailAddress"
                  value={order.email}
                  placeholder="Email Address*"
                  required
                  onChange={event =>
                    setOrder({
                      ...order,
                      email: event.target.value
                    })
                  }
                />
              </h5>
            </form>
            <br></br>
            <h5>{showDropIn()}</h5>
            <h5>{showError(data.error)}</h5>
          </div>
          <div className="col-2"></div>
          <div className="col-3">
            <h3>Order Summary</h3>
            <h5>{order.ticketsSelected} Tickets selected</h5>
            <h5>
              Total price ( {order.ticketsSelected} x ${order.ticketPrice} ): $
              {order.purchaseAmount}
            </h5>
            <h5>That's it, no hidden fees!!!</h5>
            <br></br>
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
  }

  if (showPaymentConfirm) {
    purchaseConfirmation = (
      <Aux>
        <h1>Thank you for your purchase</h1>
        <h5>{showSuccess(data.success)}</h5>
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
          <h1>Checkout</h1>
        </div>
        <br></br>

        <h5>{purchaseSelection}</h5>
        <h5>{purchaseConfirmation}</h5>
        <br></br>

        <div style={{ color: "red" }}>
          <h5>FOR OSD EYES ONLY</h5>
          <h6>Tickets selected: {order.ticketsSelected}</h6>
          <h6>Ticket price: {order.ticketPrice}</h6>
          <h6>Purchase amount: {order.purchaseAmount}</h6>
          <h6>Full Name: {order.fullName}</h6>
          <h6>E-mail Address: {order.email}</h6>
        </div>
      </Container>
    </Aux>
  );
};

export default Checkout;
