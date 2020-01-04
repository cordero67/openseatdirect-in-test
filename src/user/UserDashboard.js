import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

import { getAllEventData, isAuthenticated } from "./apiUser";

import Spinner from "../components/UI/Spinner/Spinner";
import Aux from "../hoc/Auxiliary/Auxiliary";

import styles from "./User.module.css";

// defines an event details, non-transactional
let eventDetails;

const UserDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  // destructoring of "user" object in "localStorage" "data" variable
  const {
    user: { email, name, role, _id }
  } = isAuthenticated();

  useEffect(() => {
    setIsLoading(true);

    eventData(_id);
  }, []);

  const eventData = userID => {
    getAllEventData(userID)
      .then(res => {
        console.log("Event Data Received: ", res);
        eventDetails = res;
      })
      .catch(err => {
        console.log("In the catch");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const userLinks = () => {
    return (
      <Aux>
        <div>User Links</div>
        <Link to="/newevent">Create a New Event</Link>
      </Aux>
    );
  };

  let eventInfo;

  if (!isLoading) {
    eventInfo = (
      <div>
        <h5>Your Ticket Offerings</h5>
        <br></br>
        <h6>{eventDetails[0].eventTitle}</h6>
        <h6>{eventDetails[1].eventTitle}</h6>
      </div>
    );
  } else {
    eventInfo = <Spinner></Spinner>;
  }

  return (
    <div className={styles.MainContainer}>
      <div className={styles.BlankCanvas}>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>

        <div>User Dashboard</div>
        <div>Welcome {name}!</div>
        <br></br>
        <div>User information:</div>
        <div>Name: {name}</div>
        <div>E-mail: {email}</div>
        <div>Role: {role === 1 ? "Registered User" : "Simple User"}</div>
        <br></br>
        {userLinks()}
        <br></br>

        <div>{eventInfo}</div>
        <br></br>
      </div>
    </div>
  );
};

export default UserDashboard;
