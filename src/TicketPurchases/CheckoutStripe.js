import React, { useState, useEffect, Fragment } from "react";
import queryString from "query-string";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutForm from "./CheckoutForm";
import StripeModal from "./Modals/StripeModal";

import { API, OSD_STRIPE_ACCOUNT_ID } from "../config.js";


import {
  MainContainerStyling,
  MainGridStyling,
  EventTicketSectionStyling,
  OrderSummarySectionStyling,
  OrderSummarySectionAltStyling,
} from "./Resources/Styling";
import { DateRange } from "./Resources/PricingFunctions";
import Spinner from "../components/UI/Spinner/Spinner";
import CartLink from "./Components/CartLink";
import OrderSummary from "./Components/OrderSummary";
import { StripeConfirm } from "./Components/OrderConfirms";
import { loadTransactionInfo } from "./Resources/TicketSelectionFunctions";
import classes from "./Checkout.module.css";

import { useOurApi } from "../Users/useOurApi";


// defines the variables that accept the "cart_" data from "localStorage"
let eventDetails = {};
let ticketInfo = {};
let orderTotals = {};
let osdOrderId;
let orderExpiration;

let eventLogo = "";

// defines the styling variables
let MainContainer = {};
let MainGrid = {};
let EventTicketSection = {};
let OrderSummarySection = {};
let OrderSummarySectionAlt = {};


const Checkoutx = () => {
  const [display, setDisplay] = useState("main"); // defines panel displayed: main, spinner, confirmation, paypal
  const [clientReceived, setClientReceived] = useState(false);
  const [showDoublePane, setShowDoublePane] = useState(false); // defines single or double panel display on main page
  const [showOrderSummaryOnly, setShowOrderSummaryOnly] = useState(false); // defines panel display for a single panel display on main page
  const [stripeModal, setStripeModal] = useState({ display: false });
  const [isRestyling, setIsRestyling] = useState(false); // defines styling variables

  const [orderStatus, setOrderStatus] = useState(false); // defines status of order sent to server
  const [customerInformation, setCustomerInformation] = useState({});
  const [transactionInfo, setTransactionInfo] = useState({}); // defines transaction variables for display on confirmation page
  const [transactionStatus, setTransactionStatus] = useState({
    // defines status of paypal order
    message: null,
    error: "",
  });

//  const [clientSecret, setClientSecret] = useState("");
//  const [stripePromise, setStripePromise] = useState();

////////// setup api variables
/*
  if ("success" === queryString.parse(window.location.search).result ){
    setDisplay("success");
  }
    if (result === "success") {
      console.log("success");
      //
   } else {
      if (typeof window !== "undefined" && localStorage.getItem("eventNum")) {
*/

  let event = JSON.parse(localStorage.getItem("eventNum"));
  let tempCart = JSON.parse(localStorage.getItem(`cart_${event}`));
  
   
  if (!event || !tempCart) window.location.href ="/events";    // go to events of missing vars

  eventDetails = tempCart.eventDetails;
  console.log("cart in storage: ", tempCart);
  console.log("eventDetails: ", eventDetails);
  ticketInfo = tempCart.ticketInfo;
  orderTotals = tempCart.orderTotals;
  osdOrderId = tempCart.osdOrderId;
  orderExpiration = tempCart.orderExpiration;
  let isGuest = "guestInfo" in tempCart ? true: false;


  let email;
  let name;

  if ("guestInfo" in tempCart) {
    console.log("tempCart: ", tempCart);
    setCustomerInformation(tempCart.guestInfo);
    email =  customerInformation.email;
    name = `${customerInformation.firstname} ${customerInformation.lastname}`;

  } else if (localStorage.getItem("user") !== null) {
    let tempUser = JSON.parse(localStorage.getItem("user"));
    setCustomerInformation({
      sessionToken: tempUser.token,
      userId: tempUser.user._id,
      email: tempUser.user.email,
    });
    email =  tempUser.user.email;
    name =`${tempUser.user.firstname} ${tempUser.user.lastname}`;
  } else {
    window.location.href = `/et/${tempCart.eventDetails.vanityLink}?eventID=${tempCart.eventDetails.eventNum}`;
  };

  console.log("orderTotals: ", orderTotals);
  console.log("ticketInfo: ", ticketInfo);
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let tickets = [];
  tempCart.ticketInfo.forEach((item) => {
    if (item.ticketsSelected !== 0) {
      tickets.push({
        ticketID: item.ticketID,
        ticketsSelected: item.ticketsSelected,
      });
    }
  });
    //let promoCode;
  let body = {
      totalAmount: tempCart.orderTotals.finalPurchaseAmount,
      eventNum: tempCart.eventDetails.eventNum,
      tickets: tickets,
    };

    if (tempCart?.promoCodeDetails?.appliedPromoCode !== "") {
      body.userPromo = tempCart.promoCodeDetails.appliedPromoCode;
    }

    let url;
    if ("guestInfo" in tempCart) {
      console.log("customerInformation: ", customerInformation);
      body.guestFirstname = tempCart.guestInfo.firstname;
      body.guestLastname = tempCart.guestInfo.lastname;
      body.guestEmail = tempCart.guestInfo.email;

      console.log("body: ", body);
      url = `${API}/tixorder/stripe/us-create-order`;
    } else {
      console.log("customerInformation: ", customerInformation);
      console.log("body: ", body);
      url = `${API}/tixorder/stripe/sn-create-order`;

      let tempUser = JSON.parse(localStorage.getItem("user"));
      myHeaders.append("Authorization", `Bearer ${tempUser.token}`);
    }
    const method = "POST"
    const initialData = { status: true, message: "hi first time " };
    console.log ("url=", url);

//    const { isLoading, hasError, setUrl, setBody, data, networkError } =
//          useOurApi(method, url, myHeaders, body, initialData);

    let marg ={x:false};
    let isLoading, hasError, setUrl, setBody, data, networkError;

    [isLoading, hasError, setUrl, setBody, data, networkError ]=  [false, false, false,false, {}, false]

 //   const { isLoading, hasError, setUrl, setBody, data, networkError } =   useOurApi(method, url, myHeaders, body, initialData);

 
   if (localStorage.getItem(`image_${event}`)) {
      eventLogo = JSON.parse(localStorage.getItem(`image_${event}`));
    }

//    setTransactionInfo(
//      loadTransactionInfo(
//        eventDetails,
//        orderTotals,
//        ticketInfo,
//        email,
//        name
//      )
//    );

  console.log ("TINFO===", {eventDetails,
        orderTotals,
        ticketInfo,
        email,
        name})

/*
  window.onresize = function (event) {
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

*/

  // toggles between "order pane" views
  const switchShowOrderSummary = (event) => {
    if (showOrderSummaryOnly) {
      setShowOrderSummaryOnly(false);
    } else {
      setShowOrderSummaryOnly(true);
    }
  };



  // removes order related information from "localStorage"
  const purchaseConfirmHandler = () => {
    console.log("inside purchaseConfirmHandler");
    eventDetails = {};
    ticketInfo = {};
    orderTotals = {};
    eventLogo = "";
    let event = JSON.parse(localStorage.getItem("eventNum"));
    localStorage.removeItem(`cart_${event}`);
    localStorage.removeItem(`image_${event}`);
    localStorage.removeItem(`eventNum`);
  };

  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };


  // defines "purchaseConfirmation" contents: contolled by "transactionStatus.success"
  const purchaseConfirmation = () => {
    if (display === "success") {
      console.log("CONFIRMTION");
      //console.log("transactionInfo: ", transactionInfo);
      //console.log("orderStatus: ", orderStatus);
      return (
        <div className={classes.BlankCanvas}>
          <div style={{ paddingTop: "20px" }}>
            <StripeConfirm />
          </div>
        </div>
      );
    } else return null;
  };

  // defines "purchaseConfirmation" contents: contolled by "transactionStatus.success"
  const stripeSuccess = () => {
    if ((!isLoading) && (!hasError) && display === "success") {
      console.log("CONFIRMTION");
      //console.log("transactionInfo: ", transactionInfo);
      //console.log("orderStatus: ", orderStatus);
      return (
        <div className={classes.BlankCanvas}>
          <StripeConfirm></StripeConfirm>
        </div>
      );
    } else {
      console.log("UNSUCCESS");
      return null;
    }
  };

  const appearance = {
    theme: "stripe",

    variables: {
      colorPrimary: "#0570de",
      colorBackground: "#ffffff",
      colorText: "#30313d",
      colorDanger: "#df1b41",
      fontFamily: "Ideal Sans, system-ui, sans-serif",
      spacingUnit: "2px",
      borderRadius: "4px",
      // See all possible variables below
    },
  };

  const options = () => {
      return {
        // passing the client secret obtained in step 2
        clientSecret: data.client_secret,
        // Fully customizable with appearance API.

        appearance: {
          appearance,
        },
      }
  }
  
  const showStripe = () => {
    console.log("clientSecret: ", data.client_secret);
    const stripePromise = loadStripe(`${OSD_STRIPE_ACCOUNT_ID}`, {
              stripeAccount: eventDetails.stripeAccountID})

    if ((!isLoading) && (!hasError) && data.client_secret) {
      return (
        <div>
          <Elements stripe={stripePromise} options={options()}>
            <CheckoutForm
              isLoading={isLoading}
              hasError={hasError}
              clientSecret={data.client_secret}
              transactionInfo={transactionInfo}
              orderStatus={data.client_secret}
              orderFailure={(event) => {
                console.log("UNUCCESSFUL ORDER");

//                let tempStripeModal = { ...stripeModal };
//                tempStripeModal.display = true;
//                tempStripeModal.message = event;
//                setStripeModal(tempStripeModal);
              }}
              orderSuccess={() => {
                console.log("SUCCESSFUL ORDER");
                setDisplay("confirmation");
              }}
            />
          </Elements>
        </div>
      );
    } else return null;
  };

  // LOOKS GOOD BUT REVIEW LOGIC
  const calculateTimeLeft = () => {
    let timeElapsed = new Date(orderExpiration) - new Date();
    let elapsedTime = {
      days: Math.floor(timeElapsed / (1000 * 60 * 60 * 24)),
      hours: Math.floor((timeElapsed / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((timeElapsed / 1000 / 60) % 60),
      seconds: Math.floor((timeElapsed / 1000) % 60),
    };
    return elapsedTime;
  };

  
  // LOOKS GOOD
  // determines whether or not to display the purchase amount
  const totalAmount = (show) => {
    if (!show && orderTotals.ticketsPurchased > 0) {
      return (
        <div>
          {orderTotals.currencySym}
          {orderTotals.finalPurchaseAmount}
        </div>
      );
    } else return null;
  };
  // LOOKS GOOD
  // determines whether or not to display cart and arrow
  const cartLink = (show) => {
    if (!show) {
      return (
        <CartLink
          onClick={switchShowOrderSummary}
          showStatus={showOrderSummaryOnly}
          isLoading={isLoading}
          orderTotals={orderTotals}
          showDoublePane={showDoublePane}
        />
      );
    } else {
      return null;
    }
  };


  const mainDisplay = () =>{
    return (
        <div className={classes.ConnectionText}>
            There is a problem in retrieving your information.
            Please try again later.
        </div>

    )
  }


  const mainDisplay2 = () => {

    if (isLoading) {
      return (
        <div className={classes.Spinner}>
          <Spinner></Spinner>;
        </div>
      );
    };
    
    if (hasError ) {
      return (
          <div className={classes.ConnectionText}>
            There is a problem in retrieving your information.
            Please try again later.
        </div>
      )
    };
   return (
     <div className={classes.ConnectionText}>
            LOADED OK !!
            SEE HERE
        </div>
   );
  }


  const mainDisplayx = () => {

    if (isLoading) {
      return (
        <div className={classes.Spinner}>
          <Spinner></Spinner>;
        </div>
      );
    };
    
    if (hasError ) {
      return (
          <div className={classes.ConnectionText}>
            There is a problem in retrieving your information.
            Please try again later.
        </div>
      )
    };

 //   stylingUpdate(window.innerWidth, window.innerHeight);   //?

    if (display === "main") {
      let paymentPane = (
        <Fragment>
          <div className={classes.MainItemLeft}>
            <div className={classes.EventHeader}>
              <div className={classes.EventTitle}>
                {eventDetails.eventTitle}
              </div>
              <div className={classes.EventDate}>
                <DateRange
                  start={eventDetails.startDateTime}
                  end={eventDetails.endDateTime}
                />
              </div>
            </div>
            <div style={EventTicketSection}>
              <br></br>
              <span style={{ fontSize: "18px", fontWeight: "600" }}>
                Stripe Checkout
              </span>
              <br></br>
              <br></br>
              <span className={classes.TicketType}>Payment Information</span>
              <br></br>
              <span className={classes.TicketTypeSmall}>
                Select a Payment Method
              </span>
              <br></br>
              <br></br>
              {showStripe()}
            </div>
            <div className={classes.EventFooterMod}>
              <div className={classes.CartLink}>{cartLink(showDoublePane)}</div>
              <div className={classes.TotalAmount}>
                {totalAmount(showDoublePane)}
              </div>
            </div>
          </div>
        </Fragment>
      );

      // defines and sets "orderSummary" which is displayed in right panel
      let orderSummary;
      if (orderTotals.ticketsPurchased > 0) {
        orderSummary = (
          <OrderSummary
            cancel={true}
            eventNum={eventDetails.eventNum}
            vanity={eventDetails.vanityLink}
            ticketOrder={ticketInfo}
            ticketCurrency={orderTotals.currencySym}
          />
        );
      } else if (orderTotals.finalPurchaseAmount <= 0) {
        orderSummary = (
          <div className={classes.EmptyOrderSummary}>
            <ion-icon
              style={{ fontSize: "36px", color: "grey" }}
              name="cart-outline"
            />
          </div>
        );
      } else {
        orderSummary = null;
      }

      // defines and sets "orderPane" which is the right panel
      let orderPane;
      if (showDoublePane) {
        orderPane = (
          <div>
            <div>
              <img
                className={classes.Image}
                src={eventLogo}
                alt="Event Logo Coming Soon!!!"
              />
            </div>
            <div style={OrderSummarySection}>{orderSummary}</div>
          </div>
        );
      } else {
        orderPane = (
          <Fragment>
            <div>
              <div style={OrderSummarySectionAlt}>{orderSummary}</div>
            </div>
            <div className={classes.EventFooterMod}>
              <div className={classes.CartLink}>{cartLink(showDoublePane)}</div>
              <div className={classes.TotalAmount}>
                {totalAmount(showDoublePane)}
              </div>
            </div>
          </Fragment>
        );
      }

      if (showDoublePane) {
        return (
          <div style={MainGrid}>
            {paymentPane}
            {orderPane}
          </div>
        );
      } else if (!showOrderSummaryOnly) {
        return <div style={MainGrid}>{paymentPane}</div>;
      } else {
        return <div style={MainGrid}>{orderPane}</div>;
      }
    } else return null;
  };

  const responseModal = () => {
    if (stripeModal.display) {
      return (
        <StripeModal
          show={true}
          details={stripeModal.message}
          closeModal={() => {
            let tempStripeModal = { ...stripeModal };
            tempStripeModal.display = false;
            setStripeModal(tempStripeModal);
          }}
        ></StripeModal>
      );
    } else return null;
  };

//  return (
//    <div style={MainContainer}>
//      {responseModal()}
//      {mainDisplay()}
//      {stripeSuccess()}
 //   </div>
 // );

console.log ("in 800");

  return (
    <div style={MainContainer}>
      {mainDisplay()}
    </div>
  );
};




const Checkout = () => {

  const [showDoublePane, setShowDoublePane] = useState(false); // defines single or double panel display on main page
  const [showOrderSummaryOnly, setShowOrderSummaryOnly] = useState(false); // defines panel display for a single panel display on main page
//  const [customerInformation, setCustomerInformation] = useState({});
  const [transactionInfo, setTransactionInfo] = useState({}); // defines transaction variables for display on confirmation page
  const [isRestyling, setIsRestyling] = useState(false); // defines styling variables

  let event = JSON.parse(localStorage.getItem("eventNum"));
  let tempCart = JSON.parse(localStorage.getItem(`cart_${event}`));
  let tempUser = JSON.parse(localStorage.getItem("user"));
  let isGuest = "guestInfo" in tempCart;

  if (!event || !tempCart) window.location.href ="/events";    // go to events of missing vars
  if (!tempUser && !isGuest ) window.location.href = `/et/${tempCart.eventDetails.vanityLink}?eventID=${tempCart.eventDetails.eventNum}`;

  // hearder 
  console.log("orderTotals: ", orderTotals);
  console.log("ticketInfo: ", ticketInfo);


  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let email = isGuest ? tempCart.guestInfo.email : tempUser.user.email;
  let name = isGuest ? `${tempCart.guestInfo.firstname} ${tempCart.guestInfo.lastname}` : `${tempUser.user.firstname} ${tempUser.user.lastname}`;
  let url = isGuest?  `${API}/tixorder/stripe/us-create-order` :  `${API}/tixorder/stripe/sn-create-order`;

 // sessionToken: tempUser.token,
 // userId: tempUser.user._id,

  let tickets = [];
  tempCart.ticketInfo.forEach((item) => {
    if (item.ticketsSelected !== 0) {
      tickets.push({
        ticketID: item.ticketID,
        ticketsSelected: item.ticketsSelected,
      });
    }
  });
  
    //let promoCode;
  let body = {
      totalAmount: tempCart.orderTotals.finalPurchaseAmount,
      eventNum: tempCart.eventDetails.eventNum,
      tickets: tickets,
    };

    if (tempCart?.promoCodeDetails?.appliedPromoCode !== "") {
      body.userPromo = tempCart.promoCodeDetails.appliedPromoCode;
    }

    if (isGuest) {
      body.guestFirstname = tempCart.guestInfo.firstname;
      body.guestLastname = tempCart.guestInfo.lastname;
      body.guestEmail = tempCart.guestInfo.email;
    } else {
      myHeaders.append("Authorization", `Bearer ${tempUser.token}`);
    };
    
    const method = "POST"
    const initialData = { status: true, message: "hi first time " };
    console.log ("url=", url);



    const { isLoading, hasError, setUrl, setBody, data, networkError } =
            useOurApi(method, url, myHeaders, body, initialData);




  window.onresize = function (event) {
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


 // toggles between "order pane" views
  const switchShowOrderSummary = (event) => {setShowOrderSummaryOnly(!showOrderSummaryOnly)};
    

  const appearance = {
    theme: "stripe",

    variables: {
      colorPrimary: "#0570de",
      colorBackground: "#ffffff",
      colorText: "#30313d",
      colorDanger: "#df1b41",
      fontFamily: "Ideal Sans, system-ui, sans-serif",
      spacingUnit: "2px",
      borderRadius: "4px",
      // See all possible variables below
    },
  };

  const options = () => {
      return {
        // passing the client secret obtained in step 2
        clientSecret: data.client_secret,
        // Fully customizable with appearance API.

        appearance: {
          appearance,
        },
      }
  }
  
  const showStripe = () => {
    console.log("clientSecret: ", data.client_secret);
    const stripePromise = loadStripe(`${OSD_STRIPE_ACCOUNT_ID}`, {
              stripeAccount: eventDetails.stripeAccountID})

    if ((!isLoading) && (!hasError) && data.client_secret) {
      return (
        <div>
          <Elements stripe={stripePromise} options={options()}>
            <CheckoutForm
              isLoading={isLoading}
              hasError={hasError}
              clientSecret={data.client_secret}
//              transactionInfo={transactionInfo}
              orderStatus={data.client_secret}
              orderFailure={(event) => {
                console.log("UNUCCESSFUL ORDER");

//                let tempStripeModal = { ...stripeModal };
//                tempStripeModal.display = true;
//                tempStripeModal.message = event;
//                setStripeModal(tempStripeModal);
              }}
              orderSuccess={() => {
                console.log("SUCCESSFUL ORDER");
//                setDisplay("confirmation");
              }}
            />
          </Elements>
        </div>
      );
    } else return null;
  };


 const totalAmount = (show) => {
    if (!show && orderTotals.ticketsPurchased > 0) {
      return (
        <div>
          {orderTotals.currencySym}
          {orderTotals.finalPurchaseAmount}
        </div>
      );
    } else return null;
  };
  // LOOKS GOOD
  // determines whether or not to display cart and arrow
  const cartLink = (show) => {
    if (!show) {
      return (
        <CartLink
          onClick={switchShowOrderSummary}
          showStatus={showOrderSummaryOnly}
          isLoading={isLoading}
          orderTotals={orderTotals}
          showDoublePane={showDoublePane}
        />
      );
    } else {
      return null;
    }
  };


  const mainDisplay = () => {

    if (isLoading) {
      return (
        <div className={classes.Spinner}>
          <Spinner></Spinner>;
        </div>
      );
    };
    
    if (hasError ) {
      return (
          <div className={classes.ConnectionText}>
            There is a problem in retrieving your information.
            Please try again later.
        </div>
      )
    };

 //   stylingUpdate(window.innerWidth, window.innerHeight);   //?

      let paymentPane = (
        <Fragment>
          <div className={classes.MainItemLeft}>
            <div className={classes.EventHeader}>
              <div className={classes.EventTitle}>
                {eventDetails.eventTitle}
              </div>
              <div className={classes.EventDate}>
                <DateRange
                  start={eventDetails.startDateTime}
                  end={eventDetails.endDateTime}
                />
              </div>
            </div>
            <div style={EventTicketSection}>
              <br></br>
              <span style={{ fontSize: "18px", fontWeight: "600" }}>
                Stripe Checkout
              </span>
              <br></br>
              <br></br>
              <span className={classes.TicketType}>Payment Information</span>
              <br></br>
              <span className={classes.TicketTypeSmall}>
                Select a Payment Method
              </span>
              <br></br>
              <br></br>
              {showStripe()}
            </div>
            <div className={classes.EventFooterMod}>
              <div className={classes.CartLink}>{cartLink(showDoublePane)}</div>
              <div className={classes.TotalAmount}>
                {totalAmount(showDoublePane)}
              </div>
            </div>
          </div>
        </Fragment>
      );

      // defines and sets "orderSummary" which is displayed in right panel
      let orderSummary;
      if (orderTotals.ticketsPurchased > 0) {
        orderSummary = (
          <OrderSummary
            cancel={true}
            eventNum={eventDetails.eventNum}
            vanity={eventDetails.vanityLink}
            ticketOrder={ticketInfo}
            ticketCurrency={orderTotals.currencySym}
          />
        );
      } else if (orderTotals.finalPurchaseAmount <= 0) {
        orderSummary = (
          <div className={classes.EmptyOrderSummary}>
            <ion-icon
              style={{ fontSize: "36px", color: "grey" }}
              name="cart-outline"
            />
          </div>
        );
      } else {
        orderSummary = null;
      }

      // defines and sets "orderPane" which is the right panel
      let orderPane;
      if (showDoublePane) {
        orderPane = (
          <div>
            <div>
              <img
                className={classes.Image}
                src={eventLogo}
                alt="Event Logo Coming Soon!!!"
              />
            </div>
            <div style={OrderSummarySection}>{orderSummary}</div>
          </div>
        );
      } else {
        orderPane = (
          <Fragment>
            <div>
              <div style={OrderSummarySectionAlt}>{orderSummary}</div>
            </div>
            <div className={classes.EventFooterMod}>
              <div className={classes.CartLink}>{cartLink(showDoublePane)}</div>
              <div className={classes.TotalAmount}>
                {totalAmount(showDoublePane)}
              </div>
            </div>
          </Fragment>
        );
      }

      if (showDoublePane) {
        return (
          <div style={MainGrid}>
            {paymentPane}
            {orderPane}
          </div>
        );
      } else if (!showOrderSummaryOnly) {
        return <div style={MainGrid}>{paymentPane}</div>;
      } else {
        return <div style={MainGrid}>{orderPane}</div>;
      }
  };



  if (isLoading) {
      return (
        <div style={MainContainer}>
          IS LOADING ...
       </div>
      )
  } else if (hasError) {
      return (
        <div style={MainContainer}>
          HAS ERROR!!!! ...
       </div>
      )
  } else {
    return (
        <div style={MainContainer}>
          Stripe Checkout
          {mainDisplay()}
       </div>
    )
  }
}



export default Checkout;
