import React from "react";
import dateFormat from "dateformat";

import classes from "./EventTombstone.module.css";

const event = props => {
  let image = `https://www.openseatdirect.com/api/event/photo/e/${props.eventNum}`;
  let defaultImage = `https://www.openseatdirect.com/api/event/photo/e/46070595481`;

  console.log("image: ", image)

  let newDate = dateFormat(props.date, "ddd, mmm d, yyyy - h:MM TT", true);
  console.log("props.date: ", props.date)

  return (
  <article className={classes.Event} onClick={props.clicked}>
    <img
      className={classes.EventImage}
      src={image}
      alt={defaultImage}
      onClick={props.clicked}
    />
    <div className={classes.EventDetail}>
      <div className={classes.EventDate}>{newDate}</div>

      <div className={classes.EventTitle} onClick={props.clicked}>
        {props.title}
      </div>
      <div className={classes.EventLocation}>{props.location}</div>
    </div>
  </article>
  )
  };

export default event;
