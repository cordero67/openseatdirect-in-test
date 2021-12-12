import React, { Fragment } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./Cartlink.module.css";

const CartLink = (props) => {
  // determines whether or not to display the number of tickets purchased
  // "showDoublePane" must be false and "orderTotals.ticketsPurchased" must be > 0

  const ticketAmount = () => {
    if (props.orderTotals.ticketsPurchased > 0) {
      return (
        <Fragment>
          <span onClick={props.onClick} className={styles.cartBadge}>
            {props.orderTotals.ticketsPurchased}
          </span>
        </Fragment>
      );
    } else return null;
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
