import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Col } from "react-bootstrap";
import DropIn from "braintree-web-drop-in-react";

import CocinaCandelaLogo from "../assets/Cocina_Candela/cocina-candela-large.jpg";

import { getDateStr } from "../components/formuals";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faShoppingCart,
  faChevronUp,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";

import {
  getExpressBraintreeClientToken,
  processExpressPayment
} from "./apiCore";
import Spinner from "../components/UI/Spinner/Spinner";
import Aux from "../hoc/Auxiliary/Auxiliary";
import styles from "./Order.module.css";

// defines the ticket order populated from "localStorage"
let ticketOrder;

const Checkout = props => {
  // REFACTORED CODE
  // defines purchase order to be sent to server
  const [contactInformation, setContactInformation] = useState({
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

  // **TRANSFERRED CODE**
  const [showDoublePane, setShowDoublePane] = useState(false);

  // **TRANSFERRED CODE**
  const [showOrderSummaryOnly, setShowOrderSummaryOnly] = useState(false);

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
  const [braintreeData, setBraintreeData] = useState({
    success: false,
    message: null,
    clientToken: true,
    error: "",
    instance: {},
    address: "",
    connection: true
  });

  // REFACTORED CODE
  // stores payment receipt data received from server
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

  // REFACTORED CODE
  // downloads "order" information from "localStorage" and
  // requests BrainTree "clientToken" from backend server
  useEffect(() => {
    if (localStorage.getItem("cart")) {
      ticketOrder = JSON.parse(localStorage.getItem("cart"));
      console.log("ticketOrder: ", ticketOrder);
    }
    // **TRANSFERRED CODE**
    // determines initial window width and then
    // determines a one or two pane display
    if (window.innerWidth < 790) {
      setShowDoublePane(false);
    } else {
      setShowDoublePane(true);
    }
    getExpressToken();
  }, []);

  // **TRANSFERRED CODE**
  window.onresize = function(event) {
    // dynamically determines window width and then
    // determines a one or two pane display
    if (window.innerWidth < 790) {
      setShowDoublePane(false);
    } else {
      setShowDoublePane(true);
    }
  };

  // REFACTORED CODE
  // ***NEED TO SEND TICKET AMOUNT TO "EventList" AND REGISTER TICKETS PURCHASED
  // clears entire "cart" object, removes "cart" from "localStorage"
  const purchaseConfirmHandler = () => {
    ticketOrder({});
    localStorage.removeItem("cart");
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
          setBraintreeData({ ...braintreeData, error: res.error });
          // ***STILL A QUESTION AS TO WHAT TO SHOW IF ""res.error" IS RETURNED***
          // ***"res.error" IS SET AND IS CURRENTLY SHOWN IN "paymentPane"
          // ***IN "paymentPane" IT DISPLAYS ERROR BUT STILL SHOWS
          // ***"Contact Information" AND "Order Summmary" SECTIONS
          onlyShowConnectionStatus();
        } else {
          setBraintreeData({ ...braintreeData, clientToken: res.clientToken });
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
    braintreeData.instance
      .requestPaymentMethod()
      .then(res => {
        console.log("success in step 3");
        console.log(res);
        nonce = res.nonce;
        const paymentData = {
          paymentMethodNonce: nonce,
          firstName: contactInformation.firstName,
          lastName: contactInformation.lastName,
          email: contactInformation.email,
          totalPurchaseAmount: ticketOrder.totalPurchaseAmount,
          tickets: ticketOrder.tickets
        };

        onlyShowLoadingSpinner();
        // sends transaction and payment details to the backend
        processExpressPayment(paymentData)
          .then(response => {
            console.log("order sent");
            console.log(response);
            setBraintreeData({
              ...braintreeData,
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
            // empty cart and reset "ticketOrder" object
            purchaseConfirmHandler();
          })
          .catch(error => {
            console.log("processExpressPayment(): ERROR THROWN");
            setBraintreeData({
              ...braintreeData,
              success: false,
              message: error.friendlyMessage
            });
            //braintreeData.instance.clearSelectedPaymentMethod();
            onlyShowConnectionStatus();
          });
      })

      // there is a problem with Braintree and cannot return nonce
      .catch(error => {
        console.log("requestPaymentMethod(): ERROR THROWN", error);
        setBraintreeData({ ...braintreeData, success: false });
        //braintreeData.instance.clearSelectedPaymentMethod();
        onlyShowConnectionStatus();
      });
  };

  // determines whether or not to display the purchase amount
  // "showDoublePane" must be false and "tickets.selected" must be > 0
  // **TRANSFERRED CODE**
  const totalAmount = show => {
    if (!showLoadingSpinner && !show && ticketOrder.totalPurchaseAmount > 0) {
      return <div>${ticketOrder.totalPurchaseAmount}</div>;
    } else {
      return null;
    }
  };

  // determines whether or not to display the cart and arrow
  // "showDoublePane" must be false
  // **TRANSFERRED CODE**
  const cartLink = show => {
    if (!showLoadingSpinner && !show) {
      return (
        <div>
          <FontAwesomeIcon
            onClick={switchShowOrderSummary}
            className={styles.faShoppingCart}
            icon={faShoppingCart}
          />

          {showOrderSummaryOnly ? (
            <FontAwesomeIcon
              onClick={switchShowOrderSummary}
              className={styles.faChevronUp}
              icon={faChevronUp}
            />
          ) : (
            <FontAwesomeIcon
              onClick={switchShowOrderSummary}
              className={styles.faChevronDown}
              icon={faChevronDown}
            />
          )}
        </div>
      );
    } else {
      return null;
    }
  };

  // **TRANSFERRED CODE**
  // toggles between "order pane" views
  const switchShowOrderSummary = event => {
    if (showOrderSummaryOnly) {
      setShowOrderSummaryOnly(false);
    } else {
      setShowOrderSummaryOnly(true);
    }
  };

  // **TRANSFERRED CODE**
  // NEED TO STYLE
  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  let checkoutButton = null;
  if (!showLoadingSpinner && ticketOrder.totalPurchaseAmount > 0) {
    checkoutButton = (
      <button
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
        <Link>Place OrderNOW</Link>
      </button>
    );
  } else if (!showLoadingSpinner && ticketOrder.totalPurchaseAmount <= 0) {
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
        Place OrderNOW
      </button>
    );
  } else checkoutButton = null;

  // **TRANSFERRED CODE**
  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  let orderSummary;
  // FULLY STYLED
  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  if (!showLoadingSpinner && ticketOrder.totalPurchaseAmount > 0) {
    orderSummary = (
      <Aux>
        <div style={{ fontWeight: "600" }}>Order Summary</div>
        <br></br>
        {ticketOrder.tickets.map(item => {
          if (item.ticketsSelected > 0) {
            return (
              <Aux>
                <div className={styles.RightGrid}>
                  <div style={{ fontWeight: "400" }}>
                    {item.ticketsSelected} X {item.ticketName}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    ${item.ticketsSelected * item.ticketPrice}{" "}
                  </div>
                </div>
              </Aux>
            );
          }
        })}

        <hr style={{ border: "1px solid#B2B2B2" }} />
        <div className={styles.RightGrid}>
          <div style={{ fontWeight: "600" }}>Total</div>
          <div style={{ textAlign: "right" }}>
            ${ticketOrder.totalPurchaseAmount}
          </div>
        </div>
        <br></br>
      </Aux>
    );
  } else if (!showLoadingSpinner && ticketOrder.totalPurchaseAmount <= 0) {
    orderSummary = (
      <div
        style={{
          color: "grey",
          position: "relative",
          float: "left",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
      >
        <FontAwesomeIcon
          className={styles.faShoppingCart}
          icon={faShoppingCart}
        />
      </div>
    );
  } else {
    orderSummary = null;
  }

  // REFACTORED CODE
  // displays "error" if one exists
  const showError = error => (
    <div style={{ display: error ? "" : "none" }}>{error}</div>
  );

  // REFACTORED CODE
  // displays the "DropIn" or an "empty cart" error message
  const showDropIn = () => (
    <div onBlur={() => setBraintreeData({ ...braintreeData, error: "" })}>
      {braintreeData.clientToken !== null &&
      ticketOrder.totalPurchaseAmount > 0 ? (
        <div>
          {/*this establishes a Braintree connection in order to complete
          part "3" of the interaction*/}
          <DropIn
            options={{
              authorization: braintreeData.clientToken,
              paypal: {
                flow: "vault"
              },
              venmo: {}
            }}
            onInstance={instance => (braintreeData.instance = instance)}
          />
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
  let fullNameProvided =
    contactInformation.firstName !== "" && contactInformation.lastName !== "";
  const regsuper = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let validEmail = regsuper.test(contactInformation.email);
  let detailsMinimal =
    fullNameProvided && regsuper.test(contactInformation.email);
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
  // determines "placeOrderButton" functionality/formatting
  let placeOrderButton;

  if (detailsMinimal) {
    placeOrderButton = (
      <button
        onClick={expressBuy}
        disabled={!detailsMinimal}
        className={styles.ButtonGreenLarge}
      >
        Place Order
      </button>
    );
  } else {
    placeOrderButton = (
      <button
        onClick={expressBuy}
        disabled={!detailsMinimal}
        className={styles.ButtonGreyLarge}
      >
        Place Order
      </button>
    );
  }
  // **TRANSFERRED CODE**
  let orderPane;
  if (showDoublePane) {
    orderPane = (
      <div>
        <div className={styles.ImageBox}>
          <img
            className={styles.Image}
            src={CocinaCandelaLogo}
            alt="Cocina Candela Logo"
          />
        </div>
        <div className={styles.OrderSummary}>{orderSummary}</div>
      </div>
    );
  } else {
    orderPane = (
      <Aux>
        <div>
          <div className={styles.OrderSummaryAlt}>{orderSummary}</div>
        </div>
        <div className={styles.EventFooter}>
          <div
            style={{
              paddingTop: "10px",
              fontWeight: "600"
            }}
          >
            {cartLink(showDoublePane)}
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
            {totalAmount(showDoublePane)}
          </div>
          <div style={{ textAlign: "right" }}>{placeOrderButton}</div>
        </div>
      </Aux>
    );
  }

  // REFACTORED CODE
  // DEFINES VARIABELS THAT DEFINE RENDERED ITEMS
  let connectionStatus = null;
  let loadingSpinner = null;
  let paymentPane = null;
  let purchaseConfirmation = null;

  // REFACTORED CODE
  // CONTROLS "connectionStatus" VIEW
  if (showConnectionStatus && braintreeData.message === null) {
    connectionStatus = (
      <Aux>
        <div>
          <h4>Connection error, please try back later.</h4>
          <br></br>
        </div>
      </Aux>
    );
  } else if (showConnectionStatus && braintreeData.message !== null) {
    connectionStatus = (
      <Aux>
        <div>Your credit is shit!!!</div>
      </Aux>
    );
  } else {
    connectionStatus = null;
  }

  // REFACTORED CODE
  // CONTROLS "loadingSpinner" VIEW
  if (showLoadingSpinner) {
    loadingSpinner = (
      <div className={styles.Spinner}>
        <Spinner></Spinner>;
      </div>
    );
  } else {
    loadingSpinner = null;
  }

  // REFACTORED CODE
  // CONTROLS "paymentPane" VIEW
  if (showPaymentDetails) {
    paymentPane = (
      <Aux>
        <div className={styles.MainItemLeft}>
          <div className={styles.EventHeader}>
            <div
              style={{
                fontSize: "1.125rem",
                fontWeight: "600"
              }}
            >
              <span
                style={{
                  textOverflow: "ellipsis"
                }}
              >
                {ticketOrder.eventName}
              </span>
            </div>
            <div
              style={{
                fontSize: "1.0rem",
                fontWeight: "400"
              }}
            >
              {ticketOrder.startDateTime}
            </div>
          </div>
          <div className={styles.EventTicketSection}>
            <span className={styles.TicketType}>Contact Information</span>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridFirstName">
                <Form.Control
                  type="text"
                  name="firstName"
                  required
                  placeholder="First Name*"
                  value={contactInformation.firstName}
                  onChange={event =>
                    setContactInformation({
                      ...contactInformation,
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
                  value={contactInformation.lastName}
                  onChange={event =>
                    setContactInformation({
                      ...contactInformation,
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
                value={contactInformation.email}
                onChange={event =>
                  setContactInformation({
                    ...contactInformation,
                    email: event.target.value
                  })
                }
              />
              {detailsMessage}
            </Form.Group>
            <span className={styles.TicketType}>Payment Information</span>
            {showDropIn()}
            {showError(braintreeData.error)}
          </div>
          <div className={styles.EventFooter}>
            <div
              style={{
                paddingTop: "8px",
                fontSize: "20px",
                fontWeight: "600"
              }}
            >
              {cartLink(showDoublePane)}
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
              {totalAmount(showDoublePane)}
            </div>
            <div style={{ textAlign: "right" }}>{placeOrderButton}</div>
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
        <div style={{ paddingTop: "20px" }}>
          {showSuccess(braintreeData.success)}
        </div>
      </Aux>
    );
  } else {
    purchaseConfirmation = null;
  }

  // **TRANSFERRED CODE**
  let mainDisplay = null;
  if (showPaymentDetails) {
    if (showDoublePane) {
      // REMOVED "{ticketPane}" FROM "<Aux>" BODY
      mainDisplay = (
        <Aux>
          <div className={styles.MainGrid}>
            {paymentPane}
            {orderPane}
          </div>
        </Aux>
      );
    } else if (!showOrderSummaryOnly) {
      // REMOVED "{ticketPane}" FROM "<Aux>" BODY
      mainDisplay = (
        <Aux>
          <div className={styles.MainGrid}>{paymentPane}</div>
        </Aux>
      );
    } else {
      mainDisplay = (
        <Aux>
          <div className={styles.MainGrid}>{orderPane}</div>
        </Aux>
      );
    }
  } else {
    mainDisplay = null;
  }

  // REFACTORED CODE
  return (
    <Aux>
      <div className={styles.MainContainer}>
        {loadingSpinner}
        {connectionStatus}
        {mainDisplay}
        {purchaseConfirmation}
      </div>
    </Aux>
  );
};
export default Checkout;
