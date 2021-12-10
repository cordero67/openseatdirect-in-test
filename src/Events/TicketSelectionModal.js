import React, { useState, useEffect, Fragment } from "react";

import Backdrop from "./Modals/Backdrop";
import classes from "./TicketSelectionModal.module.css";

const TicketSelectionModal = (props) => {
  const [isRestyling, setIsRestyling] = useState(false); // defines styling variables
  const [display, setDisplay] = useState("main"); // defines panel displayed: main, registration, spinner, confirmation, connection
  const [showDoublePane, setShowDoublePane] = useState(false); // defines single or double panel display on main page
  const [showOrderSummaryOnly, setShowOrderSummaryOnly] = useState(false); // defines panel display for a single panel display on main page
  const [mainContainer, setMainContainer] = useState({});
  const [mainGrid, setMainGrid] = useState({});
  const [eventTicketSection, setEventTicketSection] = useState({});

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
    //MainContainer = MainContainerStyling(inWidth, inHeight);
    setMainContainer(MainContainerStyling(inWidth, inHeight));
    //MainGrid = MainGridStyling(inWidth, inHeight);
    setMainGrid(MainGridStyling(inWidth, inHeight));
    //EventTicketSection = EventTicketSectionStyling(inWidth, inHeight);
    setEventTicketSection(EventTicketSectionStyling(inWidth, inHeight));
    //OrderSummarySection = OrderSummarySectionStyling(inWidth, inHeight);
    //OrderSummarySectionAlt = OrderSummarySectionAltStyling(inWidth, inHeight);
    setIsRestyling(false);
  };

  const MainContainerStyling = (inWidth, inHeight) => {
    let mainContainer = {};
    if (inWidth < 660) {
      console.log("width < 660");
      mainContainer = {
        fontFamily: "'Roboto', sans-serif",
        position: "fixed",
        zIndex: "700",
        backgroundColor: `white`,
        //border: "2px solid #ccc",
        //border: "2px solid purple",
        height: `${inHeight}px`,
        top: "0px",
        left: "0px",
        //paddingTop: `0px`,
        //paddingLeft: `0px`,
        //paddingRight: `0px`,
        //paddingBottom: `0px`,
        boxSizing: "border-box",
        transition: "all 0.3s ease-out",
      };
    } else if (inHeight < 720) {
      console.log("height < 720");
      mainContainer = {
        fontFamily: "'Roboto', sans-serif",
        position: "fixed",
        zIndex: "700",
        backgroundColor: `white`,
        //border: "2px solid #ccc",
        //border: "2px solid green",
        height: `${inHeight}px`,
        top: "0px",
        left: `calc((${inWidth}px - 1080px) / 2)`,
        //paddingTop: `0px`,
        //paddingLeft: `25px`,
        //paddingRight: `25px`,
        //paddingBottom: `0px`,
        boxSizing: "border-box",
        transition: "all 0.3s ease-out",
      };
    } else {
      console.log("width > 720");
      mainContainer = {
        fontFamily: "'Roboto', sans-serif",
        position: "fixed",
        zIndex: "700",
        backgroundColor: `white`,
        //border: "2px solid #ccc",
        //border: "2px solid red",
        height: "720px",
        top: `calc((${inHeight}px - 720px) / 2)`,
        left: `calc((${inWidth}px - 1080px) / 2)`,
        //paddingLeft: `25px`,
        //paddingRight: `25px`,
        //paddingBottom: `calc((${inHeight}px - 720px) / 2)`,
        boxSizing: "border-box",
        transition: "all 0.3s ease-out",
      };
    }

    return mainContainer;

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
  };

  const MainGridStyling = (inWidth, inHeight) => {
    let mainGrid = {};
    if (inWidth < 660) {
      // width < 660px, height does not matter
      mainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
        height: `${inHeight}px`,
        display: `grid`,
        gridTemplateColumns: `auto`,
      };
    } else if (inWidth < 790) {
      if (inHeight < 720) {
        // height < 720px
        mainGrid = {
          backgroundColor: `#fff`,
          margin: `auto`,
          height: `${inHeight}px`,
          display: `grid`,
          gridTemplateColumns: `auto`,
        };
      } else {
        // height >= 720px
        mainGrid = {
          backgroundColor: `#fff`,
          margin: `auto`,
          height: `720px`,
          display: `grid`,
          gridTemplateColumns: `auto`,
        };
      }
    } else if (inWidth < 960) {
      // width < 960px, NEED TO CHECK HEIGHT
      if (inHeight < 720) {
        // height < 720px
        mainGrid = {
          backgroundColor: `#fff`,
          margin: `auto`,
          height: `${inHeight}px`,
          display: `grid`,
          gridTemplateColumns: `auto 320px`,
        };
      } else {
        // height >= 720px
        mainGrid = {
          backgroundColor: `#fff`,
          margin: `auto`,
          height: `720px`,
          display: `grid`,
          gridTemplateColumns: `auto 320px`,
        };
      }
    } else if (inWidth < 1140) {
      if (inHeight < 720) {
        // height < 720px
        mainGrid = {
          backgroundColor: `#fff`,
          margin: `auto`,
          height: `${inHeight}px`,
          display: `grid`,
          gridTemplateColumns: `auto 360px`,
        };
      } else {
        // height >= 720px
        mainGrid = {
          backgroundColor: `#fff`,
          margin: `auto`,
          height: `720px`,
          display: `grid`,
          gridTemplateColumns: `auto 360px`,
        };
      }
    } else {
      if (inHeight < 720) {
        console.log("inHeight: ", inHeight);
        // height < 720px
        mainGrid = {
          backgroundColor: `#fff`,
          margin: `auto`,
          border: "2px solid blue",
          height: `${inHeight}px`,
          width: `1080px`,
          display: `grid`,
          gridTemplateColumns: `720px 360px`,
        };
      } else {
        // height >= 720px
        mainGrid = {
          backgroundColor: `#fff`,
          margin: `auto`,
          border: "2px solid orange",
          height: `720px`,
          width: `1080px`,
          display: `grid`,
          gridTemplateColumns: `720px 360px`,
        };
      }
    }
    return mainGrid;
  };

  const EventTicketSectionStyling = (inWidth, inHeight) => {
    let eventTicketSection = {};

    if (inWidth < 480) {
      // width < 480px, height does not matter
      eventTicketSection = {
        backgroundColor: `#fff`,
        height: `calc(${inHeight}px - 140px)`,
        paddingTop: `30px`,
        paddingLeft: `10px`,
        paddingRight: `10px`,
        textAlign: `left`,
        scrollbarWidth: `10px`,
        overflowY: `auto`,
      };
    } else if (inWidth < 660) {
      // width < 660px, height does not matter
      eventTicketSection = {
        backgroundColor: `#fff`,
        height: `calc(${inHeight}px - 140px)`,
        paddingTop: `30px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        textAlign: `left`,
        scrollbarWidth: `10px`,
        overflowY: `auto`,
      };
    } else {
      // width >= 1140px, NEED TO CHECK HEIGHT
      if (inHeight < 720) {
        // height < 720px
        eventTicketSection = {
          backgroundColor: `#fff`,
          height: `calc(${inHeight}px - 140px)`,
          paddingTop: `30px`,
          paddingLeft: `25px`,
          paddingRight: `25px`,
          textAlign: `left`,
          scrollbarWidth: `10px`,
          overflowY: `auto`,
        };
      } else {
        // height >= 720px
        eventTicketSection = {
          backgroundColor: `#fff`,
          height: `580px`,
          paddingTop: `30px`,
          paddingLeft: `25px`,
          paddingRight: `25px`,
          textAlign: `left`,
          scrollbarWidth: `10px`,
          overflowY: `auto`,
        };
      }
    }

    return eventTicketSection;
  };

  const ticketPaneOLD = () => {
    return <div>ticket paaaaaaaaaaaaaaaaaaaaaaaane</div>;
  };

  // creates ticket pane with promo form and ticket sections
  const ticketPane = () => {
    return (
      <div>Ticket Pane Section</div>
      /*
      <div className={classes.MainItemLeft}>
        <div className={classes.EventHeader}>{eventHeader()}</div>
        <div style={EventTicketSection}>
          {promoOption()}
          {ticketItems()}
          <div className={classes.EventDescription}>
            Powered by{" "}
            <NavLink to="/" exact>
              <img
                className={classes.ImageBox}
                src={OSDLogo}
                alt="OpenSeatDirect Logo"
              />
            </NavLink>
          </div>
        </div>
        <div className={classes.EventFooter}>
          <div className={classes.CartLink}>{cartLink(showDoublePane)}</div>
          <div className={classes.TotalAmount}>
            {totalAmount(showDoublePane)}
          </div>
          <div style={{ textAlign: "right" }}>{checkoutButton()}</div>
        </div>
      </div>
      */
    );
  };

  const orderPane = () => {
    return <div>order paaaaaaaaaaaaaaaaaaaaaaaaane</div>;
  };

  // LOOKS GOOD
  // defines main display with ticket and order panes
  const mainDisplay = () => {
    if (display === "main") {
      //if (showDoublePane) {
      if (true) {
        return (
          <div style={mainGrid}>
            {ticketPane()}
            {orderPane()}
          </div>
        );
        //} else if (!showOrderSummaryOnly) {
      } else if (true) {
        return <div style={mainGrid}>{ticketPane()}</div>;
      } else {
        return <div style={mainGrid}>{orderPane()}</div>;
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
        style={mainContainer}
      >
        {mainDisplay()}
      </div>
    </Fragment>
  );
};

export default TicketSelectionModal;
