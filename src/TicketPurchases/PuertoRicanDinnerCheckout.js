import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Container } from "react-bootstrap";
import DropIn from "braintree-web-drop-in-react";

import {
  getExpressBraintreeClientToken,
  processExpressPayment
} from "./apiCore";
import Spinner from "../components/UI/Spinner/Spinner";
import Aux from "../hoc/Auxiliary/Auxiliary";

const Checkout = props => {
  // ticket purchase data
  const [order, setOrder] = useState({
    eventID: "",
    eventName: "",
    ticketPrice: 0,
    ticketsSelected: 0,
    purchaseAmount: 0,
    firstName: "",
    lastName: "",
    email: ""
  });

  // variables that control view options
  const [loading, setLoading] = useState(true);
  const [showTicketPayment, setShowTicketPayment] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);

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
        setLoading(false);
        setShowTicketPayment(true);
      }
    });
  };

  // calls for the Braintree token upon the loading of this component
  // copies ticket order details from "localStorage"
  useEffect(() => {
    if (localStorage.getItem("order")) {
      const newOrder = JSON.parse(localStorage.getItem("order"));
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

  // clears entire "order" object, removes "order" from "localStorage"
  // shows the "Payment Confirm" window
  // NEED TO SEND TICKET AMOUNT TO "EventList" AND REGISTER TICKETS PURCHASED
  const purchaseConfirmHandler = () => {
    setOrder({
      eventID: "",
      eventName: "",
      ticketPrice: 0,
      ticketsSelected: 0,
      purchaseAmount: 0,
      firstName: "",
      lastName: "",
      email: ""
    });
    setShowTicketPayment(false);
    setLoading(false);
    setShowPaymentConfirm(true);
    localStorage.removeItem("order");
  };

  // resets all state variables back to defualt values
  // removes "order" from "localStorage"
  const cancelOrderHandler = () => {
    setOrder({
      eventID: "",
      eventName: "",
      ticketPrice: 0,
      ticketsSelected: 0,
      purchaseAmount: 0,
      firstName: "",
      lastName: "",
      email: ""
    });
    localStorage.removeItem("order");
  };

  // requests "nonce" from BrainTree
  // sends payment and order information to the backend
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
        const paymentTicketData = {
          paymentMethodNonce: nonce,
          eventID: order.eventID,
          ticketsSelected: order.ticketsSelected,
          amount: order.purchaseAmount,
          firstName: order.firstName,
          lastName: order.lastName,
          email: order.email
        };

        // sends transaction and payment details to the backend
        processExpressPayment(paymentTicketData)
          .then(response => {
            console.log(response);
            setData({ ...data, success: response.success });
            // emptys the cart and resets
            purchaseConfirmHandler();
          })
          .catch(error => console.log(error));
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
      <h2>Payment received, thank you for your order. </h2>
      <h2>Confirmation email with order details will be sent shortly.</h2>
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
          <h5>Empty Order, please return to ticket selection page.</h5>
        </div>
      )}
    </div>
  );

  let spinnerView = null;
  let purchaseSelection = null;
  let purchaseConfirmation = null;

  if (loading) {
    spinnerView = (
      <Aux>
        <Spinner></Spinner>
      </Aux>
    );
  }

  // Ticket Purchase Window details
  if (showTicketPayment) {
    purchaseSelection = (
      <Aux>
        <div className="row">
          <div className="col-7">
            <h3>Contact Information</h3>
            <form>
              <div className="row">
                <div className="col-6">
                  <h5>
                    <input
                      type="text"
                      name="firstName"
                      value={order.firstName}
                      placeholder="First Name*"
                      required
                      onChange={event =>
                        setOrder({
                          ...order,
                          firstName: event.target.value
                        })
                      }
                    />
                  </h5>
                </div>
                <div className="col-6">
                  <h5>
                    <input
                      type="text"
                      name="lastName"
                      value={order.lastName}
                      placeholder="Last Name*"
                      required
                      onChange={event =>
                        setOrder({
                          ...order,
                          lastName: event.target.value
                        })
                      }
                    />
                  </h5>
                </div>
              </div>
              <br></br>
              <row>
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
              </row>
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
            <br></br>
            <h6>
              <button>
                <Link to="/dahday-puertoricandinner-tickets">Modify Order</Link>
              </button>
            </h6>
            <br></br>
            <h6>
              <button onClick={cancelOrderHandler}>
                <a href="https://www.dahday.com/">Cancel Order</a>
              </button>
            </h6>
          </div>
        </div>
      </Aux>
    );
  }

  if (showPaymentConfirm) {
    purchaseConfirmation = (
      <Aux>
        <h3>Order Confirmation</h3>
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

        <h5>{spinnerView}</h5>
        <h5>{purchaseSelection}</h5>
        <h5>{purchaseConfirmation}</h5>
        <br></br>
      </Container>
    </Aux>
  );
};

export default Checkout;

/*
        <div style={{ color: "red" }}>
            <h5>FOR OSD EYES ONLY</h5>
            <h6>Tickets selected: {order.ticketsSelected}</h6>
            <h6>Ticket price: {order.ticketPrice}</h6>
            <h6>Purchase amount: {order.purchaseAmount}</h6>
            <h6>First Name: {order.firstName}</h6>
            <h6>Last Name: {order.lastName}</h6>
            <h6>E-mail Address: {order.email}</h6>
        </div>
*/
