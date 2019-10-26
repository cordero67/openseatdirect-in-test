import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Col } from "react-bootstrap";
import DropIn from "braintree-web-drop-in-react";

import {
  getExpressBraintreeClientToken,
  processExpressPayment
} from "./apiCore";
import Spinner from "../components/UI/Spinner/Spinner";
import Aux from "../hoc/Auxiliary/Auxiliary";
import styles from "./TicketPurchases.module.css";

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

  // view control variables
  const [loading, setLoading] = useState(true);
  const [showTicketPayment, setShowTicketPayment] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);

  // Braintree interface variable
  const [data, setData] = useState({
    success: false,
    clientToken: true,
    error: "",
    instance: {},
    address: "",
    connection: true
  });

  /*
        if (data === undefined) {
        setData({ ...data, connection: false });
        setLoading(false);
      }
*/

  // defines the function that retrieves the Braintree token
  // this represents parts "1" and "2" of the Braintree interaction
  const getExpressToken = () => {
    getExpressBraintreeClientToken().then(data => {
      setLoading(false);
      if (data.error) {
        setData({ ...data, error: data.error });
      } else {
        setData({ ...data, clientToken: data.clientToken });
        // setData({ clientToken: data.clientToken });
        setShowTicketPayment(true);
      }
    });
  };

  const connectionStatus = () => (
    <div>
      {data.error === true ? (
        <div>System error, please try later.</div>
      ) : (
        <div></div>
      )}
    </div>
  );

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
    data.instance
      .requestPaymentMethod()
      .then(data => {
        console.log(data);
        nonce = data.nonce;
        //console.log(
        //  "send nonce and total to process: ",
        //  nonce,
        //  order.purchaseAmount
        //);
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
    <div style={{ display: success ? "" : "none" }}>
      <div className={styles.SubBody}>
        <div style={{ paddingLeft: "30px" }}>
          Thank you for your order, your payment was received.<br></br>
          <br></br>
          Order details:
          <div style={{ paddingLeft: "30px" }}>
            Description:
            <br></br>
            Total Amount($):
            <br></br>
            Transaction ID:
          </div>
          <br></br>A confirmation email with your order details will be sent to
          bobsmith@xmail.com shortly.
          <br></br>
          <br></br>
          If this e-mail is incorrect, please contact Dahday immediately.
          <br></br>
        </div>
      </div>
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
          {submitButton}
        </div>
      ) : (
        <div>
          <span style={{ color: "red", fontSize: "16px" }}>
            Your order is empty, please return to ticket selection page.
          </span>
        </div>
      )}
    </div>
  );

  // determines what "contact information" has been filled out by the ticket buyer
  let fullNameProvided = order.firstName !== "" && order.lastName !== "";
  const regsuper = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let validEmail = regsuper.test(order.email);
  let detailsMinimal = fullNameProvided && regsuper.test(order.email);
  let detailsMessage = null;

  if (!validEmail && fullNameProvided) {
    detailsMessage = (
      <span style={{ color: "red", fontSize: "14px" }}>
        * A VALID email address is required to ensure delivery of your tickets.
      </span>
    );
  } else if (validEmail && !fullNameProvided) {
    detailsMessage = (
      <span style={{ color: "red", fontSize: "14px" }}>
        * Your full name is required to ensure delivery of your tickets.
      </span>
    );
  } else if (!detailsMinimal) {
    detailsMessage = (
      <span style={{ color: "red", fontSize: "14px" }}>
        * Your full name and a VALID email address are required to ensure
        delivery of your tickets.
      </span>
    );
  } else {
    detailsMessage = (
      <span style={{ color: "blue", fontSize: "16px" }}>
        Thank you for providing your information.
      </span>
    );
  }

  let submitButton = null;
  if (detailsMinimal) {
    submitButton = (
      <button
        onClick={expressBuy}
        className="btn btn-success"
        disabled={!detailsMinimal}
        className={styles.ButtonGreen}
      >
        Submit Payment
      </button>
    );
  } else {
    submitButton = (
      <button
        onClick={expressBuy}
        className="btn btn-success"
        disabled={!detailsMinimal}
        className={styles.ButtonGrey}
      >
        Submit Payment
      </button>
    );
  }

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
          <div style={{ paddingTop: "20px" }} className="col-6">
            <span className={styles.SubSectionHeader}>Contact Information</span>
            <br></br>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridFirstName">
                <Form.Control
                  type="text"
                  name="firstName"
                  required
                  placeholder="First Name*"
                  value={order.firstName}
                  onChange={event =>
                    setOrder({
                      ...order,
                      firstName: event.target.value
                    })
                  }
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridLastName">
                <Form.Control
                  type="text"
                  name="lastName"
                  required
                  placeholder="Last Name*"
                  value={order.lastName}
                  onChange={event =>
                    setOrder({
                      ...order,
                      lastName: event.target.value
                    })
                  }
                />
              </Form.Group>
            </Form.Row>
            <Form.Group controlId="formGridEmail">
              <Form.Control
                type="email"
                name="email"
                required
                placeholder="Email Address*"
                value={order.email}
                onChange={event =>
                  setOrder({
                    ...order,
                    email: event.target.value
                  })
                }
              />
              {detailsMessage}
            </Form.Group>

            <span className={styles.SubSectionHeader}>Payment Information</span>
            {showDropIn()}
            {showError(data.error)}
          </div>
          <div className="col-1"></div>
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
                  {order.ticketsSelected} x {order.eventName}
                </div>
                <div
                  style={{
                    textAlign: "right",
                    paddingRight: "25px"
                  }}
                  className="col-2"
                >
                  ${order.purchaseAmount}
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
                  ${order.purchaseAmount}
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
                  ${order.purchaseAmount}
                </div>
              </div>
            </div>
            <br></br>
            <br></br>

            <div className="row">
              <div className="col-6">
                <button className={styles.ButtonWhite}>
                  <Link to="/dahday-puertoricandinner-tickets">
                    Modify Order
                  </Link>
                </button>
              </div>
              <div className="col-6">
                <button
                  onClick={cancelOrderHandler}
                  className={styles.ButtonWhite}
                >
                  <a href="https://www.dahday.com/">Cancel Order</a>
                </button>
              </div>
              <br></br>
              <br></br>
            </div>
          </div>
        </div>
      </Aux>
    );
  }
  if (showPaymentConfirm) {
    purchaseConfirmation = (
      <Aux>
        <span className={styles.SubSectionHeader}>Order Status</span>
        <div style={{ paddingTop: "20px" }}>{showSuccess(data.success)}</div>
      </Aux>
    );
  }
  return (
    <Aux>
      <div className={styles.ContentBoxLarge}>
        <div className={styles.SectionHeader}>
          <h1>Checkout</h1>
        </div>
        <br></br>
        <br></br>
        <div className={styles.Body}>
          {connectionStatus()}
          {spinnerView}
          {purchaseSelection}
          {purchaseConfirmation}
        </div>
      </div>
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
