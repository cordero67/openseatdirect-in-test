import React, { useState, useEffect } from "react";

import Logo from "../Logo/Logo";
import logo from "../../assets/OpenSeatDirect/BlueLettering_TransparentBackground_1024.png";

import styles from "./Footer.module.css";

const Footer = () => {
  const [showLargeFooter, setShowLargeFooter] = useState(false);

  const stylingUpdate = (inWidth) => {
    // based on window width, displays one or two panes
    if (inWidth < 550) {
      setShowLargeFooter(false);
    } else {
      setShowLargeFooter(true);
    }
  };

  window.onresize = function (event) {
    stylingUpdate(window.innerWidth);
  };

  useEffect(() => {
    stylingUpdate(window.innerWidth);
  }, []);

  let footerDisplay;

  if (showLargeFooter) {
    footerDisplay = (
      <div className={styles.Footer}>
        <div>
          <Logo source={logo} placement="footer" />
        </div>
        <div className={styles.CopyRight}>
          <div>
            Copyright &copy; 2022 OpenSeatDirect LLC | All Rights Reserved
          </div>
          <div>
            <a
              className={styles.Button}
              styles={{ border: "none", outline: "none" }}
              href="https://www.openseatdirect.com/privacy-policy/"
              target="_blank"
              rel="noreferrer"
            >
              Privacy Policy
            </a>
            |
            <a
              className={styles.Button}
              styles={{ border: "none", outline: "none" }}
              href="https://www.openseatdirect.com/terms-and-conditions/"
              target="_blank"
              rel="noreferrer"
            >
              Terms and Conditions
            </a>
            | v1.3
          </div>
        </div>
      </div>
    );
  } else {
    footerDisplay = (
      <div className={styles.Footer}>
        <div>
          <Logo source={logo} placement="footer" />
        </div>
        <div className={styles.CopyRight}>
          <div>
            Copyright &copy; 2022 OpenSeatDirect LLC | All Rights Reserved
          </div>
          <div styles={{ border: "none", outline: "none" }}>
            <button
              className={styles.Button}
              styles={{ border: "none", outline: "none" }}
              onClick={() => {
                window.location.href = `/privacy-policy`;
              }}
            >
              Privacy Policy
            </button>
            |
            <button
              className={styles.Button}
              styles={{ border: "none", outline: "none" }}
              onClick={() => {
                window.location.href = `/terms-and-conditions`;
              }}
            >
              Terms and Conditions
            </button>
            | v1.3
          </div>
        </div>
      </div>
    );
  }

  return <div>{footerDisplay}</div>;
};

export default Footer;
