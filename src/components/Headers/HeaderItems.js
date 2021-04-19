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

  const getStatus = () => {
    let tempData = JSON.parse(localStorage.getItem("user"));
    if (
      "user" in tempData &&
      "accountId" in tempData.user &&
      "status" in tempData.user.accountId
    ) {
      return tempData.user.accountId.status;
    } else {
      console.log("returns 0");
      return 0;
    }
  };

  let userPath;

  if (isAuthenticated() && getStatus() !== 7 && getStatus() !== 8) {
    userPath = "/personal";
  } else if (isAuthenticated()) {
    userPath = "/vendor";
  }

  return (
    <ul className={classes.HeaderItems}>
      <li>
        <NavLink to="/events" style={isActive(props.currentPage, "/events")}>
          EVENTS
        </NavLink>
      </li>

      {!isAuthenticated() && (
        <li>
          <NavLink to="/auth" style={isActive(props.currentPage, "/auth")}>
            SIGN IN
          </NavLink>
        </li>
      )}

      {userPath === "/vendor" && (
        <li>
          <NavLink to="/vendor" style={isActive(props.currentPage, "/vendor")}>
            MY ACCOUNT
          </NavLink>
        </li>
      )}

      {userPath === "/personal" && (
        <li>
          <NavLink
            to="/personal"
            style={isActive(props.currentPage, "/personal")}
          >
            MY ACCOUNT
          </NavLink>
        </li>
      )}
    </ul>
  );
};

export default NavigationItems;
