import React from "react";

import Aux from "../hoc/Auxiliary/Auxiliary";
import styles from "./TicketItem.module.css";

const TicketItem = props => {

  const ticketTypeDisplay = () => {
    let options;
    let ticketsAvailableArray = [];
    let i;
    let maxAmount;
    //let adjTicketsAvailable = props.name.ticketsAvailable;
    //if (props.name.ticketsAvailable < 1) {
    //  adjTicketsAvailable = 0;
    //}
    let ticketPrice;
    let adjTicketPrice;
    if (props.name.ticketCurrency === "¥") {
      ticketPrice = props.name.ticketPrice.toFixed(0);
      adjTicketPrice = props.name.adjustedTicketPrice.toFixed(0);
    } else {
      ticketPrice = props.name.ticketPrice.toFixed(2);
      adjTicketPrice = props.name.adjustedTicketPrice.toFixed(2);
    }

    if (props.name.ticketsAvailable < 1) {
      options = (
        <Aux>
          <div className={styles.LeftGrid}>
            <div style={{ color: "grey" }}>
              <div className={styles.TicketType}>{props.name.ticketName} - SOLD OUT</div>
              {props.name.ticketPricingCodeApplied && props.name.ticketPriceFunction.form === "promo" ?
                <div className={styles.TicketPrices}>{props.name.ticketCurrency}{adjTicketPrice} 
                <span style={{ textDecoration: "line-through" }}>{props.name.ticketCurrency}{ticketPrice}</span>
                </div>
                : <div className={styles.TicketPrices}>{props.name.ticketCurrency}{ticketPrice}</div>}
            </div>
            <div className={styles.TicketAmount}>
              <span style={{ color: "grey", fontWeight: "500" }}>
                Sold Out
              </span>
            </div>
          </div>
          <div className={styles.EventDescription}>
            <span style={{ color: "grey" }}>
              {props.name.ticketDescription}
            </span>
          </div>
          <hr style={{ border: "1px solid#F2F2F2" }} />
        </Aux>
      )
      return options;
    } else {
      if (props.name.maxTicketOrder) {
        maxAmount = Math.min(props.name.maxTicketOrder, props.name.ticketsAvailable);
      }
      else {
        maxAmount = Math.min(25, props.name.ticketsAvailable);
      }
      for (i = 0; i <= maxAmount; i++) {
        ticketsAvailableArray.push(i);
      }
      options = (
        <Aux>
          <div className={styles.LeftGrid}>
            <div>
              <div className={styles.TicketType}>{props.name.ticketName}</div>
              {props.name.ticketPricingCodeApplied && props.name.ticketPriceFunction.form === "promo" ?
                <div className={styles.TicketPrices}>{props.name.ticketCurrency}{adjTicketPrice} 
                <span style={{ textDecoration: "line-through" }}>{props.name.ticketCurrency}{ticketPrice}</span>
                </div>
                : <div className={styles.TicketPrices}>{props.name.ticketCurrency}{ticketPrice}</div>}
            </div>
            <div className={styles.TicketAmount}>
              <select
                type="number"
                name="ticketsSelected"
                required
                value={props.name.ticketsSelected}
                className={styles.SelectionBox}
                onChange={props.onChange}
              >
              {ticketsAvailableArray.map((opt, index) => <option key={index}>{opt}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.EventDescription}>
            {props.name.ticketDescription}
          </div>
          <hr style={{ border: "1px solid#F2F2F2" }} />
        </Aux>
      )
    }
    return options;
  }

  return (
    <Aux>
        {ticketTypeDisplay()}
    </Aux>
  );
};

export default TicketItem;