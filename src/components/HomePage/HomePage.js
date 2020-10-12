import React, { useState, useEffect } from "react";
import { Route, NavLink } from "react-router-dom";

import { Button } from "react-bootstrap";

import Video from "../Video/Video";

import CashNow from "../../assets/CashNow.jpg";
import NoFees from "../../assets/NoFees.png";
import SingleLocation from "../../assets/SingleLocation.png";
import OSDImage from "../../assets/OpenSeatDirect/BlueLettering_TransparentBackground_1024.png"

import Aux from "../../hoc/Auxiliary/Auxiliary";
import classes from "./HomePage.module.css";

const Home = () => {
  // defines styling variables
  //const [isRestyling, setIsRestyling] = useState(false);
  const [displaySize, setDisplaySize] = useState("large");

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: ""
  });

  const { name, email, password } = values;

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

  
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  }

  const signUpForm = (
    <Aux>
      <div className="form-group">
        <br></br>
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

  /*
  
        setBody({
          name: values.name,
          email: values.email,
          password: values.password,
        })
  */

  let appointment = (
    <div className={classes.Header}>
        Talk one-on-one with an onboarding specialist
    </div>
  )









    let marketingLine = (
      <div>
        <div className={classes.MarketingText}>
          GET CASH NOW
        </div>
        <div className={classes.MarketingText}>
          for every ticket you sell to your events.
        </div>
      </div>
    )

    let marketingPhrase = (
      <div>
        <div className={classes.DescriptionText}>
          a subscription based service that eliminates the traditional ticketing middleman
        </div>
        <div className={classes.DescriptionText}>
          allowing you to interact directly with your fans and control the entire ticketing process.
        </div>
      </div>
    )

    let marketingPoints = (
      <Aux>
        <div className={classes.UpperGrid}>
          <div>Get Cash Now!!!</div>
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

    return (
      <div className={classes.MainContainer}>
        <div className={classes.TopContainer}>
          {marketingLine}
        </div>

        <div className={classes.ImageContainer}>
          <img
            className={classes.ImageBox}
            src={OSDImage}
          >
          </img>
        </div>
        <div className={classes.MiddleContainer}>
          {marketingPhrase}
        </div>
        <div className={classes.LowerContainer}>
          {marketingPoints}
        </div>









        <div className={classes.SignUpForm}>
          <br></br>
          <div className={classes.Header}>
            Sign Up Now!
          </div>
          <br></br>
          <div>
            {signUpForm}
          </div>
          <br></br>
        </div>



        <div className={classes.Appointment}>
          {appointment}
          
          <br></br>
          <br></br>
          <Button href="https://calendly.com/dahday/openseatdirect-connect?back=1&month=2020-10">
            SCHEDULE APPOINTMENT
          </Button>
          <br></br>
          <br></br>
        </div>



      </div>
    );
  
}

export default Home;

/*


        */