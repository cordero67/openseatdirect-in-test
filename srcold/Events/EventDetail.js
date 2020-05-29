import React, { useState, useEffect } from "react";
import queryString from "query-string";
import dateFormat from "dateformat";

import { API } from "../config";

import styles from "./EventDetail.module.css";
import Aux from "../hoc/Auxiliary/Auxiliary";

import DefaultLogo from "../assets/Get_Your_Tickets.png";

// defines an event's NON ticket type specific information
let eventDetails;

// defines an event's image
let eventLogo;

const EventDetail = props => {
  // Defines data loading control variables
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);

  const [showLargerDoublePane, setShowLargerDoublePane] = useState(false);
  const [showSmallerDoublePane, setShowSmallerDoublePane] = useState(false);

  // defines styling variables
  //const [isRestyling, setIsRestyling] = useState(false);

  // MOVE TO API FILE
  const handleErrors = response => {
    // back-end server is down, i.e. response is "undefined"
    // "ERROR" will be "err"
    console.log("Inside 'apiCore' 'handleErrors()'", response);
    //console.log("json response: ", expandedLog(response, 1));
    if (!response.ok) {
      console.log("response was false!");
      //console.log("response.status: ", response.status);
      throw Error(response.status);
    }
    return response;
  };


  // MOVE TO API FILE
  const getEventData = eventId => {
    return fetch(`${API}/event/e/${eventId}`, {
        method: "GET"
      })
        .then(handleErrors)
        .then(response => {
          console.log("'apiCore' - 'getEventData()' - '.then' block");
          return response.json();
        })
        .catch(err => {
          console.log(
            "Inside '.catch' block of 'getEventData()', this is the error:",
            err
          );
          throw Error(err);
        });
    };


  // MOVE TO API FILE
  const getEventImage = eventId => {
  console.log("Inside apiCore and the 'getEventImage' function call");
  return fetch(`${API}/event/photo/e/${eventId}`, {
    method: "GET"
  })
    .then(handleErrors)
    .then(response => {
      console.log("Inside apiCore and the 'getEventImage' .then block");
      return response.url;
    })
    .catch(err => {
      console.log("jumping here", err);
      throw Error(err);
    });
};

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
      eventNum: event.eventNum,
      eventTitle: event.eventTitle,
      eventStatus: event.eventStatus,
      organizer: "Light of Gold PR, Marketing, and Consulting",
      organizerEmail: event.accountId.accountEmail,
      startDateTime: event.startDateTime,
      endDateTime: event.endDateTime,
      organizerUrl: event.organizerUrl,
      eventUrl: event.eventUrl,
      location: {
        venueName: event.locationVenueName,
        address: ["Venue Name",
          "Address1",
          "Address2",
          "location detail"],
        city: event.locationCity,
        state: event.locationState,
        zipPostalCode: event.locationZipPostalCode,
        countryCode: event.locationCountryCode
      },
      descriptions: [
        {
          title: "Event Description",
          text: ["The 2020 Gold Women’s Business Connect Conference will shine a light on Women, Power, Business, and Economic Development! Learn strategies to grow your business, enhance your productivity, and increase your bottom line. At the Conference, we’ll have fun speed networking activities, breakout sessions on important topics, breakfast and refreshments, vendor and resource information tables, prize drawings, and more!"]
        },
        {
          title: "Conference Details",
          text: ["In honor of Women’s History Month, the 2020 Gold Women’s Business Connect Conference – NY will feature powerful information from Experts and Speakers who are at the top of their fields. Our experts will Enlighten, Empower, and Educate you on today’s important topics for professional woman as well as women business owners!"]
        },
        {
          title: "Entrepreneurial Mindset & Goal Setting",
          text: ["taught by Malla Haridat, Breakthrough Business Coach"]
        },
        {
          title: "Growing and Scaling Your Business",
          text: ["taught by Scott Mason, Scott Mason LLC"]
        },
        {
          title: "Cohesive Marketing that Gains more Exposure to Increase you Bottom Line",
          text: ["taught by Debra Dixon Anderson, Light of Gold PR"]
        },
        {
          title: "Is Your Brand Causing You to Lose Money?",
          text: ["taught by Katanni Bramhan, The K District"]
        },
        {
          title: "Effective Tactics that Will Make You a Sales Superstar",
          text: ["taught by Adrian Miller, Adrian Miller Sales Training"]
        },
        {
          title: "About Light of Gold PR, Marketing, and Consulting LLC",
          text: ["Light of Gold PR, Marketing and Consulting LLC, is a MWBE (City certified Minority and Women Business Enterprise), specializes in PR (Public Relations), Marketing, Consulting, Branding & Digital products & services, Web, Video and TV Commercials, as well as Events and Social Media Management.", "Light of Gold PR, Marketing, and Consulting LLC. provides innovative solutions and creative opportunities for your products and services to be promoted to the public consistently. They enhance your image, give you more visibility, and save your organization money! They can increase the overall profitability by positioning your company in front of your target market."]
        }
      ],
      tickets: event.ticket,
    };
    console.log("EVENT DETAILS variable in 'loadEventDetails()': ", eventDetails);
  };


//DID NOT MAKE A CHANGE
  const stylingUpdate = (inWidth, inHeight) => {
    //setIsRestyling(true);
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
    //setIsRestyling(false);
  };

//DID NOT MAKE A CHANGE
  window.onresize = function(event) {
    stylingUpdate(window.innerWidth, window.innerHeight);
  };
  
  const ticketsHandler = () => {window.location.href = `/et/${eventDetails.eventUrl}?eventID=${eventDetails.eventNum}`}

  let image = (
    <img
      className={styles.ImageBox}
      src={eventLogo}
      alt="Event Logo Coming Soon!!!"
    />
  );
  
  let ticketPriceRange;
  if (!isLoadingEvent) {
    let priceArray = [];
    eventDetails.tickets.map(item => {
      priceArray.push(item.currentTicketPrice);
    })
    if (priceArray.length > 1) {
      ticketPriceRange = (
        <div>
          ${Math.min(...priceArray).toFixed(2)} - ${Math.max(...priceArray).toFixed(2)}
        </div>
      )
    }
    else {
      ticketPriceRange = (
        <div>
          ${Math.min(...priceArray).toFixed(2)}
        </div>
      )
    }
  }

  let dateRange;
  if (showSmallerDoublePane && !isLoadingEvent) {
    if (dateFormat(eventDetails.startDateTime, "m d yy", true) === dateFormat(eventDetails.endDateTime, "m d yy", true)) {
      dateRange =
        <Aux>
          <div className={styles.TextLeft}>{dateFormat(eventDetails.startDateTime, "ddd, mmm d, yyyy", true)}</div>
          <div className={styles.TextLeft}>
            {dateFormat(eventDetails.startDateTime, "h:MM TT", true)}
            {" - "}
            {dateFormat(eventDetails.endDateTime, "h:MM TT", true)}
          </div>
        </Aux>
    } else {
      dateRange =
        <Aux>
          <div className={styles.TextLeft}>{dateFormat(eventDetails.startDateTime, "ddd, mmm d, yyyy - h:MM TT", true)}</div>
          <div className={styles.TextLeft}>to {dateFormat(eventDetails.endDateTime, "ddd, mmm d, yyyy - h:MM TT", true)}</div>
        </Aux>
    }
  }
  else if (!isLoadingEvent)  {
    if (dateFormat(eventDetails.startDateTime, "m d yy", true) === dateFormat(eventDetails.endDateTime, "m d yy", true)) {
      dateRange =
        <Aux>
          <div className={styles.TextRight}>{dateFormat(eventDetails.startDateTime, "ddd, mmm d, yyyy", true)}</div>
          <div className={styles.TextRight}>
            {dateFormat(eventDetails.startDateTime, "h:MM TT", true)}
            {" - "}
            {dateFormat(eventDetails.endDateTime, "h:MM TT", true)}
          </div>
        </Aux>
    } else {
      dateRange =
        <Aux>
          <div className={styles.TextRight}>{dateFormat(eventDetails.startDateTime, "ddd, mmm d, yyyy - h:MM TT", true)}</div>
          <div className={styles.TextRight}>to {dateFormat(eventDetails.endDateTime, "ddd, mmm d, yyyy - h:MM TT", true)}</div>
        </Aux>
    }
  } 

  let summaryPlacard;
  if (showLargerDoublePane && !isLoadingEvent) {
    summaryPlacard = (
      <div className={styles.SummaryPlacard}>
        <div className={styles.SummaryDetails}>
          <div className={styles.Month}>{dateFormat(eventDetails.startDateTime, "mmm", true).toUpperCase()}</div>
          <div className={styles.Date}>{dateFormat(eventDetails.startDateTime, "dd", true).toUpperCase()}</div>
          <div className={styles.Event}>
                {eventDetails.eventTitle}
          </div>
          <div className={styles.Presenter}>by {eventDetails.organizer}</div>
        </div>
        <div className={styles.TicketRange}>
          <div className={styles.Prices}>{ticketPriceRange}</div>
        </div>
      </div>
    );
  } else summaryPlacard = null;

  let topDisplay;
  let middleDisplay;
  if (showLargerDoublePane) {
    topDisplay = (
      <div className={styles.UpperGrid}>
        {image}
        {summaryPlacard}
      </div>
    );
    middleDisplay = null
  } else {
    topDisplay = <div className={styles.UpperGrid}>{image}</div>;
    if (showSmallerDoublePane && !isLoadingEvent) {
      middleDisplay = (
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
              <div className={styles.TextLeft}>by {eventDetails.organizer}</div>
            </div>
          </div>
        </Aux>
      );
    } else if (!showSmallerDoublePane && !isLoadingEvent) {
      middleDisplay = (
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
      );
    } else {
      middleDisplay = null}
  }

  let ticketDisplay;
  if (!showLargerDoublePane) {
    ticketDisplay = (
      <div className={styles.TicketGrid}>
        <div className={styles.PriceRange}>{ticketPriceRange}</div>
        <div className={styles.ButtonContainer}>
          <button onClick={ticketsHandler} className={styles.ButtonGreen}>Tickets</button>
        </div>
      </div>
    );
  } else {
    ticketDisplay = (
      <div className={styles.TicketGrid}>
        <div className={styles.PriceRange}>{ticketPriceRange}</div>
        <div className={styles.ButtonContainer}>
          <button onClick={ticketsHandler} className={styles.ButtonGreen}>Tickets</button>
        </div>
      </div>
    );
  }

  let bottomDisplay;
  if (showSmallerDoublePane && !isLoadingEvent) {
    bottomDisplay = (
      <div className={styles.LowerGrid}>
        <div className={styles.LeftLowerGrid}>
          {eventDetails.descriptions.map(item1 => {return (
            <Aux>
              <div className={styles.TitleLeft}>{item1.title}</div>
                {item1.text.map(item2 => {return (
                <Aux>
                  <div className={styles.TextLeft}>{item2}</div>
                  <br></br>
                </Aux>
              )})}
            </Aux>
          )})}
        </div>
        <div className={styles.RightLowerGrid}>
          <div className={styles.TitleRight}>Date and Time</div>
          {dateRange}
          <br></br>
          <div className={styles.TitleRight}>Location</div>
          {eventDetails.location.address.map(add => {
            return (
              <div className={styles.TextLeft}>{add}</div>
            )
          })}
          <div className={styles.TextRight}>{eventDetails.location.city}, {eventDetails.location.state} {eventDetails.location.zipPostalCode}</div>
        </div>
      </div>
    );
  } else if (!isLoadingEvent) {
    bottomDisplay = (
      <div className={styles.LowerGrid}>
        <div className={styles.LeftLowerGrid}>
          <div className={styles.TitleLeft}>Date and Time</div>
          {dateRange}
          <br></br>
          <div className={styles.TitleLeft}>Location</div>
          {eventDetails.location.address.map(add => {
            return (
              <div className={styles.TextLeft}>{add}</div>
            )
          })}
          <div className={styles.TextLeft}>{eventDetails.location.city}, {eventDetails.location.state} {eventDetails.location.zipPostalCode}</div>
          <br></br>
          {eventDetails.descriptions.map(item1 => {return (
            <Aux>
              <div className={styles.TitleLeft}>{item1.title}</div>
                {item1.text.map(item2 => {return (
                <Aux>
                  <div className={styles.TextLeft}>{item2}</div>
                  <br></br>
                </Aux>
              )})}
            </Aux>
          )})}
        </div>
      </div>
    );
  } else {bottomDisplay = null}

  return (
    <div className={styles.MainContainer}>
      {topDisplay}
      {ticketDisplay}
      {middleDisplay}
      {bottomDisplay}
    </div>
  );
};

export default EventDetail;
