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

  return (
    <Fragment>
      <ul className={classes.NavigationItems}>
        <li>
          <NavLink
            to="/vendorevents"
            style={isActive(props.currentPage, "/vendorevents")}
          >
            My Events
          </NavLink>
        </li>

        <li>
          <NavLink to="/eventcreation" style={{ color: "#000" }}>
            Create Event
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