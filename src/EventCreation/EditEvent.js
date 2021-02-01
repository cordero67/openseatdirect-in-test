



import React, { useState, useRef, useEffect, Fragment } from "react";

import dateFnsFormat from 'date-fns/format';

import { API } from "../config";

import { loadEventInfo } from "./EventCreationFunctions.js";

// NEW LINE OF CODE
import { extractImageFileExtensionFromBase64 } from "./ImgDropAndCrop/ResuableUtils";

import SavedModal from "./Modals/SavedModal";
import EventDetails from "./Components/EventDetails";
import TicketCreation from "./TicketCreation";
import AdditionalSettings from "./Components/AdditionalSettings";

import classes from "./EditEvent.module.css";
import { Button } from "semantic-ui-react";

// holds sign-in information
let vendorInfo = {};

const EventEdit = (props) => {
  const [eventTitleOmission, setEventTitleOmission] = useState(false);
  const [pageErrors, setPageErrors] = useState(false);

  // stores all original Event Description variables
  const [originalEventDescription, setOriginalEventDescription] = useState({});

  // stores all Event Description variables
  const [eventDescription, setEventDescription] = useState({
    eventNum: "",// NOT USED IN CREATEEVENT
    eventTitle: "",//duped with "createEvent"
    isDraft: true,//duped with "createEvent"
    eventType: "live",//duped with "createEvent"
    webinarLink: "",//duped with "createEvent"
    onlineInformation: "",//duped with "createEvent"
    tbaInformation: "",//duped with "createEvent"
    locationVenueName: "",//duped with "createEvent"
    locationAddress1: "",//duped with "createEvent"
    locationAddress2: "",//duped with "createEvent"
    locationCity: "",//duped with "createEvent"
    locationState: "",//duped with "createEvent"
    locationZipPostalCode: "",//duped with "createEvent"
    locationCountryCode: "US",//duped with "createEvent"
    locationNote: "",//duped with "createEvent"
    startDate: new Date(new Date().toDateString()),//duped with "createEvent"
    startTime: "19:00:00",//duped with "createEvent"
    endDate: new Date(new Date().toDateString()),//duped with "createEvent"
    endTime: "20:00:00",//duped with "createEvent"
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,//duped with "createEvent"
    photo: "",// ONLY USED IN CREATEEVENT
    photoChanged: false,// NOT USED IN CREATEEVENT
    shortDescription: "",//duped with "createEvent"
    longDescription: "",//duped with "createEvent"
    eventCategory: "",//duped with "createEvent"
    facebookLink: "",//duped with "createEvent"
    twitterLink: "",//duped with "createEvent"
    linkedinLink: "",//duped with "createEvent"
    instagramLink: "",//duped with "createEvent"
    vanityLink: "",//duped with "createEvent"
    refundPolicy: "noRefunds",//duped with "createEvent"
  });

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
      promoCodes: [
        { key: "1", name: "", amount: "", percent: false },
      ],
      promoCodeNames: [],
      promoCodeWarning: "",
      functionArgs: {},
      viewModal: false
    }
  ]);

  const [photoData, setPhotoData] = useState({imgSrc: null, imgSrcExt: null, isLoaded: false});

  //START MATCHES "CreateEvent"
  const [eventStatus, setEventStatus] = useState({//all duped with "createEvent"
    status: "", // "saved", "live", "error", "failure"
    savedMessage: "Congratulations, your event was saved!",
    liveMessage: "Congratulations, your event is live!",
    errorMessage: "", //["Please fix input errors and resubmit."],
    failureMessage: "System error please try again.",
  });
  //END MATCHES "CreateEvent"

  const initPhotoData = (resPhotoData) => {
    // converts data from server fetch call to photodata for image display
    
    // check for required fields
      if (!(resPhotoData && resPhotoData.data && resPhotoData.data.data)){
        setPhotoData({imgSrc:null, imgSrcExt: null, isLoaded:true});
        return;
      };

      if (!(resPhotoData.contentType)){
        setPhotoData({imgSrc:null, imgSrcExt: null, isLoaded:true});
        return;
      };

      const ext = resPhotoData.contentType;

      let header ='data:image/png;base64,'; // hard codes image/png by default
      if (ext ==='image/png'){
        header ='data:image/png;base64,'
      } else if (ext ==='image/jpeg'){
        header ='data:image/jpeg;base64,'
      };

      const uint8 = new Uint8Array(resPhotoData.data.data);
      const len =  uint8.byteLength;
      if (len == 0){ // no photo data
              setPhotoData({imgSrc:null, imgSrcExt: null, isLoaded:true});
              return;
      };
      let bin ='';
      for (let i = 0; i < len; i++)
          bin += String.fromCharCode(uint8[i]); 
      const photodat =  header+window.btoa(bin);
      const srcExt = extractImageFileExtensionFromBase64 (photodat);
      //console.log ("found photo> setting PhotoData:", photodat);
      setPhotoData({imgSrc:photodat, imgSrcExt: srcExt, isLoaded:true});
 }

  useEffect(() => {//all duped with "createEvent" except where noted
    // checks if 'user' exists in local storage
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      // loads sign-in data
      let tempUser = JSON.parse(localStorage.getItem("user"));
      vendorInfo.token = tempUser.token;
      vendorInfo.id = tempUser.user._id;
      //start section not in "createEvent"
      if (localStorage.getItem(`eventNum`) !== null) {
        console.log("found a valid event to edit")
        let tempEventNum = JSON.parse(localStorage.getItem("eventNum"));
        let tempEvents = JSON.parse(localStorage.getItem("events"));
        let tempEventPosition;
        tempEvents.forEach((event, index) => {
          if(event.eventNum === tempEventNum) {
            console.log("Found a match");
            tempEventPosition = index;
          }
        })

        initPhotoData(tempEvents[tempEventPosition].photo);

        const [tempTicketArray, tempDescription] = loadEventInfo(tempEvents[tempEventPosition]);
        
        setTicketDetails(tempTicketArray);
        setEventDescription(tempDescription);
        setOriginalEventDescription(tempDescription);
      }
      else {
        console.log("Did not find a valid event to edit")
      }
  
    } else {      
      window.location.href = "/signin";
    }
  }, []);

  //THIS SECTION IS FAIRLY UNIQUE COMPARED TO "CreateEvent"
  const saveEvent = async (newStatus) => {
    console.log("eventDescription: ", eventDescription)
    console.log("eventStatus: ", eventStatus)
    let tempPageErrors = false;
    let tempEventTitleOmission = false;
    setPageErrors(false);
    setEventTitleOmission(false);

    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      vendorInfo.token = tempUser.token;
      vendorInfo.id = tempUser.user._id;
    } else {
      window.location.href = "/signin";
    }

    let tempStatus = { ...eventStatus };
    tempStatus.status = newStatus;

    console.log("ticketDetails: ", ticketDetails)

    ticketDetails.forEach((ticket, index) => {
      if(ticket.nameWarning) {
        console.log("Name Warning, ticket : ", index)
        setPageErrors(true);
        tempPageErrors = true;
      }
      if(ticket.quantityWarning) {
        console.log("Quantity Warning, ticket : ", index)
        setPageErrors(true);
        tempPageErrors = true;
      }
      if(ticket.priceWarning) {
        console.log("Price Warning, ticket : ", index)
        setPageErrors(true);
        tempPageErrors = true;
      }
      if(ticket.reqWarning) {
        console.log("Required Warning, ticket : ", index)
        setPageErrors(true);
        tempPageErrors = true;
      }
      if(ticket.minWarning) {
        console.log("Min Warning, ticket : ", index)
        setPageErrors(true);
        tempPageErrors = true;
      }
      if(ticket.maxWarning) {
        console.log("Min Warning, ticket : ", index)
        setPageErrors(true);
        tempPageErrors = true;
      }
      if (ticket.functionArgs) {
        if(ticket.functionArgs.reqWarning) {
          console.log("Req Warning, ticket : ", index)
          setPageErrors(true);
          tempPageErrors = true;
        }
        if(ticket.functionArgs.buyWarning) {
          console.log("Buy Warning, ticket : ", index)
          setPageErrors(true);
          tempPageErrors = true;
        }
        if(ticket.functionArgs.getWarning) {
          console.log("Get Warning, ticket : ", index)
          setPageErrors(true);
          tempPageErrors = true;
        }
        if(ticket.functionArgs.discountWarning) {
          console.log("Discount Warning, ticket : ", index)
          setPageErrors(true);
          tempPageErrors = true;
        }
        if(ticket.functionArgs.forWarning) {
          console.log("For Warning, ticket : ", index)
          setPageErrors(true);
          tempPageErrors = true;
        }
        if (ticket.functionArgs.maxForWarning) {
          console.log("MaxFor Warning, ticket : ", index)
          setPageErrors(true);
          tempPageErrors = true;
        }
      }
    })

    if (!eventDescription.eventTitle) {
      console.log("You need to complete these fields");
      setEventTitleOmission(true);
      tempEventTitleOmission = true;
    }

    if (!tempPageErrors && !tempEventTitleOmission) {
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
        "longDescription",
        //"CreateEvent" has "photo"
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

      var formData = new FormData();

      if (newStatus === "saved") {
        tempDescription.isDraft = true;
        formData.append("isDraft", "true");
        console.log("event will be saved")
      } else if (newStatus === "live") {
        tempDescription.isDraft = false;
        formData.append("isDraft", "false");
        console.log("event will be live")
      }

      setEventDescription(tempDescription);

      // only sends changed fields to the server
      eventDescriptionFields.forEach((field) => {
        if (tempDescription[field] || originalEventDescription[field]) {
          console.log("eventDescription[field]: ", tempDescription[field] )
          formData.append(`${field}`, tempDescription[field]);
        }
      });
      
      let startDate = dateFnsFormat(eventDescription.startDate,'yyyy-MM-dd');
      //console.log("startDate from dateFnsFormat: ", startDate);

      let endDate = dateFnsFormat(eventDescription.endDate,'yyyy-MM-dd');
      //console.log("endDate from dateFnsFormat: ", endDate);

      let startDateTime = `${startDate} ${eventDescription.startTime}Z`;
      //console.log("startDateTime: ", startDateTime);

      let endDateTime = `${endDate} ${eventDescription.endTime}Z`;
      //console.log("endDateTime: ", endDateTime);

      formData.append("startDateTime", startDateTime);
      formData.append("endDateTime", endDateTime);

      if (eventDescription.photoChanged) {
        formData.append("photo", eventDescription.photo);
        console.log("eventDescription.photo: ", eventDescription.photo);
        console.log("eventDescription.photoChanged: ", eventDescription.photoChanged);
      }

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

      tempTicketDetails.forEach((ticket, index) => {
        if (('ticketName' in  ticket)  &&  ticket.ticketName.length && ticket.ticketName.length > 0 &&
          ('remainingQuantity' in ticket) && ticket.remainingQuantity >0 &&
          ('currentTicketPrice' in ticket) && ticket.currentTicketPrice >= 0) {
   
          formData.append(`tickets[${index}][sort]`, 10 + 10 * index);

          if (ticket.currency) {
            formData.append(
              `tickets[${index}][currency]`,
              ticket.currency.slice(0, 3)
            );
          }

          ticketDetailsFields.forEach((field) => {
            console.log ("1) FORM APPENDING>> if ",ticket[field], `tickets[${index}][${field}]`, ticket[field]);
            if (field in ticket && ticket[field] !== "" && ('undefined' !== typeof ticket[field]) ) {
              console.log ("2) FORM APPENDING>> if ",ticket[field], `tickets[${index}][${field}]`, ticket[field]);
              formData.append(`tickets[${index}][${field}]`, ticket[field]);
            }
          });

          // {form: "bogo",   args: {buy:5, get:4, discount:.90}}
          // for "bogod" and "bogof"
          if (
            ticket.priceFeature === "bogod" ||
            ticket.priceFeature === "bogof"
          ) {
            formData.append(
              `tickets[${index}][priceFunction][form]`, "bogo");
            formData.append(
              `tickets[${index}][priceFunction][args][buy]`, ticket.functionArgs.buy
            );
            formData.append(
              `tickets[${index}][priceFunction][args][get]`, ticket.functionArgs.get
            );
            formData.append(
              `tickets[${index}][priceFunction][args][discount]`, ticket.functionArgs.discount/100
            );
          }

          // {form: "twofer", args: {buy:2,  for:15}}
          // for "twofer"
          if (ticket.priceFeature === "twofer") {
            formData.append(
              `tickets[${index}][priceFunction][form]`, "twofer");
            formData.append(
              `tickets[${index}][priceFunction][args][buy]`, ticket.functionArgs.buy
            );
            formData.append(
              `tickets[${index}][priceFunction][args][for]`, ticket.functionArgs.for
            );
          }

          // {form: "promo",  args: {
          //    promocodes:  [
          //      {name:"flyers", discount: .20, pct: true} ,  // 20% off
          //      {name:"eagles", discount:10,  pct: false }    // $10 off
          //    ]}
          // }
          // for "promo"
          if (ticket.priceFeature === "promo") {
            formData.append(`tickets[${index}][priceFunction][form]`, "promo");
            ticket.promoCodes.forEach((item, number) => {
              formData.append(
                `tickets[${index}][priceFunction][args][promocodes][${number}][key]`, item.key
              );
              formData.append(
                `tickets[${index}][priceFunction][args][promocodes][${number}][name]`, item.name
              );
              formData.append(
                `tickets[${index}][priceFunction][args][promocodes][${number}][amount]`, item.amount
              );
              formData.append(
                `tickets[${index}][priceFunction][args][promocodes][${number}][percent]`, item.percent
              );
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
          }
        }
        else {
          console.log("skipped ticket ", index);
        }

      });

      // Display the key/value pairs
      for (var pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      let userid = vendorInfo.id;

      let token = vendorInfo.token;
      const authstring = `Bearer ${token}`;
      var myHeaders = new Headers();
      myHeaders.append("Authorization", authstring);

      let apiurl;
      apiurl = `${API}/eventix/${userid}/${eventDescription.eventNum}`;

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
        if (!res.status){
            if (res.message ){
              tempStatus.status = "error";
              } else {
              tempStatus.status = "failure";
            }
          };
          setEventStatus(tempStatus);
          return res;
      })
      .catch((err) => {
        console.log("Inside the .catch")
        console.log("**ERROR THROWN", err);
        tempStatus.status = "failure";
        setEventStatus(tempStatus);
      });
    }
  }

  const handleErrors = (response) => {
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };


  const savedModal = () => {
    if (eventStatus.status === "failure" || eventStatus.status === "error") {
      return (
        <Fragment>
          <SavedModal
            show={true}
            details={eventStatus}
            editEvent={() => {
              let tempStatus = { ...eventStatus };
              tempStatus.status = "";
              setEventStatus(tempStatus);
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
            show={true}
            details={eventStatus}
            toDashboard={() => {
              window.location.href = `/vendor`;
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

  // duped from createEvent
  const changeEventDate = (day, fieldName) => {
    console.log("day from Date selector: ", day);
    let tempDescription = { ...eventDescription };
    console.log("day: ", day)

    let date = dateFnsFormat(day,'MM/dd/yyyy');
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

  // duped from createEvent
  const changeEventDescriptionRadio = (event, value, name) => {
    let tempDescription = { ...eventDescription };
    tempDescription[name] = value.value;
    setEventDescription(tempDescription);
  };

  // duped from createEvent
  const changeLongDescription = (editorContent) => {
    let tempDescription = { ...eventDescription };
    tempDescription.longDescription = editorContent;
    setEventDescription(tempDescription);
  };

  // TICKET DETAILS HANDLERS
  // duped from createEvent
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

  // duped from createEvent
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

  // duped from createEvent
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

  // duped from createEvent
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

  // duped from createEvent
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

  // duped from createEvent
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
          promoCodes: [
            { key: "1", name: "", amount: "", percent: false },
          ],
          promoCodeNames: [],
          promoCodeWarning: "",
          functionArgs: {},
          viewModal: false
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

  // duped from createEvent
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

  // duped from createEvent
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

  // duped from createEvent
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

  // duped from createEvent
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

  // duped from createEvent
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

  // duped from createEvent
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

  // duped from createEvent
  const subTitleDisplay = () => {
    if (pageErrors || eventTitleOmission) {
      return (
        <div style={{display: "grid", gridTemplateColumns: "200px 600px"}}>
          <div style={{paddingTop: "5px"}}>
            <button
              className={classes.SwitchButton}
              onClick={() => {props.clicked("events")}}
            >
              Switch Event
            </button>
          </div>
          <div style={{ paddingTop: "5px", textAlign: "center", fontSize: "14px", color: "red"}}>
            Please correct input errors identified below.
          </div>
        </div>
      )
    } else {
      return (
        <div style={{paddingTop: "5px"}}>
          <button
            className={classes.SwitchButton}
            onClick={() => {props.clicked("events")}}
          >
            Switch Event
          </button>
        </div>
      )
    }
  }

  // duped from createEvent
  const [dragging, setDragging] = useState(false);

  // duped from createEvent
  const dragItem = useRef();
  const dragNode = useRef();

  // duped from createEvent
  const handleDragStart = (event, index) => {
    dragItem.current = index;
    dragNode.current = event.target;
    dragNode.current.addEventListener("dragend", handleDragEnd);
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  // duped from createEvent
  const handleDragEnd = () => {
    dragNode.current.removeEventListener("dragend", handleDragEnd);
    setDragging(false);
    dragItem.current = null;
    dragNode.current = null;
  };

  // duped from createEvent
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

  // duped from createEvent
  const changeEventField = (value, field) => {
    let tempDescription = { ...eventDescription };
    tempDescription[field] = value;
    console.log("eventEndTime: ", value);
    setEventDescription(tempDescription);
  };

  // duped from createEvent
  const changeEventCategory = (value) => {
    let tempDescription = { ...eventDescription };
    tempDescription.eventCategory = value;
    console.log("eventCategory: ", value);
    setEventDescription(tempDescription);
  };

  // duped from createEvent
  const changeEventImage = (image) => {
    let tempDescription = { ...eventDescription };
    tempDescription.photo = image;
    tempDescription.photoChanged = true;
    setEventDescription(tempDescription);
  }

  const currentStatus = () => {
    if (eventDescription.isDraft) {
      return (
        <div
          style={{
            paddingTop: "6px",
            fontSize: "20px",
            color: "#B80000",
            fontWeight: "400",
            textAlign: "center"
            }}>
            STATUS DRAFT
          </div>
      )
    } else {
      return (
        <div
          style={{
            paddingTop: "6px",
            fontSize: "20px",
            color: "#008F00",
            fontWeight: "400",
            textAlign: "center",
            }}>
          STATUS LIVE
        </div>
      )
    }
  }

  const buttonDisplay = () => {
    let draftStatus;
    let liveStatus;

    if (eventDescription.isDraft) {
      draftStatus = "UPDATE DRAFT";
      liveStatus = "GO LIVE NOW";
    } else {
      draftStatus = "SAVE AS DRAFT"
      liveStatus = "UPDATE LIVE";
    }

    return (
      <Fragment>
        <div>
          <button
            className={classes.ButtonRed}
            onClick={() => {
              let tempDescription = {...eventDescription };
              tempDescription.isDraft = true;
              setEventDescription(tempDescription);
              saveEvent("saved");
            }}
          >{draftStatus}</button>
        </div>
        <div>
          <button
            className={classes.ButtonGreen}
            onClick={() => {
              let tempDescription = {...eventDescription };
              tempDescription.isDraft = false;
              setEventDescription(tempDescription);
              saveEvent("live");
            }}
          >{liveStatus}</button>
        </div>
        <div>
          <button
            className={classes.ButtonGrey}
            onClick={() => {
              window.location.href = `/vendor`
            }}
          >CANCEL EDIT</button>
        </div>
      </Fragment>
    )
  }

  const displayHeader = (
    <div className={classes.GridTitlePanel}>
      <div className={classes.GridTitle}>
        <div style={{fontSize: "26px", paddingTop: "6px", paddingLeft: "15px"}}>
          Event Edit
        </div>
        {currentStatus()}
        {buttonDisplay()}
      </div>
      <div>
        {subTitleDisplay()}
      </div>
    </div>
  )

  const mainDisplay = () => {
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
            paddingRight: "20px"
          }}>
          <div>
            <EventDetails
              event={eventDescription}
              titleOmission={eventTitleOmission}
              eventImage={"existing"}
              photoData={photoData}
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
  }

  const tabTitle = (
    <div className={classes.DashboardHeader}>
      {(true) ?
      <div style={{fontSize: "26px", fontWeight: "600"}}>Event Title for Event Edit</div>
      :
      <div><br></br></div>}
      <div style={{paddingTop: "5px"}}>
      <button
        className={classes.SwitchButton}
        onClick={() => {props.clicked("events")}}
      >
        Switch Event
      </button>
      </div>
    </div>
  )

  return (
    <div>
      {displayHeader}
      {mainDisplay()}
      {savedModal()}
    </div>
  )
};

export default EventEdit;