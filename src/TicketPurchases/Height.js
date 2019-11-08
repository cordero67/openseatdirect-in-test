import React, { Component } from "react";

import styles from "./Height.module.css";

const Height = () => {
  return (
    <div className={styles.OuterCanvas}>
      <div className={styles.ParentBox}>
        <div className={styles.HeaderBox}>Header</div>
        <div className={styles.MiddleBox}>Middle</div>
        <div className={styles.FooterBox}>Footer</div>
      </div>
    </div>
  );
};

export default Height;
