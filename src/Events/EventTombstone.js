import React from "react";
import dateFormat from "dateformat";

import classes from "./EventTombstone.module.css";

const event = (props) => {
  let newDate = dateFormat(
    props.event.startDateTime,
    "ddd, mmm d, yyyy - h:MM TT",
    true
  );

  return (
    <article className={classes.Event} onClick={props.clicked}>
      <img
        className={classes.EventImage}
        src={props.event.photoUrl2}
        alt="No logo available"
        onClick={props.clicked}
      />
      <div className={classes.EventDetail}>
        <div className={classes.EventDate}>{newDate}</div>

        <div className={classes.EventTitle} onClick={props.clicked}>
          {props.event.eventTitle}
        </div>
        <div className={classes.EventLocation}>
          {props.event.locationVenueName}
        </div>
      </div>
    </article>
  );
};

export default event;
