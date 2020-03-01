import React, { useEffect } from "react";

import Aux from "../hoc/Auxiliary/Auxiliary";
import styles from "./Order.module.css";

const TicketItem = props => {
  const selectionOption = () => {
    let options;
    let options2;
    let ticketsAvailableArray = [];
    let i;
    let maxAmount;
    let adjTicketsAvailable = props.name.ticketsAvailable;
    if (props.name.ticketsAvailable < 1) {
      adjTicketsAvailable = 0;
    }

    if (props.name.ticketsAvailable < 1) {
      options = (<div className={styles.TicketAmount}><span style={{ color: "grey" }}>Sold Out</span></div>)
      return options;
    } else {
      if (props.name.advancedTicketPricingActive && props.name.advancedTicketPricing.length > 0) {
        maxAmount = Math.min(props.name.advancedTicketPricing.length, props.name.ticketsAvailable);
      }
      else if (props.name.maxTicketOrder) {
        maxAmount = Math.min(props.name.maxTicketOrder, props.name.ticketsAvailable);
      }
      else {
        maxAmount = Math.min(8, adjTicketsAvailable);
      }
    
      for (i = 0; i <= maxAmount; i++) {
        ticketsAvailableArray.push(i);
      }
      options = (
        <div className={styles.TicketAmount}>
          <select
            type="number"
            name="ticketsSelected"
            required
            value={props.name.ticketsSelected}
            className={styles.SelectionBox}
            onChange={props.onChange}
          >
          {ticketsAvailableArray.map(opt => <option>{opt}</option>)}
          </select>
        </div>
      )
      return options;
    }
  }

  console.log("TICKETS REMAINING: ", props.name.ticketsAvailable)

  return (
    <Aux>
      <div className={styles.LeftGrid}>
        <div>
          <div className={styles.TicketType}>{props.name.ticketName}</div>
          {props.name.ticketPromoCodeApplied ?
            <div className={styles.TicketPrices}>
              <span style={{ textDecoration: "line-through" }}>${props.name.ticketPrice.toFixed(2)}</span>
            </div>
            : <div className={styles.TicketPrices}>${props.name.ticketPrice.toFixed(2)}</div>}
        </div>
        {selectionOption()}
      </div>
      <div className={styles.EventDescription}>
        {props.name.ticketDescription}
      </div>
      <hr style={{ border: "1px solid#F2F2F2" }} />
    </Aux>
  );
};

export default TicketItem;
