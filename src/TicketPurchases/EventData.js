import React, { useState, useEffect } from "react";

import { NavLink } from "react-router-dom";
import queryString from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faChevronUp,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";

import Aux from "../hoc/Auxiliary/Auxiliary";
import { getEventData } from "./apiCore";
import { getDateStr } from "../components/formuals";
import Spinner from "../components/UI/Spinner/Spinner";

import OSDLogo from "../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_32.png";
import TicketItem from "./TicketItem";
import styles from "./Order.module.css";

// defines an event's NON ticket type specific information
let eventDetails;

// defines ticket order object
// contains event information and ticket type specific data
// this object is sent to "Checkout" page
let ticketOrder;

const EventData = () => {
  const [isLoading, setIsLoading] = useState(true);
  // defines an event's specific ticket type information
  // also tracks the number of tickets selected throughout selection process
  const [ticketInfo, setTicketInfo] = useState([]);

  useEffect(() => {
    eventData(queryString.parse(window.location.search).eventID);
  }, []);

  const eventData = eventID => {
    getEventData(eventID)
      .then(res => {
        console.log("Event Data Received: ", res);
        loadEventDetails(res);
        loadTicketInfo(res.ticket);
        createTicketOrder(res);
      })
      .catch(err => {
        console.log("In the catch");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const loadEventDetails = event => {
    const formattedDateTime = new Date(event.startDateTime);
    eventDetails = {
      eventNum: event.eventNum,
      eventTitle: event.eventTitle,
      eventCategory: event.eventCategory,
      eventStatus: event.eventStatus,
      longDescription: event.longDescription,
      organizer: event.organizerName,
      shortDescription: event.shortDescription,
      startDateTime: getDateStr(formattedDateTime),
      endDateTime: event.endDateTime,
      organizerUrl: event.organizerUrl,
      eventUrl: event.eventUrl,
      location: {
        venueName: event.locationVenueName,
        address1: event.locationAddress1,
        address2: "",
        city: "Montclair",
        state: event.locationState,
        zipPostalCode: event.locationZipPostalCode,
        countryCode: event.locationCountryCode
      },
      image: ""
    };
  };

  const loadTicketInfo = ticket => {
    let tempTicketArray = [];
    ticket.map(item => {
      const tempTicketItem = {
        ticketID: item._id,
        ticketType: item.ticketType,
        ticketName: item.ticketName,
        ticketDescription: item.ticketDescription,
        ticketsAvailable: item.remainingQuantity,
        ticketPrice: item.currentTicketPrice,
        ticketsSelected: 0,
        maxTicketOrder: item.maxTicketsAllowedPerOrder,
        minTicketOrder: item.minTicketsAllowedPerOrder
      };
      tempTicketArray.push(tempTicketItem);
    });
    setTicketInfo(tempTicketArray);
  };

  const createTicketOrder = event => {
    const ticketParameters = [];
    event.ticket.map(item => {
      const newTicketItem = {
        ticketID: item._id,
        ticketPrice: item.currentTicketPrice,
        ticketName: item.ticketName,
        ticketsSelected: 0,
        ticketPurchaseAmount: 0
      };
      ticketParameters.push(newTicketItem);
    });
    ticketOrder = {
      eventNum: event.eventNum,
      eventUrl: event.eventUrl,
      eventName: event.eventTitle,
      startDateTime: event.startDateTime,
      endDateTime: event.endDateTime,
      totalPurchaseAmount: 0,
      tickets: ticketParameters
    };
    console.log("ticketOrder: ", ticketOrder);
  };

  let eventTitle;

  if (!isLoading) {
    eventTitle = (
      <Aux>
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "clip ellipsis",
            fontSize: "1.125rem",
            fontWeight: "600"
          }}
        >
          {eventDetails.eventTitle}
        </div>
        <div
          style={{
            fontSize: "1.0rem",
            fontWeight: "400"
          }}
        >
          {eventDetails.startDateTime}
        </div>
      </Aux>
    );
  } else {
    eventTitle = null;
  }

  const updateTicketsSelected = (event, ticketType) => {
    let tempTicketInfo = [...ticketInfo];
    tempTicketInfo.map(item => {
      if (item.ticketID === ticketType.ticketID) {
        item.ticketsSelected = event.target.value;
      }
    });
    setTicketInfo(tempTicketInfo);
    ticketOrder.tickets.map(item => {
      if (item.ticketID === ticketType.ticketID) {
        item.ticketsSelected = parseInt(ticketType.ticketsSelected);
        item.ticketPurchaseAmount = item.ticketsSelected * item.ticketPrice;
      }
    });
    let tempTotalPurchaseAmount = 0;
    ticketOrder.tickets.map(item => {
      tempTotalPurchaseAmount += item.ticketPurchaseAmount;
    });
    ticketOrder.totalPurchaseAmount = tempTotalPurchaseAmount;
    console.log("ticketOrder.tickets: ", ticketOrder.tickets);
    console.log("ticketOrder: ", ticketOrder);
  };

  let ticketItems;

  if (!isLoading) {
    ticketItems = (
      <Aux>
        <div>
          {ticketInfo.map(item => {
            return (
              <Aux>
                <TicketItem
                  name={item}
                  key={item._id}
                  onChange={event => {
                    updateTicketsSelected(event, item);
                  }}
                ></TicketItem>
              </Aux>
            );
          })}
        </div>
      </Aux>
    );
  } else {
    ticketItems = (
      <Aux>
        <Spinner></Spinner>
      </Aux>
    );
  }

  let orderSummary;

  if (!isLoading && ticketOrder.totalPurchaseAmount > 0) {
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
  } else if (!isLoading && ticketOrder.totalPurchaseAmount <= 0) {
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
    orderSummary = "Not loaded Yet";
  }

  return (
    <Aux>
      <div className={styles.MainContainer}>
        <div className={styles.MainGrid}>
          <div className={styles.MainItemLeft}>
            <div className={styles.EventHeader}>{eventTitle}</div>
            <div className={styles.EventTicketSection}>
              {ticketItems}
              <div className={styles.EventDescription}>
                Powered by{" "}
                <NavLink to="/" exact>
                  <img src={OSDLogo} alt="OpenSeatDirect Logo" />
                </NavLink>
              </div>
            </div>
            <br></br>
          </div>
          <div>
            <div className={styles.ImageBox}>Logo Coming Soon!!!</div>
            <div className={styles.OrderSummary}>
              <br></br>
              <div>{orderSummary}</div>
            </div>
          </div>
        </div>
      </div>
    </Aux>
  );
};

export default EventData;
