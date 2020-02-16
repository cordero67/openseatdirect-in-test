import React from "react";
import { Route } from "react-router-dom";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import Main from "../HomePage/HomePage";
import Video from "../Video/Video";
import Events from "../../Events/Events";
import EventDetail from "../../Events/EventDetail";
import EventDetailLight from "../../Events/EventDetailLight";
import ContactUs from "../ContactUs/ContactUs";
import CheckoutBT from "../../TicketPurchases/Checkout_bt";
import CheckoutPP from "../../TicketPurchases/Checkout_pp";
import CheckoutPPPROMO from "../../TicketPurchases/Checkout_ppPROMO";
import TicketSelection from "../../TicketPurchases/TicketSelection";
import TicketSelectionPROMO from "../../TicketPurchases/TicketSelectionPROMO.js";

import OSDHeaderFixed from "../Headers/OSDHeaderFixed";
import OSDHeaderClean from "../Headers/OSDHeaderClean";
import OSDHeader from "../Headers/OSDHeader";
import OSDFooterClean from "../Footers/OSDFooterClean";
import OSDFooter from "../Footers/OSDFooter";

//import LogoA from "../../assets/WhiteLettering_BlueBackground/WhiteLettering_BlueBackground_1024.png";
//import LogoB from "../../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_1024.png";
import LogoC from "../../assets/BlueLettering_TransparentBackground/BlueLettering_TransparentBackground_1024.png";
//import LogoD from "../../assets/BlackandWhite/Black_and_White_1024.png";
//import LogoE from "../../assets/BlackandWhite_TransparentBackground/Black_and_White_TransparentBackground_1024.png";

const Layout = () => {
  return (
    <Aux>
      <Route
        path="/"
        exact
        render={routeProps => (
          <React.Fragment>
            <OSDHeaderFixed
              styleType="HeaderAFixed"
              logoType={LogoC}
            ></OSDHeaderFixed>
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
            <OSDHeaderFixed
              styleType="HeaderAFixed"
              logoType={LogoC}
            ></OSDHeaderFixed>
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
            <OSDHeaderFixed
              styleType="HeaderAFixed"
              logoType={LogoC}
            ></OSDHeaderFixed>
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
            <OSDHeaderFixed
              styleType="HeaderAFixed"
              logoType={LogoC}
            ></OSDHeaderFixed>
            <Events />
            <OSDFooter></OSDFooter>
          </React.Fragment>
        )}
      />
      <Route
        path="/evd/"
        render={routeProps => (
          <React.Fragment>
            <OSDHeader styleType="HeaderA" logoType={LogoC}></OSDHeader>
            <EventDetail />
            <OSDFooter></OSDFooter>
          </React.Fragment>
        )}
      />

      <Route
        path="/evdLight/"
        render={routeProps => (
          <React.Fragment>
            <OSDHeaderClean styleType="HeaderA" logoType={LogoC}></OSDHeaderClean>
            <EventDetailLight />
            <OSDFooterClean></OSDFooterClean>
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
        path="/checkout_ppPROMO"
        exact
        render={routeProps => (
          <React.Fragment>
            <CheckoutPPPROMO />
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

      <Route
        path="/evPROMO/"
        render={routeProps => (
          <React.Fragment>
            <TicketSelectionPROMO />
          </React.Fragment>
        )}
      />
    </Aux>
  );
};

export default Layout;
