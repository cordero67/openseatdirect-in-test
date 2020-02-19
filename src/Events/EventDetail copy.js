import React, { useState, useEffect } from "react";
import queryString from "query-string";
import dateFormat from "dateformat";

import Footer from "../components/Footers/OSDFooter";

import { API } from "../config";

import styles from "./EventDetail.module.css";
import Aux from "../hoc/Auxiliary/Auxiliary";

import Logo from "./NEWPIC.png";
import Logo2 from "./piff2by1.png";
import DefaultLogo from "../assets/Get_Your_Tickets.png";

import styles2 from "./Events.module.css";
import Event from "./Event/Event";
import Modal from "./Modal/Modal";

import LogoNew from "./Light of Gold PR Logo.png"

// defines an event's NON ticket type specific information
let eventDetails;

// defines an event's image
let eventLogo = DefaultLogo;

const EventDetail = () => {
  // Defines data loading control variables
  //const [isLoadingEvent, setIsLoadingEvent] = useState(true);// FROM EVENT DETAIL
  const [isSuccessfull, setIsSuccessfull] = useState(true);// FROM EVENT DETAIL
  
  const [showLargerDoublePane, setShowLargerDoublePane] = useState(false);// FROM EVENT DETAIL
  const [showSmallerDoublePane, setShowSmallerDoublePane] = useState(false);// FROM EVENT DETAIL

  // defines styling variables
  const [isRestyling, setIsRestyling] = useState(false);// FROM EVENT DETAIL

  const [showModal, setShowModal] = useState(false);
  const [noEventDetails, setNoEventDetails] = useState();

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
          });
          
      })
      .catch(err => {
        // NEED TO ADDRESS THESE SITUATIONS
        if (err === "Error: Error: 400") {
        }
        if (err === undefined) {
        }
        //setIsLoadingEvent(true);
        setIsSuccessfull(false);
      })
      .finally(() => {
        //setIsLoadingEvent(false);
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


//DID NOT MAKE A CHANGE
  const stylingUpdate = (inWidth, inHeight) => {
    // based on window width, displays one or two panes
    if (inWidth < 790) {
    } else {
    }
  };

//DID NOT MAKE A CHANGE
  window.onresize = function(event) {
    stylingUpdate(window.innerWidth);
    if (window.innerWidth < 990) {
    } else {
    }
  };

  const backdropClickedHandler = () => {
    setShowModal(false);
  };

  let noDetailsModal;

  if (showModal) {
    noDetailsModal = (
      <Aux>
        <Modal
          show={showModal}
          modalClosed={backdropClickedHandler}
          event={noEventDetails}
        ></Modal>
      </Aux>
    );
  } else noDetailsModal = null;

  const eventSelectionHandler = (event, eventItem) => {
    if (eventItem.available) {
      setShowModal(false);
      //window.location.href = `/ev/${eventItem.url}`;
      window.location.href = `/${eventItem.url}`;
    } else {
      setNoEventDetails({
        title: eventItem.title,
        location: eventItem.location,
        date: eventItem.date
      });
      setShowModal(true);
    }
  };

  return (
    <div className={styles2.MainContainer}>
      <div className={styles2.MainGrid}>
        <section className={styles2.Events}>EVENT DETAIsL</section>
      </div>
    </div>
  );
};

export default EventDetail;
