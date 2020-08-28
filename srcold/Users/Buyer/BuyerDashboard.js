import React, { useState, useEffect } from "react";
import { Redirect, Fragment, Link } from "react-router-dom";

import { API } from "../../config";

import BuyerNavigation from "./BuyerNavigation";
import Profile from "./Profile";
import TicketWallet from "./TicketWallet";
import Preferences from "./Preferences";
import Onboarding from "./Onboarding";
import classes from "./BuyerDashboard.module.css";

const BuyerDashboard = () => {

  const [buyerInfo, setBuyerInfo] = useState();//
  const [isLoading, setIsLoading] = useState(true);//

  const [paneView, setPaneView] = useState("onboarding")

  useEffect(() => {
    setIsLoading(true);
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      console.log("tempUser: ", tempUser)
      let tempBuyerInfo = {};
      tempBuyerInfo.token = tempUser.token;
      tempBuyerInfo.email = tempUser.user.email
      tempBuyerInfo.name = tempUser.user.name
      tempBuyerInfo.role = tempUser.user.role
      tempBuyerInfo.id = tempUser.user._id;
      //console.log("tempBuyerInfo: ", tempBuyerInfo)
      setBuyerInfo(tempBuyerInfo);
      let tempUser2 = JSON.parse(localStorage.getItem("user"));
      console.log("tempUser2: ", tempUser2)
    } else {
      window.location.href = "/signin";
    }
    setIsLoading(false);
  }, []);

const MainDisplay = () => {
  if(!isLoading) {
      return (
        <Onboarding
          userid={buyerInfo.id}
          token={buyerInfo.token}
        />
      )
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

export default BuyerDashboard;

/*
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
    } else if (paneView === "wallet") {
        return (
          <TicketWallet/>
        )
    } else if (paneView === "preferences") {
        return (
          <Preferences/>
        )
    } else {
      return null;
    }
  } else {
    return null
  }
}*/