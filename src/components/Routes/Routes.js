import React, { Component } from "react";
import { Route } from "react-router-dom";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import Main from "../HomePage/HomePage";
import Video from "../Video/Video";
import Checkout from "../../TicketPurchases/Checkout";
import TicketSelection from "../../TicketPurchases/TicketSelection";
import MyAccount from "../../user/MyAccount";
import UserDashboard from "../../user/UserDashboard";
import AdminDashboard from "../../user/AdminDashboard";
import SignIn from "../../user/SignIn";
import SignUp from "../../user/SignUp";

import MyRoute from "./MyRoute";
import UserRoute from "./UserRoute";
import AdminRoute from "./AdminRoute";

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
          path="/checkout"
          exact
          render={routeProps => (
            <React.Fragment>
              <Checkout />
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
        />
        <MyRoute path="/myaccount" exact component={MyAccount} />
        <UserRoute path="/userdashboard" exact component={UserDashboard} />
        <AdminRoute path="/admindashboard" exact component={AdminDashboard} />
        )} />
        <Route
          path="/signin"
          exact
          render={routeProps => (
            <React.Fragment>
              <OSDHeader
                styleType="HeaderB"
                logoType={LogoB}
                pathName="signin"
              ></OSDHeader>
              <SignIn />
            </React.Fragment>
          )}
        />
        <Route
          path="/signup"
          exact
          render={routeProps => (
            <React.Fragment>
              <OSDHeader
                styleType="HeaderB"
                logoType={LogoB}
                pathName="signup"
              ></OSDHeader>
              <SignUp />
            </React.Fragment>
          )}
        />
      </Aux>
    );
  }
}

export default Layout;
