import React, { Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import { NavLink } from "react-router-dom";

import classes from "./ControlPanel.module.css";

import { signout } from '../apiUsers';

const VendorNavigation = (props) => {

  console.log("props: ", props);
  
  return (
    <Fragment>

      <div className={classes.NavigationTitle}>
          {true ?
            <span
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                lineHeight: "normal",
              }}>
              {props.buyerInfo.name}
            </span> :
            "Dashboard"}
      </div>

      <div className={classes.DashboardTitle}>
        <span
          style={{
            display: "inline-block",
            verticalAlign: "middle",
            lineHeight: "normal",
          }}>
          CONTROL PANEL
        </span>
      </div>

      <ul className={classes.NavigationBar}>
        <div className={classes.NavigationItems}>
          <li>
            <button
              className={classes.NavigationButton}
              style={{
                backgroundColor: props.pane === "profile" ? "#fff" : "#b8b8b8",
                outline: "none"
              }}
              name="profile"
              onClick={props.clicked}>
              PROFILE
            </button>
          </li>

          <li>
            <button
              className={classes.NavigationButton}
              style={{
                backgroundColor: props.pane === "account" ? "#fff" : "#b8b8b8",
                outline: "none"
              }}
              name="account"
              onClick={props.clicked}>
              ACCOUNT
            </button>
          </li>

          <li>
          <button
              className={classes.NavigationButton}
              style={{
                backgroundColor: props.pane === "events" ? "#fff" : "#b8b8b8",
                outline: "none"
              }}
              name="events"
              onClick={props.clicked}>
              EVENTS
            </button>
          </li>

          <li>
            <button
              className={classes.NavigationButton}
              style={{
                backgroundColor: props.pane === "dashboard" ? "#fff" : "#b8b8b8",
                outline: "none"
              }}
              name="dashboard"
              onClick={props.clicked}>
              EVENT DASHBOARD
            </button>
          </li>

          <li>
          <button
              className={classes.NavigationButton}
              style={{
                backgroundColor: props.pane === "orders" ? "#fff" : "#b8b8b8",
                outline: "none"
              }}
              name="orders"
              onClick={props.clicked}>
              ORDERS
            </button>
          </li>

          <li>
          <button
              className={classes.NavigationButton}
              style={{
                backgroundColor: props.pane === "create" ? "#fff" : "#b8b8b8",
                outline: "none"
              }}
              name="create"
              onClick={props.clicked}>
              CREATE EVENT
            </button>
          </li>

          <li 
          >
            <NavLink
            className={classes.NavigationButton}
              to="/signin"
              style={{color: "#000",
              fontWeight: "500"}}
              onClick={() => {
                signout(() => {
                })
              }}
            >SIGN OUT
            </NavLink>
          </li>
        </div>
      </ul>
    </Fragment>
  );
};

export default VendorNavigation;