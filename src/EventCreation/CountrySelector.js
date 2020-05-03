import React from "react";

import { countries } from './CategoryLists';

const CountrySelector = (props) => {

    return (
        <select
        style={{
            padding: "9px 5px",
            border: "1px solid lightgrey",
            boxSizing: "borderBox",
            width: "600px",
            lineHeight: "1.75",
            cursor: "pointer"}}
        type="number"
        id="input box ticket description"
        placeholder="12:00 PM"
        name="ticketsSelected"
        onChange={props.onChange}
        required
        >
        {countries.map((item, index) => {
            return <option key={index} >{item}</option>
        })}
        </select>
    )
}

export default CountrySelector;