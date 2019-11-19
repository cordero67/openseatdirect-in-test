import React, { Component } from "react";
import { Route } from "react-router-dom";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import Main from "../HomePage/HomePage";
import Video from "../Video/Video";
import Checkout from "../../TicketPurchases/Checkout";
import CheckoutCURRENT from "../../TicketPurchases/CheckoutCURRENT";
import TicketSelection from "../../TicketPurchases/TicketSelection";
import TicketSelectionOLD from "../../TicketPurchases/TicketSelectionOLD";
import EventData from "../../TicketPurchases/EventData";

import OSDHeader from "../Headers/OSDHeader";
import DahdayHeader from "../Headers/DahDayHeader";
import OSDFooter from "../Footers/OSDFooter";
import DahdayFooter from "../Footers/DahdayFooter";

import LogoA from "../../assets/WhiteLettering_BlueBackground/WhiteLettering_BlueBackground_64old.png";
import LogoB from "../../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_64.png";
import DahdayLogo from "../../assets/dahday/dahday-white-logo-header.png";

class Layout extends Component {
  render() {
    return (
      <Aux>
        <Route
          path="/"
          exact
          render={routeProps => (
            <React.Fragment>
              <OSDHeader styleType="HeaderB" logoType={LogoB}></OSDHeader>
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
              <OSDHeader styleType="HeaderA" logoType={LogoA}></OSDHeader>
              <Video />
              <OSDFooter></OSDFooter>
            </React.Fragment>
          )}
        />

        <Route
          path="/checkout"
          exact
          render={routeProps => (
            <React.Fragment>
              <Checkout />
            </React.Fragment>
          )}
        />

        <Route
          path="/checkoutCURRENT"
          exact
          render={routeProps => (
            <React.Fragment>
              <DahdayHeader logoType={DahdayLogo}></DahdayHeader>
              <CheckoutCURRENT />
              <DahdayFooter></DahdayFooter>
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
          path="/evOLD/"
          render={routeProps => (
            <React.Fragment>
              <TicketSelectionOLD />
            </React.Fragment>
          )}
        />

        <Route
          path="/eventdata/"
          render={routeProps => (
            <React.Fragment>
              <EventData />
            </React.Fragment>
          )}
        />
      </Aux>
    );
  }
}

export default Layout;
