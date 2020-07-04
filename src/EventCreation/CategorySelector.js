import React from "react";

import { eventCategories } from './CategoryLists';

const CategorySelector = (props) => {

    let transformedCategories = Object.keys(eventCategories);
    let currentCategory;

    transformedCategories.forEach((category, index) => {
        if (props.current === eventCategories[category]) {
            currentCategory = category;
        }
    })
    console.log("Inside Category Selector")
    console.log("props.current: ", props.current)

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
        id="input box category selector"
        placeholder="Please select a category"
        value={currentCategory}
        name="eventCategory"
        onChange={(e) => {
            props.getCategory(eventCategories[e.target.value]);
        }}
        required
        >
        {transformedCategories.map((item, index) => {
            return <option key={index} >{item}</option>
        })}
        </select>
    )
}

export default CategorySelector;



    /*

    "Music": "music",
    "Sports": "sports",
    "Arts & Theatre": "artTheater",
    "Food & Drink": "foodDrink",
    "Charity & Causes": "charityCauses",
    "Family": "family",
    "Meeting": "meeting",
    "Other": "other",
    "Choose an event category": "default",
*/
