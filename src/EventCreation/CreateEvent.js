import React, { useState, useRef } from "react";

import dateFnsFormat from 'date-fns/format';

import EventDetails from "./EventDetails";
import TicketCreation from "./TicketCreation";
import AdditionalSettings from "./AdditionalSettings";

import classes2 from "./EventCreation.module.css";
import classes from "./VendorDashboard.module.css";
import { Button, Popup } from "semantic-ui-react";

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
        },
    ]);

    const [eventStatus, setEventStatus] = useState({
      status: "", // "saved", "live", "error", "failure"
      savedMessage: "Congratulations, your event was saved!",
      liveMessage: "Congratulations, your event is live!",
      errorMessage: "", //["Please fix input errors and resubmit."],
      failureMessage: "System error please try again.",
    });

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
      console.log("Event Description: ", tempDescription);
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

    // garuantees that only one ticket has a "true" "viewModal" value
    const activateShowModal = (ticket) => {
      let tempDetails = [...ticketDetails];
      console.log("inside activateShowModal")
      tempDetails.forEach((item) => {
        if (item.key === ticket.key) {
            console.log("inside true")
          item.viewModal = true;
        } else {
            console.log("inside false")
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
  

    const changeEventImage = (image) => {
        let tempDescription = { ...eventDescription };
        tempDescription.photo = image;
        setEventDescription(tempDescription);
    }




//START CODE REPLICATION CHECK

    return (
        <div>
            <div className={classes.EventPanelTitle}>
                <div style={{paddingTop: "5px"}}>CREATE EVENT</div>
                <div></div>
                <div></div>
                <div>
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
                        padding: "0px"
                        }}
                        content="Save as Draft"
                        onClick={() => {
                          // ***** NEED TO INCLUDE
                        //let tempDescription = {...eventDescription };
                        //tempDescription.isDraft = true;
                        //setEventDescription(tempDescription);
                        //saveEvent("saved");
                        }}
                    />
                </div>
                <div>
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
                        // ***** NEED TO INCLUDE
                        //let tempDescription = {...eventDescription };
                        //tempDescription.isDraft = false;
                        //setEventDescription(tempDescription);
                        //saveEvent("live");
                        }}
                    />
                </div>
                <div>
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
                        // ***** NEED TO INCLUDE
                        //window.location.href = `/vendorevents`
                        }}
                    />
                </div>
                <div>
                  {subTitleDisplay()}
                </div>
            </div>
            <div className={classes.DisplayPanel}>
                <EventDetails
                    event={eventDescription}
                    titleOmission={eventTitleOmission}
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
                    //changeCountry={changeCountryCode}
                    //changeStart={changeEventField}
                    //changeEnd={changeEventField}
                    //changeZone={changeTimeZone}
                />








                <br></br>
                <TicketCreation
                    tickets={ticketDetails}
                    radioChange={changeEventDescriptionRadio}
                    changeTicket={changeTicketDetail}// ??? Dupe
                    changeSettings={switchTicketSettings}
                    showModal={activateShowModal}
                    deactivateModal={deactivateShowModal}
                    delete={deleteTicket}
                    ticketChange={changeTicketDetail}// ??? Dupe
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


/*
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