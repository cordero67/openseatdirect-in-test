import React, { useState, useEffect } from "react";
import { Form, Col } from "react-bootstrap";
// TO BE MOVED TO "apiCore"
import { API } from "../config";

import { PayPalButton } from "react-paypal-button-v2";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faChevronUp,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";

import {
  MainContainerStyling,
  MainGridStyling,
  EventTicketSectionStyling,
  OrderSummarySectionStyling,
  OrderSummarySectionAltStyling
} from "./Styling";
import { expressPaymentPreOrder1, expressPaymentOnSuccess } from "./apiCore";
import Spinner from "../components/UI/Spinner/Spinner";
import Aux from "../hoc/Auxiliary/Auxiliary";
import styles from "./Order.module.css";

// defines the ticket order populated from "localStorage"
let ticketOrder = {};

let MainContainer = {};
let MainGrid = {};
let EventTicketSection = {};
let OrderSummarySection = {};
let OrderSummarySectionAlt = {};

// defines an event's image
let eventLogo = "";

const Checkout = props => {
  // defines styling variables
  const [isRestyling, setIsRestyling] = useState(false);

  // defines contact information to be sent to server
  const [contactInformation, setContactInformation] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  // defines all view control variables
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(true);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showPurchaseConfirmation, setShowPurchaseConfirmation] = useState(
    false
  );
  const [showContactInformation, setShowContactInformation] = useState(true);

  // defines single or double pane view control variables
  const [showDoublePane, setShowDoublePane] = useState(false);
  const [showOrderSummaryOnly, setShowOrderSummaryOnly] = useState(false);

  // control variables viewing functions, assures only one is "true" at a single point in time
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

  // THIS REPLACED "braintreeData" INTERFACE VARIABLE
  // transaction status variable
  const [transactionStatus, setTransactionStatus] = useState({
    success: false,
    message: null,
    error: "",
    connection: true
  });

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

  useEffect(() => {
    // downloads "order" information from "localStorage" and
    if (localStorage.getItem("eventNum")) {
      let event = JSON.parse(localStorage.getItem("eventNum"));
      if (localStorage.getItem(`cart_${event}`)) {
        ticketOrder = JSON.parse(localStorage.getItem(`cart_${event}`));
        console.log("ticketOrder: ", ticketOrder);
      }
      if (localStorage.getItem(`image`)) {
        eventLogo = JSON.parse(localStorage.getItem(`image`));
        console.log("image: ", eventLogo);
      }
    }

    stylingUpdate(window.innerWidth, window.innerHeight);
    onlyShowPaymentDetails();
  }, []);

  window.onresize = function(event) {
    stylingUpdate(window.innerWidth, window.innerHeight);
  };

  const stylingUpdate = (inWidth, inHeight) => {
    setIsRestyling(true);
    if (inWidth < 790) {
      setShowDoublePane(false);
    } else {
      setShowDoublePane(true);
    }

    MainContainer = MainContainerStyling(inWidth, inHeight);
    MainGrid = MainGridStyling(inWidth, inHeight);
    EventTicketSection = EventTicketSectionStyling(inWidth, inHeight);
    OrderSummarySection = OrderSummarySectionStyling(inWidth, inHeight);
    OrderSummarySectionAlt = OrderSummarySectionAltStyling(inWidth, inHeight);
    setIsRestyling(false);
  };

  // clears entire "cart" object, removes "cart" from "localStorage"
  const purchaseConfirmHandler = () => {
    ticketOrder = {};
    let event = JSON.parse(localStorage.getItem("eventNum"));
    localStorage.removeItem(`cart_${event}`);
  };

  // THIS SECTION NEEDS WORK
  // called when "Submit Info" button is clicked
  const payPalPreOrder = () => {
    const preOrderTicketInfo = {
      firstName: contactInformation.firstName,
      lastName: contactInformation.lastName,
      email: contactInformation.email,
      totalPurchaseAmount: ticketOrder.totalPurchaseAmount,
      tickets: ticketOrder.tickets
    };
    console.log("Pre Order 'preOrderTicketInfo' object: ", preOrderTicketInfo);
    // sends pre-order ticket information to the server
    expressPaymentPreOrder1(preOrderTicketInfo);
    // NEED TO ADD ALL THE '.then" AND ".catch" STATEMENTS
    // I"M NOT USING ANY OF THE INFORMATION RETURNED BY THIS CALL
  };

  // THIS SECTION NEEDS WORK
  // called by <PaypalButton> on a successful transaction
  const payPalExpressBuy = (details, data) => {
    const paymentData = {
      paypalOrderDetails: details,
      paypalOrderData: data,
      firstName: contactInformation.firstName,
      lastName: contactInformation.lastName,
      email: contactInformation.email,
      totalPurchaseAmount: ticketOrder.totalPurchaseAmount,
      tickets: ticketOrder.tickets
    };
    onlyShowLoadingSpinner();
    console.log("On Success 'paymentData' object: ", paymentData);
    // sends payment and ticket order information to the server
    expressPaymentOnSuccess(paymentData);
    // NEED TO ADD ALL THE '.then" AND ".catch" STATEMENTS
    // NEED TO ADD CODE TO GRAB TRANSACTION DETAIL FROM SERVER
    /* THIS IS THE CODE THAT NEEDS TO BE ADDED
    // sends payment and order information to the server
      .then(response => {
        console.log("order received");
        console.log("response: ", response);

        console.log("about to setTransactionDetail()");
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
        console.log("about to purchaseConfirmHandler()");
        */
    //onlyShowPurchaseConfirmation();
    /*
        // empty cart and reset "ticketOrder" object
        purchaseConfirmHandler();
        console.log("SUCCESSFULL PURCHASE2");
      })
      .catch(error => {
        console.log("processExpressPayment(): ERROR THROWN!!!!!!!");
        console.log("error.message: ", error.message);

        onlyShowConnectionStatus();
      });
      */
    // THESE STATEMENTS SHOULD BE EVENTUALLY MOVED TO THE ".then/.catch" BLOCK
    // OR MAYBE NOT BECAUSE THESE WILL ONLY GET EXECUTED IF THROUGH
    // THE PAYPAL "onSuccess" PROPERTY
    // NEED TO DECIDE WHAT SUCCESS IS BEING CAPTURED: PAYPALS OR THE SERVERS
    setTransactionStatus({
      ...transactionStatus,
      success: true
    });
    setShowContactInformation(true);
    onlyShowPurchaseConfirmation();
    // empty cart and reset "ticketOrder" object
    purchaseConfirmHandler();
  };

  // shows "Contact Information" form
  const showForm = () => {
    setShowContactInformation(true);
  };

  // shows "Payment Information" section with PayPal Smart buttons
  const hideForm = () => {
    payPalPreOrder();
    setShowContactInformation(false);
  };

  // determines whether or not to display the purchase amount
  const totalAmount = show => {
    if (!showLoadingSpinner && !show && ticketOrder.totalPurchaseAmount > 0) {
      return <div>${ticketOrder.totalPurchaseAmount}</div>;
    } else {
      return null;
    }
  };

  // determines whether or not to display the cart and arrow
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

  // toggles between "order pane" views
  const switchShowOrderSummary = event => {
    if (showOrderSummaryOnly) {
      setShowOrderSummaryOnly(false);
    } else {
      setShowOrderSummaryOnly(true);
    }
  };

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

  // NEED TO DETERMINE HOW TO HANDLE ERROR FOR PAYPAL BUTTONS NOT SHOWING UP
  // "showError" WAS USED TO HANDLE NOT RECEIVING BRAINTREE CLIENT TOKEN
  // THEREFORE THIS MIGHT NOT BE REQUIRED
  // displays "error" if one exists
  const showError = error => (
    <div style={{ display: error ? "" : "none" }}>
      <span style={{ color: "red" }}>{error}</span>
    </div>
  );

  // NEED TO DETERMINE HOW TO HANDLE ERROR FOR PAYPAL BUTTONS NOT SHOWING UP
  // POTENTIALLY NEED TO ADD BACK THE "onBLur" IN <div>
  // THEREFORE THIS MIGHT NOT BE REQUIRED
  // displays the "PayPalButton" or an "empty cart" error message
  const showPayPal = () => (
    // loads PayPal Smart buttons if order exists
    <div>
      {ticketOrder.totalPurchaseAmount > 0 ? (
        <div>
          <PayPalButton
            onButtonReady={() => {
              console.log("Inside the <PayPalButton> 'onButtonReady' property");
            }}
            createOrder={(data, actions) => {
              console.log("Inside the <PayPalButton> 'createOrder' property");
              console.log("createOrder 'data': ", data);
              console.log("createOrder 'actions': ", actions);
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: "USD",
                      value: ticketOrder.totalPurchaseAmount
                    },
                    contents: "stuff"
                  }
                ],
                contents: "other stuff",
                reference_id: "stuff"
                // application_context: {
                //   shipping_preference: "NO_SHIPPING" // default is "GET_FROM_FILE"
                // }
              });
            }}
            onCancel={data => {
              console.log("Inside the <PayPalButton> 'onCancel' property");
              console.log("onCancel 'data': ", data);
              alert("Transaction Cancelled!");
            }}
            /*
            onApprove={(data, actions) => {
              console.log("Inside the <PayPalButton> 'onApprove' property");
              console.log("onApprove 'data': ", data);
              console.log("onApprove 'actions': ", actions);
              // Capture the funds from the transaction
              return actions.order.capture().then(function(details) {
                console.log("Details: ", details);
              });
            }}
            */
            onSuccess={(details, data) => {
              setContactInformation(true);
              console.log("Inside the <PayPalButton> 'onSuccess' property");
              console.log("onSuccess 'details': ", details);
              console.log("onSuccess 'data': ", data);
              alert("Transaction approved!!!" + details.payer.name.given_name);
              setTransactionStatus({
                ...transactionStatus,
                success: true
              });
              payPalExpressBuy(details, data);
            }}
            options={{
              clientId:
                //"AXiGVvamwupWwZuYttercZi4wdLsjYXuS0A_L2h8nBxqRNKlrj6aizAgd4iIN99dMyghE_X1DXsoY_EF",
                //merchantId:
                "AQdWzLz5fiOs9ub51DS_ndZDPJZ7rtpZF1ul4fvErAIsv-lrAuMshmlJLKX5gB5OZtwdyqUHmfuenYgj"
            }}
            catchError={err => {
              setContactInformation(true);
              console.log("Inside the <PayPalButton> 'catchError' property");
              console.log("catchError 'err': ", err);
              setTransactionStatus({
                ...transactionStatus,
                success: false,
                message: null,
                error: err
              });
              onlyShowConnectionStatus();
            }}
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

  // THIS NEEDS WORK
  // THIS IS THE INFORMATION SHOWN UPON A SUCCESSFULL TRANSACTION.
  const showSuccess = success => {
    if (success) {
      return (
        <div className={styles.SubBody}>
          <div>PayPal has processed your order.</div>
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

  /* DELETE ONCE THE CODE RIGHT ABOVE HAS BEEN MODIFIED AS A REPLACEMENT
  // THIS IS THE INFORMATION SHOWN UPON A SUCCESSFULL TRANSACTION.
  const showSuccess = success => {
    if (success) {
      return (
        <div className={styles.SubBody}>
          <div>
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
  */

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

  // determines "submitInformationButton" functionality/formatting
  // for PayPal this button toggles between
  let submitInformationButton;

  if (detailsMinimal && showContactInformation) {
    submitInformationButton = (
      <button
        onClick={hideForm}
        disabled={!detailsMinimal}
        className={styles.ButtonGreen}
      >
        Submit Info
      </button>
    );
  } else if (showContactInformation) {
    submitInformationButton = (
      <button
        onClick={hideForm}
        disabled={!detailsMinimal}
        className={styles.ButtonGrey}
      >
        Submit Info
      </button>
    );
  } else {
    submitInformationButton = (
      <button
        onClick={showForm}
        disabled={!detailsMinimal}
        className={styles.ButtonRed}
      >
        Cancel
      </button>
    );
  }

  let orderPane;

  if (showDoublePane) {
    orderPane = (
      <div>
        <div className={styles.ImageBox}>
          <img
            className={styles.Image}
            src={eventLogo}
            alt="Event Logo Coming Soon!!!"
          />
        </div>
        <div style={OrderSummarySection}>{orderSummary}</div>
      </div>
    );
  } else {
    orderPane = (
      <Aux>
        <div>
          <div style={OrderSummarySectionAlt}>{orderSummary}</div>
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
          <div style={{ textAlign: "right" }}>{submitInformationButton}</div>
        </div>
      </Aux>
    );
  }

  // variables that define rendered items
  let connectionStatus = null;
  let loadingSpinner = null;
  let paymentPane = null;
  let paymentCenterPane = null;
  let purchaseConfirmation = null;

  // ***************
  // ***************
  // ***************
  // THIS NEEDS WORK, DECIDE IF ONLY ERRORS FROM PAYPAL ARE CAUGHT HERE
  // HOW ARE WE GOING TO HANDLE ERROR IF SERVER DOES NOT RECEIVE THE ORDER
  // BUT IT WAS PROCESSED BY PAYPAL
  // CONTROLS "connectionStatus" VIEW
  if (showConnectionStatus && transactionStatus.message === null) {
    connectionStatus = (
      <Aux>
        <div className={styles.BlankCanvas}>
          <h4>Connection error, please try back later.</h4>
          <br></br>
        </div>
      </Aux>
    );
  } else if (showConnectionStatus && transactionStatus.message !== null) {
    connectionStatus = (
      <Aux>
        <div className={styles.BlankCanvas}>
          <span className={styles.SubSectionHeader}>Order Status</span>
          <h5>There was a problem with your order</h5>
        </div>
      </Aux>
    );
  } else {
    connectionStatus = null;
  }

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

  // CONTROLS "paymentCenterPane" VIEW
  if (showContactInformation) {
    paymentCenterPane = (
      <div style={EventTicketSection}>
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
      </div>
    );
  } else {
    paymentCenterPane = (
      <div style={EventTicketSection}>
        <span className={styles.TicketType}>Payment Information</span>
        <br></br>
        <span className={styles.TicketTypeSmall}>Select a Payment Method</span>
        <br></br>
        <br></br>
        {showPayPal()}
      </div>
    );
  }

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
          {paymentCenterPane}
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
            <div style={{ textAlign: "right" }}>{submitInformationButton}</div>
          </div>
        </div>
      </Aux>
    );
  }

  // CONTROLS "purchaseConfirmation" VIEW
  // THIS WILL BE CONTROLLED BY PAYPAL SUCCESS
  // NOT BE SERVER SUCCESS
  if (showPurchaseConfirmation) {
    purchaseConfirmation = (
      <Aux>
        <div className={styles.BlankCanvas}>
          <span className={styles.SubSectionHeader}>Order Confirmation</span>
          <div style={{ paddingTop: "20px" }}>
            {showSuccess(transactionStatus.success)}
          </div>
        </div>
      </Aux>
    );
  } else {
    purchaseConfirmation = null;
  }

  //  <div className={styles.MainGrid}>

  let mainDisplay = null;
  if (showPaymentDetails) {
    if (showDoublePane) {
      mainDisplay = (
        <Aux>
          <div style={MainGrid}>
            {paymentPane}
            {orderPane}
          </div>
        </Aux>
      );
    } else if (!showOrderSummaryOnly) {
      mainDisplay = (
        <Aux>
          <div style={MainGrid}>{paymentPane}</div>
        </Aux>
      );
    } else {
      mainDisplay = (
        <Aux>
          <div style={MainGrid}>{orderPane}</div>
        </Aux>
      );
    }
  } else {
    mainDisplay = null;
  }

  return (
    <Aux>
      <div style={MainContainer}>
        {loadingSpinner}
        {connectionStatus}
        {mainDisplay}
        {purchaseConfirmation}
      </div>
    </Aux>
  );
};
export default Checkout;
