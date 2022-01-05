import React, { Fragment } from "react";

import styles from "./TicketItem.module.css";

const TicketItem = (props) => {
  const ticketTypeDisplay = () => {
    let options;
    let ticketsArray = [0];
    let i;
    let available = props.name.ticketsAvailable;
    let minimum = props.name.minTicketsAllowedPerOrder;
    let maximum = props.name.maxTicketsAllowedPerOrder;
    let priceDeal;
    let ticketPrice;
    let adjTicketPrice;

    if (props.name.ticketCurrency === "¥") {
      ticketPrice = props.name.ticketPrice.toFixed(0);
      adjTicketPrice = props.name.adjustedTicketPrice.toFixed(0);
    } else {
      ticketPrice = props.name.ticketPrice.toFixed(2);
      adjTicketPrice = props.name.adjustedTicketPrice.toFixed(2);
    }

    if (props.name.ticketPriceFunction.form === "bogo") {
      if (props.name.ticketPriceFunction.args.discount === 100) {
        priceDeal = `(buy ${props.name.ticketPriceFunction.args.buy} and get ${props.name.ticketPriceFunction.args.get} for free)`;
      } else {
        priceDeal = `(buy ${props.name.ticketPriceFunction.args.buy} and get up to ${props.name.ticketPriceFunction.args.get} at a ${props.name.ticketPriceFunction.args.discount}% discount)`;
      }
    } else if (props.name.ticketPriceFunction.form === "twofer") {
      priceDeal = `(buy ${props.name.ticketPriceFunction.args.buy} for $${props.name.ticketPriceFunction.args.for})`;
    }

    // define "ticketArray[]" and "options"
    // check for soldout conditions
    if (available < 1 || (minimum && available < minimum)) {
      // soldout conditions
      options = (
        <Fragment>
          <div className={styles.LeftGrid}>
            <div style={{ color: "grey" }}>
              <div className={styles.TicketType}>
                {props.name.ticketName} - SOLD OUT
              </div>
              {props.name.ticketPricingCodeApplied &&
              props.name.ticketPriceFunction.form === "promo" ? (
                <div className={styles.TicketPrices}>
                  {props.name.ticketCurrency}
                  {adjTicketPrice}
                  <span
                    style={{ color: "red", textDecoration: "line-through" }}
                  >
                    {props.name.ticketCurrency}
                    {ticketPrice}
                  </span>
                </div>
              ) : (
                <div className={styles.TicketPrices}>
                  {props.name.ticketCurrency}
                  {ticketPrice}
                </div>
              )}
            </div>
            <div className={styles.TicketAmount}>
              <span style={{ color: "grey", fontWeight: "500" }}>Sold Out</span>
            </div>
          </div>
          <div className={styles.EventDescription}>
            <span style={{ color: "grey" }}>
              {props.name.ticketDescription}
            </span>
          </div>
          <hr style={{ border: "1px solid#F2F2F2" }} />
        </Fragment>
      );
      return options;
    } else {
      // not sold-out options
      let start;
      let end;
      if (minimum) {
        start = minimum;
        if (maximum) {
          end = Math.min(maximum, available);
        } else if (minimum > 25) {
          end = Math.min(minimum, available);
        } else {
          end = Math.min(25, available);
        }
      } else {
        start = 1;
        if (maximum) {
          end = Math.min(maximum, available);
        } else {
          end = Math.min(25, available);
        }
      }
      for (i = start; i <= end; i++) {
        ticketsArray.push(i);
      }

      options = (
        <Fragment>
          <div className={styles.LeftGrid}>
            <div>
              <div className={styles.TicketType}>{props.name.ticketName}</div>
              {props.name.ticketPricingCodeApplied &&
              props.name.ticketPriceFunction.form === "promo" ? (
                <div className={styles.TicketPrices}>
                  {props.name.ticketCurrency}
                  {adjTicketPrice}
                  <span
                    style={{ color: "red", textDecoration: "line-through" }}
                  >
                    {props.name.ticketCurrency}
                    {ticketPrice}
                  </span>
                </div>
              ) : (
                <div className={styles.TicketPrices}>
                  {props.name.ticketCurrency}
                  {ticketPrice} {priceDeal}
                </div>
              )}
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
                {ticketsArray.map((opt, index) => (
                  <option key={index}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.EventDescription}>
            {props.name.ticketDescription}
          </div>
          <hr style={{ border: "1px solid#F2F2F2" }} />
        </Fragment>
      );
      return options;
    }
  };

  return <Fragment>{ticketTypeDisplay()}</Fragment>;
};

export default TicketItem;
