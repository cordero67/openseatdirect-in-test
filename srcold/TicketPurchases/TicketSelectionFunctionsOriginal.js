import { bogox, twoferCapped, twofer } from "./pricingFunctions";

/*
  const loadEventDetails = event => {
    // defines the eniter "eventDetails" variable
    eventDetails = {
      eventNum: event.eventNum,//
      eventTitle: event.eventTitle,//
      eventType: event.eventType,//
      isDraft: event.isDarft,//
      eventCategory: event.eventCategory,//
      facebookLink: event.facebookLink,//
      twitterLink: event.twitterLink,//
      instagramLink: event.instagramLink,//
      linkedinLink: event.linkedinLink,//
      organizer: "", // Need to add this field to "Event" object from server
      organizerEmail: event.accountId.accountEmail,//
      startDateTime: event.startDateTime,//
      endDateTime: event.endDateTime,//
      timeZone: event.timeZone,//
      eventUrl: event.eventUrl,//
      refundPolicy: event.refundPolicy,//
      locationVenueName: event.locationVenueName,//
      locationAddress1: event.locationAddress1,//
      locationAddress2: event.locationAddress2,//
      locationCity: event.locationCity,//
      locationState: event.locationState,//
      locationZipPostalCode: event.locationZipPostalCode,//
      locationCountryCode: event.locationCountryCode,//
      locationNote: event.locationNote,//
      tbaInformation: event.tbaInformation,//
      webinarLink: event.webinarLink,//
      onlineInformation: event.onlineInformation,//
      shortDescription: event.shortDescription,//
      longDescription: event.longDescription,//
      tickets: event.tickets,
    };
    console.log("EVENT DETAILS variable in 'loadEventDetails()': ", eventDetails);
  };

*/



// THIS FUNCTION HAS BEEN REFACTORED TO WORK WITH THE NEW TicketSelection PAGE
// initial definition of "eventDetails"
export const loadEventDetails = event => {
  let tempGatewayURL;
  // sets the checkout page url
  if (event.accountId.paymentGatewayType === "PayPalExpress") {
    tempGatewayURL = "/checkout_pp";
  } else if (event.accountId.paymentGatewayType === "Braintree") {
    tempGatewayURL = "/checkout_bt";
  } else {
    tempGatewayURL = "/"
  }

  console.log("event.isDarft: ",event.isDraft)
  // defines the entire "eventDetails" variable
  let tempEventDetails = {
    eventNum: event.eventNum,//
    eventTitle: event.eventTitle,//
    eventType: event.eventType,//
    isDraft: event.isDraft,//
    organizer: "", // Need to add this field to "Event" object from server
    organizerEmail: event.accountId.accountEmail,//
    gateway: event.accountId.paymentGatewayType,
    gatewayClientID: event.accountId.paypalExpress_client_id,
    gatewayURL: tempGatewayURL,
    startDateTime: event.startDateTime,//
    endDateTime: event.endDateTime,//
    timeZone: event.timeZone,//
    eventUrl: event.eventUrl,//
    locationVenueName: event.locationVenueName,//
    locationAddress1: event.locationAddress1,//
    locationAddress2: event.locationAddress2,//
    locationCity: event.locationCity,//
    locationState: event.locationState,//
    locationZipPostalCode: event.locationZipPostalCode,//
    locationCountryCode: event.locationCountryCode,//
    locationNote: event.locationNote,//
    tbaInformation: event.tbaInformation,//
    webinarLink: event.webinarLink,//
    onlineInformation: event.onlineInformation,//
    
    // I DON'T THINK I NEED THIS ANYMORE
    /*
    location: {
      venueName: event.locationVenueName,
      address1: event.locationAddress1,
      city: event.locationCity,
      state: event.locationState,
      zipPostalCode: event.locationZipPostalCode,
      countryCode: event.locationCountryCode
    }
    */

  };
  console.log("INITIAL 'eventDetails': ", tempEventDetails)
  return tempEventDetails
};

// THIS FUNCTION NEEDS TO BE REFACTORED ONCE THE tickets FIELD HAS BEEN POPULATED BY THE SERVER
// initial definition of "ticketInfo"
export const loadTicketInfo = event => {
  console.log("Inside 'loadTicketInfo'");
  let tempTicketArray = [];
  
  console.log("event.tickets: ",event.tickets)
  event.tickets.forEach((item, index) => {
    console.log("tickets array index",index);
    //console.log("item.ticketType: ", item.ticketType)
    let tempCurrency = "$";
  
    if (event.baseCurrency && event.baseCurrency === "JPY") {
      tempCurrency = "¥";
    }

    let priceFunction = {};
    let pricingCode = "";
    if (item.priceFunction && item.priceFunction.form && item.usePriceFunction) {
      if (item.priceFunction.form === "promo" && item.priceFunction.args.promocodes) {
        // make all promo codes upper case
        let newPromoCodes = [];
        item.priceFunction.args.promocodes.forEach(code => {
          let tempElement;
          tempElement = {
            name: code.name.toUpperCase(),
            amount: code.amount
          }
          newPromoCodes.push(tempElement)
          }
        )
        priceFunction = {
          form: "promo",
          args: newPromoCodes
        };
      } else if (item.priceFunction.form === "twofer" && item.priceFunction.args) {
        priceFunction = {
          form: "twofer",
          args: item.priceFunction.args
        };
        pricingCode = "twofer";
      } else if (item.priceFunction.form === "twoferCapped" && item.priceFunction.args) {
        priceFunction = {
          form: "twoferCapped",
          args: item.priceFunction.args
        };
        pricingCode = "twoferCapped";
      } else if (item.priceFunction.form === "bogo" && item.priceFunction.args) {
        priceFunction = {
          form: "bogo",
          args: item.priceFunction.args
        };
        pricingCode = "bogo";
      }
    }
    let minOrder = "";
    let maxOrder = "";
    if (item.maxTicketsAllowedPerOrder) {
      maxOrder = item.maxTicketsAllowedPerOrder;
    }
    if (item.minTicketsAllowedPerOrder) {
      minOrder = item.minTicketsAllowedPerOrder;
    }
    const tempTicketItem = {
      ticketID: item._id,
      //ticketType: item.ticketType,
      ticketName: item.ticketName,
      ticketDescription: item.ticketDescription,
      ticketsAvailable: item.remainingQuantity,
      ticketPrice: item.currentTicketPrice,
      ticketsSelected: 0,
      maxTicketsAllowedPerOrder: maxOrder,
      minTicketsAllowedPerOrder: minOrder,
      ticketPriceFunction: priceFunction,
      ticketPricingCodeApplied: pricingCode,
      adjustedTicketPrice: item.currentTicketPrice,
      ticketCurrency: tempCurrency,
      //currency: tempCurrency
    };
    tempTicketArray.push(tempTicketItem);
  });
  console.log("INITIAL 'ticketInfo': ", tempTicketArray)
  return tempTicketArray;
}

// THIS FUNCTION NEEDS TO BE REFACTORED ONCE THE tickets FIELD HAS BEEN POPULATED BY THE SERVER
// initial definition of "promoCodeDetails"
export const loadPromoCodeDetails = (tickets, promoCodeDetails) => {
  let tempCodesArray = [];
  tickets.forEach(tktType => {
    if (tktType.priceFunction && tktType.priceFunction.form === "promo" && tktType.usePriceFunction) {
      tktType.priceFunction.args.promocodes.forEach(tktPromo => {
        if (!tempCodesArray.includes(tktPromo.name.toUpperCase())) {
          tempCodesArray.push(tktPromo.name.toUpperCase());
        }
      })
    }
  });
  let tempCodeDetail = { ...promoCodeDetails };
  tempCodeDetail.eventPromoCodes = tempCodesArray;
  if (tempCodesArray.length > 0) {
    tempCodeDetail.available = true;
  }
  console.log("Initial 'promoCodeDetails': ", tempCodeDetail);
  return tempCodeDetail;
};

// THIS CURRENTLY CAPTURES CURRENCY ON AN EVENT LEVEL, NOT AT A TICEKT LEVEL
// i.e. IS NOT CAPABLE OF HANDLING MULTIPLE CURRENCIES
// initial definition of "orderTotals"
export const loadOrderTotals = event => {
  let tempCurrencySym = "$";
  let tempCurrencyAbv = "USD";
  if (event.baseCurrency && event.baseCurrency === "JPY") {
    tempCurrencySym = "¥";
    tempCurrencyAbv = "JPY";
  }

  let tempOrderTotals = {
    ticketsPurchased: 0,
    fullPurchaseAmount: 0,
    discountAmount: 0,
    finalPurchaseAmount: 0,
    currencySym: tempCurrencySym,
    currencyAbv: tempCurrencyAbv,
    promoCodeApplied: ""
  };
  console.log("INITIAL 'orderTotals': ", tempOrderTotals)
  return tempOrderTotals;
}

// updates 'orderTotals" from either a promo code or ticket amount change
export const changeOrderTotals = (ticketInfo, orderTotals, promoCode) => {
  console.log("ticketInfo: ", ticketInfo)
  let tempTicketsPurchased = 0;
  let tempFullAmount = 0;
  let tempFinalAmount = 0;
  let tempTicketInfo = [...ticketInfo];
  tempTicketInfo.forEach(item => {
      tempTicketsPurchased = tempTicketsPurchased + parseInt(item.ticketsSelected);
      tempFullAmount = tempFullAmount + (item.ticketsSelected * item.ticketPrice);
      tempFinalAmount = tempFinalAmount + (item.ticketsSelected * item.adjustedTicketPrice);
  });
  let tempOrderTotals;
  tempOrderTotals = {...orderTotals};
  tempOrderTotals.ticketsPurchased = tempTicketsPurchased;
  tempOrderTotals.fullPurchaseAmount = tempFullAmount;
  tempOrderTotals.finalPurchaseAmount = tempFinalAmount;
  tempOrderTotals.discountAmount = parseFloat((tempFullAmount - tempFinalAmount).toFixed(2));
  if (promoCode) {
    tempOrderTotals.promoCodeApplied = promoCode;
  }
  console.log("REVISED 'orderTotals': ", tempOrderTotals)
  return tempOrderTotals;
}

// updates "promoCodeDetails" with valid promo code instance
export const amendPromoCodeDetails = (inputtedPromoCode, promoCodeDetails) => {
  let tempPromoCodeDetails = { ...promoCodeDetails };
  tempPromoCodeDetails.applied = true;
  tempPromoCodeDetails.errorMessage = "Valid Promo Code";
  tempPromoCodeDetails.appliedPromoCode = inputtedPromoCode;
  tempPromoCodeDetails.inputtedPromoCode = "";
  tempPromoCodeDetails.lastInvalidPromoCode = "";
  console.log("UPDATED 'promoCodeDetails': ", tempPromoCodeDetails)
  return tempPromoCodeDetails;
};

// updates "ticketInfo" based on changes to promo code
export const amendTicketInfo = (inputtedPromoCode, ticketInfo) => {
  let tempTicketInfo = [...ticketInfo];
  // checks if ticket type has the code and then extracts and applies the discount amount
  tempTicketInfo.forEach((item, index) => {
    if (item.ticketPriceFunction.form === "promo") {
      item.ticketPriceFunction.args.forEach(element => {
        if (element.name === inputtedPromoCode) {
          item.adjustedTicketPrice = element.amount;
          item.ticketPricingCodeApplied = inputtedPromoCode;
        }
      })
    }
  });
  console.log("UPDATED 'ticketInfo': ", tempTicketInfo)
  return tempTicketInfo;
};

// updates "promoCodeDetails" with removed promo code
export const clearPromoDetails = (promoCodeDetails) => {
  let tempPromoCodeDetails;
  tempPromoCodeDetails = { ...promoCodeDetails };
  tempPromoCodeDetails.applied = false;
  tempPromoCodeDetails.input = true;
  tempPromoCodeDetails.errorMessage = "";
  tempPromoCodeDetails.appliedPromoCode = "";
  tempPromoCodeDetails.inputtedPromoValue = "";
  tempPromoCodeDetails.lastInvalidPromoCode = "";
  console.log("UPDATED 'promoCodeDetails': ", tempPromoCodeDetails)
  return tempPromoCodeDetails;
}

// updates "ticketInfo" with removed promo code
export const clearTicketInfo = (ticketInfo) => {
  let tempTicketInfo;
  //let tempTotalPurchaseAmount = 0;
  //let tempFinalPurchaseAmount = 0;
  tempTicketInfo = [...ticketInfo];
  tempTicketInfo.forEach((item, index) => {
    if (item.ticketPriceFunction.form === "promo") {
      item.adjustedTicketPrice = item.ticketPrice;
      item.ticketPricingCodeApplied = "";
    }
  })
  console.log("UPDATED 'ticketInfo': ", tempTicketInfo)
  return tempTicketInfo;
}
//********** REVIEWED TO HERE


// updates "orderTotals" with removed promo code
export const clearOrderTotals = (ticketInfo, orderTotals) => {
  let tempTicketInfo;
  let tempOrderTotals;
  let tempTotalPurchaseAmount = 0;
  let tempFinalPurchaseAmount = 0;
  tempTicketInfo = [...ticketInfo];
  tempTicketInfo.forEach((item, index) => {
    tempTotalPurchaseAmount = tempTotalPurchaseAmount + (item.ticketsSelected * item.ticketPrice);
    tempFinalPurchaseAmount = tempFinalPurchaseAmount + (item.ticketsSelected * item.adjustedTicketPrice);
  })
  tempOrderTotals = {...orderTotals};
  tempOrderTotals.fullPurchaseAmount = tempTotalPurchaseAmount;
  tempOrderTotals.finalPurchaseAmount = tempFinalPurchaseAmount;
  tempOrderTotals.discountAmount = 0;
  tempOrderTotals.promoCodeApplied = "";
  console.log("UPDATED 'orderTotals': ", tempOrderTotals)
  return tempOrderTotals;
}

// updates "ticketInfo" after a change in tickets selected
export const changeTicketInfo = (event, ticketType, ticketInfo) => {
  let tempTicketInfo = [...ticketInfo];
  tempTicketInfo.forEach(item => {
    // finds a ticketID match
    if (item.ticketID === ticketType.ticketID) {
      item.ticketsSelected = event.target.value;
      if (item.ticketPriceFunction.form === "bogo") {
        let totalPurchase = bogox(
          event.target.value,
          item.ticketPrice,
          item.ticketPriceFunction.args.buy,
          item.ticketPriceFunction.args.get,
          item.ticketPriceFunction.args.discount
        );
        {event.target.value > 0 ?
          item.adjustedTicketPrice = totalPurchase/event.target.value
          : item.adjustedTicketPrice = item.ticketPrice};
      } else if (item.ticketPriceFunction.form === "twofer") {
        let totalPurchase = twofer(
          event.target.value,
          item.ticketPrice,
          item.ticketPriceFunction.args.buy,
          item.ticketPriceFunction.args.for
        );
        {event.target.value > 0 ?
          item.adjustedTicketPrice = totalPurchase/event.target.value
          : item.adjustedTicketPrice = item.ticketPrice};
      } else if (item.ticketPriceFunction.form === "twoferCapped") {
        let totalPurchase = twoferCapped(
          event.target.value,
          item.ticketPrice,
          item.ticketPriceFunction.args.buy,
          item.ticketPriceFunction.args.for
        );
        {event.target.value > 0 ?
          item.adjustedTicketPrice = totalPurchase/event.target.value
          : item.adjustedTicketPrice = item.ticketPrice};
      }
    }
  });
  console.log("UPDATED 'ticketInfo': ", tempTicketInfo)
  return(tempTicketInfo);
};