import React, { useState, useEffect } from "react";

import { Button } from "react-bootstrap";

import CashNow from "../../assets/CashNow.jpg";
import NoFees from "../../assets/NoFees.png";
import SingleLocation from "../../assets/SingleLocation.png";
import OSDImage from "../../assets/OpenSeatDirect/BlueLettering_TransparentBackground_1024.png"

import Aux from "../../hoc/Auxiliary/Auxiliary";
import classes from "./HomePage.module.css";

const Home = () => {
  const [screenSize, setScreenSize] = useState("large")

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: ""
  });

  const { name, email, password } = values;

  const stylingUpdate = (inWidth) => {
    console.log("stylingUpdate")
    if (inWidth <= 375) {
      setScreenSize("extrasmall");
      console.log("screenSize: ", screenSize)
    } else if (inWidth <= 420) {
      setScreenSize("small");
      console.log("screenSize: ", screenSize)
    } else if (inWidth <= 800) {
      setScreenSize("medium");
      console.log("screenSize: ", screenSize)
    } else {
      setScreenSize("large");
      console.log("screenSize: ", screenSize)
    }
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  }

  
  let marketingPoints = (
    <Aux>
      <div className={classes.UpperGrid}>
        <div>Get Cash Now!</div>
        <div>Absolutely NO Fees</div>
        <div>Own All Your Data</div>
      </div>

      <div className={classes.MiddleGrid}>
        <img
            src={CashNow}
            alt="OpenSeatDirect Logo"
            style={{width: "100%"}}
        />
        <img
            src={NoFees}
            alt="OpenSeatDirect Logo"
            style={{width: "100%"}}
        />
        <img
            src={SingleLocation}
            alt="OpenSeatDirect Logo"
            style={{width: "100%"}}
        />
      </div>
      
      <div className={classes.LowerGrid}>
          <div>Don't wait until after the event passes. Get paid on tickets you sell right away.</div>
          <div>We're not kidding. You and your customers NEVER pay any ticketing fees.</div>
          <div>All transaction information in one place: buyer emails, transaction info and data. </div>
      </div>
    </Aux>
  )

  let marketingLine = (
    <div>
      <div className={classes.MarketingText}>
        GET CASH NOW!
      </div>
      <div className={classes.DescriptionText}>
      Don't wait until after the event passes. Get paid on tickets you sell right away.
      </div>
    </div>
  )

  let marketingPhrase = () => {
    if (screenSize === "extrasmall") {
      return (
        <div>
          <div className={classes.DescriptionTextExtraSmall}>
            a subscription-based service that
            <br></br>
            eliminates traditional ticketing middlemen
            <br></br>
            allowing you to interact
            <br></br>
            directly with your fans and
            <br></br>
            control the entire ticketing process.
          </div>
        </div>
      )
    } else if (screenSize === "small") {
      return (
        <div>
          <div className={classes.DescriptionTextSmall}>
            a subscription-based service that
            <br></br>
            eliminates traditional ticketing middlemen
            <br></br>
            allowing you to interact
            <br></br>
            directly with your fans and
            <br></br>
            control the entire ticketing process.
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div className={classes.DescriptionTextMedium}>
            a subscription-based service that eliminatessssssss traditional ticketing middlemen
            <br></br>
            allowing you to interact directly with your fans and
            <br></br>
            control the entire ticketing process.
          </div>
        </div>
      )
    }
  }

  const signUpForm = (
    <Aux>
      <div className="form-group">
        <label style={{ fontSize: "16px" }}>
          Full Name
        </label>
        <input
          type="text"
          name="name"
          className="form-control"
          onChange={handleChange}
          value={name}
        />
      </div>

      <div className="form-group">
        <label>E-mail Address</label>
        <input
          type="email"
          name="email"
          className="form-control"
          onChange={handleChange}
          value={email}
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          className="form-control"
          onChange={handleChange}
          value={password}
          placeholder="Minimum 8 characters, must include one number"
        />
      </div>

      <div style={{textAlign: "center", paddingTop: "15px"}}>
        <button
          onClick={() => {
            console.log("clicked button",{
              name: values.name,
              email: values.email,
              password: values.password,
            });
          }}
          className="btn btn-primary">
          SUBMIT
        </button>
      </div>
    </Aux>
  );
    
  let appointment = (
    <div className={classes.DescriptionText}>
        Talk one-on-one with an onboarding specialist
    </div>
  )

  useEffect(() => {
    stylingUpdate(window.innerWidth);
  }, []);

  window.onresize = function(event) {
    console.log("resized")
    if (window.innerWidth <= 375) {
      setScreenSize("extrasmall");
      console.log("screenSize: ", screenSize)
    } else if (window.innerWidth <= 420) {
      setScreenSize("small");
      console.log("screenSize: ", screenSize)
    } else if (window.innerWidth <= 800) {
      setScreenSize("medium");
      console.log("screenSize: ", screenSize)
    } else {
      setScreenSize("large");
      console.log("screenSize: ", screenSize)
    }
  };

  return (
    <Aux>
      <div className={classes.MainContainer}>

        <div className={classes.TextContainer}>
          {marketingLine}
        </div>

        <div>{marketingPhrase()}</div>
        <div>{signUpForm}</div>
      </div>
    </Aux>
  );
};

export default Home;