import React from "react";

const CategorySelector = (props) => {

    return (
        <select
        style={{
            padding: "9px 10px",
            border: "1px solid lightgrey",
            boxSizing: "borderBox",
            width: "600px",
            lineHeight: "1.75",
            cursor: "pointer"}}
        type="text"
        id="input box ticket description"
        placeholder="Please select a category"
        name="eventCategory"
        defaultValue="default"
        onChange={props.onChange}
        required
        >
            <option value="music">Music</option>
            <option value="sports" >Sports</option>
            <option value="artTheatrer">Arts & Theatre</option>
            <option value="foodDrink">Food & Drink</option>
            <option value="charityCauses">Charity & Causes</option>
            <option value="family">Family</option>
            <option value="meeting">Meeting</option>
            <option value="other">Other</option>
            <option style={{display: "none"}} value="default" disabled>Choose an event category</option>
        </select>
    )
}

export default CategorySelector;