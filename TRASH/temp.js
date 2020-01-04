const stylingUpdate = (inWidth, inHeight) => {
  setIsRestyling(true);
  if (inWidth < 790) {
    setShowDoublePane(false);
  } else {
    setShowDoublePane(true);
  }
  if (inWidth < 660) {
    MainContainer = {
      backgroundColor: `green`,
      height: `100vh`,
      paddingTop: `0px`,
      paddingLeft: `0px`,
      paddingRight: `0px`,
      paddingBottom: `0px`
    };
  } else if (inHeight < 720) {
    MainContainer = {
      backgroundColor: `green`,
      height: `100vh`,
      paddingTop: `0px`,
      paddingLeft: `5px`,
      paddingRight: `25px`,
      paddingBottom: `0px`
    };
  } else {
    MainContainer = {
      backgroundColor: `#2f5596`,
      height: `100vh`,
      paddingTop: `calc((100vh - 720px) / 2)`,
      paddingLeft: `25px`,
      paddingRight: `25px`,
      paddingBottom: `calc((100vh - 720px) / 2)`
    };
  }

  if (inWidth < 660) {
    // width < 660px, height does not matter
    MainGrid = {
      backgroundColor: `#fff`,
      margin: `auto`,
      height: `100vh`,
      display: `grid`,
      gridTemplateColumns: `auto`
    };
  } else if (inWidth < 790) {
    // width < 790px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      MainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
        height: `100vh`,
        display: `grid`,
        gridTemplateColumns: `auto`
      };
    } else {
      // height >= 720px
      MainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
        height: `720px`,
        display: `grid`,
        gridTemplateColumns: `auto`
      };
    }
  } else if (inWidth < 960) {
    // width < 960px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      MainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
        height: `100vh`,
        display: `grid`,
        gridTemplateColumns: `auto 320px`
      };
    } else {
      // height >= 720px
      MainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
        height: `720px`,
        display: `grid`,
        gridTemplateColumns: `auto 320px`
      };
    }
  } else if (inWidth < 1140) {
    // width < 1140px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      MainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
        height: `100vh`,
        display: `grid`,
        gridTemplateColumns: `auto 360px`
      };
    } else {
      // height >= 720px
      MainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
        height: `720px`,
        display: `grid`,
        gridTemplateColumns: `auto 360px`
      };
    }
  } else {
    // width >= 1140px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      MainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
        height: `100vh`,
        width: `1080px`,
        display: `grid`,
        gridTemplateColumns: `720px 360px`
      };
    } else {
      // height >= 720px
      MainGrid = {
        backgroundColor: `#fff`,
        margin: `auto`,
        height: `720px`,
        width: `1080px`,
        display: `grid`,
        gridTemplateColumns: `720px 360px`
      };
    }
  }

  if (inWidth < 480) {
    // width < 480px, height does not matter
    EventTicketSection = {
      backgroundColor: `#fff`,
      height: `calc(100vh - 140px)`,
      paddingTop: `30px`,
      paddingLeft: `15px`,
      paddingRight: `10px`,
      textAlign: `left`,
      overflowY: `auto`
    };
  } else if (inWidth < 660) {
    // width < 660px, height does not matter
    EventTicketSection = {
      backgroundColor: `#fff`,
      height: `calc(100vh - 140px)`,
      paddingTop: `30px`,
      paddingLeft: `25px`,
      paddingRight: `25px`,
      textAlign: `left`,
      overflowY: `auto`
    };
  } else if (inWidth < 790) {
    // width < 790px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      EventTicketSection = {
        backgroundColor: `#fff`,
        height: `calc(100vh - 140px)`,
        paddingTop: `30px`,
        paddingLeft: `80px`,
        paddingRight: `80px`,
        textAlign: `left`,
        overflowY: `auto`
      };
    } else {
      // height >= 720px
      EventTicketSection = {
        backgroundColor: `#fff`,
        height: `580px`,
        paddingTop: `30px`,
        paddingLeft: `80px`,
        paddingRight: `80px`,
        textAlign: `left`,
        overflowY: `auto`
      };
    }
  } else if (inWidth < 960) {
    // width < 960px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      EventTicketSection = {
        backgroundColor: `#fff`,
        height: `calc(100vh - 140px)`,
        paddingTop: `30px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        textAlign: `left`,
        overflowY: `auto`
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
        overflowY: `auto`
      };
    }
  } else if (inWidth < 1140) {
    // width < 1140px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      EventTicketSection = {
        backgroundColor: `#fff`,
        height: `calc(100vh - 140px)`,
        paddingTop: `30px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        textAlign: `left`,
        overflowY: `auto`
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
        overflowY: `auto`
      };
    }
  } else {
    // width >= 1140px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      EventTicketSection = {
        backgroundColor: `#fff`,
        height: `calc(100vh - 140px)`,
        paddingTop: `30px`,
        paddingLeft: `80px`,
        paddingRight: `80px`,
        textAlign: `left`,
        overflowY: `auto`
      };
    } else {
      // height >= 720px
      EventTicketSection = {
        backgroundColor: `#fff`,
        height: `580px`,
        paddingTop: `30px`,
        paddingLeft: `80px`,
        paddingRight: `80px`,
        textAlign: `left`,
        overflowY: `auto`
      };
    }
  }

  if (inWidth < 660) {
    // width < 660px, height does not matter
    OrderSummarySection = {
      backgroundColor: `#e5e5e5`,
      fontSize: `0.875rem`,
      height: `calc(100vh - 160px)`,
      paddingTop: `20px`,
      paddingLeft: `25px`,
      paddingRight: `25px`,
      overflowY: `auto`
    };
  } else if (inWidth < 960) {
    // width < 960px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      OrderSummarySection = {
        backgroundColor: `#e5e5e5`,
        fontSize: `0.875rem`,
        height: `calc(100vh - 160px)`,
        paddingTop: `20px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        overflowY: `auto`
      };
    } else {
      // height >= 720px
      OrderSummarySection = {
        backgroundColor: `#e5e5e5`,
        fontSize: `0.875rem`,
        height: `560px`,
        paddingTop: `20px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        overflowY: `auto`
      };
    }
  } else {
    // width >= 960px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      OrderSummarySection = {
        backgroundColor: `#e5e5e5`,
        fontSize: `0.875rem`,
        height: `calc(100vh - 180px)`,
        paddingTop: `20px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        overflowY: `auto`
      };
    } else {
      // height >= 720px
      OrderSummarySection = {
        backgroundColor: `#e5e5e5`,
        fontSize: `0.875rem`,
        height: `540px`,
        paddingTop: `20px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        overflowY: `auto`
      };
    }
  }

  if (inWidth < 660) {
    // width < 660px, height does not matter
    OrderSummarySectionAlt = {
      backgroundColor: `#e5e5e5`,
      fontSize: `0.875rem`,
      height: `calc(100vh - 80px)`,
      paddingTop: `20px`,
      paddingLeft: `25px`,
      paddingRight: `25px`,
      overflowY: `auto`
    };
  } else if (inWidth < 960) {
    // width < 960px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      OrderSummarySectionAlt = {
        backgroundColor: `#e5e5e5`,
        fontSize: `0.875rem`,
        height: `calc(100vh - 80px)`,
        paddingTop: `20px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        overflowY: `auto`
      };
    } else {
      // height >= 720px
      OrderSummarySectionAlt = {
        backgroundColor: `#e5e5e5`,
        fontSize: `0.875rem`,
        height: `640px`,
        paddingTop: `20px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        overflowY: `auto`
      };
    }
  } else {
    // width >= 960px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      OrderSummarySectionAlt = {
        backgroundColor: `#e5e5e5`,
        fontSize: `0.875rem`,
        height: `calc(100vh - 80px)`,
        paddingTop: `20px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        overflowY: `auto`
      };
    } else {
      // height >= 720px
      OrderSummarySectionAlt = {
        backgroundColor: `#e5e5e5`,
        fontSize: `0.875rem`,
        height: `640px`,
        paddingTop: `20px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        overflowY: `auto`
      };
    }
  }

  if (inWidth < 480) {
    // width < 480px, height does not matter
    BlankCanvas = {
      backgroundColor: `#fff`,
      margin: `auto`,
      verticalAlign: `center`,
      height: `100vh`,
      paddingTop: `30px`,
      paddingLeft: `15px`,
      paddingRight: `10px`,
      textAlign: `left`,
      overflowY: `auto`
    };
  } else if (inWidth < 660) {
    // width < 660px, height does not matter
    BlankCanvas = {
      backgroundColor: `#fff`,
      margin: `auto`,
      verticalAlign: `center`,
      height: `100vh`,
      paddingTop: `30px`,
      paddingLeft: `25px`,
      paddingRight: `25px`,
      textAlign: `left`,
      overflowY: `auto`
    };
  } else if (inWidth < 790) {
    // width < 790px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      BlankCanvas = {
        backgroundColor: `#fff`,
        margin: `auto`,
        verticalAlign: `center`,
        height: `100vh`,
        paddingTop: `30px`,
        paddingLeft: `80px`,
        paddingRight: `80px`,
        textAlign: `left`,
        overflowY: `auto`
      };
    } else {
      // height >= 720px
      BlankCanvas = {
        backgroundColor: `#fff`,
        margin: `auto`,
        verticalAlign: `center`,
        height: `720px`,
        paddingTop: `30px`,
        paddingLeft: `80px`,
        paddingRight: `80px`,
        textAlign: `left`,
        overflowY: `auto`
      };
    }
  } else if (inWidth < 960) {
    // width < 960px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      BlankCanvas = {
        backgroundColor: `#fff`,
        margin: `auto`,
        verticalAlign: `center`,
        height: `100vh`,
        paddingTop: `30px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        textAlign: `left`,
        overflowY: `auto`
      };
    } else {
      // height >= 720px
      BlankCanvas = {
        backgroundColor: `#fff`,
        margin: `auto`,
        verticalAlign: `center`,
        height: `720px`,
        paddingTop: `30px`,
        paddingLeft: `25px`,
        paddingRight: `25px`,
        textAlign: `left`,
        overflowY: `auto`
      };
    }
  } else {
    // width >= 1140px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      BlankCanvas = {
        backgroundColor: `#fff`,
        margin: `auto`,
        verticalAlign: `center`,
        height: `100vh`,
        width: `1080px`,
        paddingTop: `30px`,
        paddingLeft: `80px`,
        paddingRight: `80px`,
        textAlign: `left`,
        overflowY: `auto`
      };
    } else {
      // height >= 720px
      BlankCanvas = {
        backgroundColor: `#fff`,
        margin: `auto`,
        verticalAlign: `center`,
        height: `720px`,
        width: `1080px`,
        paddingTop: `30px`,
        paddingLeft: `80px`,
        paddingRight: `80px`,
        textAlign: `left`,
        overflowY: `auto`
      };
    }
  }

  if (inWidth < 660) {
    // width < 660px, height does not matter
    SpinnerCanvas = {
      backgroundColor: `#fff`,
      margin: `auto`,
      verticalAlign: `center`,
      height: `100vh`,
      display: `grid`,
      gridTemplateColumns: `auto`
    };
  } else if (inWidth < 1140) {
    // width < 1140px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      SpinnerCanvas = {
        backgroundColor: `#fff`,
        margin: `auto`,
        verticalAlign: `center`,
        height: `100vh`,
        display: `grid`,
        gridTemplateColumns: `auto`
      };
    } else {
      // height >= 720px
      SpinnerCanvas = {
        backgroundColor: `#fff`,
        margin: `auto`,
        verticalAlign: `center`,
        height: `720px`,
        display: `grid`,
        gridTemplateColumns: `auto`
      };
    }
  } else {
    // width >= 1140px, NEED TO CHECK HEIGHT
    if (inHeight < 720) {
      // height < 720px
      SpinnerCanvas = {
        backgroundColor: `#fff`,
        margin: `auto`,
        verticalAlign: `center`,
        height: `100vh`,
        width: `1080px`,
        display: `grid`,
        gridTemplateColumns: `auto`
      };
    } else {
      // height >= 720px
      SpinnerCanvas = {
        backgroundColor: `#fff`,
        margin: `auto`,
        verticalAlign: `center`,
        height: `720px`,
        width: `1080px`,
        display: `grid`,
        gridTemplateColumns: `auto`
      };
    }
  }

  setIsRestyling(false);
};
