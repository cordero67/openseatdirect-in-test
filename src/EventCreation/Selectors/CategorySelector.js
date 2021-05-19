//import classes from "*.module.css";
import React from "react";

import { eventCategories } from "./SelectorLists";

import classes from "./Selectors.module.css";

const CategorySelector = (props) => {
  let transformedCategories = Object.keys(eventCategories);
  let currentCategory;

  transformedCategories.forEach((category, index) => {
    if (props.current === eventCategories[category]) {
      currentCategory = category;
    }
  });

  return (
    <select
      className={classes.Category}
      type="text"
      id="input box category selector"
      value={currentCategory}
      name="eventCategory"
      defaultValue="default"
      onChange={(e) => {
        props.getCategory(eventCategories[e.target.value]);
      }}
      required
    >
      {transformedCategories.map((item, index) => {
        return <option key={index}>{item}</option>;
      })}
      <option style={{ display: "none" }} value="default" disabled>
        Choose an event category
      </option>
    </select>
  );
};

export default CategorySelector;
