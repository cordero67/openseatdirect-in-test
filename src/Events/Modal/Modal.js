import React from "react";

import Backdrop from "./Backdrop";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import styles from "./Modal.module.css";

const Modal = props => {
  return (
    <Aux>
      <Backdrop clicked={props.modalClosed}></Backdrop>
      <div
        style={{
          transform: props.show ? "translateY(0)" : "translateY(-100vh)",
          opacity: props.show ? "1" : "0"
        }}
        className={styles.Modal}
      >
        <div>
          Details for the {props.event.title} event are currently not
          available.
        </div>
        <br></br>
        <div>
          This event is still scheduled to take place on {props.event.date}.
        </div>
        <br></br>
        <div>
          More information, including ticket details will be provided shortly.
        </div>
        <br></br>
      </div>
    </Aux>
  );
};

export default Modal;
