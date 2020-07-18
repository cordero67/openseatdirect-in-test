import React, { useState } from "react";
import dateFormat from "dateformat";

import classes from "./EventTombstone.module.css";
import defaultImage from "../assets/Get_Your_Tickets.png";

const event = props => {
  let eventImage = `https://www.openseatdirect.com/api/event/photo/e/${props.eventNum}`;
  //const [image, setImage] = useState(eventImage);

  //console.log("image: ", image)

  let newDate = dateFormat(props.date, "ddd, mmm d, yyyy - h:MM TT", true);
  console.log("props.date: ", props.date)

  //const onError = () => {
  //  setImage(defaultImage)
  //}

  return (
  <article className={classes.Event} onClick={props.clicked}>
    <img
      className={classes.EventImage}
      src={eventImage}
      alt="No logo available"
      //onError={(e) => {
      //  e.target.src = '../../assets/Get_Your_Tickets.png'
      //onError={() => {
      //  onError()
     //}}
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
