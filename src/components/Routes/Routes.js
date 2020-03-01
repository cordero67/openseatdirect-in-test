import React from "react";
import { Route } from "react-router-dom";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import Main from "../HomePage/HomePage";
import Video from "../Video/Video";
import Events from "../../Events/Events";
import EventDetail from "../../Events/EventDetail";
import EventDetailHaHa from "../../Events/EventDetailHaHa";
import EventDetailPIFF from "../../Events/EventDetailPIFF";
import EventDetailTech from "../../Events/EventDetailTech";
import EventDetailLight from "../../Events/EventDetailLight";
import ContactUs from "../ContactUs/ContactUs";
import CheckoutBT from "../../TicketPurchases/Checkout_bt";
import CheckoutPP from "../../TicketPurchases/Checkout_pp";
import CheckoutPPPROMO from "../../TicketPurchases/Checkout_ppPROMO";
import CheckoutPPPROMOADV from "../../TicketPurchases/Checkout_ppPROMOADV";
import TicketSelection from "../../TicketPurchases/TicketSelection";
import TicketSelectionPROMO from "../../TicketPurchases/TicketSelectionPROMO.js";
import TicketSelectionPROMOADV from "../../TicketPurchases/TicketSelectionPROMOADV.js";

import OSDHeader from "../Headers/OSDHeader";
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
            <OSDHeader
              positioning="fixed"
              logoType={LogoC}
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
              positioning="fixed"
              logoType={LogoC}
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
              positioning="fixed"
              logoType={LogoC}
            ></OSDHeader>
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
            <OSDHeader
              positioning="fixed"
              logoType={LogoC}
            ></OSDHeader>
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
        path="/checkout_ppPROMO"
        exact
        render={routeProps => (
          <React.Fragment>
            <CheckoutPPPROMO />
          </React.Fragment>
        )}
      />
      <Route
        path="/checkout_ppPROMOADV"
        exact
        render={routeProps => (
          <React.Fragment>
            <CheckoutPPPROMOADV />
          </React.Fragment>
        )}
      />


      <Route
        path="/ed/"
        render={routeProps => (
          <React.Fragment>
            <OSDHeader
              positioning="floating"
              logoType={LogoC}
            ></OSDHeader>
            <EventDetail />
            <OSDFooter></OSDFooter>
          </React.Fragment>
        )}
      />
      <Route
        path="/edh/"
        render={routeProps => (
          <React.Fragment>
            <OSDHeader
              positioning="floating"
              logoType={LogoC}
            ></OSDHeader>
            <EventDetailHaHa />
            <OSDFooter></OSDFooter>
          </React.Fragment>
        )}
      />
      <Route
        path="/edf/"
        render={routeProps => (
          <React.Fragment>
            <OSDHeader
              positioning="floating"
              logoType={LogoC}
            ></OSDHeader>
            <EventDetailPIFF />
            <OSDFooter></OSDFooter>
          </React.Fragment>
        )}
      />
      <Route
        path="/edt/"
        render={routeProps => (
          <React.Fragment>
            <OSDHeader
              positioning="floating"
              logoType={LogoC}
            ></OSDHeader>
            <EventDetailTech />
            <OSDFooter></OSDFooter>
          </React.Fragment>
        )}
      />
      <Route
        path="/edl/"
        render={routeProps => (
          <React.Fragment>
            <OSDHeader
              positioning="floating"
              logoType={LogoC}
            ></OSDHeader>
            <EventDetailLight />
            <OSDFooter></OSDFooter>
          </React.Fragment>
        )}
      />





      <Route
        path="/et/"
        render={routeProps => (
          <React.Fragment>
            <TicketSelection />
          </React.Fragment>
        )}
      />
      <Route
        path="/etPROMO/"
        render={routeProps => (
          <React.Fragment>
            <TicketSelectionPROMO />
          </React.Fragment>
        )}
      />
      <Route
        path="/etPROMOADV/"
        render={routeProps => (
          <React.Fragment>
            <TicketSelectionPROMOADV />
          </React.Fragment>
        )}
      />





      


    </Aux>
  );
};

export default Layout;
