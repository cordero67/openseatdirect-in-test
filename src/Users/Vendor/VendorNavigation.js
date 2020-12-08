import React, { useState, useEffect, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import { NavLink } from "react-router-dom";

import classes from "./VendorAccountOLD.module.css";

import { signout } from '../apiUsers';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const VendorNavigation = (props) => {

  const [buyerInfo, setBuyerInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      let tempBuyerInfo = {};
      tempBuyerInfo.name = tempUser.user.name
      setBuyerInfo(tempBuyerInfo);
    } else {
      window.location.href = "/signin";
    }
    setIsLoading(false);
  }, []);
  
  return (
    <Fragment>
      <div className={classes.NavigationTitle}>
          {!isLoading ?
            <span
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                lineHeight: "normal",
              }}>
              {buyerInfo.name}
            </span> :
            null}
      </div>

      <div className={classes.DashboardTitle}>
        <span
          style={{
            display: "inline-block",
            verticalAlign: "middle",
            lineHeight: "normal",
          }}>
          <FontAwesomeIcon
            color="white"
            cursor="pointer"
            icon={faHome}
          />{" "}MY ACCOUNT
        </span>
      </div>

      <ul className={classes.NavigationBar}>
        <div className={classes.NavigationItems}>

          <li>
            <button
              className={classes.NavigationButton}
              style={{
                backgroundColor: (props.pane === "events" ||
                props.pane === "salesAnalytics" ||
                props.pane === "ticketSales" ||
                props.pane === "issueTickets" ||
                props.pane === "editEvent")
                ? "#e0e0e0" : "#b8b8b8",


                outline: "none"
              }}
              name="events"
              onClick={props.clicked}>
              MY EVENTS
            </button>
          </li>

          <li>
          <button
              className={classes.NavigationButton}
              style={{
                backgroundColor: props.pane === "orders" ? "#e0e0e0" : "#b8b8b8",
                outline: "none"
              }}
              name="orders"
              onClick={props.clicked}>
              ALL ORDERS
            </button>
          </li>

          <li>
          <button
              className={classes.NavigationButton}
              style={{
                backgroundColor: props.pane === "create" ? "#e0e0e0" : "#b8b8b8",
                outline: "none"
              }}
              name="create"
              onClick={props.clicked}>
              CREATE EVENT
            </button>
          </li>
          
          <li>
            <button
              className={classes.NavigationButton}
              style={{
                backgroundColor: props.pane === "profile" ? "#e0e0e0" : "#b8b8b8",
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
                backgroundColor: props.pane === "account" ? "#e0e0e0" : "#b8b8b8",
                outline: "none"
              }}
              name="account"
              onClick={props.clicked}>
              ACCOUNT
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


/*
          <li>
            <button
              className={classes.NavigationButton}
              style={{
                backgroundColor: (
                  props.pane === "salesAnalytics" ||
                  props.pane === "manualOrderEntry" ||
                  props.pane === "ticketSales"
                  ) ? "#e0e0e0" : "#b8b8b8",
                outline: "none"
              }}
              name="editEvent"
              onClick={(event) => {
                if (props.pane !== "salesAnalytics" && props.pane !== "manualOrderEntry" && props.pane !== "ticketSales")
                props.clicked(event)
              }}>
              EVENT DASHBOARD
            </button>
          </li>

          <div
            style={{
              backgroundColor: "#e0e0e0",
              padding: "0px"
          }}>

            {(props.pane === "salesAnalytics" ||
              props.pane === "ticketSales" ||
              props.pane === "manualOrderEntry" ||
              props.pane === "editEvent") ?
              (
                <li
                  style={{
                    paddingTop: "5px",
                    paddingBottom: "0px"
                }}>

                  <button
                    className={classes.NavigationSubButton}
                    style={{
                      backgroundColor: props.pane === "ticketSales" ? "#fff" : "#e0e0e0",
                      outline: "none"
                    }}
                    name="ticketSales"
                    onClick={props.clicked}>
                    Ticket Orders
                  </button>

                  <button
                    className={classes.NavigationSubButton}
                    style={{
                      backgroundColor: props.pane === "manualOrderEntry" ? "#fff" : "#e0e0e0",
                      outline: "none"
                    }}
                    name="manualOrderEntry"
                    onClick={props.clicked}>
                    Manual Order Entry
                  </button>

                  <button
                    className={classes.NavigationSubButton}
                    style={{
                      backgroundColor: props.pane === "editEvent" ? "#fff" : "#e0e0e0",
                      outline: "none"
                    }}
                    name="editEvent"
                    onClick={props.clicked}>
                    Event Edit
                  </button>

                </li>
              ) :
              null
            }
          </div>

*/