import React, { useState } from "react";

import dateFnsFormat from 'date-fns/format';

import EventDetails from "./EventDetails";

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

    const changeEventCategory = (value) => {
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
      console.log("Event Description: ", tempDescription);
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
        console.log("Event Description: ", tempDescription);
    };

    const changeLongDescription = (editorContent) => {
      let tempDescription = { ...eventDescription };
      tempDescription.longDescription = editorContent;
      setEventDescription(tempDescription);
    };

    const changeEventImage = (image) => {
        let tempDescription = { ...eventDescription };
        tempDescription.photo = image;
        setEventDescription(tempDescription);
    }

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
                    changeCountry={changeCountryCode}
                    changeDate={changeEventDate}
                    changeStart={changeStartTime}
                    changeEnd={changeEndTime}
                    changeZone={changeTimeZone}
                    changeCategory={changeEventCategory}
                    changeLong={changeLongDescription}
                    changeImage={changeEventImage}
                    changeOmission={() => {
                        setEventTitleOmission(false);
                    }}
                />
            </div>
        </div>
    )
}

export default CreateEvent;