import React from "react";

import { timeZones } from "./SelectorLists";

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
      style={{
        padding: "9px 5px",
        border: "1px solid red",
        boxSizing: "borderBox",
        width: "500px",
        lineHeight: "1.75",
        cursor: "pointer",
      }}
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
