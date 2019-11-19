import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faShoppingCart,
  faChevronUp,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";

import Aux from "../hoc/Auxiliary/Auxiliary";
import Spinner from "../components/UI/Spinner/Spinner";

import CocinaCandelaLogo from "../assets/Cocina_Candela/cocina-candela-large.jpg";
import OSDLogo from "../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_32.png";
import TicketItem from "./TicketItem";
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
  startDateTime: "Wed Dec 18, 2019 8:00 PM",
  endDateTime: "Wed Dec 18, 2019 11:00 PM",
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
  ticket2Name: "General Admission + 2 drinks",
  ticket2Description:
    "Full seven course meal, 2 drinks and live entertainment.",
  ticket2sAvailable: 30,
  ticket2Price: 100,
  ticket3Name: "VIP",
  ticket3Description:
    "Full seven course meal and live entertainment with seat next to the stage.",
  ticket3sAvailable: 30,
  ticket3Price: 125,
  ticket4Name: "VIP + 2 drinks",
  ticket4Description:
    "Full seven course meal, 2 drinks and live entertainment with seat next to the stage.",
  ticket4sAvailable: 30,
  ticket4Price: 150,
  ticket5Name: "VIP + 2 drinks and band introduction",
  ticket5Description:
    "Full seven course meal, 2 drinks and live entertainment with seat next to the stage. You also get to meet the band before they go on stage",
  ticket5sAvailable: 30,
  ticket5Price: 225
};

const TicketSelection = () => {
  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  const [ticketPurchase, setTicketPurchase] = useState({
    eventNum: eventDetails.eventNum,
    eventName: eventDetails.eventTitle,
    ticketPrice: eventDetails.ticketPrice,
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
    setIsLoading(false);
    // determines initial window width and then
    // determines a one or two pane display
    if (window.innerWidth < 790) {
      setShowDoublePane(false);
    } else {
      setShowDoublePane(true);
    }
  }, []);

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

  // **DECISION CODE**
  // **NOTED**
  // toggles between "order pane" views
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
        <Link to="/checkoutCURRENT">Checkout</Link>
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
        <hr style={{ border: "1px solid#B2B2B2" }} />
        <div className={styles.RightGrid}>
          <div style={{ fontWeight: "600" }}>Total</div>
          <div style={{ textAlign: "right" }}>
            ${ticketPurchase.ticketsSelected * ticketPurchase.ticketPrice}
          </div>
        </div>
      </Aux>
    );
  } else {
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
  }

  // **DECISION CODE**
  // **NOTED**
  let orderPane;

  // **DECISION CODE**
  // **NOTED**
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
          <div style={{ textAlign: "right" }}>{checkoutButton}</div>
        </div>
      </Aux>
    );
  }

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  ticket2 = {
    ticketName: eventDetails.ticket2Name,
    ticketPrice: eventDetails.ticket2Price,
    ticketsSelected: ticketPurchase.ticket2sSelected,
    ticketDescription: eventDetails.ticket2Description
  };

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  ticket3 = {
    ticketName: eventDetails.ticket3Name,
    ticketPrice: eventDetails.ticket3Price,
    ticketsSelected: ticketPurchase.ticket3sSelected,
    ticketDescription: eventDetails.ticket3Description
  };

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  ticket4 = {
    ticketName: eventDetails.ticket4Name,
    ticketPrice: eventDetails.ticket4Price,
    ticketsSelected: ticketPurchase.ticket4sSelected,
    ticketDescription: eventDetails.ticket4Description
  };

  // THIS SECTION IS NOT DEPENDENT UPON SCREEN SIZE OR VIEW CONDITIONS
  ticket5 = {
    ticketName: eventDetails.ticket5Name,
    ticketPrice: eventDetails.ticket5Price,
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
  // **NOTED**
  let ticketPane = (
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
              ${eventDetails.ticketPrice}
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
                  purchaseAmount: event.target.value * eventDetails.ticketPrice,
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
  // **NOTED**
  let mainDisplay = null;
  if (showDoublePane) {
    mainDisplay = (
      <Aux>
        <div className={styles.MainGrid}>
          {ticketPane}
          {orderPane}
        </div>
      </Aux>
    );
  } else if (!showOrderSummaryOnly) {
    mainDisplay = (
      <Aux>
        <div className={styles.MainGrid}>{ticketPane}</div>
      </Aux>
    );
  } else {
    mainDisplay = (
      <Aux>
        <div className={styles.MainGrid}>{orderPane}</div>
      </Aux>
    );
  }

  // FULLY STYLED
  return (
    <Aux>
      <div className={styles.MainContainer}>{mainDisplay}</div>
    </Aux>
  );
};

export default TicketSelection;
