import React from "react";

import Aux from "../hoc/Auxiliary/Auxiliary";
import styles from "./Order.module.css";

const OrderSummary = props => {
  let purchaseTotal = 0;
  props.ticketOrder.map(item => {
    if(item.ticketsSelected > 0) {
      purchaseTotal += (item.ticketsSelected * item.promoTicketPrice);
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
                {item.advancedTicketPricingActive ?
                  <div style={{ textAlign: "right" }}>
                    ${(item.ticketsSelected * item.promoTicketPrice).toFixed(2)}
                  </div> :
                  <div style={{ textAlign: "right" }}>
                    ${(item.ticketsSelected * item.ticketPrice).toFixed(2)}
                  </div>
                }
            </div>

            {item.ticketPromoCodeApplied ? 
              <div className={styles.RightGrid}>
                <div style={{ fontWeight: "400", color: "#4BBA00"}}>less Discount
                  
                </div>
                <div style={{ textAlign: "right", color: "#4BBA00" }}>-
                  ${(item.ticketsSelected * (item.ticketPrice - item.promoTicketPrice)).toFixed(2)}
                </div>
              </div> :
              null
            }

            <br></br>   
          </Aux>
        ) : null;
      })}

      <hr style={{ border: "1px solid#B2B2B2", marginTop: "0"}} />
      <div className={styles.RightGrid}>
        <div style={{ fontWeight: "600" }}>Total</div>
        <div style={{ textAlign: "right", fontWeight: "600" }}>
         ${purchaseTotal.toFixed(2)}
        </div>
      </div>
      <br></br>
    </Aux>
  );
};

export default OrderSummary;
