import React, { useState, useEffect } from "react";

import { API } from "../config";

import Aux from "../hoc/Auxiliary/Auxiliary";
import Spinner from "../components/UI/Spinner/SpinnerNew";

import { getAllEventData, getEventImage, getEventImage2 } from "./apiEvents";

import styles from "./Events.module.css";
import Event from "./Event/Event";
import Modal from "./Modal/Modal";

const Events = () => {
  const [eventDescriptions, setEventDescriptions] = useState();
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isSuccessfull, setIsSuccessfull] = useState(true);

  // NEED TO REFACTOR
  const [showModal, setShowModal] = useState(false);
  const [noEventDetails, setNoEventDetails] = useState();

  useEffect(() => {
    stylingUpdate(window.innerWidth, window.innerHeight);
    eventData();
  }, []);

  const eventData = () => {
    getAllEventData()
    .then(res => {
      console.log("EVENT DATA from 'getAllEventData()': ", res);
      return res;
    })
    .then(res => {
      res.forEach ((item, index) => {
        console.log("Event Title: ", item.eventTitle)
        getEventImage(item.eventNum)
          .then(image => {
            console.log("Event Image: ", image);
            res[index].image = image;
            console.log("Event Image: ", res);
            return res;
          })
          .catch(err => {
            console.log("Error: No image was returned")
            res[index].image = "default logo";
          });
        console.log("SUCCESS");
        console.log("New Image for event ",index, " - ",res[index].image);
      })
      return res;
    })
    .then (res => {
      setEventDescriptions(res);
      setIsSuccessfull(true)
      setIsLoadingEvents(false);
      return res;
    })
    .catch(err => {
      console.log("error", err);
      setIsSuccessfull(false);
      setIsLoadingEvents(false);
    })
  };

  const stylingUpdate = (inWidth, inHeight) => {
    // based on window width, displays one or two panes
    if (inWidth < 790) {
    } else {
    }
  };

  window.onresize = function(event) {
    if (window.innerWidth < 990) {
    } else {
    }
  };

  // NEED TO REFACTOR
  const backdropClickedHandler = () => {
    setShowModal(false);
  };

  // NEED TO REFACTOR
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

  // NEED TO REFACTOR
  const eventSelectionHandler = (event, eventItem) => {
    //window.location.href = `/et/${eventItem.url}`;
    window.location.href = `/ed/${eventItem.eventUrl}?eventID=${eventItem.eventNum}`;

    //et/rikarikastudio?eventID=55390812012
  };

  const eventsNew = () => {
    if (isSuccessfull) {
      console.log("eventDescriptions: ", eventDescriptions)
      if (eventDescriptions.length > 0) {
        return (
          <Aux>
            {eventDescriptions.map((eventItem, index) => {
              return (
                <Event
                  key={index}
                  image={eventItem.image}
                  title={eventItem.eventTitle}
                  date={eventItem.startDateTime}
                  location={eventItem.locationVenueName}
                  description={eventItem.description}
                  url={eventItem.url}
                  clicked={event => eventSelectionHandler(event, eventItem)}
                />
              )
            })}
          </Aux>
        ) 
      } else {
        return (
          <div style={{ fontSize: "20px"}}>There are currently no events!</div>
        )
      }
    } else {
      return (
        <div style={{ fontSize: "20px", color: "red"}}>System error please reload this page.</div>
      )
    }
  }

  return (
    <div className={styles.MainContainer}>
      <div className={styles.MainGrid}>
        <section className={styles.Events}>{!isLoadingEvents ? eventsNew() : <Spinner/>}</section>
        {noDetailsModal}
      </div>
    </div>
  );
};

export default Events;
