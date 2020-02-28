import React from "react";

import Aux from "../hoc/Auxiliary/Auxiliary";
import styles from "./Order.module.css";

const TicketItem = props => {
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
        <div className={styles.TicketAmount}>
          <select
            type="number"
            name="ticketsSelected"
            required
            value={props.name.ticketsSelected}
            className={styles.SelectionBox}
            onChange={props.onChange}
          >
            <option>0</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
          </select>
        </div>
      </div>
      <div className={styles.EventDescription}>
        {props.name.ticketDescription}
      </div>
      <hr style={{ border: "1px solid#F2F2F2" }} />
    </Aux>
  );
};

export default TicketItem;
