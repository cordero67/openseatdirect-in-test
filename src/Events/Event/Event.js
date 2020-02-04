import React from "react";

import styles from "./Event.module.css";

const event = props => (
  <article className={styles.Event} onClick={props.clicked}>
    <img
      className={styles.EventImage}
      src={props.image}
      alt="Event Logo Coming Soon!!!"
    />
    <h5>{props.name}</h5>
    <div>
      <h6>{props.description}</h6>
      <h6>
        {props.location} * {props.date}
      </h6>
    </div>
  </article>
);

export default event;
