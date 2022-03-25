import React, { Fragment } from "react";
import Spinner from "../components/UI/Spinner/SpinnerNew";
import { API } from "../config";
import classes from "./Events.module.css";
import Event from "./EventTombstone";
import { useOurApi } from "../utils/useOurApi";

const Events = () => {

  //// useOurApi
  console.log ("in Events w useOurApi");

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  let method = "GET";
  let url =  `${API}/events`;
  let body = "";
  let initialData = null;

  const { isLoading, hasError, setUrl, setBody, data, networkError } =
      useOurApi(method, url, myHeaders, body, initialData);


  const eventSelectionHandler = (event, eventItem) => {
    window.location.href = `/ed/${eventItem.eventUrl}?eventID=${eventItem.eventNum}`;
  };
  

  const eventsNew = (eventDescriptions) => {
    console.log("eventDescriptions: ", eventDescriptions);
    if ((eventDescriptions?.length) > 0) {
      return (
        <Fragment>
          {eventDescriptions.map((eventItem, index) => {
            return (
              <Event
                key={index}
                event={eventItem}
                //={eventItem.eventNum}
                //title={eventItem.eventTitle}
                //date={eventItem.startDateTime}
                //location={eventItem.locationVenueName}
                //description={eventItem.description}
                //url={eventItem.url}
                clicked={(event) => eventSelectionHandler(event, eventItem)}
              />
            );
          })}
        </Fragment>
      );
    } else {
      return (
        <div style={{ fontSize: "20px" }}>There are currently no events.</div>
      );
    }
  }


  const showWrapper =(arg) =>{
    return  (
      <div className={classes.MainContainer}>
          <div className={classes.MainGrid}>
            <section className={classes.Events}>
              {arg}
            </section>
          </div>
      </div>
    );
  }

  if (isLoading) {
    return  showWrapper (<Spinner />)
  } else if (networkError) {
    return showWrapper (<div style={{ fontSize: "20px" }}>These was a network connectivity problem. Please check your connection, click the back button on your browser and try again.</div>);
  } else if (hasError) {    // must check networkError before hasError
    return showWrapper (<div style={{ fontSize: "20px",color: "red" }}>System problem. Please click the back button on your browser and try again...</div>);
  } else if (!data) {
      return showWrapper (<div style={{ fontSize: "20px" }}>There are currently no events!</div>)
  } else {
    data.map((item, index) => {
      if (!("photoUrl2" in item)) {
        item["photoUrl2"] =
          "https://imagedelivery.net/IF3fDroBzQ70u9_0XhN7Jg/cf557769-811d-44d6-8efc-cf75949d3100/public";
      };
      return null;
    });
//    eventDescriptions = data;   //this is never null;
    return showWrapper (eventsNew(data) )
  };
}

export default Events;

