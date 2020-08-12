import React, { useState } from "react";

import dateFnsFormat from 'date-fns/format';

import EventDetails from "./EventDetails";
import TicketCreation from "./TicketCreation";
import AdditionalSettings from "./AdditionalSettings";

import classes2 from "./EventCreation.module.css";
import classes from "./VendorDashboard.module.css";
import { Button, Popup } from "semantic-ui-react";

const CreateEvent = (props) => {
    const [eventTitleOmission, setEventTitleOmission] = useState(false);

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

    const changeEventDescriptionRadio = (event, value, name) => {
        let tempDescription = { ...eventDescription };
        tempDescription[name] = value.value;
        setEventDescription(tempDescription);
        console.log("Event Description: ", tempDescription);
    };

    const changeEventField = (value, field) => {
        let tempDescription = { ...eventDescription };
        tempDescription[field] = value;
        console.log("eventEndTime: ", value);
        setEventDescription(tempDescription);
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

    const changeEventCategory = (value) => {
        let tempDescription = { ...eventDescription };
        tempDescription.eventCategory = value;
        console.log("eventCategory: ", value);
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
                        // ***** NEED TO FIX
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
                        // ***** NEED TO FIX
                        //window.location.href = `/vendorevents`
                        }}
                    />
                </div>
            </div>
            <div className={classes.DisplayPanel}>
                <div className={classes2.CategoryTitle} style={{ width: "140px" }}>
                    Event Details
                </div>
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