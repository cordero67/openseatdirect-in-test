import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import YouTube from "react-youtube";

import { useOurApi } from "./apiUsers";
import { API } from "../../config";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faFacebook,
  faInstagram,
  faYoutube,
  faTwitter
} from "@fortawesome/free-brands-svg-icons";

import { Button } from "react-bootstrap";
import HaHaForHireLights from "../../assets/HaHaForHireLights.png"
import DJGirl from "../../assets/DJGirl.png"
import DJGirlShort from "../../assets/DJGirlShort.png"

//import DemoCarousel from "./DemoCarousel.js";

import CashNow from "../../assets/CashNow.jpg";
import CashInHand from "../../assets/CashInHand.png";
import NoFees from "../../assets/NoFees.png";
import ZeroFee from "../../assets/ZeroFee.png";
import SingleLocation from "../../assets/SingleLocation.png";
import OSDImage from "../../assets/OpenSeatDirect/BlueLettering_TransparentBackground_1024.png"
import Documents from "../../assets/Documents.png"

import HaHaForHire from "../../assets/HaHaForHireComedyNight.png"

import Aux from "../../hoc/Auxiliary/Auxiliary";
import classes from "./HomePage.module.css";

const Home = () => {
  const [isResizing, setIsResizing] = useState(false);
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: ""
  });

  const { name, email, password } = values;
  
  const [youTubeDimensions, setYouTubeDimensions] = useState({
    width: "640",
    height: "360"
  });

  const _onReady = event => {
    event.target.pauseVideo();
  };

  const resetOpts = (newWidth, newHeight) => {
    //setIsRestyling(true);
    setYouTubeDimensions({
      width: newWidth,
      height: newHeight
    });
    opts = {
      width: youTubeDimensions.width,
      height: youTubeDimensions.height,
      playerVars: {
        autoplay: 0,
        start: 0,
        playsinline: 1,
        modestbranding: 1,
        rel: 0
      }
    };
  };

  let opts = {
    width: youTubeDimensions.width,
    height: youTubeDimensions.height,
    playerVars: {
      autoplay: 0,
      start: 0,
      playsinline: 1,
      modestbranding: 1,
      rel: 0
    }
  };

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
    setScreenWidth(inWidth);
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
    let width;
    let height;
    if (window.innerWidth < 330) {
      console.log("resized")
      height = "174.375";
      width = "310";
    } else if (window.innerWidth < 380) {
      height = "185.625";
      width = "330";
    } else if (window.innerWidth < 420) {
      height = "213.75";
      width = "380";
    } else if (window.innerWidth < 770) {
      height = "236.25";
      width = "420";
    } else {
      height = "360";
      width = "640";
    }
    resetOpts(width, height);
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  }
  
    //let topContainer;
    /*
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
            <br></br>
            <button
              style={{
                border: "1px solid white",
                backgroundColor: "none",
                color: "white",
                fontSize: "14px",
                width: "240px",
                height: "40px"
              }}
              onClick={() => {
                console.log("Clicking button");
                scrollToSignUp()
              }}
            >
              SIGN UP NOW
            </button>
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
    */

  const signUpRef = React.useRef();
  //const videosRef = React.useRef();

  const scrollToSignUp = () => {
    console.log("Inside scrollToSignUp")
    signUpRef.current.scrollIntoView({
      behavior: "smooth",
    });
  }
        
    let tagLines = () => {
      if (screenWidth >= 1100) {
        return (
          <div style={{paddingTop: "20px"}}>
            <div
              style={{
                fontFamily: "Roboto",
                fontSize: "58px",
                fontWeight: "400",
                lineHeight: "72px",
                textAlign: "center"
              }}>
              DIY ticketing
              <br></br>
              made easy
            </div>
            <div
              style={{
                fontFamily: "Roboto",
                fontSize: "22px",
                fontWeight: "400",
                lineHeight: "30px",
                textAlign: "center",
                paddingTop: "5px",
                paddingBottom: "20px"
                }}>
              Batteries included
              <br></br>
              No middleman required
            </div>
            <button
              style={{
                fontFamily: "Roboto",
                border: "1px solid white",
                backgroundColor: "Transparent",
                color: "white",
                fontSize: "14px",
                fontWeight: "400",
                width: "180px",
                height: "40px"
              }}
              onClick={() => {
                console.log("Clicking button");
                scrollToSignUp()
              }}
            >
              SIGN UP NOW
            </button>
          </div>
        ) 
      } else if (screenSize >= 1000 && screenSize < 1100) {
        return (
          <div style={{paddingTop: "20px"}}>
            <div
              style={{
                fontFamily: "Roboto",
                fontSize: "52px",
                fontWeight: "400",
                lineHeight: "66px",
                textAlign: "center"}}>
              DIY ticketing
              <br></br>
              made easy
            </div>
            <div
              style={{
                fontFamily: "Roboto",
                fontSize: "18px",
                fontWeight: "400",
                lineHeight: "26px",
                textAlign: "center",
                paddingTop: "5px",
                paddingBottom: "15px"
              }}>
              Batteries included
              <br></br>
              No middleman required
            </div>
            <button
              style={{
                fontFamily: "Roboto",
                border: "1px solid white",
                backgroundColor: "Transparent",
                color: "white",
                fontSize: "12px",
                fontWeight: "400",
                width: "150px",
                height: "34px"
              }}
              onClick={() => {
                console.log("Clicking button");
                scrollToSignUp()
              }}
            >
              SIGN UP NOW
            </button>
          </div>
        )
      } else if (screenSize >= 650 && screenSize < 1000) {
        return (
          <div style={{paddingTop: "20px"}}>
            <div
              style={{
                fontFamily: "Roboto",
                fontSize: "48px",
                fontWeight: "400",
                lineHeight: "50px",
                textAlign: "center"}}>
              DIY ticketing
              <br></br>
              made easy
            </div>
            <div
              style={{
                fontFamily: "Roboto",
                fontSize: "16px",
                fontWeight: "400",
                lineHeight: "24px",
                textAlign: "center",
                paddingTop: "5px",
                paddingBottom: "15px"
              }}>
              Batteries included
              <br></br>
              No middleman required
            </div>
            <button
              style={{
                fontFamily: "Roboto",
                border: "1px solid white",
                backgroundColor: "Transparent",
                color: "white",
                fontSize: "11px",
                fontWeight: "400",
                width: "140px",
                height: "32px"
              }}
              onClick={() => {
                console.log("Clicking button");
                scrollToSignUp()
              }}
            >
              SIGN UP NOW
            </button>
          </div>
        ) 
      } else {
        return (
          <div style={{paddingLeft: "calc(50vw - 134px)", paddingTop: "10px"}}>
            <div
              style={{
                fontFamily: "Roboto, Helvetica, sans-serif",
                fontSize: "48px",
                fontWeight: "400",
                lineHeight: "50px",
                textAlign: "center"}}>
              DIY ticketing
              <br></br>
              made easy
            </div>
            <div
              style={{
                fontFamily: "Roboto, Helvetica, sans-serif",
                fontSize: "16px",
                fontWeight: "400",
                lineHeight: "24px",
                textAlign: "center",
                paddingTop: "5px",
                paddingBottom: "15px"
              }}>
              Batteries included
              <br></br>
              No middleman required
            </div>
            <button
              style={{
                fontFamily: "Roboto, Helvetica, sans-serif",
                border: "1px solid white",
                backgroundColor: "Transparent",
                color: "white",
                fontSize: "11px",
                fontWeight: "400",
                width: "140px",
                height: "32px"
              }}
              onClick={() => {
                console.log("Clicking button");
                scrollToSignUp()
              }}
            >
              SIGN UP NOW
            </button>
          </div>
        ) 
      }
    }




    let marketingPhrase = () => {
      if (screenSize <= 500) {
        //if (true) {
        return (
          <Fragment>
            <br></br>
            <div style={{fontSize: "28px", fontWeight: "400", lineHeight: "38px", paddingBottom: "10px"}}>
              What is
              <br></br>
              <span style={{fontWeight: "600", color: "#2F5596"}}>OPENSEATDIRECT</span>
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "400",
                lineHeight: "26px",
                paddingTop: "20px"
              }}>
                       A subscription-based DIY alternative
              <br></br>solution that eliminates traditional
              <br></br>ticketing middlemen allowing you to
              <br></br>interact directly with your fans and
              <br></br>control the entire ticketing process.
              <br></br>
            </div>
          </Fragment>
        ) 
      } else {
        return (
          <Fragment>
            <br></br>
            <div style={{fontSize: "30px", fontWeight: "400", lineHeight: "38px", paddingBottom: "10px"}}>
              What is{" "}<span style={{fontWeight: "600", color: "#2F5596"}}>OPENSEATDIRECT</span>
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "400",
                lineHeight: "26px",
                paddingTop: "20px"
              }}>
              
                       A subscription-based DIY alternative solution that
              <br></br>eliminates traditional ticketing middlemen
              <br></br>allowing you to interact directly with your fans and
              <br></br>control the entire ticketing process.
              <br></br>
            </div>
          </Fragment>
        ) 
      } 
    }

    let videoSection = () => (
      <div>
        <br></br>
        <div style={{fontSize: "30px", fontWeight: "400", lineHeight: "20px", paddingBottom: "30px"}}>
          Learn More
        </div>
        <div className={classes.VideoSection}>
            <YouTube videoId="gbR_440hyEM" opts={opts} onReady={_onReady} />
          </div>

      </div>
    )

    let testimonials = () => (
      <div>
        <br></br>
        <div style={{color: "black", fontSize: "30px", fontWeight: "400", lineHeight: "40px", paddingBottom: "30px"}}>
          Testimonials
        </div>

        <div style={{
          fontSize: "17px",
          textAlign: "center",
          color: "white"
        }}
        >
          Mike Salvi, HaHaForHire
        </div>
        <br></br>
        
        {screenSize <= 640 ? (
          <div
            style={{
              margin: "auto",
              width: "auto",
              fontSize: "20px",
              fontWeight: "400",
              lineHeight: "36px",
              textAlign: "center",
              color: "white",
              paddingLeft: "20px",
              paddingRight: "20px"
            }}
          >
            "OpenSeatDirect really helped when one of my events was unfortunately cancelled. Since I controlled the cash from ticket sales, I was able to quickly issue my ticket buyers a refund. This would not have happened with other ticketing systems. Priceless!"
          </div>
        ) : (
          <div
            style={{
              margin: "auto",
              width: "500px",
              fontSize: "20px",
              fontWeight: "400",
              lineHeight: "36px",
              textAlign: "center",
              color: "white"
            }}
          >
            "OpenSeatDirect really helped when one of my events was unfortunately cancelled. Since I controlled the cash from ticket sales, I was able to quickly issue my ticket buyers a refund. This would not have happened with other ticketing systems. Priceless!"
          </div>
        )
        }

        <div ref={signUpRef}></div>
        <br></br>
      </div>
    )

    let marketingPoints = () => {
      if (screenSize <= 800) {
        return (
          <Fragment>
            <br></br>
            <div style={{fontSize: "28px", fontWeight: "400", lineHeight: "20px", paddingBottom: "30px"}}>
              Our Advantages
            </div>
            <div
              style={{
                fontFamily: "Lato",
                color: "#2F5596",
                textAlign: "center",
                fontSize: "22px",
                fontWeight: "600",
                paddingBottom: "20px"
              }}>
                <div>Get Cash Now</div>
            </div>
  
            <img
                src={CashInHand}
                alt="OpenSeatDirect Logo"
                style={{width: "140px"}}
            />
            
            <div
              style={{
                fontFamily: "Lato",
                color: "#2F5596",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "16px"
              }}
            >
              Don't wait until after the
              <br></br>
              event passes. Get paid on
              <br></br>
              tickets you sell right away.
              <br></br>
              <br></br>
              <br></br>
            </div>

            <div
              style={{
                fontFamily: "Lato",
                color: "#2F5596",
                textAlign: "center",
                fontSize: "22px",
                fontWeight: "600",
                paddingBottom: "20px"
              }}>
                <div>ZERO Ticketing Fees</div>
            </div>

            
            <img
              src={ZeroFee}
              alt="OpenSeatDirect Logo"
              style={{width: "140px"}}
            />

            <div
              style={{
                fontFamily: "Lato",
                color: "#2F5596",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "16px"
              }}
            >
              We're not kidding.
              <br></br>
              You and your customers
              <br></br>
              NEVER pay any ticketing fees.
              <br></br>
              <br></br>
              <br></br>
            </div>

            <div
              style={{
                fontFamily: "Lato",
                color: "#2F5596",
                textAlign: "center",
                fontSize: "22px",
                fontWeight: "600",
                paddingBottom: "20px"
              }}
            >
              <div>Own All Your Data</div>
            </div>

            <img
                  src={Documents}
                  alt="OpenSeatDirect Logo"
                  style={{width: "140px"}}
              />

            <div
              style={{
                fontFamily: "Lato",
                color: "#2F5596",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "16px"
              }}
            >
              All transaction information
              <br></br>
              in one place: buyer emails,
              <br></br>
              transaction info and data.
              <br></br>
              <br></br>
              <br></br>
            </div>

            <div
              style={{
                fontFamily: "Lato",
                paddingLeft: "calc(50% - 360px)",
                fontSize: "16px"
              }}>
              <div></div>
              <div></div>
            </div>



          </Fragment>
        )
      } else if (screenSize > 800 && screenSize <= 900) {
        return (
          <Fragment>
            <br></br>
            <div style={{fontSize: "30px", fontWeight: "400", lineHeight: "20px", paddingBottom: "30px"}}>
              Our Advantages
            </div>
            <div
              className={classes.Grid}
              style={{
                fontFamily: "Lato",
                color: "#2F5596",
                paddingLeft: "calc(50% - 385px)",
                columnGap: "10px",
                fontSize: "22px",
                fontWeight: "600"
                }}>
                <div>Get Cash Now</div>
                <div>ZERO Ticketing Fees</div>
                <div>Own All Your Data</div>
            </div>
            <div
              className={classes.ImageGrid}
              style={{
                display: "grid",
                gridTemplateColumns: "140px 120px 140px 150px 140px",
                fontFamily: "Lato",
                paddingLeft: "calc(50% - 325px)",
                fontSize: "16px"
              }}>
  
              <img
                  src={CashInHand}
                  alt="OpenSeatDirect Logo"
                  style={{width: "100%"}}
              />
              <div></div>
              <img
                  src={ZeroFee}
                  alt="OpenSeatDirect Logo"
                  style={{width: "105%"}}
              />
              <div></div>
              <img
                  src={Documents}
                  alt="OpenSeatDirect Logo"
                  style={{width: "70%"}}
              />
            </div>
            <div
              className={classes.Grid}
              style={{
                fontFamily: "Lato",
                color: "#2F5596",
                fontWeight: "600",
                paddingLeft: "calc(50% - 385px)",
                columnGap: "10px",
                fontSize: "16px"
              }}>
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
          </Fragment>
        )
      } else {
        return (
          <Fragment>
            <br></br>
            <div style={{fontSize: "30px", fontWeight: "400", lineHeight: "20px", paddingBottom: "30px"}}>
              Our Advantages
            </div>
            <div
              className={classes.Grid}
              style={{
                fontFamily: "Lato",
                color: "#2F5596",
                paddingLeft: "calc(50vw - 415px)",
                width: "415px",
                columnGap: "40px",
                fontSize: "22px",
                fontWeight: "600"
              }}>
                <div>Get Cash Now</div>
                <div>ZERO Ticketing Fees</div>
                <div>Own All Your Data</div>
            </div>
            <div
              className={classes.ImageGrid}
              style={{
                display: "grid",
                gridTemplateColumns: "140px 150px 140px 180px 140px",
                fontFamily: "Lato",
                paddingLeft: "calc(50% - 360px)",
                fontSize: "16px"
              }}>
  
              <img
                  src={CashInHand}
                  alt="OpenSeatDirect Logo"
                  style={{width: "100%"}}
              />
              <div></div>
              <img
                  src={ZeroFee}
                  alt="OpenSeatDirect Logo"
                  style={{width: "105%"}}
              />
              <div></div>
              <img
                  src={Documents}
                  alt="OpenSeatDirect Logo"
                  style={{width: "70%"}}
              />
            </div>
            <div
              className={classes.Grid}
              style={{
                fontFamily: "Lato", 
                color: "#2F5596",
                fontWeight: "600",
                paddingLeft: "calc(50% - 415px)",
                columnGap: "40px",
                fontSize: "16px"
              }}>
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
          </Fragment>
        )
      }
    }

    let signUpText = () => {
      if (screenSize >= 1050) {
        return (
          <div style={{fontSize: "22px", fontWeight: "600", lineHeight: "52px"}}>
            Sign up for a free trial or a subscription for as low as $7 a month.
          </div>
        ) 
      } else if (screenSize >= 900 && screenSize < 1050) {
        return (
          <div style={{fontSize: "22px", fontWeight: "600", lineHeight: "32px"}}>
            Sign up for a free trial or a subscription for as low as $7 a month.
          </div>
        )
      } else if (screenSize >= 650 && screenSize < 900) {
        return (
          <div style={{fontSize: "22px", fontWeight: "600", lineHeight: "36px"}}>
            Sign up for a free trial or a
            <br></br>
            subscription for as low as $7 a month.
          </div>
        )
      } else {
        return (
          <div style={{fontSize: "20px", fontWeight: "600", lineHeight: "30px"}}>
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
          <div style={{fontSize: "14px", color: "red"}}> {sysmessage}</div>
        )
      } else if (data.status) {
        return (
          null
        )
      } else {
        return (
          <div style={{fontSize: "14px", color: "red"}}> {data.error}</div>
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
        <div style={{paddingBottom: "20px"}}>
          <label style={{width: "340px", fontSize: "15px", color: "black"}}>
            Full Name{" "}<span style={{color: "red"}}>*</span>
          </label>
          <input
            type="text"
            name="name"
            className={classes.InputBox}
            onChange={handleChange}
            value={name}
          />
        </div>
  
        <div style={{paddingBottom: "20px"}}>
          <label style={{width: "340px", fontSize: "15px", color: "black"}}>
            E-mail Addresss{" "}<span style={{color: "red"}}>*</span>
          </label>
          <input
            type="email"
            name="email"
            className={classes.InputBox}
            onChange={handleChange}
            value={email}
          />
        </div>
  
        <div style={{paddingBottom: "20px"}}>
          <label style={{width: "340px", fontSize: "15px", color: "black"}}>
            Password{" "}<span style={{color: "red"}}>*</span>
          </label>
          <input
            type="text"
            name="password"
            className={classes.InputBox}
            onChange={handleChange}
            value={password}
            placeholder="Min 8 characters, must include one number"
          />
        </div>
  
        <div style={{paddingTop: "20px"}}>
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
                vendorIntent: true
              })
            }}
              className={classes.SubmitButton}
              >
            CREATE YOUR ACCOUNT
          </button>
        </div>
      </Aux>
    );

    const signupDisplay = () => {
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
            <div className={classes.DescriptionText}>
              {signUpText()}
            </div>
            <div className={classes.SignUpForm}>
              {showError()}
              {signUpForm}
            </div>
          </div>
        )
      }
    }

    let appointmentText = () => {
      if (screenSize >= 1050) {
        return (
          <div style={{fontSize: "22px", fontWeight: "600", lineHeight: "36px"}}>
          Talk one-on-one with an onboarding specialist
          </div>
        ) 
      } else if (screenSize >= 900 && screenSize < 1050) {
        return (
          <div style={{fontSize: "22px", fontWeight: "600", lineHeight: "32px"}}>
          Talk one-on-one with an onboarding specialist
          </div>
        )
      } else if (screenSize >= 650 && screenSize < 900) {
        return (
          <div style={{fontSize: "22px", fontWeight: "600", lineHeight: "36px"}}>
            Talk one-on-one with 
            <br></br>
            an onboarding specialist
          </div>
        )
      } else {
        return (
          <div style={{fontSize: "20px", fontWeight: "600", lineHeight: "30px"}}>
          Talk one-on-one with 
          <br></br>
          an onboarding specialist
          </div>
        )
      }
    }

    const appointmentDisplay = (
      <Fragment>
        <div className={classes.DescriptionText}>
        {appointmentText()}
        </div>
        <br></br>
        <button
          className={classes.SubmitButton}
          href="https://calendly.com/dahday/openseatdirect-connect?back=1&month=2020-10">
          SCHEDULE AN APPOINTMENT
        </button>
      </Fragment>
    )

    const topImage = () => {
      if (screenWidth >= 1200) {
        return (
          <div
            className={classes.TopContainerLarge}
          >
            <div className={classes.TagLineText}
              style={{position: "absolute", paddingLeft: "40px", paddingTop: "20px"}}>
              {tagLines()}
            </div>
            <div>
              <img style={{maxWidth: "1200px", position: "absolute"}} src={DJGirl}/>
            </div>
          </div>
        )
      } else if (screenWidth >= 900) {
        return (
          <div
            className={classes.TopContainerLarge}
          >
            <div className={classes.TagLineText}
              style={{position: "absolute", paddingLeft: "40px", paddingTop: "20px"}}>
              {tagLines()}
            </div>
            <div>
              <img style={{maxWidth: "100%", position: "absolute"}} src={DJGirl}/>
            </div>
          </div>
        )
      } else if (screenWidth >= 650)  {
        return (
          <div
            className={classes.TopContainerLarge}
          >
            <div className={classes.TagLineText}
              style={{position: "absolute", paddingLeft: "40px", paddingTop: "20px"}}>
              {tagLines()}
            </div>
            <div>
              <img style={{height: "440px", position: "absolute"}} src={DJGirl}/>
            </div>
          </div>
        )
      } else {
        return (
          <div
            className={classes.TopContainerLarge}
          >
            <div className={classes.TagLineText}
              style={{position: "absolute", paddingTop: "20px"}}>
              {tagLines()}
            </div>
            <div>
              <img style={{maxWidth: "100%", position: "absolute"}} src={DJGirlShort}/>
            </div>
          </div>
        )
      }
    }

    return (
      <div className={classes.MainContainer}>
        {isResizing ? null : (
          <div>
            <div className={classes.TextContainer}>
              <div className={classes.DescriptionText}>
                {marketingPhrase()}
              </div>
              
              <div className={classes.SectionContainer}>
                {marketingPoints()}
              </div>

              

              <div
                className={classes.SectionContainer}
                style={{paddingBottom: "60px"}}
              >
                {videoSection()}
              </div>

              <div
                className={classes.SectionContainer}
                style={{backgroundColor: "#2F5596"}}
              >
                {testimonials()}
              </div>

              <div
                className={classes.SectionContainer}
                style={{backgroundColor: "white"}}
              >
                {signupDisplay()}
              </div>

              <div
                className={classes.SectionContainer}
                style={{backgroundColor: "white"}}
              >
                {appointmentDisplay}
              </div>
            </div>
          </div>
        )}
      </div>
    )
}

export default Home;
/*

    return (
      <div className={classes.MainContainer}>
        {isResizing ? null : (
          <div>
            {topImage()}
            <div className={classes.TextContainer}>
              <div className={classes.DescriptionText}>
                {marketingPhrase()}
              </div>
              
              <div className={classes.SectionContainer}>
                {marketingPoints()}
              </div>
              

              <div
                className={classes.SectionContainer}
                style={{paddingBottom: "60px"}}
              >
                {videoSection()}
              </div>

        <div
          className={classes.SectionContainer}
          style={{backgroundColor: "#2F5596"}}
        >
          {testimonials()}

          
          <div style={{
            fontSize: "17px",
            textAlign: "center",
            color: "white"
          }}
          >
            Mike Salvi, HaHaForHire
          </div>
          <br></br>
          <div
            style={{
              margin: "auto",
              width: "700px",
              fontSize: "24px",
              fontWeight: "400",
              lineHeight: "36px",
              textAlign: "center",
              color: "white",
              paddingLeft: "30px",
              paddingRight: "30px"
            }}
          >
            "OpenSeatDirect really helped when one of my events was unfortunately cancelled. Since I controlled the cash from ticket sales, I was able to quickly issue my ticket buyers a refund. This would not have happened with other ticketing systems. Priceless!"
          </div>
          
          <div ref={signUpRef}></div>
          <br></br>
        </div>
            </div>
          </div>
        )}

        <div
          className={classes.SectionContainer}
          style={{backgroundColor: "white"}}
          //#E2EDFA
        >
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
        
      <div
        className={classes.SectionContainer}
        style={{backgroundColor: "white"}}
        //#ECF7FE
      >
        <div className={classes.DescriptionText}>
          {appointment()}
        </div>
        <br></br>
        <button
          style={{
            border: "1px solid black",
            backgroundColor: "#2F5596",
            color: "#fff",
            fontSize: "14px",
            width: "340px",
            height: "40px",
            fontWeight: "500"
            }}
          href="https://calendly.com/dahday/openseatdirect-connect?back=1&month=2020-10">
          SCHEDULE AN APPOINTMENT
        </button>
        <br></br>
        <br></br>
      </div>




      <div
      className={classes.SectionContainer}
      style={{backgroundColor: "#0B1423"}}
      >
        <div className={classes.Header}>
          <a>
            <FontAwesomeIcon className={classes.faFacebook} icon={faFacebook} />
          </a>
          <a href="https://www.youtube.com/channel/UCTC0aLCktp-DoI_FSmp_b4w/videos">
            <FontAwesomeIcon className={classes.faYoutube} icon={faYoutube} />
          </a>
          <a href="https://twitter.com/openseatdirect">
            <FontAwesomeIcon className={classes.faTwitter} icon={faTwitter} />
          </a>
          <a href="https://www.instagram.com/openseatdirect/">
            <FontAwesomeIcon className={classes.faInstagram} icon={faInstagram} />
          </a>
        </div>
        <br></br>
        <div className={classes.CopyRight} style={{color: "white"}}>Copyright &copy; 2019 OpenSeatDirect LLC | All Rights Reserved</div>
      </div>


      </div>
    )

*/