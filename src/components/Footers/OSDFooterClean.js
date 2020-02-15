import React from "react";

import footerLogo from "../../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_32.png";

import styles from "./OSDFooter.module.css";

const Footer = () => {
  return (
    <div className={styles.FooterClean}>
    <div className={styles.FooterCleanText}>

        Copyright &copy; 2019 OpenSeatDirect LLC | All Rights Reserved
    </div>
    </div>
  );
};

export default Footer;
