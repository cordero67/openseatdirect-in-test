import React, { useState, useEffect } from "react";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import Spinner from "../../components/UI/Spinner/SpinnerNew";

import styles from "../../Events/Events.module.css";
import Event from "../../Events/EventTombstone";
import Modal from "./Modal";

import LightLogo from "./LightEventUpdate.png";
import HaHaLogo from "./HaHaForHireFeb.png";
import HaHaComedy from "./HaHaForHireComedyNight.png";
import PIFFLogo from "./PIFFLogo.png";
import TechWeekLogo from "./TechWeek.png";
import RikaRikaLogo from "./RikaRikaStudio.png";

const eventData = [
  {
    image: HaHaComedy,
    title: "Laugh Lounge - Weekly Showcase & Open Mic",
    eventNum: "20806407169",
    date: "Every Wednesday: 8:00 PM",
    description: "description2",
    location: "Voix Lounge, Philadelphia, PA",
    url: "et/laugh-lounge-weekly-comedy-showcase-&-open-mic?eventID=20806407169",
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
    url: "ed/sponsorship-2020-philly-tech-week?eventID=8681441794",
    available: true
  },
  {
    image: PIFFLogo,
    title: "Philadelphia Independent Film Festival #13",
    eventNum: "",
    date: "May 6-9, 2020: 4 Day Event",
    description: "description3",
    location: "Philadelphia, PA",
    url: "ed/PIFF-philadelphia-independent-film-festival?eventID=64064955878",
    available: true
  },
  {
    image: LightLogo,
    title: "Gold Women's Business Connect Conference",
    eventNum: "",
    date: "Fri, Mar 20, 2020: 8:30 AM",
    description: "description3",
    location: "Bryant Park, New York City",
    url: "edl/2020-gold-women-s-business-connnect-conference?eventID=46017305135",
    available: true
  },
  {
    image: RikaRikaLogo,
    title: "AmeRikaEigo by RikaRikaStudio",
    eventNum: "",
    date: "Mar 30 - Apr 30, 2020",
    description: "description3",
    location: "Nagano, Japan",
    url: "et/rikarikastudio?eventID=55390812012",
    available: true
  }
];

const Events = () => {
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