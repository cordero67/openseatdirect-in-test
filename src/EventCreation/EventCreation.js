import React, { useState, useRef, useEffect } from "react";
import queryString from "query-string";

import { API } from "../config";

import { extractImageFileExtensionFromBase64 } from "../ImgDropAndCrop/ResuableUtils";

import { Editor } from "@tinymce/tinymce-react";
import DateSelector from "./DateSelector";
import TimeSelector from "./TimeSelector";
import TimeZoneSelector from "./TimeZoneSelector";
import CountrySelector from "./CountrySelector";
import CurrencySelector from "./CurrencySelector";
import CategorySelector from "./CategorySelector";
import RadioForm from "./RadioForm";
import ImgDropAndCrop from "../ImgDropAndCrop/ImgDropAndCrop";

import TicketModal from "./Modals/TicketModal";
import SavedModal from "./Modals/SavedModal";

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

// holds sign-in information
let vendorInfo = {};

const EventCreation = () => {
  // stores all Event Description variables
  const [eventDescription, setEventDescription] = useState({
    eventNum: undefined,
    eventTitle: undefined,
    isDraft: true,
    eventType: "live",
    webinarLink: undefined,
    onlineInformation: undefined,
    tbaInformation: undefined,
    locationVenueName: undefined,
    locationAddress1: undefined,
    locationAddress2: undefined,
    locationCity: undefined,
    locationState: undefined,
    locationZipPostalCode: undefined,
    locationCountryCode: "US",
    locationNote: undefined,
    startDate: new Date(new Date().toDateString()),
    startTime: undefined,
    startDateTime: undefined,
    endDate: new Date(new Date().toDateString()),
    endTime: undefined,
    endDateTime: undefined,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    eventImage: undefined,
    shortDescription: undefined,
    longDescription: undefined,
    eventCategory: undefined,
    facebookLink: undefined,
    twitterLink: undefined,
    linkedinLink: undefined,
    instagramLink: undefined,
    vanityLink: undefined,
    refundPolicy: "noRefunds",
  });

  // stores all Ticket Details variables
  const [ticketDetails, setTicketDetails] = useState([
    {
      key: "1",
      sort: undefined,
      _id: undefined,
      ticketName: undefined,
      remainingQuantity: undefined,
      currentTicketPrice: undefined,
      currency: "",
      settings: false,
      ticketDescription: undefined,
      minTicketsAllowedPerOrder: undefined,
      maxTicketsAllowedPerOrder: undefined,
      priceFeature: "none",
      promoCodes: [
        { key: "1", name: undefined, amount: undefined, percent: false },
      ],
      promoCodeNames: [],
      promoCodeWarning: undefined,
      functionArgs: {},
      viewModal: false,
      nameWarning: false
    },
  ]);

  const [photoData, setPhotoData] = useState({
    imgSrc: "",
    imgSrcExt: "",
  });

  const [eventStatus, setEventStatus] = useState({
    status: "",
    savedMessage: "Congratulations, your event was saved!",
    liveMessage: "Congratulations, your event is live!",
    errorMessage: "Sorry, your event request cannot be prossessed.",
    subMessage: "What next!",
    eventNum: "",
    isDraft: true,
  });

  //const [isLoading, setIsLoading] = useState(false);

  let eventTix = {};

  useEffect(() => {
    // checks if 'user' exists in local storage
    //setIsLoading(true);

    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      // loads sign-in data
      let tempUser = JSON.parse(localStorage.getItem("user"));
      vendorInfo.token = tempUser.token;
      vendorInfo.id = tempUser.user._id;
    } else {
      window.location.href = "/signin";
    }

    // checks if an 'eventNum' is in url
    if (
      queryString.parse(window.location.search).eventID &&
      localStorage.getItem("user")
    ) {
      console.log("an event exists");
      // retrieves all non-transactional event data,
      const userId = vendorInfo.id;
      const token = vendorInfo.token;
      const eventNum = queryString.parse(window.location.search).eventID;
      let apiurl = `${API}/eventix/${userId}/${eventNum}`;
      console.log("apiurl: ", apiurl);
      fetch(apiurl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then(handleErrors)
        .then((response) => response.json())
        .then((res) => {
          console.log("res: ", res);
          console.log("about to call image api");
          const url = `${API}/event/photo/e/${eventNum}`;
          fetch(url, {
            method: "GET",
            redirect: "follow",
          })
            .then((response) => {
              console.log("event image from server: ", response);
              return response.arrayBuffer();
            })
            .then((buffer) => {
              console.log("response.arrayBuffer():");
              console.log(buffer);
              const uint8 = new Uint8Array(buffer);
              let bin = "";
              const len = uint8.byteLength;
              for (let i = 0; i < len; i++)
                bin += String.fromCharCode(uint8[i]);
              const header = "data:image/png;base64,"; // hard codes image/png
              const photodat = header + window.btoa(bin);
              const srcExt = extractImageFileExtensionFromBase64(photodat);
              
              // *******************
              // needs to be removed
              // temporarily not storing the photo
              let noPhoto = "";
              loadEventInfo(res, noPhoto);
              //loadEventInfo(res, photodat);
              
              console.log("photodat for imgSrc:", photodat);
              console.log("photodat for srcExt:", srcExt);
              setPhotoData({
                imgSrc: photodat,
                imgSrcExt: srcExt,
              });
            })
            .catch((err) => {
              console.log("Image not found", err);
              let tempPhoto = "";
              loadEventInfo(res, tempPhoto);
            });
        })
        .catch((err) => {
          console.log("This event does not exist", err);
          // since no event info is loaded, the page acts as "Event Creation"

        });
    } else {
      console.log("an event does not exists");
    }
    //setIsLoading(false);
  }, []);

  const loadEventInfo = (eventTix, photo) => {
    console.log("Inside 'loadEventInfo': ", loadEventInfo);
    let tempDescription = { ...eventDescription };
    tempDescription.eventTitle = eventTix.eventTitle;
    tempDescription.eventNum = eventTix.eventNum;
    tempDescription.isDraft = eventTix.isDraft;
    tempDescription.eventType = eventTix.eventType
      ? eventTix.eventType
      : "live";
    tempDescription.vanityLink = eventTix.vanityLink;
    tempDescription.webinarLink = eventTix.webinarLink;
    tempDescription.onlineInformation = eventTix.onlineInformation;
    tempDescription.tbaInformation = eventTix.tbaInformation;
    tempDescription.shortDescription = eventTix.shortDescription;
    tempDescription.longDescription = eventTix.longDescription;
    tempDescription.eventCategory = eventTix.eventCategory;
    tempDescription.facebookLink = eventTix.facebookLink;
    tempDescription.twitterLink = eventTix.twitterLink;
    tempDescription.linkedinLink = eventTix.linkedinLink;
    tempDescription.instagramLink = eventTix.instagramLink;
    tempDescription.refundPolicy = eventTix.refundPolicy
      ? eventTix.refundPolicy
      : "noRefunds";
    tempDescription.eventNum = eventTix.eventNum;
    tempDescription.locationVenueName = eventTix.locationVenueName;
    tempDescription.locationAddress1 = eventTix.locationAddress1;
    tempDescription.locationAddress2 = eventTix.locationAddress2;
    tempDescription.locationNote = eventTix.locationNote;
    tempDescription.locationCity = eventTix.locationCity;
    tempDescription.locationState = eventTix.locationState;
    tempDescription.locationZipPostalCode = eventTix.locationZipPostalCode;
    tempDescription.locationCountryCode = eventTix.locationCountryCode;
    tempDescription.timeZone = eventTix.timeZone;
    tempDescription.eventImage = photo;
    console.log("eventImage: ", tempDescription.eventImage);

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

    console.log("eventTix.tickets: ", eventTix.tickets);
    // now populate the ticketsDetails variable
    if (eventTix.tickets && eventTix.tickets.length !== 0) {
      let tempArray = [];
      eventTix.tickets.forEach((tix, index) => {
        console.log("in ticket #: ", index);
        let tempPriceFeature = "none";
        let tempPromoCodes = [];
        let tempPromoCodesArray = [];
        let tempFunctionArgs;
        if (tix.priceFunction && tix.priceFunction.form) {
          tempPriceFeature = tix.priceFunction.form;
          if (tempPriceFeature === "promo") {
            console.log("priceFunction: ", tix.priceFunction);
            console.log("tix.priceFunction.args: ", tix.priceFunction.args);
            tempPromoCodes = tix.priceFunction.args;
            tempPromoCodes.map((promo, index) => {
              let element = {
                key: index,
                name: promo.name,
                amount: promo.amount,
                percent: promo.percent,
              };
              tempPromoCodesArray.push(element);
            });
          } else if (tempPriceFeature === "bogo") {
            tempFunctionArgs = {
              buy: tix.priceFunction.args.buy,
              get: tix.priceFunction.args.get,
              discount: tix.priceFunction.args.discount,
            };
            if (tix.priceFunction.args.discount === 100) {
              tempPriceFeature = "bogof";
            }
            if (tix.priceFunction.args.discount !== 100) {
              tempPriceFeature = "bogod";
            }
          } else if (tempPriceFeature === "twofer") {
            tempFunctionArgs = {
              buy: tix.priceFunction.args.buy,
              for: tix.priceFunction.args.for,
            };
          }
        }
        console.log("tempPromoCodes before setting newItem: ", tempPromoCodes);
        let newItem = {
          key: tix.sort ? tix.sort : index,
          sort: tix.sort ? tix.sort : index,
          _id: tix._id,
          ticketName: tix.ticketName,
          remainingQuantity: tix.remainingQuantity, // fetch NEED TO WAIT FOR ORDERS API
          currentTicketPrice: tix.currentTicketPrice,
          currency: tix.currency ? tix.currency : "USD",
          settings: false,
          ticketDescription: tix.ticketDescription,
          minTicketsAllowedPerOrder: tix.minTicketsAllowedPerOrder,
          maxTicketsAllowedPerOrder: tix.maxTicketsAllowedPerOrder,
          priceFeature: tempPriceFeature,
          promoCodes: tempPromoCodesArray,
          promoCodeNames: [],
          promoCodeWarning: null, //NEED TO POPULATE!!!
          functionArgs: tempFunctionArgs,
          viewModal: false,
        };
        tempArray.push(newItem);
        console.log("tempArray: ", tempArray);
      });
      setTicketDetails(tempArray);
    }
  };

  const saveEvent = async (status) => {
    console.log("status: ", status);

    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      // loads sign-in data
      let tempUser = JSON.parse(localStorage.getItem("user"));
      vendorInfo.token = tempUser.token;
      vendorInfo.id = tempUser.user._id;
    } else {
      window.location.href = "/signin";
    }


    if (!eventDescription.eventTitle) {
      console.log("You need to complete these fields");
      !eventDescription.eventTitle
        ? setEventTitleOmission(true)
        : setEventTitleOmission(false);
    } else {
      let eventDescriptionFields = [
        "isDraft",
        "eventNum",
        "eventTitle",
        "eventType",
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
        "longDescription",
        "eventCategory",
        "facebookLink",
        "twitterLink",
        "linkedinLink",
        "instagramLink",
        "vanityLink",
        "refundPolicy",
      ];

      var formData = new FormData();

      eventDescriptionFields.forEach((field) => {
        if (eventDescription[field]) {
          formData.append(`${field}`, eventDescription[field]);
          console.log(
            "this is the input: ",
            `${field}`,
            `${eventDescription[field]}`
          );
        }
      });

      // THIS NEEDS TO BE CHANGED TO "startDateTime: eventDescription.startDateTime"
      formData.append("startDateTime", eventDescription.startDate);
      // THIS NEEDS TO BE CHANGED TO "endDateTime: eventDescription.endDateTime"
      formData.append("endDateTime", eventDescription.endDate);

      let imageBlob = null;
      if (eventDescription.eventImage) {
        console.log("eventDescription.eventImage: ", eventDescription.eventImage)
        imageBlob = await new Promise((resolve) =>
          eventDescription.eventImage.toBlob(resolve, "image/png")
        );
        formData.append("photo", imageBlob);
      } else {
        console.log("there is no image");
      }
      let ticketDetailsFields = [
        "ticketName",
        "remainingQuantity",
        "currentTicketPrice",
        "ticketDescription",
        "maxTicketsAllowedPerOrder",
        "minTicketsAllowedPerOrder",
        "_id",
      ];

      ticketDetails.forEach((ticket, index) => {
        //console.log("ticket #: index");
        if (
          ticket.ticketName &&
          ticket.remainingQuantity &&
          ticket.currentTicketPrice
        ) {
          //console.log("adding ticket ", index);
          formData.append(`tickets[${index}][sort]`, 10 + 10 * index);

          if (ticket.currency) {
            formData.append(
              `tickets[${index}][currency]`,
              ticket.currency.slice(0, 3)
            );
          }

          ticketDetailsFields.forEach((field) => {
            if (ticket[field]) {
              formData.append(`tickets[${index}][${field}]`, ticket[field]);
            }
          });

          // for "bogod" and "bogof"
          if (
            ticket.priceFeature === "bogod" ||
            ticket.priceFeature === "bogof"
          ) {
            formData.append(`tickets[${index}][priceFunction][form]`, "bogo");
            formData.append(
              `tickets[${index}][priceFunction][args][buy]`,
              ticket.functionArgs.buy
            );
            formData.append(
              `tickets[${index}][priceFunction][args][get]`,
              ticket.functionArgs.get
            );
            formData.append(
              `tickets[${index}][priceFunction][args][discount]`,
              ticket.functionArgs.discount
            );
          }
          // for "twofer"
          if (ticket.priceFeature === "twofer") {
            formData.append(`tickets[${index}][priceFunction][form]`, "twofer");
            formData.append(
              `tickets[${index}][priceFunction][args][buy]`,
              ticket.functionArgs.buy
            );
            formData.append(
              `tickets[${index}][priceFunction][args][for]`,
              ticket.functionArgs.for
            );
          }
          // for "promo"
          if (ticket.priceFeature === "promo") {
            formData.append(`tickets[${index}][priceFunction][form]`, "promo");
            ticket.promoCodes.map((item, number) => {
              console.log(
                "New promo details: key-",
                item.key,
                ", name-",
                item.name,
                ", amount-",
                item.amount,
                ", percent-",
                item.percent
              );
              formData.append(
                `tickets[${index}][priceFunction][args[${number}]][key]`,
                item.key
              );
              formData.append(
                `tickets[${index}][priceFunction][args[${number}]][name]`,
                item.name
              );
              formData.append(
                `tickets[${index}][priceFunction][args[${number}]][amount]`,
                item.amount
              );
              formData.append(
                `tickets[${index}][priceFunction][args[${number}]][percent]`,
                item.percent
              );
            });
          }
        }
        else {
          console.log("skipped ticket ", index);
        }

      });

      // Display the key/value pairs
      for (var pair of formData.entries()) {
        //console.log(pair[0] + ", " + pair[1]);
      }

      let userid = vendorInfo.id;

      //let userid = "5ebad880b70b9045faa9c111"
      //let userid = "5ebad880b70b9045faa9c537"
      console.log("userid: ", userid);
      let token = vendorInfo.token;
      console.log("token: ", token);
      const authstring = `Bearer ${token}`;
      var myHeaders = new Headers();
      myHeaders.append("Authorization", authstring);

      let apiurl;

      if (eventDescription.eventNum) {
        console.log("editting an existing event");
        apiurl = `${API}/eventix/${userid}/${eventDescription.eventNum}`;
        console.log("apiurl: ", apiurl);
      } else {
        console.log("creating a new event");
        apiurl = `${API}/eventix/${userid}`;
        console.log("apiurl: ", apiurl);
      }

      fetch(apiurl, {
        method: "post",
        headers: myHeaders,
        body: formData,
        redirect: "follow",
      })
        .then(handleErrors)
        .then((response) => {
          console.log("response in event/create", response);
          return response.json();
        })
        .then((res) => {
          console.log("Event was saved/went live");
          console.log("res: ", res);

          let tempDescription = { ...eventDescription };
          let tempStatus = { ...eventStatus };
          tempStatus.eventNum = res.result.eventNum;
          
          if (status === "save") {
            tempDescription.isDraft = true;
            tempStatus.status = "saved";
          } else if (status === "live") {
            tempDescription.isDraft = false;
            tempStatus.status = "live";
          }
          setEventDescription(tempDescription);
          setEventStatus(tempStatus);
        })
        .catch((err) => {
          console.log("**ERROR THROWN", err);
          let tempStatus = { ...eventStatus };
          tempStatus.status = "declined";
          tempStatus.eventNum = "";
          setEventStatus(tempStatus);
        });
      }
    }

  const savedDisplayed = () => {
    console.log("inside savedDisplay");
    console.log("savedDisplay: ", eventStatus);
    if (eventStatus.status === "declined") {
      return (
        <Aux>
          <SavedModal
            show={true}
            details={eventStatus}
            toDashboard={() => {
              window.location.href = `/vendorevents`;
            }}
            editEvent={() => {
              let tempStatus = { ...eventStatus };
              tempStatus.status = "";
              tempStatus.eventNum = "";
              tempStatus.isDraft = true;
              setEventStatus(tempStatus);
            }}
            tryAgain={() => {
              // window.location.href = `/ed/${eventDescription.eventUrl}?eventID=${eventDescription.eventNum}`;
              // deactivateShowModal(item);
            }}
          ></SavedModal>
        </Aux>
      );
    } else if (
      eventStatus.status === "saved" ||
      eventStatus.status === "live"
    ) {
      return (
        <Aux>
          <SavedModal
            show={true}
            details={eventStatus}
            toDashboard={() => {
              window.location.href = `/vendorevents`;
            }}
            createEvent={() => {
              window.location.href = `/eventcreation`;
            }}
            editEvent={() => {
              let tempStatus = { ...eventStatus };
              tempStatus.status = "";
              tempStatus.eventNum = "";
              tempStatus.isDraft = true;
              setEventStatus(tempStatus);
            }}
          ></SavedModal>
        </Aux>
      );
    } else return null;
  };

  // EVENT DESCRIPTION HANDLERS
  const changeEventDescription = (event) => {
    let tempDescription = { ...eventDescription };
    tempDescription[event.target.name] = event.target.value;
    if (event.target.name === "eventTitle") {
      // updates "vanityLink" whenever "eventTitle" is changed
      tempDescription.vanityLink = event.target.value
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

  const changeEventImage = async (image) => {
    //console.log("Received crop: ", crop)
    //console.log("Received pixelCrop: ", pixelCrop)
    console.log("Received image: ", image);
    let imageBlob;
    imageBlob = await new Promise((resolve) =>
      image.toBlob(resolve, "image/png")
    );
    console.log("Convert image: ", imageBlob);
    let tempDescription = { ...eventDescription };
    tempDescription.eventImage = imageBlob;
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

  // STOPPED
  const priceFeatureChangeHandler = (event, value, key) => {
    let tempDetails = [...ticketDetails];
    tempDetails.forEach((item) => {
      if (item.key === key) {
        item.priceFeature = value;
        item.promoCodes = [{ key: "1", name: "", amount: "", percent: false }];
        item.promoCodeNames = [];
        item.promoCodeWarning = "";
        item.functionArgs = {};
        if (value === "bogof") {
          item.functionArgs = { buy: "", get: "", discount: 100 };
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
      _id: "",
      ticketName: "",
      remainingQuantity: "",
      currentTicketPrice: "",
      currency: "",
      settings: false,
      ticketDescription: "",
      minTicketsAllowedPerOrder: "",
      maxTicketsAllowedPerOrder: "",
      priceFeature: "none",
      promoCodes: [{ key: newPromoKey, name: "", amount: "", percent: false }],
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
          _id: "",
          ticketName: "",
          remainingQuantity: "",
          currentTicketPrice: "",
          currency: "",
          settings: false,
          ticketDescription: "",
          minTicketsAllowedPerOrder: "",
          maxTicketsAllowedPerOrder: "",
          priceFeature: "none",
          promoCodes: [{ key: "1", name: "", amount: "", percent: false }],
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
          item.promoCodes = [
            { key: "1", name: "", amount: "", percent: false },
          ];
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
        item.promoCodes = [{ key: "", name: "", amount: "", percent: false }];
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
        let newPromo = {
          key: newPromoKey,
          name: "",
          amount: "",
          percent: false,
        };
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
            code.amount = event.target.value;
            code.percent = true;
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
            code.amount = event.target.value;
            code.percent = false;
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
          console.log("item: ", item);
          console.log("item.amount: ", item.amount);
          let finalPrice = "";
          if (item.percent === false) {
            finalPrice = (ticket.currentTicketPrice - item.amount).toFixed(2);
          } else if (item.percent === true) {
            finalPrice = (
              ticket.currentTicketPrice *
              (1 - item.amount / 100)
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
                    value={!item.percent ? item.amount : ""}
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
                    value={item.percent ? item.amount : ""}
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
              id="minTicketsAllowedPerOrder"
              placeholder="# of tickets"
              name="minTicketsAllowedPerOrder"
              value={ticket.minTicketsAllowedPerOrder}
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
              id="maxTicketsAllowedPerOrder"
              placeholder="# of tickets"
              name="maxTicketsAllowedPerOrder"
              value={ticket.maxTicketsAllowedPerOrder}
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

  // garuantees that only one ticket has a "true" "viewModal" value
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

  // clears "viewModal" value for all tickets
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
                    id="remainingQuantity"
                    placeholder="100"
                    name="remainingQuantity"
                    value={item.remainingQuantity}
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
                    id="currentTicketPrice"
                    placeholder="10.00"
                    name="currentTicketPrice"
                    value={item.currentTicketPrice}
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
                  <TicketModal
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
                  ></TicketModal>
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
  const [eventTitleOmission, setEventTitleOmission] = useState(false);
  const [shortDescriptionWarning, setShortDescriptionWarning] = useState(false);
  const [eventLocationWarning, setEventLocationWarning] = useState(false);
  const [eventAddress1Warning, setEventAddress1Warning] = useState(false);
  const [eventAddress2Warning, setEventAddress2Warning] = useState(false);
  const [eventStateWarning, setEventStateWarning] = useState(false);
  const [eventAdditionalWarning, setEventAdditionalWarning] = useState(false);
  const [webinarLinkWarning, setWebinarLinkWarning] = useState(false);
  const [webinarInfoWarning, setWebinarInfoWarning] = useState(false);
  const [tbaInfoWarning, setTbaInfoWarning] = useState(false);
  const [vanityWarning, setVanityWarning] = useState(false);



  

  //const [eventAdditionalWarning, setEventAdditionalWarning] = useState(false);

  const displayMessage = (limit, variable) => {
    if (variable && variable.length >= limit) {
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
    } else if (variable && variable.length >= limit - 10) {
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
    } else if (variable) {
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
          Remaining {limit}
        </div>
      );
    }
  };

  const eventTypeList = [
    { label: "Live Event", value: "live" },
    { label: "Online Event only", value: "online" },
    { label: "To be announced", value: "tba" },
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

  const imageCanvas = () => {
    //if (isLoading || !eventDescription.eventNum) {
    //  return null
    //} else {
    //  console.log("eventDescription.eventNum: ", eventDescription.eventNum)
    return (
      <ImgDropAndCrop
        icon="create image"
        info={photoData}
        event={eventDescription.eventNum}
        change={(image) => {
          console.log("image: ", image);
          console.log("typeof image: ", typeof image);

          let tempDescription = { ...eventDescription };
          tempDescription.eventImage = image;
          setEventDescription(tempDescription);
          console.log(
            "tempDescription.eventImage: ",
            tempDescription.eventImage
          );
        }}
      />
    );
    //}
  };

  return (
    <div className={classes.MainContainer}>
      <div className={classes.MainGrid}>
        {savedDisplayed()}
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
          <div></div>
          <Button
            style={{
              marginTop: "5px",
              width: "130px",
              height: "30px",
              textAlign: "center",
              paddingTop: "7px",
            }}
            content="Save as Draft"
            basic
            color="green"
            onClick={() => {
              let tempDescription = { ...eventDescription };
              tempDescription.isDraft = true;
              setEventDescription(tempDescription);
              saveEvent("save");
            }}
          />
          <Button
            style={{
              marginTop: "5px",
              width: "130px",
              height: "30px",
              textAlign: "center",
              paddingTop: "7px",
            }}
            content="Go Live Now"
            basic
            color="red"
            onClick={() => {
              let tempDescription = { ...eventDescription };
              tempDescription.isDraft = false;
              setEventDescription(tempDescription);
              saveEvent("live");
            }}
          />
        </div>

        <div className={classes.CategoryTitle} style={{ width: "140px" }}>
          Event Details
        </div>
        <div style={{ border: "1px solid grey" }}>
          <div className={classes.SectionTitleTight}>
            Event Title<span style={{ color: "red" }}>*</span>
          </div>
          <div className={classes.InputBox}>
            <input
              className={
                eventTitleOmission
                  ? classes.InputBoxContentError
                  : classes.InputBoxContent
              }
              style={{ width: "600px" }}
              onFocus={() => {
                setEventTitleWarning(true);
                setEventTitleOmission(false);
              }}
              onBlur={() => {
                setEventTitleWarning(false);
                setEventTitleOmission(false);
              }}
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
            {eventTitleOmission ? (
              <div
                style={{
                  paddingLeft: "10px",
                  height: "14px",
                  color: "red",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                This is a required field
              </div>
            ) : null}
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

          {eventDescription.eventType === "live" ? (
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
                  onFocus={() => setEventStateWarning(true)}
                  onBlur={() => setEventStateWarning(false)}
                  type="text"
                  id="locationState"
                  maxLength="2"
                  placeholder="State/Province 2 digit code"
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
                
                {eventStateWarning
                  ? displayMessage(2, eventDescription.locationState)
                  : null}
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
              <div className={classes.SectionTitleTight}>
                Online Information
              </div>

              <div className={classes.InputBoxTight}>
                <input
                  className={classes.InputBoxContent}
                  style={{ width: "600px" }}
                  onFocus={() => setWebinarLinkWarning(true)}
                  onBlur={() => setWebinarLinkWarning(false)}
                  type="text"
                  id="webinarLink"
                  maxLength="64"
                  placeholder="Webinar Link: limit 64 characters"
                  value={eventDescription.webinarLink}
                  onChange={(event) => {
                    let tempDescription = { ...eventDescription };
                    tempDescription.webinarLink = event.target.value;
                    setEventDescription(tempDescription);
                  }}
                ></input>
                {webinarLinkWarning
                  ? displayMessage(64, eventDescription.webinarLink)
                  : null}
              </div>

              <div className={classes.InputBox}>
                <input
                  className={classes.InputBoxContent}
                  style={{ width: "600px" }}
                  onFocus={() => setWebinarInfoWarning(true)}
                  onBlur={() => setWebinarInfoWarning(false)}
                  type="text"
                  id="onlineInformation"
                  maxLength="128"
                  placeholder="Additional Instructions: limit 128 characters"
                  value={eventDescription.onlineInformation}
                  onChange={(event) => {
                    let tempDescription = { ...eventDescription };
                    tempDescription.onlineInformation = event.target.value;
                    setEventDescription(tempDescription);
                  }}
                ></input>
                {webinarInfoWarning
                  ? displayMessage(128, eventDescription.onlineInformation)
                  : null}
              </div>
            </Aux>
          ) : null}

          {eventDescription.eventType === "online" ? (
            <Aux>
              <div className={classes.SectionTitleTight}>
                Online Information
              </div>

              <div className={classes.InputBoxTight}>
                <input
                  className={classes.InputBoxContent}
                  style={{ width: "600px" }}
                  onFocus={() => setWebinarLinkWarning(true)}
                  onBlur={() => setWebinarLinkWarning(false)}
                  type="text"
                  id="webinarLink"
                  maxLength="64"
                  placeholder="Webinar Link: limit 64 characters"
                  value={eventDescription.webinarLink}
                  onChange={(event) => {
                    let tempDescription = { ...eventDescription };
                    tempDescription.webinarLink = event.target.value;
                    setEventDescription(tempDescription);
                  }}
                ></input>
                {webinarLinkWarning
                  ? displayMessage(64, eventDescription.webinarLink)
                  : null}
              </div>

              <div className={classes.InputBox}>
                <input
                  className={classes.InputBoxContent}
                  style={{ width: "600px" }}
                  onFocus={() => setWebinarInfoWarning(true)}
                  onBlur={() => setWebinarInfoWarning(false)}
                  type="text"
                  id="onlineInformation"
                  maxLength="128"
                  placeholder="Additional Instructions: limit 128 characters"
                  value={eventDescription.onlineInformation}
                  onChange={(event) => {
                    let tempDescription = { ...eventDescription };
                    tempDescription.onlineInformation = event.target.value;
                    setEventDescription(tempDescription);
                  }}
                ></input>
                {webinarInfoWarning
                  ? displayMessage(128, eventDescription.onlineInformation)
                  : null}
              </div>
            </Aux>
          ) : null}

          {eventDescription.eventType === "tba" ? (
            <Aux>
              <div className={classes.SectionTitleTight}>
                To be announced information
              </div>

              <div className={classes.InputBox}>
                <input
                  className={classes.InputBoxContent}
                  style={{ width: "600px" }}
                  onFocus={() => setTbaInfoWarning(true)}
                  onBlur={() => setTbaInfoWarning(false)}
                  type="text"
                  id="tbaInformation"
                  maxLength="128"
                  placeholder="Additional Instructions: limit 128 characters"
                  value={eventDescription.tbaInformation}
                  onChange={(event) => {
                    let tempDescription = { ...eventDescription };
                    tempDescription.tbaInformation = event.target.value;
                    setEventDescription(tempDescription);
                  }}
                ></input>
                {tbaInfoWarning
                  ? displayMessage(128, eventDescription.tbaInformation)
                  : null}
              </div>
            </Aux>
          ) : null}

          <div className={classes.SectionTitle}>Event Dates and Time</div>
          <div className={classes.DateTimeHeader}>
            <div>
              Start Date<span style={{ color: "red" }}>*</span>
            </div>
            <div>
              Start Time<span style={{ color: "red" }}>*</span>
            </div>
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
            {imageCanvas()}
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
              initialValue={eventDescription.longDescription}
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
              gridTemplateColumns: "220px 500px",
              height: "45px",
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
              style={{ width: "500px" }}
              onFocus={() => setVanityWarning(true)}
              onBlur={() => setVanityWarning(false)}
              type="text"
              id="vanityLink"
              maxLength="75"
              placeholder="vanity url: limit 75 characters"
              name="vanityLink"
              value={eventDescription.vanityLink}
              onChange={(event) => {
                let tempDescription = { ...eventDescription };
                tempDescription.vanityLink = event.target.value;
                setEventDescription(tempDescription);
              }}
            ></input>
          </div>

          <div
            style={{
              display: `grid`,
              gridTemplateColumns: "220px 500px",
              height: "18px",
              fontSize: "10px",
              padding: "0px 10px 0px 35px",
              boxSizing: "borderBox",
              backgroundColor: "#E7E7E7",
            }}
          >
            <div>{" "}</div>
            {vanityWarning
              ? displayMessage(75, eventDescription.vanityLink)
              : null}
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
              Ticket Name<span style={{ color: "red" }}>*</span>
            </div>

            <div
              style={{
                padding: "10px 10px 10px 5px",
                boxSizing: "borderBox",
                fontWeight: 600,
              }}
            >
              Quantity<span style={{ color: "red" }}>*</span>
            </div>

            <div
              style={{
                padding: "10px 10px 10px 5px",
                boxSizing: "borderBox",
                fontWeight: 600,
              }}
            >
              Price<span style={{ color: "red" }}>*</span>
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
            <div></div>
            <Button
              style={{
                marginTop: "5px",
                width: "130px",
                height: "30px",
                textAlign: "center",
                paddingTop: "7px",
              }}
              content="Save as Draft"
              basic
              color="green"
              onClick={() => {
                saveEvent(true);
              }}
            />
            <Button
              style={{
                marginTop: "5px",
                width: "130px",
                height: "30px",
                textAlign: "center",
                paddingTop: "7px",
              }}
              content="Go Live Now"
              basic
              color="red"
              onClick={() => {
                saveEvent(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCreation;

// <ImgDropAndCrop icon="create image" change={changeEventImage} />

/*           
            <div className={classes.ButtonBox}>
              <button
                className={classes.Button}
                style={{ border: "2px solid blue", color: "blue" }}
                onClick={saveEvent}
              >
                Preview
              </button>
            </div>


          <div className={classes.ButtonBox}>
            <button
              className={classes.Button}
              style={{ border: "2px solid blue", color: "blue" }}
              onClick={() => saveEvent(true)}
            >
              Preview
            </button>
          </div>

*/
