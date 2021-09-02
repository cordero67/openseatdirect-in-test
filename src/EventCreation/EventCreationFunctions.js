export const loadEventInfo = (eventTix) => {
  // stores all Event Description variables
  const eventDescription = {
    eventNum: "", // NOT USED IN CREATEEVENT
    eventTitle: "", //duped with "createEvent"
    isDraft: true, //duped with "createEvent"
    eventType: "live", //duped with "createEvent"
    webinarLink: "", //duped with "createEvent"
    onlineInformation: "", //duped with "createEvent"
    tbaInformation: "", //duped with "createEvent"
    locationVenueName: "", //duped with "createEvent"
    locationAddress1: "", //duped with "createEvent"
    locationAddress2: "", //duped with "createEvent"
    locationCity: "", //duped with "createEvent"
    locationState: "", //duped with "createEvent"
    locationZipPostalCode: "", //duped with "createEvent"
    locationCountryCode: "US", //duped with "createEvent"
    locationNote: "", //duped with "createEvent"
    startDate: new Date(new Date().toDateString()), //duped with "createEvent"
    startTime: "19:00:00", //duped with "createEvent"
    startDateTime: "", // NOT USED IN CREATEEVENT
    endDate: new Date(new Date().toDateString()), //duped with "createEvent"
    endTime: "20:00:00", //duped with "createEvent"
    endDateTime: "", // NOT USED IN CREATEEVENT
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, //duped with "createEvent"
    photo: "", // ONLY USED IN CREATEEVENT
    photoChanged: false, // NOT USED IN CREATEEVENT
    shortDescription: "", //duped with "createEvent"
    //longDescription: "", //duped with "createEvent"
    eventCategory: "", //duped with "createEvent"
    facebookLink: "", //duped with "createEvent"
    twitterLink: "", //duped with "createEvent"
    linkedinLink: "", //duped with "createEvent"
    instagramLink: "", //duped with "createEvent"
    vanityLink: "", //duped with "createEvent"
    refundPolicy: "noRefunds", //duped with "createEvent"
  };

  let eventLongDescription = "";

  console.log("Inside 'loadEventInfo': ", eventTix);

  let eventDescriptionFields = [
    "eventNum",
    "eventTitle",
    "isDraft",
    "locationVenueName",
    "locationAddress1",
    "locationAddress2",
    "locationCity",
    "locationState",
    "locationZipPostalCode",
    "locationCountryCode",
    "locationNote",
    "webinarLink",
    "onlineInformation",
    "tbaInformation",
    "timeZone",
    "shortDescription",
    //"longDescription",
    "eventCategory",
    "facebookLink",
    "twitterLink",
    "linkedinLink",
    "instagramLink",
    "vanityLink",
  ];

  eventDescriptionFields.forEach((field) => {
    if (field in eventTix) {
      //console.log("field exists: ", field)
      eventDescription[field] = eventTix[field];
    }
  });

  if ("longDescription" in eventTix) {
    console.log("longDescription exists");
    console.log("eventTix: ", eventTix);
    eventLongDescription = eventTix.longDescription;
  }

  "eventType" in eventTix
    ? (eventDescription.eventType = eventTix.eventType)
    : (eventDescription.eventType = "live");
  "refundPolicy" in eventTix
    ? (eventDescription.refundPolicy = eventTix.refundPolicy)
    : (eventDescription.refundPolicy = "noRefunds");

  if ("startDateTime" in eventTix) {
    eventDescription.startTime = eventTix.startDateTime.slice(11, 19);
    eventDescription.startDate = new Date(eventTix.startDateTime);
    eventDescription.startDate.setMinutes(
      eventDescription.startDate.getMinutes() +
        eventDescription.startDate.getTimezoneOffset()
    );
    console.log("eventDescription.startDate: ", eventDescription.startDate);
  }

  if ("endDateTime" in eventTix) {
    eventDescription.endTime = eventTix.endDateTime.slice(11, 19);
    eventDescription.endDate = new Date(eventTix.endDateTime);
    eventDescription.endDate.setMinutes(
      eventDescription.endDate.getMinutes() +
        eventDescription.endDate.getTimezoneOffset()
    );
    console.log("eventDescription.endDate: ", eventDescription.endDate);
  }

  let ticketArray = [];

  // now populate the ticketsDetails variable
  console.log("eventTix.tickets: ", eventTix.tickets);
  if ("tickets" in eventTix && eventTix.tickets.length !== 0) {
    let tempArray = [];
    eventTix.tickets.forEach((tix, index) => {
      let tempPriceFeature = "none";
      let tempPromoCodes = [];
      let tempPromoCodesArray = [];
      let tempFunctionArgs;
      if (
        "priceFunction" in tix &&
        "form" in tix.priceFunction &&
        "args" in tix.priceFunction
      ) {
        tempPriceFeature = tix.priceFunction.form;

        if (
          tempPriceFeature === "promo" &&
          "promocodes" in tix.priceFunction.args
        ) {
          console.log("priceFunction: ", tix.priceFunction);
          console.log("tix.priceFunction.args: ", tix.priceFunction.args);
          tempPromoCodes = tix.priceFunction.args.promocodes;
          tempPromoCodes.map((promo, index) => {
            let tempPercent;
            let tempAmount;
            if ("percent" in promo && promo.percent === "true") {
              tempPercent = true;
              tempAmount = promo.amount * 100;
              console.log("percent is true");
            } else {
              tempPercent = false;
              tempAmount = promo.amount;
              console.log("percent is false");
            }
            let element = {
              key: index,
              name: promo.name,
              amount: tempAmount,
              percent: tempPercent,
            };
            tempPromoCodesArray.push(element);
          });
        } else if (tempPriceFeature === "bogo") {
          tempFunctionArgs = {
            buy: tix.priceFunction.args.buy,
            buyWarning: false,
            get: tix.priceFunction.args.get,
            getWarning: false,
            discount: tix.priceFunction.args.discount * 100,
            discountWarning: false,
            reqWarning: false,
          };
          console.log("bogo tempFunctionArgs: ", tempFunctionArgs);
          if (tempFunctionArgs.discount === 100) {
            tempPriceFeature = "bogof";
          }
          if (tempFunctionArgs.discount !== 100) {
            tempPriceFeature = "bogod";
          }
        } else if (tempPriceFeature === "twofer") {
          tempFunctionArgs = {
            buy: tix.priceFunction.args.buy,
            buyWarning: false,
            for: tix.priceFunction.args.for,
            forWarning: false,
            reqWarning: false,
          };
        }
      }

      let currencyObject = {
        USD: "USD $",
        CAD: "CAD $",
        MXN: "MXN $",
        EUR: "EUR €",
        GBP: "GBP £",
        CZK: "CZK Kc",
        DKK: "DKK kr",
        HUF: "HUF Ft",
        NOK: "NOK kr",
        PLN: "PLN zl",
        SEK: "SEK kr",
        CHF: "CHF",
        JPY: "JPY ¥",
        AUD: "AUD $",
        NZD: "NZD $",
        HKD: "HKD $",
        SGD: "SGD $",
        ILS: "ILS ₪",
        PHP: "PHP ₱",
        TWD: "TWD NT$",
        THB: "THB ฿",
        RUB: "RUB ₽",
      };

      const longCurrency = () => {
        if ("currency" in tix) {
          console.log("tix.currency: ", tix.currency);
          console.log(
            "currencyObject[tix.currency]: ",
            currencyObject[tix.currency]
          );
          return currencyObject[tix.currency];
        } else {
          return "USD $";
        }
      };

      let newItem = {
        key: "sort" in tix ? tix.sort : index,
        sort: "sort" in tix ? tix.sort : index,
        _id: tix._id,
        ticketName: tix.ticketName,
        nameWarning: false,
        remainingQuantity: tix.remainingQuantity,
        quantityWarning: false,
        currentTicketPrice: tix.currentTicketPrice,
        priceWarning: false,
        reqWarning: false,
        currency: longCurrency(),
        settings: false,
        ticketDescription: tix.ticketDescription,
        minTicketsAllowedPerOrder: tix.minTicketsAllowedPerOrder,
        minWarning: false,
        maxTicketsAllowedPerOrder: tix.maxTicketsAllowedPerOrder,
        maxWarning: false,
        priceFeature: tempPriceFeature,
        promoCodes: tempPromoCodesArray,
        promoCodeNames: [],
        promoCodeWarning: false,
        functionArgs: tempFunctionArgs,
        viewModal: false,
      };
      ticketArray.push(newItem);
    });
    console.log("ticketArray: ", ticketArray);
  }
  return [ticketArray, eventDescription, eventLongDescription];
};
