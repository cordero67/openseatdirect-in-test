import React, { Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import { NavLink } from "react-router-dom";

import classes from "./BuyerDashboard.module.css";

import { signout } from '../apiUsers';

const BuyerNavigation = (props) => {

  console.log("props: ", props);
  
  return (
    <Fragment>

      <div className={classes.NavigationTitle}>
          {props.buyerInfo.name ?
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
          MY DASHBOARD
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
                backgroundColor: props.pane === "vendor" ? "#fff" : "#b8b8b8",
                outline: "none"
              }}
              name="vendor"
              onClick={props.clicked}>
              BECOME A VENDOR
            </button>
          </li>

          <li>
          <button
              className={classes.NavigationButton}
              style={{
                backgroundColor: props.pane === "vendorold" ? "#fff" : "#b8b8b8",
                outline: "none"
              }}
              name="vendorold"
              onClick={props.clicked}>
              BECOME A VENDOR
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

export default BuyerNavigation;