import React, { useState, useEffect } from "react";

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
import { expressPaymentOnSuccess } from "./apiCore";
import Spinner from "../components/UI/Spinner/Spinner";
import Aux from "../hoc/Auxiliary/Auxiliary";
import styles from "./Order.module.css";

// defines the ticket order populated from "localStorage"
let ticketOrder = {};

// defines the PayPal "purchase_units.items" value populated from "ticketOrder"
let paypalArray = [];

// defines an event's image
let eventLogo = "";

// defines the styling variables
let MainContainer = {};
let MainGrid = {};
let EventTicketSection = {};
let OrderSummarySection = {};
let OrderSummarySectionAlt = {};

const Checkout = props => {
  // defines styling variables
  const [isRestyling, setIsRestyling] = useState(false);

  // defines all view control variables
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(true);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showPurchaseConfirmation, setShowPurchaseConfirmation] = useState(
    false
  );

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
    // downloads "order" information and "image" from "localStorage" and
    if (localStorage.getItem("eventNum")) {
      let event = JSON.parse(localStorage.getItem("eventNum"));
      if (localStorage.getItem(`cart_${event}`)) {
        ticketOrder = JSON.parse(localStorage.getItem(`cart_${event}`));
        console.log("ticketOrder: ", ticketOrder);
        setPaypalArray();
        console.log("Paypal Array: ", paypalArray);
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

  // sets the PayPal "purchase_units.items" value populated from "ticketOrder"
  const setPaypalArray = () => {
    paypalArray = [];
    ticketOrder.tickets.map(item => {
      if (item.ticketsSelected > 0) {
        let newElement;
        newElement = {
          name: item.ticketName,
          //description: "General Admission",
          sku: item.ticketID,
          unit_amount: {
            currency_code: "USD",
            value: item.ticketPrice.toString()
          },
          quantity: item.ticketsSelected.toString()
        };
        paypalArray.push(newElement);
      }
    });
  };

  // clears entire "ticketOrder" object and "eventLogo", removes "cart" and "image" from "localStorage"
  const purchaseConfirmHandler = () => {
    ticketOrder = {};
    eventLogo = "";
    let event = JSON.parse(localStorage.getItem("eventNum"));
    localStorage.removeItem(`cart_${event}`);
    localStorage.removeItem(`image`);
  };

  // **********
  // **********
  // **********
  // THIS SECTION NEEDS WORK
  // called by <PaypalButton> on a successful transaction
  const payPalExpressBuy = details => {
    const paymentData = {
      paypalOrderDetails: details
    };
    onlyShowLoadingSpinner();
    console.log("On Success 'details' object: ", details);
    // sends PayPal order object to the server
    expressPaymentOnSuccess(paymentData)
      // NEED TO ADD ALL THE '.then" AND ".catch" STATEMENTS
      // THIS IS THE CODE THAT NEEDS TO BE ADDED
      .then(response => {
        console.log("order received");
        console.log("response: ", response);
        // MAYBE ADD THE "response.message" TO THE "transactionStatus" VARIABLE
        setTransactionStatus({
          ...transactionStatus,
          success: true
        });
        // NEED TO ADD CODE TO GRAB TRANSACTION DETAIL FROM SERVER
        /*
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
      */
        onlyShowPurchaseConfirmation();
        console.log("about to purchaseConfirmHandler()");
        // empties cart and image and clears "ticketOrder" object, "eventLogo" and
        purchaseConfirmHandler();
        console.log("SUCCESSFULL PURCHASE");
      })
      .catch(error => {
        console.log("processExpressPayment(): ERROR THROWN!!!!!!!");
        console.log("error.message: ", error.message);
        //NEED TO SET ERROR MESSAGE AND SUCCESS FIELDS IN "transactionStatus" VARIABLE
        onlyShowConnectionStatus();
      });
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

  // defines and sets "orderSummary" which is displayed in right panel
  let orderSummary;
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

  // **********
  // **********
  // **********
  // NEED TO DETERMINE HOW TO HANDLE ERROR FOR PAYPAL BUTTONS NOT SHOWING UP
  // "showError" WAS USED TO HANDLE NOT RECEIVING BRAINTREE CLIENT TOKEN
  // THEREFORE THIS MIGHT STILL BE REQUIRED
  // displays "error" if one exists
  const showError = error => (
    <div style={{ display: error ? "" : "none" }}>
      <span style={{ color: "red" }}>{error}</span>
    </div>
  );

  // **********
  // **********
  // **********
  // NEED TO DETERMINE HOW TO HANDLE ERROR FOR PAYPAL BUTTONS NOT SHOWING UP
  // POTENTIALLY NEED TO ADD BACK THE "onBLur" IN <div>
  // displays the "PayPalButton" or an "empty cart" error message
  const showPayPal = () => (
    // loads PayPal Smart buttons if order exists
    <div>
      {ticketOrder.totalPurchaseAmount > 0 ? (
        <div>
          <PayPalButton
            onButtonReady={() => {}}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    reference_id: ticketOrder.eventNum,
                    description: ticketOrder.eventName,
                    //custom_id: "holivas@xmail.com",
                    //soft_descriptor: "Great description 1",
                    amount: {
                      currency_code: "USD",
                      value: ticketOrder.totalPurchaseAmount.toString(),
                      breakdown: {
                        item_total: {
                          currency_code: "USD",
                          value: ticketOrder.totalPurchaseAmount.toString()
                        }
                      }
                    },
                    items: paypalArray
                  }
                ]
              });
            }}
            onCancel={data => {
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
              console.log("onSuccess 'details': ", details);
              setTransactionStatus({
                ...transactionStatus,
                success: true
              });
              payPalExpressBuy(details);
            }}
            options={{
              clientId:
                "AQdWzLz5fiOs9ub51DS_ndZDPJZ7rtpZF1ul4fvErAIsv-lrAuMshmlJLKX5gB5OZtwdyqUHmfuenYgj"
            }}
            catchError={err => {
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

  // **********
  // **********
  // **********
  // THIS NEEDS WORK
  // THIS IS THE INFORMATION SHOWN UPON A SUCCESSFULL TRANSACTION.
  const showSuccess = success => {
    if (success) {
      return (
        <div className={styles.SubBody}>
          <div>
            PayPal has processed your order.
            <br></br>
            OpenSeatDirect has sent you an email with your tickets.
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

  // defines and sets "orderPane" which is the right panel
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
        <div className={styles.EventFooterMod}>
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
        </div>
      </Aux>
    );
  }

  // variables that define rendered items
  let connectionStatus = null;
  let loadingSpinner = null;
  let paymentPane = null;
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

  // defines and sets "loadingSpinner" view status
  if (showLoadingSpinner) {
    loadingSpinner = (
      <div className={styles.Spinner}>
        <Spinner></Spinner>;
      </div>
    );
  } else {
    loadingSpinner = null;
  }

  // defines and sets "paymentPane" view status
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

          <div style={EventTicketSection}>
            <span className={styles.TicketType}>Payment Information</span>
            <br></br>
            <span className={styles.TicketTypeSmall}>
              Select a Payment Method
            </span>
            <br></br>
            <br></br>
            {showPayPal()}
          </div>

          <div className={styles.EventFooterMod}>
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
          </div>
        </div>
      </Aux>
    );
  }

  // defines and sets "purchaseConfirmation" contents
  // contolled by "transactionStatus.success"
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

  // defines which of "paymentPane" and/or "orderPane" items to display
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
