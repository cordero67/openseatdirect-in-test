import React, { useState, useEffect, Fragment } from "react";

import classes from "./Help.module.css";
import EventTitle from "../../assets/CreateEvent/OSDEventTitle.png";
import EventType from "../../assets/CreateEvent/OSDEventType.png";
import EventLocation from "../../assets/CreateEvent/OSDEventLocation.png";
import OnlineInformation from "../../assets/CreateEvent/OSDOnlineInformation.png";
import TBAInformation from "../../assets/CreateEvent/OSDTBAInformation.png";
import EventDateTime from "../../assets/CreateEvent/OSDEventDateTime.png";
import EventImage from "../../assets/CreateEvent/OSDEventImage.png";
import EventDescription from "../../assets/CreateEvent/OSDEventDescription.png";
import EventCategory from "../../assets/CreateEvent/OSDEventCategory.png";
import SocialMediaLinks from "../../assets/CreateEvent/OSDSocailMediaLinks.png";
import SocialMediaDescription from "../../assets/CreateEvent/OSDSocialMediaDescription.png";
import TicketType from "../../assets/CreateEvent/OSDTicketType.png";
import TicketDescription from "../../assets/CreateEvent/OSDTicketDescription.png";
import TicketsAllowed from "../../assets/CreateEvent/OSDTicketsAllowed.png";
import PromotionalPricing from "../../assets/CreateEvent/OSDPromotionalPricing.png";
import PromoCodes from "../../assets/CreateEvent/OSDPromoCodes.png";
import BuyOneGetOne from "../../assets/CreateEvent/OSDBuyOneGetOne.png";
import BuyOneGetOneDiscount from "../../assets/CreateEvent/OSDBuyOneGetOneDiscount.png";
import TwoForOne from "../../assets/CreateEvent/OSDTwoForOne.png";
import RefundPolicy from "../../assets/CreateEvent/OSDRefundPolicy.png";
import RecordChanges from "../../assets/CreateEvent/OSDRecordChanges.png";

const Privacy = () => {
  const [isResizing, setIsResizing] = useState(false);
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const stylingUpdate = (inWidth) => {
    console.log("stylingUpdate");
    setIsResizing(true);
    setScreenSize(inWidth);
    setScreenWidth(inWidth);
    setIsResizing(false);
    console.log("screenSize: ", screenSize);
  };

  const [display, setDisplay] = useState({
    eventDetails: true,
    ticketCreation: true,
    additionalInformation: true,
    recordChanges: true,
  });

  useEffect(() => {
    console.log("screen width: ", window.innerWidth);
    stylingUpdate(window.innerWidth);
  }, []);

  const switchDisplay = (name, value) => {
    let tempDisplay = { ...display };
    tempDisplay[name] = value;
    setDisplay(tempDisplay);
  };

  return (
    <div className={classes.MainContainer}>
      <h1 style={{ weight: "600", fontSize: "34px" }}>
        How to Create an Event
      </h1>
      <p>
        Step-by-step instructions on how to create an event with custom tickets.
      </p>
      <div
        style={{
          paddingLeft: "20px",
          paddingBottom: "20px",
          paddingTop: "5px",
        }}
      >
        <button
          className={classes.ButtonGreen}
          onClick={() => {
            window.location.href = "/myaccount?view=create";
          }}
        >
          I'm ready to create my event
        </button>
      </div>
      <h2>
        Navigate to Create Event tab{" "}
        <span>
          <ion-icon name="chevron-up-outline"></ion-icon>
        </span>
      </h2>
      <h2>
        Create Event Step 1: Event Details{" "}
        <span>
          {display.eventDetails ? (
            <ion-icon
              style={{ fontSize: "28px", color: "blue" }}
              name="chevron-up-outline"
              onClick={() => {
                console.log("clicked up");
                switchDisplay("eventDetails", false);
              }}
            />
          ) : (
            <ion-icon
              style={{ fontSize: "28px", color: "blue" }}
              name="chevron-down-outline"
              onClick={() => {
                console.log("clicked down");
                switchDisplay("eventDetails", true);
              }}
            />
          )}
        </span>
      </h2>
      {display.eventDetails ? (
        <ol type="1">
          <li>
            <p>
              <strong>Add Event Title </strong> -{" "}
              <span style={{ color: "red" }}>required field</span>,{" "}
              <span style={{ color: "red" }}>64 character limit</span>. A
              descriptive title for your Ticketed Event, i.e. "Holiday
              Networking Gathering 2021".
            </p>
            <p>
              <img
                src={EventTitle}
                alt="Event Title"
                width="600px"
                height="auto"
              ></img>
            </p>
          </li>

          <li>
            <p>
              <strong>Select an Event Type</strong> - select one of three
              options:
            </p>
            <p>
              <img
                src={EventType}
                alt="Event Type"
                width="200px"
                height="auto"
              ></img>
            </p>
            <ol type="i">
              <li>
                <p>
                  <strong>Live Event</strong> - for traditional in-person, or
                  hybrid in-person and virtual events
                </p>
              </li>
              <li>
                <p>
                  <strong>Online Event</strong> - for virtual events, like Zoom
                  calls
                </p>
              </li>
              <li>
                <p>
                  <strong>To be announced</strong> - for events that you want to
                  begin pre-selling tickets
                </p>
              </li>
            </ol>
          </li>

          <li>
            <p>
              <strong>Add Event Location </strong> - applies only to Live event
              types.
            </p>
            <p>
              <img
                src={EventLocation}
                alt="Event Location"
                width="600px"
                height="auto"
              ></img>
            </p>
            <ol type="i">
              <li>
                <p>
                  <strong>Venue Name</strong> -{" "}
                  <span style={{ color: "red" }}>required field</span>,{" "}
                  <span style={{ color: "red" }}>140 character limit</span>.
                </p>
              </li>
              <li>
                <p>
                  <strong>all other fields</strong> - optional.
                </p>
              </li>
            </ol>
          </li>
          <li>
            <p>
              <strong>Add Online Information </strong> - applies to both Live
              and Online event types.
            </p>
            <p>
              <img
                src={OnlineInformation}
                alt="Online Information"
                width="600px"
                height="auto"
              ></img>
            </p>
            <ol type="i">
              <li>
                <p>
                  <strong>Website Link</strong> -{" "}
                  <span style={{ color: "red" }}>
                    required field (Online events only)
                  </span>
                  , <span style={{ color: "red" }}>256 character limit</span>.
                  Add virtual event url link.
                </p>
              </li>
              <li>
                <p>
                  <strong>Additional Instructions</strong> - optional. Any
                  additional information such as an event landing page on your
                  website.
                </p>
              </li>
            </ol>
          </li>
          <li>
            <p>
              <strong>Add To be Announced Information </strong> - applies only
              to To be Announced event types.
            </p>
            <p>
              <img
                src={TBAInformation}
                alt="TBA Information"
                width="600px"
                height="auto"
              ></img>
            </p>
            <ol type="i">
              <li>
                <p>
                  <strong>Additional Instructions </strong> -{" "}
                  <span style={{ color: "red" }}>
                    required field (To be announced events only)
                  </span>
                  ,<span style={{ color: "red" }}>1000 character limit</span>.
                </p>
              </li>
            </ol>
          </li>
          <li>
            <p>
              <strong>Add Event Date and Time.</strong>
            </p>
            <p>
              <img
                src={EventDateTime}
                alt="Event Date and Time"
                width="600px"
                height="auto"
              ></img>
            </p>
            <ol type="i">
              <li>
                <p>
                  <strong>Start Date</strong> -{" "}
                  <span style={{ color: "red" }}>required field</span>. Defaults
                  to the day the event was created.
                </p>
              </li>
              <li>
                <p>
                  <strong>Start Time</strong> -{" "}
                  <span style={{ color: "red" }}>required field</span>. Defaults
                  to 7:00 PM.
                </p>
              </li>
              <li>
                <p>
                  <strong>End Date</strong> - optional. Defaults to the day the
                  event was created.
                </p>
              </li>
              <li>
                <p>
                  <strong>End Time</strong> - optional. Defaults to 8:00 PM.
                </p>
              </li>
              <li>
                <p>
                  <strong>Time Zone</strong> - optional. Defaults to Eastern
                  Time - New York.
                </p>
              </li>
            </ol>
          </li>
          <li>
            <p>
              <strong>Add an Event Image</strong> -{" "}
              <span style={{ color: "red" }}>maximum 3 megabyte in size</span>.
              A publically visible image with no copyright restrictions.
            </p>
            <p>
              <img
                src={EventImage}
                alt="Event Img"
                width="400px"
                height="auto"
              ></img>
            </p>
          </li>
          <li>
            <p>
              <strong>Detailed Event Description</strong> - use the text editor
              to add a long-form description of the event.
            </p>
            <p>
              <img
                src={EventDescription}
                alt="Event Description"
                width="600px"
                height="auto"
              ></img>
            </p>
          </li>
          <li>
            <p>
              <strong>Select an Event Category</strong> - select an Event
              Category.
            </p>
            <p>
              <img
                src={EventCategory}
                alt="Event Category"
                width="600px"
                height="auto"
              ></img>
            </p>
          </li>
          <li>
            <p>
              <strong>Add Event Specific Social Media Links</strong> - add your
              Social Media links to your specific event, if applicable.
            </p>
            <p>
              <img
                src={SocialMediaLinks}
                alt="Social Media Links"
                width="600px"
                height="auto"
              ></img>
            </p>
          </li>
          <li>
            <p>
              <strong>Add Social Media Event Description</strong> - add a
              short-form description of the event to be included in social media
              posts of your event.
            </p>
            <p>
              <img
                src={SocialMediaDescription}
                alt="Social Media Description"
                width="600px"
                height="auto"
              ></img>
            </p>
          </li>
        </ol>
      ) : null}
      <h2>
        Create Event Step 2: Ticket Creation
        <span>
          {display.ticketCreation ? (
            <ion-icon
              style={{ fontSize: "28px", color: "blue" }}
              name="chevron-up-outline"
              onClick={() => {
                console.log("clicked up");
                switchDisplay("ticketCreation", false);
              }}
            />
          ) : (
            <ion-icon
              style={{ fontSize: "28px", color: "blue" }}
              name="chevron-down-outline"
              onClick={() => {
                console.log("clicked down");
                switchDisplay("ticketCreation", true);
              }}
            />
          )}
        </span>
      </h2>
      {display.ticketCreation ? (
        <Fragment>
          <ol type="1">
            <li>
              <p>
                <strong>Create Ticket Type</strong>
              </p>
              <p>
                <img
                  src={TicketType}
                  alt="Ticket Type"
                  style={{ width: "600px", height: "auto" }}
                ></img>
              </p>
              <ol type="i">
                <li>
                  <p>
                    <strong>Ticket Name</strong> -{" "}
                    <span style={{ color: "red" }}>
                      required field, 64 character limit
                    </span>
                    . A descriptive title for your ticket, i.e. "General
                    Admission".
                  </p>
                </li>
                <li>
                  <p>
                    <strong># Available</strong> -{" "}
                    <span style={{ color: "red" }}>required field</span>. Must
                    be a whole number, e.g. 54 not 54.5.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Price</strong> -{" "}
                    <span style={{ color: "red" }}>required field</span>. Must
                    be a two decimal number, e.g. 25.00 not 25.257.
                  </p>
                </li>
              </ol>
            </li>
            <li>
              <p>
                <strong>Access Additional Ticket Features</strong> - select the{" "}
                <span style={{ color: "blue" }}>
                  "Show additional features"
                </span>{" "}
                hyperlink to display addtional features.
              </p>
            </li>
            <li>
              <p>
                <strong>Add Ticket Description</strong> - a descriptive of
                additional ticket features, i.e. "includes one free drink".
              </p>
              <p>
                <img
                  src={TicketDescription}
                  alt="Ticket Type"
                  width="600px"
                  height="auto"
                ></img>
              </p>
            </li>
            <li>
              <p>
                <strong>Add Ticket Order Limits</strong> - indicate both the
                minimum and maximum number of tickets that can be purchased, if
                applicable.
              </p>
              <p>
                <img
                  src={TicketsAllowed}
                  alt="Ticket Type"
                  width="550px"
                  height="auto"
                ></img>
              </p>
              <ol type="i">
                <li>
                  <p>
                    <strong>Minimum</strong> - must be a whole number, e.g. 54
                    not 54.5.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Maximum</strong> - must be a whole number, e.g. 54
                    not 54.5.
                  </p>
                </li>
              </ol>
            </li>
            <li>
              <p>
                <strong>Add Ticket Promotional Pricing Features</strong> -
                optional feature. Choose between four different promotional
                pricing features. Only one promotional pricing feature can be
                implemented at a time per ticket type.
              </p>
              <p>
                <img
                  src={PromotionalPricing}
                  alt="Ticket Type"
                  width="320px"
                  height="auto"
                ></img>
              </p>
            </li>
            <li>
              <p>
                <strong>Add Promotional Code(s)</strong> - optional section. Add
                promo code(s) that provides either a percentage or dollar
                discount to a full priced ticket.
              </p>
              <p>
                <img
                  src={PromoCodes}
                  alt="Promo Codes"
                  width="600px"
                  height="auto"
                ></img>
              </p>
              <ol type="i">
                <li>
                  <p>
                    <strong>Promo Code</strong> -{" "}
                    <span style={{ color: "red" }}>required field</span>.
                    Aphanumeric sequence of characters. Must be unique to other
                    promo codes created for this same event.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Discount Amount</strong> -{" "}
                    <span style={{ color: "red" }}>required section</span>.
                    Indicates the amount that will be discounted from a full
                    priced ticket.
                  </p>
                  <ol type="a">
                    <li>
                      <p>
                        <strong>USD $</strong> (left hand box) - must be a two
                        decimal number, e.g. 25.00 not 25.257.
                      </p>
                    </li>
                    <li>
                      <p>
                        <strong>%</strong> (right hand box) - must be a whole
                        number no greater than 100, e.g. 54 not 54.5.
                      </p>
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
            <li>
              <p>
                <strong>Add Buy-One-Get-One-Free Price Feature</strong> -
                optional section.
              </p>
              <p>
                <img
                  src={BuyOneGetOne}
                  alt="Buy One Get One"
                  width="430px"
                  height="auto"
                ></img>
              </p>
              <ol type="i">
                <li>
                  <p>
                    <strong># of tickets</strong> (left hand box) -{" "}
                    <span style={{ color: "red" }}>required field</span>. Number
                    of full priced tickets that must be purchased to activate
                    this price feature. Must be a whole number, e.g. 54 not
                    54.5.
                  </p>
                </li>
                <li>
                  <p>
                    <strong># of tickets</strong> (right hand box) -{" "}
                    <span style={{ color: "red" }}>required field</span>. Number
                    of tickets received for free if the necessary number of full
                    priced tickets identified in the left hand box are
                    purchased. Must be a whole number, e.g. 54 not 54.5.
                  </p>
                </li>
              </ol>
            </li>
            <li>
              <p>
                <strong>Add Buy-One-Get-One-for-Discount Price Feature</strong>{" "}
                - optional section.
              </p>
              <p>
                <img
                  src={BuyOneGetOneDiscount}
                  alt="Buy One Get One Discount"
                  width="600px"
                  height="auto"
                ></img>
              </p>
              <ol type="i">
                <li>
                  <p>
                    <strong># of tickets</strong> (left hand box) -{" "}
                    <span style={{ color: "red" }}>required field</span>. Number
                    of full priced tickets that must be purchased to activate
                    this price feature. Must be a whole number, e.g. 54 not
                    54.5.
                  </p>
                </li>
                <li>
                  <p>
                    <strong># of tickets</strong> (center box) -{" "}
                    <span style={{ color: "red" }}>required field</span>. Number
                    of tickets to receive a discount if the necessary number of
                    full priced tickets identified in the left hand box are
                    purchased. Must be a whole number, e.g. 54 not 54.5.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Percent</strong> (right hand box) -{" "}
                    <span style={{ color: "red" }}>required field</span>.
                    Percent discount applied to the eligible number of tickets
                    identified in the center box. Must be a whole number no
                    greater than 100, e.g. 54 not 54.5.
                  </p>
                </li>
              </ol>
            </li>
            <li>
              <p>
                <strong>Add Two-for-One Price Feature</strong> - optional
                section.
              </p>
              <p>
                <img
                  src={TwoForOne}
                  alt="Two For One"
                  width="350px"
                  height="auto"
                ></img>
              </p>
              <ol type="i">
                <li>
                  <p>
                    <strong># of tickets</strong> (left hand box) -{" "}
                    <span style={{ color: "red" }}>required field</span>. Number
                    of tickets that must be purchased to activate this price
                    feature. Must be a whole number, e.g. 54 not 54.5.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>USD $</strong> (right hand box) -{" "}
                    <span style={{ color: "red" }}>required field</span>. Total
                    priced to be paid if the necessary number of tickets
                    identified in the left hand box are purchased. Must be a two
                    decimal number, e.g. 25.00 not 25.257.
                  </p>
                </li>
              </ol>
            </li>
          </ol>
        </Fragment>
      ) : null}

      <h2>
        Create Event Step 3: Additional Information{" "}
        <span>
          {display.additionalInformation ? (
            <ion-icon
              style={{ fontSize: "28px", color: "blue" }}
              name="chevron-up-outline"
              onClick={() => {
                console.log("clicked up");
                switchDisplay("additionalInformation", false);
              }}
            />
          ) : (
            <ion-icon
              style={{ fontSize: "28px", color: "blue" }}
              name="chevron-down-outline"
              onClick={() => {
                console.log("clicked down");
                switchDisplay("additionalInformation", true);
              }}
            />
          )}
        </span>
      </h2>

      {display.additionalInformation ? (
        <Fragment>
          {" "}
          <ol type="1">
            <li>
              <p>
                <strong>Select Refund Policy</strong> - select one of five
                options:
              </p>
              <p>
                <img
                  src={RefundPolicy}
                  alt="Refund Policy"
                  style={{ width: "600px", height: "auto" }}
                ></img>
              </p>
            </li>
          </ol>
        </Fragment>
      ) : null}

      <h2>
        Create Event Step 4: Record Changes{" "}
        <span>
          {display.recordChanges ? (
            <ion-icon
              style={{ fontSize: "28px", color: "blue" }}
              name="chevron-up-outline"
              onClick={() => {
                console.log("clicked up");
                switchDisplay("recordChanges", false);
              }}
            />
          ) : (
            <ion-icon
              style={{ fontSize: "28px", color: "blue" }}
              name="chevron-down-outline"
              onClick={() => {
                console.log("clicked down");
                switchDisplay("recordChanges", true);
              }}
            />
          )}
        </span>
      </h2>

      {display.recordChanges ? (
        <Fragment>
          {" "}
          <ol type="1">
            <li>
              <p>
                <strong>Select How Event Will Be Saved</strong> - located at the
                top right hand side of the screen.
              </p>
              <p>
                <img
                  src={RecordChanges}
                  alt="Record Changes"
                  style={{ width: "450px", height: "auto" }}
                ></img>
              </p>
              <ol type="a">
                <li>
                  <p>
                    <strong>Save as Draft</strong> - records all changes but
                    saves event in draft mode and not publically visible.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Go Live Now</strong> - records all changes and makes
                    event publically visible.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Cancel Create</strong> - does not record any
                    changes. Any information inputted will be lost.
                  </p>
                </li>
              </ol>
            </li>
          </ol>
        </Fragment>
      ) : null}
    </div>
  );
};

export default Privacy;
