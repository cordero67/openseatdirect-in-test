import React, { useState, useRef, useEffect, Fragment } from "react";

import dateFnsFormat from "date-fns/format";

import { API } from "../config";

import { loadEventInfo } from "./EventCreationFunctions.js";

import { extractImageFileExtensionFromBase64 } from "./ImgDropAndCrop/ResuableUtils";

import SavedModal from "./Modals/SavedModal";
import EventDetails from "./Components/EventDetails";
import TicketCreation from "./TicketCreation";
import AdditionalSettings from "./Components/AdditionalSettings";
import Spinner from "../components/UI/Spinner/Spinner";

import classes from "./EditEvent.module.css";

// holds sign-in information
//let vendorInfo = {};

const EventEdit = (props) => {
  const [vendorInfo, setVendorInfo] = useState({});
  const [display, setDisplay] = useState("spinner"); // spinner, main

  const [eventTitleOmission, setEventTitleOmission] = useState(false);
  const [locationVenueNameOmission, setLocationVenueNameOmission] =
    useState(false);
  const [webinarLinkOmission, setWebinarLinkOmission] = useState(false);
  const [tbaInformationOmission, setTbaInformationOmission] = useState(false);
  const [pageErrors, setPageErrors] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [windowWidth, setWindowWidth] = useState([]);
  //
  // determines resized width and height of window
  window.onresize = function (event) {
    console.log(window.innerWidth, window.innerHeight);
    setWindowWidth(window.innerWidth);
  };
  //
  //
  //
  // stores all original Event Description variables
  const [originalEventDescription, setOriginalEventDescription] = useState({});

  // stores all Event Description variables
  const [eventDescription, setEventDescription] = useState({
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
    endDate: new Date(new Date().toDateString()), //duped with "createEvent"
    endTime: "20:00:00", //duped with "createEvent"
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, //duped with "createEvent"
    media_id: "",
    ////    photo: "", // ONLY USED IN CREATEEVENT
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
  });

  const [eventLongDescription, setEventLongDescription] = useState("");

  const [initialEventDescription, setInitialEventDescription] = useState("");

  // stores all Ticket Details variables//all duped with "createEvent"
  const [ticketDetails, setTicketDetails] = useState([
    {
      key: "1",
      sort: "",
      _id: "",
      ticketName: "",
      nameWarning: false,
      remainingQuantity: "",
      quantityWarning: false,
      currentTicketPrice: "",
      priceWarning: false,
      reqWarning: false,
      currency: "",
      settings: false,
      ticketDescription: "",
      minTicketsAllowedPerOrder: "",
      minWarning: false,
      maxTicketsAllowedPerOrder: "",
      maxWarning: false,
      priceFeature: "none",
      promoCodes: [{ key: "1", name: "", amount: "", percent: false }],
      promoCodeNames: [],
      promoCodeWarning: "",
      functionArgs: {},
      viewModal: false,
    },
  ]);

  //  const [eventImage, setEventImage] = useState({
  //    imgSrc: null,
  //    imgFile: "",
  //    percentCrop: {},
  //    photoMetaData: {},
  //    isLoaded: false,
  //  }); // special case

  const [photoData, setPhotoData] = useState({
    imgSrc: null,
    imgFile: "",
    percentCrop: {},
    photoMetaData: {},
    isLoaded: false,
  }); // special case

  //  const [photoData, setPhotoData] = useState({
  //    imgSrc: null,
  //    imgSrcExt: null,
  //    isLoaded: false,
  //  });

  //START MATCHES "CreateEvent"
  const [eventStatus, setEventStatus] = useState({
    status: "", // "processing", "saved", "live", "error", "failure"
    savedMessage: "Congratulations, your event was saved!",
    liveMessage: "Congratulations, your event is live!",
    errorMessage: "", //["Please fix input errors and resubmit."],
    failureMessage: "System error please try again.",
  });
  //

  const initPhotoData = async (photoMetaData) => {
    console.log("in initPhotoData w ", photoMetaData);
    // converts data from server fetch call to photodata for image display

    let eventImg = photoMetaData?.url
      ? await urlContentToDataUri(photoMetaData.url)
      : null;
    //eventImg  = {status:true, image: imgSrc};
    // check for required fields
    console.log("got eventImg>>", eventImg);
    if (!(eventImg && eventImg.status)) {
      setPhotoData({ isLoaded: true });
    } else {
      let percentCrop = {
        x: photoMetaData.xp0,
        y: photoMetaData.yp0,
        width: photoMetaData.wp,
        height: photoMetaData.hp,
      };
      setPhotoData({
        imgSrc: eventImg.data,
        isLoaded: true,
        percentCrop: percentCrop,
      });
    }
    return;
  };

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      // loads sign-in data
      let tempUser = JSON.parse(localStorage.getItem("user"));
      let tempVendorInfo = vendorInfo;
      tempVendorInfo.token = tempUser.token;
      tempVendorInfo.id = tempUser.user._id;
      tempVendorInfo.accountNum = tempUser.user.accountId.accountNum;
      if ("accountId" in tempUser.user && "status" in tempUser.user.accountId) {
        tempVendorInfo.status = tempUser.user.accountId.status;
      } else {
        tempVendorInfo.status = 0;
      }
      console.log("vendorInfo.status: ", tempVendorInfo.status);
      setVendorInfo(tempVendorInfo);
      initPhotoData(props.event?.photoMetaData);

      const [tempTicketArray, tempDescription, tempLongDescription] =
        loadEventInfo(props.event);
      //Remove 1 element at index 3
      //let myFish = ['angel', 'clown', 'drum', 'mandarin', 'sturgeon']
      //let removed = myFish.splice(3, 1)

      tempTicketArray.forEach((ticket) => {
        ticket.originalTicket = true;
      });
      setTicketDetails(tempTicketArray);
      console.log("upon loading, ticket type details: ", tempTicketArray);
      setEventDescription(tempDescription);
      setEventLongDescription(tempLongDescription);
      setOriginalEventDescription(tempDescription);
      setInitialEventDescription(tempLongDescription);
      setDisplay("main");
    } else {
      window.location.href = "/auth";
    }
  }, []);

  //THIS SECTION IS FAIRLY UNIQUE COMPARED TO "CreateEvent"
  const saveEvent = async (newStatus) => {
    console.log("eventDescription: ", eventDescription);
    console.log("eventStatus: ", eventStatus);
    let tempPageErrors = false;
    let tempEventTitleOmission = false;
    let tempLocationVenueNameOmission = false;
    let tempWebinarLinkOmission = false;
    let tempTbaInformationOmission = false;
    setPageErrors(false);
    setEventTitleOmission(false);
    setLocationVenueNameOmission(false);
    setWebinarLinkOmission(false);
    setTbaInformationOmission(false);
    // LOOK TO DELETE THESE TWO LINES
    //let tempStatus = { ...eventStatus };
    //tempStatus.status = newStatus;

    let bodyData = {}; ///new for
    let ticketData = null;

    console.log("ticketDetails: ", ticketDetails);

    ticketDetails.forEach((ticket, index) => {
      if (ticket.nameWarning) {
        console.log("Name Warning, ticket : ", index);
        setPageErrors(true);
        tempPageErrors = true;
      }
      if (ticket.quantityWarning) {
        console.log("Quantity Warning, ticket : ", index);
        setPageErrors(true);
        tempPageErrors = true;
      }
      if (ticket.priceWarning) {
        console.log("Price Warning, ticket : ", index);
        setPageErrors(true);
        tempPageErrors = true;
      }
      if (ticket.reqWarning) {
        console.log("Required Warning, ticket : ", index);
        setPageErrors(true);
        tempPageErrors = true;
      }
      if (ticket.minWarning) {
        console.log("Min Warning, ticket : ", index);
        setPageErrors(true);
        tempPageErrors = true;
      }
      if (ticket.maxWarning) {
        console.log("Min Warning, ticket : ", index);
        setPageErrors(true);
        tempPageErrors = true;
      }
      if (ticket.functionArgs) {
        if (ticket.functionArgs.reqWarning) {
          console.log("Req Warning, ticket : ", index);
          setPageErrors(true);
          tempPageErrors = true;
        }
        if (ticket.functionArgs.buyWarning) {
          console.log("Buy Warning, ticket : ", index);
          setPageErrors(true);
          tempPageErrors = true;
        }
        if (ticket.functionArgs.getWarning) {
          console.log("Get Warning, ticket : ", index);
          setPageErrors(true);
          tempPageErrors = true;
        }
        if (ticket.functionArgs.discountWarning) {
          console.log("Discount Warning, ticket : ", index);
          setPageErrors(true);
          tempPageErrors = true;
        }
        if (ticket.functionArgs.forWarning) {
          console.log("For Warning, ticket : ", index);
          setPageErrors(true);
          tempPageErrors = true;
        }
        if (ticket.functionArgs.maxForWarning) {
          console.log("MaxFor Warning, ticket : ", index);
          setPageErrors(true);
          tempPageErrors = true;
        }
      }
    });

    if (!eventDescription.eventTitle) {
      console.log("You need to complete these fields");
      setEventTitleOmission(true);
      tempEventTitleOmission = true;
    }

    if (
      eventDescription.eventType === "live" &&
      !eventDescription.locationVenueName
    ) {
      console.log("You need to complete Venue Name field");
      setLocationVenueNameOmission(true);
      tempLocationVenueNameOmission = true;
    }

    if (
      eventDescription.eventType === "online" &&
      !eventDescription.webinarLink
    ) {
      console.log("You need to complete Webinar Link field");
      setWebinarLinkOmission(true);
      tempWebinarLinkOmission = true;
    }

    if (
      eventDescription.eventType === "tba" &&
      !eventDescription.tbaInformation
    ) {
      console.log("You need to complete tba Information field");
      setTbaInformationOmission(true);
      tempTbaInformationOmission = true;
    }

    if (
      !tempPageErrors &&
      !tempEventTitleOmission &&
      !tempLocationVenueNameOmission &&
      !tempWebinarLinkOmission &&
      !tempTbaInformationOmission
    ) {
      let eventDescriptionFields = [
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
        //"longDescription",
        //"CreateEvent" has "photo"
        //
        "eventCategory",
        "facebookLink",
        "twitterLink",
        "linkedinLink",
        "instagramLink",
        "vanityLink",
        "refundPolicy",
      ];

      let tempDescription = { ...eventDescription };

      if (tempDescription.eventType === "live") {
        tempDescription.tbaInformation = "";
      } else if (tempDescription.eventType === "online") {
        tempDescription.tbaInformation = "";
        tempDescription.locationVenueName = "";
        tempDescription.locationAddress1 = "";
        tempDescription.locationAddress2 = "";
        tempDescription.locationCity = "";
        tempDescription.locationState = "";
        tempDescription.locationZipPostalCode = "";
        tempDescription.locationNote = "";
      } else if (tempDescription.eventType === "tba") {
        tempDescription.locationVenueName = "";
        tempDescription.locationAddress1 = "";
        tempDescription.locationAddress2 = "";
        tempDescription.locationCity = "";
        tempDescription.locationState = "";
        tempDescription.locationZipPostalCode = "";
        tempDescription.locationNote = "";
        tempDescription.webinarLink = "";
        tempDescription.onlineInformation = "";
      }

      ticketData = [];
      //

      if (newStatus === "saved") {
        tempDescription.isDraft = true;
        bodyData["isDraft"] = "true";
        console.log("event will be saved");
      } else if (newStatus === "live") {
        tempDescription.isDraft = false;
        bodyData["isDraft"] = "false";
        console.log("event will be live");
      }

      setEventDescription(tempDescription);

      // only sends changed fields to the server
      eventDescriptionFields.forEach((field) => {
        if (tempDescription[field] || originalEventDescription[field]) {
          console.log("eventDescription[field]: ", tempDescription[field]);
          bodyData[field] = tempDescription[field];
        }
      });

      // does not send empty fields to server
      //eventDescriptionFields.forEach((field) => {
      if (eventLongDescription !== "") {
        console.log("eventLongDescription: ", eventLongDescription);
        bodyData["longDescription"] = eventLongDescription;
      }

      let startDate = dateFnsFormat(eventDescription.startDate, "yyyy-MM-dd");
      //console.log("startDate from dateFnsFormat: ", startDate);
      //
      //
      //
      let endDate = dateFnsFormat(eventDescription.endDate, "yyyy-MM-dd");
      //console.log("endDate from dateFnsFormat: ", endDate);

      let startDateTime = `${startDate} ${eventDescription.startTime}Z`;
      //console.log("startDateTime: ", startDateTime);

      let endDateTime = `${endDate} ${eventDescription.endTime}Z`;
      //console.log("endDateTime: ", endDateTime);
      bodyData["startDateTime"] = startDateTime;
      bodyData["endDateTime"] = endDateTime;

      // eliminate empty ticket types
      let tempTicketDetails = [...ticketDetails];
      //
      //
      let ticketDetailsFields = [
        "ticketName",
        "remainingQuantity",
        "currentTicketPrice",
        "ticketDescription",
        "maxTicketsAllowedPerOrder",
        "minTicketsAllowedPerOrder",
        "_id",
      ];

      let ntix = tempTicketDetails.length ? tempTicketDetails.length : 0;
      let atLeast1Tix = false;
      for (let i = 0; i < ntix; i++) {
        ticketData[i] = { idx: i };
      } // this  forces unique elements in each cell instead of all cells with same  pointer, hence we can assign each individually.
      // ticketData    = [{idx:0},{idx:1},{idx:2} ...]

      tempTicketDetails.forEach((ticket, index) => {
        console.log("ticket type details: ", ticket);
        if (
          "ticketName" in ticket &&
          ticket.ticketName.length &&
          ticket.ticketName.length > 0 &&
          "remainingQuantity" in ticket &&
          (("originalTicket" in ticket && ticket.originalTicket) ||
            (!("originalTicket" in ticket) && ticket.remainingQuantity > 0)) &&
          "currentTicketPrice" in ticket &&
          ticket.currentTicketPrice >= 0
        ) {
          atLeast1Tix = true;
          //
          console.log("atLeast1Tix:", atLeast1Tix);
          //
          ticketData[index]["sort"] = 10 + 10 * index;
          //
          //
          if (ticket.currency) {
            ticketData[index]["currency"] = ticket.currency.slice(0, 3);
          }

          ticketDetailsFields.forEach((field) => {
            if (field === "currentTicketPrice" && vendorInfo.status !== 8) {
              ticketData[index][field] = 0;
            } else if (
              ticket[field] !== "" &&
              "undefined" !== typeof ticket[field]
            ) {
              ticketData[index][field] = ticket[field];
            }
          });

          // Price Funcitons
          // for "bogod" and "bogof"  {form: "bogo",   args: {buy:5, get:4, discount:.90}}
          if (
            ticket.priceFeature === "bogod" ||
            ticket.priceFeature === "bogof"
          ) {
            ticketData[index]["priceFunction"] = {
              form: "bogo",
              args: {
                buy: ticket.functionArgs.buy,
                get: ticket.functionArgs.get,
                discount: ticket.functionArgs.discount,
              },
            };
          }

          // for "twofer"     {form: "twofer", args: {buy:2,  for:15}}
          if (ticket.priceFeature === "twofer") {
            ticketData[index]["priceFunction"] = {
              form: "twofer",
              args: {
                buy: ticket.functionArgs.buy,
                for: ticket.functionArgs.for,
              },
            };
          }

          // {form: "promo",  args: {
          //    promocodes:  [
          //      {name:"flyers", discount: .20, pct: true} ,  // 20% off
          //      {name:"eagles", discount:10,  pct: false }    // $10 off
          //    ]}
          // }
          // for "promo"

          if (ticket.priceFeature === "promo") {
            let promoArray = [];
            let npromos = ticket.promoCodes.length
              ? ticket.promoCodes.length
              : 0;
            for (let i = 0; i < npromos; i++) {
              promoArray[i] = { x: i };
            } // this  forces unique elements in each cell instead of all cells with same  pointer, hence we can assign each individually.
            // promoArray    = [{key:0},{key:1},{key:2} ...]

            ticket.promoCodes.forEach((item, number) => {
              promoArray[number] = {
                key: item.key,
                name: item.name,
                amount: item.amount,
                percent: item.percent,
              };

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
            });
            ticketData[index]["priceFunction"] = {
              form: "promo",
              args: { promocodes: promoArray },
            };
          }
        } else {
          console.log("skipped ticket ", index);
        }
      });

      // NEED TO START MODAL AT THIS POINT

      let tempStatus = { ...eventStatus };
      tempStatus.status = "processing";
      console.log("Setting it to processing");
      setEventStatus(tempStatus);
      setShowModal(true);

      console.log("atLeast1Tix:", atLeast1Tix, ">>", ticketData);

      if (atLeast1Tix && ticketData) {
        bodyData.tickets = ticketData;
      }

      let accountNum = vendorInfo.accountNum;
      console.log("vendorInfo: ", vendorInfo);
      console.log("accountNum: ", accountNum);

      let token = vendorInfo.token;
      const authstring = `Bearer ${token}`;
      var myHeaders = new Headers();
      myHeaders.append("Authorization", authstring);
      myHeaders.append("content-type", "application/json");

      let apiurl;
      apiurl = `${API}/accounts/${accountNum}/events/${eventDescription.eventNum}`;
      //
      //
      let imgError = false; // catch errors in image upload

      console.log(
        "imgFile,photoMetaData,eventDescription.photoChanged>>",
        photoData.imgFile,
        photoData.photoMetaData,
        eventDescription.photoChanged
      );

      // only upload new picture if necessary. not if only cropping same pic

      // existence of photoData.imgFile means user dropped a new file
      if (photoData.imgFile) {
        // new file and new data
        const urlres = await getOneTimeUploadUrl();
        console.log("onetimeurlres = ", urlres);
        if (urlres.status) {
          const uploadurl = urlres.result ? urlres.result.uploadURL : null;
          const uploadres = await uploadImage(
            uploadurl,
            photoData.imgFile,
            photoData.percentCrop
          );
          console.log("upload result = ", uploadres);
          if (uploadres.status && uploadres.id) {
            photoData.photoMetaData.id = uploadres.id;
            if (uploadres.image_path) {
              photoData.photoMetaData.url = uploadres.image_path;
              photoData.photoMetaData.isNewUrl = true;
              // DO BELOW              bodyData["photoMetaData"] = photoData.photoMetaData;
            }
          }
        } else {
          imgError = true;
        }
      }
      if (photoData?.photoMetaData) {
        bodyData["photoMetaData"] = photoData.photoMetaData;
      }
      tempStatus = { ...eventStatus };
      if (imgError) {
        // update upload failed. here
        tempStatus.status = "failure";
        setEventStatus(tempStatus);
        // LOOK TO DELETE THIS
        setShowModal(true);
      } else {
        fetch(apiurl, {
          method: "post",
          headers: myHeaders,
          body: JSON.stringify(bodyData),
          redirect: "follow",
        })
          .then(handleErrors)

          .then((response) => {
            console.log("response in create", response);
            return response.json();
          })
          .then((res) => {
            if (res.status) {
              // all good
              console.log(".then setting either live or draft");
              tempStatus.status = newStatus;
            } else {
              tempStatus.status = "error";
              tempStatus.errorMessage = res.error;
            }
          })
          .catch((err) => {
            console.log("Inside the .catch");
            console.log("**ERROR THROWN", err);
            tempStatus.status = "failure";
            console.log(".catch setting to failure");
            console.log("tempStatus: ", tempStatus);
          })
          .finally(() => {
            setEventStatus(tempStatus);
          });
      }
    }
  };

  const handleErrors = (response) => {
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  const savedModal = () => {
    if (eventStatus.status === "processing") {
      return (
        <Fragment>
          <SavedModal
            show={showModal}
            details={eventStatus}
            closeModal={() => {
              setShowModal(false);
            }}
          ></SavedModal>
        </Fragment>
      );
    } else if (
      eventStatus.status === "failure" ||
      eventStatus.status === "error"
    ) {
      return (
        <Fragment>
          <SavedModal
            show={showModal}
            details={eventStatus}
            closeModal={() => {
              setShowModal(false);
            }}
          ></SavedModal>
        </Fragment>
      );
    } else if (
      eventStatus.status === "saved" ||
      eventStatus.status === "live"
    ) {
      return (
        <Fragment>
          <SavedModal
            show={showModal}
            details={eventStatus}
            toDashboard={() => {
              setShowModal(false);
              window.location.href = `/myaccount`;
            }}
          ></SavedModal>
        </Fragment>
      );
    } else return null;
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

  // EVENT DESCRIPTION HANDLERS
  // duped from createEvent
  const changeEventDescription = (event) => {
    let tempDescription = { ...eventDescription };
    tempDescription[event.target.name] = event.target.value;
    if (event.target.name === "eventTitle") {
      // updates "vanityLink" whenever "eventTitle" is changed
      tempDescription.vanityLink = event.target.value
        .replace(/\s+/g, "-") // any oddball character
        .replace(/[^a-zA-Z0-9-]/g, "") // anything but "a-zA-Z0-9"
        .toLowerCase();
    }
    setEventDescription(tempDescription);
    console.log("Event Description: ", tempDescription);
  };

  const changeEventDate = (day, fieldName) => {
    console.log("day from Date selector: ", day);
    let tempDescription = { ...eventDescription };
    console.log("day: ", day);

    let date = dateFnsFormat(day, "MM/dd/yyyy");
    console.log("date from dateFnsFormat: ", date);

    if (fieldName === "start") {
      tempDescription.startDate = day;
      console.log("start date: ", tempDescription.startDate);
      if (tempDescription.startDate > tempDescription.endDate) {
        tempDescription.endDate = day;
        console.log("end date: ", tempDescription.endDate);
      }
    } else if (fieldName === "end") {
      tempDescription.endDate = day;
      console.log("end date: ", tempDescription.endDate);
    }
    setEventDescription(tempDescription);
    console.log("tempDescription: ", tempDescription);
  };

  const changeEventDescriptionRadio = (event, value, name) => {
    let tempDescription = { ...eventDescription };
    tempDescription[name] = value.value;
    setEventDescription(tempDescription);
  };

  const changeLongDescription = (editorContent) => {
    setEventLongDescription(editorContent);
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

  const changePriceFeature = (event, value, key) => {
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
      nameWarning: false,
      remainingQuantity: "",
      quantityWarning: false,
      currentTicketPrice: "",
      priceWarning: false,
      reqWarning: false,
      currency: "",
      settings: false,
      ticketDescription: "",
      minTicketsAllowedPerOrder: "",
      minWarning: false,
      maxTicketsAllowedPerOrder: "",
      maxWarning: false,
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
          nameWarning: false,
          remainingQuantity: "",
          quantityWarning: false,
          currentTicketPrice: "",
          priceWarning: false,
          reqWarning: false,
          currency: "",
          settings: false,
          ticketDescription: "",
          minTicketsAllowedPerOrder: "",
          minWarning: false,
          maxTicketsAllowedPerOrder: "",
          maxWarning: false,
          priceFeature: "none",
          promoCodes: [{ key: "1", name: "", amount: "", percent: false }],
          promoCodeNames: [],
          promoCodeWarning: "",
          functionArgs: {},
          viewModal: false,
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

  const subTitleDisplay = () => {
    if (
      pageErrors ||
      eventTitleOmission ||
      (locationVenueNameOmission && eventDescription.eventType === "live") ||
      (webinarLinkOmission && eventDescription.eventType === "online") ||
      (tbaInformationOmission && eventDescription.eventType === "tba")
    ) {
      return (
        <div style={{ display: "grid", gridTemplateColumns: "200px 600px" }}>
          <div style={{ paddingTop: "5px" }}>
            <button
              className={classes.SwitchButton}
              onClick={() => {
                props.toEvents("events");
              }}
            >
              Switch Event
            </button>
          </div>
          <div
            style={{
              paddingTop: "5px",
              textAlign: "center",
              fontSize: "14px",
              color: "red",
            }}
          >
            Please correct input errors identified below.
          </div>
        </div>
      );
    } else {
      return (
        <div style={{ paddingTop: "5px" }}>
          <button
            className={classes.SwitchButton}
            onClick={() => {
              props.toEvents("events");
            }}
          >
            Switch Event
          </button>
        </div>
      );
    }
  };

  const [dragging, setDragging] = useState(false);

  const dragItem = useRef();
  const dragNode = useRef();

  const handleDragStart = (event, index) => {
    dragItem.current = index;
    dragNode.current = event.target;
    dragNode.current.addEventListener("dragend", handleDragEnd);
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnd = () => {
    dragNode.current.removeEventListener("dragend", handleDragEnd);
    setDragging(false);
    dragItem.current = null;
    dragNode.current = null;
  };

  const handleDragEnter = (event, index) => {
    if (index !== dragItem.current) {
      const currentItem = dragItem.current;
      setTicketDetails((oldDetails) => {
        let newDetails = JSON.parse(JSON.stringify(oldDetails));
        newDetails.splice(index, 0, newDetails.splice(currentItem, 1)[0]);
        dragItem.current = index;
        return newDetails;
      });
    } else {
      console.log("SAME TARGET");
    }
  };

  const changeEventField = (value, field) => {
    let tempDescription = { ...eventDescription };
    tempDescription[field] = value;
    console.log("eventEndTime: ", value);
    setEventDescription(tempDescription);
  };

  const changeEventCategory = (value) => {
    let tempDescription = { ...eventDescription };
    tempDescription.eventCategory = value;
    console.log("eventCategory: ", value);
    setEventDescription(tempDescription);
  };

  // duped from createEvent

  //  const changeEventImage = (image) => {
  const changeEventPhoto = (imgData) => {
    let tempImage = { ...photoData };
    tempImage.imgFile = imgData.imgFile;
    tempImage.percentCrop = imgData.percentCrop;
    tempImage.photoMetaData = imgData.photoMetaData;
    // tempDescription.photo = image;
    setPhotoData(tempImage);
  };

  //   get uril

  const urlContentToDataUri = (url) => {
    console.log(" in urlContentToDataUri");
    return fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((callback) => {
            let reader = new FileReader();
            reader.onload = function () {
              callback(this.result);
            };
            return reader.readAsDataURL(blob);
          })
      )
      .then((res) => {
        return { status: true, data: res };
      })
      .catch((err) => {
        console.log("Failed to read: ", url, " with error: ", err);
        return { status: false, error: err };
      });
  };

  const getOneTimeUploadUrl = () => {
    //   const  apiurl = "https://api.bondirectly.com/media/uimgurl";
    const apiurl = `${API}/media/uimgurl`;

    const token = vendorInfo.token;
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Context-Type", "application/json");

    return fetch(apiurl, {
      method: "POST",
      headers: myHeaders,
    })
      .then(handleErrors)
      .then((response) => {
        console.log("response in upload url fetch ", response);
        return response.json();
      })
      .then((res) => {
        console.log("res: ", res);
        if (res.status) {
          return res;
        } else {
          console.log("Cloudflare ERR:", res);
          return { status: false };
        }
      })
      .catch((err) => {
        console.log("Inside the .catch");
        console.log("**ERROR THROWN", err);
        return { status: false };
      });
  };

  const uploadImage = (uploadurl1, imageFile, crops) => {
    // uploads images to cdn, given url and header
    //https://developers.cloudflare.com/stream/uploading-videos/direct-creator-uploads#using-tus-recommended-for-videos-over-200mb
    console.log("in uploadImage...w .", uploadurl1, imageFile, crops);
    ///  const video = videoInput.files[0];
    const formData = new FormData();
    formData.append("file", imageFile);
    //  const uploadResult = await
    return fetch(uploadurl1, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.status);
        }
        return response;
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("NOT_OK");
        }
        return response.json();
      })
      .then((res) => {
        console.log("exiting uploadImage with res=", res);
        let z = { status: false };
        if (res.success && res.result && res.result.id) {
          z.status = true;
          z.id = res.result.id;
          if (
            Array.isArray(res.result.variants) &&
            res.result.variants.length > 0
          ) {
            z.image_path = res.result.variants[0];
          }
        }
        return z;
      })
      .catch((err) => {
        console.log("err in updateload Image", err);
        return { status: false };
      });
  };

  const spinner = () => {
    if (display === "spinner") {
      return <Spinner />;
    } else return null;
  };

  const buttonDisplay = () => {
    let draftStatus;
    let liveStatus;

    if (eventDescription.isDraft) {
      draftStatus = "UPDATE DRAFT";
      liveStatus = "GO LIVE NOW";
    } else {
      draftStatus = "SAVE AS DRAFT";
      liveStatus = "UPDATE LIVE";
    }

    if (windowWidth >= 420) {
      return (
        <Fragment>
          <div>
            <button
              className={classes.ButtonRed}
              onClick={() => {
                let tempDescription = { ...eventDescription };
                tempDescription.isDraft = true;
                setEventDescription(tempDescription);
                saveEvent("saved");
              }}
            >
              {draftStatus}
            </button>
          </div>
          <div>
            <button
              className={classes.ButtonGreen}
              onClick={() => {
                let tempDescription = { ...eventDescription };
                tempDescription.isDraft = false;
                setEventDescription(tempDescription);
                saveEvent("live");
              }}
            >
              {liveStatus}
            </button>
          </div>
          <div>
            <button
              className={classes.ButtonGrey}
              onClick={() => {
                window.location.href = `/myaccount`;
              }}
            >
              CANCEL EDIT
            </button>
          </div>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <div>
            <button
              className={classes.ButtonRedTight}
              onClick={() => {
                let tempDescription = { ...eventDescription };
                tempDescription.isDraft = true;
                setEventDescription(tempDescription);
                saveEvent("saved");
              }}
            >
              {draftStatus}
            </button>
          </div>
          <div>
            <button
              className={classes.ButtonGreenTight}
              onClick={() => {
                let tempDescription = { ...eventDescription };
                tempDescription.isDraft = false;
                setEventDescription(tempDescription);
                saveEvent("live");
              }}
            >
              {liveStatus}
            </button>
          </div>
          <div>
            <button
              className={classes.ButtonGreyTight}
              onClick={() => {
                window.location.href = `/myaccount`;
              }}
            >
              CANCEL EDIT
            </button>
          </div>
        </Fragment>
      );
    }
  };

  const currentStatus = () => {
    if (eventDescription.isDraft) {
      return (
        <div
          style={{
            paddingTop: "6px",
            fontSize: "20px",
            color: "#B80000",
            fontWeight: "400",
            textAlign: "center",
          }}
        >
          STATUS DRAFT
        </div>
      );
    } else {
      return (
        <div
          style={{
            paddingTop: "6px",
            fontSize: "20px",
            color: "#008F00",
            fontWeight: "400",
            textAlign: "center",
          }}
        >
          STATUS LIVE
        </div>
      );
    }
  };

  const displayHeader = (
    <div className={classes.GridTitlePanel}>
      <div className={classes.GridTitle}>
        <div
          style={{ fontSize: "26px", paddingTop: "6px", paddingLeft: "15px" }}
        >
          Event Edit
        </div>
        {currentStatus()}
        {buttonDisplay()}
      </div>
      <div>{subTitleDisplay()}</div>
    </div>
  );

  const mainDisplay = () => {
    if (display === "main") {
      return (
        <div
          style={{
            backgroundColor: "white",
            height: "calc(100vh - 193px)",
            scrollbarWidth: "thin",
            overflowY: "auto",
            fontSize: "15px",
            width: "1030px",
            marginTop: "76px",
            paddingTop: "10px",
            paddingBotton: "15px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <div>
            <EventDetails
              event={eventDescription}
              longDescription={eventLongDescription}
              //initialValue={"Hello world"}
              initialValue={initialEventDescription}
              titleOmission={eventTitleOmission}
              venueOmission={locationVenueNameOmission}
              webinarOmission={webinarLinkOmission}
              tbaOmission={tbaInformationOmission}
              isCreateEvent={false}
              changePhoto={changeEventPhoto}
              photoData={photoData}
              change={changeEventDescription}
              radioChange={changeEventDescriptionRadio}
              changeDate={changeEventDate}
              changeEventField={changeEventField}
              changeCategory={changeEventCategory}
              changeLong={changeLongDescription}
              changeOmission={() => {
                setEventTitleOmission(false);
              }}
            />
            <br></br>
            <TicketCreation
              tickets={ticketDetails}
              status={vendorInfo.status}
              radioChange={changeEventDescriptionRadio}
              changeTicket={changeTicketDetail}
              changeSettings={switchTicketSettings}
              showModal={activateShowModal}
              deactivateModal={deactivateShowModal}
              delete={deleteTicket}
              switchSettings={switchTicketSettings}
              changeFeature={changePriceFeature}
              switchPriceFeature={switchPriceFeature}
              addPromoCode={addPromoCode}
              changeArgument={changeArgument}
              changePromoCodesName={changePromoCodesName}
              changePromoCodesAmount={changePromoCodesAmount}
              changePromoCodesPercent={changePromoCodesPercent}
              deletePromoCode={deletePromoCode}
              createNewTicketHandler={createNewTicketHandler}
              handleDragStart={handleDragStart}
              handleDragEnter={handleDragEnter}
              dragging={dragging}
            />
            <br></br>
            <AdditionalSettings
              event={eventDescription}
              radioChange={changeEventDescriptionRadio}
            />
            <br></br>
          </div>
        </div>
      );
    } else return null;
  };

  return (
    <div>
      {displayHeader}
      {mainDisplay()}
      {savedModal()}
    </div>
  );
};

export default EventEdit;
