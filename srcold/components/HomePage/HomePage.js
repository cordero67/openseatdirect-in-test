import React, { useState, useEffect } from "react";
import { Route, NavLink } from "react-router-dom";

import { Button } from "react-bootstrap";

import Video from "../Video/Video";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import styles from "./HomePage.module.css";

const Home = () => {
  // defines styling variables
  //const [isRestyling, setIsRestyling] = useState(false);
  const [displaySize, setDisplaySize] = useState("large");

  const stylingUpdate = (inWidth) => {
    //setIsRestyling(true);
    // based on window width, displays one or two panes
    if (inWidth < 580) {
      setDisplaySize("small");
    } else {
      setDisplaySize("large");
    }
    //setIsRestyling(false);
  };

  useEffect(() => {
    stylingUpdate(window.innerWidth);
  }, []);

  //DID NOT MAKE A CHANGE
  window.onresize = function(event) {
    stylingUpdate(window.innerWidth);
  };

  let marketingLine;
  if (displaySize === "small") {
    marketingLine = (
      <h1 className={styles.TextMain}>
        A Single Market
        <br></br>
        Solution for
        <br></br>
        Controlling the
        <br></br>
        Entire Ticket Journey
      </h1>
    )
  } else {
    marketingLine = (
      <h1 className={styles.TextMain}>
        A Single Market Solution for
        <br></br>
        <br></br>
        Controlling the Entire Ticket Journey
      </h1>
    )
  }

  let tagLine;
  if (displaySize === "small") {
    tagLine = (
      <h1 className={styles.TextTagLine}>
        Ensuring you a direct ticket
        <br></br>
        to your fans!!!
      </h1>
    )
  } else {
    tagLine = (
      <h1 className={styles.TextTagLine}>
        Ensuring you a direct ticket to your fans!!!
      </h1>
    )
  }

  let breaksTop;
  if (displaySize === "small") {
    breaksTop = (
      <Aux>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        </Aux>
    )
  } else {
    breaksTop = (
      <Aux>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </Aux>
    )
  }

  let breaksMiddle;
  if (displaySize === "small") {
    breaksMiddle = (
      <Aux>
        <br></br>
        <br></br>
        </Aux>
    )
  } else {
    breaksMiddle = (
      <Aux>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </Aux>
    )
  }

  let breaksBottom;
  if (displaySize === "small") {
    breaksBottom = (
      <Aux>
        <br></br>
        </Aux>
    )
  } else {
    breaksBottom = (
      <Aux>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </Aux>
    )
  }

    return (
      <Aux>
        <div className={styles.container}>
          <div className={styles.container_image}>
              {breaksTop}
              <div className={styles.content}>
                {marketingLine}
              </div>
              {breaksMiddle}
              <div className={styles.content}>
                {tagLine}
              </div>
              {breaksBottom}
              <div className={styles.content}>
                <h1>
                  <NavLink to="/video" exact>
                    <Button variant="outline-light">LEARN MORE</Button>
                  </NavLink>
                  <Route path="/video" exact component={Video} />
                </h1>
              </div>
              <br></br>

          </div>
        </div>
      </Aux>
    );
  
}

export default Home;