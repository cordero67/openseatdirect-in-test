// THIS FUNCTION HAS BEEN REFACTORED: 12/28/21
export const MainContainerStyling = (inWidth, inHeight) => {
  let mainContainer = {};
  if (inWidth < 660) {
    console.log("width < 660");
    mainContainer = {
      fontFamily: "'Roboto', sans-serif",
      position: "fixed",
      zIndex: "700",
      backgroundColor: `white`,
      //border: "2px solid #ccc",
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
  } else if (inWidth < 1140) {
    console.log("width > 720");
    mainContainer = {
      fontFamily: "'Roboto', sans-serif",
      position: "fixed",
      zIndex: "700",
      backgroundColor: `white`,
      //border: "2px solid #ccc",
      height: "720px",
      top: `calc((${inHeight}px - 720px) / 2)`,
      left: "25px",
      //paddingLeft: `25px`,
      //paddingRight: `25px`,
      //paddingBottom: `calc((${inHeight}px - 720px) / 2)`,
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
};

// THIS FUNCTION HAS BEEN REFACTORED: 12/28/21
export const MainGridStyling = (inWidth, inHeight) => {
  let mainGrid = {};

  if (inWidth < 660) {
    // width < 660px, height does not matter
    mainGrid = {
      backgroundColor: `#fff`,
      margin: `auto`,
      height: `${inHeight}px`,
      display: `grid`,
      //gridTemplateColumns: `auto`,
      gridTemplateColumns: `${inWidth}px`,
    };
  } else if (inWidth < 790) {
    // width < 790px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      mainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
        height: `${inHeight}px`,
        display: `grid`,
        //gridTemplateColumns: `auto`,
        gridTemplateColumns: `calc(${inWidth}px - 50px)`,
      };
    } else {
      // height >= 720px
      mainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
        height: `720px`,
        display: `grid`,
        //gridTemplateColumns: `auto`,
        gridTemplateColumns: `calc(${inWidth}px - 50px)`,
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
        //gridTemplateColumns: `auto 320px`,
        gridTemplateColumns: `calc(${inWidth}px - 410px) 360px`,
      };
    } else {
      // height >= 720px
      mainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
        height: `720px`,
        display: `grid`,
        //gridTemplateColumns: `auto 320px`,
        gridTemplateColumns: `calc(${inWidth}px - 410px) 360px`,
      };
    }
  } else if (inWidth < 1140) {
    // width < 1140px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      mainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
        height: `${inHeight}px`,
        display: `grid`,
        //gridTemplateColumns: `auto 360px`,
        gridTemplateColumns: `calc(${inWidth}px - 410px) 360px`,
      };
    } else {
      // height >= 720px
      mainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
        height: `720px`,
        display: `grid`,
        //gridTemplateColumns: `auto 360px`,
        gridTemplateColumns: `calc(${inWidth}px - 410px) 360px`,
      };
    }
  } else {
    // width >= 1140px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      mainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
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
        height: `720px`,
        width: `1080px`,
        display: `grid`,
        gridTemplateColumns: `720px 360px`,
      };
    }
  }
  return mainGrid;
};

// THIS FUNCTION HAS BEEN REFACTORED: 12/28/21
export const EventTicketSectionStyling = (inWidth, inHeight) => {
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

// THIS FUNCTION HAS BEEN REFACTORED: 12/28/21
export const OrderSummarySectionStyling = (inWidth, inHeight) => {
  let orderSummarySection = {};

  if (inWidth < 660) {
    // width < 660px, height does not matter
    orderSummarySection = {
      backgroundColor: `#E7E7E7`,
      fontSize: `14px`,
      height: `calc(${inHeight}px - 160px)`,
      paddingTop: `20px`,
      paddingLeft: `25px`,
      paddingRight: `25px`,
      overflowY: `auto`,
    };
  } else if (inWidth < 960) {
    // width < 960px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      orderSummarySection = {
        backgroundColor: `#E7E7E7`,
        fontSize: `14px`,
        height: `calc(${inHeight}px - 160px)`,
        paddingTop: `20px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        overflowY: `auto`,
      };
    } else {
      // height >= 720px
      orderSummarySection = {
        backgroundColor: `#E7E7E7`,
        fontSize: `14px`,
        height: `560px`,
        paddingTop: `20px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        overflowY: `auto`,
      };
    }
  } else {
    // width >= 960px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      orderSummarySection = {
        backgroundColor: `#E7E7E7`,
        fontSize: `14px`,
        height: `calc(${inHeight}px - 180px)`,
        paddingTop: `20px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        overflowY: `auto`,
      };
    } else {
      // height >= 720px
      orderSummarySection = {
        backgroundColor: `#E7E7E7`,
        fontSize: `14px`,
        height: `540px`,
        paddingTop: `20px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        overflowY: `auto`,
      };
    }
  }

  return orderSummarySection;
};

// THIS FUNCTION HAS BEEN REFACTORED: 12/28/21
export const OrderSummarySectionAltStyling = (inWidth, inHeight) => {
  let orderSummarySectionAlt = {};

  if (inWidth < 660) {
    // width < 660px, height does not matter
    orderSummarySectionAlt = {
      backgroundColor: `#E7E7E7`,
      fontSize: `14px`,
      height: `calc(${inHeight}px - 80px)`,
      paddingTop: `20px`,
      paddingLeft: `25px`,
      paddingRight: `25px`,
      overflowY: `auto`,
    };
  } else {
    // width < 960px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      orderSummarySectionAlt = {
        backgroundColor: `#E7E7E7`,
        fontSize: `15px`,
        height: `calc(${inHeight}px - 80px)`,
        paddingTop: `20px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        overflowY: `auto`,
      };
    } else {
      // height >= 720px
      orderSummarySectionAlt = {
        backgroundColor: `#E7E7E7`,
        fontSize: `15px`,
        height: `640px`,
        paddingTop: `20px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        overflowY: `auto`,
      };
    }
  }

  return orderSummarySectionAlt;
};
