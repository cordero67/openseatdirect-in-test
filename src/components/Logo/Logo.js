import React from "react";
import { NavLink } from "react-router-dom";

import styles from "./Logo.module.css";

const Logo = (props) => {
  let styleName = styles.Header;

  if (props.placement === "header") {
    styleName = styles.Header;
  } else if (props.placement === "side") {
    styleName = styles.Side;
  } else if (props.placement === "footer") {
    styleName = styles.Footer;
  }

  //https://openseatdirdev.wpengine.com/
  return (
    <NavLink to="/" exact>
      <img src={props.source} alt="OpenSeatDirect Logo" className={styleName} />
    </NavLink>
  );
};

export default Logo;
