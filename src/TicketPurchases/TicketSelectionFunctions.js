import { bogox, twoferCapped, twofer } from "./pricingFunctions";

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

  };
  console.log("INITIAL 'eventDetails': ", tempEventDetails)
  return tempEventDetails
};

// THIS FUNCTION HAS BEEN REFACTORED TO WORK WITH THE NEW TicketSelection PAGE
// STILL NEED TO CORRECT THE CURRENCY DATA (MORE CURRENCIES TO ADD) AND usePriceFunction(true/false) ISSUE
// initial definition of "ticketInfo"
export const loadTicketInfo = event => {
  console.log("Inside 'loadTicketInfo'");
  let tempTicketArray = [];
  
  //console.log("event.tickets: ",event.tickets)
  event.tickets.forEach((item, index) => {
    console.log("tickets array index",index);
    //console.log("item.ticketType: ", item.ticketType)
    let tempCurrency = "$";
    if (item.Currency === "JPY") {
      tempCurrency = "¥";
    }
    console.log("past currency");
    
    let priceFunction = {};
    let pricingCode = "";
    //if (item.priceFunction && item.priceFunction.form && item.usePriceFunction) {
    if (item.priceFunction && item.priceFunction.form) {
      if (item.priceFunction.form === "promo" && item.priceFunction.args && item.priceFunction.args.promocodes) {
        // make all promo codes upper case
        let newPromoCodes = [];
        console.log("item.priceFunction.args: ", item.priceFunction.args)
        item.priceFunction.args.promocodes.forEach(argArray => {
          let tempElement;
          tempElement = {
            name: argArray.name.toUpperCase(),
            amount: parseInt(argArray.amount),
            percent: argArray.percent
          }
          newPromoCodes.push(tempElement)
          console.log("tempElement: ", tempElement)
        }
        )
        console.log("newPromoCodes: ", newPromoCodes)
        priceFunction = {
          form: "promo",
          args: newPromoCodes,
        };
      } else if (item.priceFunction.form === "twofer" && item.priceFunction.args) {
        let tempArgs = {
          buy: parseInt(item.priceFunction.args.buy),
          for: parseInt(item.priceFunction.args.for)
        }
        priceFunction = {
          form: "twofer",
          args: tempArgs
        };
        pricingCode = "twofer";
      } else if (item.priceFunction.form === "twoferCapped" && item.priceFunction.args) {
        let tempArgs = {
          buy: parseInt(item.priceFunction.args.buy),
          for: parseInt(item.priceFunction.args.for)
        }
        priceFunction = {
          form: "twoferCapped",
          args: tempArgs
        };
        pricingCode = "twoferCapped";
      } else if (item.priceFunction.form === "bogo" && item.priceFunction.args) {
        let tempArgs = {
          buy: parseInt(item.priceFunction.args.buy),
          get: parseInt(item.priceFunction.args.get),
          discount: parseInt(item.priceFunction.args.discount*100)
        }
        priceFunction = {
          form: "bogo",
          args: tempArgs
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
    };
    tempTicketArray.push(tempTicketItem);
  });
  console.log("INITIAL 'ticketInfo': ", tempTicketArray)
  return tempTicketArray;
}

// THIS FUNCTION HAS BEEN REFACTORED TO WORK WITH THE NEW TicketSelection PAGE
// STILL NEED TO CORRECT usePriceFunction ISSUE
// initial definition of "promoCodeDetails"
export const loadPromoCodeDetails = (res, promoCodeDetails) => {
  let tempCodesArray = [];
  console.log("res: ", res)
  res.tickets.forEach((tktType, index) => {

    if (tktType.priceFunction && tktType.priceFunction.form === "promo" && tktType.usePriceFunction) {
    //if (tktType.priceFunction && tktType.priceFunction.form === "promo") {
      console.log("There is a promo code at position: ", index)
      tktType.priceFunction.args.promocodes.forEach(tktPromo => {
        if (!tempCodesArray.includes(tktPromo.name.toUpperCase())) {
          tempCodesArray.push(tktPromo.name.toUpperCase());
        }
      })
    }
    
  })

  let tempCodeDetail = { ...promoCodeDetails };
  tempCodeDetail.eventPromoCodes = tempCodesArray;
  if (tempCodesArray.length > 0) {
    tempCodeDetail.available = true;
  }
  console.log("Initial 'promoCodeDetails': ", tempCodeDetail);
  return tempCodeDetail;

};

// THIS FUNCTION HAS BEEN REFACTORED TO WORK WITH THE NEW TicketSelection PAGE
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

// THIS FUNCTION HAS BEEN REFACTORED TO WORK WITH THE NEW TicketSelection PAGE/ I THINK!!!
// updates 'orderTotals" from either a promo code or ticket amount change
export const changeOrderTotals = (ticketInfo, orderTotals, promoCode) => {
  console.log("ticketInfo: ", ticketInfo)
  let tempTicketsPurchased = 0;
  let tempFullAmount = 0;
  let tempFinalAmount = 0;
  let tempTicketInfo = [...ticketInfo];
  tempTicketInfo.forEach(item => {
      tempTicketsPurchased = tempTicketsPurchased + item.ticketsSelected;
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

// THIS FUNCTION HAS BEEN REFACTORED TO WORK WITH THE NEW TicketSelection PAGE/ I THINK!!!
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

// THIS FUNCTION HAS BEEN REFACTORED TO WORK WITH THE NEW TicketSelection PAGE/ I THINK!!!
// updates "ticketInfo" based on changes to promo code
export const amendTicketInfo = (inputtedPromoCode, ticketInfo) => {
  let tempTicketInfo = [...ticketInfo];
  // checks if ticket type has the code and then extracts and applies the discount amount
  tempTicketInfo.forEach((item, index) => {
    if (item.ticketPriceFunction.form === "promo") {
      item.ticketPriceFunction.args.forEach(element => {
        if (element.name === inputtedPromoCode) {
          if (element.percent === "false") {
            item.adjustedTicketPrice = item.ticketPrice - element.amount;
            item.ticketPricingCodeApplied = inputtedPromoCode;
          } else {
            item.adjustedTicketPrice = parseFloat((item.ticketPrice * (1 - element.amount/100)).toFixed(2));
          }
          item.ticketPricingCodeApplied = inputtedPromoCode;
        }
      })
    }
  });
  console.log("UPDATED 'ticketInfo': ", tempTicketInfo)
  return tempTicketInfo;
};

// THIS FUNCTION HAS BEEN REFACTORED TO WORK WITH THE NEW TicketSelection PAGE/ I THINK!!!
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

// THIS FUNCTION HAS BEEN REFACTORED TO WORK WITH THE NEW TicketSelection PAGE
// updates "ticketInfo" with removed promo code
export const clearTicketInfo = (ticketInfo) => {
  let tempTicketInfo;
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

// THIS FUNCTION HAS BEEN REFACTORED TO WORK WITH THE NEW TicketSelection PAGE/ I THINK!!!
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

// THIS FUNCTION HAS BEEN REFACTORED TO WORK WITH THE NEW TicketSelection PAGE/ I THINK!!!
// updates "ticketInfo" after a change in tickets selected
export const changeTicketInfo = (event, ticketType, ticketInfo) => {
  let tempTicketInfo = [...ticketInfo];
  tempTicketInfo.forEach(item => {
    // finds a ticketID match
    if (item.ticketID === ticketType.ticketID) {
      item.ticketsSelected = parseInt(event.target.value);
      if (item.ticketPriceFunction.form === "bogo") {
        let totalPurchase = bogox(
          event.target.value,
          item.ticketPrice,
          item.ticketPriceFunction.args.buy,
          item.ticketPriceFunction.args.get,
          item.ticketPriceFunction.args.discount/100
        );
        console.log("totalPurchase: ", totalPurchase)
        {event.target.value > 0 ?
          item.adjustedTicketPrice = totalPurchase/event.target.value
          : item.adjustedTicketPrice = item.ticketPrice};
      } else if (item.ticketPriceFunction.form === "twofer") {
        let totalPurchase = twofer(
          event.target.value,//
          item.ticketPrice,//
          item.ticketPriceFunction.args.buy,//
          (item.ticketPriceFunction.args.for*item.ticketPrice)
        );
        console.log("totalPurchase: ", totalPurchase)
        {event.target.value > 0 ?
          item.adjustedTicketPrice = totalPurchase/event.target.value
          : item.adjustedTicketPrice = item.ticketPrice};
      } else if (item.ticketPriceFunction.form === "twoferCapped") {
        let totalPurchase = twoferCapped(
          event.target.value,
          item.ticketPrice,
          item.ticketPriceFunction.args.buy,
          (item.ticketPriceFunction.args.for*item.ticketPrice)
        );
        console.log("totalPurchase: ", totalPurchase)
        {event.target.value > 0 ?
          item.adjustedTicketPrice = totalPurchase/event.target.value
          : item.adjustedTicketPrice = item.ticketPrice};
      }
    }
  });
  console.log("UPDATED 'ticketInfo': ", tempTicketInfo)
  return(tempTicketInfo);
};