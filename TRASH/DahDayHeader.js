import React from "react";
import { withRouter } from "react-router-dom";
import { Nav } from "react-bootstrap";

import styles from "./DahdayHeader.module.css";

const Header = ({ logoType }) => {
  return (
    <Nav className={styles.Header}>
      <ul>
        <li>
          <a href="https://www.dahday.com/">
            <img src={logoType} alt="Dahday Logo" className={styles.Logo} />
          </a>
        </li>
      </ul>
    </Nav>
  );
};

export default withRouter(Header);
