import React, { useState, useEffect } from "react";

import { NavLink } from "react-router-dom";
import queryString from "query-string";

import Aux from "../hoc/Auxiliary/Auxiliary";
import { getEventData } from "./apiCore";
import Spinner from "../components/UI/Spinner/Spinner";

import OSDLogo from "../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_32.png";
import TicketItem from "./TicketItemcopy";
import styles from "./Order.module.css";

// defines an event's NON ticket type specific information
let eventDetails;

// defines ticket order object
// contains event information and ticket type specific data
// this object is sent to "Checkout" page
let ticketOrder;

const EventData = () => {
  // temporary variable
  const [ticketsSelected, setTicketsSelected] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  // defines an event's specific ticket type information
  // also tracks the number of tickets selected throughout selection process
  const [ticketInfo, setTicketInfo] = useState([
    {
      ticketID: "",
      ticketType: "",
      ticketName: "",
      ticketDescription: "",
      ticketsAvailable: 0,
      ticketPrice: 0,
      ticketsSelected: 0,
      maxTicketOrder: 0,
      minTicketOrder: 0
    }
  ]);

  useEffect(() => {
    setIsLoading(true);
    eventData(queryString.parse(window.location.search).eventID);
  }, []);

  const eventData = eventID => {
    getEventData(eventID)
      .then(res => {
        console.log("Event Data Received NOW", res);
        console.log("Ticket Info: ", res.ticket);
        console.log("Event Title: ", res.eventTitle);
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

  const createTicketOrder = event => {
    console.log("event in createTicketOrder: ", event);
    const ticketParameters = [];
    console.log("event.ticket in createTicketOrder :", event.ticket);
    event.ticket.map(item => {
      const newTicketItem = {
        ticketID: item._id,
        ticketPrice: item.currentTicketPrice,
        ticketsSelected: 0,
        ticketPurchaseAmount: 0
      };
      ticketParameters.push(newTicketItem);
    });
    console.log("ticketParameters: ", ticketParameters);
    ticketOrder = {
      eventNum: event.eventNum,
      eventName: event.eventTitle,
      tickets: ticketParameters
    };
    console.log("ticketOrder: ", ticketOrder);
  };

  const loadEventDetails = event => {
    eventDetails = {
      eventNum: event.eventNum,
      eventTitle: event.eventTitle,
      eventCategory: event.eventCategory,
      eventStatus: event.eventStatus,
      longDescription: event.longDescription,
      organizer: event.organizerName,
      shortDescription: event.shortDescription,
      startDateTime: event.startDateTime,
      endDateTime: event.endDateTime,
      organizerUrl: event.organizerUrl,
      eventURL: event.eventURL,
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

    console.log("eventDetails: ", eventDetails);
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
    console.log("ticketInfo: ", ticketInfo);
  };

  let eventTitle;

  if (!isLoading) {
    eventTitle = (
      <Aux>
        <div
          style={{
            textOverflow: "clip ellipsis",
            fontSize: "1.125rem",
            fontWeight: "600"
          }}
        >
          {eventDetails.organizerName} Present:{" "}
          {eventDetails.location.venueName} - {eventDetails.eventTitle}
        </div>
        <div
          style={{
            fontSize: "1.0rem",
            fontWeight: "400"
          }}
        >
          {eventDetails.location.address1}, {eventDetails.location.city},{" "}
          {eventDetails.location.state}, {eventDetails.location.zipPostalCode} -{" "}
          {eventDetails.startDateTime}
        </div>
      </Aux>
    );
  } else {
    eventTitle = null;
  }

  let ticketItems;

  /*
    onChange={event => {
        setTicketPurchase({
            ...ticketPurchase,
            ticketsSelected: event.target.value,
            purchaseAmount:
                event.target.value *
                (eventDetails.currentTicketPrice +
                eventDetails.currentTicketFee),
            ticketUrl: window.location.href
        });
    }}
*/

  const updateTicketsSelected = (event, ticketType) => {
    console.log("Inside updateTicketsSelected()");
    console.log("ticketInfo[n]: ", ticketType);
    console.log(
      "Current value of ticketInfo[n].ticketsSelected: ",
      ticketType.ticketsSelected
    );
    ticketType.ticketsSelected = event.target.value;
    console.log(
      "New value of ticketInfo[n].ticketsSelected: ",
      ticketType.ticketsSelected
    );
    setTicketsSelected(ticketType.ticketsSelected);
    console.log("New value of ticketType.ticketsSelected: ", ticketsSelected);
  };

  if (!isLoading) {
    ticketItems = (
      <Aux>
        <TicketItem
          name={ticketInfo[0]}
          onChange={event => {
            updateTicketsSelected(event, ticketInfo[0]);
          }}
        ></TicketItem>
        <TicketItem
          name={ticketInfo[1]}
          onChange={event => {
            updateTicketsSelected(event, ticketInfo[1]);
          }}
        ></TicketItem>
        <TicketItem
          name={ticketInfo[2]}
          onChange={event => {
            updateTicketsSelected(event, ticketInfo[2]);
          }}
        ></TicketItem>
        <TicketItem
          name={ticketInfo[3]}
          onChange={event => {
            updateTicketsSelected(event, ticketInfo[3]);
          }}
        ></TicketItem>
        <TicketItem
          name={ticketInfo[4]}
          onChange={event => {
            updateTicketsSelected(event, ticketInfo[4]);
          }}
        ></TicketItem>
      </Aux>
    );
  } else {
    ticketItems = (
      <Aux>
        <Spinner></Spinner>
      </Aux>
    );
  }

  // TEMP CODE
  let ticketInfoTicketsSelected;

  if (!isLoading) {
    ticketInfoTicketsSelected = (
      <Aux>
        ticketInfo[0].ticketsSelected: {ticketInfo[0].ticketsSelected}
        <br></br>
        ticketInfo[1].ticketsSelected: {ticketInfo[1].ticketsSelected}
        <br></br>
        ticketInfo[2].ticketsSelected: {ticketInfo[2].ticketsSelected}
        <br></br>
        ticketInfo[3].ticketsSelected: {ticketInfo[3].ticketsSelected}
        <br></br>
        ticketInfo[4].ticketsSelected: {ticketInfo[4].ticketsSelected}
      </Aux>
    );
  } else {
    ticketInfoTicketsSelected = "Not loaded Yet";
  }
  // TEMP CODE

  // FULLY STYLED
  return (
    <Aux>
      <div className={styles.MainContainer}>
        <div className={styles.MainGrid}>
          <div className={styles.MainItemLeft}>
            <div className={styles.EventHeader}>{eventTitle}</div>
            <div className={styles.EventTicketSection}>
              <div className={styles.SectionHeader}>Tickets DATA DRIVEN</div>
              <hr style={{ border: "1px solid#F2F2F2" }} />
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
              Order Summary Coming Soon!
              <br></br>
              <br></br>
              <div>{ticketInfoTicketsSelected}</div>
            </div>
          </div>
        </div>
      </div>
    </Aux>
  );
};

export default EventData;
