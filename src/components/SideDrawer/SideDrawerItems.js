import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { isAuthenticated } from "../../Users/apiUsers";

import { signout } from "./apiSideDrawer";

import classes from "./SideDrawerItems.module.css";

const SideDrawerItems = (props) => {
  console.log("PROPS: ", props);
  const [showSubItems, setShowSubItems] = useState(false);

  // determines if current menu item, i.e. "<NavLink>" is the active link
  // "page" represents the actual active path
  // "path" represents the path defined in the respective "<NavLink>"
  const isActive = (page, path) => {
    if (page === path) {
      return { color: "blue", fontWeight: "500" };
    } else {
      return { color: "#000", fontWeight: "400" };
    }
  };

  const currentTab = (page, path, tab) => {
    if (page === path && tab === props.accountTab) {
      return { color: "blue", fontWeight: "500" };
    } else {
      return { color: "#000", fontWeight: "400" };
    }
  };

  const getStatus = () => {
    let tempData = JSON.parse(localStorage.getItem("user"));
    if (
      "user" in tempData &&
      "accountId" in tempData.user &&
      "status" in tempData.user.accountId
    ) {
      return tempData.user.accountId.status;
    } else {
      console.log("returns 0");
      return 0;
    }
  };

  const changeShowItems = () => {
    console.log("Changing Show Status");
    setShowSubItems(!showSubItems);
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
        <li style={isActive(props.currentPage, "/myaccount")}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "185px 25px",
            }}
          >
            My Account
            {!showSubItems ? (
              <ion-icon
                style={{
                  fontWeight: "600",
                  fontSize: "24px",
                  color: "black",
                }}
                name="add-outline"
                cursor="pointer"
                onClick={() => setShowSubItems(!showSubItems)}
              />
            ) : (
              <ion-icon
                style={{
                  fontWeight: "600",
                  fontSize: "24px",
                  color: "black",
                }}
                name="remove-outline"
                cursor="pointer"
                onClick={() => setShowSubItems(!showSubItems)}
              />
            )}
          </div>
        </li>
      ) : null}

      <div style={{ paddingLeft: "20px" }}>
        {isAuthenticated() &&
        (getStatus() === 7 || getStatus() === 8) &&
        showSubItems ? (
          <li>
            <NavLink
              to="/myaccount"
              style={currentTab(props.currentPage, "/myaccount", "events")}
              onClick={(e) => props.clicked(e, "events")}
            >
              My Events
            </NavLink>
          </li>
        ) : null}

        {isAuthenticated() &&
        (getStatus() === 7 || getStatus() === 8) &&
        showSubItems ? (
          <li>
            <NavLink
              to="/myaccount"
              style={currentTab(props.currentPage, "/myaccount", "create")}
              onClick={(e) => props.clicked(e, "create")}
            >
              Create Event
            </NavLink>
          </li>
        ) : null}

        {isAuthenticated() &&
        (getStatus() === 7 || getStatus() === 8) &&
        showSubItems ? (
          <li>
            <NavLink
              to="/myaccount"
              style={currentTab(props.currentPage, "/myaccount", "account")}
              onClick={(e) => props.clicked(e, "account")}
            >
              Account Settings
            </NavLink>
          </li>
        ) : null}

        {isAuthenticated() &&
        (getStatus() === 7 || getStatus() === 8) &&
        showSubItems ? (
          <li>
            <NavLink
              to="/myaccount"
              style={currentTab(props.currentPage, "/myaccount", "wallet")}
              onClick={(e) => props.clicked(e, "wallet")}
            >
              My Tickets
            </NavLink>
          </li>
        ) : null}

        {isAuthenticated() &&
        getStatus() !== 7 &&
        getStatus() !== 8 &&
        showSubItems ? (
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
      </div>

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

      <li>
        <NavLink
          to="/privacypolicy"
          style={isActive(props.currentPage, "/privacypolicy")}
          onClick={props.clicked}
          exact
        >
          Privacy Policy
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/termsconditions"
          style={isActive(props.currentPage, "/termsconditions")}
          onClick={props.clicked}
          exact
        >
          Terms of Service
        </NavLink>
      </li>

      {!isAuthenticated() && (
        <li>
          <NavLink
            to="/auth"
            style={isActive(props.currentPage, "/auth")}
            onClick={() => {
              props.clicked();
            }}
          >
            Sign In
          </NavLink>
        </li>
      )}

      {isAuthenticated() && (
        <li style={{ borderBottom: "none" }}>
          <NavLink
            to="/events"
            style={{ color: "#000", fontWeight: "400" }}
            onClick={() => {
              props.clicked();
              signout(() => {});
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
