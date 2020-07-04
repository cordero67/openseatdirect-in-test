import React from "react";

import { countryCodes } from './Selectors/CategoryLists';

const CountrySelector = (props) => {

    let transformedCountries = Object.keys(countryCodes);
    let currentCountry;

    transformedCountries.forEach((country, index) => {
        if (props.current === countryCodes[country]) {
            currentCountry = country;
        }
    })

    return (
        <select
            style={{
                padding: "9px 5px",
                border: "1px solid lightgrey",
                boxSizing: "borderBox",
                width: "600px",
                lineHeight: "1.75",
                cursor: "pointer"}}
            type="text"
            id="input box country selection"
            //placeholder="12:00 PM"
            value={currentCountry}
            name="locationCountryCode"
            onChange={(e) => {
                props.getCountry(countryCodes[e.target.value]);
            }}
            required
        >
            {transformedCountries.map((country, index) => {
                return <option key={index} >{country}</option>
            })}
        </select>
    )
}

export default CountrySelector;