import React, { Fragment, useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import classes from "./User.module.css";

import { signout } from "./apiUsers";

const AdminNavigation = (props) => {
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
            to="/adminevents"
            style={isActive(props.currentPage, "/adminevents")}
          >
            Events
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/adminorders"
            style={isActive(props.currentPage, "/adminorders")}
          >
            Orders
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/adminaccount"
            style={isActive(props.currentPage, "/adminaccount")}
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
            style={{ color: "#000" }}
            onClick={() => {
              signout(() => {
                //history.push("/");
              });
            }}
          >
            Sign Out
          </NavLink>
        </li>
      </ul>
    </Fragment>
  );
};

export default AdminNavigation;
