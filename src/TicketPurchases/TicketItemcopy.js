import React from "react";

import Aux from "../hoc/Auxiliary/Auxiliary";
import styles from "./Order.module.css";

const TicketItem = props => {
  return (
    <Aux>
      <div className={styles.LeftGrid}>
        <div>
          <div className={styles.TicketType}>{props.name.ticketName}</div>
          <div className={styles.TicketPrices}>${props.name.ticketPrice}</div>
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

/*
              <div className={styles.LeftGrid}>
                <div>
                  <div className={styles.TicketType}>
                    {props.name.ticketName} {props.name.ticketAdditional}
                  </div>
                  <div className={styles.TicketPrices}>
                    ${props.name.currentTicketPrice} +
                    <span className={styles.TicketFees}>
                      ${props.name.currentTicketFee} Fee
                    </span>
                  </div>
                </div>
                <div className={styles.TicketAmount}>
                  <select
                    type="number"
                    name="ticketsSelected"
                    required
                    value={props.name.ticketsSelected}
                    className={styles.SelectionBox}
                  >
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                  </select>
                </div>
              </div>
              <div className={styles.EventDescription}>
                {props.name.ticketDescription}
              </div>
              <hr style={{ border: "1px solid#F2F2F2" }} />
              */
