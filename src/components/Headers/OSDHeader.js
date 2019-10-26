import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Nav } from "react-bootstrap";

import styles from "./OSDHeader.module.css";

// determines if current menu item, i.e. "<NavLink>" is the active link
// "history" represents the actual active path
// "path" represents the path defined in the respective "<NavLink>"
// "#ff9900" gives an orange color
const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#8DADD4" };
  } else {
    return { color: "ffffff" };
  }
};

const Header = ({ history, logoType, styleType }) => {
  return (
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
      </ul>
    </Nav>
  );
};

export default withRouter(Header);
