import React, { Fragment } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Nav } from "react-bootstrap";

import { signout, isAuthenticated } from "../../user/apiUser";

import styles from "./OSDHeader.module.css";

// determines if current menu item, i.e. "<NavLink>" is the active link
// "history" represents the actual active path
// "path" represents the path defined in the respective "<NavLink>"
// "#ff9900" gives an orange color 8DADD4
const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "red" };
  } else {
    return { color: "ffffff" };
  }
};

// "props" is from ReactRouterDom since  component is wrapped by "withRouter"
// "history, logoType, styleType" is destructured from "props" object
const Header = ({ history, logoType, styleType }) => {
  return (
    <Nav className={styles[styleType]}>
      <ul>
        <li>
          <NavLink to="/" exact>
            <img
              src={logoType}
              alt="OpenSeatDirect Logo"
              className={styles.Logo}
            />
          </NavLink>
        </li>

        <li>
          <NavLink to="/video" style={isActive(history, "/video")} exact>
            About<br></br>OSD
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/ev/dahday_cocina_candela?eventID=94106331593"
            style={isActive(
              history,
              "/ev/dahday_cocina_candela?eventID=94106331593"
            )}
          >
            Events
          </NavLink>
        </li>

        {!isAuthenticated() && (
          <Fragment>
            <li>
              <NavLink to="/signin" style={isActive(history, "/signin")}>
                Sign In
              </NavLink>
            </li>

            <li>
              <NavLink to="/signup" style={isActive(history, "/signup")}>
                Sign Up
              </NavLink>
            </li>
          </Fragment>
        )}

        {isAuthenticated() && isAuthenticated().user.role === 0 && (
          <li>
            <NavLink to="/myaccount" style={isActive(history, "/myaccount")}>
              My<br></br>Account
            </NavLink>
          </li>
        )}

        {isAuthenticated() && isAuthenticated().user.role === 1 && (
          <li>
            <NavLink
              to="/userdashboard"
              style={isActive(history, "/userdashboard")}
            >
              User<br></br>Dashboard
            </NavLink>
          </li>
        )}

        {isAuthenticated() && isAuthenticated().user.role === 2 && (
          <li>
            <NavLink
              to="/admindashboard"
              style={isActive(history, "/admindashboard")}
            >
              Admin<br></br>Dashboard
            </NavLink>
          </li>
        )}

        {isAuthenticated() && (
          <Fragment>
            <li>
              <span
                style={{ cursor: "pointer", color: "ffffff" }}
                onClick={() =>
                  signout(() => {
                    history.push("/");
                  })
                }
              >
                Sign<br></br>Out
              </span>
            </li>
          </Fragment>
        )}
      </ul>
    </Nav>
  );
};

export default withRouter(Header);
