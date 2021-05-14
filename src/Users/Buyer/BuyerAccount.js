import React, { useState, useEffect } from "react";

import queryString from "query-string";

import BuyerNavigation from "./BuyerNavigation";
import Account from "../Vendor/Account";
import TicketWallet from "../TicketWallet/TicketWallet";
import Onboarding from "./Onboarding";
import classes from "./BuyerAccount.module.css";

const BuyerAccount = () => {
  const [buyerInfo, setBuyerInfo] = useState(); //
  const [isLoading, setIsLoading] = useState(true); //

  const [paneView, setPaneView] = useState("wallet");

  const getStatus = () => {
    console.log("inside new 'getStatus' function");
    let tempData = JSON.parse(localStorage.getItem("user"));
    if ("user" in tempData && "accountId" in tempData.user) {
      let tempAccountId = tempData.user.accountId;

      let hasLinkIds = false;
      let hasPaid = false;
      if (tempAccountId.ticketPlan === "free") {
        return 7;
      }
      if (tempAccountId.ticketPlan === "comp") {
        hasPaid = true;
      }
      if (
        "paymentGatewayType" in tempAccountId &&
        tempAccountId.paymentGatewayType === "PayPalExpress" &&
        "paypalExpress_client_id" in tempAccountId &&
        "string" === typeof tempAccountId.paypalExpress_client_id
      ) {
        hasLinkIds = true;
      }
      if (
        "paymentGatewayType" in tempAccountId &&
        tempAccountId.paymentGatewayType === "PayPalMarketplace" &&
        "paypal_merchant_id" in tempAccountId &&
        "string" === typeof tempAccountId.paypal_merchant_id
      ) {
        hasLinkIds = true;
      }
      if (
        "paypal_plan_id" in tempAccountId &&
        "string" === typeof tempAccountId.paypal_plan_id &&
        "accountPaymentStatus" in tempAccountId &&
        tempAccountId.accountPaymentStatus === "good"
      ) {
        hasPaid = true;
      }
      if (!hasPaid && !hasLinkIds) {
        return 4;
      }
      if (!hasPaid && hasLinkIds) {
        return 5;
      }
      if (hasPaid && !hasLinkIds) {
        return 6;
      }
      if (hasPaid && hasLinkIds) {
        return 8;
      }
      return 4;
    } else return 0;
  };

  useEffect(() => {
    setIsLoading(true);
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      console.log("tempUser: ", tempUser);
      if (
        "vendorIntent" in tempUser.user &&
        tempUser.user.vendorIntent === true
      ) {
        setPaneView("onboarding");
      }
      if (
        queryString.parse(window.location.search).tracking_id !== undefined &&
        queryString.parse(window.location.search).permissionsGranted !==
          undefined &&
        queryString.parse(window.location.search).isEmailConfirmed !==
          undefined &&
        queryString.parse(window.location.search).error !== undefined
      ) {
        setPaneView("onboarding");
      }
      if (getStatus() === 7 || getStatus() === 8) {
        window.location.href = "/myaccount";
      }
      let tempBuyerInfo = {};
      tempBuyerInfo.token = tempUser.token;
      tempBuyerInfo.email = tempUser.user.email;
      tempBuyerInfo.name = tempUser.user.name;
      tempBuyerInfo.role = tempUser.user.role;
      tempBuyerInfo.id = tempUser.user._id;
      setBuyerInfo(tempBuyerInfo);
    } else {
      window.location.href = "/signin";
    }
    setIsLoading(false);
  }, []);

  const MainDisplay = () => {
    if (!isLoading) {
      if (paneView === "profile") {
        return (
          <Account
            loading={isLoading}
            name={buyerInfo.name}
            email={buyerInfo.email}
          />
        );
      } else if (paneView === "onboarding") {
        return <Onboarding userid={buyerInfo.id} token={buyerInfo.token} />;
      } else if (paneView === "wallet") {
        return <TicketWallet />;
      }
    } else {
      return null;
    }
  };

  const Navigation = () => {
    if (!isLoading) {
      return (
        <BuyerNavigation
          name="My Name"
          buyerInfo={buyerInfo}
          loading={isLoading}
          pane={paneView}
          clicked={(event) => {
            console.log("Clicked button");
            console.log("event: ", event.target);
            console.log("event.name: ", event.target.name);
            setPaneView(event.target.name);
          }}
        />
      );
    } else {
      return null;
    }
  };

  const onboardingMessage = () => {
    if (true) {
      return <div style={{ zIndex: "400" }}>Onboarding</div>;
    }
  };

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
