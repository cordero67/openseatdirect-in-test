import React, { useState, useEffect, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import { NavLink } from "react-router-dom";

import classes from "./ControlPanel.module.css";

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
                backgroundColor: props.pane === "events" ? "#e0e0e0" : "#b8b8b8",
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
                backgroundColor: props.parentPane === "dashboard" ? "#e0e0e0" : "#b8b8b8",
                outline: "none"
              }}
              name="dashboard"
              onClick={props.clicked}>
              EVENT DASHBOARD
            </button>
          </li>

          <div
            style={{
              backgroundColor: "#e0e0e0",
              padding: "0px"
          }}>

            {props.subPane === "dashboard" ?
              (
                <li
                  style={{
                    paddingTop: "5px",
                    paddingBottom: "0px"
                }}>
                  <button
                    className={classes.NavigationSubButton}
                    style={{
                      backgroundColor: props.pane === "ticketOrder" ? "#fff" : "#e0e0e0",
                      outline: "none"
                    }}
                    name="ticketOrder"
                    onClick={props.clicked}>
                    Ticket Order Entry
                  </button>
                </li>
              ) :
              null
            }
          </div>

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


            {props.pane === "dashboard" ?
              (
                <li
                  style={{
                    paddingTop: "5px",
                    paddingBottom: "0px",
                    paddingLeft: "0px"
                }}>
                  <button
                    className={classes.NavigationSubButton}
                    style={{
                      backgroundColor: props.pane === "dashboard" ? "#e0e0e0" : "#e0e0e0",
                      outline: "none"
                    }}
                    name="dashboard"
                    onClick={props.clicked}>
                    Ticket Orders
                  </button>
                </li>
              ) :
              null
            }

            {props.pane === "dashboard" ?
              (
                <li
                  style={{
                    paddingTop: "5px",
                    paddingBottom: "0px"
                }}>
                  <button
                    className={classes.NavigationSubButton}
                    style={{
                      backgroundColor: props.pane === "dashboard" ? "#e0e0e0" : "#e0e0e0",
                      outline: "none"
                    }}
                    name="dashboard"
                    onClick={props.clicked}>
                    Sales Analytics 
                  </button>
                </li>
              ) :
              null
            }


            {props.pane === "dashboard" ?
              (
                <li
                  style={{
                    paddingTop: "5px",
                    paddingBottom: "0px"
                }}>
                  <button
                    className={classes.NavigationSubButton}
                    style={{
                      backgroundColor: props.pane === "dashboard" ? "#e0e0e0" : "#e0e0e0",
                      outline: "none"
                    }}
                    name="dashboard"
                    onClick={props.clicked}>
                    Event Edit
                  </button>
                </li>
              ) :
              null
            }


            */