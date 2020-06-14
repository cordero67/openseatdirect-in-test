import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

import { isAuthenticated } from "../../Users/apiUsers";

// Redirects back to previous page if incorrect role for desired dashboard.
// arguments are the "Component"'s props
const PrivateRoute = ({ component: Component, role: role }) => {
  console.log("role: ", role);
  //console.log("isAuthenticated().user.role: ", isAuthenticated().user.role);
  console.log("isAuthenticated: ", isAuthenticated());
  console.log(
    "isAuthenticated JSON.stringify: ",
    JSON.stringify(isAuthenticated())
  );
  if (isAuthenticated() && parseInt(role) === isAuthenticated().user.role) {
    return (
      <React.Fragment>
        <Component />
      </React.Fragment>
    );
  } else if (isAuthenticated().user.role === 2) {
    return <Redirect to="/admindashboard" />;
  } else if (isAuthenticated().user.role === 1) {
    return <Redirect to="/vendorevents" />;
  } else if (isAuthenticated().user.role === 0) {
    return <Redirect to="/userdashboard" />;
  } else {
    return <Redirect to="/" />;
  }
};

export default PrivateRoute;
