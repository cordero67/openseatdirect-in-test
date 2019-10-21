import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Nav } from "react-bootstrap";

import styles from "./DahdayHeader.module.css";

const Header = ({ logoType }) => {
  return (
    <Nav className={styles.Header}>
      <ul>
        <li>
          <NavLink to="/" exact>
            <img src={logoType} className={styles.Logo} />
          </NavLink>
        </li>
      </ul>
    </Nav>
  );
};

export default withRouter(Header);
