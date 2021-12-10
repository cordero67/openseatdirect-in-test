import React, { useState, useEffect, Fragment } from "react";

import Backdrop from "./Modals/Backdrop";
import classes from "./TicketSelectionModal.module.css";

let MainContainer = {};
let MainContainer2 = {
  fontFamily: "'Roboto', sans-serif",
  position: "fixed",
  zIndex: "700",
  backgroundColor: `white`,
  border: "2px solid #ccc",
  height: "700px",
  //top: `calc((${inHeight}px - 720px) / 2)`,
  //left: `calc((${inWidth}px - 1080px) / 2)`,
  top: "calc((100vh - 720px) / 2)",
  left: "calc((100vw - 1080px) / 2)",
  //paddingLeft: `25px`,
  //paddingRight: `25px`,
  //paddingBottom: `calc((${inHeight}px - 720px) / 2)`,
  boxSizing: "border-box",
  transition: "all 0.3s ease-out",
};

const TicketSelectionModal = (props) => {
  const [isRestyling, setIsRestyling] = useState(false); // defines styling variables
  const [display, setDisplay] = useState("main"); // defines panel displayed: main, registration, spinner, confirmation, connection
  const [showDoublePane, setShowDoublePane] = useState(false); // defines single or double panel display on main page
  const [showOrderSummaryOnly, setShowOrderSummaryOnly] = useState(false); // defines panel display for a single panel display on main page

  useEffect(() => {
    //eventData(queryString.parse(window.location.search).eventID);
    stylingUpdate(window.innerWidth, window.innerHeight);
  }, []);

  window.onresize = function (event) {
    stylingUpdate(window.innerWidth, window.innerHeight);
  };
  // LOOKS GOOD
  const stylingUpdate = (inWidth, inHeight) => {
    setIsRestyling(true);
    if (inWidth < 790) {
      //setShowDoublePane(false);
    } else {
      //setShowDoublePane(true);
    }
    // sets styling parameters
    MainContainer = MainContainerStyling(inWidth, inHeight);
    //MainGrid = MainGridStyling(inWidth, inHeight);
    //EventTicketSection = EventTicketSectionStyling(inWidth, inHeight);
    //OrderSummarySection = OrderSummarySectionStyling(inWidth, inHeight);
    //OrderSummarySectionAlt = OrderSummarySectionAltStyling(inWidth, inHeight);
    setIsRestyling(false);
  };

  const MainContainerStyling = (inWidth, inHeight) => {
    if (inWidth < 660) {
      console.log("width < 660");
      MainContainer = {
        fontFamily: "'Roboto', sans-serif",
        position: "fixed",
        zIndex: "700",
        backgroundColor: `white`,
        //border: "2px solid #ccc",
        border: "2px solid red",
        height: `${inHeight}px`,
        //paddingTop: `0px`,
        //paddingLeft: `0px`,
        //paddingRight: `0px`,
        //paddingBottom: `0px`,
        boxSizing: "border-box",
        transition: "all 0.3s ease-out",
      };
    } else if (inHeight < 700) {
      console.log("height < 700");
      MainContainer = {
        fontFamily: "'Roboto', sans-serif",
        position: "fixed",
        zIndex: "700",
        backgroundColor: `white`,
        //border: "2px solid #ccc",
        border: "2px solid red",
        height: `${inHeight}px`,
        left: `calc((${inWidth}px - 1080px) / 2)`,
        //paddingTop: `0px`,
        //paddingLeft: `25px`,
        //paddingRight: `25px`,
        //paddingBottom: `0px`,
        boxSizing: "border-box",
        transition: "all 0.3s ease-out",
      };
    } else {
      console.log("width > 700");
      MainContainer = {
        fontFamily: "'Roboto', sans-serif",
        position: "fixed",
        zIndex: "700",
        backgroundColor: `white`,
        //border: "2px solid #ccc",
        border: "2px solid red",
        height: "700px",
        top: `calc((${inHeight}px - 720px) / 2)`,
        left: `calc((${inWidth}px - 1080px) / 2)`,
        //paddingLeft: `25px`,
        //paddingRight: `25px`,
        //paddingBottom: `calc((${inHeight}px - 720px) / 2)`,
        boxSizing: "border-box",
        transition: "all 0.3s ease-out",
      };
    }

    /*
      .MainContainer {
        //font-family: "'Roboto', sans-serif";
        //position: fixed;
        //z-index: 700;
        //background-color: white;
        //border: 2px solid #ccc;
        //height: 700px;
        width: 1080px;
        top: calc((100vh - 700px) / 2);
        left: calc((100vw - 1080px) / 2);
        //box-sizing: border-box;
        //transition: all 0.3s ease-out;
      }
    */

    return MainContainer;
  };

  const ticketPane = () => {
    return <div>ticket pane</div>;
  };
  const orderPane = () => {
    return <div>order pane</div>;
  };

  const MainGrid = {
    backgroundColor: `#fff`,
    margin: `auto`,
    height: `720px`,
    width: `1080px`,
    display: `grid`,
    gridTemplateColumns: `720px 360px`,
  };

  // LOOKS GOOD
  // defines main display with ticket and order panes
  const mainDisplay = () => {
    if (display === "main") {
      //if (showDoublePane) {
      if (true) {
        return (
          <div style={MainGrid}>
            {ticketPane()}
            {orderPane()}
          </div>
        );
        //} else if (!showOrderSummaryOnly) {
      } else if (true) {
        return <div style={MainGrid}>{ticketPane()}</div>;
      } else {
        return <div style={MainGrid}>{orderPane()}</div>;
      }
    } else return null;
  };

  return (
    <Fragment>
      <Backdrop show={true}></Backdrop>
      <div
        style={{
          transform: true ? "translateY(0)" : "translateY(-100vh)",
          opacity: true ? "1" : "0",
        }}
        style={MainContainer}
      >
        {mainDisplay()}
      </div>
    </Fragment>
  );
};

export default TicketSelectionModal;
