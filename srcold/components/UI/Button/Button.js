import React from "react";

import styles from "./Button.module.css";

const button = props => (
  <button
    className={[styles.Button, styles[props.btnType]].join(" ")}
    style={{ marginLeft: "50%" }}
    onClick={props.clicked}
  >
    {props.children}
  </button>
);

export default button;
