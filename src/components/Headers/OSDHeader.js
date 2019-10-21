import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Nav } from "react-bootstrap";

import styles from "./OSDHeader.module.css";

const Header = ({ logoType, styleType }) => {
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
