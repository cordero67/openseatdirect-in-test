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
  // REFACTORED CODE
  // ticket purchase data - NONTOXIC
  const [order, setOrder] = useState({
    eventNum: "",
    eventName: "",
    ticketPrice: 0,
    ticketsSelected: 0,
    purchaseAmount: 0,
    firstName: "",
    lastName: "",
    email: ""
  });

  // REFACTORED CODE
  // DEFINES ALL VIEW CONTROL VARIABLES
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(true);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showPurchaseConfirmation, setShowPurchaseConfirmation] = useState(
    false
  );

  // REFACTORED CODE
  // "RADIO BUTTON" TYPE SHOW ONLY CONTROL FUNCTIONS
  const onlyShowConnectionStatus = () => {
    setShowConnectionStatus(true);
    setShowLoadingSpinner(false);
    setShowPaymentDetails(false);
    setShowPurchaseConfirmation(false);
  };

  const onlyShowLoadingSpinner = () => {
    setShowConnectionStatus(false);
    setShowLoadingSpinner(true);
    setShowPaymentDetails(false);
    setShowPurchaseConfirmation(false);
  };

  const onlyShowPaymentDetails = () => {
    setShowConnectionStatus(false);
    setShowLoadingSpinner(false);
    setShowPaymentDetails(true);
    setShowPurchaseConfirmation(false);
  };

  const onlyShowPurchaseConfirmation = () => {
    setShowConnectionStatus(false);
    setShowLoadingSpinner(false);
    setShowPaymentDetails(false);
    setShowPurchaseConfirmation(true);
  };

  // REFACTORED CODE
  // BRAINTREE INTERFACE VARIABLE
  const [data, setData] = useState({
    success: false,
    message: null,
    clientToken: true,
    error: "",
    instance: {},
    address: "",
    connection: true
  });

  // REFACTORED CODE
  // ORDER DETAILS VARIABLE
  const [transactionDetail, setTransactionDetail] = useState({
    description: "",
    email: "",
    instrumentType: "",
    accountID: "",
    firstName: "",
    lastName: "",
    payerName: "",
    totalAmount: 0,
    transID: ""
  });

  //const [ticketUrl, setTicketUrl] = useState("");

  // REFACTORED CODE
  // downloads "order" information from "localStorage" and
  // requests BrainTree "clientToken" from backend server
  useEffect(() => {
    if (localStorage.getItem("order")) {
      const newOrder = JSON.parse(localStorage.getItem("order"));
      setOrder({
        ...order,
        eventNum: newOrder.eventNum,
        eventName: newOrder.eventName,
        ticketPrice: newOrder.ticketPrice,
        ticketsSelected: newOrder.ticketsSelected,
        purchaseAmount: newOrder.purchaseAmount
      });
      //setTicketUrl(order.ticketUrl);
    }
    //const orderUrl = JSON.parse(localStorage.getItem("order"));
    //setTicketUrl(orderUrl.ticketUrl);
    getExpressToken();
  }, []);

  // REFACTORED CODE
  // ***NEED TO SEND TICKET AMOUNT TO "EventList" AND REGISTER TICKETS PURCHASED
  // clears entire "order" object, removes "order" from "localStorage"
  const purchaseConfirmHandler = () => {
    setOrder({
      eventNum: "",
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

  // REFACTORED CODE
  // resets all state variables back to defualt values
  // removes "order" from "localStorage"
  const cancelOrderHandler = () => {
    setOrder({
      eventNum: "",
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

  // REFACTORED CODE
  // ***STILL A QUESTION AS TO WHAT TO SHOW IF ""res.error" IS RETURNED***
  // CHANGES VIEW CONTROL VARIABLES
  // this represents parts "1" and "2" of the Braintree interaction
  // defines the function that retrieves the Braintree token
  const getExpressToken = () => {
    onlyShowLoadingSpinner();
    getExpressBraintreeClientToken()
      .then(res => {
        if (res.error) {
          setData({ ...data, error: res.error });
          // ***STILL A QUESTION AS TO WHAT TO SHOW IF ""res.error" IS RETURNED***
          // ***"res.error" IS SET AND IS CURRENTLY SHOWN IN "paymentDetails"
          // ***IN "paymentDetails" IT DISPLAYS ERROR BUT STILL SHOWS
          // ***"Contact Information" AND "Order Summmary" SECTIONS
          onlyShowConnectionStatus();
        } else {
          setData({ ...data, clientToken: res.clientToken });
          onlyShowPaymentDetails();
        }
        onlyShowPaymentDetails();
      })
      .catch(err => {
        onlyShowConnectionStatus();
        console.log("getExpressBraintreeClientToken(): ERROR THROWN");
        console.log("err", err);
      });
  };

  // REFACTORED CODE
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
          eventNum: order.eventNum,
          ticketsSelected: order.ticketsSelected,
          amount: order.purchaseAmount,
          firstName: order.firstName,
          lastName: order.lastName,
          email: order.email
        };

        onlyShowLoadingSpinner();
        // sends transaction and payment details to the backend
        processExpressPayment(paymentTicketData)
          .then(response => {
            console.log("order sent");
            console.log(response);
            setData({
              ...data,
              success: response.success
            });

            setTransactionDetail({
              ...transactionDetail,
              description: response.eventTitle,
              email: response.email,
              instrumentType: response.osd_paymentInstrumentType,
              accountID: response.osd_payerAccountId,
              firstName: response.firstName,
              lastName: response.lastName,
              payerName: response.osd_payerName,
              totalAmount: response.bt_trans_amount,
              transID: response.bt_trans_id
            });

            onlyShowPurchaseConfirmation();
            // empty cart and reset "ticketPurchase" object
            purchaseConfirmHandler();
          })
          .catch(error => {
            console.log("processExpressPayment(): ERROR THROWN");
            setData({
              ...data,
              success: false,
              message: error.friendlyMessage
            });
            //data.instance.clearSelectedPaymentMethod();
            onlyShowConnectionStatus();
          });
      })

      // there is a problem with Braintree and cannot return nonce
      .catch(error => {
        console.log("requestPaymentMethod(): ERROR THROWN", error);
        setData({ ...data, success: false });
        //data.instance.clearSelectedPaymentMethod();
        onlyShowConnectionStatus();
      });
  };

  // REFACTORED CODE
  // displays "error" if one exists
  const showError = error => (
    <div style={{ display: error ? "" : "none" }}>{error}</div>
  );

  // REFACTORED CODE
  // displays the "DropIn" or an "empty cart" error message
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

  // REFACTORED CODE
  const showSuccess = success => {
    if (success) {
      return (
        <div className={styles.SubBody}>
          <div style={{ paddingLeft: "30px" }}>
            Thank you {transactionDetail.firstName} {transactionDetail.lastName}{" "}
            for your order, your payment was received.<br></br>
            <br></br>
            Order details:
            <div style={{ paddingLeft: "30px" }}>
              Event Title: {transactionDetail.description}
              <br></br>
              Total Amount($): {transactionDetail.totalAmount}
              <br></br>
              {transactionDetail.instrumentType}
              <br></br>
              {transactionDetail.accountID}
              <br></br>
              {transactionDetail.payerName}
              <br></br>
              Transaction ID: {transactionDetail.transID}
            </div>
            <br></br>A confirmation email with your order details will be sent
            to {transactionDetail.email} shortly.
            <br></br>
            <br></br>
            If this e-mail is incorrect, please contact Dahday immediately.
            <br></br>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <span style={{ color: "red" }}>
            WE NEED TO DECIDE ON AN ERROR MESSAGE!!!
          </span>
        </div>
      );
    }
  };

  // REFACTORED CODE
  // determines what "contact information" has been filled out by the ticket buyer
  let fullNameProvided = order.firstName !== "" && order.lastName !== "";
  const regsuper = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let validEmail = regsuper.test(order.email);
  let detailsMinimal = fullNameProvided && regsuper.test(order.email);
  let detailsMessage = null;

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

  // REFACTORED CODE
  // determines "submitButton" functionality/formatting
  let submitButton;

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

  // REFACTORED CODE
  // DEFINES VARIABELS THAT DEFINE RENDERED ITEMS
  let connectionStatus = null;
  let loadingSpinner = null;
  let paymentDetails = null;
  let purchaseConfirmation = null;

  // REFACTORED CODE
  // CONTROLS "connectionStatus" VIEW
  if (showConnectionStatus && data.message === null) {
    connectionStatus = (
      <Aux>
        <div>
          <h4>Connection error, please try back later.</h4>
          <br></br>
        </div>
      </Aux>
    );
  } else if (showConnectionStatus && data.message !== null) {
    connectionStatus = (
      <Aux>
        <div>Your credit is shit!!!</div>
      </Aux>
    );
  }

  // REFACTORED CODE
  // CONTROLS "loadingSpinner" VIEW
  if (showLoadingSpinner) {
    loadingSpinner = <Spinner></Spinner>;
  } /*else {
    loadingSpinner = <div>loadingSpinner - else: LOADING IS COMPLETE!!!</div>;
  }*/

  // REFACTORED CODE
  // CONTROLS "paymentDetails" VIEW
  if (showPaymentDetails) {
    paymentDetails = (
      <Aux>
        <div className={styles.GridMain}>
          <div className={styles.GridMainItemLeft}>
            <span className={styles.SubSectionHeader}>Contact Information</span>

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

          <div className={styles.GridMainItemRight}>
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
            <div className={styles.GridButtonsLarge}>
              <div className={styles.GridButtonsLargeLeft}>
                <button className={styles.ButtonWhiteLarge}>
                  <Link to="/ev">Change Order</Link>
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

  // REFACTORED CODE
  // CONTROLS "purchaseConfirmation" VIEW
  if (showPurchaseConfirmation) {
    purchaseConfirmation = (
      <Aux>
        <span className={styles.SubSectionHeader}>Order Status</span>
        <div style={{ paddingTop: "20px" }}>{showSuccess(data.success)}</div>
      </Aux>
    );
  }

  // REFACTORED CODE
  return (
    <Aux>
      <div className={styles.ContentBoxLarge}>
        <div className={styles.SectionHeader}>Checkout</div>
        <br></br>
        <br></br>
        <div className={styles.Body}>
          {connectionStatus}
          {loadingSpinner}
          {paymentDetails}
          {purchaseConfirmation}
        </div>
      </div>
    </Aux>
  );
};
export default Checkout;
