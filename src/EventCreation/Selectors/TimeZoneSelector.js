import React from "react";

import { timeZones } from "./SelectorLists";

import classes from "./Selectors.module.css";

const TimeZoneSelector = (props) => {
  let transformedTimeZones = Object.keys(timeZones);
  let currentZone;

  transformedTimeZones.forEach((zone, index) => {
    if (props.current === timeZones[zone]) {
      currentZone = zone;
    }
  });

  return (
    <select
      className={classes.TimeZone}
      type="text"
      id="input box time zone selection"
      value={currentZone}
      name="timeZone"
      onChange={(e) => {
        props.getTimeZone(timeZones[e.target.value]);
      }}
      required
    >
      {transformedTimeZones.map((zone, index) => {
        return <option key={index}>{zone}</option>;
      })}
    </select>
  );
};

export default TimeZoneSelector;
