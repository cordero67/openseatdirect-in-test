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
import styles from "./Purchases.module.css";

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
    friendlyMessage: "",
    dropInSuccess: true,
    clientToken: true,
    error: "",
    instance: {},
    address: "",
    connection: true
  });

  // defines the function that retrieves the Braintree token
  // this represents parts "1" and "2" of the Braintree interaction
  const getExpressToken = () => {
    getExpressBraintreeClientToken()
      .then(res => {
        setLoading(false);
        console.log("before if (res.error) statement");
        if (res.error) {
          setData({ ...data, error: res.error });
        } else {
          setData({ ...data, clientToken: res.clientToken });
          setShowTicketPayment(true);
        }
      })
      .catch(err2 => {
        console.log("PARENT ERROR THROWN");
        console.log("err", err2);
        setData({ ...data, dropInSuccess: false });
        setLoading(false);
      });
  };

  // FULLY STYLED
  const connectionStatus = () => (
    <div className={styles.Body}>
      {data.dropInSuccess === false ? (
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
        //purchaseAmount: 2000
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
      .then(res => {
        console.log("success in step 3");
        console.log(res);
        nonce = res.nonce;
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
            console.log("order sent");
            console.log(response);
            setData({
              ...data,
              success: response.success,
              friendlyMessage: response.friendlyMessage
            });
            // empties the cart and resets "ticketPurchase" object
            purchaseConfirmHandler();
          })
          .catch(error => {
            console.log("Error in expressExpressPayment", error);
            data.instance.clearSelectedPaymentMethod();
          });
      })

      // there is a problem with Braintree and cannot return nonce
      .catch(error => {
        console.log("dropin error: ", error);
        setData({ ...data, success: false });
        setLoading(false);
      });
  };

  // FULLY SYTLED
  const showError = error => (
    <div className={styles.AlertText}>
      <div style={{ display: error ? "" : "none" }}>{error}</div>
    </div>
  );

  // FULLY SYTLED
  const showSuccess = success => {
    if (success) {
      return (
        <div className={styles.Body}>
          <div>Backend Responce: {data.friendlyMessage}</div>
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
            <br></br>A confirmation email with your order details will be sent
            to bobsmith@xmail.com shortly.
            <br></br>
            <br></br>
            If this e-mail is incorrect, please contact Dahday immediately.
            <br></br>
          </div>
        </div>
      );
    } else {
      return <div>Backend Responce: {data.friendlyMessage}</div>;
    }
  };

  // FULLY STYLED
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
          <span className={styles.AlertText}>
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

  // FULLY STYLED
  if (!validEmail && fullNameProvided) {
    detailsMessage = (
      <span className={styles.AlertTextSmall}>
        * A VALID email address is required to ensure delivery of your tickets.
      </span>
    );
  } else if (validEmail && !fullNameProvided) {
    detailsMessage = (
      <span className={styles.AlertTextSmall}>
        * Your full name is required to ensure delivery of your tickets.
      </span>
    );
  } else if (!detailsMinimal) {
    detailsMessage = (
      <span className={styles.AlertTextSmall}>
        * Full name and VALID email address are required to ensure delivery of
        your tickets.
      </span>
    );
  } else {
    detailsMessage = (
      <span className={styles.SuccessTextSmall}>
        Thank you for providing your information.
      </span>
    );
  }

  let submitButton;

  // FULLY STYLED
  if (detailsMinimal) {
    submitButton = (
      <button
        onClick={expressBuy}
        disabled={!detailsMinimal}
        className={styles.ButtonGreenLarge}
      >
        Submit Payment
      </button>
    );
  } else {
    submitButton = (
      <button
        onClick={expressBuy}
        disabled={!detailsMinimal}
        className={styles.ButtonGreyLarge}
      >
        Submit Payment
      </button>
    );
  }

  let spinnerView = null;
  let purchaseSelection = null;
  let purchaseConfirmation = null;

  // FULLY STYLED
  if (loading) {
    spinnerView = (
      <Aux>
        <Spinner></Spinner>
      </Aux>
    );
  }

  // FULLY STYLED EXCEPT FOR:
  //  {showDropIn()}
  //  {showError(data.error)}
  // Ticket Purchase Window details
  if (showTicketPayment) {
    purchaseSelection = (
      <Aux>
        <div className={styles.GridMain}>
          <div className={styles.GridMainItemLeft}>
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
            <span className={styles.Body}>{showDropIn()}</span>
            <span className={styles.Body}>{showError(data.error)}</span>
          </div>

          <div className={styles.GridMainItemRight}>
            <span className={styles.SubSectionHeader}>Order Summary</span>
            <br></br>
            <div className={styles.SubBody}>
              <div className={styles.GridRight}>
                <div className={styles.GridRightItemLeft}>
                  {order.ticketsSelected} x {order.eventName}
                </div>
                <div className={styles.GridRightItemRight}>
                  ${order.purchaseAmount}
                </div>
              </div>
              <hr style={{ border: "1px solid#C0C0C0" }} />
              <div className={styles.GridRight}>
                <div className={styles.GridRightItemLeft}>Sub-Total</div>
                <div className={styles.GridRightItemRight}>
                  ${order.purchaseAmount}
                </div>
              </div>
              <div className={styles.GridRight}>
                <div className={styles.GridRightItemLeft}>Processing fees:</div>
                <div className={styles.GridRightItemRight}>$0</div>
              </div>
              <hr style={{ border: "1px solid#C0C0C0" }} />
              <div className={styles.GridRight}>
                <div className={styles.GridRightItemLeft}>Total</div>
                <div className={styles.GridRightItemRight}>
                  ${order.purchaseAmount}
                </div>
              </div>
            </div>
            <br></br>
            <div className={styles.GridButtonsLarge}>
              <div className={styles.GridButtonsLargeLeft}>
                <button className={styles.ButtonWhiteLarge}>
                  <Link to="/dahday-tickets">Change Order</Link>
                </button>
              </div>
              <div className={styles.GridButtonsLargeRight}>
                <button
                  onClick={cancelOrderHandler}
                  className={styles.ButtonWhiteLarge}
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

  // FULLY STYLED
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
        <div className={styles.SectionHeader}>Checkout</div>
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
