import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useOurApi } from "./apiUsers";
import { API } from "../../config";

import { Button } from "react-bootstrap";
import HaHaForHireLights from "../../assets/HaHaForHireLights.png"
import DJGirl from "../../assets/DJGirl.png"

//import DemoCarousel from "./DemoCarousel.js";

import CashNow from "../../assets/CashNow.jpg";
import NoFees from "../../assets/NoFees.png";
import SingleLocation from "../../assets/SingleLocation.png";
import OSDImage from "../../assets/OpenSeatDirect/BlueLettering_TransparentBackground_1024.png"

import HaHaForHire from "../../assets/HaHaForHireComedyNight.png"
import RikaRikaStudio from "../../assets/RikaRikaStudio.png"

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

  let  myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const url1 = `${API}/signup`;
  const method1 = "POST";
  const body1  = null;
  const initialData1 ={status: true, message:"hi first time"};
  
  const { isLoading, hasError, setUrl, setBody, data, networkError} = useOurApi(method1, url1,myHeaders,body1, initialData1);

  const sysmessage = networkError ? "NetworkError...please check your connectivity" : "SYSTEM ERROR - please try again";

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

  
    let topContainer;
    
    let tagLine = () => {
      if (screenSize >= 800) {
        topContainer = classes.TopContainerLarge;
        return (
          <div style={{paddingTop: "20px"}}>
            <div style={{fontSize: "58px", fontFamily: "Helvetica, sans-serif", lineHeight: "72px", textAlign: "center"}}>
              DIY TICKETING
              <br></br>
              MADE EASY!
            </div>
            <div style={{fontSize: "22px", fontFamily: "Helvetica, sans-serif", lineHeight: "42px", textAlign: "center"}}>
              Eliminate the middle-man.
            </div>
          </div>
        ) 
      } else if (screenSize >= 650 && screenSize < 800) {
        topContainer = classes.TopContainerLarge;
        return (
          <div style={{paddingTop: "20px"}}>
            <div style={{fontSize: "52px", lineHeight: "94px", textAlign: "center"}}>
              DIY TICKETING
              <br></br>
              MADE EASY!
            </div>
            <div style={{fontSize: "22px", fontFamily: "Helvetica, sans-serif", lineHeight: "54px", textAlign: "center"}}>
              Eliminate the middle-man.
            </div>
          </div>
        ) 
      } else {
        topContainer = classes.TopContainer;
        return (
          <div style={{fontSize: "48px", lineHeight: "64px", textAlign: "center"}}>
            DIY TICKETING
            <br></br>
            MADE EASY!
          </div>
        ) 
      }
    }
        
    let tagLine2 = () => {
      if (screenSize >= 800) {
        topContainer = classes.TopContainerLarge;
        return (
          <div style={{paddingTop: "20px"}}>
            <div style={{fontSize: "58px", fontFamily: "Helvetica, sans-serif", lineHeight: "72px", textAlign: "center"}}>
              ELIMINATE THE
              <br></br>
              MIDDLEMAN
            </div>
            <div style={{fontSize: "22px", fontFamily: "Helvetica, sans-serif", lineHeight: "42px", textAlign: "center"}}>
              DIY ticketing made easy.
            </div>
          </div>
        ) 
      } else if (screenSize >= 650 && screenSize < 800) {
        topContainer = classes.TopContainerLarge;
        return (
          <div style={{paddingTop: "20px"}}>
            <div style={{fontSize: "52px", lineHeight: "94px", textAlign: "center"}}>
              ELIMINATE THE
              <br></br>
              MIDDLEMAN
            </div>
            <div style={{fontSize: "22px", fontFamily: "Helvetica, sans-serif", lineHeight: "54px", textAlign: "center"}}>
              DIY ticketing made easy.
            </div>
          </div>
        ) 
      } else {
        topContainer = classes.TopContainer;
        return (
          <div style={{fontSize: "48px", lineHeight: "64px", textAlign: "center"}}>
            ELIMINATE THE
              <br></br>
              MIDDLEMAN
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
      if (screenSize >= 1200) {
        return (
          <div style={{fontSize: "26px", lineHeight: "36px"}}>
            <span style={{fontWeight: "600", color: "#2F5596"}}>OPENSEATDIRECT</span> a subscription-based DIY alternative solution that eliminates traditional ticketing middlemen
            <br></br>
            allowing you to interact directly with your fans and control the entire ticketing process.
            <br></br>
            <br></br>
            Our solution frees event creators and promoters from money-grabbing ticket platforms, and instead
            <br></br>
            allows them to receive cash deposits at the time of sale and eliminate checkout fees.
          </div>
        ) 
      } else if (screenSize >= 1000 && screenSize < 1200) {
        return (
          <div style={{fontSize: "22px", lineHeight: "32px"}}>
            <span style={{fontWeight: "600", color: "#2F5596"}}>OPENSEATDIRECT</span> a subscription-based DIY alternative solution that eliminates traditional ticketing middlemen
            <br></br>
            allowing you to interact directly with your fans and control the entire ticketing process.
            <br></br>
            <br></br>
            Our solution frees event creators and promoters from money-grabbing ticket platforms, and instead
            <br></br>
            allows them to receive cash deposits at the time of sale and eliminate checkout fees.
          </div>
        )
      } else if (screenSize >= 650 && screenSize < 1000) {
        return (
          <div style={{fontSize: "26px", lineHeight: "36px"}}>
            <span style={{fontWeight: "600", color: "#2F5596"}}>OPENSEATDIRECT</span> a subscription-based service that
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
          <div style={{fontSize: "20px", lineHeight: "30px"}}>
            <span style={{fontWeight: "600", color: "#2F5596"}}>OPENSEATDIRECT</span> a subscription-based service that
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
          <div style={{fontSize: "20px", lineHeight: "30px"}}>
            <span style={{fontWeight: "600", color: "#2F5596"}}>OPENSEATDIRECT</span>
            <br></br>
            a subscription-based service that
            <br></br>
            eliminates traditional ticketing
            <br></br>
            middlemen allowing you to
            <br></br>
            interact directly with your fans and
            <br></br>
            control the entire ticketing process.
          </div>
        )
      }
    }

    let marketingPoints = () => {
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
                style={{maxHeight: "auto", maxWidth: "150px"}}
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
                style={{maxHeight: "auto", maxWidth: "150px"}}
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
                style={{maxHeight: "auto", maxWidth: "150px"}}
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
          <div style={{fontSize: "22px", lineHeight: "32px"}}>
            Sign up for a free trial or a subscription for as low as $7 a month.
          </div>
        )
      } else if (screenSize >= 650 && screenSize < 900) {
        return (
          <div style={{fontSize: "26px", lineHeight: "36px"}}>
            Sign up for a free trial or a
            <br></br>
            subscription for as low as $7 a month.
          </div>
        )
      } else {
        return (
          <div style={{fontSize: "20px", lineHeight: "30px"}}>
            Sign up for a free trial or a
            <br></br>
            subscription for as low as $7 a month.
          </div>
        )
      }
    }

    const showError = () => {
      if (hasError) {
        return (
          <div style={{color: "red"}}> {sysmessage}</div>
        )
      } else if (data.status) {
        return (
          null
        )
      } else {
        return (
          <div style={{color: "red"}}> {data.error}</div>
        )
      }
    };

    const showSuccess = (
      <div>
        <div>To complete the sign-up process, please click the link in the message sent to your e-mail inbox:</div>
        <br></br>
        <div style={{color: "blue"}}>{values.email}.</div>
        <br></br>
        <div>Please check your spam/junk folder if you do not see our message in your main inbox.</div>
        <div>For "gmail" accounts, please check your "All Mail" folder.</div>
        <br></br>
        <div>Go to <Link to="/signin" style={{color: "blue"}}>Signin</Link></div>
      </div>
    );

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
          <label style={{ fontSize: "16px" }}>
            E-mail Address
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            onChange={handleChange}
            value={email}
          />
        </div>
  
        <div className="form-group">
          <label style={{ fontSize: "16px" }}>
            Password
          </label>
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
              setBody({
                name: values.name,
                email: values.email,
                password: values.password,
              })
            }}
            className="btn btn-primary">
            CREATE ACCOUNT
          </button>
        </div>
      </Aux>
    );

    const mainDisplay = () => {
      //NEED A BETTER TEST
      //without "data.message !== "hi first time it places the data object into local storage with every keystroke
      //this then generates an error in navigation component when it is looking for "role"
      if (data.status && data.message !== "hi first time") {
        return (
          <Aux>
            {showSuccess}
          </Aux>
        )
      } else {
        return (
          <div>
            <div>
              {showError()}
              {signUpForm}
            </div>  
          </div>
        )
      }
    }

    let appointment = () => {
      if (screenSize >= 1050) {
        return (
          <div style={{fontSize: "26px", lineHeight: "36px"}}>
          Talk one-on-one with an onboarding specialist
          </div>
        ) 
      } else if (screenSize >= 900 && screenSize < 1050) {
        return (
          <div style={{fontSize: "22px", lineHeight: "32px"}}>
          Talk one-on-one with an onboarding specialist
          </div>
        )
      } else if (screenSize >= 650 && screenSize < 900) {
        return (
          <div style={{fontSize: "26px", lineHeight: "36px"}}>
            Talk one-on-one with 
            <br></br>
            an onboarding specialist
          </div>
        )
      } else {
        return (
          <div style={{fontSize: "20px", lineHeight: "30px"}}>
          Talk one-on-one with 
          <br></br>
          an onboarding specialist
          </div>
        )
      }
    }

    /*
      <div className={classes.TopContainer}>
        <div className={classes.TagLineText}
          style={{position: "absolute", paddingLeft: "40px", paddingTop: "20px"}}>
          {tagLine()}
        </div>
        <div style={{width: "1200", height: "600px", position: "absolute", overflow: "hidden"}}>
          <img src={HaHaForHireLights}/>
        </div>
      </div>

      

      <div className={classes.TopContainer}>
        <div className={classes.TagLineText}
          style={{position: "absolute", paddingLeft: "40px", paddingTop: "20px"}}>
          {tagLine2()}
        </div>
        <div style={{width: "1200", height: "600px", position: "absolute", overflow: "hidden"}}>
          <img src={HaHaForHireLights}/>
        </div>
      </div>
    */

    return (
      <div className={classes.MainContainer}>
        {isResizing ? null : (
          <div>
            <div className={classes.TopContainerLarge}>
              <div className={classes.TagLineText}
                style={{position: "absolute", paddingLeft: "40px", paddingTop: "20px"}}>
                {tagLine()}
              </div>
              <div>
                <img style={{maxWidth: "1200px", position: "absolute"}} src={DJGirl}/>
              </div>
            </div>

            <div className={classes.TopContainerLarge}>
              <div className={classes.TagLineText}
                style={{position: "absolute", paddingLeft: "40px", paddingTop: "20px"}}>
                {tagLine2()}
              </div>
              <div>
                <img style={{maxWidth: "1200px", position: "absolute"}} src={DJGirl}/>
              </div>
            </div>
            <div className={classes.TextContainer}>
              <div className={classes.DescriptionText} style={{fontWeight: "400"}}>
                {marketingPhrase()}
              </div>
            </div>

            <div className={classes.SectionContainer}>
              {marketingPoints()}
            </div>

            <div className={classes.SectionContainer}>
              <div className={classes.DescriptionText}>
                {signUpText()}
              </div>

              {screenSize >= 500 ? (
                <div className={classes.SignUpForm}>
                  <div>
                    {mainDisplay()}
                  </div>
                </div>
                ) :  (
                  <div className={classes.SignUpFormTight}>
                    <div>
                      {mainDisplay()}
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