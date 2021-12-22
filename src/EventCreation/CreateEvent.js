//CODE MARKED HAS BEEN CHECKED VERSUS ORIGINAL
//EXCEPT FOR SMALL STYLING SECTION LABELED BELOW
//EXCEPT FOR <TicketCreation/>, <AdditionalSettings/>,  SECTIONS NOT LABELED BELOW

import React, { useEffect, useState, useRef, Fragment } from "react";

import dateFnsFormat from "date-fns/format";

import { API } from "../config";

import SavedModal from "./Modals/SavedModal";
import CreateModal from "./Modals/CreateModal";
import EventDetails from "./Components/EventDetails";
import TicketCreation from "./TicketCreation";
import AdditionalSettings from "./Components/AdditionalSettings";
import Spinner from "../components/UI/Spinner/Spinner";

import classes from "./VendorDashboard.module.css";

//import { uploadImage } from "./ImgDropAndCrop/ResuableUtils";

// holds sign-in information

const CreateEvent = (props) => {
  const [vendorInfo, setVendorInfo] = useState({});
  const [display, setDisplay] = useState("spinner"); // spinner, main

  const [eventTitleOmission, setEventTitleOmission] = useState(false);
  const [locationVenueNameOmission, setLocationVenueNameOmission] =
    useState(false);
  const [webinarLinkOmission, setWebinarLinkOmission] = useState(false);
  const [tbaInformationOmission, setTbaInformationOmission] = useState(false);
  const [pageErrors, setPageErrors] = useState(false);

  const [showModal, setShowModal] = useState(false); //

  const [showEventCrationModal, setShowEventCreationModal] = useState(false); //

  const [eventImage, setEventImage] = useState({
    imgFile: "",
    percentCrop: {},
    photoMetaData: {},
  }); // special case

  // stores all Event Description values
  const [eventDescription, setEventDescription] = useState({
    //
    eventTitle: "",
    isDraft: true,
    eventType: "live",
    webinarLink: "",
    onlineInformation: "",
    tbaInformation: "",
    locationVenueName: "",
    locationAddress1: "",
    locationAddress2: "",
    locationCity: "",
    locationState: "",
    locationZipPostalCode: "",
    locationCountryCode: "US",
    locationNote: "",
    startDate: new Date(new Date().toDateString()),
    startTime: "19:00:00",
    endDate: new Date(new Date().toDateString()),
    endTime: "20:00:00",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    //photo: "",
    media_id: "",
    photoChanged: false, // NOT USED IN CREATEEVENT
    shortDescription: "",
    //longDescription: "",
    eventCategory: "",
    facebookLink: "",
    twitterLink: "",
    linkedinLink: "",
    instagramLink: "",
    vanityLink: "",
    refundPolicy: "noRefunds",
  });

  const [eventLongDescription, setEventLongDescription] =
    useState("Hello world");

  const [initialEventDescription, setInitialEventDescription] = useState("");

  // stores all Ticket Details values
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

  const [eventStatus, setEventStatus] = useState({
    status: "", // "processing", "saved", "live", "error", "failure"
    savedMessage: "Congratulations, your event was saved!",
    liveMessage: "Congratulations, your event is live!",
    errorMessage: "", //["Please fix input errors and resubmit."],
    failureMessage: "System error please try again.",
  });

  useEffect(() => {
    // checks if 'user' exists in local storage
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      // loads sign-in data
      let tempUser = JSON.parse(localStorage.getItem("user"));
      console.log("Temp User: ", tempUser);
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
      //setInitialEventDescription("");
      setDisplay("main");
    } else {
      window.location.href = "/auth";
    }
  }, []);

  const saveEvent = async (newStatus) => {
    console.log("eventDescription: ", eventDescription);
    console.log("eventStatus: ", eventStatus);
    console.log("vendorInfo: ", vendorInfo);
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
    /*
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      vendorInfo.token = tempUser.token;
      vendorInfo.id = tempUser.user._id;
    } else {
      window.location.href = "/auth";
    }
    */

    let bodyData = {};
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
      console.log("You need to complete Event Title field");
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
        //"photo",
        "media_id",
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

      // does not send empty fields to server
      eventDescriptionFields.forEach((field) => {
        if (tempDescription[field] !== "") {
          console.log(
            "eventDescription[field]: ",
            field,
            tempDescription[field]
          );
          bodyData[field] = tempDescription[field];
        }
      });

      // does not send empty fields to server
      //eventDescriptionFields.forEach((field) => {
      if (eventLongDescription !== "") {
        bodyData["longDescription"] = eventLongDescription;
      }

      let tempStartDate = dateFnsFormat(
        tempDescription.startDate,
        "yyyy-MM-dd"
      );

      let tempEndDate = dateFnsFormat(tempDescription.endDate, "yyyy-MM-dd");
      let tempStartDateTime = `${tempStartDate} ${tempDescription.startTime}Z`;
      let tempEndDateTime = `${tempEndDate} ${tempDescription.endTime}Z`;

      bodyData["startDateTime"] = tempStartDateTime;
      bodyData["endDateTime"] = tempEndDateTime;

      // eliminate empty ticket types
      let tempTicketDetails = [...ticketDetails];

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
        console.log("NEXT TICKET TO SEND: ", ticket);
        if (
          "ticketName" in ticket &&
          ticket.ticketName.length &&
          ticket.ticketName.length > 0 &&
          "remainingQuantity" in ticket &&
          ticket.remainingQuantity > 0 &&
          "currentTicketPrice" in ticket &&
          ticket.currentTicketPrice >= 0
        ) {
          atLeast1Tix = true;

          console.log("atLeast1Tix:", atLeast1Tix);

          ticketData[index]["sort"] = 10 + 10 * index;
          console.log("atLeast1Tix:", atLeast1Tix, ">>", ticketData);

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
                discount: ticket.functionArgs.discount / 100,
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
      apiurl = `${API}/accounts/${accountNum}/events`;
      console.log("eventImage = ", eventImage);

      let imgError = false; // catch errors in image upload

      if (eventImage.imgFile && eventImage.photoMetaData) {
        const urlres = await getOneTimeUploadUrl();
        console.log("onetimeurlres = ", urlres);
        if (urlres.status) {
          const uploadurl = urlres.result ? urlres.result.uploadURL : null;
          const uploadres = await uploadImage(
            uploadurl,
            eventImage.imgFile,
            eventImage.percentCrop
          );
          console.log("upload result = ", uploadres);
          if (uploadres.status && uploadres.id) {
            eventImage.photoMetaData.id = uploadres.id;
            if (uploadres.image_path) {
              eventImage.photoMetaData.url = uploadres.image_path;
              bodyData["photoMetaData"] = eventImage.photoMetaData;
            }
          }
        } else {
          imgError = true;
        }
      }

      tempStatus = { ...eventStatus };
      if (imgError) {
        // update upload failed. here
        tempStatus.status = "failure";
        setEventStatus(tempStatus);
      } else {
        console.log("about to fetch w", {
          headers: myHeaders,
          //body: JSON.stringify(bodyData),
          body: bodyData,
        });
        fetch(apiurl, {
          method: "POST",
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
            console.log("res: ", res);
            if (!res.status) {
              if (res.message) {
                tempStatus.status = "error";
                tempStatus.errorMessage = "input error";
              } else {
                tempStatus.status = "failure";
                tempStatus.failureMessage = res.error;
              }
            } else {
              console.log(".then setting either live or draft");
              tempStatus.status = newStatus;
            }
            console.log("tempStatus: ", tempStatus);
            return res;
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
  // END STRAIGHT COPY FROM ORIGINAL

  const savedModal = () => {
    console.log("eventStatus.status ", eventStatus.status);
    if (eventStatus.status === "processing") {
      console.log("PROCESSING");
      console.log("showModal: ", showModal);
      console.log("eventStatus: ", eventStatus);
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
      console.log("Failue or error");
      console.log("showModal: ", showModal);
      console.log("eventStatus: ", eventStatus);
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
      console.log("saved or live");
      console.log("showModal: ", showModal);
      console.log("eventStatus: ", eventStatus);
      return (
        <Fragment>
          <SavedModal
            show={showModal}
            details={eventStatus}
            toDashboard={() => {
              window.location.href = `/myaccount`;
            }}
          ></SavedModal>
        </Fragment>
      );
    } else {
      console.log("null");
      console.log("showModal: ", showModal);
      console.log("eventStatus: ", eventStatus);
      return null;
    }
  };

  const createModal = () => {
    if (eventStatus.status === "processing") {
      console.log("PROCESSING");
    } else if (
      eventStatus.status === "failure" ||
      eventStatus.status === "error"
    ) {
      return (
        <Fragment>
          <CreateModal
            show={showModal}
            details={eventStatus}
            closeModal={() => {
              setShowModal(false);
            }}
          ></CreateModal>
        </Fragment>
      );
    } else if (
      eventStatus.status === "saved" ||
      eventStatus.status === "live"
    ) {
      return (
        <Fragment>
          <CreateModal
            show={showModal}
            details={eventStatus}
            toDashboard={() => {
              window.location.href = `/myaccount`;
            }}
          ></CreateModal>
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
  /*
  const changeLongDescription = (editorContent) => {
    let tempDescription = { ...eventDescription };
    tempDescription.longDescription = editorContent;
    setEventDescription(tempDescription);
  };
*/
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
      );
    } else {
      return (
        <div
          style={{
            paddingTop: "5px",
            textAlign: "center",
            fontSize: "14px",
            color: "red",
          }}
        ></div>
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

  //END CODE REPLICATION CHECK
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

  //  const changeEventImage = (image) => {
  const changeEventImage = (imgData) => {
    let tempImage = { ...eventImage };
    tempImage.imgFile = imgData.imgFile;
    tempImage.percentCrop = imgData.percentCrop;
    tempImage.photoMetaData = imgData.photoMetaData;
    // tempDescription.photo = image;
    setEventImage(tempImage);
  };

  //START CODE REPLICATION CHECK

  const buttonDisplay = (
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
          SAVE AS DRAFT
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
          GO LIVE NOW
        </button>
      </div>
      <div>
        <button
          className={classes.ButtonGrey}
          onClick={() => {
            window.location.href = `/myaccount`;
          }}
        >
          CANCEL CREATE
        </button>
      </div>
    </Fragment>
  );

  //   get uril

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

  const main = () => {
    if (display === "main") {
      return (
        <Fragment>
          <div className={classes.EventPanelTitle}>
            <div style={{ paddingTop: "5px" }}>Create Event</div>
            {subTitleDisplay()}
            {buttonDisplay}
          </div>
          <div className={classes.DisplayPanel}>
            {savedModal()}
            {/*createModal()*/}
            <EventDetails
              event={eventDescription}
              longDescription={"Hello"}
              //initialValue={"Hello world"}
              initialValue={initialEventDescription}
              titleOmission={eventTitleOmission}
              venueOmission={locationVenueNameOmission}
              webinarOmission={webinarLinkOmission}
              tbaOmission={tbaInformationOmission}
              eventImage={"new"}
              photoData={""}
              change={changeEventDescription}
              radioChange={changeEventDescriptionRadio}
              changeDate={changeEventDate}
              changeEventField={changeEventField}
              changeCategory={changeEventCategory}
              changeLong={changeLongDescription}
              changeImage={changeEventImage}
              changeOmission={() => {
                setEventTitleOmission(false);
              }}
            />
            <br></br>
            <TicketCreation
              tickets={ticketDetails}
              status={vendorInfo.status} //
              createNewTicketHandler={createNewTicketHandler}
              changeTicket={changeTicketDetail}
              radioChange={changeEventDescriptionRadio} // does not exist in TicketCreation
              changeSettings={switchTicketSettings} //
              showModal={activateShowModal} //
              deactivateModal={deactivateShowModal} //
              delete={deleteTicket} //
              switchSettings={switchTicketSettings} //
              changeFeature={changePriceFeature} //
              switchPriceFeature={switchPriceFeature} //
              addPromoCode={addPromoCode} //
              changeArgument={changeArgument} //
              changePromoCodesName={changePromoCodesName} //
              changePromoCodesAmount={changePromoCodesAmount} //
              changePromoCodesPercent={changePromoCodesPercent} //
              deletePromoCode={deletePromoCode} //
              handleDragStart={handleDragStart} //
              handleDragEnter={handleDragEnter} //
              dragging={dragging} //
            />
            <br></br>
            <AdditionalSettings
              event={eventDescription}
              radioChange={changeEventDescriptionRadio}
            />
          </div>
        </Fragment>
      );
    } else return null;
  };

  return (
    <div>
      {main()}
      {spinner()}
    </div>
  );
};

export default CreateEvent;
