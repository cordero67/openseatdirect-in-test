import React, { Fragment } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Nav } from "react-bootstrap";

import { signout, isAuthenticated } from "../../user/apiUser";

import styles from "./OSDHeader.module.css";

// determines if current menu item, i.e. "<NavLink>" is the active link
// "history" represents the actual active path
// "path" represents the path defined in the respective "<NavLink>"
// "#ff9900" gives an orange color 8DADD4
const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "red" };
  } else {
    return { color: "ffffff" };
  }
};

// "props" is from ReactRouterDom since  component is wrapped by "withRouter"
// "history, logoType, styleType" is destructured from "props" object
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

        <li>
          <NavLink to="/video" style={isActive(history, "/video")} exact>
            About<br></br>OSD
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/ev/dahday_ha_ha_for_hire?eventID=94106331593"
            style={isActive(
              history,
              "/ev/dahday_cocina_candela?eventID=94106331593"
            )}
          >
            Events
          </NavLink>
        </li>
      </ul>
    </Nav>
  );
};

export default withRouter(Header);
