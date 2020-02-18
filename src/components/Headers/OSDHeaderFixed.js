import React, { useState, useEffect } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Nav } from "react-bootstrap";

import styles from "./OSDHeader.module.css";

// determines if current menu item, i.e. "<NavLink>" is the active link
// "history" represents the actual active path
// "path" represents the path defined in the respective "<NavLink>"
const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#8DADD4" };
  } else {
    return { color: "#000" };
  }
};

const Header = ({ history, logoType, styleType }) => {
  const [showFullHeader, setShowFullHeader] = useState(false);

  const stylingUpdate = (inWidth, inHeight) => {
    // based on window width, displays one or two panes
    if (inWidth < 700) {
      setShowFullHeader(false);
    } else {
      setShowFullHeader(true);
    }
  };

  useEffect(() => {
    stylingUpdate(window.innerWidth, window.innerHeight);
  }, []);

  window.onresize = function(event) {
    if (window.innerWidth < 700) {
      setShowFullHeader(false);
    } else {
      setShowFullHeader(true);
    }
  };
  
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
            <NavLink to="/events" style={isActive(history, "/events")}>
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
            <NavLink to="/events" style={isActive(history, "/events")}>
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
