import React, { useState, useEffect } from "react";
import queryString from "query-string";
import dateFormat from "dateformat";

import { API } from "../config";

import styles from "./EventDetail.module.css";
import Aux from "../hoc/Auxiliary/Auxiliary";

import Logo from "./NEWPIC.png";
import Logo2 from "./piff2by1.png";
import DefaultLogo from "../assets/Get_Your_Tickets.png";

// defines an event's NON ticket type specific information
let eventDetails;

// defines an event's image
let eventLogo = DefaultLogo;

const EventDetail = props => {
  // Defines data loading control variables
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [isSuccessfull, setIsSuccessfull] = useState(true);

  const [showLargerDoublePane, setShowLargerDoublePane] = useState(false);
  const [showSmallerDoublePane, setShowSmallerDoublePane] = useState(false);

  // defines styling variables
  const [isRestyling, setIsRestyling] = useState(false);

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
    //getEventData();
    setIsLoadingEvent(true);
    setIsSuccessfull(true);
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
        setIsLoadingEvent(true);
        setIsSuccessfull(false);
      })
      // .finally(() => {});
  };


  const loadEventDetails = event => {
    // defines the eniter "eventDetails" variable
    eventDetails = {
      eventNum: event.eventNum,
      eventTitle: event.eventTitle,
      eventStatus: event.eventStatus,
      organizer: "Light of Gold PR, Marketing, and Consulting",
      organizerEmail: event.accountId.accountEmail,
      startDateTime: dateFormat(
        event.startDateTime,
        "ddd, mmm d, yyyy - h:MM TT",
        true
      ),
      endDateTime: dateFormat(
        event.endDateTime,
        "ddd, mmm d, yyyy - h:MM TT",
        true
      ),
      organizerUrl: event.organizerUrl,
      eventUrl: event.eventUrl,
      location: {
        venueName: event.locationVenueName,
        address: ["Berkeley College PREP",
          "Bryant Park 2nd Fl.",
          "12 E 41st St.",
          "between Madison and 5th Ave"],
        city: event.locationCity,
        state: event.locationState,
        zipPostalCode: event.locationZipPostalCode,
        countryCode: event.locationCountryCode
      },
      descriptions: [
        {title: "Event Details",
        text: ["The 2020 Gold Women’s Business Connect Conference will shine a light on Women, Power, Business, and Economic Development! Learn strategies to grow your business, enhance your productivity, and increase your bottom line. At the Conference, we’ll have fun speed networking activities, breakout sessions on important topics, breakfast and refreshments, vendor and resource information tables, prize drawings, and more!"]
        },
        {title: "About Light of Gold PR, Marketing, and Consulting LLC",
        text: ["Light of Gold PR, Marketing and Consulting LLC, is a MWBE (City certified Minority and Women Business Enterprise), specializes in PR (Public Relations), Marketing, Consulting, Branding & Digital products & services, Web, Video and TV Commercials, as well as Events and Social Media Management.", "Light of Gold PR, Marketing, and Consulting LLC. provides innovative solutions and creative opportunities for your products and services to be promoted to the public consistently. They enhance your image, give you more visibility, and save your organization money! They can increase the overall profitability by positioning your company in front of your target market."]
        }
      ]
    };
    console.log("EVENT DETAILS variable in 'loadEventDetails()': ", eventDetails);
  };


  const stylingUpdate = (inWidth, inHeight) => {
    setIsRestyling(true);
    // based on window width, displays one or two panes
    if (inWidth < 800) {
      setShowLargerDoublePane(false);
    } else {
      setShowLargerDoublePane(true);
    }
    if (inWidth < 480) {
      setShowSmallerDoublePane(false);
    } else {
      setShowSmallerDoublePane(true);
    }
    setIsRestyling(false);
  };

  window.onresize = function(event) {
    stylingUpdate(window.innerWidth, window.innerHeight);
  };
  
  const ticketsHandler = () => {window.location.href = '/ev/dahday_concina_candela?eventID=81295501293'}

  let summaryPlacard;
  if (showLargerDoublePane && !isLoadingEvent) {
    summaryPlacard = (
      <div className={styles.SummaryPlacard}>
        <div className={styles.SummaryDetails}>
          <div className={styles.Month}>MAY</div>
          <div className={styles.Date}>06</div>
          <div className={styles.Event}>
                {eventDetails.eventTitle}
          </div>
          <div className={styles.Presenter}>by {eventDetails.organizer}</div>
        </div>
        <div className={styles.TicketRange}>
          <div className={styles.Prices}>$50 - $175</div>
        </div>
      </div>
    );
  } else summaryPlacard = null;

  let image;

  image = (
    <img
      className={styles.ImageBox}
      src={eventLogo}
      alt="Event Logo Coming Soon!!!"
    />
  );

  let topDisplay;
  let ticketDisplay;
  let middleDisplay;
  let bottomDisplay;

  if (showLargerDoublePane) {
    topDisplay = (
      <div className={styles.UpperGrid}>
        {image}
        {summaryPlacard}
      </div>
    );
    middleDisplay = null;
  } else {
    topDisplay = <div className={styles.UpperGrid}>{image}</div>;
    if (showSmallerDoublePane && !isLoadingEvent) {
      middleDisplay = (
        <Aux>
          <div className={styles.MiddleGrid}>
            <div>
              <div className={styles.Month}>MAY</div>
              <div className={styles.Date}>06</div>
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

  //  <div className={styles.Presenter}>by PIFF Films</div>

  if (!showLargerDoublePane) {
    ticketDisplay = (
      <div className={styles.TicketGrid}>
        <div className={styles.PriceRange}>$50 - $175</div>
        <div className={styles.ButtonContainer}>
          <button onClick={ticketsHandler} className={styles.ButtonGreen}>Tickets</button>
        </div>
      </div>
    );
  } else {
    ticketDisplay = (
      <div className={styles.TicketGrid}>
        <div className={styles.PriceRange}>$50 - $175</div>
        <div className={styles.ButtonContainer}>
          <button onClick={ticketsHandler} className={styles.ButtonGreen}>Tickets</button>
        </div>
      </div>
    );
  }

  if (showSmallerDoublePane && !isLoadingEvent) {
    bottomDisplay = (
      <div className={styles.LowerGrid}>
        <div className={styles.LeftLowerGrid}>
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

        <div className={styles.RightLowerGrid}>
          <div className={styles.TitleRight}>Date and Time</div>
          <div className={styles.TextRight}>May 6, 2020</div>
          <div className={styles.TextRight}>8pm - 10pm</div>
          <br></br>
          <div className={styles.TitleRight}>Location</div>
          {eventDetails.location.address.map(add => {
            return (
              <div className={styles.TextLeft}>{add}</div>
            )
          })}
          <div className={styles.TextRight}>{eventDetails.location.city}, {eventDetails.location.state}</div>
        </div>
      </div>
    );
  } else if (!isLoadingEvent) {
    bottomDisplay = (
      <div className={styles.LowerGrid}>
        <div className={styles.LeftLowerGrid}>
          <div className={styles.TitleLeft}>Date and Time</div>
          <div className={styles.TextLeft}>May 6, 2020</div>
          <div className={styles.TextLeft}>8pm - 10pm</div>
          <br></br>
          <div className={styles.TitleLeft}>Location</div>
          {eventDetails.location.address.map(add => {
            return (
              <div className={styles.TextLeft}>{add}</div>
            )
          })}
          <div className={styles.TextLeft}>{eventDetails.location.city}, {eventDetails.location.state}</div>
          <br></br>
          <div className={styles.TitleLeft}>Event Details</div>
          <div className={styles.TextLeft}>
            <div>
              Part of the Media Track #phillytechweek #PTW19 Philadelphia Tech
              Week 2019 ~ presented by Comcast Where: TBD #piffFilms Creative &
              Media track discussions supported by: mediabureau.com,
              gearstuff.com, University of the Arts Corzo Center for the
              Creative Economy, and Philly Nexus.e
            </div>
          </div>
          <br></br>
          <div className={styles.TitleLeft}>About Light of Gold PR, Marketing, and Consulting</div>
          <div className={styles.TextLeft}>
            <div>
              PIFF discovers and curates a unique collection of local and global
              Independent Drama, Documentary, Thriller, Sci-Fi, Political,
              Horror, Comedy, Music Video, Animation, Web Series and other
              thought provoking films in Philadelphia, PA, using surrounding
              traditional and non-traditional theaters and venues. PIFF is
              committed too discovering and presenting a unique cinematic
              experience unrestrained by conventional boundaries.
            </div>
            <br></br>
            <div>
              At this year's events, PIFF will be discussing the tokenization
              (democratization of content) of film, independent distribution,
              breaking media technology, media and propaganda, via the cross
              roads of digital story telling, media, film, education, and
              culture using #uff #piff #piffFilms #mediabureau #PTW20 #AI
              #BigData among other tags.
            </div>
          </div>

          <br></br>
          <div className={styles.TitleLeft}>History</div>
          <div className={styles.TextLeft}>
            <div>
              Founded by digital media pioneer Media Bureau Inc in 2007, the
              Philadelphia Independent Film Festival’s (PIFF) birth was a direct
              result of a colliding critical mass of independent digital film
              and media, and a swift reaction to the perceived demand to
              “experience” it. The goal was to establish an event environment to
              discuss film and its digital path while always trying to innovate
              at the leading edge. The festival incubated from the then
              omni-present (#uff) underground film forum. The forum had been
              meeting off and on since the inception of the Media Bureau in 1997
              and was the first place in PA to regularly produce, screen, and
              stream digital films and discuss the art of digital storytelling
              at the intersection of digital media and technology. No other
              place existed like it at the time in Philadelphia and the
              tri-state area.
            </div>
            <br></br>
            <div>
              Through a steady stream of incredibly in the moment original
              content and technology grew the rare appreciation for film in ways
              that we never had thought of. It was not a passive experience
              anymore. With this we realized we were taking part in
              Philadelphia’s transformation, from analog to digital content
              production, and in turn were witnessing the birth of a new
              (digital) storytelling technique. The audience reaction was
              instant.
            </div>
            <br></br>
            <div>
              This analog to digital media transition (adoption) was complete
              across the consumer market place as early as 2006 (just in time to
              adjust via the great recession) and was a strategic reason to
              launch the festival when we did. By this time, MBN had fully
              engaged in digital media history from a uniquely Philadelphian,
              old city (historical) perspective. Our ecosystem had been
              established via design and by “request” and was defined by our
              ability to reach our layered and displaced digital communities on
              demand. We have been fortunate to be able to follow and peer in to
              the many journeys of countless storytellers, innovators,
              creative’s, and filmmakers, in all formats, across many borders,
              over 20+ years. We are now screening/discussing digital film from
              a unique pertch – the Democratization of Content.
            </div>
            <br></br>
            <div>
              Digital filmmaking has taught the festival many things. Most
              importantly, perhaps, it has opened the minds of possibility for
              anybody to exercise their right to shoot and post “their story”.
              This was how we were able to coin the term in 2008, Real Time
              Documentary, to help our filmmakers better place their experiences
              in the context of a narrative, yet obviously documentary film. The
              festival was conceived to help enable this type of creative cipher
              to know no cinematic bounds.
            </div>
            <br></br>
            <div>
              The Philadelphia Independent Film Festival (PIFF) is in its
              thirteenth year of operation. Each year, the festival has grown,
              and adds to its knowledge bank a diverse selection of unknown
              national and international films. 95% of the films the festival
              screens during its 4+ day festival are world and local premiers
              while an average of 70% +/- are world premiers.
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
