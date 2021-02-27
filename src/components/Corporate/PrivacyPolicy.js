import React, { useState, useEffect, Fragment } from "react";

import classes from "./Corporate.module.css";

const Privacy = () => {
  const [isResizing, setIsResizing] = useState(false);
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  
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
    //resetOpts(width, height);
  };

    let marketingPhrase = () => {
      if (screenSize <= 500) {
        //if (true) {
        return (
          <Fragment>
            <br></br>
            <div style={{fontSize: "28px", fontWeight: "400", lineHeight: "38px", paddingBottom: "10px"}}>
              What is{" "}
              <br></br>
              <span style={{fontWeight: "600", color: "#2F5596"}}>OPEN SEAT DIRECT</span>
              <span style={{fontWeight: "600"}}>?</span>
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "400",
                lineHeight: "26px",
                paddingTop: "20px"
              }}>
                      A DIY alternative solution that allows
              <br></br>event creators and promoters stuck with
              <br></br>money-grabbing ticket platforms to
              <br></br>get cash deposits at the time of sale
              <br></br>and eliminate customer fees.
              <br></br>
            </div>
          </Fragment>
        ) 
      } else {
        return (
          <Fragment>
            <br></br>
            <div style={{fontSize: "30px", fontWeight: "400", lineHeight: "38px", paddingBottom: "10px"}}>
            What is{" "}
            <span style={{fontWeight: "600", color: "#2F5596"}}>OPEN SEAT DIRECT</span>
              <span style={{fontWeight: "600"}}>?</span>
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "400",
                lineHeight: "26px",
                paddingTop: "20px"
              }}>
                      A DIY alternative solution that allows
              <br></br>event creators and promoters stuck with
              <br></br>money-grabbing ticket platforms to
              <br></br>get cash deposits at the time of sale
              <br></br>and eliminate customer fees.
            </div>
          </Fragment>
        ) 
      } 
    }

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
          Mike Salvi, HahaForHire
        </div>
        <br></br>
        
        {screenSize <= 640 ? (
          <div
            style={{
              margin: "auto",
              width: "100vw",
              fontSize: "20px",
              fontWeight: "400",
              lineHeight: "36px",
              textAlign: "center",
              color: "white",
              paddingLeft: "20px",
              paddingRight: "20px"
            }}
          >
            "I like that I'm in control. Since I controlled the cash from ticket sales, I was able to quickly issue my ticket buyers a refund when one of my events was unfortunately cancelled. This would not have happened with other ticketing systems. Priceless!"
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
            "I like that I'm in control. Since I controlled the cash from ticket sales, I was able to quickly issue my ticket buyers a refund when one of my events was unfortunately cancelled. This would not have happened with other ticketing systems. Priceless!"          </div>
        )
        }

        <br></br>
      </div>
    )



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


    return (
      <div className={classes.MainContainer}>
          Privacy Policy
      </div>
    )
}

export default Privacy;