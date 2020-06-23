import React, { useState, useEffect } from "react";

import { API } from "../config";

import Aux from "../hoc/Auxiliary/Auxiliary";
import Spinner from "../components/UI/Spinner/SpinnerNew";

import { getAllEventData, getEventImage, getEventImage2 } from "./apiEvents";

import styles from "./Events.module.css";
import Event from "./Event/Event";
import Modal from "./Modal/Modal";
import { result } from "underscore";

const Events = () => {
  const [eventDescriptions, setEventDescriptions] = useState();
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isSuccessfull, setIsSuccessfull] = useState(true);


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
      setEventDescriptions(res);
      setIsSuccessfull(true)
      setIsLoadingEvents(false);
      /*
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
      */
     return res;
    })
    .then(res => {
      res.forEach ((item, index) => {
        console.log("Event Title: ", item.eventTitle)
        let tempEvent = getEventImage(item.eventNum);
        console.log("Event Number: ", tempEvent);
        res[index].eventImage = tempEvent;
      })
      console.log("SUCCESS")
      console.log("New res: ", res)
    })
    .catch(err => {
      console.log("error", err);
      setIsSuccessfull(false);
      isLoadingEvents(false);
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

  const eventsNew = () => {
    if (!isLoadingEvents) {
      //if (false) {
      if (isSuccessfull) {
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
        <div>There are currently no events!</div>
        )
      }
    } else {
      return <div>System error please reload this page.</div>;
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
