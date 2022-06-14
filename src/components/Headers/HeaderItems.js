import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { isAuthenticated } from "../../Users/apiUsers";

import classes from "./HeaderItems.module.css";

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
      {!isAuthenticated() ? (
        <li>
          <NavLink to="/auth?view=create" style={{ color: "#000" }}>
            Create Event
          </NavLink>
        </li>
      ) : (
        <li>
          <NavLink to="/createevent" style={{ color: "#000" }}>
            Create Event
          </NavLink>
        </li>
      )}
      <li style={{ fontSize: "16px" }}>
        <NavLink to="/" style={{ color: "#000" }}>
          Events
        </NavLink>
      </li>

      {!isAuthenticated() ? (
        <li>
          <NavLink to="/auth" style={{ color: "#000" }}>
            Log in
          </NavLink>
        </li>
      ) : (
        <li>
          <NavLink to="/myaccount" style={{ color: "#000" }}>
            Dashboard
          </NavLink>
        </li>
      )}
    </ul>
  );
};

export default NavigationItems;
