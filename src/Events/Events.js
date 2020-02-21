import React, { useState, useEffect } from "react";

import Aux from "../hoc/Auxiliary/Auxiliary";
import styles from "./Events.module.css";
import Event from "./Event/Event";
import Modal from "./Modal/Modal";

import Logo from "./NEWPIC.png";
import LogoNew from "./Light of Gold PR Logo.png"

const eventData = [
  {
    image: "https://openseatdirect.com/api/event/photo/e/10056046773",
    title: "HaHa For Hire: Comedy Showcase & Open Mic",
    eventNum: "",
    date: "Wed, Mar 6, 2020: 8:00 PM",
    description: "description2",
    location: "Voix Lounge, Philadelphia, PA",
    url: "",
    available: false
  },
  {
    image: "https://openseatdirect.com/api/event/photo/e/10056046773",
    title: "HaHa For Hire: The Lineup",
    eventNum: "10056046773",
    date: "Thu, Feb 27, 2020: 7:30 PM",
    description: "description1",
    location: "Voix Lounge, Philadelphia, PA",
    url: "etPROMO/ha_ha_for_hire?eventID=85819827131",
    available: "true"
  },
  {
    image: Logo,
    title: "Philadelphia Independent Film Festival #13",
    eventNum: "",
    date: "May 6-9, 2020: All Day Event",
    description: "description3",
    location: "Philadelphia, PA",
    url: "edphilly/PIFF_Philly_Interantional_Film_Festival?eventID=86753091234",
    available: true
  },
  {
    image: LogoNew,
    title: "Gold Women's Business Connect Conference",
    eventNum: "",
    date: "Fri, Mar 20, 2020: 8:30 PM",
    description: "description3",
    location: "Bryant Park, New York City",
    url: "ed/light_of_gold?eventID=46017305135",
    available: true
  }
];

const Events = () => {
  //const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  //const [isSuccessfull, setIsSuccessfull] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [noEventDetails, setNoEventDetails] = useState();

  useEffect(() => {
    stylingUpdate(window.innerWidth, window.innerHeight);
  }, []);

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
      //window.location.href = `/ev/${eventItem.url}`;
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

  const events = eventData.map((eventItem, index) => {
    return (
      <Event
        key={index}
        image={eventItem.image}
        title={eventItem.title}
        date={eventItem.date}
        location={eventItem.location}
        description={eventItem.description}
        url={eventItem.url}
        clicked={event => eventSelectionHandler(event, eventItem)}
      />
    );
  });

  return (
    <div className={styles.MainContainer}>
      <div className={styles.MainGrid}>
        <section className={styles.Events}>{events}</section>
        {noDetailsModal}
      </div>
    </div>
  );
};

export default Events;
