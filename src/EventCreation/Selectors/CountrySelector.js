import React from "react";

import { countryCodes } from "./SelectorLists";

import classes from "./Selectors.module.css";

const CountrySelector = (props) => {
  let transformedCountries = Object.keys(countryCodes);
  let currentCountry;

  transformedCountries.forEach((country, index) => {
    if (props.current === countryCodes[country]) {
      currentCountry = country;
    }
  });

  return (
    <select
      className={classes.Country}
      type="text"
      id="input box country selection"
      value={currentCountry}
      name="locationCountryCode"
      onChange={(e) => {
        props.getCountry(countryCodes[e.target.value]);
      }}
      required
    >
      {transformedCountries.map((country, index) => {
        return <option key={index}>{country}</option>;
      })}
    </select>
  );
};

export default CountrySelector;
