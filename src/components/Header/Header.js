import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Nav } from "react-bootstrap";

import styles from "./Header.module.css";

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
            <img src={logoType} className={styles.Logo} />
          </NavLink>
        </li>
      </ul>
    </Nav>
  );
};

export default withRouter(Header);
