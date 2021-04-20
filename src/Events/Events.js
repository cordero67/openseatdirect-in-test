import React, { useState, useEffect } from "react";

import { API } from "../config";

import Aux from "../hoc/Auxiliary/Auxiliary";
import Spinner from "../components/UI/Spinner/SpinnerNew";

import EventsModal from "./Modals/EventsModal";

import { getAllEventData } from "./apiEvents";

import classes from "./Events.module.css";
import Event from "./EventTombstone";

const Events = () => {
  const [eventDescriptions, setEventDescriptions] = useState();
  const [showModal, setShowModal] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isSuccessfull, setIsSuccessfull] = useState(false);
  const [dontAskAgain, setDontAskAgain] = useState(false);

  useEffect(() => {
    eventData();
    setShowModal(false);
  }, []);

  const handleErrors = (response) => {
    console.log("Inside 'apiCore' 'handleErrors()'", response);
    //console.log("json response: ", expandedLog(response, 1));
    if (!response.ok) {
      console.log("response was false!");
      console.log("response.status: ", response.status);
      throw Error(response.status);
    }
    return response;
  };

  const updateUser = () => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      let vendorToken = tempUser.token;
      let vendorId = tempUser.user._id;

      console.log("loading event and order data");
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Bearer " + vendorToken);

      let requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        redirect: "follow",
      };

      requestOptions.body = JSON.stringify({ askAgain: false });

      console.log("requestOptions: ", requestOptions);

      // USED BY CURRENT CODE APRIL 17, 2021
      // updates user information
      let fetchstr = `${API}/user/${vendorId}`;

      fetch(fetchstr, requestOptions)
        .then(handleErrors)
        .then((response) => response.text())
        .then((result) => {
          let tempResult = JSON.parse(result);
          console.log("new user object: ", tempResult);
          tempUser.user.askAgain = false;
          localStorage.setItem("user", JSON.stringify(tempUser));
          //tempUser.sort(compareValues("startDateTime", "asc"));
          //console.log("eventDescriptions ordered: ", tempUser);
          //localStorage.setItem("events", JSON.stringify(tempUser));
        })
        .catch((error) => {
          console.log("error in event information retrieval", error);
        });
    }
  };

  const eventData = () => {
    getAllEventData()
      .then((res) => {
        console.log("EVENT DATA from 'getAllEventData()': ", res);
        return res;
      })
      .then((res) => {
        res.map((item, index) => {
          console.log("new res event num: ", res[index].eventNum);
          // USED BY CURRENT CODE APRIL 17, 2021
          res[index]["url"] = `${API}/event/photo/e/${res[index].eventNum}`;
          //res[index].url = index;
          item.url = "";
        });
        console.log("res: ", res);
        return res;
      })
      /*
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
    })*/
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
          <Aux>
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
          </Aux>
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
