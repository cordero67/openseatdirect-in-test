import React, { useState, useEffect } from "react";
import queryString from "query-string";
import dateFormat from "dateformat";

import { API } from "../config";

import styles from "./EventDetail.module.css";
import Aux from "../hoc/Auxiliary/Auxiliary";

import DefaultLogo from "../assets/Get_Your_Tickets.png";
import TechLogo from "./TechWeek.png";

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
            eventLogo = TechLogo;
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
      organizer: "PIFF Films",
      organizerEmail: event.accountId.accountEmail,
      startDateTime: event.startDateTime,
      endDateTime: event.endDateTime,
      organizerUrl: event.organizerUrl,
      eventUrl: event.eventUrl,
      location: {
        venueName: event.locationVenueName,
        address: ["University of the Arts",
          "320 S. Broad St."],
        city: event.locationCity,
        state: event.locationState,
        zipPostalCode: event.locationZipPostalCode,
        countryCode: event.locationCountryCode
      },
      descriptions: [
        {
          title: "Sponsorship 2020",
          text: ["The Philadelphia Independent Film Festival is a unique sponsorship opportunity. All packages are customizable and can directly interact with existing campaigns. The festival incubates a unique, active, and hardworking independent film / tech community. Let’s discuss ideas and options on how to reach your current / new audience."]
        },
        {
          title: "Premier Sponsor: $13,850 (1 available)",
          text: [
            "a. Full page Logo in Festival Program and on original poster design collaboration",
            "b.	Social Media # and @ posts x2 daily during week before and after festival ~ April 29th – May 16th, 2020",
            "c.	On screen logo during ALL festival screening blocks (min. 7) (pre and post roll of film)",
            "d.	Premier sponsor recognition (brand mention throughout festival “Thank you…”)",
            "e.	:10 Video ad during blocks and intermissions",
            "f.	Sponsor of opening and closing night event and VIP events (strategic logo placement, etc. TBD)",
            "g.	Complimentary ALL ACCESS passes / cued as audience members"
          ]
        },
        {
          title: "Closing or Opening Night Sponsor: $8,550 (2 available)",
          text: [
            "a.	1/2 page Logo in Festival Program and on original poster design",
            "b.	Social Media # and @ posts x2 daily during week before and after festival ~ April 29th – May 16th, 2020",
            "c.	On screen logo during 6 screening blocks (pre and post roll of film)",
            "d.	Sponsorship of closing night film",
            "e.	:10 Video ad at beginning of Presented By… (choice)",
            "f.	8 Complimentary ALL ACCESS passes / cued as audience members"]
        },
        {
          title: "Presenting Sponsor: $6,850 (2 available)",
          text: [
            "a.	1/4 page Logo in Festival Program and on original poster design",
            "b.	Social Media # and @ posts x2 daily during week of festival ~ May 3rd – 9th, 2020",
            "c.	On screen logo during 4 screening blocks (pre and post roll of film)",
            "d.	Sponsorship of specific film* (Does not include Opening and / or Closing films)",
            "e.	:10 Video ad before chosen screening block",
            "f.	6 Complimentary ALL ACCESS passes / cued as audience members"]
        },
        {
          title: "Award Sponsor: $4,650 (12 available)",
          text: [
            "a.	1/4 page Logo in Festival Program and on original poster design",
            "b.	Social Media # and @ posts x2 daily during week of festival ~ May 3rd – 9th, 2020",
            "c.	On screen logo during 3 screening blocks and 1 genre winner (pre and post roll of film)",
            "d.	Sponsorship of genre specific film and Q&A including pre and post festival promotion (TBD)",
            "e.	:10 Video ad before chosen screening block",
            "f.	6 Complimentary ALL ACCESS passes / cued as audience members"]
        },
        {
          title: "Sponsor: $2,850 (15 available)",
          text: [
            "a.	1/4 page Logo in Festival Program (TBD))",
            "b.	Social Media # and @ posts x2 daily during week of festival ~ May 3rd – 9th, 2020",
            "c.	On screen logo during 1 screening block (pre and post roll of film)",
            "d.	4 Complimentary ALL ACCESS passes / cued as audience members",
            "e.	Does noy include Opening and / or Closing films"]
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
          ${Math.min(...priceArray)} - ${Math.max(...priceArray)}
        </div>
      )
    }
    else {
      ticketPriceRange = (
        <div>
          ${Math.min(...priceArray)}
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
          <button onClick={ticketsHandler} className={styles.ButtonGreen}>Sponsorships</button>
        </div>
      </div>
    );
  } else {
    ticketDisplay = (
      <div className={styles.TicketGrid}>
        <div className={styles.PriceRange}>{ticketPriceRange}</div>
        <div className={styles.ButtonContainer}>
          <button onClick={ticketsHandler} className={styles.ButtonGreen}>Sponsorships</button>
        </div>
      </div>
    );
  }

  let bottomDisplay;
  if (showSmallerDoublePane && !isLoadingEvent) {
    bottomDisplay = (
      <div className={styles.LowerGrid}>
        <div className={styles.LeftLowerGrid}>
          <div className={styles.TitleLeft}>Sponsorship 2020</div>
          <div className={styles.TextLeft}>The Philadelphia Independent Film Festival is a unique sponsorship opportunity. All packages are customizable and can directly interact with existing campaigns. The festival incubates a unique, active, and hardworking independent film / tech community. Let’s discuss ideas and options on how to reach your current / new audience.</div>
          <br></br>
          <div className={styles.TitleLeft}><span style={{ textDecoration: "underline"}}>Premier Sponsor: $13,850 <span style={{ fontSize: "16px" }}>(1 available)</span></span></div>
          <div className={styles.TextLeft}>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                a.
              </div>
              <div className={styles.SponsorDescription}>
                Full page Logo in Festival Program and on original poster design collaboration
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                b.
              </div>
              <div className={styles.SponsorDescription}>
                Social Media # and @ posts x2 daily during week before and after festival ~ April 29th – May 16th, 2020
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                c.
              </div>
              <div className={styles.SponsorDescription}>
                On screen logo during ALL festival screening blocks (min. 7) (pre and post roll of film)
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                d.
              </div>
              <div className={styles.SponsorDescription}>
                Premier sponsor recognition (brand mention throughout festival “Thank you…”)
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                e.
              </div>
              <div className={styles.SponsorDescription}>
                :10 Video ad during blocks and intermissions
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                f.
              </div>
              <div className={styles.SponsorDescription}>
                Sponsor of opening and closing night event and VIP events (strategic logo placement, etc. TBD)
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                g.
              </div>
              <div className={styles.SponsorDescription}>
                Complimentary ALL ACCESS passes / cued as audience members
              </div>
            </div>
          </div>
          <br></br>
          <div className={styles.TitleLeft}><span style={{ textDecoration: "underline"}}>Closing or Opening Night Sponsor: $8,550 <span style={{ fontSize: "16px" }}>(2 available)</span></span></div>
          <div className={styles.TextLeft}>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                a.
              </div>
              <div className={styles.SponsorDescription}>
                1/2 page Logo in Festival Program and on original poster design
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                b.
              </div>
              <div className={styles.SponsorDescription}>
                Social Media # and @ posts x2 daily during week before and after festival ~ April 29th – May 16th, 2020
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                c.
              </div>
              <div className={styles.SponsorDescription}>
                On screen logo during 6 screening blocks (pre and post roll of film)
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                d.
              </div>
              <div className={styles.SponsorDescription}>
                Sponsorship of closing night film
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                e.
              </div>
              <div className={styles.SponsorDescription}>
                :10 Video ad at beginning of Presented By… (choice)
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                f.
              </div>
              <div className={styles.SponsorDescription}>
                8 Complimentary ALL ACCESS passes / cued as audience members
              </div>
            </div>
          </div>
          <br></br>
          <div className={styles.TitleLeft}><span style={{ textDecoration: "underline"}}>Presenting Sponsor: $6,850 <span style={{ fontSize: "16px" }}>(2 available)</span></span></div>
          <div className={styles.TextLeft}>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                a.
              </div>
              <div className={styles.SponsorDescription}>
                1/4 page Logo in Festival Program and on original poster design
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                b.
              </div>
              <div className={styles.SponsorDescription}>
                Social Media # and @ posts x2 daily during week of festival ~ May 3rd – 9th, 2020
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                c.
              </div>
              <div className={styles.SponsorDescription}>
                On screen logo during 4 screening blocks (pre and post roll of film)
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                d.
              </div>
              <div className={styles.SponsorDescription}>
                Sponsorship of specific film* (Does not include Opening and / or Closing films)
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                e.
              </div>
              <div className={styles.SponsorDescription}>
                :10 Video ad before chosen screening block
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                f.
              </div>
              <div className={styles.SponsorDescription}>
                6 Complimentary ALL ACCESS passes / cued as audience members
              </div>
            </div>
          </div>
          <br></br>
          <div className={styles.TitleLeft}><span style={{ textDecoration: "underline"}}>Award Sponsor: $4,650 <span style={{ fontSize: "16px" }}>(12 available)</span></span></div>
          <div className={styles.TextLeft}>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                a.
              </div>
              <div className={styles.SponsorDescription}>
                1/4 page Logo in Festival Program and on original poster design
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                b.
              </div>
              <div className={styles.SponsorDescription}>
                Social Media # and @ posts x2 daily during week of festival ~ May 3rd – 9th, 2020
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                c.
              </div>
              <div className={styles.SponsorDescription}>
                On screen logo during 3 screening blocks and 1 genre winner (pre and post roll of film)
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                d.
              </div>
              <div className={styles.SponsorDescription}>
                Sponsorship of genre specific film and Q&A including pre and post festival promotion (TBD)
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                e.
              </div>
              <div className={styles.SponsorDescription}>
                :10 Video ad before chosen screening block
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                f.
              </div>
              <div className={styles.SponsorDescription}>
                6 Complimentary ALL ACCESS passes / cued as audience members
              </div>
            </div>
          </div>
          <br></br>
          <div className={styles.TitleLeft}><span style={{ textDecoration: "underline"}}>Sponsor: $2,850 <span style={{ fontSize: "16px" }}>(15 available) (Does not include Opening and / or Closing films)</span></span></div>
          <div className={styles.TextLeft}>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                a.
              </div>
              <div className={styles.SponsorDescription}>
                1/4 page Logo in Festival Program (TBD)
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                b.
              </div>
              <div className={styles.SponsorDescription}>
                Social Media # and @ posts x2 daily during week of festival ~ May 3rd – 9th, 2020
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                c.
              </div>
              <div className={styles.SponsorDescription}>
                On screen logo during 1 screening block (pre and post roll of film)
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                d.
              </div>
              <div className={styles.SponsorDescription}>
                4 Complimentary ALL ACCESS passes / cued as audience members
              </div>
            </div>
          </div>

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
          <div className={styles.TitleLeft}>Sponsorship 2020</div>
          <div className={styles.TextLeft}>The Philadelphia Independent Film Festival is a unique sponsorship opportunity. All packages are customizable and can directly interact with existing campaigns. The festival incubates a unique, active, and hardworking independent film / tech community. Let’s discuss ideas and options on how to reach your current / new audience.</div>
          <br></br>
          <div className={styles.TitleLeft}><span style={{ textDecoration: "underline"}}>Premier Sponsor: $13,850 <span style={{ fontSize: "16px" }}>(1 available)</span></span></div>
          <div className={styles.TextLeft}>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                a.
              </div>
              <div className={styles.SponsorDescription}>
                Full page Logo in Festival Program and on original poster design collaboration
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                b.
              </div>
              <div className={styles.SponsorDescription}>
                Social Media # and @ posts x2 daily during week before and after festival ~ April 29th – May 16th, 2020
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                c.
              </div>
              <div className={styles.SponsorDescription}>
                On screen logo during ALL festival screening blocks (min. 7) (pre and post roll of film)
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                d.
              </div>
              <div className={styles.SponsorDescription}>
                Premier sponsor recognition (brand mention throughout festival “Thank you…”)
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                e.
              </div>
              <div className={styles.SponsorDescription}>
                :10 Video ad during blocks and intermissions
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                f.
              </div>
              <div className={styles.SponsorDescription}>
                Sponsor of opening and closing night event and VIP events (strategic logo placement, etc. TBD)
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                g.
              </div>
              <div className={styles.SponsorDescription}>
                Complimentary ALL ACCESS passes / cued as audience members
              </div>
            </div>
          </div>
          <br></br>
          <div className={styles.TitleLeft}><span style={{ textDecoration: "underline"}}>Closing or Opening Night Sponsor: $8,550 <span style={{ fontSize: "16px" }}>(2 available)</span></span></div>
          <div className={styles.TextLeft}>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                a.
              </div>
              <div className={styles.SponsorDescription}>
                1/2 page Logo in Festival Program and on original poster design
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                b.
              </div>
              <div className={styles.SponsorDescription}>
                Social Media # and @ posts x2 daily during week before and after festival ~ April 29th – May 16th, 2020
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                c.
              </div>
              <div className={styles.SponsorDescription}>
                On screen logo during 6 screening blocks (pre and post roll of film)
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                d.
              </div>
              <div className={styles.SponsorDescription}>
                Sponsorship of closing night film
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                e.
              </div>
              <div className={styles.SponsorDescription}>
                :10 Video ad at beginning of Presented By… (choice)
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                f.
              </div>
              <div className={styles.SponsorDescription}>
                8 Complimentary ALL ACCESS passes / cued as audience members
              </div>
            </div>
          </div>
          <br></br>
          <div className={styles.TitleLeft}><span style={{ textDecoration: "underline"}}>Presenting Sponsor: $6,850 <span style={{ fontSize: "16px" }}>(2 available)</span></span></div>
          <div className={styles.TextLeft}>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                a.
              </div>
              <div className={styles.SponsorDescription}>
                1/4 page Logo in Festival Program and on original poster design
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                b.
              </div>
              <div className={styles.SponsorDescription}>
                Social Media # and @ posts x2 daily during week of festival ~ May 3rd – 9th, 2020
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                c.
              </div>
              <div className={styles.SponsorDescription}>
                On screen logo during 4 screening blocks (pre and post roll of film)
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                d.
              </div>
              <div className={styles.SponsorDescription}>
                Sponsorship of specific film* (Does not include Opening and / or Closing films)
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                e.
              </div>
              <div className={styles.SponsorDescription}>
                :10 Video ad before chosen screening block
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                f.
              </div>
              <div className={styles.SponsorDescription}>
                6 Complimentary ALL ACCESS passes / cued as audience members
              </div>
            </div>
          </div>
          <br></br>
          <div className={styles.TitleLeft}><span style={{ textDecoration: "underline"}}>Award Sponsor: $4,650 <span style={{ fontSize: "16px" }}>(12 available)</span></span></div>
          <div className={styles.TextLeft}>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                a.
              </div>
              <div className={styles.SponsorDescription}>
                1/4 page Logo in Festival Program and on original poster design
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                b.
              </div>
              <div className={styles.SponsorDescription}>
                Social Media # and @ posts x2 daily during week of festival ~ May 3rd – 9th, 2020
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                c.
              </div>
              <div className={styles.SponsorDescription}>
                On screen logo during 3 screening blocks and 1 genre winner (pre and post roll of film)
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                d.
              </div>
              <div className={styles.SponsorDescription}>
                Sponsorship of genre specific film and Q&A including pre and post festival promotion (TBD)
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                e.
              </div>
              <div className={styles.SponsorDescription}>
                :10 Video ad before chosen screening block
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                f.
              </div>
              <div className={styles.SponsorDescription}>
                6 Complimentary ALL ACCESS passes / cued as audience members
              </div>
            </div>
          </div>
          <br></br>
          <div className={styles.TitleLeft}><span style={{ textDecoration: "underline"}}>Sponsor: $2,850 <span style={{ fontSize: "16px" }}>(15 available)</span></span></div>
          <div className={styles.TextLeft}>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                a.
              </div>
              <div className={styles.SponsorDescription}>
                1/4 page Logo in Festival Program (TBD)
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                b.
              </div>
              <div className={styles.SponsorDescription}>
                Social Media # and @ posts x2 daily during week of festival ~ May 3rd – 9th, 2020
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                c.
              </div>
              <div className={styles.SponsorDescription}>
                On screen logo during 1 screening block (pre and post roll of film)
              </div>
            </div>
            <div className={styles.SponsorGrid}>
              <div className={styles.SponsorItem}>
                d.
              </div>
              <div className={styles.SponsorDescription}>
                4 Complimentary ALL ACCESS passes / cued as audience members
              </div>
            </div>
          </div>
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
