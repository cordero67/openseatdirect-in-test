//CODE MARKED HAS BEEN CHECKED VERSUS ORIGINAL
//EXCEPT FOR SMALL STYLING SECTION LABELED BELOW
//EXCEPT FOR <TicketCreation/>, <AdditionalSettings/>,  SECTIONS NOT LABELED BELOW

import React, { useEffect, useState, useRef, Fragment } from "react";

import dateFnsFormat from 'date-fns/format';

import { API } from "../config";






import SavedModal from "./Modals/SavedModal";
import EventDetails from "./Components/EventDetails";
import TicketCreation from "./TicketCreation";
import AdditionalSettings from "./Components/AdditionalSettings";

import classes from "./VendorDashboard.module.css";
import { Button } from "semantic-ui-react";

// holds sign-in information
let vendorInfo = {};

const CreateEvent = (props) => {
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
      startTime: "19:00:00",
      endDate: new Date(new Date().toDateString()),
      endTime: "20:00:00",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      photo: "",
      photoChanged: false,// NOT USED IN CREATEEVENT
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

      console.log("ticketDetails: ", ticketDetails)

      ticketDetails.forEach((ticket, index) => {
        if (ticket.nameWarning) {
          console.log("Name Warning, ticket : ", index)
          setPageErrors(true);
          tempPageErrors = true;
        }
        if (ticket.quantityWarning) {
          console.log("Quantity Warning, ticket : ", index)
          setPageErrors(true);
          tempPageErrors = true;
        }
        if (ticket.priceWarning) {
          console.log("Price Warning, ticket : ", index)
          setPageErrors(true);
          tempPageErrors = true;
        }
        if (ticket.reqWarning) {
          console.log("Required Warning, ticket : ", index)
          setPageErrors(true);
          tempPageErrors = true;
        }
        if (ticket.minWarning) {
          console.log("Min Warning, ticket : ", index)
          setPageErrors(true);
          tempPageErrors = true;
        }
        if (ticket.maxWarning) {
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
          if (ticket.functionArgs.buyWarning) {
            console.log("Buy Warning, ticket : ", index)
            setPageErrors(true);
            tempPageErrors = true;
          }
          if (ticket.functionArgs.getWarning) {
            console.log("Get Warning, ticket : ", index)
            setPageErrors(true);
            tempPageErrors = true;
          }
          if (ticket.functionArgs.discountWarning) {
            console.log("Discount Warning, ticket : ", index)
            setPageErrors(true);
            tempPageErrors = true;
          }
          if (ticket.functionArgs.forWarning) {
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
              "photo",
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

      // does not send empty fields to server
      eventDescriptionFields.forEach((field) => {
          if (tempDescription[field] !== '') {
          console.log("eventDescription[field]: ", tempDescription[field] )
          formData.append(`${field}`, tempDescription[field]);
          }
      });
      
      let tempStartDate = dateFnsFormat(tempDescription.startDate,'yyyy-MM-dd');
      //console.log("startDate from dateFnsFormat: ", tempStartDate);

      let tempEndDate = dateFnsFormat(tempDescription.endDate,'yyyy-MM-dd');
      //console.log("endDate from dateFnsFormat: ", tempEndDate);

      let tempStartDateTime = `${tempStartDate} ${tempDescription.startTime}Z`;
      //console.log("startDateTime: ", tempStartDateTime);

      let tempEndDateTime = `${tempEndDate} ${tempDescription.endTime}Z`;
      //console.log("endDateTime: ", tempEndDateTime);

      formData.append("startDateTime", tempStartDateTime);
      formData.append("endDateTime", tempEndDateTime);







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
      apiurl = `${API}/eventix/${userid}`;

      fetch(apiurl, {
          method: "POST",
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
  // END STRAIGHT COPY FROM ORIGINAL

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
  

    const changeEventImage = (image) => {
        let tempDescription = { ...eventDescription };
        tempDescription.photo = image;
        setEventDescription(tempDescription);
    }
//START CODE REPLICATION CHECK































const buttonDisplay = (
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
      >SAVE AS DRAFT</button>
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
      >GO LIVE NOW</button>
    </div>
    <div>
      <Button
        style={{
        backgroundColor: 'white',
        border: "1.5px solid black",
        borderRadius: "0px",
        color: "black",
        fontSize: "12px",
        fontWeight: 400,
        width: "120px",
        height: "30px",
        margin: "auto",
        textAlign: "center",
        padding: "0px",
        }}
        content="CANCEL CREATE"
        onClick={() => {
          window.location.href = `/vendor`
        }}
      />
    </div>
  </Fragment>
);













  return (
    <div>
      <div className={classes.EventPanelTitle}>
        <div style={{paddingTop: "5px"}}>Create Event</div>
        {subTitleDisplay()}
        {buttonDisplay}
      </div>
      <div className={classes.DisplayPanel}>
        {savedModal()}
        <EventDetails
          event={eventDescription}
          titleOmission={eventTitleOmission}
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
      </div>
    </div>
  )
}

export default CreateEvent;