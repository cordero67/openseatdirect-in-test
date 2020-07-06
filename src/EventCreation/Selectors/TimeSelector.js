import React from "react";

import { militaryTimes } from './SelectorLists';

const TimeSelector = (props) => {

  console.log("props.current: ", props.current)

  let transformedTimes = Object.keys(militaryTimes);
  let currentTime;

  transformedTimes.forEach((time, index) => {
  console.log("props.current: ", props.current)
  console.log("militaryTimes[time]: ", militaryTimes[time])
    if (props.current === militaryTimes[time]) {
      currentTime = time;
    }
  })

  return (
    <select
      style={{
        padding: "9px 5px",
        border: "1px solid lightgrey",
        boxSizing: "borderBox",
        width: "105px",
        lineHeight: "1.75",
        cursor: "pointer"}}
      type="text"
      id="input box time selection"
      value={currentTime}
      name={props.name}
      onChange={(e) => {
        props.getTime(militaryTimes[e.target.value]);
      }}
      required
    >
      {transformedTimes.map((time, index) => {
        return <option key={index}>{time}</option>
      })}
    </select>
  )
}

export default TimeSelector;