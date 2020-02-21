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
    date: "Wed, Feb 12, 2020 - 8:00 PM",
    description: "description2",
    location: "Voix Lounge, Philadelphia, PA",
    url: "",
    available: false
  },
  {
    image: "https://openseatdirect.com/api/event/photo/e/10056046773",
    title: "HaHa For Hire: The Lineup",
    eventNum: "10056046773",
    date: "Fri, Feb 28, 2020: 7:30 pm",
    description: "description1",
    location: "Voix Lounge, Philadelphia, PA",
    url: "etPROMO/ha_ha_for_hire?eventID=85819827131",
    available: "true"
  },
  {
    image: "https://openseatdirect.com/api/event/photo/e/81295501293",
    title: "Cocina Candela - Private Dinner",
    eventNum: "81295501293",
    date: "Wed, Jan 29, 2020 - 7:00 PM",
    description: "description4",
    location: "Montclair, NJ",
    url: "etPROMO/dahday_concina_candela?eventID=81295501293",
    available: true
  },
  {
    image:
      "https://s7d2.scene7.com/is/image/TWCNews/0110_n13_puerto_rico_earthquakes_slate?wid=1250&hei=703&$wide-bg$",
    title: "Puerto Rico Earthquake Fund Raiser",
    eventNum: "",
    date: "Mar 13-22, 2020: 10 Day Event",
    description: "description5",
    location: "Online Charity Event",
    url: "",
    available: false
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
    date: "Friday, March 20th, 2020",
    description: "description3",
    location: "Bryant Park, New York City",
    url: "ed/light_of_gold?eventID=46017305135",
    available: true
  },
  {
    image: "https://www.openseatdirect.com/api/event/photo/e/60909827273",
    title: "Billy Goat Hall of Fame Induction Ceremony",
    eventNum: "60909827273",
    date: "Fri, Jan 31, 2020 - 7:30 PM",
    description: "description6",
    location: "Chicago, IL",
    url: "etPROMO/billy_goat_tavern?eventID=60909827273",
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
