import React, { useState, useEffect } from "react";
import { Redirect, Fragment, Link } from "react-router-dom";

import { API } from "../../config";

import BuyerNavigation from "./BuyerNavigation";
import Profile from "./Profile";
import TicketWallet from "./TicketWallet";
import Preferences from "./Preferences";
import VendorOnboarding from "./VendorOnboarding";
import VendorOnboardingOld from "./VendorOnboardingOld";
import classes from "./BuyerDashboard.module.css";

const VendorEvents = () => {

  const [buyerInfo, setBuyerInfo] = useState();//
  const [isLoading, setIsLoading] = useState(true);//

  const [paneView, setPaneView] = useState("vendor")

  useEffect(() => {
    setIsLoading(true);
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      let tempBuyerInfo = {};
      tempBuyerInfo.token = tempUser.token;
      tempBuyerInfo.email = tempUser.user.email
      tempBuyerInfo.name = tempUser.user.name
      tempBuyerInfo.role = tempUser.user.role
      tempBuyerInfo.id = tempUser.user._id;
      console.log("tempBuyerInfo: ", tempBuyerInfo)
      setBuyerInfo(tempBuyerInfo);
      if (tempBuyerInfo.role === 1) {
        return <Redirect to="/vendorevents" />;
      } else if (tempBuyerInfo.role !== 0) {
        window.location.href = "/";
      }
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
    } else if (paneView === "vendor") {
      return (
        <VendorOnboarding/>
      )
    } else if (paneView === "vendorold") {
      return (
        <VendorOnboardingOld/>
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

export default VendorEvents;