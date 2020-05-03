import React, { useState, useEffect } from "react";

import { timeZones } from './CategoryLists';

const TimeZoneSelector = (props) => {

    let transformedTimeZones = Object.keys(timeZones);

    return (
        <select
        style={{
            padding: "9px 5px",
            border: "1px solid lightgrey",
            boxSizing: "borderBox",
            width: "330px",
            lineHeight: "1.75",
            cursor: "pointer"}}
        type="number"
        id="input box ticket description"
        placeholder="Eastern Time - New York"
        name="ticketsSelected"
        onChange={(e) => {
            props.getTimeZone(timeZones[e.target.value]);
        }}
        required
        >
            {transformedTimeZones.map((zone, index) => {
                return <option key={index} >{zone}</option>
            })}

        </select>
    )
}

export default TimeZoneSelector;