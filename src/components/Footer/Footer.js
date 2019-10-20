import React from "react";
import { withRouter } from "react-router-dom";
import { Nav } from "react-bootstrap";

import footerLogo from "../../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_32.png";

import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <Nav className={styles.Footer}>
      <ul>
        <li>
          <img src={footerLogo} className={styles.Logo} />
        </li>
        <li> Copyright &copy; 2019 OpenSeatDirect LLC | All Rights Reserved</li>
      </ul>
    </Nav>
  );
};

export default withRouter(Footer);
