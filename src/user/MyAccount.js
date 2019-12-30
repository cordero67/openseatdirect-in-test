import React, { useState, useEffect } from "react";

import { getAllEventData, isAuthenticated } from "./apiUser";

import Spinner from "../components/UI/Spinner/Spinner";

import styles from "./User.module.css";

// defines an event details, non-transactional
let eventDetails;

const MyAccount = () => {

  // destructoring of "user" object in "localStorage" "data" variable
  const {
    user: { email, name, role, _id }
  } = isAuthenticated();

  return (
    <div className={styles.MainContainer}>
      <div className={styles.BlankCanvas}>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>

        <div>{name}'s Account Home Page</div>
        <br></br>
        <div>Account information:</div>
        <div>Name: {name}</div>
        <div>E-mail: {email}</div>
        <div>Role: {role === 0 ? "Registered User" : "Personal Account"}</div>
        <br></br>
        <br></br>
        <br></br>
      </div>
    </div>
  );
};
export default MyAccount;