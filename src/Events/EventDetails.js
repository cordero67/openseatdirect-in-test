import React, { useState, useEffect } from "react";
import queryString from "query-string";
import dateFormat from "dateformat";
import ReactHtmlParser from "react-html-parser";

import { getEventData, getEventImage } from "./apiEvents";

import styles from "./EventDetails.module.css";
import Aux from "../hoc/Auxiliary/Auxiliary";
import Spinner from "../components/UI/Spinner/SpinnerNew";

import DefaultLogo from "../assets/Get_Your_Tickets.png";

// defines an event's NON ticket type specific information
let eventDetails;

// defines an event's image
let eventLogo;

const EventDetail = () => {
  // defines data loading control variables
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [isSuccessfull, setIsSuccessfull] = useState(true);
  const [showLargerDoublePane, setShowLargerDoublePane] = useState(false);
  const [showSmallerDoublePane, setShowSmallerDoublePane] = useState(false);

  useEffect(() => {
    eventData(queryString.parse(window.location.search).eventID);
    stylingUpdate(window.innerWidth, window.innerHeight);
  }, []);

  // executes all api calls to the sever
  const eventData = (eventID) => {
    getEventData(eventID)
      .then((res) => {
        console.log(
          "EVENT DATA OBJECT received from Server in 'getEventData()': ",
          res
        );
        loadEventDetails(res);
        getEventImage(eventID)
          .then((res) => {
            console.log(
              "EVENT IMAGE received from Server in 'getEventData()': ",
              res
            );
            eventLogo = res;
          })
          .catch((err) => {
            eventLogo = DefaultLogo;
          })
          .finally(() => {
            setIsLoadingEvent(false);
          });
      })
      .catch((err) => {
        // NEED TO ADDRESS THESE SITUATIONS
        if (err === "Error: Error: 400") {
        }
        if (err === undefined) {
        }
        setIsSuccessfull(false);
        setIsLoadingEvent(false);
      })
      .finally(() => {});
  };

  const loadEventDetails = (event) => {
    let ticketStatus;
    ticketStatus = false;
    let tempTickets = null;

    console.log("now: ", Date.now());
    let d = Date.parse(event.startDateTime) + 86400;
    console.log("d: ", d);
    console.log("d+: ", d + 86400);
    console.log("event.tickets: ", event.tickets);

    if ("tickets" in event && event.tickets.length > 0 && Date.now() < d) {
      ticketStatus = true;
      tempTickets = event.tickets;
    }
    console.log("tempTickets: ", tempTickets);

    // defines the eniter "eventDetails" variable
    eventDetails = {
      eventNum: event.eventNum, //
      eventTitle: event.eventTitle, //
      eventType: event.eventType, //
      isDraft: event.isDarft, //
      eventCategory: event.eventCategory, //
      regFunc: event.regFunc,
      facebookLink: event.facebookLink, //
      twitterLink: event.twitterLink, //
      instagramLink: event.instagramLink, //
      linkedinLink: event.linkedinLink, //
      organizer: "", // Need to add this field to "Event" object from server
<<<<<<< HEAD
      organizerEmail: event.accountId.accountEmail, //
      startDateTime: event.startDateTime, //
      endDateTime: event.endDateTime, //
      timeZone: event.timeZone, //
      eventUrl: event.eventUrl, //
      refundPolicy: event.refundPolicy, //
      locationVenueName: event.locationVenueName, //
      locationAddress1: event.locationAddress1, //
      locationAddress2: event.locationAddress2, //
      locationCity: event.locationCity, //
      locationState: event.locationState, //
      locationZipPostalCode: event.locationZipPostalCode, //
      locationCountryCode: event.locationCountryCode, //
      locationNote: event.locationNote, //
      tbaInformation: event.tbaInformation, //
      webinarLink: event.webinarLink, //
      onlineInformation: event.onlineInformation, //
      shortDescription: event.shortDescription, //
      longDescription: event.longDescription, //
      tickets: tempTickets,
      //forSale: ticketStatus,
=======
      organizerEmail: event.accountId.accountEmail,//
      startDateTime: event.startDateTime,//
      endDateTime: event.endDateTime,//
      timeZone: event.timeZone,//
      eventUrl: event.eventUrl,//
      refundPolicy: event.refundPolicy,//
      locationVenueName: event.locationVenueName,//
      locationAddress1: event.locationAddress1,//
      locationAddress2: event.locationAddress2,//
      locationCity: event.locationCity,//
      locationState: event.locationState,//
      locationZipPostalCode: event.locationZipPostalCode,//
      locationCountryCode: event.locationCountryCode,//
      locationNote: event.locationNote,//
      tbaInformation: event.tbaInformation,//
      webinarLink: event.webinarLink,//
      onlineInformation: event.onlineInformation,//
      shortDescription: event.shortDescription,//
      longDescription: event.longDescription,//
      tickets: event.tickets,
      //forSale: ticketStatus, 
>>>>>>> master
    };
    console.log(
      "EVENT DETAILS variable in 'loadEventDetails()': ",
      eventDetails
    );
  };

  const stylingUpdate = (inWidth) => {
<<<<<<< HEAD
    console.log("width is ", inWidth);
=======
    console.log("width is ", inWidth)
>>>>>>> master
    // based on window width, displays one or two panes
    if (inWidth < 800) {
      setShowLargerDoublePane(false);
    } else {
      setShowLargerDoublePane(true);
    }
    if (inWidth < 730) {
      setShowSmallerDoublePane(false);
    } else {
      setShowSmallerDoublePane(true);
    }
  };

  window.onresize = function (event) {
    stylingUpdate(window.innerWidth);
  };

  let image = (
    <img
      className={styles.ImageBox}
      src={eventLogo}
      alt="Event Logo Coming Soon!!!"
    />
  );

  // link to "ticketSelection" page
  const ticketsHandler = () => {
    window.location.href = `/et/${eventDetails.eventUrl}?eventID=${eventDetails.eventNum}`;
  };

  const ticketPriceRange = () => {
    if (!isLoadingEvent) {
      console.log("Inside ticketPriceRange");
      console.log("eventDetails: ", eventDetails);
      let priceArray = [];
      if (eventDetails.ticket !== null && eventDetails.tickets) {
        console.log("We have tickets");
        eventDetails.tickets.map((item) => {
          priceArray.push(item.currentTicketPrice);
        });
      }

      let ticketCurrency;
      let pricision;
      if (priceArray.length >= 1) {
        if (eventDetails.tickets[0].currency === "USD") {
          ticketCurrency = "$";
          pricision = 2;
        } else if (eventDetails.tickets[0].currency === "JPY") {
          ticketCurrency = "¥";
          pricision = 0;
        } else {
          ticketCurrency = "$";
          pricision = 2;
        }
      }

      let ticketCurrency;
      let pricision;
      if (priceArray.length >= 1) {
        if (eventDetails.tickets[0].currency === "USD") {
          ticketCurrency = "$";
          pricision = 2;
        } else if (eventDetails.tickets[0].currency === "JPY") {
          ticketCurrency = "¥";
          pricision = 0;
        } else {
          ticketCurrency = "$";
          pricision = 2;
        }
      }

      if (priceArray.length > 1) {
        //console.log("Currency: ", eventDetails.tickets[0].currency);
        //let ticketCurrency = eventDetails.tickets[0].currency;
        return (
          <div>
<<<<<<< HEAD
            {ticketCurrency}
            {Math.min(...priceArray).toFixed(pricision)} - {ticketCurrency}
            {Math.max(...priceArray).toFixed(pricision)}
=======
            {ticketCurrency}{Math.min(...priceArray).toFixed(pricision)} - {ticketCurrency}{Math.max(...priceArray).toFixed(pricision)}
>>>>>>> master
          </div>
        );
      } else if (priceArray.length === 1) {
        //console.log("Currency: ", eventDetails.tickets[0].currency);
        //let ticketCurrency = eventDetails.tickets[0].currency;
        return (
          <div>
<<<<<<< HEAD
            {ticketCurrency}
            {Math.min(...priceArray).toFixed(pricision)}
=======
            {ticketCurrency}{Math.min(...priceArray).toFixed(pricision)}
>>>>>>> master
          </div>
        );
      } else {
        return <div>No tickets</div>;
      }
    } else {
      return null;
    }
  };

  const dateRange = () => {
    if (showSmallerDoublePane && !isLoadingEvent) {
      if (
        dateFormat(eventDetails.startDateTime, "m d yy", true) ===
        dateFormat(eventDetails.endDateTime, "m d yy", true)
      ) {
        return (
          <Aux>
            <div className={styles.TextLeft}>
              {dateFormat(eventDetails.startDateTime, "ddd, mmm d, yyyy", true)}
            </div>
            <div className={styles.TextLeft}>
              {dateFormat(eventDetails.startDateTime, "h:MM TT", true)}
              {" - "}
              {dateFormat(eventDetails.endDateTime, "h:MM TT", true)}
            </div>
          </Aux>
        );
      } else {
        return (
          <Aux>
            <div className={styles.TextLeft}>
              {dateFormat(
                eventDetails.startDateTime,
                "ddd, mmm d, yyyy - h:MM TT",
                true
              )}
            </div>
            <div className={styles.TextLeft}>
              to{" "}
              {dateFormat(
                eventDetails.endDateTime,
                "ddd, mmm d, yyyy - h:MM TT",
                true
              )}
            </div>
          </Aux>
        );
      }
    } else if (!isLoadingEvent) {
      if (
        dateFormat(eventDetails.startDateTime, "m d yy", true) ===
        dateFormat(eventDetails.endDateTime, "m d yy", true)
      ) {
        return (
          <Aux>
            <div className={styles.TextRight}>
              {dateFormat(eventDetails.startDateTime, "ddd, mmm d, yyyy", true)}
            </div>
            <div className={styles.TextRight}>
              {dateFormat(eventDetails.startDateTime, "h:MM TT", true)}
              {" - "}
              {dateFormat(eventDetails.endDateTime, "h:MM TT", true)}
            </div>
          </Aux>
        );
      } else {
        return (
          <Aux>
            <div className={styles.TextRight}>
              {dateFormat(
                eventDetails.startDateTime,
                "ddd, mmm d, yyyy - h:MM TT",
                true
              )}
            </div>
            <div className={styles.TextRight}>
              to{" "}
              {dateFormat(
                eventDetails.endDateTime,
                "ddd, mmm d, yyyy - h:MM TT",
                true
              )}
            </div>
          </Aux>
        );
      }
    }
  };

  const summaryPlacard = () => {
    if (showLargerDoublePane && !isLoadingEvent) {
      return (
        <div className={styles.SummaryPlacard}>
          <div className={styles.SummaryDetails}>
            <div className={styles.Month}>
              {dateFormat(
                eventDetails.startDateTime,
                "mmm",
                true
              ).toUpperCase()}
            </div>
            <div className={styles.Date}>
              {dateFormat(eventDetails.startDateTime, "dd", true).toUpperCase()}
            </div>
            <div className={styles.Event}>{eventDetails.eventTitle}</div>
            <div className={styles.Presenter}>{eventDetails.organizer}</div>
          </div>
          <div className={styles.TicketRange}>
            <div className={styles.Prices}>{ticketPriceRange()}</div>
          </div>
        </div>
      );
    }
  };

  const ticketButton = () => {
<<<<<<< HEAD
    console.log("eventDetails.tickets");
    if (eventDetails.tickets !== null) {
      console.log("eventDetails: ", eventDetails);
      return (
        <div className={styles.ButtonContainer}>
          <button onClick={ticketsHandler} className={styles.ButtonGreen}>
            FIND TICKETS
          </button>
        </div>
      );
    } else {
      console.log("eventDetails: ", eventDetails);
      return (
        <div className={styles.ButtonContainer}>
          <button disabled={true} className={styles.ButtonGreenOpac}>
            NO TICKETS FOR SALE
          </button>
        </div>
      );
    }
  };
=======
    console.log("eventDetails.tickets")
    if(eventDetails.tickets.length >= 0 && eventDetails.tickets.length > 0) {
      return (
        <div className={styles.ButtonContainer}>
          <button 
            onClick={ticketsHandler}
            className={styles.ButtonGreen}
          >
            FIND TICKETS
          </button>
        </div>
      )
    } else {
      return (
        <div className={styles.ButtonContainer}>
          <button 
            disabled={true}
            className={styles.ButtonGreenOpac}
          >
            FIND TICKETS
          </button>
        </div>
      )
    }
  }
>>>>>>> master

  const ticketDisplay = () => {
    if (!showLargerDoublePane) {
      return (
        <div className={styles.TicketGrid}>
          <div className={styles.PriceRange}>{ticketPriceRange()}</div>
          {ticketButton()}
        </div>
      );
    } else {
      return (
        <div className={styles.TicketGrid}>
          <div className={styles.PriceRange}>{ticketPriceRange()}</div>
          {ticketButton()}
        </div>
      );
    }
  };

  const locationInfo = () => {
    if (eventDetails.eventType === "live") {
      return (
        <Aux>
          <br></br>
          <div className={styles.TitleRight}>Location</div>
          <div className={styles.TextLeft}>
            {eventDetails.locationVenueName}
          </div>
          <div className={styles.TextLeft}>{eventDetails.locationAddress1}</div>
          <div className={styles.TextLeft}>{eventDetails.locationAddress2}</div>
          <div className={styles.TextRight}>
            {eventDetails.locationCity}
<<<<<<< HEAD
            {(eventDetails.locationCity && eventDetails.locationState) ||
            (eventDetails.locationCity && eventDetails.locationCountryCode)
              ? ", "
              : null}
=======
            {(eventDetails.locationCity && eventDetails.locationState) || (eventDetails.locationCity && eventDetails.locationCountryCode)? ", " : null}
>>>>>>> master
            {eventDetails.locationState} {eventDetails.locationCountryCode}
          </div>
          <div className={styles.TextLeft}>{eventDetails.locationNote}</div>
          <br></br>
        </Aux>
      );
    } else if (eventDetails.eventType === "online") {
      return (
        <Aux>
          <br></br>
          <div className={styles.TitleRight}>Online Event</div>
        </Aux>
      );
    } else if (eventDetails.eventType === "tba") {
      return (
        <Aux>
          <br></br>
          <div className={styles.TitleRight}>Location</div>
          <div className={styles.TextLeft}>To be announced</div>
        </Aux>
      );
    } else {
      return null;
    }
  };

  const bottomDisplay = () => {
    if (showSmallerDoublePane && !isLoadingEvent) {
      return (
        <div className={styles.LowerGrid}>
          <div className={styles.LeftLowerGrid}>
            <div>{ReactHtmlParser(eventDetails.longDescription)}</div>
          </div>
          <div className={styles.RightLowerGrid}>
            <div className={styles.TitleRight}>Date and Time</div>
            {dateRange()}
            {locationInfo()}
          </div>
        </div>
      );
    } else if (!isLoadingEvent) {
      return (
        <div className={styles.LowerGrid}>
          <div className={styles.LeftLowerGrid}>
            <div className={styles.TitleLeft}>Date and Time</div>
            {dateRange()}
            {locationInfo()}
            <div>{ReactHtmlParser(eventDetails.longDescription)}</div>
          </div>
        </div>
      );
    }
  };

  const topDisplay = () => {
    if (showLargerDoublePane) {
      return (
        <div className={styles.UpperGrid}>
          {image}
          {summaryPlacard()}
        </div>
      );
    } else {
      return <div className={styles.UpperGrid}>{image}</div>;
    }
  };

  const middleDisplay = () => {
    if (!showLargerDoublePane && !isLoadingEvent) {
      if (showSmallerDoublePane) {
        return (
          <Aux>
            <div className={styles.MiddleGrid}>
              <div>
                <div className={styles.Month}>
                  {dateFormat(
                    eventDetails.startDateTime,
                    "mmm",
                    true
                  ).toUpperCase()}
                </div>
                <div className={styles.Date}>
                  {dateFormat(
                    eventDetails.startDateTime,
                    "dd",
                    true
                  ).toUpperCase()}
                </div>
              </div>
              <div>
                <div className={styles.TitleLeft}>
                  {eventDetails.eventTitle}
                </div>
                <div className={styles.TextLeft}>{eventDetails.organizer}</div>
              </div>
            </div>
          </Aux>
        );
      } else {
        return (
          <Aux>
            <div className={styles.MiddleGrid}>
              <div>
                <div className={styles.TitleLeft}>
                  {eventDetails.eventTitle}
                </div>
                <div className={styles.TextLeft}>
                  by {eventDetails.organizer}
                </div>
              </div>
            </div>
          </Aux>
        );
      }
    }
  };

  // defines main display with ticket and order panes
  const mainDisplay = () => {
    if (isLoadingEvent) {
      return (
        <div className={styles.BlankCanvas}>
          <Spinner></Spinner>
        </div>
      );
    } else {
      if (isSuccessfull) {
        return (
          <div>
            {topDisplay()}
            {ticketDisplay()}
            {middleDisplay()}
            {bottomDisplay()}
          </div>
        );
      } else {
        return (
          <div className={styles.BlankCanvas}>
            <h5>
              <span style={{ color: "red" }}>This event does not exist.</span>
            </h5>
          </div>
        );
      }
    }
  };

  return <div className={styles.MainContainer}>{mainDisplay()}</div>;
};

export default EventDetail;
