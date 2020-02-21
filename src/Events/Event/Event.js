import React from "react";

import styles from "./Event.module.css";

const event = props => (
  <article className={styles.Event} onClick={props.clicked}>
    <img
      className={styles.EventImage}
      src={props.image}
      alt="Event Logo Coming Soon!!!"
      onClick={props.clicked}
    />
    <div className={styles.EventDetail}>
      <div className={styles.EventDate}>{props.date}</div>

      <div className={styles.EventTitle} onClick={props.clicked}>
        {props.title}
      </div>
      <div className={styles.EventLocation}>{props.location}</div>
    </div>
  </article>
);

export default event;
