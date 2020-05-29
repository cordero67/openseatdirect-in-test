import React, { useState, useRef, useEffect } from "react";
import queryString from "query-string";

import ReactHtmlParser from "react-html-parser";

import { Editor } from "@tinymce/tinymce-react";
import DateSelector from "./DateSelector";
import TimeSelector from "./TimeSelector";
import TimeZoneSelector from "./TimeZoneSelector";
import CountrySelector from "./CountrySelector";
import CurrencySelector from "./CurrencySelector";
import CategorySelector from "./CategorySelector";
import RadioForm from "./RadioForm";
import ImgDropAndCrop from "../ImgDropAndCrop/ImgDropAndCrop";

import TicketType from "./TicketType";
import Modal from "./Modal/Modal";

import classes from "./EventCreation.module.css";
import Aux from "../hoc/Auxiliary/Auxiliary";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faTrashAlt,
  faGripVertical,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Popup } from "semantic-ui-react";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

const eventTixOrig = {
  // sample data
  _id: "5e8199fdfc33db465d140c4b",
  isDraft: false,
  isVisible: false,
  ticket: [],
  repeat: "None",
  eventStatus: "EventScheduled",
  eventTitle: "RikaRikaStudio オンライン英語家庭教師",
  onlineInfo: "Podcast link",
  eventType: "liveOnline",
  eventCategory: "sports",
  startDateTime: "2020-06-23T23:00:00.000Z",
  endDateTime: "2020-06-25T19:30:00.000Z",
  timeZone: "America/Halifax",
  longDescription: "<p>Rika's</p><p>Event</p>↵<p>Added text</p>",
  shortDescription:
    "AmeRikaEigo\nNYデザイナーが皆様の英語学習をお手伝いいたします！",
  createUserId: "5da53eba74a2f98516d9b62c",
  eventNum: 75959989768,
  eventUrl: "rikarikastudio-",
  accountId: "5e600072110cbc31b17fa33c",
  createdAt: "2020-03-30T07:04:29.683Z",
  updatedAt: "2020-04-15T01:52:49.339Z",
  locationVenueName: "Nagano Stadium",
  locationNote: "take your shoes off",
  locationAddress1: "111 Blossom Road",
  locationAddress2: "4th Floor",
  locationCity: "Nagano",
  locationState: "Chūbu‎",
  locationCountryCode: "Japan",
  locationZipPostalCode: "903338",
  facebookLink: "my event f",
  twitterLink: "my event t",
  linkedinLink: "my event l",
  instagramLink: "my event i",
  refundPolicy: "7days",
  __v: 0,
  tickets: [
    {
      eventId: "5e8199fdfc33db465d140c4b",
      ticketType: { type: "String", enum: ["Free", "Paid", "Donation"] },
      freeTicket: { type: "Boolean" },
      usePriceFunction: true,
      priceFunction: {
        form: "twofer",
        args: {
          buy: 2,
          for: 15,
        },
      },
      ticketName: "初回コンサルテーション",
      currency: "USD",
      language: "JPN",
      ticketDescription:
        "レッスンを始める前の１５分間のコンサルテーションです。ゴールの設定やクラスの進め方、又、ご自身のレベルが分からなかったり、ご質問がある場合にもお気軽にご相談ください。",
      showTicketDescOnEventPage: { type: "Boolean" },
      minTicketsAllowedPerOrder: 1,
      maxTicketsAllowedPerOrder: 10,
      initialTicketPrice: 0,
      currentTicketPrice: 0,
      initialQuantity: 20000,
      remainingQuantity: 19991,
      sort: 0,
      startVisibilityDateTime: { type: "Date" },
      endVisibilityDateTime: { type: "Date" },
      startSaleDateTime: { type: "Date" },
      endSaleDateTime: { type: "Date" },
      smartContractAddress: { type: "String" },
      isZombie: { type: "Boolean" },
      _id: "5e819c06fc33db465d140c4c",
      updatedAt: "2020-03-31T22:57:27.610Z",
      createdAt: "2020-03-30T07:13:10.901Z",
      __v: 0,
    },
    {
      eventId: "5e8199fdfc33db465d140c4b",
      ticketType: { type: "String", enum: ["Free", "Paid", "Donation"] },
      freeTicket: { type: "Boolean" },
      usePriceFunction: true,
      priceFunction: {
        form: "bogo",
        args: {
          buy: 2,
          get: 1,
        },
      },
      ticketName: "オンラインプライベート英語レッスン",
      currency: "JPY",
      language: "JPN",
      ticketDescription:
        "オンライン30分プライベートコースです。イキイキと楽しみながら、自信を持って技術やテクニックをレベルアップしていただけるプライベートレッスンです。一回づつお気軽にも、お得なパッケージ料金もございます",
      showTicketDescOnEventPage: { type: "Boolean" },
      initialTicketPrice: 2000,
      currentTicketPrice: 2000,
      initialQuantity: 20000,
      remainingQuantity: 19978,
      sort: 1,
      startVisibilityDateTime: { type: "Date" },
      endVisibilityDateTime: { type: "Date" },
      startSaleDateTime: { type: "Date" },
      endSaleDateTime: { type: "Date" },
      smartContractAddress: { type: "String" },
      isZombie: { type: "Boolean" },
      _id: "5e819c8c43c286568ea23d85",
      updatedAt: "2020-03-31T22:57:27.616Z",
      createdAt: "2020-03-30T07:15:24.734Z",
      __v: 0,
    },
    {
      eventId: "5e8199fdfc33db465d140c4b",
      ticketType: { type: "String", enum: ["Free", "Paid", "Donation"] },
      freeTicket: { type: "Boolean" },
      usePriceFunction: true,
      priceFunction: {
        form: "bogo",
        args: {
          buy: 5,
          get: 2,
          discount: 0.9,
        },
      },
      ticketName: "ウィークリーエヴリディ",
      currency: "USD",
      language: "JPN",
      ticketDescription:
        "１週間毎日受講いただけるお得なプランです。１週間有効 英語３０分プライベートレッスンオンライン。１日１レッスンまでとします。",
      showTicketDescOnEventPage: { type: "Boolean" },
      maxTicketsAllowedPerOrder: 5,
      initialTicketPrice: 7200,
      currentTicketPrice: 7200,
      initialQuantity: 20000,
      remainingQuantity: 19994,
      sort: 3,
      startVisibilityDateTime: { type: "Date" },
      endVisibilityDateTime: { type: "Date" },
      startSaleDateTime: { type: "Date" },
      endSaleDateTime: { type: "Date" },
      smartContractAddress: { type: "String" },
      isZombie: { type: "Boolean" },
      _id: "5e819cbf43c286568ea23d86",
      updatedAt: "2020-03-31T19:25:00.309Z",
      createdAt: "2020-03-30T07:16:15.583Z",
      __v: 0,
    },
    {
      eventId: "5e8199fdfc33db465d140c4b",
      ticketType: { type: "String", enum: ["Free", "Paid", "Donation"] },
      freeTicket: { type: "Boolean" },
      usePriceFunction: false,
      priceFunction: {
        form: "promo",
        args: {
          promocodes: [
            {
              name: "flyers",
              amount: 0,
            },
            {
              name: "eagles",
              amount: 10,
            },
          ],
        },
      },
      ticketName: "マンスリー10回",
      currency: "JPY",
      language: "JPN",
      ticketDescription:
        "３０日間有効の合計１０回のプランです。Valid for one month Select • 英語３０分プライベートレッ",
      showTicketDescOnEventPage: { type: "Boolean" },
      minTicketsAllowedPerOrder: 2,
      initialTicketPrice: 18000,
      currentTicketPrice: 18000,
      initialQuantity: 200,
      remainingQuantity: 196,
      sort: 4,
      startVisibilityDateTime: { type: "Date" },
      endVisibilityDateTime: { type: "Date" },
      startSaleDateTime: { type: "Date" },
      endSaleDateTime: { type: "Date" },
      smartContractAddress: { type: "String" },
      isZombie: { type: "Boolean" },
      _id: "5e819cec43c286568ea23d87",
      updatedAt: "2020-03-31T19:25:00.312Z",
      createdAt: "2020-03-30T07:17:00.628Z",
      __v: 0,
    },
  ],
};

const dataFields = {
  isDraft: { type: "Boolean", required: true }, // fetch
  eventType: {
    type: "String",
    required: true,
    enum: ["live", "online", "liveOnline"],
  }, // fetch
  hasAlwaysBeenDraft: { type: "Boolean", required: true },
  eventTitle: { type: "String", required: true, maxlength: 64 }, // fetch
  longDescription: { type: "String", maxlength: 100000 }, // fetch
  shortDescription: { type: "String", maxlength: 140 }, // fetch
  startDateTime: { type: "Date", required: true }, // fetch
  endDateTime: { type: "Date" }, // fetch
  timeZone: { type: "String" }, // fetch
  locationVenueName: { type: "String", required: true, maxlength: 140 }, // fetch
  locationAddress1: { type: "String", maxlength: 32 }, // fetch
  locationAddress2: { type: "String", maxlength: 32 }, // fetch
  locationCity: { type: "String", maxlength: 32 }, // fetch
  locationState: { type: "String", maxlength: 2 }, // fetch
  locationZipPostalCode: { type: "String", maxlength: 6 }, // fetch
  locationCountryCode: { type: "String", maxlength: 3 }, // fetch
  locationNote: { type: "String", maxlength: 100 }, // fetch
  webinarLink: { type: "String", maxlength: 256 },
  onlineInformation: { type: "String", maxlength: 256 },
  eventCategory: {
    type: "String",
    enum: [
      "Music",
      "Sports",
      "Arts & Theater",
      "Food & Drink",
      "Charity & Causes",
      "Family",
      "Meeting",
    ],
  }, // fetch
  createUserId: { type: "ObjectId", required: true },
  updateUserId: { type: "ObjectId" },
  accountId: { type: "ObjectId" },
  eventNum: { type: "Number", required: true }, // fetch
  facebookLink: { type: "String", maxlength: 64 }, // fetch
  twitterLink: { type: "String", maxlength: 64 }, // fetch
  instagramLink: { type: "String", maxlength: 64 }, // fetch
  linkedinLink: { type: "String", maxlength: 64 }, // fetch
  eventUrl: { type: "String", required: true }, // fetch
  refundPolicy: "", // fetch
  photo: { type: "object" }, // fetch
  _id: { type: "object" },
  updatedAt: { type: "Date" },
  createdAt: { type: "Date" },
  __v: { type: "Number" },
  tickets: {
    eventId: { type: "ObjectId", required: true },
    ticketType: { type: "String", enum: ["Free", "Paid", "Donation"] },
    freeTicket: { type: "Boolean" },
    usePriceFunction: { type: "Boolean" },
    priceFunction: { type: "object" }, // fetch via temp variable
    ticketName: { type: "String", required: true, maxlength: 32 }, // ticketDetails // fetch
    currency: { type: "String", enum: ["USD", "JPY", "EUR", "GBP"] }, // ticketDetails // fetch
    language: { type: "String", enum: ["ENG", "JPN", "SPA"] },
    ticketDescription: { type: "String", maxlength: 1000 }, // ticketDetails // fetch
    showTicketDescOnEventPage: { type: "Boolean" },
    minTicketsAllowedPerOrder: { type: "Number", validate: "isInteger" }, // ticketDetails // fetch
    maxTicketsAllowedPerOrder: { type: "Number", validate: "isInteger" }, // ticketDetails // fetch
    initialTicketPrice: { type: "Number", required: true }, // ticketDetails
    currentTicketPrice: { type: "Number", required: true }, // fetch
    initialQuantity: { type: "Number", required: true, validate: "isInteger" }, // ticketDetails
    remainingQuantity: {
      type: "Number",
      required: true,
      validate: "isInteger",
    }, // fetch
    sort: { type: "Number" }, // ticketDetails // fetch
    startVisibilityDateTime: { type: "Date" },
    endVisibilityDateTime: { type: "Date" },
    startSaleDateTime: { type: "Date" },
    endSaleDateTime: { type: "Date" },
    smartContractAddress: { type: "String" },
    isZombie: { type: "Boolean" },
    _id: { type: "object" },
    updatedAt: { type: "Date" },
    createdAt: { type: "Date" },
    __v: { type: "Number" },
  },
};

const EventCreation = () => {
  // stores all Ticket Details variables
  const [ticketDetails, setTicketDetails] = useState([
    {
      key: "1", // fetch
      sort: "", // fetch
      ticketName: "", // fetch
      ticketQuantity: "", // fetch
      ticketPrice: "", // fetch
      currency: "", // fetch
      settings: false,
      ticketDescription: "",
      orderMin: "", // fetch
      orderMax: "", // fetch
      priceFeature: "none", // fetch via temp variable
      promoCodes: [{ key: "1", name: "", amount: "", percent: "" }], // fetch via temp variable
      promoCodeNames: [],
      promoCodeWarning: "",
      functionArgs: {}, // fetch via temp variable
      viewModal: false,
    },
  ]);

  // stores all Event Description variables
  const [eventDescription, setEventDescription] = useState({
    eventNum: "", // fetch
    eventTitle: "", // fetch
    isDraft: true, // fetch
    eventType: "live", // fetch
    webinarLink: "",
    onlineInformation: "",
    onlineInfo: "",
    locationVenueName: "", // fetch
    locationAddress1: "", // fetch
    locationAddress2: "", // fetch
    locationCity: "", // fetch
    locationState: "", // fetch
    locationZipPostalCode: "", // fetch
    locationCountryCode: "", // fetch
    locationNote: "", // fetch
    startDate: new Date(new Date().toDateString()),
    startTime: "",
    startDateTime: "",
    endDate: new Date(new Date().toDateString()),
    endTime: "",
    endDateTime: "",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // fetch
    eventImage: null,
    shortDescription: "", // fetch
    longDescription: "", // fetch
    eventCategory: "", // fetch
    facebookLink: "", // fetch
    twitterLink: "", // fetch
    linkedinLink: "", // fetch
    instagramLink: "", // fetch
    eventUrl: "", // fetch
    refundPolicy: "noRefunds",
  });

  const [isLoading, setIsLoading] = useState(true);

  let eventTix = {};

  useEffect(() => {
    // stores original "eventTixOrig" fields
    console.log("eventTixOrig: ", eventTixOrig);
    console.log("JSON.stringify(eventTixOrig): ", JSON.stringify(eventTixOrig));
    localStorage.setItem("eventTixOrig", JSON.stringify(eventTixOrig));

    if (
      queryString.parse(window.location.search).eventID &&
      localStorage.getItem("user")
    ) {
      console.log("there is an event");
      let user = JSON.parse(localStorage.getItem("user")).user._id;
      //console.log("user:", user);
      console.log("user.user._id: ", user);

      // extracts all event data, non-transactional
      const APIURL = "https://www.openseatdirect.com/api";
      const userId = user;
      const eventNum = queryString.parse(window.location.search).eventID;
      let apiurl = `${APIURL}/eventix/${userId}/${eventNum}`;
      console.log("apiurl: ", apiurl);
      fetch(apiurl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        //.then(handleErrors)
        .then((response) => {
          console.log("response in event get", response);
          //console.log("response.json() in event get", response.json());
          return response.json();
        })
        .then((res) => {
          console.log("****res=", res);
          console.log(res);
          eventTix = res;
          loadEventInfo(eventTix[0]);
        })
        .catch((err) => {
          console.log("jumping here", err);
        });
    } else {
      console.log("there is NO event");
    }

    //if (localStorage.getItem("eventTix")) {
  }, []);

  const loadEventInfo = (eventTix) => {
    console.log("Inside 'loadEventInfo': ", loadEventInfo);
    //if (localStorage.getItem("eventTix")) {
    //   eventTix = JSON.parse(localStorage.getItem("eventTix"));
    //   console.log("eventTix: ", eventTix);
    // I don't think that the "event.Tix" filed needs to exist, it will return "undefined"
    let tempDescription = { ...eventDescription };
    tempDescription.eventTitle = eventTix.eventTitle; // fetch
    tempDescription.eventNum = eventTix.eventNum; // fetch
    tempDescription.isDraft = eventTix.isDraft ? eventTix.isDraft : true; // fetch
    tempDescription.eventType = eventTix.eventType
      ? eventTix.eventType
      : "live"; // fetch
    tempDescription.eventUrl = eventTix.eventUrl; // fetch
    tempDescription.webinarLink = eventTix.webinarLink;
    tempDescription.onlineInfo = eventTix.onlineInformation;
    tempDescription.shortDescription = eventTix.shortDescription; // fetch
    tempDescription.longDescription = eventTix.longDescription; // fetch
    tempDescription.eventCategory = eventTix.eventCategory; // fetch
    tempDescription.facebookLink = eventTix.facebookLink; // fetch
    tempDescription.twitterLink = eventTix.twitterLink; // fetch
    tempDescription.linkedinLink = eventTix.linkedinLink; // fetch
    tempDescription.instagramLink = eventTix.instagramLink; // fetch
    tempDescription.refundPolicy = eventTix.refundPolicy
      ? eventTix.refundPolicy
      : "noRefunds"; // fetch
    tempDescription.eventNum = eventTix.eventNum; // fetch
    tempDescription.locationVenueName = eventTix.locationVenueName; // fetch
    tempDescription.locationAddress1 = eventTix.locationAddress1; // fetch
    tempDescription.locationAddress2 = eventTix.locationAddress2; // fetch
    tempDescription.locationNote = eventTix.locationNote; // fetch
    tempDescription.locationCity = eventTix.locationCity; // fetch
    tempDescription.locationState = eventTix.locationState; // fetch
    tempDescription.locationZipPostalCode = eventTix.locationZipPostalCode; // fetch
    tempDescription.locationCountryCode = eventTix.locationCountryCode; // fetch
    tempDescription.timeZone = eventTix.timeZone; // fetch
    /*
      console.log(
        "(2020-06-23T23:00:00.000Z) eventTix.startDateTime: ",
        eventTix.startDateTime
      );

      tempDescription.startDateTime = new Date(eventTix.startDateTime);
      console.log(
        "new Date(eventTix.startDateTime): ",
        tempDescription.startDateTime
      );

      //tempDescription.startDateTime = (new Date(eventTix.startDateTime));
      console.log(
        "new Date(eventTix.startDateTime): ",
        tempDescription.startDateTime.getFullYear()
      );
      console.log(
        "new Date(eventTix.startDateTime): ",
        tempDescription.startDateTime.getDate()
      );
      console.log(
        "new Date(eventTix.startDateTime): ",
        tempDescription.startDateTime.getMonth()
      );
      console.log(
        "new Date(eventTix.startDateTime): ",
        tempDescription.startDateTime.getHours()
      );

      tempDescription.startDate = new Date(tempDescription.startDateTime);
      console.log("tempDescription.startDate: ", tempDescription.startDate);

      tempDescription.startDate = new Date(
        tempDescription.startDateTime.toDateString()
      );
      console.log("tempDescription.startDate: ", tempDescription.startDate);

      let tempNum = tempDescription.startDate.toISOString();
      console.log("tempNum: ", tempNum);

      tempDescription.endDateTime = new Date(eventTix.endDateTime);
      console.log(
        "tempDescription.startDateTime: ",
        tempDescription.endDateTime
      );

      tempDescription.endDate = new Date(
        tempDescription.endDateTime.toDateString()
      );
      console.log("tempDescription.startDate: ", tempDescription.endDate);
*/
    console.log("tempDescription: ", tempDescription);
    setEventDescription(tempDescription);

    // now populate the ticketsDetails variable
    let tempArray = [];
    eventTix.tickets.forEach((tix, index) => {
      console.log("new ticket type");
      console.log("index: ", index);
      console.log("tix.priceFunction: ", tix.priceFunction);
      //tempPriceFunction = tix.priceFunction.form ? tix.priceFunction.form : "none"
      let tempPriceFeature;
      let tempPromoCodes;
      let tempFunctionArgs;
      if (!tix.priceFunction) {
        tempPriceFeature = "none";
        tempPromoCodes = "none";
        tempFunctionArgs = "none";
      } else {
        tempPriceFeature = tix.priceFunction.form;
        if (tempPriceFeature === "promo") {
          tempPromoCodes = tix.priceFunction.args.promocodes;
          tempFunctionArgs = "none";
        } else if (tempPriceFeature === "bogo") {
          tempPromoCodes = "none";
          if (tix.priceFunction.args.discount) {
            tempPriceFeature = "bogod";
            tempFunctionArgs = {
              buy: tix.priceFunction.args.buy,
              get: tix.priceFunction.args.get,
              discount: tix.priceFunction.args.discount * 100,
            };
          } else {
            tempPriceFeature = "bogof";
            tempFunctionArgs = tix.priceFunction.args;
          }
        } else {
          tempFunctionArgs = tix.priceFunction.args;
        }
      }

      let newItem = {
        key: tix.sort ? tix.sort : index, // fetch
        sort: tix.sort ? tix.sort : index, // fetch
        ticketName: tix.ticketName ? tix.ticketName : "", // fetch
        ticketQuantity: "", // fetch NEED TO WAIT FOR ORDERS API
        ticketPrice: tix.currentTicketPrice ? tix.currentTicketPrice : "", // fetch
        currency: tix.currency ? tix.currency : "", // fetch
        settings: false,
        ticketDescription: tix.ticketDescription ? tix.ticketDescription : "", // fetch
        orderMin: tix.minTicketsAllowedPerOrder
          ? tix.minTicketsAllowedPerOrder
          : "", // fetch
        orderMax: tix.maxTicketsAllowedPerOrder
          ? tix.maxTicketsAllowedPerOrder
          : "", // fetch
        priceFeature: tempPriceFeature, // fetch via temp variable
        promoCodes: tempPromoCodes, // fetch via temp variable
        promoCodeNames: [],
        promoCodeWarning: "",
        functionArgs: tempFunctionArgs, // fetch via temp variable
        viewModal: false,
      };
      tempArray.push(newItem);
      console.log("tempArray: ", tempArray);
    });
    setTicketDetails(tempArray);
    // }
  };

  // EVENT DESCRIPTION HANDLERS
  const changeEventDescription = (event) => {
    let tempDescription = { ...eventDescription };
    tempDescription[event.target.name] = event.target.value;
    if (event.target.name === "eventTitle") {
      // updates "eventUrl" whenever "eventTitle" is changed
      tempDescription.eventUrl = event.target.value
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-]/g, "")
        .toLowerCase();
    }
    setEventDescription(tempDescription);
    console.log("Event Description: ", tempDescription);
  };

  const changeEventDate = (day, fieldName) => {
    console.log("day from Date selector: ", day);
    let tempDescription = { ...eventDescription };
    let tempDate = new Date(day.toDateString());
    console.log("tempDate: ", tempDate);
    if (fieldName === "start") {
      tempDescription.startDate = tempDate;
      console.log("start date: ", tempDescription.startDate);
      if (tempDescription.startDate > tempDescription.endDate) {
        tempDescription.endDate = tempDate;
        console.log("end date: ", tempDescription.endDate);
      }
    } else if (fieldName === "end") {
      tempDescription.endDate = tempDate;
      console.log("end date: ", tempDescription.endDate);
    }
    setEventDescription(tempDescription);
    console.log("tempDescription: ", tempDescription);
  };

  const changeCountryCode = (value) => {
    let tempDescription = { ...eventDescription };
    tempDescription.locationCountryCode = value;
    console.log("locationCountryCode: ", value);
    setEventDescription(tempDescription);
  };

  const changeTimeZone = (value) => {
    let tempDescription = { ...eventDescription };
    tempDescription.timeZone = value;
    console.log("Timezone: ", value);
    setEventDescription(tempDescription);
  };

  const changeEventDescriptionRadio = (event, value, name) => {
    let tempDescription = { ...eventDescription };
    tempDescription[name] = value.value;
    setEventDescription(tempDescription);
  };

  const changeEventImage = (image) => {
    //console.log("Received crop: ", crop)
    //console.log("Received pixelCrop: ", pixelCrop)
    console.log("Received image: ", image);
    let tempDescription = { ...eventDescription };
    tempDescription.eventImage = image;
    console.log("temp image: ", tempDescription.eventImage);
    setEventDescription(tempDescription);
  };

  const changeLongDescription = (editorContent) => {
    let tempDescription = { ...eventDescription };
    tempDescription.longDescription = editorContent;
    setEventDescription(tempDescription);
  };

  // TICKET DETAILS HANDLERS
  const changeTicketDetail = (event, id) => {
    let tempDetails = [...ticketDetails];
    tempDetails.forEach((item) => {
      if (item.key === id) {
        item[event.target.name] = event.target.value;
      }
    });
    setTicketDetails(tempDetails);
    console.log("Ticket Details: ", tempDetails);
  };

  const switchTicketSettings = (event, key) => {
    let tempDetails = [...ticketDetails];
    tempDetails.forEach((item) => {
      if (item.key === key) {
        item.settings = !item.settings;
      }
    });
    setTicketDetails(tempDetails);
    console.log("Ticket Details: ", tempDetails);
  };

  const changeArgument = (event, key) => {
    let tempDetails = [...ticketDetails];
    tempDetails.forEach((item) => {
      if (item.key === key) {
        item.functionArgs[event.target.name] = event.target.value;
      }
    });
    setTicketDetails(tempDetails);
    console.log("Ticket Details: ", tempDetails);
  };

  const handleErrors = (response) => {
    if (!response.ok) {
      throw Error(response.status);
      console.log("Error: ", response);
    }
    return response;
  };

  const saveEvent = () => {
    console.log("we are saving");

    let eventData = {
      /*
"dataFields"
  //isDraft: {type: "Boolean", required: true}, // fetch
  //eventType: {type: "String", required: true, enum: ["live", "online", "liveOnline"]}, // fetch
  //eventNum: {type: "Number", required: true}, // fetch
  hasAlwaysBeenDraft: {type: "Boolean", required: true},
  //eventTitle: {type: "String", required: true, maxlength: 64}, // fetch
  //longDescription: {type: "String", maxlength: 100000}, // fetch
  //shortDescription:{type: "String", maxlength: 140}, // fetch
  //startDateTime: {type: "Date", required: true},
  //endDateTime: {type: "Date"},
  //timeZone: {type: "String"}, // fetch
  //locationVenueName: {type: "String", required: true, maxlength: 140}, // fetch
  //locationAddress1:{type: "String", maxlength: 32}, // fetch
  //locationAddress2: {type: "String", maxlength: 32}, // fetch
  //locationCity: {type: "String", maxlength: 32}, // fetch
  //locationState: {type: "String", maxlength: 2}, // fetch
  //locationZipPostalCode: {type: "String", maxlength: 6}, // fetch
  //locationCountryCode: {type: "String", maxlength: 3}, // fetch
  //locationNote: {type: "String", maxlength: 100}, // fetch
  webinarLink
  onlineInfo
  //eventCategory: {type: "String", enum: ["Music", "Sports", "Arts & Theater", "Food & Drink", "Charity & Causes", "Family", "Meeting"]}, // fetch
  createUserId: {type: "ObjectId", required: true},
  updateUserId: {type: "ObjectId"}, accountId: {type: "ObjectId"},
  //facebookLink: {type: "String", maxlength: 64}, // fetch
  //twitterLink: {type: "String", maxlength: 64}, // fetch
  //instagramLink: {type: "String", maxlength: 64}, // fetch
  //linkedinLink: {type: "String", maxlength: 64}, // fetch
  //eventUrl: {type: "String", required: true}, // fetch
  //refundPolicy: ""
  photo: {type: "object"},
  _id: {type: "object"},
  updatedAt: {type: "Date"},
  createdAt: {type: "Date"},
  __v: {type: "Number"},


"eventDescription"
*/
      isDraft: eventDescription.isDraft, // fetch
      eventNum: eventDescription.eventNum, // fetch
      eventTitle: eventDescription.eventTitle, // fetch
      eventType: eventDescription.eventType, // fetch
      webinarLink: eventDescription.webinarLink,
      onlineInformation: eventDescription.onlineInformation,
      locationVenueName: eventDescription.locationVenueName, // fetch
      locationAddress1: eventDescription.locationAddress1, // fetch
      locationAddress2: eventDescription.locationAddress2, // fetch
      locationCity: eventDescription.locationCity, // fetch
      locationState: eventDescription.locationState, // fetch
      locationZipPostalCode: eventDescription.locationZipPostalCode, // fetch
      locationCountryCode: eventDescription.locationCountryCode, // fetch
      locationNote: eventDescription.locationNote, // fetch
      //eventDescription.startDate: new Date(new Date().toDateString()),
      //eventDescription.startTime: "",
      startDateTime: eventDescription.startDateTime,
      //eventDescription.endDate: new Date(new Date().toDateString()),
      //eventDescription.endTime: "",
      endDateTime: eventDescription.endDateTime,
      timeZone: eventDescription.timeZone, // fetch
      //eventDescription.eventImage:, // fetch
      shortDescription: eventDescription.shortDescription, // fetch
      longDescription: eventDescription.longDescription, // fetch
      eventCategory: eventDescription.eventCategory, // fetch
      facebookLink: eventDescription.facebookLink, // fetch
      twitterLink: eventDescription.twitterLink, // fetch
      linkedinLink: eventDescription.linkedinLink, // fetch
      instagramLink: eventDescription.instagramLink, // fetch
      eventUrl: eventDescription.eventUrl, // fetch
      refundPolicy: eventDescription.refundPolicy, // fetch
    };
    console.log("eventData: ", eventData);
    let form = {
      eventTitle: eventDescription.eventTitle,
      locationVenueName: eventDescription.locationVenueName,
      startDateTime: eventDescription.startDate,
      photo:
        eventDescription.eventImage === null
          ? undefined
          : eventDescription.eventImage,
      shortDescription: eventDescription.shortDescription,
      longDescription: eventDescription.longDescription,
    };
    console.log("Form data: ", form);
    let js = JSON.stringify(form);
    console.log("JSON Form data: ", js);
    const authstring =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDlkNzIzN2VjODAwYjZlOTM1NTg4ODgiLCJpYXQiOjE1ODg2ODgwOTJ9.URrxmyn4C4rcl5D4QubreEjRIN16fg4ao86Ym_u1fIc";
    const userid = "5d9d7237ec800b6e93558888";
    const APIURL = "https://www.openseatdirect.com/api";
    let apiurl = `${APIURL}/event/create/${userid}`;
    /*
    fetch(apiurl, {
      method: "post",
      headers: {
        Authorization: authstring,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: js,
      redirect: "follow",
    })
      .then(handleErrors)
      .then((response) => {
        console.log("response in event/create", response);
        return response.json();
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log("**ERROR THROWN", err);
      });
      */
  };

  // STOPPED
  const priceFeatureChangeHandler = (event, value, key) => {
    let tempDetails = [...ticketDetails];
    tempDetails.forEach((item) => {
      if (item.key === key) {
        item.priceFeature = value;
        item.promoCodes = [{ key: "1", name: "", amount: "", percent: "" }];
        item.promoCodeNames = [];
        item.promoCodeWarning = "";
        item.functionArgs = {};
        if (value === "bogof") {
          item.functionArgs = { buy: "", get: "", discount: 1 };
        }
        if (value === "bogod") {
          item.functionArgs = { buy: "", get: "", discount: "" };
        }
        if (value === "twofer") {
          item.functionArgs = { buy: "", for: "" };
        }
      }
    });
    setTicketDetails(tempDetails);
    console.log("Ticket Details: ", ticketDetails);
  };

  const createNewTicketHandler = () => {
    let newTicketKey = Math.floor(Math.random() * 1000000000000000);
    let newPromoKey = Math.floor(Math.random() * 1000000000000000);
    let newItem = {
      key: newTicketKey,
      sort: "",
      ticketName: "",
      ticketQuantity: "",
      ticketPrice: "",
      currency: "",
      settings: false,
      ticketDescription: "",
      orderMin: "",
      orderMax: "",
      priceFeature: "none",
      promoCodes: [{ key: newPromoKey, name: "", amount: "", percent: "" }],
      promoCodeNames: [],
      promoCodeWarning: "",
      functionArgs: {},
      viewModal: false,
    };
    let tempDetails = [...ticketDetails];
    tempDetails.push(newItem);
    setTicketDetails(tempDetails);
  };

  const deleteTicket = (id) => {
    if (ticketDetails.length === 1) {
      setTicketDetails([
        {
          key: "1",
          sort: "",
          ticketName: "",
          ticketQuantity: "",
          ticketPrice: "",
          currency: "",
          settings: false,
          ticketDescription: "",
          orderMin: "",
          orderMax: "",
          priceFeature: "none",
          promoCodes: [{ key: "1", name: "", amount: "", percent: "" }],
          promoCodeNames: [],
          promoCodeWarning: "",
          functionArgs: {},
        },
      ]);
    } else {
      let tempDetails = [...ticketDetails];
      tempDetails.forEach((item, index) => {
        if (item.key === id) {
          tempDetails.splice(index, 1);
        }
      });
      setTicketDetails(tempDetails);
      console.log("Ticket Details: ", tempDetails);
    }
  };

  const deletePromoCode = (event, ticket, promoKey) => {
    if (ticket.promoCodes.length === 1) {
      // delete all promoCode info and set back to default in this specific ticket
      let tempDetails = [...ticketDetails];
      tempDetails.forEach((item, index) => {
        if (item.key === ticket.key) {
          item.promoCodes = [{ key: "1", name: "", amount: "", percent: "" }];
        }
        setTicketDetails(tempDetails);
      });
    } else {
      // delete specifc promoCode in this specific ticket
      let tempDetails = [...ticketDetails];
      tempDetails.forEach((item, index1) => {
        if (item.key === ticket.key) {
          let tempCodes = [...item.promoCodes];
          tempCodes.forEach((code, index2) => {
            if (code.key === promoKey) {
              tempCodes.splice(index2, 1);
            }
            item.promoCodes = tempCodes;
          });
        }
      });
      setTicketDetails(tempDetails);
    }
  };

  const switchPriceFeature = (event, key) => {
    let tempDetails = [...ticketDetails];
    tempDetails.forEach((item) => {
      if (item.key === key) {
        item.priceFeature = "none";
        item.promoCodes = [{ key: "", name: "", amount: "", percent: "" }];
        item.promoCodeNames = [];
        item.promoCodeWarning = "";
        item.functionArgs = {};
      }
    });
    setTicketDetails(tempDetails);
    console.log("Ticket Details: ", tempDetails);
  };

  const addPromoCode = (event, key) => {
    let newPromoKey = Math.floor(Math.random() * 1000000000000000);
    let tempDetails = [...ticketDetails];
    tempDetails.forEach((item) => {
      if (item.key === key) {
        let newPromo = { key: newPromoKey, name: "", amount: "", percent: "" };
        item.promoCodes.push(newPromo);
      }
    });
    setTicketDetails(tempDetails);
    console.log("Ticket Details: ", tempDetails);
  };

  const changePromoCodesName = (event, ticketKey, promoKey) => {
    let tempDetails = [...ticketDetails];
    tempDetails.forEach((item) => {
      if (item.key === ticketKey) {
        let tempCodes = [...item.promoCodes];
        tempCodes.forEach((code) => {
          if (code.key === promoKey) {
            code.name = event.target.value;
          }
        });
        item.promoCodes = tempCodes;
      }
    });
    setTicketDetails(tempDetails);
    console.log("Ticket Details: ", tempDetails);
  };

  const changePromoCodesPercent = (event, ticketKey, promoKey) => {
    let tempDetails = [...ticketDetails];
    tempDetails.forEach((item) => {
      if (item.key === ticketKey) {
        let tempCodes = [...item.promoCodes];
        tempCodes.forEach((code) => {
          if (code.key === promoKey) {
            code.amount = "";
            code.percent = event.target.value;
          }
        });
        item.promoCodes = tempCodes;
      }
    });
    setTicketDetails(tempDetails);
    console.log("Ticket Details: ", tempDetails);
  };

  const changePromoCodesAmount = (event, ticketKey, promoKey) => {
    let tempDetails = [...ticketDetails];
    tempDetails.forEach((item) => {
      if (item.key === ticketKey) {
        let tempCodes = [...item.promoCodes];
        tempCodes.forEach((code) => {
          if (code.key === promoKey) {
            code.percent = "";
            code.amount = event.target.value;
          }
        });
        item.promoCodes = tempCodes;
      }
    });
    setTicketDetails(tempDetails);
    console.log("Ticket Details: ", tempDetails);
  };

  const promoCodesDisplay = (ticket) => {
    let display = (
      <div>
        {ticket.promoCodes.map((item, index) => {
          let finalPrice = "";
          if (item.amount !== "" && item.percent === "") {
            finalPrice = (ticket.ticketPrice - item.amount).toFixed(2);
          } else if (item.percent !== "" && item.amount === "") {
            finalPrice = (
              ticket.ticketPrice *
              (1 - item.percent / 100)
            ).toFixed(2);
          }

          return (
            <Aux key={index}>
              <div
                style={{
                  display: `grid`,
                  gridTemplateColumns: "180px 165px 30px 115px 180px 25px",
                  padding: "0px 10px 0px 35px",
                  boxSizing: "borderBox",
                  backgroundColor: "#E7E7E7",
                  height: "50px",
                  fontSize: "16px",
                }}
              >
                <div
                  style={{
                    padding: "0px 0px 0px 0px",
                    textAlign: "left",
                  }}
                >
                  <input
                    style={{
                      padding: "9px 10px",
                      border: "1px solid lightgrey",
                      boxSizing: "borderBox",
                      textAlign: "left",
                      width: "150px",
                      height: "40px",
                    }}
                    type="text"
                    id="promoName"
                    placeholder="unique name"
                    value={item.name}
                    onChange={(event) => {
                      changePromoCodesName(event, ticket.key, item.key);
                    }}
                  ></input>
                </div>

                <div
                  style={{
                    margin: "0px 10px 20px 0px",
                    border: "1px solid lightgrey",
                    boxSizing: "borderBox",
                    backgroundColor: "white",
                    display: `grid`,
                    gridTemplateColumns: "70px 80px",
                  }}
                >
                  <div
                    style={{
                      padding: "9px 0px 9px 0px",
                      textAlign: "center",
                      boxSizing: "borderBox",
                    }}
                  >
                    {ticket.currency === "" ? "USD $" : ticket.currency}
                  </div>
                  <input
                    style={{
                      padding: "9px 5px 9px 0px",
                      textAlign: "right",
                      border: "0px solid lightgrey",
                      boxSizing: "borderBox",
                    }}
                    type="text"
                    id="promoAmount"
                    placeholder=""
                    value={item.amount}
                    onChange={(event) => {
                      changePromoCodesAmount(event, ticket.key, item.key);
                    }}
                  ></input>
                </div>

                <div style={{ paddingTop: "10px" }}>OR</div>

                <div
                  style={{
                    margin: "0px 10px 20px 0px",
                    border: "1px solid lightgrey",
                    boxSizing: "borderBox",
                    backgroundColor: "white",
                    display: `grid`,
                    width: "90px",
                    gridTemplateColumns: "55px 30px",
                  }}
                >
                  <input
                    style={{
                      padding: "9px 5px 9px 0px",
                      textAlign: "right",
                      border: "0px solid lightgrey",
                      boxSizing: "borderBox",
                    }}
                    type="text"
                    id="promoPercent"
                    placeholder=""
                    value={item.percent}
                    onChange={(event) => {
                      changePromoCodesPercent(event, ticket.key, item.key);
                    }}
                  ></input>
                  <div
                    style={{
                      padding: "9px 0px 9px 0px",
                      textAlign: "center",
                      boxSizing: "borderBox",
                    }}
                  >
                    %
                  </div>
                </div>

                <div
                  style={{
                    padding: "10px 10px 0px 0px",
                    textAlign: "center",
                  }}
                >
                  {finalPrice}
                </div>

                <div
                  style={{
                    padding: "9px 0px 9px 3px",
                    boxSizing: "borderBox",
                    color: "blue",
                  }}
                >
                  <FontAwesomeIcon
                    cursor="pointer"
                    onClick={(event) =>
                      deletePromoCode(event, ticket, item.key)
                    }
                    icon={faTrashAlt}
                  />
                </div>
              </div>
            </Aux>
          );
        })}
      </div>
    );
    return display;
  };

  const priceFeatureSettings = (ticket) => {
    if (ticket.priceFeature === "none") {
      return (
        <Aux>
          <div
            style={{
              height: "35px",
              fontSize: "15px",
              backgroundColor: "#E7E7E7",
              borderTop: "1px solid lightgrey",
              boxSizing: "borderBox",
            }}
          >
            <div
              style={{
                padding: "10px 10px 0px 25px",
                boxSizing: "borderBox",
                fontWeight: 600,
              }}
            >
              Promotional Pricing (
              <span style={{ fontStyle: "italic" }}>optional </span>): please
              select one
            </div>
          </div>
          <div
            style={{
              padding: "5px 10px 0px 30px",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
              height: "30px",
            }}
          >
            <button
              className={classes.PriceFeatureButton}
              onClick={(event) =>
                priceFeatureChangeHandler(event, "promo", ticket.key)
              }
            >
              Promo Code(s)
            </button>
          </div>
          <div
            style={{
              padding: "5px 10px 0px 30px",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
              height: "30px",
            }}
          >
            <button
              className={classes.PriceFeatureButton}
              onClick={(event) =>
                priceFeatureChangeHandler(event, "bogof", ticket.key)
              }
            >
              Buy One Get One Free
            </button>
          </div>
          <div
            style={{
              padding: "5px 10px 0px 30px",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
              height: "30px",
            }}
          >
            <button
              className={classes.PriceFeatureButton}
              onClick={(event) =>
                priceFeatureChangeHandler(event, "bogod", ticket.key)
              }
            >
              Buy One Get One at a Discount
            </button>
          </div>
          <div
            style={{
              padding: "5px 10px 0px 30px",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
              height: "30px",
            }}
          >
            <button
              className={classes.PriceFeatureButton}
              onClick={(event) =>
                priceFeatureChangeHandler(event, "twofer", ticket.key)
              }
            >
              Two for One
            </button>
          </div>
        </Aux>
      );
    } else if (ticket.priceFeature === "promo") {
      return (
        <Aux>
          <div
            style={{
              height: "30px",
              fontSize: "15px",
              backgroundColor: "#E7E7E7",
              borderTop: "1px solid lightgrey",
              boxSizing: "borderBox",
            }}
          >
            <div
              style={{
                padding: "10px 10px 0px 25px",
                boxSizing: "borderBox",
                fontWeight: 600,
              }}
            >
              Promo Codes Price Feature{" "}
              <Popup
                position="right center"
                content="Additional information"
                header="Promo Codes"
                trigger={
                  <FontAwesomeIcon
                    color="blue"
                    cursor="pointer"
                    icon={faInfoCircle}
                  />
                }
              />
            </div>
          </div>

          <div
            style={{
              display: `grid`,
              gridTemplateColumns: "180px 310px 180px",
              padding: "5px 10px 5px 35px",
              height: "30px",
              fontSize: "16px",
              backgroundColor: "#E7E7E7",
              boxSizing: "borderBox",
            }}
          >
            <div
              style={{
                boxSizing: "borderBox",
                fontWeight: 400,
              }}
            >
              Promo Code
            </div>
            <div
              style={{
                boxSizing: "borderBox",
                fontWeight: 400,
              }}
            >
              Discount Amount
            </div>
            <div
              style={{
                boxSizing: "borderBox",
                fontWeight: 400,
              }}
            >
              Current Discounted Price
            </div>
          </div>

          {promoCodesDisplay(ticket)}

          <div
            style={{
              display: `grid`,
              gridTemplateColumns: "250px 250px",
              padding: "5px 10px 5px 35px",
              height: "30px",
              fontSize: "15px",
              backgroundColor: "#E7E7E7",
              boxSizing: "borderBox",
            }}
          >
            <button
              style={{
                padding: "0px",
                fontSize: "15px",
                color: "blue",
                border: "none",
                backgroundColor: "#E7E7E7",
                cursor: "pointer",
                display: "inlineBlock",
                outline: "none",
                textAlign: "left",
              }}
              onClick={(event) => addPromoCode(event, ticket.key)}
            >
              Add additional promo code
            </button>
            <button
              className={classes.FeatureButton}
              style={{ padding: "0px", textAlign: "left" }}
              onClick={(event) => switchPriceFeature(event, ticket.key)}
            >
              Select different promotion
            </button>
          </div>
        </Aux>
      );
    } else if (ticket.priceFeature === "bogof") {
      return (
        <Aux>
          <div
            style={{
              height: "30px",
              fontSize: "15px",
              backgroundColor: "#E7E7E7",
              borderTop: "1px solid lightgrey",
              boxSizing: "borderBox",
            }}
          >
            <div
              style={{
                padding: "10px 10px 0px 25px",
                boxSizing: "borderBox",
                fontWeight: 600,
              }}
            >
              Buy-One-Get-One-Free Price Feature
            </div>
          </div>

          <div
            style={{
              padding: "5px 10px 10px 35px",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
              height: "55px",
              fontSize: "16px",
            }}
          >
            <div>
              Buy{" "}
              <input
                style={{
                  padding: "9px 10px",
                  border: "1px solid lightgrey",
                  boxSizing: "borderBox",
                  width: "100px",
                  height: "40px",
                }}
                type="text"
                id="functionArgBuyBogof"
                placeholder="# of tickets"
                name="buy"
                value={ticket.functionArgs.buy}
                onChange={(event) => {
                  changeArgument(event, ticket.key);
                }}
              ></input>{" "}
              ticket(s) and get{" "}
              <input
                style={{
                  padding: "9px 10px",
                  border: "1px solid lightgrey",
                  boxSizing: "borderBox",
                  width: "100px",
                  height: "40px",
                }}
                type="text"
                id="functionArgGetBogof"
                placeholder="# of tickets"
                name="get"
                value={ticket.functionArgs.get}
                onChange={(event) => {
                  changeArgument(event, ticket.key);
                }}
              ></input>{" "}
              ticket(s) for free.
            </div>
          </div>
          <div
            style={{
              padding: "0px 10px 0px 30px",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
              height: "30px",
            }}
          >
            <button
              className={classes.FeatureButton}
              onClick={(event) => switchPriceFeature(event, ticket.key)}
            >
              Select different promotion
            </button>
          </div>
        </Aux>
      );
    } else if (ticket.priceFeature === "bogod") {
      return (
        <Aux>
          <div
            style={{
              height: "30px",
              fontSize: "15px",
              backgroundColor: "#E7E7E7",
              borderTop: "1px solid lightgrey",
              boxSizing: "borderBox",
            }}
          >
            <div
              style={{
                padding: "10px 10px 0px 25px",
                boxSizing: "borderBox",
                fontWeight: 600,
              }}
            >
              Buy-One-Get-One-for-Discount Price Feature
            </div>
          </div>

          <div
            style={{
              padding: "5px 10px 10px 35px",
              border: "0px solid green",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
              height: "55px",
              fontSize: "16px",
            }}
          >
            <div>
              Buy{" "}
              <input
                style={{
                  padding: "9px 10px",
                  border: "1px solid lightgrey",
                  boxSizing: "borderBox",
                  width: "100px",
                  height: "40px",
                }}
                type="text"
                id="functionArgBuyBogod"
                placeholder="# of tickets"
                name="buy"
                value={ticket.functionArgs.buy}
                onChange={(event) => {
                  changeArgument(event, ticket.key);
                }}
              ></input>{" "}
              ticket(s) and buy an additional{" "}
              <input
                style={{
                  padding: "9px 10px",
                  border: "1px solid lightgrey",
                  boxSizing: "borderBox",
                  width: "100px",
                  height: "40px",
                }}
                type="text"
                id="functionArgGetBogod"
                placeholder="# of tickets"
                name="get"
                value={ticket.functionArgs.get}
                onChange={(event) => {
                  changeArgument(event, ticket.key);
                }}
              ></input>{" "}
              ticket(s) for a{" "}
              <input
                style={{
                  padding: "9px 10px",
                  border: "1px solid lightgrey",
                  boxSizing: "borderBox",
                  width: "100px",
                  height: "40px",
                }}
                type="text"
                id="functionArgDiscountBogod"
                placeholder="percentage"
                name="discount"
                value={ticket.functionArgs.discount}
                onChange={(event) => {
                  changeArgument(event, ticket.key);
                }}
              ></input>{" "}
              discount.
            </div>
          </div>
          <div
            style={{
              padding: "0px 10px 0px 30px",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
              height: "30px",
            }}
          >
            <button
              className={classes.FeatureButton}
              onClick={(event) => switchPriceFeature(event, ticket.key)}
            >
              Select different promotion
            </button>
          </div>
        </Aux>
      );
    } else if (ticket.priceFeature === "twofer") {
      return (
        <Aux>
          <div
            style={{
              height: "30px",
              fontSize: "15px",
              backgroundColor: "#E7E7E7",
              borderTop: "1px solid lightgrey",
              boxSizing: "borderBox",
            }}
          >
            <div
              style={{
                padding: "10px 10px 0px 25px",
                boxSizing: "borderBox",
                fontWeight: 600,
              }}
            >
              Two-for-One Price Feature
            </div>
          </div>

          <div
            style={{
              padding: "5px 10px 10px 35px",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
              height: "55px",
              fontSize: "16px",
            }}
          >
            <div>
              Buy{" "}
              <input
                style={{
                  padding: "9px 10px",
                  border: "1px solid lightgrey",
                  boxSizing: "borderBox",
                  width: "100px",
                  height: "40px",
                }}
                type="text"
                id="functionArgBuy2fer"
                placeholder="# of tickets"
                name="buy"
                value={ticket.functionArgs.buy}
                onChange={(event) => {
                  changeArgument(event, ticket.key);
                }}
              ></input>{" "}
              ticket(s) for the price of{" "}
              <input
                style={{
                  padding: "9px 10px",
                  border: "1px solid lightgrey",
                  boxSizing: "borderBox",
                  width: "100px",
                  height: "40px",
                }}
                type="text"
                id="functionArgFor2fer"
                placeholder="# of tickets"
                name="for"
                value={ticket.functionArgs.for}
                onChange={(event) => {
                  changeArgument(event, ticket.key);
                }}
              ></input>{" "}
              ticket(s).
            </div>
          </div>
          <div
            style={{
              padding: "0px 10px 0px 30px",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
              height: "30px",
            }}
          >
            <button
              className={classes.FeatureButton}
              onClick={(event) => switchPriceFeature(event, ticket.key)}
            >
              Select different promotion
            </button>
          </div>
        </Aux>
      );
    }
  };

  const additionalSettings = (ticket) => {
    return (
      <div>
        <div
          style={{
            height: "30px",
            fontSize: "15px",
            backgroundColor: "#E7E7E7",
            borderTop: "1px solid lightgrey",
            boxSizing: "borderBox",
          }}
        >
          <div
            style={{
              padding: "10px 10px 0px 25px",
              boxSizing: "borderBox",
              fontWeight: 600,
            }}
          >
            Currency
          </div>
        </div>

        <div className={classes.InputBox}>
          <CurrencySelector
            value={ticket.currency === "" ? "default" : ticket.currency}
            name="currency"
            change={(event) => {
              changeTicketDetail(event, ticket.key);
            }}
          />
        </div>

        <div
          style={{
            height: "30px",
            fontSize: "15px",
            backgroundColor: "#E7E7E7",
            borderTop: "1px solid lightgrey",
            boxSizing: "borderBox",
          }}
        >
          <div
            style={{
              padding: "10px 10px 0px 25px",
              boxSizing: "borderBox",
              fontWeight: 600,
            }}
          >
            Ticket Description
          </div>
        </div>
        <div
          style={{
            padding: "5px 10px 10px 25px",
            height: "110px",
            boxSizing: "borderBox",
            backgroundColor: "#E7E7E7",
          }}
        >
          <textarea
            style={{
              padding: "9px 10px",
              border: "1px solid lightgrey",
              boxSizing: "borderBox",
              lineHeight: "1.75",
              fontSize: "16px",
              width: "600px",
              height: "95px",
              resize: "vertical",
            }}
            type="text"
            id="ticketDescription"
            placeholder="Brief description of ticket and what it includes: limit 1000 characters"
            name="ticketDescription"
            value={ticket.ticketDescription}
            onChange={(event) => {
              changeTicketDetail(event, ticket.key);
            }}
          ></textarea>
        </div>

        <div
          style={{
            height: "30px",
            fontSize: "15px",
            backgroundColor: "#E7E7E7",
            borderTop: "1px solid lightgrey",
            borderBottom: "0px solid lightgrey",
            boxSizing: "borderBox",
          }}
        >
          <div
            style={{
              padding: "10px 10px 0px 25px",
              boxSizing: "borderBox",
              fontWeight: 600,
            }}
          >
            Tickets Allowed per Order
          </div>
        </div>

        <div
          style={{
            display: `grid`,
            gridTemplateColumns: "300px 300px",
            padding: "5px 10px 10px 35px",
            boxSizing: "borderBox",
            backgroundColor: "#E7E7E7",
            height: "55px",
            fontSize: "16px",
          }}
        >
          <div>
            Minimum{" "}
            <input
              style={{
                padding: "9px 10px",
                border: "1px solid lightgrey",
                boxSizing: "borderBox",
                width: "100px",
                height: "40px",
              }}
              type="text"
              id="orderMin"
              placeholder="# of tickets"
              name="orderMin"
              value={ticket.orderMin}
              onChange={(event) => {
                changeTicketDetail(event, ticket.key);
              }}
            ></input>{" "}
            ticket(s)
          </div>
          <div>
            Maximum{" "}
            <input
              style={{
                padding: "9px 10px",
                border: "1px solid lightgrey",
                boxSizing: "borderBox",
                width: "100px",
                height: "40px",
              }}
              type="text"
              id="orderMax"
              placeholder="# of tickets"
              name="orderMax"
              value={ticket.orderMax}
              onChange={(event) => {
                changeTicketDetail(event, ticket.key);
              }}
            ></input>{" "}
            ticket(s)
          </div>
        </div>

        {priceFeatureSettings(ticket)}
        <div
          style={{
            padding: "5px",
            borderTop: "1px solid lightgrey",
            height: "30px",
            textAlign: "center",
          }}
        >
          <button
            style={{
              fontSize: "15px",
              color: "blue",
              border: "none",
              backgroundColor: "white",
              cursor: "pointer",
              display: "inlineBlock",
              outline: "none",
            }}
            onClick={(event) => switchTicketSettings(event, ticket.key)}
          >
            ^ Minimize features
          </button>
        </div>
      </div>
    );
  };

  const activateShowModal = (ticket) => {
    let tempDetails = [...ticketDetails];
    tempDetails.forEach((item) => {
      if (item.key === ticket.key) {
        item.viewModal = true;
      } else {
        item.viewModal = false;
      }
    });
    setTicketDetails(tempDetails);
    console.log("Ticket Details: ", tempDetails);
  };

  const deactivateShowModal = (ticket) => {
    let tempDetails = [...ticketDetails];
    tempDetails.forEach((item) => {
      item.viewModal = false;
    });
    setTicketDetails(tempDetails);
    console.log("Ticket Details: ", tempDetails);
  };

  const [dragging, setDragging] = useState(false);

  const dragItem = useRef();
  const dragNode = useRef();

  const handleDragStart = (event, index) => {
    console.log("Dragging");
    console.log("Index: ", index);
    dragItem.current = index;
    console.log("dragItem.current: ", dragItem.current);
    console.log("event.target ", event.target);
    dragNode.current = event.target;
    console.log("dragNode.current: ", dragNode.current);
    dragNode.current.addEventListener("dragend", handleDragEnd);
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnd = () => {
    console.log("Ending Drag...");
    dragNode.current.removeEventListener("dragend", handleDragEnd);
    setDragging(false);
    dragItem.current = null;
    dragNode.current = null;
  };

  const handleDragEnter = (event, index) => {
    console.log("Entering handleDragEnter");
    console.log("event.target ", event.target);
    console.log("dragNode.current ", dragNode.current);
    console.log("index ", index);
    console.log("dragItem.current ", dragItem.current);

    if (index !== dragItem.current) {
      console.log("DIFFERENT TARGET");
      console.log("dragItem.current: ", dragItem.current);
      console.log("ticketDetails: ", ticketDetails);

      const currentItem = dragItem.current;
      setTicketDetails((oldDetails) => {
        let newDetails = JSON.parse(JSON.stringify(oldDetails));
        console.log("newDetails: ", newDetails);
        console.log("newDetails[index]: ", newDetails[index]);
        newDetails.splice(index, 0, newDetails.splice(currentItem, 1)[0]);
        console.log("newDetails: ", newDetails);
        dragItem.current = index;
        console.log("ticketDetails: ", ticketDetails);
        return newDetails;
      });
    } else {
      console.log("SAME TARGET");
    }
  };

  const ticketTypeDisplay = (index) => {
    let display = (
      <Aux>
        {ticketDetails.map((item, index) => {
          return (
            <div key={index}>
              <div
                className={
                  dragging && dragItem.current === index
                    ? classes.DraggedTicketBox
                    : classes.TicketBox
                }
              >
                <div
                  style={{
                    padding: "10px 5px",
                    boxSizing: "borderBox",
                    display: `grid`,
                    gridTemplateColumns: "20px 330px",
                  }}
                >
                  <div
                    draggable
                    onDragStart={(event) => handleDragStart(event, index)}
                    onDragEnter={
                      dragging ? (event) => handleDragEnter(event, index) : null
                    }
                    style={{
                      padding: "9px 0px 9px 3px",
                      boxSizing: "borderBox",
                    }}
                  >
                    <FontAwesomeIcon cursor="pointer" icon={faGripVertical} />
                  </div>
                  <input
                    style={{
                      padding: "9px 10px",
                      border: "1px solid lightgrey",
                      boxSizing: "borderBox",
                    }}
                    type="text"
                    id="ticketName"
                    placeholder="GA, VIP, etc: limit 32 characters"
                    name="ticketName"
                    value={item.ticketName}
                    onChange={(event) => {
                      changeTicketDetail(event, item.key);
                    }}
                  ></input>
                </div>

                <div
                  style={{
                    padding: "10px 5px",
                    boxSizing: "borderBox",
                  }}
                >
                  <input
                    style={{
                      padding: "9px 10px",
                      border: "1px solid lightgrey",
                      boxSizing: "borderBox",
                      width: "90px",
                      height: "40px",
                    }}
                    type="text"
                    id="ticketQuantity"
                    placeholder="100"
                    name="ticketQuantity"
                    value={item.ticketQuantity}
                    onChange={(event) => {
                      changeTicketDetail(event, item.key);
                    }}
                  ></input>
                </div>

                <div
                  style={{
                    margin: "10px 5px",
                    border: "1px solid lightgrey",
                    boxSizing: "borderBox",
                    display: `grid`,
                    gridTemplateColumns: "70px 80px",
                  }}
                >
                  <div
                    style={{
                      padding: "9px 0px 9px 0px",
                      textAlign: "center",
                      boxSizing: "borderBox",
                    }}
                  >
                    {item.currency === "" ? "USD $" : item.currency}
                  </div>
                  <input
                    style={{
                      padding: "9px 5px 9px 0px",
                      textAlign: "right",
                      border: "0px solid lightgrey",
                      boxSizing: "borderBox",
                    }}
                    type="text"
                    id="ticketPice"
                    placeholder="10.00"
                    name="ticketPrice"
                    value={item.ticketPrice}
                    onChange={(event) => {
                      changeTicketDetail(event, item.key);
                    }}
                  ></input>
                </div>

                <div
                  style={{
                    padding: "20px 5px",
                    boxSizing: "borderBox",
                    textAlign: "center",
                  }}
                >
                  <FontAwesomeIcon
                    color="blue"
                    cursor="pointer"
                    onClick={(event) => switchTicketSettings(event, item.key)}
                    icon={faCog}
                  />
                </div>
                <div
                  style={{
                    padding: "20px 5px",
                    boxSizing: "borderBox",
                    textAlign: "center",
                  }}
                >
                  <FontAwesomeIcon
                    color="blue"
                    cursor="pointer"
                    onClick={() => {
                      activateShowModal(item);
                      console.log("Ticket Detail: ", ticketDetails);
                    }}
                    icon={faTrashAlt}
                  />
                </div>
              </div>
              {item.viewModal ? (
                <Aux>
                  <Modal
                    show={true}
                    details={item}
                    closeModal={() => {
                      deactivateShowModal(item);
                    }}
                    deleteTicket={() => {
                      console.log("Delete ticket", item.ticketName);
                      console.log("Ticket key", item.key);
                      deleteTicket(item.key);
                    }}
                  ></Modal>
                </Aux>
              ) : null}
              {item.settings ? additionalSettings(item) : null}
            </div>
          );
        })}
      </Aux>
    );
    return display;
  };

  const [eventTitleWarning, setEventTitleWarning] = useState(false);
  const [shortDescriptionWarning, setShortDescriptionWarning] = useState(false);
  const [eventLocationWarning, setEventLocationWarning] = useState(false);
  const [eventAddress1Warning, setEventAddress1Warning] = useState(false);
  const [eventAddress2Warning, setEventAddress2Warning] = useState(false);
  const [eventAdditionalWarning, setEventAdditionalWarning] = useState(false);

  const displayMessage = (limit, variable) => {
    if (variable.length >= limit) {
      return (
        <div
          style={{
            paddingLeft: "10px",
            height: "14px",
            color: "red",
            fontSize: "12px",
            fontWeight: "700",
          }}
        >
          Maximum characters used
        </div>
      );
    } else if (variable.length >= limit - 10) {
      return (
        <div
          style={{
            paddingLeft: "10px",
            height: "14px",
            color: "red",
            fontSize: "12px",
          }}
        >
          Remaining {limit - variable.length}
        </div>
      );
    } else {
      return (
        <div
          style={{
            paddingLeft: "10px",
            height: "14px",
            color: "black",
            fontSize: "12px",
          }}
        >
          Remaining {limit - variable.length}
        </div>
      );
    }
  };

  const eventTypeList = [
    { label: "Live Event only", value: "live" },
    { label: "Online Event only", value: "online" },
    { label: "Both Live and Online Event", value: "liveOnline" },
  ];

  const refundPolicyList = [
    {
      label:
        "1 day: Attendees can receive refunds up to 1 day before your event start date.",
      value: "1day",
    },
    {
      label:
        "7 days: Attendees can receive refunds up to 7 days before your event start date.",
      value: "7days",
    },
    {
      label:
        "30 days: Attendees can receive refunds up to 30 days before your event start date.",
      value: "30days",
    },
    {
      label:
        "Undefined: I will respond to attendee refund requests on a case by case basis.",
      value: "unknown",
    },
    { label: "No refunds: No refunds at any time.", value: "noRefunds" },
  ];

  return (
    <div className={classes.MainContainer}>
      <div className={classes.MainGrid}>
        <div className={classes.GridTitle}>
          {!eventDescription.eventNum ? (
            <div style={{ paddingTop: "10px" }}>Event Creation</div>
          ) : (
            <div style={{ paddingTop: "10px" }}>
              <div>
                Event Edit:{" "}
                <span style={{ fontSize: "26px", fontWeight: "500" }}>
                  {eventDescription.eventNum} -{" "}
                  {eventDescription.isDraft === true ? (
                    <span style={{ color: "green" }}>DRAFT</span>
                  ) : (
                    <span style={{ color: "red" }}>LIVE</span>
                  )}
                </span>
              </div>
            </div>
          )}
          <div className={classes.ButtonBox}>
            <button
              className={classes.Button}
              style={{ border: "2px solid green", color: "green" }}
              onClick={saveEvent}
            >
              Save
            </button>
          </div>
          <div className={classes.ButtonBox}>
            <button
              className={classes.Button}
              style={{ border: "2px solid blue", color: "blue" }}
            >
              Preview
            </button>
          </div>
          <div className={classes.ButtonBox}>
            <button
              className={classes.Button}
              style={{ border: "2px solid red", color: "red" }}
            >
              Go Live!
            </button>
          </div>
        </div>

        <div className={classes.CategoryTitle} style={{ width: "140px" }}>
          Event Details
        </div>
        <div style={{ border: "1px solid grey" }}>
          <div className={classes.SectionTitleTight}>Event Title</div>

          <div className={classes.InputBox}>
            <input
              className={classes.InputBoxContent}
              style={{ width: "600px" }}
              onFocus={() => setEventTitleWarning(true)}
              onBlur={() => setEventTitleWarning(false)}
              type="text"
              id="eventTitle"
              maxLength="75"
              placeholder="Short title of event: limit 75 characters"
              name="eventTitle"
              value={eventDescription.eventTitle}
              onChange={(event) => {
                changeEventDescription(event);
              }}
            ></input>
            {eventTitleWarning
              ? displayMessage(75, eventDescription.eventTitle)
              : null}
          </div>

          <div className={classes.SectionTitle}>
            Event Type: please select one
          </div>
          <RadioForm
            details={eventTypeList}
            group="eventTypeGroup"
            current={eventDescription.eventType}
            change={(event, value) =>
              changeEventDescriptionRadio(event, value, "eventType")
            }
          />

          {eventDescription.eventType === "live" ||
          eventDescription.eventType === "liveOnline" ? (
            <Aux>
              <div className={classes.SectionTitleTight}>Event Location</div>

              <div className={classes.InputBoxTight}>
                <input
                  className={classes.InputBoxContent}
                  style={{ width: "600px" }}
                  onFocus={() => setEventLocationWarning(true)}
                  onBlur={() => setEventLocationWarning(false)}
                  type="text"
                  id="locationVenueName"
                  maxLength="140"
                  name="locationVenueName"
                  placeholder="Venue Name: limit 140 characters"
                  value={eventDescription.locationVenueName}
                  onChange={(event) => {
                    changeEventDescription(event);
                  }}
                ></input>
                {eventLocationWarning
                  ? displayMessage(140, eventDescription.locationVenueName)
                  : null}
              </div>

              <div className={classes.InputBoxTight}>
                <input
                  className={classes.InputBoxContent}
                  style={{ width: "600px" }}
                  onFocus={() => setEventAddress1Warning(true)}
                  onBlur={() => setEventAddress1Warning(false)}
                  type="text"
                  id="locationAddress1"
                  name="locationAddress1"
                  maxLength="32"
                  placeholder="Address1: limit 32 characters"
                  value={eventDescription.locationAddress1}
                  onChange={(event) => {
                    changeEventDescription(event);
                  }}
                ></input>
                {eventAddress1Warning
                  ? displayMessage(32, eventDescription.locationAddress1)
                  : null}
              </div>

              <div className={classes.InputBoxTight}>
                <input
                  className={classes.InputBoxContent}
                  style={{ width: "600px" }}
                  onFocus={() => setEventAddress2Warning(true)}
                  onBlur={() => setEventAddress2Warning(false)}
                  type="text"
                  id="locationAddress2"
                  name="locationAddress2"
                  maxLength="32"
                  placeholder="Address2: limit 32 characters"
                  value={eventDescription.locationAddress2}
                  onChange={(event) => {
                    changeEventDescription(event);
                  }}
                ></input>
                {eventAddress2Warning
                  ? displayMessage(32, eventDescription.locationAddress2)
                  : null}
              </div>

              <div className={classes.InputBoxTight}>
                <input
                  className={classes.InputBoxContent}
                  style={{ width: "600px" }}
                  type="text"
                  id="locationCity"
                  placeholder="City"
                  value={eventDescription.locationCity}
                  onChange={(event) => {
                    let tempDescription = { ...eventDescription };
                    tempDescription.locationCity = event.target.value;
                    setEventDescription(tempDescription);
                  }}
                ></input>
              </div>

              <div
                className={classes.InputBoxTight}
                style={{
                  display: `grid`,
                  gridTemplateColumns: "300px 300px",
                }}
              >
                <input
                  className={classes.InputBoxContent}
                  style={{ width: "295px" }}
                  type="text"
                  id="locationState"
                  placeholder="State/Province"
                  value={eventDescription.locationState}
                  onChange={(event) => {
                    let tempDescription = { ...eventDescription };
                    tempDescription.locationState = event.target.value;
                    setEventDescription(tempDescription);
                  }}
                ></input>

                <input
                  className={classes.InputBoxContent}
                  style={{ width: "300px" }}
                  type="text"
                  id="locationPostalCode"
                  placeholder="Zip/Postal"
                  value={eventDescription.locationZipPostalCode}
                  onChange={(event) => {
                    let tempDescription = { ...eventDescription };
                    tempDescription.locationZipPostalCode = event.target.value;
                    setEventDescription(tempDescription);
                  }}
                ></input>
              </div>

              <div className={classes.InputBoxTight}>
                <CountrySelector
                  className={classes.InputBoxContent}
                  style={{ width: "600px" }}
                  current={eventDescription.locationCountryCode}
                  defaultValue="United States of America"
                  getCountry={changeCountryCode}
                />
              </div>

              <div className={classes.InputBox}>
                <input
                  className={classes.InputBoxContent}
                  style={{ width: "600px" }}
                  onFocus={() => setEventAdditionalWarning(true)}
                  onBlur={() => setEventAdditionalWarning(false)}
                  type="text"
                  id="locationAddressAdditional"
                  maxLength="64"
                  placeholder="Notes: 'e.g. Enter through backdoor' limit 64 characters"
                  value={eventDescription.locationNote}
                  onChange={(event) => {
                    let tempDescription = { ...eventDescription };
                    tempDescription.locationNote = event.target.value;
                    setEventDescription(tempDescription);
                  }}
                ></input>
                {eventAdditionalWarning
                  ? displayMessage(64, eventDescription.locationNote)
                  : null}
              </div>
            </Aux>
          ) : null}

          {eventDescription.eventType === "online" ||
          eventDescription.eventType === "liveOnline" ? (
            <Aux>
              <div className={classes.SectionTitleTight}>
                Online Information
              </div>

              <div className={classes.InputBoxTight}>
                <input
                  className={classes.InputBoxContent}
                  style={{ width: "600px" }}
                  type="text"
                  id="webinarLink"
                  maxLength="256"
                  placeholder="Webinar Link: limit 256 characters"
                  value={eventDescription.webinarLink}
                  onChange={(event) => {
                    let tempDescription = { ...eventDescription };
                    tempDescription.webinarLink = event.target.value;
                    setEventDescription(tempDescription);
                  }}
                ></input>
              </div>

              <div className={classes.InputBox}>
                <input
                  className={classes.InputBoxContent}
                  style={{ width: "600px" }}
                  type="text"
                  id="onlineInformation"
                  maxLength="256"
                  placeholder="Additional Instructions: limit 256 characters"
                  value={eventDescription.onlineInformation}
                  onChange={(event) => {
                    let tempDescription = { ...eventDescription };
                    tempDescription.onlineInformation = event.target.value;
                    setEventDescription(tempDescription);
                  }}
                ></input>
              </div>
            </Aux>
          ) : null}

          <div className={classes.SectionTitle}>Event Dates and Time</div>
          <div className={classes.DateTimeHeader}>
            <div>Start Date</div>
            <div>Start Time</div>
            <div>End Date</div>
            <div>End Time</div>
            <div>Time Zone</div>
          </div>

          <div className={classes.DateTimeInputs}>
            <DateSelector
              type={"startDate"}
              startDate={eventDescription.startDate}
              current={eventDescription.startDate}
              change={(date) => changeEventDate(date, "start")}
              beforeDate={new Date()}
            />
            <TimeSelector
              value={eventDescription.startTime}
              name="startTime"
              change={(event) => {
                console.log("event.target.value: ", event.target.value);
                changeEventDescription(event);
              }}
              startDate={eventDescription.startDate}
              startTime={eventDescription.startTime}
              endDate={eventDescription.endDate}
            />
            <DateSelector
              type={"endDate"}
              startDate={eventDescription.startDate}
              current={eventDescription.endDate}
              change={(date) => changeEventDate(date, "end")}
              beforeDate={eventDescription.startDate}
            />
            <TimeSelector
              value={eventDescription.startTime}
              name="endTime"
              change={(event) => changeEventDescription(event)}
              startDate={parseInt(eventDescription.startDate)}
              startTime={parseInt(eventDescription.startTime)}
              endDate={eventDescription.endDate}
            />
            <TimeZoneSelector
              getTimeZone={changeTimeZone}
              current={eventDescription.timeZone}
              defaultValue="Eastern Time - New York"
            />
          </div>

          <div className={classes.SectionTitleTight}>
            Event Image{" "}
            <Popup
              position="right center"
              content="Additional information"
              header="Event Image"
              trigger={
                <FontAwesomeIcon
                  color="blue"
                  cursor="pointer"
                  icon={faInfoCircle}
                />
              }
            />
          </div>

          <div
            style={{
              height: "227px",
              fontSize: "16px",
              padding: "5px 10px 10px 25px",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
            }}
          >
            <ImgDropAndCrop icon="create image" change={changeEventImage} />
          </div>

          <div className={classes.SectionTitleTight}>
            Event Short Description
          </div>
          <div className={classes.TextBox}>
            <textarea
              style={{
                padding: "9px 10px",
                border: "1px solid lightgrey",
                boxSizing: "borderBox",
                lineHeight: "1.75",
                height: "80px",
                width: "600px",
                resize: "vertical",
              }}
              onFocus={() => setShortDescriptionWarning(true)}
              onBlur={() => setShortDescriptionWarning(false)}
              type="text"
              id="shortDescription"
              maxLength="140"
              placeholder="Short description of event for social media posts: limit 140 characters"
              name="shortDescription"
              value={eventDescription.shortDescription}
              onChange={(event) => {
                changeEventDescription(event);
              }}
            ></textarea>
            {shortDescriptionWarning
              ? displayMessage(140, eventDescription.shortDescription)
              : null}
          </div>

          <div className={classes.SectionTitleTight}>
            Event Long Description
          </div>
          <div
            style={{
              padding: "5px 270px 10px 25px",
              border: "0px solid green",
              boxSizing: "borderBox",
              height: "auto",
              backgroundColor: "#E7E7E7",
            }}
          >
            <Editor
              apiKey="ttpinnmm4af9xd288fuugwgjzwm9obqnitncxdeutyvvqhba"
              onEditorChange={changeLongDescription}
              initialValue={eventTix.longDescription}
              plugins="wordcount autoresize"
              init={{
                toolbar:
                  "undo redo | fontsizeselect fontselect | bold italic underline | forecolor ",
                toolbar_items_size: "small",
                autoresize_bottom_margin: 0,
                padding: "0 0 0 0",
                min_height: 250,
                max_height: 400,
                icons: "jam",
                skin: "fabric",
                resize: true,
                menubar: "edit format",
              }}
            />
          </div>

          <div className={classes.SectionTitleTight}>Event Category</div>
          <div className={classes.InputBox}>
            <CategorySelector
              value={eventDescription.eventCategory}
              onChange={changeEventDescription}
            />
          </div>

          <div className={classes.SectionTitleTight}>
            Event Specific Social Media Links
          </div>
          <div className={classes.SocialMediaLink} style={{ height: "45px" }}>
            <FontAwesomeIcon
              className={classes.SocialMediaIcon}
              style={{ color: "#43609c" }}
              icon={faFacebook}
            />
            <div className={classes.SocialMediaName}>facebook.com/ </div>
            <input
              className={classes.InputBoxContent}
              style={{ width: "400px" }}
              type="text"
              id="facebookLink"
              placeholder="your facebook address"
              name="facebookLink"
              value={eventDescription.facebookLink}
              onChange={(event) => {
                changeEventDescription(event);
              }}
            ></input>
          </div>

          <div className={classes.SocialMediaLink} style={{ height: "45px" }}>
            <FontAwesomeIcon
              className={classes.SocialMediaIcon}
              style={{ color: "#0084b4" }}
              icon={faTwitter}
            />
            <div className={classes.SocialMediaName}>twitter.com/ </div>
            <input
              className={classes.InputBoxContent}
              style={{ width: "400px" }}
              type="text"
              id="twitterLink"
              placeholder="your twitter address"
              name="twitterLink"
              value={eventDescription.twitterLink}
              onChange={(event) => {
                changeEventDescription(event);
              }}
            ></input>
          </div>

          <div className={classes.SocialMediaLink} style={{ height: "45px" }}>
            <FontAwesomeIcon
              className={classes.SocialMediaIcon}
              style={{ color: "#0e76a8" }}
              icon={faLinkedin}
            />
            <div className={classes.SocialMediaName}>linkedin.com/ </div>
            <input
              className={classes.InputBoxContent}
              style={{ width: "400px" }}
              type="text"
              id="linkedinLink"
              placeholder="your linkedin address"
              name="linkedinLink"
              value={eventDescription.linkedinLink}
              onChange={(event) => {
                changeEventDescription(event);
              }}
            ></input>
          </div>

          <div className={classes.SocialMediaLink} style={{ height: "55px" }}>
            <FontAwesomeIcon
              className={classes.SocialMediaIcon}
              style={{ color: "#8a3ab9" }}
              icon={faInstagram}
            />
            <div className={classes.SocialMediaName}>instagram.com/ </div>
            <input
              className={classes.InputBoxContent}
              style={{ width: "400px" }}
              type="text"
              id="instagramLink"
              placeholder="your instagram address"
              name="instagramLink"
              value={eventDescription.instagramLink}
              onChange={(event) => {
                changeEventDescription(event);
              }}
            ></input>
          </div>

          <div className={classes.SectionTitleTight}>
            Customize OpenSeatDirect Vanity URL
          </div>
          <div
            style={{
              display: `grid`,
              gridTemplateColumns: "220px 300px",
              height: "55px",
              fontSize: "16px",
              padding: "5px 10px 10px 35px",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
            }}
          >
            <div className={classes.SocialMediaName}>
              www.openseatdirect.com/et/{" "}
            </div>
            <input
              className={classes.InputBoxContent}
              style={{ width: "400px" }}
              type="text"
              id="eventUrl"
              placeholder="vanity address for Event Description page url"
              name="eventUrl"
              value={eventDescription.eventUrl}
              onChange={(event) => {
                changeEventDescription(event);
              }}
            ></input>
          </div>
        </div>

        <br></br>
        <div className={classes.CategoryTitle} style={{ width: "160px" }}>
          Ticket Creation
        </div>

        <div style={{ border: "1px solid grey" }}>
          <div
            style={{
              display: `grid`,
              gridTemplateColumns: "360px 100px 165px 80px",
              height: "40px",
              fontSize: "15px",
              backgroundColor: "#E7E7E7",
              boxSizing: "borderBox",
            }}
          >
            <div
              style={{
                padding: "10px 10px 10px 25px",
                boxSizing: "borderBox",
                fontWeight: 600,
              }}
            >
              Ticket Name
            </div>

            <div
              style={{
                padding: "10px 10px 10px 5px",
                boxSizing: "borderBox",
                fontWeight: 600,
              }}
            >
              Quantity
            </div>

            <div
              style={{
                padding: "10px 10px 10px 5px",
                boxSizing: "borderBox",
                fontWeight: 600,
              }}
            >
              Price
            </div>

            <div
              style={{
                padding: "10px 10px 10px 5px",
                boxSizing: "borderBox",
                fontWeight: 600,
              }}
            >
              Features
            </div>
          </div>
          {ticketTypeDisplay()}

          <div
            style={{
              padding: "10px 5px 10px 5px",
              borderTop: "1px solid lightgrey",
              boxSizing: "borderBox",
              height: "56px",
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            <Button
              content="Add a ticket"
              icon="add circle"
              color="green"
              onClick={createNewTicketHandler}
            />
          </div>
        </div>

        <br></br>
        <div className={classes.CategoryTitle} style={{ width: "195px" }}>
          Additional Settings
        </div>
        <div style={{ border: "1px solid grey" }}>
          <div className={classes.SectionTitle}>
            Refund Policy: please select one
          </div>
          <RadioForm
            details={refundPolicyList}
            group="refundGroup"
            current={eventDescription.refundPolicy}
            change={(event, value) =>
              changeEventDescriptionRadio(event, value, "refundPolicy")
            }
          />
        </div>
        <div style={{ margin: "auto", textAlign: "center" }}>
          <div className={classes.GridBottom}>
            <div className={classes.ButtonBox}>
              <button
                className={classes.Button}
                style={{ border: "2px solid green", color: "green" }}
                onClick={saveEvent}
              >
                Save
              </button>
            </div>
            <div className={classes.ButtonBox}>
              <button
                className={classes.Button}
                style={{ border: "2px solid blue", color: "blue" }}
              >
                Preview
              </button>
            </div>
            <div className={classes.ButtonBox}>
              <button
                className={classes.Button}
                style={{ border: "2px solid red", color: "red" }}
              >
                Go Live!
              </button>
            </div>
          </div>
        </div>
        <div>{ReactHtmlParser(eventDescription.longDescription)}</div>
      </div>
    </div>
  );
};

export default EventCreation;
