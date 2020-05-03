import React, { useState, useEffect } from "react";

import { americasCurrencies, europeCurrencies, asiaCurrencies, currencies } from './CategoryLists';

const CurrencySelector = (props) => {

    let transformedAmericas = Object.keys(americasCurrencies);
    let transformedEurope = Object.keys(europeCurrencies);
    let transformedAsia = Object.keys(asiaCurrencies);
    
    let transformedCurrencies = Object.keys(currencies);

    const [curencyValue, setCurrencyValue] = useState("empty")
/*
    const determineValue = (e) => {
    console.log("Currency chosen: ", e.target.value)
    console.log("Currency symbol: ", currencies[e.target.value]
    props.change(currencies[e.target.value])
    }
    */

    let defaultValue="Sand"

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
        placeholder="select ticket currency"
        default="Sweden Krona (SEK) kr"
        onChange={
            props.change;
        }
        >
            <option style={{display: "none"}} value="default" disabled>Choose an event category</option>
            <option style={{fontWeight: "900", color: "black"}} disabled>Americas</option>
            {transformedAmericas.map(zone => {
                return <option style={{paddingLeft: "5px"}} name={"americas"} value={americasCurrencies[zone]}>{zone}</option>
            })}
            <option style={{fontWeight: "900", color: "black"}} disabled>Europe</option>
            {transformedEurope.map(zone => {
                return <option name={"europe"} value={europeCurrencies[zone]}>{zone}</option>
            })}
            <option style={{fontWeight: "900", color: "black"}} disabled>Asia</option>
            {transformedAsia.map(zone => {
                return <option name={"asia"} value={asiaCurrencies[zone]}>{zone}</option>
            })}

        </select>
    )
}
/*
            <option style={{display: "none"}} value="default" disabled>Choose an event category</option>

            {transformedAmericas.map(zone => {
                if (transformedAmericas[zone] === null) {
                    return (
                        <option
                            style={{fontWeight: "1200", color: "blue"}}
                            disabled>
                            {americasCurrencies[zone]}
                        </option>)
                } else {
                    return (
                        <option
                            name={"americas"}
                            value={transformedAmericas[zone]}>
                            {" "}{zone}
                        </option>
                    )
                }
            })}


*/
export default CurrencySelector;