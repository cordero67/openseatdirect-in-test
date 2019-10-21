import React from "react";
import { withRouter } from "react-router-dom";

import footerLogo from "../../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_32.png";

import styles from "./OSDFooter.module.css";

const Footer = () => {
  return (
    <div className={styles.Footer}>
      <ul>
        <li>
          <img src={footerLogo} className={styles.Logo} />
        </li>
        <li>
          Copyright!!! &copy; 2019 OpenSeatDirect LLC | All Rights Reserved
        </li>
      </ul>
    </div>
  );
};

export default Footer;
