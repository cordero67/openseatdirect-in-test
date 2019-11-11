import React from "react";

import styles from "./Height.module.css";

const Height = () => {
  return (
    <div className={styles.OuterCanvas}>
      <div className={styles.ParentBox}>
        <div className={styles.HeaderBox}>Header</div>
        <div className={styles.MiddleBox}>
          <h2>Middle</h2>
          <h2>Middle</h2>
          <h2>Middle</h2>
          <h2>Middle</h2>
          <h2>Middle</h2>
          <h2>Middle</h2>
          <h2>Middle</h2>
          <h2>Middle</h2>
          <h2>Middle</h2>
          <h2>Middle</h2>
        </div>
        <div className={styles.FooterBox}>Footer</div>
      </div>
    </div>
  );
};

export default Height;
