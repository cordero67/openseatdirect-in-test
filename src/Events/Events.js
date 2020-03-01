import React, { useState, useEffect } from "react";

import Aux from "../hoc/Auxiliary/Auxiliary";
import styles from "./Events.module.css";
import Event from "./Event/Event";
import Modal from "./Modal/Modal";

import LightLogo from "./LightEvent.png";
import HaHaLogo from "./HaHaForHireFeb.png";
import HaHaComedy from "./HaHaForHireComedyNight.png";
import PIFFLogo from "./PIFFLogo.png";
import TechWeekLogo from "./TechWeek.png";

const eventData = [
  {
    image: HaHaComedy,
    title: "Laugh Lounge - Weekly Showcase & Open Mic",
    eventNum: "20806407169",
    date: "Every Wednesday: 8:00 PM",
    description: "description2",
    location: "Voix Lounge, Philadelphia, PA",
    url: "etPROMO/laugh-lounge-weekly-comedy-showcase-&-open-mic?eventID=20806407169",
    available: true
  },
  {
    image: HaHaLogo,
    title: "HaHa For Hire: The Lineup",
    eventNum: "85819827131",
    date: "Thu, Feb 27, 2020: 7:30 PM",
    description: "description1",
    location: "Voix Lounge, Philadelphia, PA",
    url: "edh/hahaforhire-presents-the-lineup?eventID=85819827131",
    available: true
  },
  {
    image: TechWeekLogo,
    title: "PTW 2020 Philly Tech Week",
    eventNum: "",
    date: "May 6-9, 2020: 4 Day Event",
    description: "description3",
    location: "Philadelphia, PA",
    url: "edt/PIFF-philadelphia-independent-film-festival?eventID=64064955878",
    available: true
  },
  {
    image: PIFFLogo,
    title: "Philadelphia Independent Film Festival #13",
    eventNum: "",
    date: "May 6-9, 2020: 4 Day Event",
    description: "description3",
    location: "Philadelphia, PA",
    url: "edf/PIFF-philadelphia-independent-film-festival?eventID=64064955878",
    available: true
  },
  {
    image: LightLogo,
    title: "Gold Women's Business Connect Conference",
    eventNum: "",
    date: "Fri, Mar, 2020: 8:30 AM",
    description: "description3",
    location: "Bryant Park, New York City",
    url: "edl/2020-gold-women-s-business-connnect-conference?eventID=46017305135",
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
