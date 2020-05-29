import React from "react";

import Backdrop from '../../components/UI/Backdrop/Backdrop';
import Aux from "../../hoc/Auxiliary/Auxiliary";
import classes from "./Modal.module.css";

import { Button } from 'semantic-ui-react';

const Modal = props => {
  console.log("item", props.details, props.details.ticketName)
  console.log("ticketName", props.details.ticketName)

  return (
    <Aux>
    <Backdrop show={props.show} clicked={props.modalClosed}></Backdrop>
      <div
        style={{
          transform: props.show ? "translateY(0)" : "translateY(-100vh)",
          opacity: props.show ? "1" : "0"
        }}
        className={classes.Modal}
      >
        <br></br>
        <div style={{
          fontSize: "32px"}}>Confirm ticket deletion</div>
          <br></br>
          <br></br>
        <div style={{
          fontSize: "16px"}}>Are you sure you want to delete the {props.details.ticketName} ticket?</div>
        <br></br>


              <div  className={classes.CropBoxControls}>
                  <div style={{width: "150px", textAlign: "right", paddingTop: "5px", paddingLeft: "5px"}}>
                      <Button
                          content="Cancel"
                          icon="cancel"
                          color="green"
                          onClick={props.closeModal}
                      />
                  </div>
                  <div style={{width: "150px", textAlign: "left", paddingTop: "5px", paddingLeft: "5px"}}>
                      <Button
                          content="Delete"
                          color="red"
                          onClick={props.deleteTicket}
                      />
                  </div>
              </div>




        <br></br>
      </div>
    </Aux>
  );
};

export default Modal;
