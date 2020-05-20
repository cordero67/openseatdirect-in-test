import React, { Fragment, useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import classes from "./User.module.css";

import { signout } from './apiUsers';

const VendorNavigation = (props) => {
  const isActive = (page, path) => {
    if (page === path) {
      return { color: "#007BFF" };
    } else {
      return { color: "#000" };
    }
  };

  //console.log("props.currentPage: ", props.currentPage);

  return (
    <Fragment>
      <ul className={classes.NavigationItems}>
        <li>
          <NavLink
            to="/vendorevents"
            style={isActive(props.currentPage, "/vendorevents")}
          >
            Events
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/vendororders"
            style={isActive(props.currentPage, "/vendororders")}
          >
            Orders
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/vendoraccount"
            style={isActive(props.currentPage, "/vendoraccount")}
          >
            Account Settings
          </NavLink>
        </li>

        <li>
          <NavLink to="/eventcreation" style={{ color: "#000" }}>
            Create New Event
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/signin"
            style={{color: "#000"}}
            onClick={() => {
              signout(() => {
                //history.push("/");
              })
            }}
          >Sign Out
          </NavLink>
        </li>
      </ul>
    </Fragment>
  );
};

export default VendorNavigation;
