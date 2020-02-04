import React from "react";
import { Route } from "react-router-dom";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import Main from "../HomePage/HomePage";
import Video from "../Video/Video";
import Events from "../../Events/Events";
import ContactUs from "../ContactUs/ContactUs";
import CheckoutBT from "../../TicketPurchases/Checkout_bt";
import CheckoutPP from "../../TicketPurchases/Checkout_pp";
import TicketSelection from "../../TicketPurchases/TicketSelection";

import OSDHeader from "../Headers/OSDHeader";
import OSDFooter from "../Footers/OSDFooter";

import LogoA from "../../assets/WhiteLettering_BlueBackground/WhiteLettering_BlueBackground_1024.png";
import LogoB from "../../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_1024.png";
import LogoC from "../../assets/BlueLettering_TransparentBackground/BlueLettering_TransparentBackground_1024.png";
import LogoD from "../../assets/BlackandWhite/Black_and_White_1024.png";
import LogoE from "../../assets/BlackandWhite_TransparentBackground/Black_and_White_TransparentBackground_1024.png";

const Layout = () => {
  return (
    <Aux>
      <Route
        path="/"
        exact
        render={routeProps => (
          <React.Fragment>
            <OSDHeader styleType="HeaderA" logoType={LogoC}></OSDHeader>
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
            <OSDHeader styleType="HeaderA" logoType={LogoC}></OSDHeader>
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
            <OSDHeader styleType="HeaderA" logoType={LogoC}></OSDHeader>
            <ContactUs />
            <OSDFooter></OSDFooter>
          </React.Fragment>
        )}
      />

      <Route
        path="/events"
        exact
        render={routeProps => (
          <React.Fragment>
            <OSDHeader styleType="HeaderA" logoType={LogoC}></OSDHeader>
            <Events />
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
