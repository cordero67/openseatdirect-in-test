import React, { useState, useEffect } from "react";

import Aux from "../hoc/Auxiliary/Auxiliary";
import Spinner from "../components/UI/Spinner/SpinnerNew";

import { getAllEventData, getEventImage } from "./apiEvents";

import classes from "./Events.module.css";
import Event from "./Event/Event";

const Events = () => {
  const [eventDescriptions, setEventDescriptions] = useState();
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isSuccessfull, setIsSuccessfull] = useState(true);

  useEffect(() => {
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
            res[index].image = "";
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

  const eventSelectionHandler = (event, eventItem) => {
    window.location.href = `/ed/${eventItem.eventUrl}?eventID=${eventItem.eventNum}`;
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
    <div className={classes.MainContainer}>
      <div className={classes.MainGrid}>
        <section className={classes.Events}>{!isLoadingEvents ? eventsNew() : <Spinner/>}</section>
      </div>
    </div>
  );
};

export default Events;
