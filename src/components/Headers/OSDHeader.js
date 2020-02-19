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

const Header = ({ history, logoType, positioning }) => {
  const [showFullHeader, setShowFullHeader] = useState(false);
  const [isRestyling, setIsRestyling] = useState(false);

  const stylingUpdate = (inWidth) => {
    setIsRestyling(true);
    // based on window width, displays one or two panes
    if (inWidth < 550) {
      setShowFullHeader(false);
    } else {
      setShowFullHeader(true);
    }
    setIsRestyling(false);
  };

  window.onresize = function(event) {
    console.log("INNER WIDTH: ", window.innerWidth)
    stylingUpdate(window.innerWidth)
  };

  useEffect(() => {
    stylingUpdate(window.innerWidth);
  }, []);
  
  let headerDisplay;

 if (positioning === "fixed") {
    if (showFullHeader) {
      headerDisplay = (
        <div className={styles.HeaderFixed}>
          <div>
            <Nav>
              <NavLink to="/" exact>
                <img
                  src={logoType}
                  alt="OpenSeatDirect Logo"
                   className={styles.ImageBox}
                />
              </NavLink>
            </Nav>
          </div>
          <div className={styles.HeaderFixedLinks}>
            <Nav>
              <ul>
                <li>
                  <NavLink
                    to="/video"
                    style={isActive(history, "/video")}
                    exact
                  >About Us
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/contactus"
                    style={isActive(history, "/contactus")}
                    exact
                  >Contact
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/events"
                    style={isActive(history, "/events")}
                  >Events
                  </NavLink>
                </li>
              </ul>
            </Nav>
          </div>
        </div>
      );
    } else {
      headerDisplay = (
        <div className={styles.HeaderFixed}>
          <div>
            <Nav>
              <NavLink to="/" exact>
                <img
                  src={logoType}
                  alt="OpenSeatDirect Logo"
                  className={styles.ImageBox}
                />
              </NavLink>
            </Nav>
          </div>
          <div className={styles.HeaderFixedLinks}>
            <Nav>
              <ul>
                <li>
                  <NavLink
                    to="/video"
                    style={isActive(history, "/video")}
                    exact
                  >About Us
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/events"
                    style={isActive(history, "/events")}
                  >Events
                  </NavLink>
                </li>
              </ul>
            </Nav>
          </div>
        </div>
      );
    }
  } else if (positioning === "floating") {
      headerDisplay = (
        <div className={styles.HeaderFixed}>
          <div>
            <Nav>
              <NavLink to="/" exact>
                <img
                  src={logoType}
                  alt="OpenSeatDirect Logo"
                   className={styles.ImageBox}
                />
              </NavLink>
            </Nav>
          </div>
          <div className={styles.HeaderFixedLinks}>
            <Nav>
              <ul>
                <li>
                  <NavLink
                    to="/video"
                    style={isActive(history, "/video")}
                    exact
                  >About Us
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/contactus"
                    style={isActive(history, "/contactus")}
                    exact
                  >Contact
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/events"
                    style={isActive(history, "/events")}
                  >Events
                  </NavLink>
                </li>
              </ul>
            </Nav>
          </div>
        </div>
      );
    } else {
      headerDisplay = (
        <div className={styles.HeaderFixed}>
          <div>
            <Nav>
              <NavLink to="/" exact>
                <img
                  src={logoType}
                  alt="OpenSeatDirect Logo"
                  className={styles.ImageBox}
                />
              </NavLink>
            </Nav>
          </div>
          <div className={styles.HeaderFixedLinks}>
            <Nav>
              <ul>
                <li>
                  <NavLink
                    to="/video"
                    style={isActive(history, "/video")}
                    exact
                  >About Us
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/events"
                    style={isActive(history, "/events")}
                  >Events
                  </NavLink>
                </li>
              </ul>
            </Nav>
          </div>
        </div>
      );
  }

  return <div>{headerDisplay}</div>;
};

export default withRouter(Header);
