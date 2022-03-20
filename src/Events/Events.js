import React, { useState, useEffect, Fragment } from "react";

import { getAllEventData } from "./apiEvents";

import AdSense from "react-adsense";

import Event from "./EventTombstone";
import Spinner from "../components/UI/Spinner/SpinnerNew";

import classes from "./Events.module.css";

const Events = () => {
  const [eventDescriptions, setEventDescriptions] = useState();
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isSuccessfull, setIsSuccessfull] = useState(false);

  useEffect(() => {
    eventData();
  }, []);

  const eventData = () => {
    // retrieves event json for every event
    getAllEventData()
      .then((res) => {
        console.log("EVENT DATA from 'getAllEventData()': ", res);
        return res;
      })
      .then((res) => {
        // populates "photoUrl2" fields if not contained in event json
        res.map((item, index) => {
          if (!("photoUrl2" in item)) {
            item["photoUrl2"] =
              "https://imagedelivery.net/IF3fDroBzQ70u9_0XhN7Jg/cf557769-811d-44d6-8efc-cf75949d3100/public";
          }
        });

        return res;
      })
      .then((res) => {
        setEventDescriptions(res);
        setIsSuccessfull(true);
        return res;
      })
      .catch((err) => {
        console.log("error", err);
      })
      .finally(() => {
        setIsLoadingEvents(false);
      });
  };

  const eventSelectionHandler = (event, eventItem) => {
    localStorage.setItem(`eventNum`, JSON.stringify(eventItem.eventNum)); // set in case next step fails
    window.location.href = `/ed/${eventItem.eventUrl}?eventID=${eventItem.eventNum}`;
  };

  const eventsNew = () => {
    if (isSuccessfull) {
      console.log("eventDescriptions: ", eventDescriptions);
      if (eventDescriptions.length > 0) {
        return (
          <Fragment>
            {eventDescriptions.map((eventItem, index) => {
              console.log("Event item: ", eventItem);
              return (
                <Event
                  key={index}
                  event={eventItem}
                  clicked={(event) => eventSelectionHandler(event, eventItem)}
                />
              );
            })}
          </Fragment>
        );
      } else {
        return (
          <div style={{ fontSize: "20px" }}>There are currently no events!</div>
        );
      }
    } else {
      return (
        <div style={{ fontSize: "20px", color: "red" }}>
          System error please reload this page.
        </div>
      );
    }
  };

  return (
    <div className={classes.MainContainer}>
      <div className={classes.MainGrid}>
        <section className={classes.Events}>
          {!isLoadingEvents ? eventsNew() : <Spinner />}
        </section>
      </div>
    </div>
  );
};

export default Events;
