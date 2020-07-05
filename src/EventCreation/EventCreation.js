import React, { useState, useRef, useEffect } from "react";

import dateFnsFormat from 'date-fns/format';

import { API } from "../config";


import ImgDropAndCrop from "../ImgDropAndCrop/ImgDropAndCrop";

import { Editor } from "@tinymce/tinymce-react";
import CountrySelector from "./Selectors/CountrySelector";
import TimeSelector from "./Selectors/TimeSelector";
import TimeZoneSelector from "./Selectors/TimeZoneSelector";
import CategorySelector from "./Selectors/CategorySelector";


import DateSelector from "./DateSelector";
import CurrencySelector from "./Selectors/CurrencySelector";
import RadioForm from "./RadioForm";

import TicketModal from "./Modals/TicketModal";
import SavedModal from "./Modals/SavedModal";

import classes from "./EventCreation.module.css";
import Aux from "../hoc/Auxiliary/Auxiliary";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faTrashAlt,
  faGripVertical,
  faCog
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
  const [eventTitleOmission, setEventTitleOmission] = useState(false);
  const [pageErrors, setPageErrors] = useState(false);

  // stores all Event Description values
  const [eventDescription, setEventDescription] = useState({
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
    startTime: "18:00.00",
    endDate: new Date(new Date().toDateString()),
    endTime: "19:00.00",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    eventImage: "",
    shortDescription: "",
    longDescription: "",
    eventCategory: "",
    facebookLink: "",
    twitterLink: "",
    linkedinLink: "",
    instagramLink: "",
    vanityLink: "",
    refundPolicy: "noRefunds",
  });

  // stores all Ticket Details values
  const [ticketDetails, setTicketDetails] = useState([
    {
      key: "1",
      sort: "",
      _id: "",
      ticketName: "",
      remainingQuantity: "",
      quantityWarning: false,
      currentTicketPrice: "",
      priceWarning: false,
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
      viewModal: false,
      nameWarning: false
    },
  ]);

  const [eventStatus, setEventStatus] = useState({
    status: "", // "saved", "live", "error", "failure"
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
      vendorInfo.token = tempUser.token;
      vendorInfo.id = tempUser.user._id;
    } else {
      window.location.href = "/signin";
    }
  }, []);

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

    ticketDetails.forEach((ticket, index) => {
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
      }
    })

    if (!eventDescription.eventTitle) {
      console.log("You need to complete these fields");
      setEventTitleOmission(true);
      tempEventTitleOmission = true;
    }

    if (!tempPageErrors && !tempEventTitleOmission) {
      let eventDescriptionFields = [
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
          if (eventDescription[field] !== '') {
            console.log("eventDescription[field]: ", eventDescription[field] )
            formData.append(`${field}`, eventDescription[field]);
          }
      });
    
      let tempDescription = { ...eventDescription };

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
      
      let tempStartDate = dateFnsFormat(eventDescription.startDate,'yyyy-MM-dd');
      //console.log("startDate from dateFnsFormat: ", tempStartDate);

      let tempEndDate = dateFnsFormat(eventDescription.endDate,'yyyy-MM-dd');
      //console.log("endDate from dateFnsFormat: ", tempEndDate);

      let tempStartDateTime = `${tempStartDate} ${eventDescription.startTime}Z`;
      //console.log("startDateTime: ", tempStartDateTime);

      let tempEndDateTime = `${tempEndDate} ${eventDescription.endTime}Z`;
      //console.log("endDateTime: ", tempEndDateTime);

      formData.append("startDateTime", tempStartDateTime);
      formData.append("endDateTime", tempEndDateTime);
           
      if (eventDescription.eventImage) {
        console.log("eventDescription.eventImage: ", eventDescription.eventImage)
        formData.append("photo", eventDescription.eventImage);
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
          //console.log("skipped ticket ", index);
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
      apiurl = `${API}/eventix/${userid}`;

      fetch(apiurl, {
        method: "post",
        headers: myHeaders,
        body: formData,
        redirect: "follow",
      })
      .then(handleErrors)
      .then((response) => {
        console.log("response in create", response);
        return response.json();
      })
      .then((res) => {
        console.log("Event was saved/went live");
        console.log("res: ", res);
        
        if (!res.done && res.friendlyMessage) {
          console.log("Inside: res.done ",res.done," res.friendlyMessage ", res.friendlyMessage)
          tempStatus.status = "error";
          tempStatus.errorMessage = res.friendlyMessage;
        } else if(!res.done && res.error) {
          console.log("Inside: res.done ",res.done," res.friendlyMessage ", res.friendlyMessage)
          tempStatus.status = "error";
          tempStatus.errorMessage = res.error;
        } else if(!res.done && !res.friendlyMessage) {
          console.log("Inside: res.done ",res.done," res.friendlyMessage ", res.friendlyMessage)
          tempStatus.status = "failure";
        }
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
    console.log("inside handleErrors")
    console.log("response: ", response)
    if (!response.ok) {
      console.log("bad response");
      console.log("response: ", response.ok);
      throw Error(response.status);
    } else {
      console.log("good response");
      console.log("response: ", response.ok);
    }
    return response;
  };

  const savedModal = () => {
    if (eventStatus.status === "failure" || eventStatus.status === "error") {
      return (
        <Aux>
          <SavedModal
            show={true}
            details={eventStatus}
            editEvent={() => {
              let tempStatus = { ...eventStatus };
              tempStatus.status = "";
              setEventStatus(tempStatus);
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
        .replace(/\s+/g, "-") // any oddball character
        .replace(/[^a-zA-Z0-9-]/g, "") // anything but "a-zA-Z0-9"
        .toLowerCase();
    }
    setEventDescription(tempDescription);
    //console.log("Event Description: ", tempDescription);
  };  

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

  const changeCategory = (value) => {
    let tempDescription = { ...eventDescription };
    tempDescription.eventCategory = value;
    console.log("eventCategory: ", value);
    setEventDescription(tempDescription);
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
      let twoferRegex = /^(0|[1-9]|[1-9][0-9]+)$/;

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
        ticket.functionArgs.buyWarning = !twoferRegex.test(ticket.functionArgs.buy);
        console.log("ticket.functionArgs.buyWarning: ", ticket.functionArgs.buyWarning)
      }

      if(!ticket.functionArgs.for) {
        ticket.functionArgs.forWarning = false;
        console.log("ticket.functionArgs.forWarning: ", ticket.functionArgs.forWarning)
      } else {
        ticket.functionArgs.forWarning = !twoferRegex.test(ticket.functionArgs.for);
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
        tempForWarning = classes.SpecialFeaturesBoxWarning;
        forWarningText = "Not a whole number";
      } else if (ticket.functionArgs.for) {
        tempForWarning = classes.SpecialFeaturesBox;
        forWarningText = "";
      } else if (ticket.functionArgs.reqWarning) {
        tempForWarning = classes.SpecialFeaturesBoxWarning;
        forWarningText = "Required field";
      } else {
        tempForWarning = classes.SpecialFeaturesBox;
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
              ></input>{" "}
              ticket(s) for the price of{" "}
              <input
                className={tempForWarning}
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
            Currency
          </div>
        </div>

        <div className={classes.InputBox}>
          <CurrencySelector
            current={ticket.currency === "" ? "default" : ticket.currency}
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
    dragItem.current = index;
    dragNode.current = event.target;
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
          // defines warnings for ticket quantity and price
          let quantityRegex = /^(0|[1-9]|[1-9][0-9]+)$/;
          let priceRegex = /^(0|0\.|0\.[0-9]|0\.[0-9][0-9]|\.|\.[0-9]|\.[0-9][0-9]|[1-9][0-9]+|[1-9][0-9]+\.|[1-9][0-9]+\.[0-9]|[1-9][0-9]+\.[0-9][0-9]|[0-9]| [0-9]\.|[0-9]\.[0-9]|[0-9]\.[0-9][0-9]|)$/;

          // determines if a price or quantity field warning is required          
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
          let tempPriceBox;
          let tempQuantityBox;

          if (item.priceWarning) {
            tempPriceBox = classes.PriceBoxWarning;
          } else {
            tempPriceBox = classes.PriceBox;
          }

          if (item.quantityWarning) {
            tempQuantityBox = classes.QuantityBoxWarning;
          } else {
            tempQuantityBox = classes.QuantityBox;
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
                  <input
                    style={{
                      padding: "9px 10px",
                      border: "1px solid lightgrey",
                      boxSizing: "borderBox",
                    }}
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

                <div className={tempPriceBox}
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

              {item.priceWarning || item.quantityWarning
                ? <div
                  className={classes.TicketLineWarning}
                >
                  <div>{" "}</div>
                  <div style={{ paddingLeft: "5px"}}> {item.quantityWarning ? "Not a whole number" : null}</div>
                  <div style={{ paddingRight: "5px", textAlign: "right"}}> {item.priceWarning ? "Incorrect number type" : null}</div>
                </div>
                : null
              }

              {item.settings ? additionalSettings(item) : null}

            </Aux>
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

  const imageCanvas = () => (
    <ImgDropAndCrop
      imagein={{isLoaded:true}}
      change={(image) => {
        let tempDescription = { ...eventDescription };
        tempDescription.eventImage = image;
        setEventDescription(tempDescription);
  
      }}
    />
  );

  const subTitleDisplay = () => {
    if (pageErrors || eventTitleOmission) {
      return (
        <div className={classes.GridSubTitle}>
          <div style={{ textAlign: "left" }}>
          </div>
          <div style={{ textAlign: "center", color: "red"}}>
            Please correct input errors identified below.
          </div>
        </div>
      )
    } else {
      return (
        <div className={classes.GridSubTitle}>
          <div style={{ textAlign: "left" }}>
          </div>
        </div>
      )
    }
  }

  const mainDisplay = () => {
      return (
        <div className={classes.MainContainer}>
          <div className={classes.GridTitlePanel}>
            <div className={classes.GridTitle}>
              <div
                style={{
                  paddingTop: "5px",
                  fontSize: "30px",
                  fontWeight: "600",
                  }}>
                  Create Event
              </div>
              <div>
              </div>
              <Button
                style={{
                  backgroundColor: 'white',
                  border: "1px solid blue",
                  color: "blue",
                  fontSize: "12px",
                  width: "90px",
                  height: "30px",
                  margin: "auto",
                  textAlign: "center",
                  padding: "0px",
                }}
                content="Save as Draft"
                onClick={() => {
                  let tempDescription = {...eventDescription };
                  tempDescription.isDraft = true;
                  setEventDescription(tempDescription);
                  saveEvent("saved");
                }}
              />
              <Button
                style={{
                  backgroundColor: 'white',
                  border: "1px solid green",
                  color: "green",
                  fontSize: "12px",
                  width: "90px",
                  height: "30px",
                  margin: "auto",
                  textAlign: "center",
                  padding: "0px",
                }}
                content="Go Live Now"
                onClick={() => {
                  let tempDescription = {...eventDescription };
                  tempDescription.isDraft = false;
                  setEventDescription(tempDescription);
                  saveEvent("live");
                }}
              />
              <Button
                style={{
                  backgroundColor: 'white',
                  border: "1px solid red",
                  color: "red",
                  fontSize: "12px",
                  width: "90px",
                  height: "30px",
                  margin: "auto",
                  textAlign: "center",
                  padding: "0px",
                }}
                content="Cancel Create"
                onClick={() => {
                  window.location.href = `/vendorevents`
                }}
              />
            </div>
            <div>
              {subTitleDisplay()}
            </div>
          </div>

          <div className={classes.MainGrid}>
            {savedModal()}
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
                  maxLength="64"
                  placeholder="Short title of event: limit 64 characters"
                  name="eventTitle"
                  value={eventDescription.eventTitle}
                  onChange={(event) => {
                    changeEventDescription(event);
                  }}
                ></input>
                {eventTitleWarning
                  ? displayMessage(64, eventDescription.eventTitle)
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
                      maxLength="64"
                      placeholder="Address1: limit 64 characters"
                      value={eventDescription.locationAddress1}
                      onChange={(event) => {
                        changeEventDescription(event);
                      }}
                    ></input>
                    {eventAddress1Warning
                      ? displayMessage(64, eventDescription.locationAddress1)
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
                      maxLength="64"
                      placeholder="Address2: limit 64 characters"
                      value={eventDescription.locationAddress2}
                      onChange={(event) => {
                        changeEventDescription(event);
                      }}
                    ></input>
                    {eventAddress2Warning
                      ? displayMessage(64, eventDescription.locationAddress2)
                      : null}
                  </div>
    
                  <div className={classes.InputBoxTight}>
                    <input
                      className={classes.InputBoxContent}
                      style={{ width: "600px" }}
                      onFocus={() => setEventCityWarning(true)}
                      onBlur={() => setEventCityWarning(false)}
                      type="text"
                      id="locationCity"
                      name="locationCity"
                      maxLength="64"
                      placeholder="City: limit 64 characters"
                      value={eventDescription.locationCity}
                      onChange={(event) => {
                        let tempDescription = { ...eventDescription };
                        tempDescription.locationCity = event.target.value;
                        setEventDescription(tempDescription);
                      }}
                    ></input>
                    {eventCityWarning
                      ? displayMessage(64, eventDescription.locationCity)
                      : null}
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
                      placeholder="State: 2 letter code"
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
                      onFocus={() => setEventZipPostalWarning(true)}
                      onBlur={() => setEventZipPostalWarning(false)}
                      type="text"
                      id="locationPostalCode"
                      maxLength="5"
                      placeholder="Zip/Postal"
                      value={eventDescription.locationZipPostalCode}
                      onChange={(event) => {
                        let tempDescription = { ...eventDescription };
                        tempDescription.locationZipPostalCode = event.target.value;
                        setEventDescription(tempDescription);
                      }}
                    ></input>
              
                    {eventStateWarning
                        ? (<div>
                          {displayMessage(2, eventDescription.locationState)}
                        </div>)
                        : null}
              
                    {eventZipPostalWarning
                      ? (<div>
                        <div>{" "}</div>
                      </div>)
                      : null}

                    {eventZipPostalWarning
                      ? (<div>
                        {displayMessage(5, eventDescription.locationZipPostalCode)}
                      </div>)
                      : null}
                    </div>

                  <div className={classes.InputBoxTight}>
                    <CountrySelector
                      className={classes.InputBoxContent}
                      style={{ width: "600px" }}
                      current={eventDescription.locationCountryCode}
                      //defaultValue="United States of America"
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
                      maxLength="256"
                      placeholder="Notes: 'e.g. Enter through backdoor' limit 256 characters"
                      value={eventDescription.locationNote}
                      onChange={(event) => {
                        let tempDescription = { ...eventDescription };
                        tempDescription.locationNote = event.target.value;
                        setEventDescription(tempDescription);
                      }}
                    ></input>
                    {eventAdditionalWarning
                      ? displayMessage(256, eventDescription.locationNote)
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
                      maxLength="254"
                      placeholder="Webinar Link: limit 256 characters"
                      value={eventDescription.webinarLink}
                      onChange={(event) => {
                        let tempDescription = { ...eventDescription };
                        tempDescription.webinarLink = event.target.value;
                        setEventDescription(tempDescription);
                      }}
                    ></input>
                    {webinarLinkWarning
                      ? displayMessage(256, eventDescription.webinarLink)
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
                      maxLength="1000"
                      placeholder="Additional Instructions: limit 1000 characters"
                      value={eventDescription.onlineInformation}
                      onChange={(event) => {
                        let tempDescription = { ...eventDescription };
                        tempDescription.onlineInformation = event.target.value;
                        setEventDescription(tempDescription);
                      }}
                    ></input>
                    {webinarInfoWarning
                      ? displayMessage(1000, eventDescription.onlineInformation)
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
                      maxLength="256"
                      placeholder="Webinar Link: limit 256 characters"
                      value={eventDescription.webinarLink}
                      onChange={(event) => {
                        let tempDescription = { ...eventDescription };
                        tempDescription.webinarLink = event.target.value;
                        setEventDescription(tempDescription);
                      }}
                    ></input>
                    {webinarLinkWarning
                      ? displayMessage(256, eventDescription.webinarLink)
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
                      maxLength="1000"
                      placeholder="Additional Instructions: limit 1000 characters"
                      value={eventDescription.onlineInformation}
                      onChange={(event) => {
                        let tempDescription = { ...eventDescription };
                        tempDescription.onlineInformation = event.target.value;
                        setEventDescription(tempDescription);
                      }}
                    ></input>
                    {webinarInfoWarning
                      ? displayMessage(1000, eventDescription.onlineInformation)
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
                      maxLength="1000"
                      placeholder="Additional Instructions: limit 1000 characters"
                      value={eventDescription.tbaInformation}
                      onChange={(event) => {
                        let tempDescription = { ...eventDescription };
                        tempDescription.tbaInformation = event.target.value;
                        setEventDescription(tempDescription);
                      }}
                    ></input>
                    {tbaInfoWarning
                      ? displayMessage(1000, eventDescription.tbaInformation)
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
                  current={eventDescription.startTime}
                  name="startTime"
                  getTime={changeStartTime}
                  //startDate={eventDescription.startDate}
                  //startTime={eventDescription.startTime}
                  //endDate={eventDescription.endDate}
                />
                <DateSelector
                  type={"endDate"}
                  startDate={eventDescription.startDate}
                  current={eventDescription.endDate}
                  change={(date) => changeEventDate(date, "end")}
                  beforeDate={eventDescription.startDate}
                />
                <TimeSelector
                  current={eventDescription.endTime}
                  name="endTime"
                  getTime={changeEndTime}
                  //startDate={parseInt(eventDescription.startDate)}
                  //startTime={parseInt(eventDescription.startTime)}
                  //endDate={eventDescription.endDate}
                />
                <TimeZoneSelector
                  current={eventDescription.timeZone}
                  //defaultValue="Eastern Time - New York"
                  getTimeZone={changeTimeZone}
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
                  current={eventDescription.eventCategory}
                  //defaultValue="United States of America"
                  getCategory={changeCategory}
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
                  onFocus={() => setFacebookWarning(true)}
                  onBlur={() => setFacebookWarning(false)}
                  type="text"
                  id="facebookLink"
                  maxLength="64"
                  placeholder="your facebook address: limit 64 characters"
                  name="facebookLink"
                  value={eventDescription.facebookLink}
                  onChange={(event) => {
                    changeEventDescription(event);
                  }}
                ></input>
                </div>
              
              {facebookWarning
                  ? (<div className={classes.SocialMediaLink} style={{ height: "20px" }}>
                    <div>{" "}</div>
                    <div>{" "}</div>
                    {displayMessage(64, eventDescription.facebookLink)}
                  </div>)
                  : null}

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
                  onFocus={() => setTwitterWarning(true)}
                  onBlur={() => setTwitterWarning(false)}
                  type="text"
                  maxLength="64"
                  id="twitterLink"
                  placeholder="your twitter address: limit 64 characters"
                  name="twitterLink"
                  value={eventDescription.twitterLink}
                  onChange={(event) => {
                    changeEventDescription(event);
                  }}
                ></input>
              </div>
              
              {twitterWarning
                  ? (<div className={classes.SocialMediaLink} style={{ height: "20px" }}>
                    <div>{" "}</div>
                    <div>{" "}</div>
                    {displayMessage(64, eventDescription.twitterLink)}
                  </div>)
                  : null}
    
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
                  onFocus={() => setLinkedinWarning(true)}
                  onBlur={() => setLinkedinWarning(false)}
                  type="text"
                  maxLength="64"
                  id="linkedinLink"
                  placeholder="your linkedin address: limit 64 characters"
                  name="linkedinLink"
                  value={eventDescription.linkedinLink}
                  onChange={(event) => {
                    changeEventDescription(event);
                  }}
                ></input>
              </div>
              
              {linkedinWarning
                  ? (<div className={classes.SocialMediaLink} style={{ height: "20px" }}>
                    <div>{" "}</div>
                    <div>{" "}</div>
                    {displayMessage(64, eventDescription.linkedinLink)}
                  </div>)
                  : null}
    
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
                  onFocus={() => setInstagramWarning(true)}
                  onBlur={() => setInstagramWarning(false)}
                  type="text"
                  maxLength="64"
                  id="instagramLink"
                  placeholder="your instagram address: limit 64 characters"
                  name="instagramLink"
                  value={eventDescription.instagramLink}
                  onChange={(event) => {
                    changeEventDescription(event);
                  }}
                ></input>
              </div>
              
              {instagramWarning
                  ? (<div className={classes.SocialMediaLink} style={{ height: "20px" }}>
                    <div>{" "}</div>
                    <div>{" "}</div>
                    {displayMessage(64, eventDescription.instagramLink)}
                  </div>)
                  : null}
    
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
                  style={{fontSize: "12px"}}
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

            </div>
          </div>
        </div>
      );
  }

  return (
    <div>
      <div>{mainDisplay()}</div>
    </div>
  )
};

export default EventCreation;