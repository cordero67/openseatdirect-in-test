import React, { useState, useEffect, Fragment } from "react";

import { API } from "../config";

import Spinner from "../components/UI/Spinner/SpinnerNew";

import AdSense from "react-adsense";

import { getAllEventData } from "./apiEvents";

import classes from "./Events.module.css";
import Event from "./EventTombstone";

const Events = () => {
  const [eventDescriptions, setEventDescriptions] = useState();
  const [showModal, setShowModal] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isSuccessfull, setIsSuccessfull] = useState(false);

  useEffect(() => {
    eventData();
    setShowModal(false);
  }, []);

  const eventData = () => {
    getAllEventData()
      .then((res) => {
        console.log("EVENT DATA from 'getAllEventData()': ", res);
        return res;
      })
      .then((res) => {
        res.map((item, index) => {
          console.log("new res event num: ", res[index].eventNum);

          if ("photoUrl1" in item) {
            console.log("the 'photoUrl1' field exists");
          } else {
            console.log("the 'photoUrl1' field DOES NOT exist");
            item["photoUrl1"] =
              "https://craftofcoding.files.wordpress.com/2017/02/lena.jpg";
          }

          if ("photoUrl2" in item) {
            console.log("the 'photoUrl2' field exists");
          } else {
            console.log("the 'photoUrl2' field DOES NOT exist");
            item["photoUrl2"] =
              "https://craftofcoding.files.wordpress.com/2017/02/lena.jpg";
          }

          if ("photoUrl3" in item) {
            console.log("the 'photoUrl3' field exists");
          } else {
            console.log("the 'photoUrl3' field DOES NOT exist");
            item["photoUrl3"] =
              "https://craftofcoding.files.wordpress.com/2017/02/lena.jpg";
          }
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
                  url={eventItem.photoUrl2}
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
        <AdSense.Google client="ca-pub-5202710098076883" slot="7806394673" />
        <section className={classes.Events}>
          {!isLoadingEvents ? eventsNew() : <Spinner />}
        </section>
      </div>
    </div>
  );
};

export default Events;
