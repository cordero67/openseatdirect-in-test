import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { isAuthenticated } from "../../Users/apiUsers";

import classes from "./HeaderItems.module.css";

// determines if current menu item, i.e. "<NavLink>" is the active link
// "page" represents the actual active path
// "path" represents the path defined in the respective "<NavLink>"
const isActive = (page, path) => {
  if (page === path) {
    return { color: "#007BFF" };
  } else {
    return { color: "#000" };
  }
};

const NavigationItems = (props) => {
  const [isResizing, setIsResizing] = useState(false);
  const [screenSize, setScreenSize] = useState(500);
  console.log("screenSize: ", screenSize);

  const stylingUpdate = (inWidth) => {
    console.log("stylingUpdate in Header");
    setIsResizing(true);
    setScreenSize(inWidth);
    setIsResizing(false);
    console.log("screenSize in Header: ", screenSize);
  };

  return (
    <ul className={classes.HeaderItems}>
      <li>
        <NavLink to="/" style={isActive(props.currentPage, "/")}>
          EVENTS
        </NavLink>
      </li>

      {!isAuthenticated() ? (
        <li>
          <NavLink
            to="/auth?view=signin"
            style={isActive(props.currentPage, "/auth")}
          >
            SIGN IN
          </NavLink>
        </li>
      ) : (
        <li>
          <NavLink
            to="/myaccount"
            style={isActive(props.currentPage, "/myaccount")}
          >
            MY ACCOUNT
          </NavLink>
        </li>
      )}
    </ul>
  );
};

export default NavigationItems;
