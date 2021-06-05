// THIS FUNCTION HAS BEEN REFACTORED: 1/15/21
export const MainContainerStyling = (inWidth, inHeight) => {
  let MainContainer = {};

  if (inWidth < 660) {
    MainContainer = {
      fontFamily: "'Roboto', sans-serif",
      backgroundColor: `#2f5596`,
      height: `${inHeight}px`,
      paddingTop: `0px`,
      paddingLeft: `0px`,
      paddingRight: `0px`,
      paddingBottom: `0px`,
    };
  } else if (inHeight < 720) {
    MainContainer = {
      fontFamily: "'Roboto', sans-serif",
      backgroundColor: `#2f5596`,
      backgroundImage: `linear-gradient(180deg, #2f5596 0%, #000000 100%)`,
      height: `${inHeight}px`,
      paddingTop: `0px`,
      paddingLeft: `25px`,
      paddingRight: `25px`,
      paddingBottom: `0px`,
    };
  } else {
    MainContainer = {
      fontFamily: "'Roboto', sans-serif",
      backgroundColor: `#2f5596`,
      backgroundImage: `linear-gradient(180deg, #2f5596 0%, #000000 100%)`,
      paddingTop: `calc((${inHeight}px - 720px) / 2)`,
      paddingLeft: `25px`,
      paddingRight: `25px`,
      paddingBottom: `calc((${inHeight}px - 720px) / 2)`,
    };
  }

  return MainContainer;
};

// THIS FUNCTION HAS BEEN REFACTORED: 1/15/21
export const MainGridStyling = (inWidth, inHeight) => {
  let MainGrid;

  if (inWidth < 660) {
    // width < 660px, height does not matter
    MainGrid = {
      backgroundColor: `#fff`,
      margin: `auto`,
      height: `${inHeight}px`,
      display: `grid`,
      gridTemplateColumns: `auto`,
    };
  } else if (inWidth < 790) {
    // width < 790px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      MainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
        height: `${inHeight}px`,
        display: `grid`,
        gridTemplateColumns: `auto`,
      };
    } else {
      // height >= 720px
      MainGrid = {
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
      MainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
        height: `${inHeight}px`,
        display: `grid`,
        gridTemplateColumns: `auto 320px`,
      };
    } else {
      // height >= 720px
      MainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
        height: `720px`,
        display: `grid`,
        gridTemplateColumns: `auto 320px`,
      };
    }
  } else if (inWidth < 1140) {
    // width < 1140px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      MainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
        height: `${inHeight}px`,
        display: `grid`,
        gridTemplateColumns: `auto 360px`,
      };
    } else {
      // height >= 720px
      MainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
        height: `720px`,
        display: `grid`,
        gridTemplateColumns: `auto 360px`,
      };
    }
  } else {
    // width >= 1140px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      MainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
        height: `${inHeight}px`,
        width: `1080px`,
        display: `grid`,
        gridTemplateColumns: `720px 360px`,
      };
    } else {
      // height >= 720px
      MainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
        height: `720px`,
        width: `1080px`,
        display: `grid`,
        gridTemplateColumns: `720px 360px`,
      };
    }
  }

  return MainGrid;
};

// THIS FUNCTION HAS BEEN REFACTORED: 1/15/21
export const EventTicketSectionStyling = (inWidth, inHeight) => {
  let EventTicketSection;

  if (inWidth < 480) {
    // width < 480px, height does not matter
    EventTicketSection = {
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
    EventTicketSection = {
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
      EventTicketSection = {
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
      EventTicketSection = {
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

  return EventTicketSection;
};

// THIS FUNCTION HAS BEEN REFACTORED: 1/15/21
export const OrderSummarySectionStyling = (inWidth, inHeight) => {
  let OrderSummarySection;
  if (inWidth < 660) {
    // width < 660px, height does not matter
    OrderSummarySection = {
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
      OrderSummarySection = {
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
      OrderSummarySection = {
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
      OrderSummarySection = {
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
      OrderSummarySection = {
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

  return OrderSummarySection;
};

// THIS FUNCTION HAS BEEN REFACTORED: 1/15/21
export const OrderSummarySectionAltStyling = (inWidth, inHeight) => {
  let OrderSummarySectionAlt;

  if (inWidth < 660) {
    // width < 660px, height does not matter
    OrderSummarySectionAlt = {
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
      OrderSummarySectionAlt = {
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
      OrderSummarySectionAlt = {
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

  return OrderSummarySectionAlt;
};
