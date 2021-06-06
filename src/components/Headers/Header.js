import React, { useState } from "react";

import { withRouter } from "react-router-dom";
import { Nav } from "react-bootstrap";

import { signout } from "../../Users/apiUsers";
import Logo from "../Logo/Logo";
import HeaderItems from "./HeaderItems";
import classes from "./Header.module.css";

const Header = ({ history, logo, positioning, clicked }) => {
  let headerDisplay;

  const [isResizing, setIsResizing] = useState(false);

  const stylingUpdate = () => {
    console.log("stylingUpdate in Header");
    setIsResizing(true);
    setIsResizing(false);
  };

  window.onresize = function (event) {
    console.log("resized in Header");
    stylingUpdate(window.innerWidth);
  };

  console.log("Inside Header");

  headerDisplay = (
    <div className={classes.Header} style={{ position: positioning }}>
      <div className={classes.Toggle} onClick={clicked}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div>
        <Nav style={{ textAlign: "left" }}>
          <Logo
            style={{ textAlign: "left" }}
            source={logo}
            placement="header"
          />
        </Nav>
      </div>
      <div className={classes.Navigation}>
        <Nav>
          <HeaderItems
            currentPage={history.location.pathname}
            signOut={() => {
              signout(() => {
                history.push("/");
              });
            }}
          />
        </Nav>
      </div>
    </div>
  );

  return <div>{headerDisplay}</div>;
};

export default withRouter(Header);
