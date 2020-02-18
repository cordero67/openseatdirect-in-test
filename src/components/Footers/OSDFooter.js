import React, { useState, useEffect } from "react";

import footerLogo from "../../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_32.png";

import styles from "./OSDFooter.module.css";

const Footer = () => {
  const [showLargeFooter, setShowLargeFooter] = useState(false);

  // defines styling variables
  const [isRestyling, setIsRestyling] = useState(false);

  const stylingUpdate = (inWidth, inHeight) => {
    setIsRestyling(true);
    // based on window width, displays one or two panes
    if (inWidth < 650) {
      setShowLargeFooter(false);
    } else {
      setShowLargeFooter(true);
    }
    setIsRestyling(false);
  };

  
  window.onresize = function(event) {
    stylingUpdate(window.innerWidth, window.innerHeight)
  };

  useEffect(() => {
    stylingUpdate(window.innerWidth, window.innerHeight);
  }, []);
  
  let footerDisplay;

  if (showLargeFooter) {
    footerDisplay = (
      <div className={styles.FooterNew}>
        <div>
          <img
            src={footerLogo}
            alt="OpenSeatDirect Logo"
            className={styles.Logo}
          />
        </div>
        <div>Copyright &copy; 2019 OpenSeatDirect LLC | All Rights Reserved</div>
      </div>
    )
  } else {    footerDisplay = (
      <div className={styles.FooterNew}>
        <div className={styles.Image}>
          <img
            src={footerLogo}
            alt="OpenSeatDirect Logo"
            className={styles.Logo}
          />
        </div>
        <div  className={styles.CopyRight}>
        <div>Copyright &copy; 2019 OpenSeatDirect LLC</div><div>All Rights Reserved</div></div>
      </div>
    )}

  return <div>{footerDisplay}</div>;
};

export default Footer;