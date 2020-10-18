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

    
    let tagLine = () => {
      if (screenSize >= 500) {
        return (
          <div style={{fontSize: "52px", lineHeight: "94px"}}>
            GET CASH NOW!
          </div>
        ) 
      } else {
        return (
          <div style={{paddingBottom: "20px", fontSize: "52px", lineHeight: "64px"}}>
            GET CASH
            <br></br>
            NOW!
          </div>
        )
      }
    }

    let marketingLine = () => {
      if (screenSize >= 1050) {
        return (
          <div style={{fontSize: "26px", lineHeight: "52px"}}>
            Don't wait until after the event passes. Get paid on tickets you sell right away.
          </div>
        ) 
      } else if (screenSize >= 900 && screenSize < 1050) {
        return (
          <div style={{fontSize: "22px", lineHeight: "48px"}}>
            Don't wait until after the event passes. Get paid on tickets you sell right away.
          </div>
        )
      } else if (screenSize >= 650 && screenSize < 900) {
        return (
          <div style={{fontSize: "26px", lineHeight: "52px"}}>
            Don't wait until after the event passes.
            <br></br>
            Get paid on tickets you sell right away.
          </div>
        )
      } else if (screenSize >= 450 && screenSize < 650) {
        return (
          <div style={{fontSize: "20px", lineHeight: "46px"}}>
            Don't wait until after the event passes.
            <br></br>
            Get paid on tickets you sell right away.
          </div>
        )
      } else {
        return (
          <div style={{fontSize: "20px", lineHeight: "46px"}}>
            Don't wait until
            <br></br>
            after the event passes.
            <br></br>
            Get paid on tickets
            <br></br>
            you sell right away.
          </div>
        )
      }
    }

    let OSDimage = () => {
      if (screenSize >= 1050) {
        return (
          <img
            style={{maxHeight: "auto", maxWidth: "700px"}}
            src={OSDImage}
          >
          </img>
        )
      } else if (screenSize >= 900 && screenSize < 1050) {
        return (
          <img
            style={{maxHeight: "auto", maxWidth: "600px"}}
            src={OSDImage}
          >
          </img>
        )
      } else if (screenSize >= 650 && screenSize < 900) {
        return (
          <img
            style={{maxHeight: "auto", maxWidth: "500px"}}
            src={OSDImage}
          ></img>
        )
      } else if (screenSize >= 500 && screenSize < 650) {
        return (
          <img
            style={{maxHeight: "auto", maxWidth: "400px"}}
            src={OSDImage}
          ></img>
        )
      } else {
        return (
          <img
            style={{maxHeight: "auto", maxWidth: "300px"}}
            src={OSDImage}
          ></img>
        )
      }
    }

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

    let MarketingPoints = () => {
      if (screenSize >= 1050) {
        return (
          <div>
            <div
              className={classes.Grid}
              style={{fontFamily: "Lato", paddingLeft: "calc(50% - 475px)", columnGap: "100px", fontSize: "26px", fontWeight: "600"}}>
                <div>Get Cash Now!</div>
                <div>Absolutely NO Fees</div>
                <div>Own All Your Data</div>
            </div>
            <div
              className={classes.ImageGrid}
              style={{fontFamily: "Lato", paddingLeft: "calc(50% - 410px)", columnGap: "230px", fontSize: "16px"}}>
  
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
            <div
              className={classes.Grid}
              style={{fontFamily: "Lato", paddingLeft: "calc(50% - 475px)", columnGap: "100px", fontSize: "16px"}}>
                <div>
                  Don't wait until after the
                  <br></br>
                  event passes. Get paid on
                  <br></br>
                  tickets you sell right away.
                </div>
                <div>
                  We're not kidding.
                  <br></br>
                  You and your customers
                  <br></br>
                  NEVER pay any ticketing fees.
                </div>
                <div>
                  All transaction information
                  <br></br>
                  in one place: buyer emails,
                  <br></br>
                  transaction info and data.
                </div>
            </div>
          </div>
        )
      } else if (screenSize >= 900 && screenSize < 1050) {
        return (
          <div>
            <div
              className={classes.Grid}
              style={{fontFamily: "Lato", paddingLeft: "calc(50% - 425px)", columnGap: "50px", fontSize: "26px", fontWeight: "600"}}>
                <div>Get Cash Now!</div>
                <div>Absolutely NO Fees</div>
                <div>Own All Your Data</div>
            </div>
            <div
              className={classes.ImageGrid}
              style={{fontFamily: "Lato", paddingLeft: "calc(50% - 360px)", columnGap: "180px", fontSize: "16px"}}>
  
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
            <div
              className={classes.Grid}
              style={{fontFamily: "Lato", paddingLeft: "calc(50% - 425px)", columnGap: "50px", fontSize: "16px"}}>
                <div>
                  Don't wait until after the
                  <br></br>
                  event passes. Get paid on
                  <br></br>
                  tickets you sell right away.
                </div>
                <div>
                  We're not kidding.
                  <br></br>
                  You and your customers
                  <br></br>
                  NEVER pay any ticketing fees.
                </div>
                <div>
                  All transaction information
                  <br></br>
                  in one place: buyer emails,
                  <br></br>
                  transaction info and data.
                </div>
            </div>
          </div>
        )
      } else {
        return (
          <div>
  
            <div className={classes.DescriptionText} style={{fontSize: "26px", fontWeight: "600"}}>
              <div>Get Cash Now!</div>
            </div>
            <div className={classes.ImageContainer}>
              <img
                style={{maxHeight: "auto", maxWidth: "200px"}}
                src={CashNow}
              >
              </img>
            </div>
            <div style={{fontFamily: "Lato", textAlign: "center", fontSize: "20px", fontWeight: "400"}}>
              Don't wait until after the
              <br></br>
              event passes. Get paid on
              <br></br>
              tickets you sell right away.
            </div>
            <br></br>
            <br></br>
  
  
            <div className={classes.DescriptionText} style={{fontSize: "26px", fontWeight: "600"}}>
              <div>Absolutely NO Fees</div>
            </div>
            <div className={classes.ImageContainer}>
              <img
                style={{maxHeight: "auto", maxWidth: "200px"}}
                src={NoFees}
              >
              </img>
            </div>
            <div style={{fontFamily: "Lato", textAlign: "center", fontSize: "20px", fontWeight: "400"}}>
              We're not kidding.
              <br></br>
              You and your customers
              <br></br>
              NEVER pay any ticketing fees.
            </div>
            <br></br>
            <br></br>
  
  
            <div className={classes.DescriptionText} style={{fontSize: "26px", fontWeight: "600"}}>
              <div>Own All Your Data</div>
            </div>
            <div className={classes.ImageContainer}>
              <img
                style={{maxHeight: "auto", maxWidth: "200px"}}
                src={SingleLocation}
              >
              </img>
            </div>
            <div style={{fontFamily: "Lato", textAlign: "center", fontSize: "20px", fontWeight: "400"}}>
              All transaction information
              <br></br>
                in one place: buyer emails,
              <br></br>
                transaction info and data.
            </div>
  
  
          </div>
        )
      }
    }

    let signUpText = () => {
      if (screenSize >= 1050) {
        return (
          <div style={{fontSize: "26px", lineHeight: "52px"}}>
            Sign up for a free trial or a subscription for as low as $7 a month.
          </div>
        ) 
      } else if (screenSize >= 900 && screenSize < 1050) {
        return (
          <div style={{fontSize: "22px", lineHeight: "48px"}}>
            Sign up for a free trial or a subscription for as low as $7 a month.
          </div>
        )
      } else if (screenSize >= 650 && screenSize < 900) {
        return (
          <div style={{fontSize: "26px", lineHeight: "52px"}}>
            Sign up for a free trial or a
            <br></br>
            subscription for as low as $7 a month.
          </div>
        )
      } else {
        return (
          <div style={{fontSize: "20px", lineHeight: "46px"}}>
            Sign up for a free trial or a
            <br></br>
            subscription for as low as $7 a month.
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

    let appointment = () => {
      if (screenSize >= 1050) {
        return (
          <div style={{fontSize: "26px", lineHeight: "52px"}}>
          Talk one-on-one with an onboarding specialist
          </div>
        ) 
      } else if (screenSize >= 900 && screenSize < 1050) {
        return (
          <div style={{fontSize: "22px", lineHeight: "48px"}}>
          Talk one-on-one with an onboarding specialist
          </div>
        )
      } else if (screenSize >= 650 && screenSize < 900) {
        return (
          <div style={{fontSize: "26px", lineHeight: "52px"}}>
            Talk one-on-one with 
            <br></br>
            an onboarding specialist
          </div>
        )
      } else {
        return (
          <div style={{fontSize: "20px", lineHeight: "46px"}}>
          Talk one-on-one with 
          <br></br>
          an onboarding specialist
          </div>
        )
      }
    }

    return (
      <div className={classes.MainContainer}>

        {isResizing ? null : (
          <div>
            <div className={classes.TopContainer}>
              <div className={classes.MarketingText}>
                {tagLine()}
              </div>
              <div className={classes.MarketingText}>
                {marketingLine()}
              </div>
            </div>

            <div className={classes.OSDImageContainer}>
              {OSDimage()}
            </div>

            <div className={classes.TextContainer}>
              <div className={classes.DescriptionText}>
                {marketingPhrase()}
              </div>
            </div>

            <div className={classes.SectionContainer}>
              {MarketingPoints()}
            </div>

            <div className={classes.SectionContainer}>
              <div className={classes.DescriptionText}>
                {signUpText()}
              </div>
              {screenSize >= 500 ? (
                <div className={classes.SignUpForm}>
                  <div>
                    {signUpForm}
                  </div>
                </div>
                ) :  (
                  <div className={classes.SignUpFormTight}>
                    <div>
                      {signUpForm}
                    </div>
                  </div>
                )
              }
            </div>


            <div className={classes.SectionContainer}>
              <div className={classes.DescriptionText}>
                {appointment()}
              </div>
              <br></br>
              <Button href="https://calendly.com/dahday/openseatdirect-connect?back=1&month=2020-10">
                SCHEDULE APPOINTMENT
              </Button>
            </div>


          </div>
        )}
      </div>
    )
}

export default Home;