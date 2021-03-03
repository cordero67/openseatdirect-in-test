import React, { useState, useEffect } from "react";
import { Redirect, Fragment, Link } from "react-router-dom";

import { API } from "../../config";

import queryString from "query-string";

import BuyerNavigation from "./BuyerNavigation";
import Profile from "../ComponentPages/Profile";
import MyTickets from "../ComponentPages/MyTickets";
import Preferences from "./Preferences";
import Onboarding from "./Onboarding";
import classes from "./BuyerAccount.module.css";

const BuyerAccount = () => {

  const [buyerInfo, setBuyerInfo] = useState();//
  const [isLoading, setIsLoading] = useState(true);//

  const [paneView, setPaneView] = useState("myTickets")

  const getStatus= (user) => { 
    if ('accountId' in user && 'status' in user.accountId ) {
        return user.accountId.status
    } else {
        return 0;
    } 
  }

  useEffect(() => {
    setIsLoading(true);
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      console.log("tempUser: ", tempUser)
      if ("vendorIntent" in tempUser.user && tempUser.user.vendorIntent === true) {
        setPaneView("onboarding")
      }
      if (
        queryString.parse(window.location.search).tracking_id !== undefined &&
        queryString.parse(window.location.search).permissionsGranted !== undefined &&
        queryString.parse(window.location.search).isEmailConfirmed !== undefined &&
        queryString.parse(window.location.search).error !== undefined
      ) {
        setPaneView("onboarding")
      }
      if (getStatus(tempUser.user) === 7 || getStatus(tempUser.user) === 8) {
        window.location.href = "/vendor";
      }
      let tempBuyerInfo = {};
      tempBuyerInfo.token = tempUser.token;
      tempBuyerInfo.email = tempUser.user.email
      tempBuyerInfo.name = tempUser.user.name
      tempBuyerInfo.role = tempUser.user.role
      tempBuyerInfo.id = tempUser.user._id;
      setBuyerInfo(tempBuyerInfo);
    } else {
      window.location.href = "/signin";
    }
    setIsLoading(false);
  }, []);

  const MainDisplay = () => {
    if(!isLoading) {
      if (paneView === "profile") {
        return (
          <Profile
            loading={isLoading}
            name={buyerInfo.name}
            email={buyerInfo.email}
          />
        )
      } else if (paneView === "onboarding") {
        return (
          <Onboarding
            userid={buyerInfo.id}
            token={buyerInfo.token}
          />
        )
      } else if (paneView === "myTickets") {
        return (
          <MyTickets/>
        )
    }
    } else {
      return null
    }
  }

  const Navigation = () => {
    if(!isLoading) {
      return (
          <BuyerNavigation
            name="My Name"
            buyerInfo={buyerInfo}
            loading={isLoading}
            pane={paneView}
            clicked={(event) => {
              console.log("Clicked button")
              console.log("event: ", event.target)
              console.log("event.name: ", event.target.name)
              setPaneView(event.target.name)
            }}
          />
      )
    } else {return null}
  }

  const onboardingMessage = () => {
    if (true) {
      return (
        <div style={{zIndex: "400"}}>Onboarding</div>
      )
    }
  }

  return (
    <div className={classes.DashboardContainer}>
      <div className={classes.DashboardCanvas}>
          {Navigation()}
          {MainDisplay()}
      </div>
    </div>
  );
};

export default BuyerAccount;