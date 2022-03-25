import React, { Fragment } from "react";
import Spinner from "../components/UI/Spinner/SpinnerNew";
import { API } from "../config";
import classes from "./Events.module.css";
import Event from "./EventTombstone";
import { useOurApi } from "../utils/useOurApi";

const EventsPasts = () => {

  //// useOurApi
  console.log ("in EventsPasts w useOurApi");

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  let method = "GET";
  let url =  `${API}/events?past=true`;
  let body = "";
  let initialData = null;

  const { isLoading, hasError, setUrl, setBody, data, networkError } =
      useOurApi(method, url, myHeaders, body, initialData);


  const eventSelectionHandler = (event, eventItem) => {
    window.location.href = `/ed/${eventItem.eventUrl}?eventID=${eventItem.eventNum}`;
  };
  

  const eventsNew = (eventDescriptions) => {
    console.log("eventDescriptions: ", eventDescriptions);
    if (eventDescriptions.length > 0) {
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
        <div style={{ fontSize: "20px" }}>There are currently no events!</div>
      );
    }
  }


  const showWrapper =(arg) =>{
    return  (
      <div className={classes.MainContainer}>
          <div className={classes.MainGrid}>
            <div className={classes.EventsHeader}>Past Events:</div>
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
    return showWrapper (<div style={{ fontSize: "20px" }}>System problem. Please click the back button on your browser and try again...</div>);
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

export default EventsPasts;

  ////

    /*

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

}


*/
