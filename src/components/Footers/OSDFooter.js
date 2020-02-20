import React, { useState, useEffect } from "react";

import OSDLogo from "../../assets/BlueLettering_TransparentBackground/BlueLettering_TransparentBackground_1024.png";

import styles from "./OSDFooter.module.css";

const Footer = (props) => {
  const [showLargeFooter, setShowLargeFooter] = useState(false);

  const stylingUpdate = (inWidth) => {
    // based on window width, displays one or two panes
    if (inWidth < 550) {
      setShowLargeFooter(false);
    } else {
      setShowLargeFooter(true);
    }
  };

  window.onresize = function(event) {
    stylingUpdate(window.innerWidth)
  };

  useEffect(() => {
    stylingUpdate(window.innerWidth);
  }, []);
  
  let footerDisplay;

  if (showLargeFooter) {
    footerDisplay = (
      <div className={styles.Footer}>
        <div>
          <img className={styles.ImageBox} src={OSDLogo} alt="OpenSeatDirect Logo" />
        </div>
        <div className={styles.CopyRight}>Copyright &copy; 2019 OpenSeatDirect LLC | All Rights Reserved</div>
      </div>
    )
  } else {
    footerDisplay = (
      <div className={styles.Footer}>
        <div>
          <img className={styles.ImageBox} src={OSDLogo} alt="OpenSeatDirect Logo" />
        </div>
        <div  className={styles.CopyRight}>
          <div>Copyright &copy; 2019 OpenSeatDirect LLC</div>
          <div>All Rights Reserved</div>
        </div>
      </div>
    )}

  return <div>{footerDisplay}</div>;
};

export default Footer;