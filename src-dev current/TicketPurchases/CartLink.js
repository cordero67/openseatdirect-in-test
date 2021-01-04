import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faChevronUp,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";

import Aux from "../hoc/Auxiliary/Auxiliary";
import styles from "./Order.module.css";

const CartLink = props => {
  // determines whether or not to display the number of tickets purchased
  // "showDoublePane" must be false and "orderTotals.ticketsPurchased" must be > 0

  const ticketAmount = show => {
    if (!props.isLoading && !show && props.orderTotals.ticketsPurchased > 0) {
      return (
        <Aux>
          <span
            onClick={props.onClick}
            className={styles.cartBadge}>
            {props.orderTotals.ticketsPurchased}
          </span>
        </Aux>
      );
    } else {
        console.log("going to null")
        return null;
      }
  };

  return (
    <div>
      <FontAwesomeIcon
        onClick={props.onClick}
        className={styles.faShoppingCart}
        icon={faShoppingCart}
      />
      {ticketAmount(props.showDoublePane)}
      {props.showStatus ? (
        <FontAwesomeIcon
          onClick={props.onClick}
          className={styles.faChevronUp}
          icon={faChevronUp}
        />
      ) : (
        <FontAwesomeIcon
          onClick={props.onClick}
          className={styles.faChevronDown}
          icon={faChevronDown}
        />
      )}
    </div>
  );
};

export default CartLink;
