//ENTIRE CODE HAS BEEN CHECKED VERSUS ORIGINAL
import React, { useEffect, useState, useRef, Fragment } from "react";

import ImgDropAndCrop from "../ImgDropAndCrop/ImgDropAndCrop";
import { Editor } from "@tinymce/tinymce-react";
import DateSelector from "../DateSelector";
import CountrySelector from "../Selectors/CountrySelector";
import TimeSelector from "../Selectors/TimeSelector";
import TimeZoneSelector from "../Selectors/TimeZoneSelector";
import CategorySelector from "../Selectors/CategorySelector";
import RadioForm from "../RadioForm";

import classes from "./Components.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

const EventDetails = (props) => {
  const [eventTitleWarning, setEventTitleWarning] = useState(false);
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
  const [shortDescriptionWarning, setShortDescriptionWarning] = useState(false);
  const [vanityWarning, setVanityWarning] = useState(false);

  const editorRef = useRef(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setDirty(false);
  }, []);

  const save = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      setDirty(false);
      editorRef.current.setDirty(false);
      props.changeLong(content);
      console.log(content);
    }
  };

  const eventTypeList = [
    { label: "Live Event", value: "live" },
    { label: "Online Event only", value: "online" },
    { label: "To be announced", value: "tba" },
  ];

  const displayMessage = (limit, variable) => {
    if (variable && variable.length >= limit) {
      return (
        <div
          className={classes.WarningText}
          style={{ color: "red", fontWeight: "700" }}
        >
          Maximum characters used
        </div>
      );
    } else if (variable && variable.length >= limit - 10) {
      return (
        <div className={classes.WarningText} style={{ color: "red" }}>
          Remaining {limit - variable.length}
        </div>
      );
    } else if (variable) {
      return (
        <div className={classes.WarningText} style={{ color: "black" }}>
          Remaining {limit - variable.length}
        </div>
      );
    } else {
      return (
        <div className={classes.WarningText} style={{ color: "black" }}>
          Remaining {limit}
        </div>
      );
    }
  };

  const imageCanvas = () => {
    if (props.eventImage === "existing" && !props.photoData.isLoaded) {
      console.log("inside imageCanvas first if");
      return <p>Loading ....</p>;
    } else if (props.eventImage === "existing") {
      console.log("inside imageCanvas second if");
      return (
        <ImgDropAndCrop
          imagein={props.photoData}
          change={(image) => {
            props.changeImage(image);
          }}
        />
      );
    } else {
      console.log("inside imageCanvas else");
      return (
        <ImgDropAndCrop
          imagein={{ isLoaded: true }}
          change={(image) => {
            props.changeImage(image);
          }}
        />
      );
    }
  };

  return (
    <Fragment>
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
              props.titleOmission
                ? classes.InputBoxContentError
                : classes.InputBoxContent
            }
            style={{ width: "600px" }}
            onFocus={() => {
              setEventTitleWarning(true);
              props.changeOmission(false);
            }}
            onBlur={() => {
              setEventTitleWarning(false);
              props.changeOmission(false);
            }}
            type="text"
            id="eventTitle"
            maxLength="64"
            placeholder="Short title of event: limit 64 characters"
            name="eventTitle"
            value={props.event.eventTitle}
            onChange={(event) => {
              props.change(event);
            }}
          />
          {eventTitleWarning
            ? displayMessage(64, props.event.eventTitle)
            : null}
          {props.titleOmission ? (
            <div
              className={classes.WarningText}
              style={{ color: "red", fontWeight: "700" }}
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
          current={props.event.eventType}
          change={(event, value) =>
            props.radioChange(event, value, "eventType")
          }
        />
        {props.event.eventType === "live" ? (
          <Fragment>
            <div className={classes.SectionTitleTight}>Event Location</div>
            <div className={classes.InputBoxTight}>
              <input
                className={
                  props.venueOmission
                    ? classes.InputBoxContentError
                    : classes.InputBoxContent
                }
                style={{ width: "600px" }}
                onFocus={() => setEventLocationWarning(true)}
                onBlur={() => setEventLocationWarning(false)}
                type="text"
                id="locationVenueName"
                maxLength="140"
                name="locationVenueName"
                placeholder="Venue Name: limit 140 characters"
                value={props.event.locationVenueName}
                onChange={(event) => {
                  props.change(event);
                }}
              />
              <span style={{ color: "red" }}> *</span>

              {eventLocationWarning
                ? displayMessage(140, props.event.locationVenueName)
                : null}
              {props.venueOmission ? (
                <div
                  className={classes.WarningText}
                  style={{ color: "red", fontWeight: "700" }}
                >
                  This is a required field
                </div>
              ) : null}
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
                value={props.event.locationAddress1}
                onChange={(event) => {
                  props.change(event);
                }}
              />
              {eventAddress1Warning
                ? displayMessage(64, props.event.locationAddress1)
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
                value={props.event.locationAddress2}
                onChange={(event) => {
                  props.change(event);
                }}
              />
              {eventAddress2Warning
                ? displayMessage(64, props.event.locationAddress2)
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
                value={props.event.locationCity}
                onChange={(event) => {
                  props.change(event);
                }}
              />
              {eventCityWarning
                ? displayMessage(64, props.event.locationCity)
                : null}
            </div>

            <div
              className={classes.InputBoxTight}
              style={{ display: "grid", gridTemplateColumns: "300px 300px" }}
            >
              <input
                className={classes.InputBoxContent}
                style={{ width: "295px" }}
                onFocus={() => setEventStateWarning(true)}
                onBlur={() => setEventStateWarning(false)}
                type="text"
                id="locationState"
                name="locationState"
                maxLength="2"
                placeholder="State: 2 letter code"
                value={props.event.locationState}
                onChange={(event) => {
                  props.change(event);
                }}
              />

              <input
                className={classes.InputBoxContent}
                style={{ width: "300px" }}
                onFocus={() => setEventZipPostalWarning(true)}
                onBlur={() => setEventZipPostalWarning(false)}
                type="text"
                id="locationPostalCode"
                name="locationPostalCode"
                maxLength="5"
                placeholder="Zip/Postal"
                value={props.event.locationPostalCode}
                onChange={(event) => {
                  props.change(event);
                }}
              />

              {eventStateWarning ? (
                <div>{displayMessage(2, props.event.locationState)}</div>
              ) : null}

              {eventZipPostalWarning ? <div> </div> : null}

              {eventZipPostalWarning ? (
                <div>{displayMessage(5, props.event.locationPostalCode)}</div>
              ) : null}
            </div>

            <div className={classes.InputBoxTight}>
              <CountrySelector
                className={classes.InputBoxContent}
                style={{ width: "600px" }}
                current={props.event.locationCountryCode}
                //defaultValue="United States of America"
                getCountry={(value) =>
                  props.changeEventField(value, "locationCountryCode")
                }
              />
            </div>

            <div className={classes.InputBox}>
              <input
                className={classes.InputBoxContent}
                style={{ width: "600px" }}
                onFocus={() => setEventAdditionalWarning(true)}
                onBlur={() => setEventAdditionalWarning(false)}
                type="text"
                id="locationNote"
                name="locationNote"
                maxLength="256"
                placeholder="Notes: 'e.g. Enter through backdoor' limit 256 characters"
                value={props.event.locationNote}
                onChange={(event) => {
                  props.change(event);
                }}
              />
              {eventAdditionalWarning
                ? displayMessage(256, props.event.locationNote)
                : null}
            </div>
          </Fragment>
        ) : null}
        {props.event.eventType === "online" ||
        props.event.eventType === "live" ? (
          <Fragment>
            <div className={classes.SectionTitleTight}>Online Information</div>
            <div className={classes.InputBoxTight}>
              <input
                className={
                  props.webinarOmission && props.event.eventType === "online"
                    ? classes.InputBoxContentError
                    : classes.InputBoxContent
                }
                style={{ width: "600px" }}
                onFocus={() => setWebinarLinkWarning(true)}
                onBlur={() => setWebinarLinkWarning(false)}
                type="text"
                id="webinarLink"
                name="webinarLink"
                maxLength="254"
                placeholder="Webinar Link: limit 256 characters"
                value={props.event.webinarLink}
                onChange={(event) => {
                  props.change(event);
                }}
              />
              {props.event.eventType === "online" ? (
                <span style={{ color: "red" }}> *</span>
              ) : null}
              {webinarLinkWarning
                ? displayMessage(256, props.event.webinarLink)
                : null}
              {props.webinarOmission && props.event.eventType === "online" ? (
                <div
                  className={classes.WarningText}
                  style={{ color: "red", fontWeight: "700" }}
                >
                  This is a required field
                </div>
              ) : null}
            </div>
            <div className={classes.InputBox}>
              <input
                className={classes.InputBoxContent}
                style={{ width: "600px" }}
                onFocus={() => setWebinarInfoWarning(true)}
                onBlur={() => setWebinarInfoWarning(false)}
                type="text"
                id="onlineInformation"
                name="onlineInformation"
                maxLength="1000"
                placeholder="Additional Instructions: limit 1000 characters"
                value={props.event.onlineInformation}
                onChange={(event) => {
                  props.change(event);
                }}
              />
              {webinarInfoWarning
                ? displayMessage(1000, props.event.onlineInformation)
                : null}
            </div>
          </Fragment>
        ) : null}
        {props.event.eventType === "tba" ? (
          <Fragment>
            <div className={classes.SectionTitleTight}>
              To be announced information<span style={{ color: "red" }}>*</span>
            </div>
            <div className={classes.InputBox}>
              <input
                className={
                  props.tbaOmission
                    ? classes.InputBoxContentError
                    : classes.InputBoxContent
                }
                style={{ width: "600px" }}
                onFocus={() => setTbaInfoWarning(true)}
                onBlur={() => setTbaInfoWarning(false)}
                type="text"
                id="tbaInformation"
                name="tbaInformation"
                maxLength="1000"
                placeholder="Additional Instructions: limit 1000 characters"
                value={props.event.tbaInformation}
                onChange={(event) => {
                  props.change(event);
                }}
              />
              {tbaInfoWarning
                ? displayMessage(1000, props.event.tbaInformation)
                : null}
              {props.tbaOmission ? (
                <div
                  className={classes.WarningText}
                  style={{ color: "red", fontWeight: "700" }}
                >
                  This is a required field
                </div>
              ) : null}
            </div>
          </Fragment>
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
            startDate={props.event.startDate}
            current={props.event.startDate}
            change={(date) => props.changeDate(date, "start")}
            beforeDate={new Date()}
          />
          <TimeSelector
            current={props.event.startTime}
            getTime={(value) => props.changeEventField(value, "startTime")}
          />
          <DateSelector
            type={"endDate"}
            startDate={props.event.startDate}
            current={props.event.endDate}
            change={(date) => props.changeDate(date, "end")}
            beforeDate={props.event.startDate}
          />
          <TimeSelector
            current={props.event.endTime}
            getTime={(value) => props.changeEventField(value, "endTime")}
          />
          <TimeZoneSelector
            current={props.event.timeZone}
            getTimeZone={(value) => props.changeEventField(value, "timeZone")}
          />
        </div>
        <div className={classes.SectionTitleTight}>Event Image</div>
        <div className={classes.ImageBox}>{imageCanvas()}</div>
        <div className={classes.SectionTitleTall}>
          Detailed Event Description{" "}
        </div>
        <div className={classes.TinyMice}>
          <Editor
            apiKey="ttpinnmm4af9xd288fuugwgjzwm9obqnitncxdeutyvvqhba"
            onEditorChange={props.changeLong}
            initialValue={props.longDescription}
            plugins="wordcount autoresize"
            onInit={(evt, editor) => (editorRef.current = editor)}
            onDirty={() => setDirty(true)}
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
            current={props.event.eventCategory}
            getCategory={props.changeCategory}
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
            name="facebookLink"
            maxLength="64"
            placeholder="your facebook address: limit 64 characters"
            value={props.event.facebookLink}
            onChange={(event) => {
              props.change(event);
            }}
          />
        </div>
        {facebookWarning ? (
          <div className={classes.SocialMediaLink} style={{ height: "20px" }}>
            <div> </div>
            <div> </div>
            {displayMessage(64, props.event.facebookLink)}
          </div>
        ) : null}
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
            name="twitterLink"
            placeholder="your twitter address: limit 64 characters"
            value={props.event.twitterLink}
            onChange={(event) => {
              props.change(event);
            }}
          />
        </div>
        {twitterWarning ? (
          <div className={classes.SocialMediaLink} style={{ height: "20px" }}>
            <div> </div>
            <div> </div>
            {displayMessage(64, props.event.twitterLink)}
          </div>
        ) : null}
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
            name="linkedinLink"
            placeholder="your linkedin address: limit 64 characters"
            value={props.event.linkedinLink}
            onChange={(event) => {
              props.change(event);
            }}
          />
        </div>
        {linkedinWarning ? (
          <div className={classes.SocialMediaLink} style={{ height: "20px" }}>
            <div> </div>
            <div> </div>
            {displayMessage(64, props.event.linkedinLink)}
          </div>
        ) : null}
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
            name="instagramLink"
            placeholder="your instagram address: limit 64 characters"
            value={props.event.instagramLink}
            onChange={(event) => {
              props.change(event);
            }}
          />
        </div>
        {instagramWarning ? (
          <div className={classes.SocialMediaLink} style={{ height: "20px" }}>
            <div> </div>
            <div> </div>
            {displayMessage(64, props.event.instagramLink)}
          </div>
        ) : null}
        <div className={classes.SectionTitleTight}>
          Social Media Event Description
        </div>
        <div className={classes.TextBox}>
          <textarea
            className={classes.SocialMediaDescription}
            onFocus={() => setShortDescriptionWarning(true)}
            onBlur={() => setShortDescriptionWarning(false)}
            type="text"
            id="shortDescription"
            name="shortDescription"
            maxLength="140"
            placeholder="Short description of event for social media posts: limit 140 characters"
            value={props.event.shortDescription}
            onChange={(event) => {
              props.change(event);
            }}
          ></textarea>
          {shortDescriptionWarning
            ? displayMessage(140, props.event.shortDescription)
            : null}
        </div>
      </div>
    </Fragment>
  );
};

export default EventDetails; /*



          <TinyMCE
            apiKey="ttpinnmm4af9xd288fuugwgjzwm9obqnitncxdeutyvvqhba"
            onEditorChange={props.changeLong}
            initialValue={props.event.longDescription}
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


        <div className={classes.SectionTitleTight}>
          Customize OpenSeatDirect Vanity URL
        </div>
        <div className={classes.VanityGrid}>
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
            value={props.event.vanityLink}
            onChange={(event) => {
              props.change(event);
            }}
          />
        </div>
        <div className={classes.VanityGridBoxGrid}>
          <div> </div>
          {vanityWarning ? displayMessage(75, props.event.vanityLink) : null}
        </div>
        */
