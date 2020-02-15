import React from "react";

import Aux from "../hoc/Auxiliary/Auxiliary";
import styles from "./Order.module.css";

const OrderSummary = props => {
  let purchaseTotal =0;
  console.log("Purchase Total beginning value: ", purchaseTotal)
  props.ticketOrder.map(item => {
    if(item.ticketsSelected > 0) {
      purchaseTotal += (item.ticketsSelected * item.promoTicketPrice);
      
  console.log("Purchase Total updated value: ", purchaseTotal)
    }
  })
  
  return (
    <Aux>
      <div style={{ fontWeight: "600" }}>Order Summary</div>
      <br></br>
      {props.ticketOrder.map(item => {
        return item.ticketsSelected > 0 ? (
          <Aux key={item.ticketID}>
            <div className={styles.RightGrid}>
              <div style={{ fontWeight: "400" }}>
                {item.ticketsSelected} X {item.ticketName}
              </div>
              <div style={{ textAlign: "right" }}>
                ${item.ticketsSelected * item.ticketPrice}
              </div>
            </div>
            {item.promoTicketPrice !== item.ticketPrice ? 
            <div className={styles.RightGrid}>
              <div style={{ fontWeight: "400", color: "blue", paddingLeft: "10px" }}>- less discount
                
              </div>
              <div style={{ textAlign: "right", color: "blue" }}>-
                ${item.ticketsSelected * (item.ticketPrice - item.promoTicketPrice)}
              </div>
            </div> : null}
          </Aux>
        ) : null;
      })}

      <hr style={{ border: "1px solid#B2B2B2" }} />
      <div className={styles.RightGrid}>
        <div style={{ fontWeight: "600" }}>Total</div>
        <div style={{ textAlign: "right", fontWeight: "600" }}>
         ${purchaseTotal}
        </div>
      </div>
      <br></br>
    </Aux>
  );
};

export default OrderSummary;
