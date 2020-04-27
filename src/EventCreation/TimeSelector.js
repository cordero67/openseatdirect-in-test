import React, { useState, useEffect } from "react";

import { dayTimes } from './CategoryLists';

const TimeSelector = (props) => {

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
                name="ticketsSelected"
                onChange={props.onChange}
                required
              >
            {dayTimes.map(time => {
                return <option>{time}</option>
            })}
              </select>
    )
}

export default TimeSelector;