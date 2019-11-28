import React, { Component } from "react";
import { Route } from "react-router-dom";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import Main from "../HomePage/HomePage";
import Video from "../Video/Video";
import Checkout from "../../TicketPurchases/Checkout";
import CheckoutCOPY from "../../TicketPurchases/CheckoutCOPY";
import TicketSelection from "../../TicketPurchases/TicketSelection";
import TicketSelectionCOPY from "../../TicketPurchases/TicketSelectionCOPY";

import OSDHeader from "../Headers/OSDHeader";
import OSDFooter from "../Footers/OSDFooter";

import LogoA from "../../assets/WhiteLettering_BlueBackground/WhiteLettering_BlueBackground_64old.png";
import LogoB from "../../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_64.png";

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
          path="/checkoutCOPY"
          exact
          render={routeProps => (
            <React.Fragment>
              <CheckoutCOPY />
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
          path="/evCOPY/"
          render={routeProps => (
            <React.Fragment>
              <TicketSelectionCOPY />
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
  }
}

export default Layout;
