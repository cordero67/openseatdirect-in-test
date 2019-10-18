import React, { Component } from "react";
import { Route } from "react-router-dom";

import { Nav } from "react-bootstrap";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import Main from "../HomePage/HomePage";
import Video from "../Video/Video";
import PuertoRicanDinner from "../../TicketPurchases/PuertoRicanDinner";

import Header from "../Header/Header";

import styles from "./Routes.module.css";

import LogoA from "../../assets/images/WhiteLettering_BlueBackground/WhiteLettering_BlueBackground_64old.png";
import LogoB from "../../assets/images/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_64.png";

import footerLogo from "../../assets/images/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_32.png";

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
            </React.Fragment>
          )}
        />

        <Route
          path="/puerto-rican-dinner"
          exact
          render={routeProps => (
            <React.Fragment>
              <Header styleType="HeaderA" logoType={LogoA}></Header>
              <PuertoRicanDinner />
            </React.Fragment>
          )}
        />

        <Nav className={styles.Footer}>
          <ul>
            <li>
              <img src={footerLogo} className={styles.Logo} />
            </li>
            <li>
              {" "}
              Copyright &copy; 2019 OpenSeatDirect LLC | All Rights Reserved
            </li>
          </ul>
        </Nav>
      </Aux>
    );
  }
}

export default Layout;
