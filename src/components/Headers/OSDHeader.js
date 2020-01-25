import React, { useState } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Nav } from "react-bootstrap";

import styles from "./OSDHeader.module.css";

// determines if current menu item, i.e. "<NavLink>" is the active link
// "history" represents the actual active path
// "path" represents the path defined in the respective "<NavLink>"
const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "black" };
  } else {
    return { color: "ffffff" };
  }
};

const Header = ({ history, logoType, styleType, showFullHeader }) => {
  let headerDisplay;

  if (showFullHeader) {
    headerDisplay = (
      <Nav className={styles[styleType]}>
        <ul>
          <li>
            <NavLink to="/" exact>
              <img
                src={logoType}
                alt="OpenSeatDirect Logo"
                className={styles.Logo}
              />
            </NavLink>
          </li>

          <li>
            <NavLink to="/video" style={isActive(history, "/video")} exact>
              Video
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/contactus"
              style={isActive(history, "/contactus")}
              exact
            >
              Contact
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/ev/ha_ha_for_hire?eventID=10056046773"
              style={isActive(
                history,
                "/ev/ha_ha_for_hire?eventID=10056046773"
              )}
            >
              Events
            </NavLink>
          </li>
        </ul>
      </Nav>
    );
  } else {
    headerDisplay = (
      <Nav className={styles[styleType]}>
        <ul>
          <li>
            <NavLink to="/" exact>
              <img
                src={logoType}
                alt="OpenSeatDirect Logo"
                className={styles.Logo}
              />
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/ev/ha_ha_for_hire?eventID=10056046773"
              style={isActive(
                history,
                "/ev/ha_ha_for_hire?eventID=10056046773"
              )}
            >
              Events
            </NavLink>
          </li>
        </ul>
      </Nav>
    );
  }

  return <div>{headerDisplay}</div>;
};

export default withRouter(Header);
