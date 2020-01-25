import React, { useState } from "react";
import { Route } from "react-router-dom";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import Main from "../HomePage/HomePage";
import Video from "../Video/Video";
import ContactUs from "../ContactUs/ContactUs";
import CheckoutBT from "../../TicketPurchases/Checkout_bt";
import CheckoutPP from "../../TicketPurchases/Checkout_pp";
import TicketSelection from "../../TicketPurchases/TicketSelection";

import OSDHeader from "../Headers/OSDHeader";
import OSDFooter from "../Footers/OSDFooter";

import LogoA from "../../assets/WhiteLettering_BlueBackground/WhiteLettering_BlueBackground_64old.png";
import LogoB from "../../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_64.png";

const Layout = () => {
  const [showFullHeader, setShowFullHeader] = useState(true);

  window.onresize = function(event) {
    if (window.innerWidth < 700) {
      setShowFullHeader(false);
    } else {
      setShowFullHeader(true);
    }
  };

  return (
    <Aux>
      <Route
        path="/"
        exact
        render={routeProps => (
          <React.Fragment>
            <OSDHeader
              styleType="HeaderB"
              logoType={LogoB}
              showFullHeader={showFullHeader}
            ></OSDHeader>
            <Main />
            <OSDFooter></OSDFooter>
          </React.Fragment>
        )}
      />

      <Route
        path="/video"
        exact
        render={routeProps => (
          <React.Fragment>
            <OSDHeader
              styleType="HeaderA"
              logoType={LogoA}
              showFullHeader={showFullHeader}
            ></OSDHeader>
            <Video />
            <OSDFooter></OSDFooter>
          </React.Fragment>
        )}
      />

      <Route
        path="/contactus"
        exact
        render={routeProps => (
          <React.Fragment>
            <OSDHeader
              styleType="HeaderA"
              logoType={LogoA}
              showFullHeader={showFullHeader}
            ></OSDHeader>
            <ContactUs />
            <OSDFooter></OSDFooter>
          </React.Fragment>
        )}
      />

      <Route
        path="/checkout_bt"
        exact
        render={routeProps => (
          <React.Fragment>
            <CheckoutBT />
          </React.Fragment>
        )}
      />

      <Route
        path="/checkout_pp"
        exact
        render={routeProps => (
          <React.Fragment>
            <CheckoutPP />
          </React.Fragment>
        )}
      />

      <Route
        path="/ev/"
        render={routeProps => (
          <React.Fragment>
            <TicketSelection />
          </React.Fragment>
        )}
      />
    </Aux>
  );
};

export default Layout;
