import React, { useState, useEffect } from "react";
import { Route, NavLink } from "react-router-dom";

import { Button } from "react-bootstrap";

import Video from "../Video/Video";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import styles from "./HomePageAAA.module.css";

const Home = () => {
  // defines styling variables
  const [isRestyling, setIsRestyling] = useState(false);
  const [displaySize, setDisplaySize] = useState("large");

  const stylingUpdate = (inWidth) => {
    //setIsRestyling(true);
    // based on window width, displays one or two panes
    if (inWidth < 550) {
      setDisplaySize("small");
    } else {
      setDisplaySize("large");
    }
    //setIsRestyling(false);
  };

  useEffect(() => {
    stylingUpdate(window.innerWidth);
  }, []);

  let windowWidth;
  //DID NOT MAKE A CHANGE
  window.onresize = function(event) {
    stylingUpdate(window.innerWidth);
  };

  let mainDisplay;
  if (displaySize === "small") {
    console.log("displaySize: ", displaySize)
    console.log("Window width: ", window.innerWidth)
    mainDisplay = (
      <Aux>
        <div className={styles.MainContainer}>
          <div className={styles.MainContainer_image}>
            <div className={styles.MainGrid}>
              <h1 className={styles.TextMain}>
                A Single Market
                <br></br>
                <br></br>
                Solution for
                <br></br>
                <br></br>
                Controlling the
                <br></br>
                <br></br>
                Entire Ticket Journey
              </h1>
              <br></br>
              <br></br>
              <br></br>
                <h1 className={styles.TextTagLine}>
                Ensuring you a direct ticket
                <br></br>
                to your fans!!!
              </h1>
              <h1>
                <NavLink to="/video" exact>
                  <Button variant="outline-light">LEARN MORE</Button>
                </NavLink>
                <Route path="/video" exact component={Video} />
              </h1>
            </div>
          </div>
        </div>
      </Aux>
    )
  } else {
    console.log("displaySize: ", displaySize)
    console.log("Window width: ", window.innerWidth)
    mainDisplay = (
      <Aux>
        <div className={styles.MainContainer}>
          <div className={styles.MainContainer_image}>
            <div className={styles.MainGrid}>
              <h1 className={styles.TextMain}>
                A Single Market Solution for
                <br></br>
                <br></br>
                Controlling the
                <br></br>
                <br></br>
                Entire Ticket Journey
              </h1>
              <br></br>
              <br></br>
              <br></br>
              <h1 className={styles.TextTagLine}>
                Ensuring you a direct ticket to your fans!!!
              </h1>
              <br></br>
              <h1>
                <NavLink to="/video" exact>
                  <Button variant="outline-light">LEARN MORE</Button>
                </NavLink>
                <Route path="/video" exact component={Video} />
              </h1>
              <br></br>
            </div>
          </div>
        </div>
      </Aux>
    )
  }


  return (
    <Aux>
      {mainDisplay}
    </Aux>
  );


}

export default Home;

/*
      <Aux>
        <div className={styles.MainContainer}>
          <div className={styles.MainContainer_image}>
            <div className={styles.MainGrid}>
              <h1 className={styles.TextMain}>
                A Single Market
                <br></br>
                <br></br>
                Solution for
                <br></br>
                <br></br>
                Controlling the
                <br></br>
                <br></br>
                Entire Ticket Journey
              </h1>
              <br></br>
              <br></br>
              <h1 style={{ fontSize: "36px", fontStyle: "italic" }}>
                Ensuring you a direct ticket to your fans!!!
              </h1>
              <br></br>
              <br></br>
              <h1>
                <NavLink to="/video" exact>
                  <Button variant="outline-light">LEARN MORE</Button>
                </NavLink>
                <Route path="/video" exact component={Video} />
              </h1>
              <br></br>
            </div>
          </div>
        </div>
      </Aux>

      */
