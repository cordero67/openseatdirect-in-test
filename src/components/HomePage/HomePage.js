import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import YouTube from "react-youtube";

import AuthenticationModal from "../../TicketPurchases/Modals/AuthenticationModal";

import { useOurApi } from "./apiUsers";
import { API } from "../../config";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faFacebook,
  faInstagram,
  faYoutube,
<<<<<<< HEAD
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

import AfroGirlShort from "../../assets/KobeShort.jpg";
=======
  faTwitter
} from "@fortawesome/free-brands-svg-icons";

import AfroGirlShort from "../../assets/KobeShort.jpg"
>>>>>>> master

//import DemoCarousel from "./DemoCarousel.js";

import CashInHand from "../../assets/CashInHand.png";
import ZeroFee from "../../assets/ZeroFee.png";
<<<<<<< HEAD
import OSDImage from "../../assets/OpenSeatDirect/BlueLettering_TransparentBackground_1024.png";
import DataLock from "../../assets/DataLock.png";
=======
import OSDImage from "../../assets/OpenSeatDirect/BlueLettering_TransparentBackground_1024.png"
import DataLock from "../../assets/DataLock.png"
>>>>>>> master

import classes from "./HomePage.module.css";

const Home = () => {
  const [isResizing, setIsResizing] = useState(false);
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const [modalStatus, setModalStatus] = useState(false);

  const [values, setValues] = useState({
    name: "",
    email: "",
<<<<<<< HEAD
    password: "",
  });

  const { name, email, password } = values;

  const [youTubeDimensions, setYouTubeDimensions] = useState({
    width: "640",
    height: "360",
  });

  const _onReady = (event) => {
=======
    password: ""
  });

  const { name, email, password } = values;
  
  const [youTubeDimensions, setYouTubeDimensions] = useState({
    width: "640",
    height: "360"
  });

  const _onReady = event => {
>>>>>>> master
    event.target.pauseVideo();
  };

  const resetOpts = (newWidth, newHeight) => {
    //setIsRestyling(true);
    setYouTubeDimensions({
      width: newWidth,
<<<<<<< HEAD
      height: newHeight,
=======
      height: newHeight
>>>>>>> master
    });
    opts = {
      width: youTubeDimensions.width,
      height: youTubeDimensions.height,
      playerVars: {
        autoplay: 0,
        start: 0,
        playsinline: 1,
        modestbranding: 1,
<<<<<<< HEAD
        rel: 0,
      },
=======
        rel: 0
      }
>>>>>>> master
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
<<<<<<< HEAD
      rel: 0,
    },
  };

  let myHeaders = new Headers();
=======
      rel: 0
    }
  };

  let  myHeaders = new Headers();
>>>>>>> master
  myHeaders.append("Content-Type", "application/json");

  const url1 = `${API}/signup`;
  const method1 = "POST";
<<<<<<< HEAD
  const body1 = null;
  const initialData1 = { status: true, message: "hi first time" };

  const {
    isLoading,
    hasError,
    setUrl,
    setBody,
    data,
    networkError,
  } = useOurApi(method1, url1, myHeaders, body1, initialData1);

  const sysmessage = networkError
    ? "NetworkError...please check your connectivity"
    : "SYSTEM ERROR - please try again";

  const stylingUpdate = (inWidth) => {
    console.log("stylingUpdate");
=======
  const body1  = null;
  const initialData1 ={status: true, message:"hi first time"};
  
  const { isLoading, hasError, setUrl, setBody, data, networkError} = useOurApi(method1, url1,myHeaders,body1, initialData1);

  const sysmessage = networkError ? "NetworkError...please check your connectivity" : "SYSTEM ERROR - please try again";

  const stylingUpdate = (inWidth) => {
    console.log("stylingUpdate")
>>>>>>> master
    setIsResizing(true);
    setScreenSize(inWidth);
    setScreenWidth(inWidth);
    setIsResizing(false);
<<<<<<< HEAD
    console.log("screenSize: ", screenSize);
  };

  useEffect(() => {
    console.log("screen width: ", window.innerWidth);
    stylingUpdate(window.innerWidth);
  }, []);

  window.onresize = function (event) {
    console.log("resized");
=======
    console.log("screenSize: ", screenSize)
  };

  useEffect(() => {
    console.log("screen width: ", window.innerWidth)
    stylingUpdate(window.innerWidth);
  }, []);
  
  window.onresize = function(event) {
    console.log("resized")
>>>>>>> master
    stylingUpdate(window.innerWidth);
    let width;
    let height;
    if (window.innerWidth < 330) {
<<<<<<< HEAD
      console.log("resized");
=======
      console.log("resized")
>>>>>>> master
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
<<<<<<< HEAD
      [event.target.name]: event.target.value,
    });
  };

  const getStatus = (user) => {
    if ("accountId" in user && "status" in user.accountId) {
      return user.accountId.status;
    } else {
      return 0;
    }
  };

  const redirectUser = () => {
    console.log("Redirect user");
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("user") !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      if (getStatus(tempUser.user) === 7 || getStatus(tempUser.user) === 8) {
=======
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

    
  const getStatus= (user) => { 
    if ('accountId' in user && 'status' in user.accountId ) {
        return user.accountId.status
    } else {
        return 0;
    } 
  }

   const redirectUser = () => {
    console.log("Redirect user");
    if (typeof window !== "undefined" && localStorage.getItem("user") !== null) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      if (getStatus(tempUser.user) === 7 || getStatus(tempUser.user) === 8) {  
>>>>>>> master
        window.location.href = "/vendor";
      } else if (
        getStatus(tempUser.user) === 4 ||
        getStatus(tempUser.user) === 5 ||
        getStatus(tempUser.user) === 6 ||
        ("vendorIntent" in tempUser.user && tempUser.user.vendorIntent === true)
      ) {
        window.location.href = "/personal";
      } else {
        window.location.href = "/events";
      }
    }
<<<<<<< HEAD
  };
=======
  }

>>>>>>> master

  const signUpRef = React.useRef();
  //const videosRef = React.useRef();

  const scrollToSignUp = () => {
<<<<<<< HEAD
    console.log("Inside scrollToSignUp");
    signUpRef.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  let tagLines = () => {
    if (screenWidth >= 1100) {
      return (
        <div style={{ paddingTop: "20px" }}>
          <div
            style={{
              fontFamily: "Roboto",
              fontSize: "58px",
              fontWeight: "400",
              lineHeight: "72px",
              textAlign: "center",
              paddingBottom: "25px",
            }}
          >
            Events
            <br></br>
            made easy
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
              height: "40px",
            }}
            onClick={() => {
              console.log("Clicking button");
              setModalStatus(true);
            }}
          >
            SIGN UP NOW
          </button>
        </div>
      );
    } else if (screenSize >= 1000 && screenSize < 1100) {
      return (
        <div style={{ paddingTop: "20px" }}>
          <div
            style={{
              fontFamily: "Roboto",
              fontSize: "52px",
              fontWeight: "400",
              lineHeight: "66px",
              textAlign: "center",
              paddingBottom: "25px",
            }}
          >
            Events
            <br></br>
            made easy
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
              height: "34px",
            }}
            onClick={() => {
              console.log("Clicking button");
              setModalStatus(true);
            }}
          >
            SIGN UP NOW
          </button>
        </div>
      );
    } else if (screenSize >= 650 && screenSize < 1000) {
      return (
        <div style={{ paddingTop: "20px" }}>
          <div
            style={{
              fontFamily: "Roboto",
              fontSize: "48px",
              fontWeight: "400",
              lineHeight: "50px",
              textAlign: "center",
              paddingBottom: "25px",
            }}
          >
            Events
            <br></br>
            made easy
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
              height: "32px",
            }}
            onClick={() => {
              console.log("Clicking button");
              setModalStatus(true);
            }}
          >
            SIGN UP NOW
          </button>
        </div>
      );
    } else if (screenSize >= 450 && screenSize < 650) {
      return (
        <div style={{ paddingLeft: "calc(50vw - 97px)", paddingTop: "10px" }}>
          <div
            style={{
              fontFamily: "Roboto, Helvetica, sans-serif",
              fontSize: "48px",
              fontWeight: "400",
              lineHeight: "50px",
              textAlign: "center",
              paddingBottom: "25px",
            }}
          >
            Events
            <br></br>
            made easy
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
              height: "32px",
            }}
            onClick={() => {
              console.log("Clicking button");
              setModalStatus(true);
            }}
          >
            SIGN UP NOW
          </button>
        </div>
      );
    } else {
      return (
        <div style={{ paddingLeft: "calc(50vw - 97px)", paddingTop: "0px" }}>
          <div
            style={{
              fontFamily: "Roboto, Helvetica, sans-serif",
              fontSize: "40px",
              fontWeight: "400",
              lineHeight: "42px",
              textAlign: "center",
              paddingBottom: "25px",
            }}
          >
            Events
            <br></br>
            made easy
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
              height: "32px",
            }}
            onClick={() => {
              console.log("Clicking button");
              setModalStatus(true);
            }}
          >
            SIGN UP NOW
          </button>
        </div>
      );
    }
  };

  let marketingPhrase = () => {
    if (screenSize <= 500) {
      //if (true) {
      return (
        <Fragment>
          <br></br>
          <div
            style={{
              fontSize: "28px",
              fontWeight: "400",
              lineHeight: "38px",
              paddingBottom: "10px",
            }}
          >
            What is <br></br>
            <span style={{ fontWeight: "600", color: "#2F5596" }}>
              OPEN SEAT DIRECT
            </span>
            <span style={{ fontWeight: "600" }}>?</span>
          </div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "400",
              lineHeight: "26px",
              paddingTop: "20px",
            }}
          >
            A DIY alternative solution that allows
            <br></br>event creators and promoters stuck with
            <br></br>money-grabbing ticket platforms to
            <br></br>get cash deposits at the time of sale
            <br></br>and eliminate customer fees.
            <br></br>
          </div>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <br></br>
          <div
            style={{
              fontSize: "30px",
              fontWeight: "400",
              lineHeight: "38px",
              paddingBottom: "10px",
            }}
          >
            What is{" "}
            <span style={{ fontWeight: "600", color: "#2F5596" }}>
              OPEN SEAT DIRECT
            </span>
            <span style={{ fontWeight: "600" }}>?</span>
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: "400",
              lineHeight: "26px",
              paddingTop: "20px",
            }}
          >
            A DIY alternative solution that allows
            <br></br>event creators and promoters stuck with
            <br></br>money-grabbing ticket platforms to
            <br></br>get cash deposits at the time of sale
            <br></br>and eliminate customer fees.
          </div>
        </Fragment>
      );
    }
  };

  let ourClients = () => {
    if (screenSize <= 700) {
      //if (true) {
      return (
        <Fragment>
          <br></br>
          <div
            style={{
              fontSize: "28px",
              fontWeight: "400",
              lineHeight: "20px",
              paddingBottom: "30px",
            }}
          >
            Our Clients
          </div>
          <div style={{ textAlign: "center" }}>
            <img
              src="https://static.wixstatic.com/media/d66757_afa3532ae942431b912f7311fe6401ed~mv2.jpg/v1/fill/w_399,h_135,al_c,lg_1,q_80/Aspira%20nj%20logo.webp"
              style={{ width: "200px" }}
            />
            <br></br>
            <br></br>
            <img
              src="https://storage.googleapis.com/ff-storage-p01/festivals/logos/000/003/681/large/OfficialSelectionPIFF.jpg?1460061339"
              style={{ width: "130px" }}
            />
            <br></br>
            <br></br>
            <img
              src="https://ncjar.com/templates/t3-ncjar/img/theme/ncjar-logo-5-x2.png"
              style={{ width: "200px" }}
            />
          </div>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <br></br>
          <div
            style={{
              fontSize: "30px",
              fontWeight: "400",
              lineHeight: "38px",
              paddingBottom: "10px",
            }}
          >
            Our Clients
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "230px 140px 220px",
              columnGap: "20px",
              paddingLeft: "calc((100vw - 630px)/2)",
              paddingRight: "calc((100vw - 630px)/2)",
            }}
          >
            <div
              style={{
                textAlign: "left",
                paddingTop: "30px",
              }}
            >
              <img
                src="https://static.wixstatic.com/media/d66757_afa3532ae942431b912f7311fe6401ed~mv2.jpg/v1/fill/w_399,h_135,al_c,lg_1,q_80/Aspira%20nj%20logo.webp"
                style={{ width: "200px" }}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <img
                src="https://storage.googleapis.com/ff-storage-p01/festivals/logos/000/003/681/large/OfficialSelectionPIFF.jpg?1460061339"
                style={{ width: "130px" }}
              />
            </div>
            <div style={{ textAlign: "right", paddingTop: "40px" }}>
              <img
                src="https://ncjar.com/templates/t3-ncjar/img/theme/ncjar-logo-5-x2.png"
                style={{ width: "200px" }}
              />
            </div>
          </div>
        </Fragment>
      );
    }
  };

  let videoSection = () => (
    <div>
      <br></br>
      <div
        style={{
          fontSize: "30px",
          fontWeight: "400",
          lineHeight: "20px",
          paddingBottom: "30px",
        }}
      >
        Learn More
      </div>
      <div className={classes.VideoSection}>
        <YouTube videoId="gbR_440hyEM" opts={opts} onReady={_onReady} />
      </div>
    </div>
  );

  let testimonials = () => (
    <div>
      <br></br>
      <div
        style={{
          color: "#000",
          fontSize: "30px",
          fontWeight: "400",
          lineHeight: "40px",
          paddingBottom: "30px",
        }}
      >
        Testimonials
      </div>

      <div
        style={{
          fontSize: "17px",
          textAlign: "center",
          color: "white",
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
            paddingRight: "20px",
          }}
        >
          "I like that I'm in control. Since I controlled the cash from ticket
          sales, I was able to quickly issue my ticket buyers a refund when one
          of my events was unfortunately cancelled. This would not have happened
          with other ticketing systems. Priceless!"
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
            color: "white",
          }}
        >
          "I like that I'm in control. Since I controlled the cash from ticket
          sales, I was able to quickly issue my ticket buyers a refund when one
          of my events was unfortunately cancelled. This would not have happened
          with other ticketing systems. Priceless!"{" "}
        </div>
      )}

      <div ref={signUpRef}></div>
      <br></br>
    </div>
  );

  let marketingPoints = () => {
    if (screenSize <= 800) {
      return (
        <Fragment>
          <br></br>
          <div
            style={{
              fontSize: "28px",
              fontWeight: "400",
              lineHeight: "20px",
              paddingBottom: "30px",
            }}
          >
            Our Advantages
          </div>
          <div
            style={{
              fontFamily: "Lato",
              color: "#2F5596",
              textAlign: "center",
              fontSize: "22px",
              fontWeight: "600",
              paddingBottom: "20px",
            }}
          >
            <div>Get Cash Now</div>
          </div>

          <img
            src={CashInHand}
            alt="OpenSeatDirect Logo"
            style={{ width: "140px" }}
          />

          <div
            style={{
              fontFamily: "Lato",
              color: "#2F5596",
              textAlign: "center",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            Don't wait until after the
            <br></br>
            event passes. IMMEDIATELY
            <br></br>
            get paid on tickets you sell.
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
              paddingBottom: "20px",
            }}
          >
            <div>ZERO Ticketing Fees</div>
          </div>

          <img
            src={ZeroFee}
            alt="OpenSeatDirect Logo"
            style={{ width: "140px" }}
          />

          <div
            style={{
              fontFamily: "Lato",
              color: "#2F5596",
              textAlign: "center",
              fontWeight: "600",
              fontSize: "16px",
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
              paddingBottom: "20px",
            }}
          >
            <div>Own All Your Data</div>
          </div>

          <img
            src={DataLock}
            alt="OpenSeatDirect Logo"
            style={{ width: "150px", paddingLeft: "10px" }}
          />

          <div
            style={{
              fontFamily: "Lato",
              color: "#2F5596",
              textAlign: "center",
              fontWeight: "600",
              fontSize: "16px",
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
              fontSize: "16px",
            }}
          >
            <div></div>
            <div></div>
          </div>
        </Fragment>
      );
    } else if (screenSize > 800 && screenSize <= 900) {
      return (
        <Fragment>
          <br></br>
          <div
            style={{
              fontSize: "30px",
              fontWeight: "400",
              lineHeight: "20px",
              paddingBottom: "30px",
            }}
          >
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
              fontWeight: "600",
            }}
          >
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
              fontSize: "16px",
            }}
          >
            <img
              src={CashInHand}
              alt="OpenSeatDirect Logo"
              style={{ width: "100%" }}
            />
            <div></div>
            <img
              src={ZeroFee}
              alt="OpenSeatDirect Logo"
              style={{ width: "105%" }}
            />
            <div></div>
            <img
              src={DataLock}
              alt="OpenSeatDirect Logo"
              style={{ width: "85%" }}
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
              fontSize: "16px",
            }}
          >
            <div>
              Don't wait until after the
              <br></br>
              event passes. IMMEDIATELY
              <br></br>
              get paid on tickets you sell.
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
      );
    } else {
      return (
        <Fragment>
          <br></br>
          <div
            style={{
              fontSize: "30px",
              fontWeight: "400",
              lineHeight: "20px",
              paddingBottom: "30px",
            }}
          >
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
              fontWeight: "600",
            }}
          >
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
              fontSize: "16px",
            }}
          >
            <img
              src={CashInHand}
              alt="OpenSeatDirect Logo"
              style={{ width: "100%" }}
            />
            <div></div>
            <img
              src={ZeroFee}
              alt="OpenSeatDirect Logo"
              style={{ width: "105%" }}
            />
            <div></div>
            <img
              src={DataLock}
              alt="OpenSeatDirect Logo"
              style={{ width: "85%" }}
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
              fontSize: "16px",
            }}
          >
            <div>
              Don't wait until after the
              <br></br>
              event passes. IMMEDIATELY
              <br></br>
              get paid on tickets you sell.
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
      );
    }
  };

  let signUpText = () => {
    if (screenSize >= 1050) {
      return (
        <Fragment>
          <div
            style={{
              color: "#000",
              fontSize: "30px",
              fontWeight: "400",
              lineHeight: "40px",
              paddingBottom: "30px",
            }}
          >
            Create Your First Event
          </div>
          <div
            style={{
              color: "#000",
              fontSize: "22px",
              fontWeight: "400",
              lineHeight: "52px",
            }}
          >
            Sign up for a free trial or a subscription.
          </div>
        </Fragment>
      );
    } else if (screenSize >= 900 && screenSize < 1050) {
      return (
        <Fragment>
          <div
            style={{
              color: "#000",
              fontSize: "30px",
              fontWeight: "400",
              lineHeight: "40px",
              paddingBottom: "30px",
            }}
          >
            Create Your First Event
          </div>
          <div
            style={{
              color: "#000",
              fontSize: "22px",
              fontWeight: "600",
              lineHeight: "32px",
            }}
          >
            Sign up for a free trial or a subscription for as low as $7 a month.
          </div>
        </Fragment>
      );
    } else if (screenSize >= 650 && screenSize < 900) {
      return (
        <Fragment>
          <div
            style={{
              color: "#000",
              fontSize: "30px",
              fontWeight: "400",
              lineHeight: "40px",
              paddingBottom: "30px",
            }}
          >
            Create Your First Event
          </div>
          <div
            style={{
              color: "#000",
              fontSize: "22px",
              fontWeight: "600",
              lineHeight: "36px",
            }}
          >
            Sign up for a free trial or a<br></br>
            subscription for as low as $7 a month.
          </div>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <div
            style={{
              color: "#000",
              fontSize: "30px",
              fontWeight: "400",
              lineHeight: "40px",
              paddingBottom: "30px",
            }}
          >
            Create Your First Event
          </div>
          <div
            style={{
              color: "#000",
              fontSize: "20px",
              fontWeight: "600",
              lineHeight: "30px",
            }}
          >
            Sign up for a free trial or a<br></br>
            subscription for as low as $7 a month.
          </div>
        </Fragment>
      );
    }
  };

  let appointmentText = () => {
    if (screenSize >= 1050) {
      return (
        <div
          style={{
            color: "#000",
            fontSize: "22px",
            fontWeight: "400",
            lineHeight: "36px",
          }}
        >
          Talk one-on-one with an onboarding specialist
        </div>
      );
    } else if (screenSize >= 900 && screenSize < 1050) {
      return (
        <div
          style={{
            color: "#000",
            fontSize: "22px",
            fontWeight: "600",
            lineHeight: "32px",
          }}
        >
          Talk one-on-one with an onboarding specialist
        </div>
      );
    } else if (screenSize >= 650 && screenSize < 900) {
      return (
        <div
          style={{
            color: "#000",
            fontSize: "22px",
            fontWeight: "600",
            lineHeight: "36px",
          }}
        >
          Talk one-on-one with
          <br></br>
          an onboarding specialist
        </div>
      );
    } else {
      return (
        <div
          style={{
            color: "#000",
            fontSize: "20px",
            fontWeight: "600",
            lineHeight: "30px",
          }}
        >
          Talk one-on-one with
          <br></br>
          an onboarding specialist
        </div>
      );
    }
  };

  const appointmentDisplay = (
    <Fragment>
      <div className={classes.DescriptionText}>{appointmentText()}</div>
      <br></br>
      <button
        className={classes.SubmitButton}
        onClick={() => {
          window.location.href =
            "https://calendly.com/dahday/openseatdirect-connect?back=1&month=2020-10";
        }}
      >
        SCHEDULE A DEMO
      </button>
    </Fragment>
  );

  const topImage = () => {
    if (screenWidth >= 1200) {
      return (
        <div className={classes.TopContainerLarge}>
          <div
            className={classes.TagLineText}
            style={{
              position: "absolute",
              paddingLeft: "40px",
              paddingTop: "20px",
            }}
          >
            {tagLines()}
          </div>
          <div>
            <img
              style={{ maxWidth: "1200px", position: "absolute" }}
              src={AfroGirlShort}
            />
          </div>
        </div>
      );
    } else if (screenWidth >= 900) {
      return (
        <div className={classes.TopContainerLarge}>
          <div
            className={classes.TagLineText}
            style={{
              position: "absolute",
              paddingLeft: "40px",
              paddingTop: "20px",
            }}
          >
            {tagLines()}
          </div>
          <div>
            <img
              style={{ maxWidth: "100%", position: "absolute" }}
              src={AfroGirlShort}
            />
          </div>
        </div>
      );
    } else if (screenWidth >= 650) {
      return (
        <div className={classes.TopContainerLarge}>
          <div
            className={classes.TagLineText}
            style={{
              position: "absolute",
              paddingLeft: "40px",
              paddingTop: "20px",
            }}
          >
            {tagLines()}
          </div>
          <div>
            <img
              style={{ height: "440px", position: "absolute" }}
              src={AfroGirlShort}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className={classes.TopContainerLarge}>
          <div
            className={classes.TagLineText}
            style={{ position: "absolute", paddingTop: "20px" }}
          >
            {tagLines()}
          </div>
          <div>
            <img
              style={{ maxWidth: "100%", position: "absolute" }}
              src={AfroGirlShort}
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div className={classes.MainContainer}>
      {isResizing ? null : (
        <div>
          {topImage()}
          <div className={classes.TextContainer}>
            <div className={classes.DescriptionText}>{marketingPhrase()}</div>

            <div className={classes.SectionContainer}>{marketingPoints()}</div>

            <div
              className={classes.SectionContainer}
              style={{ backgroundColor: "#2F5596" }}
            >
              {testimonials()}
            </div>

            <div
              className={classes.SectionContainer}
              style={{ backgroundColor: "#fff" }}
            >
              <div
                className={classes.DescriptionText}
                style={{ color: "#000" }}
              >
                {signUpText()}
              </div>
              <br></br>
              <button
                className={classes.SubmitButton}
                onClick={() => {
                  console.log("Clicking button");
                  setModalStatus(true);
                }}
              >
                SIGN UP NOW
              </button>
            </div>
            <div
              className={classes.SectionContainer}
              style={{ backgroundColor: "#fff" }}
            >
              {appointmentDisplay}
            </div>
          </div>
          <div
            className={classes.SectionContainer}
            style={{ backgroundColor: "#0B1423", color: "#fff" }}
          >
            <div className={classes.Header}>
              <a>
                <FontAwesomeIcon
                  className={classes.faFacebook}
                  icon={faFacebook}
                />
              </a>
              <a href="https://www.youtube.com/channel/UCTC0aLCktp-DoI_FSmp_b4w/videos">
                <FontAwesomeIcon
                  className={classes.faYoutube}
                  icon={faYoutube}
                />
              </a>
              <a href="https://twitter.com/openseatdirect">
                <FontAwesomeIcon
                  className={classes.faTwitter}
                  icon={faTwitter}
                />
              </a>
              <a href="https://www.instagram.com/openseatdirect/">
                <FontAwesomeIcon
                  className={classes.faInstagram}
                  icon={faInstagram}
                />
              </a>
            </div>
            <div className={classes.CopyRight} style={{ color: "white" }}>
              Copyright &copy; 2021 Open Seat Direct LLC | All Rights Reserved
            </div>
            <div>
              <button
                className={classes.Button}
                styles={{ border: "none", outline: "none" }}
                onClick={() => {
                  window.location.href = `/privacy-policy`;
                }}
              >
                Privacy Policy
              </button>
              |
              <button
                className={classes.Button}
                styles={{ border: "none", outline: "none" }}
                onClick={() => {
                  window.location.href = `/terms-and-conditions`;
                }}
              >
                Terms and Conditions
              </button>
            </div>
=======
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
                textAlign: "center",
                paddingBottom: "25px"
              }}>
              Events
              <br></br>
              made easy
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
                setModalStatus(true)
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
                textAlign: "center",
                paddingBottom: "25px"
              }}>
              Events
              <br></br>
              made easy
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
                setModalStatus(true)
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
                textAlign: "center",
                paddingBottom: "25px"
              }}>
              Events
              <br></br>
              made easy
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
                setModalStatus(true)
              }}
            >
              SIGN UP NOW
            </button>
          </div>
        )
      } else if (screenSize >= 450 && screenSize < 650) {
        return (
          <div style={{paddingLeft: "calc(50vw - 97px)", paddingTop: "10px"}}>
            <div
              style={{
                fontFamily: "Roboto, Helvetica, sans-serif",
                fontSize: "48px",
                fontWeight: "400",
                lineHeight: "50px",
                textAlign: "center",
                paddingBottom: "25px"
              }}>
              Events
              <br></br>
              made easy
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
                setModalStatus(true)
              }}
            >
              SIGN UP NOW
            </button>
          </div>
        ) 
      } else {
        return (
          <div style={{paddingLeft: "calc(50vw - 97px)", paddingTop: "0px"}}>
            <div
              style={{
                fontFamily: "Roboto, Helvetica, sans-serif",
                fontSize: "40px",
                fontWeight: "400",
                lineHeight: "42px",
                textAlign: "center",
                paddingBottom: "25px"
              }}>
              Events
              <br></br>
              made easy
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
                setModalStatus(true)
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
              event passes. IMMEDIATELY
              <br></br>
              get paid on tickets you sell.
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
              src={DataLock}
              alt="OpenSeatDirect Logo"
              style={{width: "150px", paddingLeft: "10px"}}
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
                  src={DataLock}
                  alt="OpenSeatDirect Logo"
                  style={{width: "85%"}}
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
                  event passes. IMMEDIATELY
                  <br></br>
                  get paid on tickets you sell.
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
                  src={DataLock}
                  alt="OpenSeatDirect Logo"
                  style={{width: "85%"}}
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
                  event passes. IMMEDIATELY
                  <br></br>
                  get paid on tickets you sell.
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
          onClick={() => {
            window.location.href = "https://calendly.com/dahday/openseatdirect-connect?back=1&month=2020-10";
          }}
          >
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
              <img style={{maxWidth: "1200px", position: "absolute"}} src={AfroGirlShort}/>
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
              <img style={{maxWidth: "100%", position: "absolute"}} src={AfroGirlShort}/>
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
              <img style={{height: "440px", position: "absolute"}} src={AfroGirlShort}/>
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
              <img style={{maxWidth: "100%", position: "absolute"}} src={AfroGirlShort}/>
            </div>
          </div>
        )
      }
    }

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
                style={{backgroundColor: "#2F5596"}}
              >
                {testimonials()}
              </div>

              <div
                className={classes.SectionContainer}
                style={{backgroundColor: "white"}}
              >
                <div className={classes.DescriptionText}>
                  {signUpText()}
                </div>
                <br></br>
                <button
                  className={classes.SubmitButton}
                  onClick={() => {
                    console.log("Clicking button");
                    setModalStatus(true)
                  }}
                >
                  SIGN UP NOW
                </button>

              </div>
              <div
                className={classes.SectionContainer}
                style={{backgroundColor: "white"}}
              >
                {appointmentDisplay}
              </div>
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
              <div className={classes.CopyRight} style={{color: "white"}}>Copyright &copy; 2021 Open Seat Direct LLC | All Rights Reserved</div>
            </div>
          </div>
        )}
        {modalStatus ?
          <AuthenticationModal
            show={modalStatus}
            zeroCart={false}
            start={"signup"}
            vendorIntent={true}
            closeModal={() => setModalStatus(false)}
            submit={() => {
              redirectUser()
            }}
          /> :
          null
        }
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
>>>>>>> master
          </div>
          
          <div ref={signUpRef}></div>
          <br></br>
        </div>
<<<<<<< HEAD
      )}
      {modalStatus ? (
        <AuthenticationModal
          show={modalStatus}
          zeroCart={false}
          start={"signup"}
          vendorIntent={true}
          closeModal={() => setModalStatus(false)}
          submit={() => {
            redirectUser();
          }}
        />
      ) : null}
    </div>
  );
};

export default Home;
=======
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
>>>>>>> master
