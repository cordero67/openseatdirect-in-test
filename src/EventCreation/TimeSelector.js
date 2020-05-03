import React, { useState, useEffect } from "react";

import { timeMilliseconds } from './CategoryLists';

const TimeSelector = (props) => {
  let transformedTimes = Object.keys(timeMilliseconds);

  /*
  milliseconds in ah hour 360000

  let date = new Date();
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;
  let day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  console.log('todays date: ',month, '/', day, '/', year);

  const getFormattedDate = () => {
      let date = new Date();
      let year = date.getFullYear();
      let month = (1 + date.getMonth()).toString();
      month = month.length > 1 ? month : '0' + month;
      let day = date.getDate().toString();
      day = day.length > 1 ? day : '0' + day;
      return month + '/' + day + '/' + year;
  */

  return (
    <select
      style={{
        padding: "9px 5px",
        border: "1px solid lightgrey",
        boxSizing: "borderBox",
        width: "105px",
        lineHeight: "1.75",
        cursor: "pointer"}}
      type="number"
      id="input box ticket description"
      placeholder="12:00 PM"
      onChange={props.change}
      required
    >
      {transformedTimes.map((time, index) => {
        return <option key={index} value={timeMilliseconds[time]} name={time}
          >{time}</option>
      })}
    </select>
  )
}

export default TimeSelector;