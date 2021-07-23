import React from "react";

import { HOST } from "../../config";

import styles from "./Logo.module.css";

const Logo = (props) => {
  let styleName = styles.Header;

  console.log("HOST: ", HOST);

  if (props.placement === "header") {
    styleName = styles.Header;
  } else if (props.placement === "side") {
    styleName = styles.Side;
  } else if (props.placement === "footer") {
    styleName = styles.Footer;
  }

  return (
    <button
      style={{ backgroundColor: "white", border: "none" }}
      onClick={() => {
        window.location.href = HOST;
      }}
    >
      <img src={props.source} alt="OpenSeatDirect Logo" className={styleName} />
    </button>
  );
};

export default Logo;
