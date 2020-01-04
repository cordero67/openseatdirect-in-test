import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

import { isAuthenticated } from "../../user/apiUser";

import OSDHeader from "../Headers/OSDHeader";
import LogoB from "../../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_64.png";

// A wrapper for <Route> that redirects to the login page if user is NOT authenticated.
// arguments are the "Component"'s props

const UserRoute = ({ component: Component, ...rest }) => (
  // if user is authenticated and role of 1, the inputted "Component" is returned with its "props"
  // if NOT authenticated, the user is re-routed to "signin" page
  <Route
    {...rest}
    render={props =>
      (isAuthenticated() && isAuthenticated().user.role === 1) ? (
        <React.Fragment>
          <OSDHeader
            styleType="HeaderB"
            logoType={LogoB}
            pathName="userdashboard"
          ></OSDHeader>
          <Component {...props} />
        </React.Fragment>
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

export default UserRoute;
