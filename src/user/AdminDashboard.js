import React, { useState, useEffect } from "react";

import { getAllEventData, isAuthenticated } from "./apiUser";

import Spinner from "../components/UI/Spinner/Spinner";

import styles from "./User.module.css";

// defines an event details, non-transactional
let eventDetails;

const AdminDashboard = () => {
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

  let eventInfo;

  if (!isLoading) {
    eventInfo = (
      <div>
        <h5>Current Ticket Offerings</h5>
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

        <div>Admin Dashboard</div>
        <div>Welcome {name}!</div>
        <br></br>
        <div>Admin information:</div>
        <div>Name: {name}</div>
        <div>E-mail: {email}</div>
        <div>Role: {role === 2 ? "Registered User" : "Administrator"}</div>
        <br></br>

        <div>{eventInfo}</div>
        <br></br>
        <br></br>
      </div>
    </div>
  );
};
export default AdminDashboard;
