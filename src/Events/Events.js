import React, { useState, useEffect, Fragment } from "react";

import { getAllEventData } from "./apiEvents";

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

  const downloadEmployeeData = () => {
    /*
    fetch(
      "https://api.bondirectly.com/reports/admin?rsid=order1&eventNum=59490622550&csv=true",
      { method: "POST" }
    ).then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "employees.json";
        a.click();
      });
      window.location.href = response.url;
    });
    */
  };

  return (
    <div className={classes.MainContainer}>
      <div className={classes.MainGrid}>
        <div id="container">
          <h1>Download File using React App</h1>
          <h3>Download Employee Data using Button</h3>
          <p />
          <h3>Download Employee Data using Link</h3>
        </div>

        <section className={classes.Events}>
          {!isLoadingEvents ? eventsNew() : <Spinner />}
        </section>
      </div>
    </div>
  );
};

export default Events;
