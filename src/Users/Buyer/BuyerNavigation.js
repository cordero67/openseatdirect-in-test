import React, { Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import { Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import classes from "./BuyerDashboard.module.css";

import { signout } from '../apiUsers';

const BuyerNavigation = (props) => {

  return (
    <Fragment>
      <ul className={classes.NavigationItems}>
        <li>
          <button 
            style={{
              fontSize: "14px",
              paddingLeft: "20px",
              border: "none",
              backgroundColor: props.pane === "profile" ? "#fff" : "#e7e7e7",
              cursor: "pointer",
              fontWeight: "600",
              display: "inline-block",
              width: "170px",
              height: "30px",
              textAlign: "left",
              outline: "none"
            }}
            name="profile"
            onClick={props.clicked}>
            MY PROFILE
          </button>
        </li>

        <li>
          <button 
            style={{
              fontSize: "14px",
              paddingLeft: "20px",
              border: "none",
              backgroundColor: props.pane === "wallet" ? "#fff" : "#e7e7e7",
              cursor: "pointer",
              fontWeight: "600",
              display: "inline-block",
              width: "170px",
              height: "30px",
              textAlign: "left",
              outline: "none"
            }}
            name="wallet"
            onClick={props.clicked}>
            TICKET WALLET
          </button>
        </li>

        <li>
          <button 
            style={{
              fontSize: "14px",
              paddingLeft: "20px",
              border: "none",
              backgroundColor: props.pane === "preferences" ? "#fff" : "#e7e7e7",
              cursor: "pointer",
              fontWeight: "600",
              display: "inline-block",
              width: "170px",
              height: "30px",
              textAlign: "left",
              outline: "none"
            }}
            name="preferences"
            onClick={props.clicked}>
            PREFERENCES
          </button>
        </li>

        <li>
          <button 
            style={{
              fontSize: "14px",
              paddingLeft: "20px",
              border: "none",
              backgroundColor: props.pane === "create" ? "#fff" : "#e7e7e7",
              cursor: "pointer",
              fontWeight: "600",
              display: "inline-block",
              width: "170px",
              height: "30px",
              textAlign: "left",
              outline: "none"
            }}
            name="create"
            onClick={props.clicked}>
            CREATE EVENT
          </button>
        </li>

        <li
        
        style={{
          fontSize: "14px",
          paddingLeft: "20px",
          backgroundColor: "#e7e7e7",
          cursor: "pointer",
          fontWeight: "bold",
          display: "inline-block",
          width: "170px",
          height: "30px",
          textAlign: "left"
        }}
        
        
        
        
        >
          <NavLink
            to="/signin"
            style={{color: "#000"}}
            onClick={() => {
              signout(() => {
              })
            }}
          >SIGN OUT
          </NavLink>
        </li>
      </ul>
    </Fragment>
  );
};

export default BuyerNavigation;