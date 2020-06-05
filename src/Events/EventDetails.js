import React, { useState, useEffect } from "react";
import queryString from "query-string";
import dateFormat from "dateformat";
import ReactHtmlParser from "react-html-parser";

import { API } from "../config";
import { getEventData, getEventImage } from "./apiEvents";

import styles from "./EventDetails.module.css";
import Aux from "../hoc/Auxiliary/Auxiliary";

import DefaultLogo from "../assets/Get_Your_Tickets.png";

// defines an event's NON ticket type specific information
let eventDetails;

// defines an event's image
let eventLogo;

const EventDetail = props => {
  // defines data loading control variables
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [showLargerDoublePane, setShowLargerDoublePane] = useState(false);
  const [showSmallerDoublePane, setShowSmallerDoublePane] = useState(false);

  useEffect(() => {
    eventData(queryString.parse(window.location.search).eventID);
    stylingUpdate(window.innerWidth, window.innerHeight);
  }, []);

  // receives Event Data from server and then populates several control variables
  const eventData = eventID => {
    getEventData(eventID)
    .then(res => {
      console.log("EVENT DATA OBJECT received from Server in 'getEventData()': ", res);
      loadEventDetails(res);
      getEventImage(eventID)
        .then(res => {
        console.log("EVENT IMAGE received from Server in 'getEventData()': ", res);
          eventLogo = res;
        })
        .catch(err => {
          eventLogo = DefaultLogo;
        })
        .finally(() => {
          setIsLoadingEvent(false);
        });
    })
    .catch(err => {
      // NEED TO ADDRESS THESE SITUATIONS
      if (err === "Error: Error: 400") {
      }
      if (err === undefined) {
      }
      setIsLoadingEvent(false);
    })
    .finally(() => {
    });
  };

  const loadEventDetails = event => {
    // defines the eniter "eventDetails" variable
    eventDetails = {
      eventNum: event.eventNum,//
      eventTitle: event.eventTitle,//
      eventType: event.eventType,//
      isDraft: event.isDarft,//
      eventCategory: event.eventCategory,//
      facebookLink: event.facebookLink,//
      twitterLink: event.twitterLink,//
      instagramLink: event.instagramLink,//
      linkedinLink: event.linkedinLink,//
      organizer: "", // Need to add this field to "Event" object from server
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
    };
    console.log("EVENT DETAILS variable in 'loadEventDetails()': ", eventDetails);
  };

  const stylingUpdate = (inWidth) => {
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

  window.onresize = function(event) {
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
  const ticketsHandler = () => {window.location.href = `/et/${eventDetails.eventUrl}?eventID=${eventDetails.eventNum}`}

  const ticketPriceRange = () => {
    if (!isLoadingEvent) {
      let priceArray = [];
      eventDetails.tickets.map(item => {
        priceArray.push(item.currentTicketPrice);
      })
      if (priceArray.length > 1) {
        return (
          <div>
            ${Math.min(...priceArray).toFixed(2)} - ${Math.max(...priceArray).toFixed(2)}
          </div>
        )
      } else {
        return (
          <div>
            ${Math.min(...priceArray).toFixed(2)}
          </div>
        )
      }
    } else {
      return null
    };
  }

  const dateRange = () => {
    if (showSmallerDoublePane && !isLoadingEvent) {
      if (dateFormat(eventDetails.startDateTime, "m d yy", true) === dateFormat(eventDetails.endDateTime, "m d yy", true)) {
        return (
          <Aux>
            <div className={styles.TextLeft}>{dateFormat(eventDetails.startDateTime, "ddd, mmm d, yyyy", true)}</div>
            <div className={styles.TextLeft}>
              {dateFormat(eventDetails.startDateTime, "h:MM TT", true)}
              {" - "}
              {dateFormat(eventDetails.endDateTime, "h:MM TT", true)}
            </div>
          </Aux>
        )
      } else {
        return (
          <Aux>
            <div className={styles.TextLeft}>{dateFormat(eventDetails.startDateTime, "ddd, mmm d, yyyy - h:MM TT", true)}</div>
            <div className={styles.TextLeft}>to {dateFormat(eventDetails.endDateTime, "ddd, mmm d, yyyy - h:MM TT", true)}</div>
          </Aux>
        )
      }
    } else if (!isLoadingEvent) {
      if (dateFormat(eventDetails.startDateTime, "m d yy", true) === dateFormat(eventDetails.endDateTime, "m d yy", true)) {
        return (
          <Aux>
            <div className={styles.TextRight}>{dateFormat(eventDetails.startDateTime, "ddd, mmm d, yyyy", true)}</div>
            <div className={styles.TextRight}>
              {dateFormat(eventDetails.startDateTime, "h:MM TT", true)}
              {" - "}
              {dateFormat(eventDetails.endDateTime, "h:MM TT", true)}
            </div>
          </Aux>
        )
      } else {
        return (
          <Aux>
            <div className={styles.TextRight}>{dateFormat(eventDetails.startDateTime, "ddd, mmm d, yyyy - h:MM TT", true)}</div>
            <div className={styles.TextRight}>to {dateFormat(eventDetails.endDateTime, "ddd, mmm d, yyyy - h:MM TT", true)}</div>
          </Aux>
        )
      }
    }
  }

  const summaryPlacard = () => {
    if (showLargerDoublePane && !isLoadingEvent) {
      return (
        <div className={styles.SummaryPlacard}>
          <div className={styles.SummaryDetails}>
            <div className={styles.Month}>{dateFormat(eventDetails.startDateTime, "mmm", true).toUpperCase()}</div>
            <div className={styles.Date}>{dateFormat(eventDetails.startDateTime, "dd", true).toUpperCase()}</div>
            <div className={styles.Event}>
                  {eventDetails.eventTitle}
            </div>
            <div className={styles.Presenter}>{eventDetails.organizer}</div>
          </div>
          <div className={styles.TicketRange}>
            <div className={styles.Prices}>{ticketPriceRange()}</div>
          </div>
        </div>
      );
    }
  };

  const ticketDisplay = () => {
    if (!showLargerDoublePane) {
      return (
        <div className={styles.TicketGrid}>
          <div className={styles.PriceRange}>{ticketPriceRange()}</div>
          <div className={styles.ButtonContainer}>
            <button onClick={ticketsHandler} className={styles.ButtonGreen}>Tickets</button>
          </div>
        </div>
      )
    } else {
      return (
        <div className={styles.TicketGrid}>
          <div className={styles.PriceRange}>{ticketPriceRange()}</div>
          <div className={styles.ButtonContainer}>
            <button onClick={ticketsHandler} className={styles.ButtonGreen}>Tickets</button>
          </div>
        </div>
      )
    }
  }

  const locationInfo = () => {
    return (
      <Aux>
        <br></br>
        <div className={styles.TitleRight}>Location</div>
        <div className={styles.TextLeft}>{eventDetails.locationVenueName}</div>
        <div className={styles.TextLeft}>{eventDetails.locationAddress1}</div>
        <div className={styles.TextLeft}>{eventDetails.locationAddress2}</div>
        <div className={styles.TextRight}>{eventDetails.locationCity}, {eventDetails.locationState} {eventDetails.locationCountryCode}</div>
        <div className={styles.TextLeft}>{eventDetails.locationNote}</div>
        <br></br>
      </Aux>
    )
  }

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
      )
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
  }

  const topDisplay2 = () => {
    if (showLargerDoublePane) {
      return (
        <div className={styles.UpperGrid}>
          {image}
          {summaryPlacard()}
        </div>
      )
    } else {
      return (
        <div className={styles.UpperGrid}>{image}</div>
      )
    }
  }

  const middleDisplay2 = () => {
    if (!showLargerDoublePane && !isLoadingEvent) {
      if (showSmallerDoublePane) {
        return (
          <Aux>
            <div className={styles.MiddleGrid}>
              <div>
                <div className={styles.Month}>{dateFormat(eventDetails.startDateTime, "mmm", true).toUpperCase()}</div>
                <div className={styles.Date}>{dateFormat(eventDetails.startDateTime, "dd", true).toUpperCase()}</div>
              </div>
              <div>
                <div className={styles.TitleLeft}>
                  {eventDetails.eventTitle}
                </div>
                <div className={styles.TextLeft}>{eventDetails.organizer}</div>
              </div>
            </div>
          </Aux>
        )
      } else {
        return (
          <Aux>
            <div className={styles.MiddleGrid}>
              <div>
                <div className={styles.TitleLeft}>
                  {eventDetails.eventTitle}
                </div>
                <div className={styles.TextLeft}>by {eventDetails.organizer}</div>
              </div>
            </div>
          </Aux>
        )
      }
    }
  }

  return (
    <div className={styles.MainContainer}>
      {topDisplay2()}
      {ticketDisplay()}
      {middleDisplay2()}
      {bottomDisplay()}
    </div>
  );
};

export default EventDetail;