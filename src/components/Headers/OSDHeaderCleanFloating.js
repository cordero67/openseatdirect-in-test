import React, { useState, useEffect } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Nav } from "react-bootstrap";

import styles from "./OSDHeader.module.css";

const Header = ({ history, logoType, styleType }) => {

  let headerDisplay = (
    <Nav className={styles[styleType]}>
      <ul>
        <li>
            <img
              src={logoType}
              alt="OpenSeatDirect Logo"
              className={styles.Logo}
            />
        </li>
      </ul>
    </Nav>
  );

  return <div>{headerDisplay}</div>;
};

export default withRouter(Header);
