import React, { Component } from "react";
import { Route } from "react-router-dom";

import { Nav } from "react-bootstrap";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import Main from "../HomePage/HomePage";
import Video from "../Video/Video";
import PuertoRicanDinner from "../../TicketPurchases/PuertoRicanDinner";
import PuertoRicanDinnerTickets from "../../TicketPurchases/PuertoRicanDinnerTickets";
import PuertoRicanDinnerCheckout from "../../TicketPurchases/PuertoRicanDinnerCheckout";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";

import LogoA from "../../assets/WhiteLettering_BlueBackground/WhiteLettering_BlueBackground_64old.png";
import LogoB from "../../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_64.png";

import footerLogo from "../../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_32.png";

class Layout extends Component {
  render() {
    return (
      <Aux>
        <Route
          path="/"
          exact
          render={routeProps => (
            <React.Fragment>
              <Header styleType="HeaderB" logoType={LogoB}></Header>
              <Main />
              <Footer></Footer>
            </React.Fragment>
          )}
        />

        <Route
          path="/video"
          exact
          render={routeProps => (
            <React.Fragment>
              <Header styleType="HeaderA" logoType={LogoA}></Header>
              <Video />
              <Footer></Footer>
            </React.Fragment>
          )}
        />

        <Route
          path="/dahday-puertoricandinner"
          exact
          render={routeProps => (
            <React.Fragment>
              <Header styleType="HeaderA" logoType={LogoA}></Header>
              <PuertoRicanDinner />
            </React.Fragment>
          )}
        />

        <Route
          path="/dahday-puertoricandinner-tickets"
          exact
          render={routeProps => (
            <React.Fragment>
              <Header styleType="HeaderA" logoType={LogoA}></Header>
              <PuertoRicanDinnerTickets />
            </React.Fragment>
          )}
        />

        <Route
          path="/dahday-puertoricandinner-checkout"
          exact
          render={routeProps => (
            <React.Fragment>
              <Header styleType="HeaderA" logoType={LogoA}></Header>
              <PuertoRicanDinnerCheckout />
            </React.Fragment>
          )}
        />
      </Aux>
    );
  }
}

export default Layout;
