import React, { useState, useEffect } from "react";
import { Form, Col } from "react-bootstrap";
import DropIn from "braintree-web-drop-in-react";

import CocinaCandelaLogo from "../assets/Cocina_Candela/cocina-candela-large.jpg";

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
let ticketOrder = {};

let MainContainer = {};
let MainGrid = {};
let EventTicketSection = {};
let OrderSummarySection = {};
let OrderSummarySectionAlt = {};
let BlankCanvas = {};
let SpinnerCanvas = {};

const Checkout = props => {
  /*document.height (pure javascript)
$(document).height() (jQuery)

$(window).on('resize', function() {
        resize();
    });
*/

  // defines styling variables
  const [isRestyling, setIsRestyling] = useState(false);

  // defines purchase order to be sent to server
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

  // BrainTree interface variable
  const [braintreeData, setBraintreeData] = useState({
    success: false,
    message: null,
    clientToken: true,
    error: "",
    instance: {},
    address: "",
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
    if (localStorage.getItem("cart")) {
      ticketOrder = JSON.parse(localStorage.getItem("cart"));
      console.log("ticketOrder: ", ticketOrder);
    }
    stylingUpdate(window.innerWidth, window.innerHeight);
    // requests BrainTree "clientToken" from backend server
    getExpressToken();
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

    if (inWidth < 660) {
      MainContainer = {
        backgroundColor: `red`,
        height: `${inHeight}px`,
        paddingTop: `0px`,
        paddingLeft: `0px`,
        paddingRight: `0px`,
        paddingBottom: `0px`
      };
    } else if (inHeight < 720) {
      MainContainer = {
        backgroundColor: `green`,
        height: `${inHeight}px`,
        paddingTop: `0px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        paddingBottom: `0px`
      };
    } else {
      MainContainer = {
        backgroundColor: `#2f5596`,
        paddingTop: `calc((${inHeight}px - 720px) / 2)`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        paddingBottom: `calc((${inHeight}px - 720px) / 2)`
      };
    }

    if (inWidth < 660) {
      // width < 660px, height does not matter
      MainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
        height: `${inHeight}px`,
        display: `grid`,
        gridTemplateColumns: `auto`
      };
    } else if (inWidth < 790) {
      // width < 790px, NEED TO CHECK HEIGHT
      if (inHeight < 720) {
        // height < 720px
        MainGrid = {
          backgroundColor: `#fff`,
          margin: `auto`,
          height: `${inHeight}px`,
          display: `grid`,
          gridTemplateColumns: `auto`
        };
      } else {
        // height >= 720px
        MainGrid = {
          backgroundColor: `#fff`,
          margin: `auto`,
          height: `720px`,
          display: `grid`,
          gridTemplateColumns: `auto`
        };
      }
    } else if (inWidth < 960) {
      // width < 960px, NEED TO CHECK HEIGHT
      if (inHeight < 720) {
        // height < 720px
        MainGrid = {
          backgroundColor: `#fff`,
          margin: `auto`,
          height: `${inHeight}px`,
          display: `grid`,
          gridTemplateColumns: `auto 320px`
        };
      } else {
        // height >= 720px
        MainGrid = {
          backgroundColor: `#fff`,
          margin: `auto`,
          height: `720px`,
          display: `grid`,
          gridTemplateColumns: `auto 320px`
        };
      }
    } else if (inWidth < 1140) {
      // width < 1140px, NEED TO CHECK HEIGHT
      if (inHeight < 720) {
        // height < 720px
        MainGrid = {
          backgroundColor: `#fff`,
          margin: `auto`,
          height: `${inHeight}px`,
          display: `grid`,
          gridTemplateColumns: `auto 360px`
        };
      } else {
        // height >= 720px
        MainGrid = {
          backgroundColor: `#fff`,
          margin: `auto`,
          height: `720px`,
          display: `grid`,
          gridTemplateColumns: `auto 360px`
        };
      }
    } else {
      // width >= 1140px, NEED TO CHECK HEIGHT
      if (inHeight < 720) {
        // height < 720px
        MainGrid = {
          backgroundColor: `#fff`,
          margin: `auto`,
          height: `${inHeight}px`,
          width: `1080px`,
          display: `grid`,
          gridTemplateColumns: `720px 360px`
        };
      } else {
        // height >= 720px
        MainGrid = {
          backgroundColor: `#fff`,
          margin: `auto`,
          height: `720px`,
          width: `1080px`,
          display: `grid`,
          gridTemplateColumns: `720px 360px`
        };
      }
    }

    if (inWidth < 480) {
      // width < 480px, height does not matter
      EventTicketSection = {
        backgroundColor: `#fff`,
        height: `calc(${inHeight}px - 140px)`,
        paddingTop: `30px`,
        paddingLeft: `15px`,
        paddingRight: `10px`,
        textAlign: `left`,
        overflowY: `auto`
      };
    } else if (inWidth < 660) {
      // width < 660px, height does not matter
      EventTicketSection = {
        backgroundColor: `#fff`,
        height: `calc(${inHeight}px - 140px)`,
        paddingTop: `30px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        textAlign: `left`,
        overflowY: `auto`
      };
    } else if (inWidth < 790) {
      // width < 790px, NEED TO CHECK HEIGHT
      if (inHeight < 720) {
        // height < 720px
        EventTicketSection = {
          backgroundColor: `#fff`,
          height: `calc(${inHeight}px - 140px)`,
          paddingTop: `30px`,
          paddingLeft: `80px`,
          paddingRight: `80px`,
          textAlign: `left`,
          overflowY: `auto`
        };
      } else {
        // height >= 720px
        EventTicketSection = {
          backgroundColor: `#fff`,
          height: `580px`,
          paddingTop: `30px`,
          paddingLeft: `80px`,
          paddingRight: `80px`,
          textAlign: `left`,
          overflowY: `auto`
        };
      }
    } else if (inWidth < 960) {
      // width < 960px, NEED TO CHECK HEIGHT
      if (inHeight < 720) {
        // height < 720px
        EventTicketSection = {
          backgroundColor: `#fff`,
          height: `calc(${inHeight}px - 140px)`,
          paddingTop: `30px`,
          paddingLeft: `25px`,
          paddingRight: `25px`,
          textAlign: `left`,
          overflowY: `auto`
        };
      } else {
        // height >= 720px
        EventTicketSection = {
          backgroundColor: `#fff`,
          height: `580px`,
          paddingTop: `30px`,
          paddingLeft: `25px`,
          paddingRight: `25px`,
          textAlign: `left`,
          overflowY: `auto`
        };
      }
    } else if (inWidth < 1140) {
      // width < 1140px, NEED TO CHECK HEIGHT
      if (inHeight < 720) {
        // height < 720px
        EventTicketSection = {
          backgroundColor: `#fff`,
          height: `calc(${inHeight}px - 140px)`,
          paddingTop: `30px`,
          paddingLeft: `25px`,
          paddingRight: `25px`,
          textAlign: `left`,
          overflowY: `auto`
        };
      } else {
        // height >= 720px
        EventTicketSection = {
          backgroundColor: `#fff`,
          height: `580px`,
          paddingTop: `30px`,
          paddingLeft: `25px`,
          paddingRight: `25px`,
          textAlign: `left`,
          overflowY: `auto`
        };
      }
    } else {
      // width >= 1140px, NEED TO CHECK HEIGHT
      if (inHeight < 720) {
        // height < 720px
        EventTicketSection = {
          backgroundColor: `#fff`,
          height: `calc(${inHeight}px - 140px)`,
          paddingTop: `30px`,
          paddingLeft: `80px`,
          paddingRight: `80px`,
          textAlign: `left`,
          overflowY: `auto`
        };
      } else {
        // height >= 720px
        EventTicketSection = {
          backgroundColor: `#fff`,
          height: `580px`,
          paddingTop: `30px`,
          paddingLeft: `80px`,
          paddingRight: `80px`,
          textAlign: `left`,
          overflowY: `auto`
        };
      }
    }

    if (inWidth < 660) {
      // width < 660px, height does not matter
      OrderSummarySection = {
        backgroundColor: `#e5e5e5`,
        fontSize: `0.875rem`,
        height: `calc(${inHeight}px - 160px)`,
        paddingTop: `20px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        overflowY: `auto`
      };
    } else if (inWidth < 960) {
      // width < 960px, NEED TO CHECK HEIGHT
      if (inHeight < 720) {
        // height < 720px
        OrderSummarySection = {
          backgroundColor: `#e5e5e5`,
          fontSize: `0.875rem`,
          height: `calc(${inHeight}px - 160px)`,
          paddingTop: `20px`,
          paddingLeft: `25px`,
          paddingRight: `25px`,
          overflowY: `auto`
        };
      } else {
        // height >= 720px
        OrderSummarySection = {
          backgroundColor: `#e5e5e5`,
          fontSize: `0.875rem`,
          height: `560px`,
          paddingTop: `20px`,
          paddingLeft: `25px`,
          paddingRight: `25px`,
          overflowY: `auto`
        };
      }
    } else {
      // width >= 960px, NEED TO CHECK HEIGHT
      if (inHeight < 720) {
        // height < 720px
        OrderSummarySection = {
          backgroundColor: `#e5e5e5`,
          fontSize: `0.875rem`,
          height: `calc(${inHeight}px - 180px)`,
          paddingTop: `20px`,
          paddingLeft: `25px`,
          paddingRight: `25px`,
          overflowY: `auto`
        };
      } else {
        // height >= 720px
        OrderSummarySection = {
          backgroundColor: `#e5e5e5`,
          fontSize: `0.875rem`,
          height: `540px`,
          paddingTop: `20px`,
          paddingLeft: `25px`,
          paddingRight: `25px`,
          overflowY: `auto`
        };
      }
    }

    if (inWidth < 660) {
      // width < 660px, height does not matter
      OrderSummarySectionAlt = {
        backgroundColor: `#e5e5e5`,
        fontSize: `0.875rem`,
        height: `calc(${inHeight}px - 80px)`,
        paddingTop: `20px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        overflowY: `auto`
      };
    } else if (inWidth < 960) {
      // width < 960px, NEED TO CHECK HEIGHT
      if (inHeight < 720) {
        // height < 720px
        OrderSummarySectionAlt = {
          backgroundColor: `#e5e5e5`,
          fontSize: `0.875rem`,
          height: `calc(${inHeight}px - 80px)`,
          paddingTop: `20px`,
          paddingLeft: `25px`,
          paddingRight: `25px`,
          overflowY: `auto`
        };
      } else {
        // height >= 720px
        OrderSummarySectionAlt = {
          backgroundColor: `#e5e5e5`,
          fontSize: `0.875rem`,
          height: `640px`,
          paddingTop: `20px`,
          paddingLeft: `25px`,
          paddingRight: `25px`,
          overflowY: `auto`
        };
      }
    } else {
      // width >= 960px, NEED TO CHECK HEIGHT
      if (inHeight < 720) {
        // height < 720px
        OrderSummarySectionAlt = {
          backgroundColor: `#e5e5e5`,
          fontSize: `0.875rem`,
          height: `calc(${inHeight}px - 80px)`,
          paddingTop: `20px`,
          paddingLeft: `25px`,
          paddingRight: `25px`,
          overflowY: `auto`
        };
      } else {
        // height >= 720px
        OrderSummarySectionAlt = {
          backgroundColor: `#e5e5e5`,
          fontSize: `0.875rem`,
          height: `640px`,
          paddingTop: `20px`,
          paddingLeft: `25px`,
          paddingRight: `25px`,
          overflowY: `auto`
        };
      }
    }

    if (inWidth < 480) {
      // width < 480px, height does not matter
      BlankCanvas = {
        backgroundColor: `#fff`,
        margin: `auto`,
        verticalAlign: `center`,
        height: `${inHeight}px`,
        paddingTop: `30px`,
        paddingLeft: `15px`,
        paddingRight: `10px`,
        textAlign: `left`,
        overflowY: `auto`
      };
    } else if (inWidth < 660) {
      // width < 660px, height does not matter
      BlankCanvas = {
        backgroundColor: `#fff`,
        margin: `auto`,
        verticalAlign: `center`,
        height: `${inHeight}px`,
        paddingTop: `30px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        textAlign: `left`,
        overflowY: `auto`
      };
    } else if (inWidth < 790) {
      // width < 790px, NEED TO CHECK HEIGHT
      if (inHeight < 720) {
        // height < 720px
        BlankCanvas = {
          backgroundColor: `#fff`,
          margin: `auto`,
          verticalAlign: `center`,
          height: `${inHeight}px`,
          paddingTop: `30px`,
          paddingLeft: `80px`,
          paddingRight: `80px`,
          textAlign: `left`,
          overflowY: `auto`
        };
      } else {
        // height >= 720px
        BlankCanvas = {
          backgroundColor: `#fff`,
          margin: `auto`,
          verticalAlign: `center`,
          height: `720px`,
          paddingTop: `30px`,
          paddingLeft: `80px`,
          paddingRight: `80px`,
          textAlign: `left`,
          overflowY: `auto`
        };
      }
    } else if (inWidth < 960) {
      // width < 960px, NEED TO CHECK HEIGHT
      if (inHeight < 720) {
        // height < 720px
        BlankCanvas = {
          backgroundColor: `#fff`,
          margin: `auto`,
          verticalAlign: `center`,
          height: `${inHeight}px`,
          paddingTop: `30px`,
          paddingLeft: `25px`,
          paddingRight: `25px`,
          textAlign: `left`,
          overflowY: `auto`
        };
      } else {
        // height >= 720px
        BlankCanvas = {
          backgroundColor: `#fff`,
          margin: `auto`,
          verticalAlign: `center`,
          height: `720px`,
          paddingTop: `30px`,
          paddingLeft: `25px`,
          paddingRight: `25px`,
          textAlign: `left`,
          overflowY: `auto`
        };
      }
    } else {
      // width >= 1140px, NEED TO CHECK HEIGHT
      if (inHeight < 720) {
        // height < 720px
        BlankCanvas = {
          backgroundColor: `#fff`,
          margin: `auto`,
          verticalAlign: `center`,
          height: `${inHeight}px`,
          width: `1080px`,
          paddingTop: `30px`,
          paddingLeft: `80px`,
          paddingRight: `80px`,
          textAlign: `left`,
          overflowY: `auto`
        };
      } else {
        // height >= 720px
        BlankCanvas = {
          backgroundColor: `#fff`,
          margin: `auto`,
          verticalAlign: `center`,
          height: `720px`,
          width: `1080px`,
          paddingTop: `30px`,
          paddingLeft: `80px`,
          paddingRight: `80px`,
          textAlign: `left`,
          overflowY: `auto`
        };
      }
    }

    if (inWidth < 660) {
      // width < 660px, height does not matter
      SpinnerCanvas = {
        backgroundColor: `#fff`,
        margin: `auto`,
        verticalAlign: `center`,
        height: `${inHeight}px`,
        display: `grid`,
        gridTemplateColumns: `auto`
      };
    } else if (inWidth < 1140) {
      // width < 1140px, NEED TO CHECK HEIGHT
      if (inHeight < 720) {
        // height < 720px
        SpinnerCanvas = {
          backgroundColor: `#fff`,
          margin: `auto`,
          verticalAlign: `center`,
          height: `${inHeight}px`,
          display: `grid`,
          gridTemplateColumns: `auto`
        };
      } else {
        // height >= 720px
        SpinnerCanvas = {
          backgroundColor: `#fff`,
          margin: `auto`,
          verticalAlign: `center`,
          height: `720px`,
          display: `grid`,
          gridTemplateColumns: `auto`
        };
      }
    } else {
      // width >= 1140px, NEED TO CHECK HEIGHT
      if (inHeight < 720) {
        // height < 720px
        SpinnerCanvas = {
          backgroundColor: `#fff`,
          margin: `auto`,
          verticalAlign: `center`,
          height: `${inHeight}px`,
          width: `1080px`,
          display: `grid`,
          gridTemplateColumns: `auto`
        };
      } else {
        // height >= 720px
        SpinnerCanvas = {
          backgroundColor: `#fff`,
          margin: `auto`,
          verticalAlign: `center`,
          height: `720px`,
          width: `1080px`,
          display: `grid`,
          gridTemplateColumns: `auto`
        };
      }
    }

    /*return [
      MainContainer,
      MainGrid,
      EventTicketSection,
      OrderSummarySection,
      OrderSummarySectionAlt,
      BlankCanvas,
      SpinnerCanvas
    ];*/
    setIsRestyling(false);
  };

  // clears entire "cart" object, removes "cart" from "localStorage"
  const purchaseConfirmHandler = () => {
    ticketOrder = {};
    localStorage.removeItem("cart");
  };

  // ***STILL A QUESTION AS TO WHAT TO SHOW IF "res.error" IS RETURNED***
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

  // requests "nonce" from BrainTree
  // sends payment and order information to the server
  const expressBuy = () => {
    let nonce;
    // requests "nonce" from BrainTree
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
        // sends payment and order information to the server
        processExpressPayment(paymentData)
          .then(response => {
            console.log("order received");
            console.log("response: ", response);
            setBraintreeData({
              ...braintreeData,
              success: response.success
            });
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
            onlyShowPurchaseConfirmation();
            // empty cart and reset "ticketOrder" object
            purchaseConfirmHandler();
            console.log("SUCCESSFULL PURCHASE2");
          })
          .catch(error => {
            console.log("processExpressPayment(): ERROR THROWN!!!!!!!");
            console.log("error.message: ", error.message);
            setBraintreeData({
              ...braintreeData,
              success: false,
              message: error.friendlyMessage
            });
            onlyShowConnectionStatus();
          });
      })

      // there is a problem with Braintree and cannot return nonce
      .catch(error => {
        console.log("requestPaymentMethod(): ERROR THROWN", error);
        // **THIS IS THE ORIGINAL CODE FOR THE ecomm CLASS
        setBraintreeData({ ...braintreeData, error: error.message });
        // **THIS IS WHAT IT WAS CHANGED TO
        //setBraintreeData({ ...braintreeData, success: false });
        //braintreeData.instance.clearSelectedPaymentMethod();
        // ** WE NEED TO LET THIS ERROR DISPLAY WITHOUT SWITCHING TO "onlyShowConnectionStatus()";"
        // onlyShowConnectionStatus();
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

  // displays "error" if one exists
  const showError = error => (
    <div style={{ display: error ? "" : "none" }}>
      <span style={{ color: "red" }}>{error}</span>
    </div>
  );

  // displays the "DropIn" or an "empty cart" error message
  const showDropIn = () => (
    //establishes a Braintree connection in order to complete part "3" of the interaction
    <div onBlur={() => setBraintreeData({ ...braintreeData, error: "" })}>
      {braintreeData.clientToken !== null &&
      ticketOrder.totalPurchaseAmount > 0 ? (
        <div>
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
          {showError(braintreeData.error)}
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

  // ***AAA***
  // ***AAA***
  // ***AAA***
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

  // determines "placeOrderButton" functionality/formatting
  let placeOrderButton;

  if (detailsMinimal) {
    placeOrderButton = (
      <button
        onClick={expressBuy}
        disabled={!detailsMinimal}
        className={styles.ButtonGreen}
      >
        Place Order
      </button>
    );
  } else {
    placeOrderButton = (
      <button
        onClick={expressBuy}
        disabled={!detailsMinimal}
        className={styles.ButtonGrey}
      >
        Place Order
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
            src={CocinaCandelaLogo}
            alt="Cocina Candela Logo"
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
          <div style={{ textAlign: "right" }}>{placeOrderButton}</div>
        </div>
      </Aux>
    );
  }

  // variables that define rendered items
  let connectionStatus = null;
  let loadingSpinner = null;
  let paymentPane = null;
  let purchaseConfirmation = null;

  // CONTROLS "connectionStatus" VIEW
  if (showConnectionStatus && braintreeData.message === null) {
    connectionStatus = (
      <Aux>
        <div style={BlankCanvas}>
          <h4>Connection error, please try back later.</h4>
          <br></br>
        </div>
      </Aux>
    );
  } else if (showConnectionStatus && braintreeData.message !== null) {
    connectionStatus = (
      <Aux>
        <div style={BlankCanvas}>
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
      <div style={SpinnerCanvas}>
        <Spinner></Spinner>;
      </div>
    );
  } else {
    loadingSpinner = null;
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
              {/*back arrow:{"    "}*/}
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

  // CONTROLS "purchaseConfirmation" VIEW
  if (showPurchaseConfirmation) {
    purchaseConfirmation = (
      <Aux>
        <div style={BlankCanvas}>
          <span className={styles.SubSectionHeader}>Order Confirmation</span>
          <div style={{ paddingTop: "20px" }}>
            {showSuccess(braintreeData.success)}
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
