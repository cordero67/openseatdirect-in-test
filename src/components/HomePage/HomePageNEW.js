import React, { useState, useEffect } from "react";
import { Route, NavLink } from "react-router-dom";

import { Button } from "react-bootstrap";

import Video from "../Video/Video";

import CashNow from "../../assets/CashNow.jpg";
import NoFees from "../../assets/NoFees.png";
import SingleLocation from "../../assets/SingleLocation.png";

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
        Reintroduces the lost tradition of 
        <br></br>
        Selling tickets
        <br></br>
        Direct to your fans
      </h1>
    )
  } else {
    marketingLine = (
      <h1 className={styles.TextMain}>
        Reintroduces the lost tradition of
        <br></br>
        <br></br>
        Selling tickets direct to your fans
      </h1>
    )
  }

  let marketingPoints = (
    <Aux>
      <div className={styles.CompleteUpperGrid}>
        <div>Get Cash Now!!!</div>
        <div>Absolutely NO Fees</div>
        <div>Own All Your Data</div>
      </div>
      <div className={styles.CompleteMiddleGrid}>
        <img
            src={CashNow}
            alt="OpenSeatDirect Logo"
            style={{width: "100%"}}
            //className={styleName}
        />
        <img
            src={NoFees}
            alt="OpenSeatDirect Logo"
            style={{width: "100%"}}
            //className={styleName}
        />
        <img
            src={SingleLocation}
            alt="OpenSeatDirect Logo"
            style={{width: "100%"}}
            //className={styleName}
        />
      </div>
      
      <div className={styles.CompleteLowerGrid}>
          <div>Don't wait until after the event passes. Get paid on tickets you sell right away.</div>
          <div>We're not kidding. Your customers NEVER pay any type of extra fee.</div>
          <div>Control all transaction and ticket buyer data from a single location. </div>
      </div>
    </Aux>
  )

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
                {marketingPoints}
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

/*
<div className={classes.SummaryHeader}>
                    OpenSeatDirect reintroduces the lost tradition of selling tickets direct to your fans
                </div>
                <div className={classes.CompleteUpperGrid}>
                    <div>Get Cash Now!!!</div>
                    <div>Absolutely NO Fees</div>
                    <div>Own All Your Data</div>
                </div>
                <div className={classes.CompleteMiddleGrid}>
                    <img
                        src={CashNow}
                        alt="OpenSeatDirect Logo"
                        style={{width: "100%"}}
                        //className={styleName}
                    />
                    <img
                        src={NoFees}
                        alt="OpenSeatDirect Logo"
                        style={{width: "100%"}}
                        //className={styleName}
                    />
                    <img
                        src={SingleLocation}
                        alt="OpenSeatDirect Logo"
                        style={{width: "100%"}}
                        //className={styleName}
                    />
                </div>
                <div className={classes.CompleteLowerGrid}>
                    <div>Don't wait until after the event passes. Get paid on tickets you sell right away.</div>
                    <div>We're not kidding. Your customers NEVER pay any type of extra fee.</div>
                    <div>Control all transaction and ticket buyer data from a single location. </div>
                </div>


                
                        <div className={classes.CompleteCanvas}>

                            <div className={classes.RightSkewedGrid}>
                                <div style={{paddingTop: "10px"}}>Receive the proceeds from all sales immediately!!!</div>
                                <img
                                    src={CashNow}
                                    alt="OpenSeatDirect Logo"
                                    style={{height: "100%"}}
                                    //className={styleName}
                                />
                            </div>

                            <div className={classes.LeftSkewedGrid}>
                                <img
                                    src={NoFees}
                                    alt="OpenSeatDirect Logo"
                                    style={{height: "100%"}}
                                    //className={styleName}
                                />
                                <div style={{paddingTop: "10px"}}>Your customers never face any type of ticket fee.</div>
                            </div>

                            <div className={classes.RightSkewedGrid}>
                                <div style={{paddingTop: "10px"}}>You own all transaction and customer data.</div>
                                <img
                                    src={SingleLocation}
                                    alt="OpenSeatDirect Logo"
                                    style={{height: "100%"}}
                                    //className={styleName}
                                />
                            </div>

                        </div>
                */