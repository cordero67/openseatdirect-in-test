import React, { useState, useEffect } from "react";
import { Route, NavLink } from "react-router-dom";

import { Button } from "react-bootstrap";

import CashNow from "../../assets/CashNow.jpg";
import NoFees from "../../assets/NoFees.png";
import SingleLocation from "../../assets/SingleLocation.png";
import OSDImage from "../../assets/OpenSeatDirect/BlueLettering_TransparentBackground_1024.png"

import Aux from "../../hoc/Auxiliary/Auxiliary";
import classes from "./HomePage.module.css";

const Home = () => {
  const [isResizing, setIsResizing] = useState(false);
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: ""
  });

  const { name, email, password } = values;

  const stylingUpdate = (inWidth) => {
    console.log("stylingUpdate")
    setIsResizing(true);
    setScreenSize(inWidth);
    setIsResizing(false);
    console.log("screenSize: ", screenSize)
  };

  useEffect(() => {
    console.log("screen width: ", window.innerWidth)
    stylingUpdate(window.innerWidth);
  }, []);

  window.onresize = function(event) {
    console.log("resized")
    stylingUpdate(window.innerWidth);
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  }

  /*
  
        setBody({
          name: values.name,
          email: values.email,
          password: values.password,
        })
  */

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

    let tagLine = (
      <div className={classes.MarketingText}>
        GET CASH NOW!
      </div>
    )

    let marketingLine = (
      <div className={classes.DescriptionText}>
        Don't wait until after the event passes. Get paid on tickets you sell right away.
      </div>
    )

    let marketingPhrase = () => {
      if (screenSize >= 1050) {
        return (
          <div style={{fontSize: "26px", lineHeight: "52px"}}>
            a subscription-based service that eliminates traditional ticketing middlemen
            <br></br>
            allowing you to interact directly with your fans and control the entire ticketing process.
          </div>
        ) 
      } else if (screenSize >= 900 && screenSize < 1050) {
        return (
          <div style={{fontSize: "22px", lineHeight: "48px"}}>
            a subscription-based service that eliminates traditional ticketing middlemen
            <br></br>
            allowing you to interact directly with your fans and control the entire ticketing process.
          </div>
        )
      } else if (screenSize >= 650 && screenSize < 900) {
        return (
          <div style={{fontSize: "26px", lineHeight: "52px"}}>
            a subscription-based service that
            <br></br>
            eliminates traditional ticketing middlemen
            <br></br>
            allowing you to interact directly with your fans and
            <br></br>
            control the entire ticketing process.
          </div>
        )
      } else if (screenSize >= 500 && screenSize < 650) {
        return (
          <div style={{fontSize: "20px", lineHeight: "46px"}}>
            a subscription-based service that
            <br></br>
            eliminates traditional ticketing middlemen
            <br></br>
            allowing you to interact directly with your fans and
            <br></br>
            control the entire ticketing process.
          </div>
        )
      } else {
        return (
          <div style={{fontSize: "20px", lineHeight: "46px"}}>
            a subscription-based service
            <br></br>
            that eliminates
            <br></br>
            traditional ticketing middlemen
            <br></br>
            allowing you to interact
            <br></br>
            directly with your fans and
            <br></br>
            control the entire ticketing process.
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

    return (
      <div className={classes.MainContainer}>
        {isResizing ? null : (
          <div>

            <div className={classes.TextContainer2}>
              <div className={classes.DescriptionText}>
                {marketingPhrase()}
              </div>
            </div>


          </div>
        )}
      </div>
    )
}

export default Home;
/*

          <div>
            <div className={classes.TextContainer}>
              {tagLine}
              {marketingLine}
            </div>

            <div className={classes.ImageContainer}>
              <img
                className={classes.ImageBox}
                src={OSDImage}
              >
              </img>
            </div>

            <div className={classes.TextContainer2}>
              <div className={classes.DescriptionText}>
                {marketingPhrase()}
              </div>
            </div>

            <div className={classes.SectionContainer}>
              {marketingPoints}
            </div>

            <div className={classes.SectionContainer}>
              <div className={classes.DescriptionText}>
                Sign up for a free trial or a subscription for as low as $7 a month.
              </div>

              <div className={classes.SignUpForm}>
                <div>
                  {signUpForm}
                </div>
              </div>
            </div>

            <div className={classes.SectionContainer}>
              {appointment}
              <br></br>
              <Button href="https://calendly.com/dahday/openseatdirect-connect?back=1&month=2020-10">
                SCHEDULE APPOINTMENT
              </Button>
            </div>

          </div>

*/




/*
: 
      <div className={classes.MainContainer}>

        <div className={classes.TextContainer}>
          {marketingLine}
        </div>

        <div className={classes.ImageContainer}>
          <img
            className={classes.ImageBox}
            src={OSDImage}
          >
          </img>
        </div>

        <div className={classes.TextContainer2}>
          {marketingPhrase()}
        </div>

        <div className={classes.SectionContainer}>
          {marketingPoints}
        </div>
        
        <div className={classes.SectionContainer}>
          <div className={classes.DescriptionText}>
            Sign up for a free trial or a subscription for as low as $7 a month.
          </div>

          <div className={classes.SignUpForm}>
            <div>
              {signUpForm}
            </div>
          </div>
        </div>

        <div className={classes.SectionContainer}>
          {appointment}
          <br></br>
          <Button href="https://calendly.com/dahday/openseatdirect-connect?back=1&month=2020-10">
            SCHEDULE APPOINTMENT
          </Button>
        </div>
      </div> }*/