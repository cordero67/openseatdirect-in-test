import React from "react";
import dateFormat from "dateformat";

import classes from "./EventTombstone.module.css";
import ComingSoon from "./ComingSoon.png";

const event = props => {
  let image;
  console.log("props.EventImage: ", props.image)
  if (!props.image) {
    image = ComingSoon;
  } else {
    image = props.image;
  }

  let newDate = dateFormat(props.date, "ddd, mmm d, yyyy - h:MM TT", true);

  return (
  <article className={classes.Event} onClick={props.clicked}>
    <img
      className={classes.EventImage}
      src={image}
      alt="Event Logo Coming Soon!!!"
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
