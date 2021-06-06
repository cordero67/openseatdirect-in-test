import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";

import { Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import SideDrawerItems from "./SideDrawerItems";
import Backdrop from "../UI/Backdrop/Backdrop";
import classes from "./SideDrawer.module.css";

const SideDrawer = ({ history, open, closed }) => {
  let attachedClasses = [classes.SideDrawer, classes.Close];
  if (open) {
    attachedClasses = [classes.SideDrawer, classes.Open];
  }

  return (
    <Fragment>
      <Backdrop show={open} clicked={closed} />
      <div className={attachedClasses.join(" ")}>
        <div className={classes.Title}>
          <div
            style={{
              paddingTop: "10px",
              paddingLeft: "12px",
              fontSize: "20px",
            }}
          >
            <FontAwesomeIcon
              size="2x"
              color="white"
              cursor="pointer"
              onClick={closed}
              icon={faTimes}
            />
          </div>
        </div>
        <Nav>
          <SideDrawerItems
            currentPage={history.location.pathname}
            clicked={closed}
          />
        </Nav>
      </div>
    </Fragment>
  );
};

export default withRouter(SideDrawer);
