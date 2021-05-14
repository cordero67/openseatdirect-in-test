import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";

import { Nav } from "react-bootstrap";
import Logo from "../Logo/Logo";
import logo from "../../assets/OpenSeatDirect/BlueLettering_TransparentBackground_1024.png";

import SideDrawerItems from "./SideDrawerItems";
import Backdrop from "../UI/Backdrop/Backdrop";
import classes from "./SideDrawer.module.css";

const SideDrawer = ({ history, open, closed, accountTab }) => {
  let attachedClasses = [classes.SideDrawer, classes.Close];
  if (open) {
    attachedClasses = [classes.SideDrawer, classes.Open];
  }

  return (
    <Fragment>
      <Backdrop show={open} clicked={closed} />
      <div className={attachedClasses.join(" ")}>
        <div className={classes.Title}>
          <Logo source={logo} placement="side" />
          <div
            style={{
              fontSize: "20px",
              paddingTop: "10px",
            }}
          >
            <ion-icon
              style={{ fontWeight: "600", fontSize: "36px", color: "black" }}
              name="close-outline"
              cursor="pointer"
              onClick={closed}
            />
          </div>
        </div>
        <Nav>
          <SideDrawerItems
            currentPage={history.location.pathname}
            accountTab={accountTab}
            clicked={closed}
          />
        </Nav>
      </div>
    </Fragment>
  );
};

export default withRouter(SideDrawer);
