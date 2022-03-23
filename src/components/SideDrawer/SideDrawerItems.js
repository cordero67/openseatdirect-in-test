import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { isAuthenticated,signout } from "../../Users/apiUsers";

///import { signout } from "./apiSideDrawer";

import classes from "./SideDrawerItems.module.css";

// determines if current menu item, i.e. "<NavLink>" is the active link
// "page" represents the actual active path
// "path" represents the path defined in the respective "<NavLink>"
const isActive = (page, path) => {
  if (page === path) {
    return { color: "white" };
  } else {
    return { color: "#0B1423" };
  }
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

const SideDrawerItems = (props) => {
  const [showSubItems, setShowSubItems] = useState(false);

  const changeShowItems = (setting) => {
    setShowSubItems(setting);
  };

  return (
    <ul className={classes.SideItems}>
      <li>
        <NavLink
          to="/"
          style={isActive(props.currentPage, "/")}
          onClick={props.clicked}
        >
          Events
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/past"
          style={isActive(props.currentPage, "/past")}
          onClick={props.clicked}
        >
          Past Events
        </NavLink>
      </li>

      {isAuthenticated() && (getStatus() === 7 || getStatus() === 8) ? (
        <li>
          <NavLink
            to="/myaccount"
            style={isActive(props.currentPage, "/myaccount")}
            onClick={props.clicked}
          >
            My Account
          </NavLink>
        </li>
      ) : null}

      {isAuthenticated() && getStatus() !== 7 && getStatus() !== 8 ? (
        <li>
          <NavLink
            to="/myaccount"
            style={isActive(props.currentPage, "/myaccount")}
            onClick={props.clicked}
          >
            My Account
          </NavLink>
        </li>
      ) : null}

      {!isAuthenticated() && (
        <li>
          <NavLink
            to="/auth"
            style={isActive(props.currentPage, "/auth")}
            onClick={() => {
              props.clicked();
            }}
          >
            Log in
          </NavLink>
        </li>
      )}

      {isAuthenticated() && (
        <li>
          <NavLink
            to="/"
            style={{ color: "#0B1423" }}
            onClick={() => {
              props.clicked();
              signout(() => {});
            }}
          >
            Log out
          </NavLink>
        </li>
      )}
    </ul>
  );
};

export default SideDrawerItems;
