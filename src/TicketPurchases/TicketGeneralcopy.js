import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import queryString from "query-string";

import Aux from "../hoc/Auxiliary/Auxiliary";
import { getEventData } from "./apiCore";
import { getDateStr } from "../components/formuals";
import Spinner from "../components/UI/Spinner/Spinner";

import CocinaCandelaLogo from "../assets/Cocina_Candela/cocinacandela21NEW.jpg";
import OSDLogo from "../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_32.png";
import TicketItem from "./TicketItemcopy";
import styles from "./Order.module.css";

// hard coded event information
// THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
const eventDetails = {
  eventNum: "94106331593",
  //eventName: "Private Puerto Rican Dinner",
  eventTitle: "Cocina Candela - Chef's Table Dinner",
  eventCategory: "Food&Drink",
  eventStatus: "Scheduled",
  longDescription:
    "Experience a Puerto Rican gastronomy honoring the traditions of Taíno roots and the purity of ingredients. Prepared by Kenny Candelaria who's culinary career began as a child, preparing meals on the fogón with his grandparents in Puerto Rico and refined throughout the years by choosing the most natural, local ingredients available to him.",
  shortDescription: "An orgy of Puerto Rican food. No contraception required.",
  image: "",
  startDateTime: "December 18, 2019 - 8 PM",
  endDateTime: "2019-12-06 09:00:00.000Z",
  location: {
    venueName: "Cocina Candela",
    address1: "706 Bloomfield Ave",
    address2: "",
    city: "Montclair",
    state: "NJ",
    zipPostalCode: "07042"
  },
  organizerName: "Dahday",
  organizerUrl: "https://www.dahday.com/",
  eventURL: "/dahday-puertoricandinner",
  ticketName: "General Admission",
  ticketDescription: "Full seven course meal and live entertainment.",
  ticketsAvailable: 30,
  ticketPrice: 75,
  ticketFee: 0,
  ticket2Name: "General Admission + 2 drinks",
  ticket2Description:
    "Full seven course meal, 2 drinks and live entertainment.",
  ticket2sAvailable: 30,
  ticket2Price: 100,
  ticket2Fee: 0,
  ticket3Name: "VIP",
  ticket3Description:
    "Full seven course meal and live entertainment with seat next to the stage.",
  ticket3sAvailable: 30,
  ticket3Price: 125,
  ticket3Fee: 0,
  ticket4Name: "VIP + 2 drinks",
  ticket4Description:
    "Full seven course meal, 2 drinks and live entertainment with seat next to the stage.",
  ticket4sAvailable: 30,
  ticket4Price: 150,
  ticket4Fee: 0,
  ticket5Name: "VIP + 2 drinks and band introduction",
  ticket5Description:
    "Full seven course meal, 2 drinks and live entertainment with seat next to the stage. You also get to meet the band before they go on stage",
  ticket5sAvailable: 30,
  ticket5Price: 225,
  ticket5Fee: 0
};

const SingleEvent = () => {
  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  const [ticketPurchase, setTicketPurchase] = useState({
    eventNum: eventDetails.eventNum,
    eventName: eventDetails.eventTitle,
    ticketPrice: eventDetails.ticketPrice,
    ticketFee: eventDetails.ticketFee,
    ticketsSelected: 0,
    purchaseAmount: 0,
    ticketUrl: ""
  });

  // **DECISION CODE**
  // **NOTED**
  const [showDoublePane, setShowDoublePane] = useState(false);

  // **DECISION CODE**
  // **NOTED**
  const [showOrderSummaryOnly, setShowOrderSummaryOnly] = useState(false);

  // **DECISION CODE**
  // **NEED TO NOTE**
  const [showTicketSelection, setShowTicketSelection] = useState(true);

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  const [isLoading, setIsLoading] = useState(true);

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  let ticket2;
  let ticket3;
  let ticket4;
  let ticket5;

  // **DECISION CODE**
  // **NOTED**
  useEffect(() => {
    setIsLoading(true);
    // determines initial window width and then
    // determines a one or two pane display
    if (window.innerWidth < 790) {
      setShowDoublePane(false);
    } else {
      setShowDoublePane(true);
    }
    eventData(queryString.parse(window.location.search).eventID);
  }, []);

  // defines the function that retrieves the Braintree token
  // this represents parts "1" and "2" of the Braintree interaction
  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  const eventData = eventID => {
    setIsLoading(true);
    getEventData(eventID)
      .then(res => {
        loadTicketInfo(res.ticket);
        mapLoadTicketInfo(res.ticket);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  let ticketInfoArray = [];

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  const ticketInfo = {
    ticketID: "empty",
    ticketType: "empty",
    ticketName: "empty",
    ticketDescription: "empty",
    ticketsAvailable: 0,
    ticketPrice: 0,
    ticketFee: 0,
    ticketsSelected: 0,
    maxTicketOrder: 0,
    minTicketOrder: 0
  };

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  const mapLoadTicketInfo = ticket => {
    setIsLoading(true);
    ticket.map(item => {
      const newTicketItem = {
        ticketID: item._id,
        ticketType: item.ticketType,
        ticketName: item.ticketName,
        ticketDescription: item.ticketDescription,
        ticketsAvailable: item.remainingQuantity,
        ticketPrice: item.currentTicketPrice,
        ticketFee: 0,
        ticketsSelected: ticketPurchase.ticket2sSelected,
        maxTicketOrder: item.maxTicketsAllowedPerOrder,
        minTicketOrder: item.minTicketsAllowedPerOrder
      };
      ticketInfoArray.push(newTicketItem);
    });
    setIsLoading(false);
  };

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  const loadTicketInfo = ticket => {
    setIsLoading(true);
    ticketInfo.ticketID = ticket[0]._id;
    ticketInfo.ticketType = ticket[0].ticketType;
    ticketInfo.ticketName = ticket[0].ticketName;
    ticketInfo.ticketDescription = ticket[0].ticketDescription;
    ticketInfo.ticketsAvailable = ticket[0].remainingQuantity;
    ticketInfo.ticketPrice = ticket[0].currentTicketPrice;
    ticketInfo.maxTicketOrder = ticket[0].maxTicketsAllowedPerOrder;
    ticketInfo.minTicketOrder = ticket[0].minTicketsAllowedPerOrder;
    console.log("Ticket Info: ", ticketInfo);

    setIsLoading(false);
  };

  // **DECISION CODE**
  // **NOTED**
  window.onresize = function(event) {
    // dynamically determines window width and then
    // determines a one or two pane display
    if (window.innerWidth < 790) {
      setShowDoublePane(false);
    } else {
      setShowDoublePane(true);
    }
  };

  // determines whether or not to display the purchase amount
  // "showDoublePane" must be false and "tickets.selected" must be > 0
  // **DECISION CODE**
  // **NOTED**
  const totalAmount = show => {
    if (!show && ticketPurchase.purchaseAmount > 0) {
      return <div>${ticketPurchase.purchaseAmount}</div>;
    } else {
      return null;
    }
  };

  // determines whether or not to display the cart and arrow
  // "showDoublePane" must be false
  // **DECISION CODE**
  // **NOTED**
  const cartLink = show => {
    if (!show) {
      return (
        <div>
          <button
            onClick={switchShowOrderSummary}
            style={{
              color: "black",
              fontWeight: "600"
            }}
          >
            CART
          </button>
          <button
            onClick={switchShowOrderSummary}
            style={{
              color: "black",
              fontWeight: "600"
            }}
          >
            arrow
          </button>
        </div>
      );
    } else {
      return null;
    }
  };

  // **DECISION CODE**
  // **NEED TO NOTE**
  // I THINK THIS SWITCHES THE VALUE OF showDoublePane
  const switchShowOrderSummary = event => {
    if (showOrderSummaryOnly) {
      setShowOrderSummaryOnly(false);
    } else {
      setShowOrderSummaryOnly(true);
    }
  };

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  const purchaseTicketHandler = event => {
    if (typeof window !== "undefined") {
      // "localStorage" property allows access the Storage object for a document's origin
      // the stored data is saved across browser sessions and has no expiration time, even when window is closed
      // "setItem()" adds order information to "localStorage" with a key of "order" and a value of "JSON.stringify(data)"
      localStorage.setItem("order", JSON.stringify(ticketPurchase));
    }
  };

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  let checkoutButton = null;

  // NEED TO STYLE
  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  if (ticketPurchase.ticketsSelected > 0) {
    checkoutButton = (
      <button
        onClick={purchaseTicketHandler}
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
        <Link to="/checkout">Checkout</Link>
      </button>
    );
  } else {
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
        Checkout
      </button>
    );
  }

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  let orderSummary = null;

  // FULLY STYLED
  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  if (ticketPurchase.ticketsSelected > 0) {
    orderSummary = (
      <Aux>
        <div style={{ fontWeight: "600" }}>Order Summary</div>
        <br></br>
        <div className={styles.RightGrid}>
          <div style={{ fontWeight: "400" }}>
            {ticketPurchase.ticketsSelected} X {eventDetails.ticketName}
          </div>
          <div style={{ textAlign: "right" }}>
            ${ticketPurchase.ticketsSelected * ticketPurchase.ticketPrice}{" "}
          </div>
        </div>
        <hr style={{ border: "1px solid#B2B2B2" }} />
        <div className={styles.RightGrid}>
          <div style={{ fontWeight: "400" }}>Subtotal</div>
          <div style={{ textAlign: "right" }}>
            ${ticketPurchase.ticketsSelected * ticketPurchase.ticketPrice}{" "}
          </div>
        </div>
        <div className={styles.RightGrid}>
          <div style={{ fontWeight: "400" }}>Fees</div>
          <div style={{ textAlign: "right" }}>
            ${ticketPurchase.ticketsSelected * ticketPurchase.ticketFee}{" "}
          </div>
        </div>
        <hr style={{ border: "1px solid#B2B2B2" }} />
        <div className={styles.RightGrid}>
          <div style={{ fontWeight: "600" }}>Total</div>
          <div style={{ textAlign: "right" }}>
            $
            {ticketPurchase.ticketsSelected *
              (ticketPurchase.ticketPrice + ticketPurchase.ticketFee)}
          </div>
        </div>
      </Aux>
    );
  } else {
    orderSummary = <div>Your Cart is Empty. Buy something!!!</div>;
  }

  // **DECISION CODE**
  // **NOTED**
  let rightPane;

  // **DECISION CODE**
  // **NOTED**
  if (showDoublePane) {
    rightPane = (
      <div>
        <div className={styles.ImageBox}>
          <img alt="Cocina Candela Logo" />
        </div>
        <div className={styles.OrderSummary}>{orderSummary}</div>
      </div>
    );
  } else {
    rightPane = null;
  }

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  ticket2 = {
    ticketName: eventDetails.ticket2Name,
    ticketPrice: eventDetails.ticket2Price,
    ticketFee: eventDetails.ticket2Fee,
    // NEED TO REFACTOR "ticketsSelected"
    ticketsSelected: ticketPurchase.ticket2sSelected,
    ticketDescription: eventDetails.ticket2Description
  };

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  ticket3 = {
    ticketName: eventDetails.ticket3Name,
    ticketPrice: eventDetails.ticket3Price,
    ticketFee: eventDetails.ticket3Fee,
    // NEED TO REFACTOR "ticketsSelected"
    ticketsSelected: ticketPurchase.ticket3sSelected,
    ticketDescription: eventDetails.ticket3Description
  };

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  ticket4 = {
    ticketName: eventDetails.ticket4Name,
    ticketPrice: eventDetails.ticket4Price,
    ticketFee: eventDetails.ticket4Fee,
    // NEED TO REFACTOR "ticketsSelected"
    ticketsSelected: ticketPurchase.ticket4sSelected,
    ticketDescription: eventDetails.ticket4Description
  };

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  ticket5 = {
    ticketName: eventDetails.ticket5Name,
    ticketPrice: eventDetails.ticket5Price,
    ticketFee: eventDetails.ticket5Fee,
    // NEED TO REFACTOR "ticketsSelected"
    ticketsSelected: ticketPurchase.ticket5sSelected,
    ticketDescription: eventDetails.ticket5Description
  };

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  let ticketTypes = null;

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  if (isLoading) {
    ticketTypes = (
      <Aux>
        <Spinner></Spinner>
      </Aux>
    );
  } else {
    ticketTypes = (
      <Aux>
        <TicketItem name={ticket2}></TicketItem>
        <TicketItem name={ticket3}></TicketItem>
        <TicketItem name={ticket4}></TicketItem>
        <TicketItem name={ticket5}></TicketItem>
      </Aux>
    );
  }

  // **DECISION CODE**
  let mainDisplay = null;
  let ticketSelection = (
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
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {eventDetails.eventTitle}
          </span>
        </div>
        <div
          style={{
            fontSize: "1.0rem",
            fontWeight: "400"
          }}
        >
          {eventDetails.startDateTime}
        </div>
      </div>
      <div className={styles.EventTicketSection}>
        <div className={styles.LeftGrid}>
          <div>
            <div className={styles.TicketType}>{eventDetails.ticketName}</div>
            <div className={styles.TicketPrices}>
              ${eventDetails.ticketPrice} +
              <span className={styles.TicketFees}>
                ${eventDetails.ticketFee} Fee
              </span>
            </div>
          </div>
          <div className={styles.TicketAmount}>
            <select
              type="number"
              name="ticketsSelected"
              required
              value={ticketPurchase.ticketsSelected}
              className={styles.SelectionBox}
              onChange={event => {
                setTicketPurchase({
                  ...ticketPurchase,
                  ticketsSelected: event.target.value,
                  purchaseAmount:
                    event.target.value *
                    (eventDetails.ticketPrice + eventDetails.ticketFee),
                  ticketUrl: window.location.href
                });
              }}
            >
              <option>0</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
          </div>
        </div>
        <div className={styles.EventDescription}>
          {eventDetails.ticketDescription}
        </div>
        <hr style={{ border: "1px solid#F2F2F2" }} />
        {ticketTypes}
        <div className={styles.EventDescription}>
          Powered by{" "}
          <NavLink to="/" exact>
            <img src={OSDLogo} alt="OpenSeatDirect Logo" />
          </NavLink>
        </div>
        <br></br>
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
        <div style={{ textAlign: "right" }}>{checkoutButton}</div>
      </div>
    </div>
  );

  // **DECISION CODE**
  if (showDoublePane) {
    mainDisplay = (
      <Aux>
        {ticketSelection}
        {rightPane}
      </Aux>
    );
  } else if (!showOrderSummaryOnly) {
    mainDisplay = (
      <Aux>
        {ticketSelection}
        {rightPane}
      </Aux>
    );
  } else {
    mainDisplay = (
      <Aux>
        <div>
          <div className={styles.OrderSummaryMinView}>{orderSummary}</div>
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
          <div style={{ textAlign: "right" }}>{checkoutButton}</div>
        </div>
      </Aux>
    );
  }

  // FULLY STYLED
  return (
    <Aux>
      <div className={styles.MainContainer}>
        <div className={styles.MainGrid}>{mainDisplay}</div>
      </div>
    </Aux>
  );
};

export default SingleEvent;
