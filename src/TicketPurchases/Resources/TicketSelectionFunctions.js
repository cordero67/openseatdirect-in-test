import { bogox, twofer } from "./PricingFunctions";

// THIS FUNCTION HAS BEEN REFACTORED: 1/15/21
// initial definition of "eventDetails"
export const loadEventDetails = (event) => {
  let tempGatewayURL;
  // sets the checkout page url
  // NEED TO REMOVE THIS LINE ONCE ADDITIONAL GATEWAYS ADDED
  if (true) {
    // NEED TO ADD THIS LINE ONCE ADDITIONAL GATEWAYS ADDED
    //if (event.accountId.paymentGatewayType === "PayPalExpress") {
    tempGatewayURL = "/checkout_pp";
    // NEED TO ADD THESE LINES ONCE ADDITIONAL GATEWAYS ADDED
    // } else if (event.accountId.paymentGatewayType === "Braintree") {
    //   tempGatewayURL = "/checkout_bt";
  } else {
    tempGatewayURL = "/";
  }

  let ticketStatus;
  ticketStatus = false;
  let d = Date.parse(event.startDateTime) + 86400;

  if (Date.now() < d) {
    ticketStatus = true;
  }
  let tempEventDetails = {
    eventNum: event.eventNum,
    eventTitle: event.eventTitle,
    eventType: event.eventType,
    isDraft: event.isDraft,
    register: event.register,
    organizer: "",
    gateway: event.accountId.paymentGatewayType,
    gatewayClientID: event.accountId.paypalExpress_client_id,
    gatewayMerchantID: event.accountId.paypal_merchant_id,
    gatewayURL: tempGatewayURL,
    startDateTime: event.startDateTime,
    endDateTime: event.endDateTime,
    timeZone: event.timeZone,
    eventUrl: event.eventUrl,
    photoUrl1: event.photoUrl1,
    photoUrl2: event.photoUrl2,
    locationVenueName: event.locationVenueName,
    locationAddress1: event.locationAddress1,
    locationAddress2: event.locationAddress2,
    locationCity: event.locationCity,
    locationState: event.locationState,
    locationZipPostalCode: event.locationZipPostalCode,
    locationCountryCode: event.locationCountryCode,
    locationNote: event.locationNote,
    tbaInformation: event.tbaInformation,
    webinarLink: event.webinarLink,
    vanityLink: event.vanityLink,
    onlineInformation: event.onlineInformation,
    forSale: ticketStatus,
  };
  console.log("INITIAL 'eventDetails': ", tempEventDetails);
  return tempEventDetails;
};

// THIS FUNCTION HAS BEEN REFACTORED: 1/15/21
// STILL NEED TO CORRECT THE usePriceFunction(true/false) ISSUE
// initial definition of "ticketInfo"
export const loadTicketInfo = (event) => {
  let tempTicketArray = [];
  event.tickets.forEach((item, index) => {
    let tempCurrency = "$";
    if (item.Currency === "JPY") {
      tempCurrency = "¥";
    }

    let priceFunction = {};
    let pricingCode = "";
    if ("priceFunction" in item && "form" in item.priceFunction) {
      if (
        item.priceFunction.form === "promo" &&
        "args" in item.priceFunction &&
        "promocodes" in item.priceFunction.args
      ) {
        // make all promo codes upper case
        let newPromoCodes = [];
        item.priceFunction.args.promocodes.forEach((argArray) => {
          let tempElement;
          tempElement = {
            name: argArray.name.toUpperCase(),
            amount: parseFloat(argArray.amount).toFixed(2),
            percent: argArray.percent,
          };
          newPromoCodes.push(tempElement);
        });
        priceFunction = {
          form: "promo",
          args: newPromoCodes,
        };
      } else if (
        item.priceFunction.form === "twofer" &&
        "args" in item.priceFunction
      ) {
        let tempArgs = {
          buy: parseInt(item.priceFunction.args.buy),
          for: item.priceFunction.args.for,
        };
        priceFunction = {
          form: "twofer",
          args: tempArgs,
        };
        pricingCode = "twofer";
      } else if (
        item.priceFunction.form === "bogo" &&
        "args" in item.priceFunction
      ) {
        let tempArgs = {
          buy: parseInt(item.priceFunction.args.buy),
          get: parseInt(item.priceFunction.args.get),
          discount: parseFloat(
            //(item.priceFunction.args.discount * 100).toFixed(2)
            item.priceFunction.args.discount
          ),
        };
        priceFunction = {
          form: "bogo",
          args: tempArgs,
        };
        pricingCode = "bogo";
      }
    }
    console.log("Pricefunction: ", priceFunction);
    let minOrder = "";
    let maxOrder = "";
    if ("maxTicketsAllowedPerOrder" in item) {
      maxOrder = item.maxTicketsAllowedPerOrder;
    }
    if ("minTicketsAllowedPerOrder" in item) {
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
  console.log("INITIAL 'ticketInfo': ", tempTicketArray);
  return tempTicketArray;
};

// THIS FUNCTION HAS BEEN REFACTORED: 1/15/21
// STILL NEED TO CORRECT THE usePriceFunction(true/false) ISSUE
// initial definition of "promoCodeDetails"
export const loadPromoCodeDetails = (res, promoCodeDetails) => {
  let tempCodesArray = [];
  res.tickets.forEach((tktType, index) => {
    if ("priceFunction" in tktType && tktType.priceFunction.form === "promo") {
      tktType.priceFunction.args.promocodes.forEach((tktPromo) => {
        if (!tempCodesArray.includes(tktPromo.name.toUpperCase())) {
          tempCodesArray.push(tktPromo.name.toUpperCase());
        }
      });
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

// THIS FUNCTION HAS BEEN REFACTORED: 1/15/21
// i.e. IS NOT CAPABLE OF HANDLING MULTIPLE CURRENCIES
// initial definition of "orderTotals"
export const loadOrderTotals = (event) => {
  let tempCurrencySym = "$";
  let tempCurrencyAbv = "USD";
  if ("baseCurrency" in event && event.baseCurrency === "JPY") {
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
    promoCodeApplied: "",
  };
  console.log("INITIAL 'orderTotals': ", tempOrderTotals);
  return tempOrderTotals;
};

// THIS FUNCTION HAS BEEN REFACTORED: 1/15/21
// updates 'orderTotals" from either a promo code or ticket amount change
export const changeOrderTotals = (ticketInfo, orderTotals, promoCode) => {
  let tempTicketsPurchased = 0;
  let tempFullAmount = 0;
  let tempFinalAmount = 0;
  let tempTicketInfo = [...ticketInfo];
  tempTicketInfo.forEach((item) => {
    tempTicketsPurchased = tempTicketsPurchased + item.ticketsSelected;
    tempFullAmount = tempFullAmount + item.ticketsSelected * item.ticketPrice;
    tempFinalAmount =
      tempFinalAmount + item.ticketsSelected * item.adjustedTicketPrice;
  });
  let tempOrderTotals;
  tempOrderTotals = { ...orderTotals };
  tempOrderTotals.ticketsPurchased = tempTicketsPurchased;
  tempOrderTotals.fullPurchaseAmount = parseFloat(tempFullAmount.toFixed(2));
  tempOrderTotals.finalPurchaseAmount = parseFloat(tempFinalAmount.toFixed(2));
  tempOrderTotals.discountAmount = parseFloat(
    (tempFullAmount - tempFinalAmount).toFixed(2)
  );
  if (promoCode) {
    tempOrderTotals.promoCodeApplied = promoCode;
  }
  console.log("REVISED 'orderTotals': ", tempOrderTotals);
  return tempOrderTotals;
};

// THIS FUNCTION HAS BEEN REFACTORED: 1/15/21
// updates "ticketInfo" after a change in tickets selected
export const changeTicketInfo = (event, ticketType, ticketInfo) => {
  let tempTicketInfo = [...ticketInfo];
  tempTicketInfo.forEach((item) => {
    // finds a ticketID match
    if (item.ticketID === ticketType.ticketID) {
      item.ticketsSelected = parseInt(event.target.value);
      if (item.ticketPriceFunction.form === "bogo") {
        let totalPurchase = bogox(
          event.target.value,
          item.ticketPrice,
          item.ticketPriceFunction.args.buy,
          item.ticketPriceFunction.args.get,
          item.ticketPriceFunction.args.discount / 100
        );
        {
          event.target.value > 0
            ? (item.adjustedTicketPrice = totalPurchase / event.target.value)
            : (item.adjustedTicketPrice = item.ticketPrice);
        }
      } else if (item.ticketPriceFunction.form === "twofer") {
        let totalPurchase = twofer(
          event.target.value,
          item.ticketPrice,
          item.ticketPriceFunction.args.buy,
          item.ticketPriceFunction.args.for
        );
        {
          event.target.value > 0
            ? (item.adjustedTicketPrice = totalPurchase / event.target.value)
            : (item.adjustedTicketPrice = item.ticketPrice);
        }
      }
    }
  });
  console.log("UPDATED 'ticketInfo': ", tempTicketInfo);
  return tempTicketInfo;
};

// THIS FUNCTION HAS BEEN REFACTORED: 1/15/21
// updates "promoCodeDetails" with valid promo code instance
export const amendPromoCodeDetails = (inputtedPromoCode, promoCodeDetails) => {
  let tempPromoCodeDetails = { ...promoCodeDetails };
  tempPromoCodeDetails.applied = true;
  tempPromoCodeDetails.errorMessage = "Valid Promo Code";
  tempPromoCodeDetails.appliedPromoCode = inputtedPromoCode;
  tempPromoCodeDetails.inputtedPromoCode = "";
  tempPromoCodeDetails.lastInvalidPromoCode = "";
  console.log("UPDATED 'promoCodeDetails': ", tempPromoCodeDetails);
  return tempPromoCodeDetails;
};

// THIS FUNCTION HAS BEEN REFACTORED: 1/15/21
// updates "ticketInfo" based on changes to promo code
export const amendTicketInfo = (inputtedPromoCode, ticketInfo) => {
  console.log("inside amendTicket");
  let tempTicketInfo = [...ticketInfo];
  // checks if ticket type has the code and then extracts and applies the discount amount
  tempTicketInfo.forEach((item) => {
    if (item.ticketPriceFunction.form === "promo") {
      item.ticketPriceFunction.args.forEach((element) => {
        if (element.name === inputtedPromoCode) {
          if (!element.percent) {
            console.log("element.amount: ", element.amount);
            console.log("element: ", element);
            console.log("percent is false");
            item.adjustedTicketPrice = item.ticketPrice - element.amount;
          } else {
            console.log("element.amount: ", element.amount);
            console.log("element: ", element);
            console.log("percent is true");
            item.adjustedTicketPrice = parseFloat(
              (item.ticketPrice * (1 - element.amount / 100)).toFixed(2)
            );
          }
          item.ticketPricingCodeApplied = inputtedPromoCode;
        }
      });
    }
  });
  console.log("UPDATED 'ticketInfo': ", tempTicketInfo);
  return tempTicketInfo;
};

// THIS FUNCTION HAS BEEN REFACTORED: 1/15/21
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
  console.log("UPDATED 'promoCodeDetails': ", tempPromoCodeDetails);
  return tempPromoCodeDetails;
};

// THIS FUNCTION HAS BEEN REFACTORED: 1/15/21
// updates "ticketInfo" with removed promo code
export const clearTicketInfo = (ticketInfo) => {
  let tempTicketInfo;
  tempTicketInfo = [...ticketInfo];
  tempTicketInfo.forEach((item, index) => {
    if (item.ticketPriceFunction.form === "promo") {
      item.adjustedTicketPrice = item.ticketPrice;
      item.ticketPricingCodeApplied = "";
    }
  });
  console.log("UPDATED 'ticketInfo': ", tempTicketInfo);
  return tempTicketInfo;
};

// THIS FUNCTION HAS BEEN REFACTORED: 1/15/21
// updates "orderTotals" with removed promo code
export const clearOrderTotals = (ticketInfo, orderTotals) => {
  let tempTicketInfo;
  let tempOrderTotals;
  let tempTotalPurchaseAmount = 0;
  let tempFinalPurchaseAmount = 0;
  tempTicketInfo = [...ticketInfo];
  tempTicketInfo.forEach((item, index) => {
    tempTotalPurchaseAmount =
      tempTotalPurchaseAmount + item.ticketsSelected * item.ticketPrice;
    tempFinalPurchaseAmount =
      tempFinalPurchaseAmount + item.ticketsSelected * item.adjustedTicketPrice;
  });
  tempOrderTotals = { ...orderTotals };
  tempOrderTotals.fullPurchaseAmount = tempTotalPurchaseAmount;
  tempOrderTotals.finalPurchaseAmount = tempFinalPurchaseAmount;
  tempOrderTotals.discountAmount = 0;
  tempOrderTotals.promoCodeApplied = "";
  console.log("UPDATED 'orderTotals': ", tempOrderTotals);
  return tempOrderTotals;
};

// THIS FUNCTION HAS BEEN REFACTORED: 1/15/21
export const loadTransactionInfo = (
  eventDetails,
  orderTotals,
  ticketInfo,
  email,
  name
) => {
  let TransactionInfo = {
    eventTitle: eventDetails.eventTitle,
    venue: eventDetails.locationVenueName,
    address1: eventDetails.locationAddress1,
    address2: eventDetails.locationAddress2,
    city: eventDetails.locationCity,
    state: eventDetails.locationState,
    zipPostalCode: eventDetails.locationZipPostalCode,
    locationNote: eventDetails.locationNote,
    webinarLink: eventDetails.webinarLink,
    onlineInformation: eventDetails.onlineInformation,
    tbaInformation: eventDetails.tbaInformation,
    startDateTime: eventDetails.startDateTime,
    endDateTime: eventDetails.endDateTime,
    timeZone: eventDetails.timeZone,
    email: email,
    name: name,
    numTickets: orderTotals.ticketsPurchased,
    fullAmount: orderTotals.fullPurchaseAmount,
    discount: orderTotals.discountAmount,
    totalAmount: orderTotals.finalPurchaseAmount,
    tickets: ticketInfo,
    organizerEmail: eventDetails.organizerEmail,
  };

  return TransactionInfo;
};
