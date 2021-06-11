import React from "react";
import dateFormat from "dateformat";

import { API } from "../config";

import classes from "./EventTombstone.module.css";

const event = (props) => {
  let eventImage = `${API}/event/photo/e/${props.eventNum}`;

  let newDate = dateFormat(props.date, "ddd, mmm d, yyyy - h:MM TT", true);

  return (
    <article className={classes.Event} onClick={props.clicked}>
      <img
        className={classes.EventImage}
        src={eventImage}
        alt="No logo available"
        onerror="onerror=null;src='../../assets/Get_Your_Tickets.png'"
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
  );
};

export default event;
