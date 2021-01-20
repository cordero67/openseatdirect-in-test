import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { isAuthenticated } from "../../Users/apiUsers";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown, } from "@fortawesome/free-solid-svg-icons";

import { signout } from './apiSideDrawer';

import Aux from "../../hoc/Auxiliary/Auxiliary";
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

const getStatus= () =>{ 
  let tempData = JSON.parse(localStorage.getItem("user"));
  if ('user' in tempData && 'accountId' in tempData.user && 'status' in tempData.user.accountId ) {
    return tempData.user.accountId.status}
  else {
    console.log("returns 0")
    return 0;
  } 
}


const SideDrawerItems = (props) => {
  const [showSubItems, setShowSubItems] = useState(false);

  const changeShowItems = (setting) => {
    setShowSubItems(setting);
  };

  return (
    <ul className={classes.SideItems}>

      <li>
        <NavLink
          to="/events"
          style={isActive(props.currentPage, "/events")}
          onClick={props.clicked}
        >
          Events
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/eventspast"
          style={isActive(props.currentPage, "/eventspast")}
          onClick={props.clicked}
        >
          Past Events
        </NavLink>
      </li>

      {isAuthenticated() && (getStatus() === 7 || getStatus() === 8) ? (
        <li>
          <NavLink
            to="/vendor"
            style={isActive(props.currentPage, "/vendor")}
            onClick={props.clicked}
          >
            My Account
          </NavLink>
        </li>
      ) : null}

      {isAuthenticated() && (getStatus() !== 7 && getStatus() !== 8) ? (
        <li>
          <NavLink
            to="/personal"
            style={isActive(props.currentPage, "/personal")}
            onClick={props.clicked}
          >
            My Account
          </NavLink>
        </li>
      ) : null}

      
      <li>
        <NavLink
          to="/"
          style={isActive(props.currentPage, "/")}
          onClick={props.clicked}
          exact
        >
          Home
        </NavLink>
      </li>
      
      <li>
        <NavLink
          to="/video"
          style={isActive(props.currentPage, "/video")}
          onClick={props.clicked}
          exact
        >
          About
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/contactus"
          style={isActive(props.currentPage, "/contactus")}
          onClick={props.clicked}
          exact
        >
          Contact
        </NavLink>
      </li>


      {!isAuthenticated() && (
        <li>
          <NavLink
            to="/auth"
            style={isActive(props.currentPage, "/auth")}
            onClick={() => {
              props.clicked()
            }}
          >
            Sign In
          </NavLink>
        </li>
      )}

      {isAuthenticated() && (
        <li>
          <NavLink
            to="/events"
            style={{ color: "#0B1423" }}
            onClick={() => {
              props.clicked();
              signout(() => {
              })
            }}
          >
            Sign Out
          </NavLink>
        </li>
      )}
    </ul>
  );
};

export default SideDrawerItems;