import React from "react";

import { HOST } from "../../config";

import classes from "./Logo.module.css";

const Logo = (props) => {
  let styleName = classes.Header;

  console.log("HOST: ", HOST);

  if (props.placement === "header") {
    styleName = classes.Header;
  } else if (props.placement === "side") {
    styleName = classes.Side;
  } else if (props.placement === "footer") {
    styleName = classes.Footer;
  }

  return (
    <button
      className={classes.Button}
      onClick={() => {
        window.location.href = HOST;
      }}
    >
      <img src={props.source} alt="OpenSeatDirect Logo" className={styleName} />
    </button>
  );
};

export default Logo;
