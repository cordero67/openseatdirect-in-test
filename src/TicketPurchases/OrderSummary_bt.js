import React from "react";

import Aux from "../hoc/Auxiliary/Auxiliary";
import styles from "./Order.module.css";

const OrderSummary = props => {
  return (
    <Aux>
      <div style={{ fontWeight: "600" }}>Order Summary</div>
      <br></br>
      {props.ticketOrder.tickets.map(item => {
        return item.ticketsSelected > 0 ? (
          <Aux key={item.ticketID}>
            <div className={styles.RightGrid}>
              <div style={{ fontWeight: "400" }}>
                {item.ticketsSelected} X {item.ticketName}
              </div>
              <div style={{ textAlign: "right" }}>
                ${item.ticketsSelected * item.ticketPrice}{" "}
              </div>
            </div>
          </Aux>
        ) : null;
      })}

      <hr style={{ border: "1px solid#B2B2B2" }} />
      <div className={styles.RightGrid}>
        <div style={{ fontWeight: "600" }}>Total</div>
        <div style={{ textAlign: "right" }}>
          ${props.ticketOrder.totalPurchaseAmount}
        </div>
      </div>
      <br></br>
    </Aux>
  );
};

export default OrderSummary;
