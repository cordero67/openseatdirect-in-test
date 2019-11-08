import React, { Component } from "react";
import { Route } from "react-router-dom";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import Main from "../HomePage/HomePage";
import Video from "../Video/Video";
import Checkout from "../../TicketPurchases/Checkout";
import TicketGeneral from "../../TicketPurchases/TicketGeneral";
import QueryRouting from "../../TicketPurchases/QueryRouting";
import Height from "../../TicketPurchases/Height";

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
              <DahdayHeader logoType={DahdayLogo}></DahdayHeader>
              <Checkout />
              <DahdayFooter></DahdayFooter>
            </React.Fragment>
          )}
        />

        <Route
          path="/queryrouting"
          exact
          render={routeProps => (
            <React.Fragment>
              <QueryRouting />
            </React.Fragment>
          )}
        />

        <Route
          path="/height"
          exact
          render={routeProps => (
            <React.Fragment>
              <Height />
            </React.Fragment>
          )}
        />

        <Route
          path="/ev/"
          render={routeProps => (
            <React.Fragment>
              <TicketGeneral />
            </React.Fragment>
          )}
        />
      </Aux>
    );
  }
}

export default Layout;
