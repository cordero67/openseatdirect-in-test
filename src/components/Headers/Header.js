import React, { useState } from "react";

import { withRouter } from "react-router-dom";
import { Nav } from "react-bootstrap";

import { HOST } from "../../config";
import { signout } from "../../Users/apiUsers";
import Logo from "../Logo/Logo";
import HeaderItems from "./HeaderItems";
import classes from "./Header.module.css";

const Header = ({ history, logo, positioning, clicked }) => {
  let headerDisplay;

  console.log("HOST: ", `${HOST}`);

  const [isResizing, setIsResizing] = useState(false);
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  const stylingUpdate = (inWidth) => {
    console.log("stylingUpdate in Header");
    setIsResizing(true);
    setScreenSize(inWidth);
    setIsResizing(false);
    console.log("screenSize in Header: ", screenSize);
  };

  window.onresize = function (event) {
    console.log("resized in Header");
    stylingUpdate(window.innerWidth);
  };

  console.log("Inside Header");

  headerDisplay = (
    <header className={classes.Header} style={{ position: positioning }}>
      <div style={{ paddingLeft: "10px" }}>
        <Nav>
          <Logo source={logo} placement="header" />
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
      <div className={classes.Toggle} onClick={clicked}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
  );

  return <div>{headerDisplay}</div>;
};

export default withRouter(Header);
