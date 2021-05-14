import React, { useState, useEffect, Fragment } from "react";

import classes from "./BuyerAccount.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const BuyerNavigation = (props) => {
  const [buyerInfo, setBuyerInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      let tempBuyerInfo = {};
      tempBuyerInfo.name = tempUser.user.name;
      setBuyerInfo(tempBuyerInfo);
    } else {
      window.location.href = "/signin";
    }
    setIsLoading(false);
  }, []);

  return (
    <Fragment>
      <div className={classes.NavigationTitle}>
        {!isLoading ? (
          <span
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              lineHeight: "normal",
            }}
          >
            {buyerInfo.name}
          </span>
        ) : null}
      </div>

      <div className={classes.DashboardTitle}>
        <span
          style={{
            display: "inline-block",
            verticalAlign: "middle",
            lineHeight: "normal",
          }}
        >
          <FontAwesomeIcon color="white" cursor="pointer" icon={faHome} /> My
          Account
        </span>
      </div>

      <ul className={classes.NavigationBar}>
        <div className={classes.NavigationItems}>
          <li>
            <button
              className={classes.NavigationButton}
              style={{
                backgroundColor: props.pane === "wallet" ? "#fff" : "#b8b8b8",
                outline: "none",
              }}
              name="wallet"
              onClick={props.clicked}
            >
              My Tickets
            </button>
          </li>

          <li>
            <button
              className={classes.NavigationButton}
              style={{
                backgroundColor: props.pane === "profile" ? "#fff" : "#b8b8b8",
                outline: "none",
              }}
              name="profile"
              onClick={props.clicked}
            >
              Account Settings
            </button>
          </li>

          <li>
            <button
              className={classes.NavigationButton}
              style={{
                backgroundColor:
                  props.pane === "onboarding" ? "#fff" : "#b8b8b8",
                outline: "none",
              }}
              name="onboarding"
              onClick={props.clicked}
            >
              Create Events
            </button>
          </li>
        </div>
      </ul>
    </Fragment>
  );
};

export default BuyerNavigation;
