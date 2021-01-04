import React from "react";

import Aux from "../hoc/Auxiliary/Auxiliary";
import styles from "./Order.module.css";

const OrderSummary = props => {
  let purchaseTotal = 0;
  let fixedPurchaseTotal;
  props.ticketOrder.forEach(item => {
    if(item.ticketsSelected > 0) {
      
      purchaseTotal += (item.ticketsSelected * item.adjustedTicketPrice);
    }
  })
  if (props.ticketCurrency === "¥") {
    fixedPurchaseTotal = purchaseTotal.toFixed(0);
  } else {
    fixedPurchaseTotal = purchaseTotal.toFixed(2);
  }

  return (
    <Aux>
      <div style={{ fontWeight: "600" }}>Order Summary</div>
      <br></br>
      {props.ticketOrder.map(item => {
        
        let fixedDiscountTotal;
        let fixedAdjPriceTotal;
        let fixedPriceTotal;
        if (props.ticketCurrency === "¥") {
          fixedPriceTotal = (item.ticketsSelected * item.ticketPrice).toFixed(0);
          fixedAdjPriceTotal = (item.ticketsSelected * item.adjustedTicketPrice).toFixed(0);
          fixedDiscountTotal = (item.ticketsSelected * (item.ticketPrice - item.adjustedTicketPrice)).toFixed(0);
        } else {
          fixedPriceTotal = (item.ticketsSelected * item.ticketPrice).toFixed(2);
          fixedAdjPriceTotal = (item.ticketsSelected * item.adjustedTicketPrice).toFixed(2);
          fixedDiscountTotal = (item.ticketsSelected * (item.ticketPrice - item.adjustedTicketPrice)).toFixed(2);
        }

        return item.ticketsSelected > 0 ? (
          <Aux key={item.ticketID}>
            <div className={styles.RightGrid}>
              <div style={{ fontWeight: "400" }}>
                {item.ticketsSelected} X {item.ticketName}
              </div>
                <div style={{ textAlign: "right" }}>
                  {item.ticketCurrency}{item.ticketPriceFunction.form === "promo" && (item.adjustedTicketPrice !== item.ticketPrice) ?
                    fixedPriceTotal
                    : fixedAdjPriceTotal
                  }
                </div>
            </div>

            {item.ticketPriceFunction.form === "promo" && (item.adjustedTicketPrice !== item.ticketPrice) ? 
              <div className={styles.RightGrid}>
                <div style={{ fontWeight: "400", color: "#4BBA00"}}>less Discount
                  
                </div>
                <div style={{ textAlign: "right", color: "#4BBA00" }}>-
                  {item.ticketCurrency}{fixedDiscountTotal}
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
         {props.ticketCurrency}{fixedPurchaseTotal}
        </div>
      </div>
      <br></br>
    </Aux>
  );
};

export default OrderSummary;
