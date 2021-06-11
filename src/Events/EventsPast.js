import React, { useState, useEffect, Fragment } from "react";

import Spinner from "../components/UI/Spinner/SpinnerNew";

import { API } from "../config";
import { getAllPastEventData } from "./apiEvents";

import classes from "./Events.module.css";
import Event from "./EventTombstone";

const EventsPasts = () => {
  const [eventDescriptions, setEventDescriptions] = useState();
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isSuccessfull, setIsSuccessfull] = useState(false);

  useEffect(() => {
    eventData();
  }, []);

  const eventData = () => {
    getAllPastEventData()
      .then((res) => {
        console.log("EVENT DATA from 'getAllEventData()': ", res);
        return res;
      })
      .then((res) => {
        res.map((item, index) => {
          console.log("new res");
          console.log("new res event num: ", res[index].eventNum);
          res[index]["url"] = `${API}/event/photo/e/${res[index].eventNum}`;
          item.url = "";
        });
        console.log("res: ", res);
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
    window.location.href = `/ed/${eventItem.eventUrl}?eventID=${eventItem.eventNum}`;
  };

  const eventsNew = () => {
    if (isSuccessfull) {
      console.log("eventDescriptions: ", eventDescriptions);
      if (eventDescriptions.length > 0) {
        return (
          <Fragment>
            {eventDescriptions.map((eventItem, index) => {
              return (
                <Event
                  key={index}
                  eventNum={eventItem.eventNum}
                  title={eventItem.eventTitle}
                  date={eventItem.startDateTime}
                  location={eventItem.locationVenueName}
                  description={eventItem.description}
                  url={eventItem.url}
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
        <div className={classes.EventsHeader}>Past Events:</div>
        <section className={classes.Events}>
          {!isLoadingEvents ? eventsNew() : <Spinner />}
        </section>
      </div>
    </div>
  );
};

export default EventsPasts;
