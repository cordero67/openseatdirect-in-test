import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { isAuthenticated } from "../../Users/apiUsers";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown, } from "@fortawesome/free-solid-svg-icons";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import classes from "./SideDrawerItems.module.css";

// determines if current menu item, i.e. "<NavLink>" is the active link
// "page" represents the actual active path
// "path" represents the path defined in the respective "<NavLink>"
const isActive = (page, path) => {
  if (page === path) {
    return { color: "#007BFF" };
  } else {
    return { color: "#000" };
  }
};

const getStatus= () =>{ 
  let tempData = JSON.parse(localStorage.getItem("user"));
  //console.log("tempData: ", tempData)
  //console.log("tempData.user: ", tempData.user)
  //console.log("tempData.user.accountId: ", tempData.user.accountId)
  //console.log("tempData.user.accountId.status: ", tempData.user.accountId.status)
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
          EVENTS
        </NavLink>
      </li>

      {isAuthenticated() && (getStatus() === 7 || getStatus() === 8) ? (
        <li>
          <NavLink
            to="/vendoraccount"
            style={isActive(props.currentPage, "/vendoraccount")}
            onClick={props.clicked}
          >
            MY ACCOUNT
          </NavLink>
        </li>
      ) : null}

      {isAuthenticated() && (getStatus() !== 7 && getStatus() !== 8) ? (
        <li>
          <NavLink
            to="/buyerdashboard"
            style={isActive(props.currentPage, "/buyerdashboard")}
            onClick={props.clicked}
          >
            DASHBOARD
          </NavLink>
        </li>
      ) : null}

      <li>
        <div className={classes.Title}>
          <div>OPENSEATDIRECT</div>
          {showSubItems ? (
            <FontAwesomeIcon
              cursor="pointer"
              color="red"
              onClick={() => changeShowItems(false)}
              icon={faChevronUp}
            />
          ) : (
            <FontAwesomeIcon
              cursor="pointer"
              color="green"
              onClick={() => changeShowItems(true)}
              icon={faChevronDown}
            />
          )}
        </div>
      </li>

      <div>
        {showSubItems ? (
          <Aux>
            <div
              style={{
                borderBottom: "1px solid lightgrey",
                paddingLeft: "20px",
              }}
            >
              <li style={{ borderBottom: "1px solid lightgrey" }}>
                <NavLink
                  to="/"
                  style={isActive(props.currentPage, "/")}
                  onClick={props.clicked}
                  exact
                >
                  HOME
                </NavLink>
              </li>
              <li style={{ borderBottom: "1px solid lightgrey" }}>
                <NavLink
                  to="/video"
                  style={isActive(props.currentPage, "/video")}
                  onClick={props.clicked}
                  exact
                >
                  ABOUT US
                </NavLink>
              </li>
              <li style={{ borderBottom: "0px" }}>
                <NavLink
                  to="/contactus"
                  style={isActive(props.currentPage, "/contactus")}
                  onClick={props.clicked}
                  exact
                >
                  CONTACT US
                </NavLink>
              </li>
            </div>
          </Aux>
        ) : null}
      </div>

      {!isAuthenticated() && (
        <li>
          <NavLink to="/signin" style={isActive(props.currentPage, "/signin")}>
            SIGN IN
          </NavLink>
        </li>
      )}

      {isAuthenticated() && (
        <li>
          <NavLink
            to="/signin"
            onClick={props.signOut}
            style={{ color: "#000" }}
          >
            SIGN OUT
          </NavLink>
        </li>
      )}
    </ul>
  );
};

export default SideDrawerItems;


/*
      <li>
        <NavLink
          to="/eventcreation"
          style={isActive(props.currentPage, "/eventcreation")}
          onClick={props.clicked}
        >
          EVENT CREATION
        </NavLink>
      </li>

      
     <li>
     <NavLink
       to="/events"
       style={isActive(props.currentPage, "/events")}
       onClick={props.clicked}
     >
       EVENTS
     </NavLink>
   </li>
      */
