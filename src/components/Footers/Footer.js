import React, { useState, useEffect } from "react";

import Logo from '../Logo/Logo';
import logo from "../../assets/OpenSeatDirect/BlueLettering_TransparentBackground_1024.png";

import styles from "./Footer.module.css";

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
          <Logo source={logo} placement="footer"/>
        </div>
        <div className={styles.CopyRight}>
          <div>
            Copyright &copy; 2021 OpenSeatDirect LLC | All Rights Reserved
          </div>
          <div>
            <button className={styles.Button}>
              Privacy Policy
            </button> | <button className={styles.Button}>
              Terms and Conditions
            </button>
          </div>
        </div>
      </div>
    )
  } else {
    footerDisplay = (
      <div className={styles.Footer}>
        <div>
          <Logo source={logo} placement="footer"/>
        </div>
        <div  className={styles.CopyRight}>
          <div>Copyright &copy; 2020 OpenSeatDirect LLC | All Rights Reserved</div>
          <div>Privacy Policy | Terms and Conditions</div>
        </div>
      </div>
    )}

  return <div>{footerDisplay}</div>;
};

export default Footer;