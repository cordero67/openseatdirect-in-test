import React, { useState, useEffect } from "react";

import Aux from "../hoc/Auxiliary/Auxiliary";
import styles from "./Events.module.css";
import Event from "./Event/Event";

const eventData = [
  {
    image: "https://openseatdirect.com/api/event/photo/e/10056046773",
    name: "HaHa For Hire: The Lineup",
    date: "Feb. 28, 2020: 7:00 pm",
    description: "description1",
    location: "location1"
  },
  {
    image: "https://openseatdirect.com/api/event/photo/e/10056046773",
    name: "HaHa For Hire: Comedy Showcase & Open Mic",
    date: "Feb.5, 2020: 7:00 pm",
    description: "description1",
    location: "location1"
  },
  {
    image:
      "http://www.philadelphiaindependentfilmfestival.com/wp-content/uploads/2013/03/PIFF-FILMS-PRESENTS-FEST-13-HEADER_2019_.jpg",
    name: "Philly Independent Film Festival",
    date: "May 6-9, 2020: All day event",
    description: "description2",
    location: "location2"
  },
  {
    image: "https://openseatdirect.com/api/event/photo/e/81295501293",
    name: "Cocina Candela",
    date: "date3",
    description: "description3",
    location: "location3"
  },
  {
    image:
      "https://s7d2.scene7.com/is/image/TWCNews/0110_n13_puerto_rico_earthquakes_slate?wid=1250&hei=703&$wide-bg$",
    name: "Puerto Rico Earthquake Fund Raiser",
    date: "date4",
    description: "description4",
    location: "location4"
  }
];

const Events = () => {
  // contact information declaration
  const [contactInformation, setContactInformation] = useState({
    emailAddress: "",
    firstName: "",
    lastName: "",
    company: "",
    phoneNumber: "",
    message: ""
  });

  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isSuccessfull, setIsSuccessfull] = useState(true);
  const [showDoublePane, setShowDoublePane] = useState(true);

  useEffect(() => {
    //setIsLoadingEvents(true);
    //setIsSuccessfull(true);
    //console.log("About to call 'eventData()' inside 'TicketSelection'");
    //eventData(queryString.parse(window.location.search).eventID);
    stylingUpdate(window.innerWidth, window.innerHeight);
  }, []);

  const stylingUpdate = (inWidth, inHeight) => {
    //setIsRestyling(true);
    // based on window width, displays one or two panes
    if (inWidth < 790) {
      setShowDoublePane(false);
    } else {
      setShowDoublePane(true);
    }
    //setIsRestyling(false);
  };

  window.onresize = function(event) {
    if (window.innerWidth < 990) {
      setShowDoublePane(false);
    } else {
      setShowDoublePane(true);
    }
  };

  const events = eventData.map(post => {
    return (
      <Event
        image={post.image}
        name={post.name}
        date={post.date}
        location={post.location}
        description={post.description}
      />
    );
  });
  /*
  <article className="Post" onClick={props.clicked}>
    <h1>{props.title}</h1>
    <h2 className="Info">
      <h3 className="Author">{props.author}</h3>
    </h2>
  </article>;
  */

  let mainDisplay;
  let rightPane = (
    <Aux>
      <div style={{ fontWeight: "500", fontSize: "20px" }}>Right Pane</div>
    </Aux>
  );

  let leftPane = (
    <Aux>
      <section style={{ fontWeight: "500", fontSize: "20px" }}>
        {events}
      </section>
    </Aux>
  );

  let singlePane;

  if (showDoublePane) {
    mainDisplay = (
      <div className={styles.MainGrid}>
        <div className={styles.LeftPane}>{leftPane}</div>
        <div className={styles.RightPane}>{rightPane}</div>
      </div>
    );
  } else {
    mainDisplay = (
      <div className={styles.MainGrid}>
        <div className={styles.SinglePane}>
          {leftPane}
          <br></br>
          <br></br>
          {rightPane}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.MainContainer}>
      <div className={styles.MainGrid}>
        <section className={styles.Events}>{events}</section>
      </div>
    </div>
  );
};

export default Events;
