



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
        <div style={{ paddingTop: "5px", textAlign: "center", fontSize: "14px", color: "red"}}>
          Please correct input errors identified below.
        </div>
      )
    } else {
      return (
        <div style={{ paddingTop: "5px", textAlign: "center", fontSize: "14px", color: "red"}}>
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
          <Button
            style={{
              backgroundColor: 'white',
              border: "1.5px solid #B80000",
              borderRadius: "0px",
              color: "black",
              fontSize: "12px",
              fontWeight: "400",
              width: "120px",
              height: "30px",
              margin: "auto",
              textAlign: "center",
              padding: "0px",
            }}
            content={draftStatus}
            onClick={() => {
              let tempDescription = {...eventDescription };
              tempDescription.isDraft = true;
              setEventDescription(tempDescription);
              saveEvent("saved");
            }}
          />
        </div>
        <div>
          <Button
            style={{
              backgroundColor: 'white',
              border: "1.5px solid #008F00",
              borderRadius: "0px",
              color: "black",
              fontSize: "12px",
              fontWeight: "400",
              width: "120px",
              height: "30px",
              margin: "auto",
              textAlign: "center",
              padding: "0px",
            }}
            content={liveStatus}
            onClick={() => {
              let tempDescription = {...eventDescription };
              tempDescription.isDraft = false;
              setEventDescription(tempDescription);
              saveEvent("live");
            }}
          />
        </div>
        <div>
          <Button
            style={{
              backgroundColor: 'white',
              border: "1.5px solid black",
              borderRadius: "0px",
              color: "black",
              fontSize: "12px",
              fontWeight: "400",
              width: "120px",
              height: "30px",
              margin: "auto",
              textAlign: "center",
              padding: "0px",
            }}
            content="CANCEL EDIT"
            onClick={() => {
              window.location.href = `/vendor`
            }}
          />
        </div>
      </Fragment>
    )
  }

  const mainDisplay = () => {
      return (
        <div
          style={{
            backgroundColor: "white",
            height: "calc(100vh - 177px)",
            scrollbarWidth: "thin",
            overflowY: "auto",
            fontSize: "15px",
            width: "1030px",
            marginTop: "60px",
            paddingTop: "10px",
            paddingBotton: "15px",
            paddingLeft: "20px",
            paddingRight: "20px"
          }}>

          <div className={classes.GridTitlePanel}>
            <div className={classes.GridTitle}>
              <div style={{fontSize: "26px", paddingTop: "6px"}}>
                Event Edit
              </div>
              {currentStatus()}
              {buttonDisplay()}
            </div>
            <div>
              {subTitleDisplay()}
            </div>
          </div>
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
      {tabTitle}
      {mainDisplay()}
      {savedModal()}
    </div>
  )
};

export default EventEdit;
/*
const [eventTitleWarning, setEventTitleWarning] = useState(false);
  const [shortDescriptionWarning, setShortDescriptionWarning] = useState(false);
  const [eventLocationWarning, setEventLocationWarning] = useState(false);
  const [eventAddress1Warning, setEventAddress1Warning] = useState(false);
  const [eventAddress2Warning, setEventAddress2Warning] = useState(false);
  const [eventCityWarning, setEventCityWarning] = useState(false);
  const [eventStateWarning, setEventStateWarning] = useState(false);
  const [eventZipPostalWarning, setEventZipPostalWarning] = useState(false);
  const [eventAdditionalWarning, setEventAdditionalWarning] = useState(false);
  const [webinarLinkWarning, setWebinarLinkWarning] = useState(false);
  const [webinarInfoWarning, setWebinarInfoWarning] = useState(false);
  const [tbaInfoWarning, setTbaInfoWarning] = useState(false);
  const [facebookWarning, setFacebookWarning] = useState(false);
  const [instagramWarning, setInstagramWarning] = useState(false);
  const [linkedinWarning, setLinkedinWarning] = useState(false);
  const [twitterWarning, setTwitterWarning] = useState(false);
  const [vanityWarning, setVanityWarning] = useState(false);

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

  const changeCategory = (value) => {
    let tempDescription = { ...eventDescription };
    tempDescription.eventCategory = value;
    console.log("eventCategory: ", value);
    setEventDescription(tempDescription);
  };

  const changeStartTime = (value) => {
    let tempDescription = { ...eventDescription };
    tempDescription.startTime = value;
    console.log("eventCategory: ", value);
    setEventDescription(tempDescription);
  };

  const changeEndTime = (value) => {
    let tempDescription = { ...eventDescription };
    tempDescription.endTime = value;
    console.log("eventCategory: ", value);
    setEventDescription(tempDescription);
  };

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
  */

/*
  //START CHECKED COMPONENT MATCH "PromoCodeDisplay"
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
  //END CHECKED COMPONENT MATCH "PromoCodeDisplay"

  //START CHECKED COMPONENT MATCH "PriceFeatureSettings"
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
      // defines warnings for Buy-One-Get-One-Free price feature
      let bogofRegex = /^(0|[1-9]|[1-9][0-9]+)$/;

      // determines if a required field warning is required
      if ((ticket.functionArgs.buy === "" && ticket.functionArgs.get === "") ||
        (ticket.functionArgs.buy !== "" && ticket.functionArgs.get !== "")) {
        ticket.functionArgs.reqWarning = false;
        console.log("ticket.functionArgs.reqWarning: ", ticket.functionArgs.reqWarning)
      } else {
        ticket.functionArgs.reqWarning = true;
        console.log("ticket.functionArgs.reqWarning: ", ticket.functionArgs.reqWarning)
      }

      // determines if a buy or get field warning is required
      if(!ticket.functionArgs.buy) {
        ticket.functionArgs.buyWarning = false;
        console.log("ticket.functionArgs.buyWarning: ", ticket.functionArgs.buyWarning)
      } else {
        ticket.functionArgs.buyWarning = !bogofRegex.test(ticket.functionArgs.buy);
        console.log("ticket.functionArgs.buyWarning: ", ticket.functionArgs.buyWarning)
      }

      if(!ticket.functionArgs.get) {
        ticket.functionArgs.getWarning = false;
        console.log("ticket.functionArgs.getWarning: ", ticket.functionArgs.getWarning)
      } else {
        ticket.functionArgs.getWarning = !bogofRegex.test(ticket.functionArgs.get);
        console.log("ticket.functionArgs.getWarning: ", ticket.functionArgs.getWarning)
      }

      // defines styling for the buy and get boxes
      let tempBuyWarning;
      let tempGetWarning;
      let buyWarningText;
      let getWarningText;

      if (ticket.functionArgs.buyWarning) {
        tempBuyWarning = classes.SpecialFeaturesBoxWarning;
        buyWarningText = "Not a whole number";
      } else if (ticket.functionArgs.buy) {
        tempBuyWarning = classes.SpecialFeaturesBox;
        buyWarningText = "";
      } else if (ticket.functionArgs.reqWarning) {
        tempBuyWarning = classes.SpecialFeaturesBoxWarning;
        buyWarningText = "Required field";
      } else {
        tempBuyWarning = classes.SpecialFeaturesBox;
        buyWarningText = "";
      }

      if (ticket.functionArgs.getWarning) {
        tempGetWarning = classes.SpecialFeaturesBoxWarning;
        getWarningText = "Not a whole number";
      } else if (ticket.functionArgs.get) {
        tempGetWarning = classes.SpecialFeaturesBox;
        getWarningText = "";
      } else if (ticket.functionArgs.reqWarning) {
        tempGetWarning = classes.SpecialFeaturesBoxWarning;
        getWarningText = "Required field";
      } else {
        tempGetWarning = classes.SpecialFeaturesBox;
        getWarningText = "";
      }

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
                className={tempBuyWarning}
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
                className={tempGetWarning}
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
          
          {ticket.functionArgs.reqWarning || ticket.functionArgs.buyWarning || ticket.functionArgs.getWarning
            ? <div className={classes.BogofLineWarning}
            >
              <div style={{ paddingLeft: "5px"}}> {buyWarningText}</div>
              <div style={{ paddingRight: "5px", textAlign: "left"}}> {getWarningText}</div>
            </div>
            : null
          }
          
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
      // defines warnings for Buy-One-Get-One-at-a-Discount price feature
      let bogodRegexNum = /^(0|[1-9]|[1-9][0-9]+)$/;
      let bogodRegexPercent = /^(0\.[1-9]|0\.[0-9][1-9]|[1-9]|[1-9]\.|[1-9]\.[0-9]|[1-9]\.[0-9][0-9]|[1-9][0-9]|[1-9][0-9]\.|[1-9][0-9]\.[0-9]|[1-9][0-9]\.[0-9][0-9]|100|100\.|100\.0|100\.00)$/;

      // determines if a required field warning is required
      if ((ticket.functionArgs.buy === "" && ticket.functionArgs.get === "" && ticket.functionArgs.discount === "") ||
        (ticket.functionArgs.buy !== "" && ticket.functionArgs.get !== "" && ticket.functionArgs.discount !== "")) {
        ticket.functionArgs.reqWarning = false;
        console.log("ticket.functionArgs.reqWarning: ", ticket.functionArgs.reqWarning)
      } else {
        ticket.functionArgs.reqWarning = true;
        console.log("ticket.functionArgs.reqWarning: ", ticket.functionArgs.reqWarning)
      }

      // determines if a buy or get field warning is required
      if(!ticket.functionArgs.buy) {
        ticket.functionArgs.buyWarning = false;
        console.log("ticket.functionArgs.buyWarning: ", ticket.functionArgs.buyWarning)
      } else {
        ticket.functionArgs.buyWarning = !bogodRegexNum.test(ticket.functionArgs.buy);
        console.log("ticket.functionArgs.buyWarning: ", ticket.functionArgs.buyWarning)
      }

      if(!ticket.functionArgs.get) {
        ticket.functionArgs.getWarning = false;
        console.log("ticket.functionArgs.getWarning: ", ticket.functionArgs.getWarning)
      } else {
        ticket.functionArgs.getWarning = !bogodRegexNum.test(ticket.functionArgs.get);
        console.log("ticket.functionArgs.getWarning: ", ticket.functionArgs.getWarning)
      }

      if(!ticket.functionArgs.discount) {
        ticket.functionArgs.discountWarning = false;
        console.log("ticket.functionArgs.discountWarning: ", ticket.functionArgs.discountWarning)
      } else {
        ticket.functionArgs.discountWarning = !bogodRegexPercent.test(ticket.functionArgs.discount);
        console.log("ticket.functionArgs.discountWarning: ", ticket.functionArgs.discountWarning)
      }

      // defines styling for the buy and get boxes
      let tempBuyWarning;
      let tempGetWarning;
      let tempDiscountWarning;
      let buyWarningText;
      let getWarningText;
      let discountWarningText;

      if (ticket.functionArgs.buyWarning) {
        tempBuyWarning = classes.SpecialFeaturesBoxWarning;
        buyWarningText = "Not a whole number";
      } else if (ticket.functionArgs.buy) {
        tempBuyWarning = classes.SpecialFeaturesBox;
        buyWarningText = "";
      } else if (ticket.functionArgs.reqWarning) {
        tempBuyWarning = classes.SpecialFeaturesBoxWarning;
        buyWarningText = "Required field";
      } else {
        tempBuyWarning = classes.SpecialFeaturesBox;
        buyWarningText = "";
      }

      if (ticket.functionArgs.getWarning) {
        tempGetWarning = classes.SpecialFeaturesBoxWarning;
        getWarningText = "Not a whole number";
      } else if (ticket.functionArgs.get) {
        tempGetWarning = classes.SpecialFeaturesBox;
        getWarningText = "";
      } else if (ticket.functionArgs.reqWarning) {
        tempGetWarning = classes.SpecialFeaturesBoxWarning;
        getWarningText = "Required field";
      } else {
        tempGetWarning = classes.SpecialFeaturesBox;
        getWarningText = "";
      }

      if (ticket.functionArgs.discountWarning) {
        tempDiscountWarning = classes.SpecialFeaturesBoxWarning;
        discountWarningText = "Not a correct percentage";
      } else if (ticket.functionArgs.discount) {
        tempDiscountWarning = classes.SpecialFeaturesBox;
        discountWarningText = "";
      } else if (ticket.functionArgs.reqWarning) {
        tempDiscountWarning = classes.SpecialFeaturesBoxWarning;
        discountWarningText = "Required field";
      } else {
        tempDiscountWarning = classes.SpecialFeaturesBox;
        discountWarningText = "";
      }

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
                className={tempBuyWarning}
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
                className={tempGetWarning}
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
                className={tempDiscountWarning}
                type="text"
                id="functionArgDiscountBogod"
                placeholder="percent"
                name="discount"
                value={ticket.functionArgs.discount}
                onChange={(event) => {
                  changeArgument(event, ticket.key);
                }}
              ></input>{" "}
              % discount.
            </div>
          </div>

          {ticket.functionArgs.reqWarning || ticket.functionArgs.buyWarning || ticket.functionArgs.getWarning || ticket.functionArgs.discountWarning
            ? <div className={classes.BogodLineWarning}
            >
              <div style={{ paddingLeft: "5px"}}> {buyWarningText}</div>
              <div style={{ paddingRight: "5px", textAlign: "left"}}> {getWarningText}</div>
              <div style={{ paddingRight: "5px", textAlign: "left"}}> {discountWarningText}</div>
            </div>
            : null
          }

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
      // defines warnings for Two-for-One price feature
      let twoferRegexNum = /^(0|[1-9]|[1-9][0-9]+)$/;
      let twoferRegexPrice = /^(0|0\.|0\.[0-9]|0\.[0-9][0-9]|\.|\.[0-9]|\.[0-9][0-9]|[1-9][0-9]+|[1-9][0-9]+\.|[1-9][0-9]+\.[0-9]|[1-9][0-9]+\.[0-9][0-9]|[0-9]| [0-9]\.|[0-9]\.[0-9]|[0-9]\.[0-9][0-9]|)$/;

      // determines if a required field warning is required
      if ((ticket.functionArgs.buy === "" && ticket.functionArgs.for === "") ||
        (ticket.functionArgs.buy !== "" && ticket.functionArgs.for !== "")) {
        ticket.functionArgs.reqWarning = false;
        console.log("ticket.functionArgs.reqWarning: ", ticket.functionArgs.reqWarning)
      } else {
        ticket.functionArgs.reqWarning = true;
        console.log("ticket.functionArgs.reqWarning: ", ticket.functionArgs.reqWarning)
      }

      // determines if a buy or for field warning is required
      if(!ticket.functionArgs.buy) {
        ticket.functionArgs.buyWarning = false;
        console.log("ticket.functionArgs.buyWarning: ", ticket.functionArgs.buyWarning)
      } else {
        ticket.functionArgs.buyWarning = !twoferRegexNum.test(ticket.functionArgs.buy);
        console.log("ticket.functionArgs.buyWarning: ", ticket.functionArgs.buyWarning)
      }

      if(!ticket.functionArgs.for) {
        ticket.functionArgs.forWarning = false;
        console.log("ticket.functionArgs.forWarning: ", ticket.functionArgs.forWarning)
      } else {
        ticket.functionArgs.forWarning = !twoferRegexPrice.test(ticket.functionArgs.for);
        console.log("ticket.functionArgs.forWarning: ", ticket.functionArgs.forWarning)
      }

      // defines styling for the buy and for boxes
      let tempBuyWarning;
      let tempForWarning;
      let buyWarningText;
      let forWarningText;

      if (ticket.functionArgs.buyWarning) {
        tempBuyWarning = classes.SpecialFeaturesBoxWarning;
        buyWarningText = "Not a whole number";
      } else if (ticket.functionArgs.buy) {
        tempBuyWarning = classes.SpecialFeaturesBox;
        buyWarningText = "";
      } else if (ticket.functionArgs.reqWarning) {
        tempBuyWarning = classes.SpecialFeaturesBoxWarning;
        buyWarningText = "Required field";
      } else {
        tempBuyWarning = classes.SpecialFeaturesBox;
        buyWarningText = "";
      }

      if (ticket.functionArgs.forWarning) {
        tempForWarning = classes.ForPriceBoxWarning;
        forWarningText = "Not a valid price";
      } else if (ticket.functionArgs.for) {
        tempForWarning = classes.ForPriceBox;
        forWarningText = "";
      } else if (ticket.functionArgs.reqWarning) {
        tempForWarning = classes.ForPriceBoxWarning;
        forWarningText = "Required field";
      } else {
        tempForWarning = classes.ForPriceBox;
        forWarningText = "";
      }

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
                className={tempBuyWarning}
                type="text"
                id="functionArgBuy2fer"
                placeholder="# of tickets"
                name="buy"
                value={ticket.functionArgs.buy}
                onChange={(event) => {
                  changeArgument(event, ticket.key);
                }}
              ></input>
              {" "}ticket(s) for {" "}
              <span className={tempForWarning}>
                  <span
                      style={{
                        backgroundColor: "white",
                        padding: "9px 10px 9px 10px",
                        textAlign: "center",
                        width: "70px",
                        boxSizing: "borderBox",
                      }}>
                    {ticket.currency === "" ? "USD $" : ticket.currency}
                  </span>
                    <input
                      style={{
                        backgroundColor: "fff",
                        padding: "9px 5px 9px 0px",
                        textAlign: "right",
                        width: "85px",
                        border: "none",
                        outline: "none",
                        boxSizing: "borderBox",
                      }}
                      type="text"
                      id="currentTicketPrice"
                      placeholder="10.00"
                      name="for"
                      value={ticket.functionArgs.for}
                      onChange={(event) => {
                        changeArgument(event, ticket.key);
                          }}
                    ></input>
                  </span>
            </div>
          </div>
          
          {ticket.functionArgs.reqWarning || ticket.functionArgs.buyWarning || ticket.functionArgs.forWarning
            ? <div className={classes.TwoferLineWarning}
            >
              <div style={{ paddingLeft: "5px"}}> {buyWarningText}</div>
              <div style={{ paddingRight: "5px", textAlign: "left"}}> {forWarningText}</div>
            </div>
            : null
          }

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
  //END CHECKED COMPONENT MATCH "PriceFeatureSettings"

  //START CHECKED COMPONENT MATCH "PriceSettings"
  const additionalSettings = (ticket) => {
    // defines warnings for order min and max
    let orderRegex = /^(0|[1-9]|[1-9][0-9]+)$/;

    // determines if a min or max field warning is required
    if(!ticket.minTicketsAllowedPerOrder) {
      ticket.minWarning = false;
    } else {
      ticket.minWarning = !orderRegex.test(ticket.minTicketsAllowedPerOrder);
      console.log("ticket.minWarning: ",ticket.minWarning)
    }

    if(!ticket.maxTicketsAllowedPerOrder) {
      ticket.maxWarning = false;
    } else {
      ticket.maxWarning = !orderRegex.test(ticket.maxTicketsAllowedPerOrder);
      console.log("ticket.maxWarning: ",ticket.maxWarning)
    }

    // defines styling for the order min and max boxes
    let tempMinWarning;
    let tempMaxWarning;
    
    if (ticket.minWarning) {
      tempMinWarning = classes.OrderBoxWarning;
    } else {
      tempMinWarning = classes.OrderBox;
    }
    
    if (ticket.maxWarning) {
      tempMaxWarning = classes.OrderBoxWarning;
    } else {
      tempMaxWarning = classes.OrderBox;
    }

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
            maxLength="1000"
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

        <div className={classes.OrderLine}>
          <div>
            Minimum{" "}
            <input className={tempMinWarning}
              type="text"
              id="minTicketsAllowedPerOrder"
              placeholder="# of tickets"
              name="minTicketsAllowedPerOrder"
              value={ticket.minTicketsAllowedPerOrder}
              onChange={(event) => {
                console.log("ticket: ", ticket)
                changeTicketDetail(event, ticket.key);
              }}
            ></input>{" "}
            ticket(s)
          </div>
          <div>
            Maximum{" "}
            <input className={tempMaxWarning}
              type="text"
              id="maxTicketsAllowedPerOrder"
              placeholder="# of tickets"
              name="maxTicketsAllowedPerOrder"
              value={ticket.maxTicketsAllowedPerOrder}
              onChange={(event) => {
                console.log("ticket: ", ticket)
                changeTicketDetail(event, ticket.key);
              }}
            ></input>{" "}
            ticket(s)
          </div>
        </div>

          {ticket.minWarning || ticket.maxWarning
            ? <div className={classes.OrderLineWarning}
            >
              <div style={{ paddingLeft: "5px"}}> {ticket.minWarning ? "Not a whole number" : null}</div>
              <div style={{ paddingRight: "5px", textAlign: "left"}}> {ticket.maxWarning ? "Not a whole number" : null}</div>
            </div>
            : null
          }

        {priceFeatureSettings(ticket)}
      </div>
    );
  };
  //END CHECKED COMPONENT MATCH "PriceSettings"
*/

/*
  //START CHECKED COMPONENT MATCH "TicketCreation"
  const ticketTypeDisplay = (index) => {
    let display = (
      <Aux>
        {ticketDetails.map((item, index) => {
          // defines warnings for ticket name, quantity and price
          let nameRegex = /^[a-zA-Z0-9\-\s]+$/
          let quantityRegex = /^(0|[1-9]|[1-9][0-9]+)$/;
          let priceRegex = /^(0|0\.|0\.[0-9]|0\.[0-9][0-9]|\.|\.[0-9]|\.[0-9][0-9]|[1-9][0-9]+|[1-9][0-9]+\.|[1-9][0-9]+\.[0-9]|[1-9][0-9]+\.[0-9][0-9]|[0-9]| [0-9]\.|[0-9]\.[0-9]|[0-9]\.[0-9][0-9]|)$/;

          // determines if a required field warning is required
          if ((item.ticketName === "" && item.remainingQuantity === "" && item.currentTicketPrice === "") ||
            (item.ticketName !== "" && item.remainingQuantity !== "" && item.currentTicketPrice !== "")) {
            item.reqWarning = false;
          } else {
            item.reqWarning = true;
          }

          // determines if a name, price or quantity field warning is required          
          if(!item.ticketName) {
            item.nameWarning = false;
          } else {
            item.nameWarning = !nameRegex.test(item.ticketName);
            console.log("nameWarning: ", !nameRegex.test(item.ticketName));
          }

          if(!item.remainingQuantity) {
            item.quantityWarning = false;
          } else {
            item.quantityWarning = !quantityRegex.test(item.remainingQuantity);
          }

          if(!item.currentTicketPrice) {
            item.priceWarning = false;
          } else {
            item.priceWarning = !priceRegex.test(item.currentTicketPrice);
          }

          // defines styling for the price and quantity boxes
          let tempNameBox;
          let tempPriceBox;
          let tempQuantityBox;
          let nameWarningText;
          let priceWarningText;
          let quantityWarningText;
      
          if (item.nameWarning) {
            tempNameBox = classes.NameBoxWarning;
            nameWarningText = "Only alphanumeric characters and spaces";
          } else if (item.ticketName) {
            tempNameBox = classes.NameBox;
            nameWarningText = "";
          } else if (item.reqWarning) {
            tempNameBox = classes.NameBoxWarning;
            nameWarningText = "Required field";
          } else {
            tempNameBox = classes.NameBox;
            nameWarningText = "";
          }

          if (item.priceWarning) {
            tempPriceBox = classes.PriceBoxWarning;
            priceWarningText = "Not a valid price";
          } else if (item.currentTicketPrice) {
            tempPriceBox = classes.PriceBox;
            priceWarningText = "";
          } else if (item.reqWarning) {
            tempPriceBox = classes.PriceBoxWarning;
            priceWarningText = "Required field";
          } else {
            tempPriceBox = classes.PriceBox;
            priceWarningText = "";
          }
      
          //console.log("item.quantityWarning: ", item.quantityWarning)
          if (item.quantityWarning) {
            tempQuantityBox = classes.QuantityBoxWarning;
            quantityWarningText = "Not a whole number";
          } else if (item.remainingQuantity) {
            tempQuantityBox = classes.QuantityBox;
            quantityWarningText = "";
          } else if (item.reqWarning) {
            tempQuantityBox = classes.QuantityBoxWarning;
            quantityWarningText = "Required field";
          } else {
            tempQuantityBox = classes.QuantityBox;
            quantityWarningText = "";
          }

          // defines styling for the ticket name, quantity and price line
          let tempTicketStyling;
          if (dragging && dragItem.current === index) {
            tempTicketStyling = classes.DraggedTicketLine;
          } else {
            tempTicketStyling = classes.TicketLine;
          }

          return (
            <Aux key={index}>
              <div
                className={tempTicketStyling}
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
                  <input className={tempNameBox}
                    type="text"
                    maxLength="64"
                    id="ticketName"
                    placeholder="GA, VIP, etc: limit 64 characters"
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
                  <input className={tempQuantityBox}
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

                <div className={tempPriceBox}>
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
                      backgroundColor: "fff",
                      padding: "9px 5px 9px 0px",
                      textAlign: "right",
                      borderStyle: "none",
                      outline: "none",
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

              {item.nameWarning || item.priceWarning || item.quantityWarning || item.reqWarning
                ? <div
                  className={classes.TicketLineWarning}
                >
                  <div style={{ paddingLeft: "25px"}}> {nameWarningText}</div>
                  <div style={{ paddingLeft: "5px"}}> {quantityWarningText}</div>
                  <div style={{ paddingRight: "5px", textAlign: "right"}}> {priceWarningText}</div>
                </div>
                : null
              }
              <div
                style={{
                  padding: "5px",
                  borderTop: "1px solid lightgrey",
                  height: "30px",
                  textAlign: "center",
                }}
              >
              {!item.settings ? (
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
                  onClick={(event) => switchTicketSettings(event, item.key)}
                >
                <FontAwesomeIcon
                  color="blue"
                  size="sm"
                  cursor="pointer"
                  onClick={() => {
                      //let tempDisplay = {...ticketDisplay};
                      //tempDisplay[item.eventNum] = false;
                      //setTicketDisplay(tempDisplay);
                  }}
                  icon={faChevronDown}
                />
                  {" "}Show additional features
                </button>) : 
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
                  onClick={(event) => switchTicketSettings(event, item.key)}
                >
                <FontAwesomeIcon
                  color="blue"
                  size="sm"
                  cursor="pointer"
                  //onClick={() => {
                      //let tempDisplay = {...ticketDisplay};
                      //tempDisplay[item.eventNum] = false;
                      //setTicketDisplay(tempDisplay);
                  //}}
                  icon={faChevronUp}
                />
                  {" "}Hide additional features
                </button>}
              </div>
              {item.settings ? additionalSettings(item) : null}
            </Aux>
          );
        })}
      </Aux>
    );
    return display;
  };
  //END CHECKED COMPONENT MATCH "TicketCreation"
  */

  /*
  //START CHECKED COMPONENT MATCH "TicketCreation"
            <br></br>
            <div className={classes.CategoryTitle} style={{ width: "160px" }}>
              Ticket Creation
            </div>

            <div style={{ border: "1px solid grey" }}>
              <div
                style={{
                  display: `grid`,
                  gridTemplateColumns: "360px 165px 165px 80px",
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
                  style={{fontSize: "12px"}}
                  content="Add a ticket"
                  icon="add circle"
                  color="green"
                  onClick={createNewTicketHandler}
                />
              </div>
            </div>
  //END CHECKED COMPONENT MATCH "TicketCreation"
  */