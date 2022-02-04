import React, { useState, useEffect, Fragment } from "react";
import queryString from "query-string";
import dateFormat from "dateformat";
import ReactHtmlParser from "html-react-parser";

import { getEventData } from "./apiEvents";

import Spinner from "../components/UI/Spinner/SpinnerNew";
//

import classes from "./EventDetails.module.css";

// defines an event's NON ticket type specific information
let eventDetails;

const EventDetail = () => {
  // defines data loading control variables
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [isSuccessfull, setIsSuccessfull] = useState(true);
  const [showLargerDoublePane, setShowLargerDoublePane] = useState(false);
  const [showSmallerDoublePane, setShowSmallerDoublePane] = useState(false);
  //

  useEffect(() => {
    eventData(queryString.parse(window.location.search).eventID);
    stylingUpdate(window.innerWidth, window.innerHeight);
  }, []);

  const eventData = (eventID) => {
    getEventData(eventID)
      .then((res) => {
        console.log(
          "EVENT DATA OBJECT received from Server in 'getEventData()': ",
          res
        );

        // populates "photoUrl1" and "photoUrl2" fields with default images if not contained in event json
        if (!("photoUrl1" in res)) {
          res["photoUrl1"] =
            "https://imagedelivery.net/IF3fDroBzQ70u9_0XhN7Jg/cf557769-811d-44d6-8efc-cf75949d3100/public";
        }

        if (!("photoUrl2" in res)) {
          res["photoUrl2"] =
            "https://imagedelivery.net/IF3fDroBzQ70u9_0XhN7Jg/cf557769-811d-44d6-8efc-cf75949d3100/public";
        }

        loadEventDetails(res);
        setIsLoadingEvent(false);
      })
      .catch((err) => {
        // NEED TO ADDRESS THESE SITUATIONS
        if (err === "Error: Error: 400") {
        }
        if (err === undefined) {
        }
        setIsSuccessfull(false);
        setIsLoadingEvent(false);
      });
  };

  const loadEventDetails = (event) => {
    eventDetails = {
      eventNum: event.eventNum, //
      eventTitle: event.eventTitle, //
      eventType: event.eventType, //
      organizer: "", // Need to add this field to "Event" object from server
      startDateTime: event.startDateTime, //
      endDateTime: event.endDateTime, //
      largeLogo: event.photoUrl1, //
      smallLogo: event.photoUrl2, //
      eventUrl: event.eventUrl, //
      locationVenueName: event.locationVenueName, //
      locationAddress1: event.locationAddress1, //
      locationAddress2: event.locationAddress2, //
      locationCity: event.locationCity, //
      locationState: event.locationState, //
      locationCountryCode: event.locationCountryCode, //
      locationNote: event.locationNote, //
      longDescription: event.longDescription, //
      tickets: event.tickets,
    };
    console.log("EVENT DETAILS: ", eventDetails);
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

  window.onresize = function (event) {
    stylingUpdate(window.innerWidth);
  };

  let image = () => {
    if (!isLoadingEvent) {
      return (
        <img
          className={classes.ImageBox}
          src={eventDetails.largeLogo}
          alt="Event Logo Coming Soon!!!"
        />
      );
    } else return <div>Waiting for image</div>;
  };

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

      if (priceArray.length > 1) {
        return (
          <div>
            {ticketCurrency}
            {Math.min(...priceArray).toFixed(pricision)} - {ticketCurrency}
            {Math.max(...priceArray).toFixed(pricision)}
          </div>
        );
      } else if (priceArray.length === 1) {
        return (
          <div>
            {ticketCurrency}
            {Math.min(...priceArray).toFixed(pricision)}
          </div>
        );
      } else {
        return <div>No tickets available</div>;
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
          <Fragment>
            <div className={classes.TextLeft}>
              {dateFormat(eventDetails.startDateTime, "ddd, mmm d, yyyy", true)}
            </div>
            <div className={classes.TextLeft}>
              {dateFormat(eventDetails.startDateTime, "h:MM TT", true)}
              {" - "}
              {dateFormat(eventDetails.endDateTime, "h:MM TT", true)}
            </div>
          </Fragment>
        );
      } else {
        return (
          <Fragment>
            <div className={classes.TextLeft}>
              {dateFormat(
                eventDetails.startDateTime,
                "ddd, mmm d, yyyy - h:MM TT",
                true
              )}
            </div>
            <div className={classes.TextLeft}>
              to{" "}
              {dateFormat(
                eventDetails.endDateTime,
                "ddd, mmm d, yyyy - h:MM TT",
                true
              )}
            </div>
          </Fragment>
        );
      }
    } else if (!isLoadingEvent) {
      if (
        dateFormat(eventDetails.startDateTime, "m d yy", true) ===
        dateFormat(eventDetails.endDateTime, "m d yy", true)
      ) {
        return (
          <Fragment>
            <div className={classes.TextRight}>
              {dateFormat(eventDetails.startDateTime, "ddd, mmm d, yyyy", true)}
            </div>
            <div className={classes.TextRight}>
              {dateFormat(eventDetails.startDateTime, "h:MM TT", true)}
              {" - "}
              {dateFormat(eventDetails.endDateTime, "h:MM TT", true)}
            </div>
          </Fragment>
        );
      } else {
        return (
          <Fragment>
            <div className={classes.TextRight}>
              {dateFormat(
                eventDetails.startDateTime,
                "ddd, mmm d, yyyy - h:MM TT",
                true
              )}
            </div>
            <div className={classes.TextRight}>
              to{" "}
              {dateFormat(
                eventDetails.endDateTime,
                "ddd, mmm d, yyyy - h:MM TT",
                true
              )}
            </div>
          </Fragment>
        );
      }
    }
  };

  const summaryPlacard = () => {
    if (showLargerDoublePane && !isLoadingEvent) {
      return (
        <div className={classes.SummaryPlacard}>
          <div className={classes.SummaryDetails}>
            <div className={classes.Month}>
              {dateFormat(
                eventDetails.startDateTime,
                "mmm",
                true
              ).toUpperCase()}
            </div>
            <div className={classes.Date}>
              {dateFormat(eventDetails.startDateTime, "dd", true).toUpperCase()}
            </div>
            <div className={classes.Event}>{eventDetails.eventTitle}</div>
            <div className={classes.Presenter}>{eventDetails.organizer}</div>
          </div>
          <div className={classes.TicketRange}>
            <div className={classes.Prices}>{ticketPriceRange()}</div>
          </div>
        </div>
      );
    }
  };

  const ticketButton = () => {
    console.log("eventDetails: ", eventDetails);
    if (
      eventDetails.tickets === undefined ||
      !("tickets" in eventDetails) ||
      ("tickets" in eventDetails && eventDetails.tickets.length === 0)
    ) {
      return (
        <div className={classes.ButtonContainer}>
          <button disabled={true} className={classes.ButtonGreenOpac}>
            NO TICKETS AVAILABLE
          </button>
        </div>
      );
    } else {
      return (
        <div className={classes.ButtonContainer}>
          <button onClick={ticketsHandler} className={classes.ButtonGreen}>
            FIND TICKETS
          </button>
        </div>
      );
    }
  };

  const ticketDisplay = () => {
    if (!showLargerDoublePane) {
      return (
        <div className={classes.TicketGrid}>
          <div className={classes.PriceRange}>{ticketPriceRange()}</div>
          {ticketButton()}
        </div>
      );
    } else {
      return (
        <div className={classes.TicketGrid}>
          <div className={classes.PriceRange}>{ticketPriceRange()}</div>
          {ticketButton()}
        </div>
      );
    }
  };

  const locationInfo = () => {
    if (eventDetails.eventType === "live") {
      return (
        <Fragment>
          <br></br>
          <div className={classes.TitleRight}>Location</div>
          <div className={classes.TextLeft}>
            {eventDetails.locationVenueName}
          </div>
          <div className={classes.TextLeft}>
            {eventDetails.locationAddress1}
          </div>
          <div className={classes.TextLeft}>
            {eventDetails.locationAddress2}
          </div>
          <div className={classes.TextRight}>
            {eventDetails.locationCity}
            {(eventDetails.locationCity && eventDetails.locationState) ||
            (eventDetails.locationCity && eventDetails.locationCountryCode)
              ? ", "
              : null}
            {eventDetails.locationState} {eventDetails.locationCountryCode}
          </div>
          <div className={classes.TextLeft}>{eventDetails.locationNote}</div>
          <br></br>
        </Fragment>
      );
    } else if (eventDetails.eventType === "online") {
      return (
        <Fragment>
          <br></br>
          <div className={classes.TitleRight}>Online Event</div>
        </Fragment>
      );
    } else if (eventDetails.eventType === "tba") {
      return (
        <Fragment>
          <br></br>
          <div className={classes.TitleRight}>Location</div>
          <div className={classes.TextLeft}>To be announced</div>
        </Fragment>
      );
    } else {
      return null;
    }
  };

  const bottomDisplay = () => {
    if (showSmallerDoublePane && !isLoadingEvent) {
      console.log(
        "eventDetails.longDescription: ",
        eventDetails.longDescription
      );
      return (
        <div className={classes.LowerGrid}>
          <div className={classes.LeftLowerGrid}>
            <div>
              {eventDetails.longDescription
                ? ReactHtmlParser(eventDetails.longDescription)
                : null}
            </div>
          </div>
          <div className={classes.RightLowerGrid}>
            <div className={classes.TitleRight}>Date and Time</div>
            {dateRange()}
            {locationInfo()}
          </div>
        </div>
      );
    } else if (!isLoadingEvent) {
      console.log(
        "eventDetails.longDescription: ",
        eventDetails.longDescription
      );
      return (
        <div className={classes.LowerGrid}>
          <div className={classes.LeftLowerGrid}>
            <div className={classes.TitleLeft}>Date and Time</div>
            {dateRange()}
            {locationInfo()}
            <div>
              {eventDetails.longDescription
                ? ReactHtmlParser(eventDetails.longDescription)
                : null}
            </div>
          </div>
        </div>
      );
    }
  };

  const topDisplay = () => {
    if (showLargerDoublePane) {
      return (
        <div className={classes.UpperGrid}>
          {image()}
          {summaryPlacard()}
        </div>
      );
    } else {
      return <div className={classes.UpperGrid}>{image()}</div>;
    }
  };

  const middleDisplay = () => {
    if (!showLargerDoublePane && !isLoadingEvent) {
      if (showSmallerDoublePane) {
        return (
          <Fragment>
            <div className={classes.MiddleGrid}>
              <div>
                <div className={classes.Month}>
                  {dateFormat(
                    eventDetails.startDateTime,
                    "mmm",
                    true
                  ).toUpperCase()}
                </div>
                <div className={classes.Date}>
                  {dateFormat(
                    eventDetails.startDateTime,
                    "dd",
                    true
                  ).toUpperCase()}
                </div>
              </div>
              <div>
                <div className={classes.TitleLeft}>
                  {eventDetails.eventTitle}
                </div>
                <div className={classes.TextLeft}>{eventDetails.organizer}</div>
              </div>
            </div>
          </Fragment>
        );
      } else {
        return (
          <Fragment>
            <div className={classes.MiddleGrid}>
              <div>
                <div className={classes.TitleLeft}>
                  {eventDetails.eventTitle}
                </div>
                <div className={classes.TextLeft}>
                  by {eventDetails.organizer}
                </div>
              </div>
            </div>
          </Fragment>
        );
      }
    }
  };

  // defines main display with ticket and order panes
  const mainDisplay = () => {
    if (isLoadingEvent) {
      return (
        <div className={classes.BlankCanvas}>
          <Spinner></Spinner>
        </div>
      );
    } else {
      if (isSuccessfull) {
        return (
          <div>
            {" "}
            {topDisplay()}
            {ticketDisplay()}
            {middleDisplay()}
            {bottomDisplay()}
          </div>
        );
      } else {
        return (
          <div className={classes.BlankCanvas}>
            <div
              style={{
                paddingTop: "20px",
                fontSize: "20px",
                textAlign: "center",
                color: "red",
              }}
            >
              This event does not exist.
            </div>
          </div>
        );
      }
    }
  };

  return <div className={classes.MainContainer}>{mainDisplay()}</div>;
};

export default EventDetail;
