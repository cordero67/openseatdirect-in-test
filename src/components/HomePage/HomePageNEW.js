import React, { useState, useEffect } from "react";
import { Route, NavLink } from "react-router-dom";

import { Button } from "react-bootstrap";

import Video from "../Video/Video";

import CashNow from "../../assets/CashNow.jpg";
import NoFees from "../../assets/NoFees.png";
import SingleLocation from "../../assets/SingleLocation.png";
import OSDImage from "../../assets/OpenSeatDirect/BlueLettering_TransparentBackground_1024.png"

import Aux from "../../hoc/Auxiliary/Auxiliary";
import classes from "./HomePageNEW.module.css";

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
        <label styles={{ fontSize: "16px" }}>
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

      <button onClick={() => {
        console.log("clicked button",{
          name: values.name,
          email: values.email,
          password: values.password,
        });
      }}
      className="btn btn-primary">
        Submit
      </button>
    </Aux>
  );

  /*
  
        setBody({
          name: values.name,
          email: values.email,
          password: values.password,
        })
  */

  let marketingLine = (
      <h1 className={classes.TextMain}>
        GET CASH NOW
        <br></br>
        <br></br>
        for every ticket you sell to your events.
        <br></br>
      </h1>
    )

  let marketingPhrase = (
    <div className={classes.TextPhrase}>
      <h1>
        a subscription based service that eliminates the traditional ticketing middleman
      </h1>
      <h1>
        allowing you to interact directly with your fans and control the entire ticketing process.
      </h1>
      <br></br>
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

  let tagLine;
  if (displaySize === "small") {
    tagLine = (
      <h1 className={classes.TextTagLine}>
        Ensuring you a direct ticket
        <br></br>
        to your fans!!!
      </h1>
    )
  } else {
    tagLine = (
      <h1 className={classes.TextTagLine}>
        Ensuring you a direct ticket to your fans!!!
      </h1>
    )
  }

  let breaksBottom = (
    <Aux>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
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

        <div className={classes.BlankCanvas} style={{height: "490px"}}>
        <br></br>
        <div className={classes.Header}>
          Sign Up Now!
        </div>
        <br></br>
        <div className={classes.Section}>
          {signUpForm}
        </div>
      </div>

        {breaksBottom}

        <div>
          <h1>
            <NavLink to="/video" exact>
              <Button variant="outline-light">LEARN MORE</Button>
            </NavLink>
            <Route path="/video" exact component={Video} />
          </h1>
        </div>

      </div>
    );
  
}

export default Home;