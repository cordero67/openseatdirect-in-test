import React from "react";

import classes from "./Help.module.css";
import CreateEventVideo from "../../components/Videos/EventCreation";
import CreateEvent from "../../assets/CreateEvent/OSDCreateEvent.png";
import EventDetails1 from "../../assets/CreateEvent/OSDEventDetails1.png";
import EventDetails2 from "../../assets/CreateEvent/OSDEventDetails2.png";
import EventDetails3 from "../../assets/CreateEvent/OSDEventDetails3.png";
import TicketCreation from "../../assets/CreateEvent/OSDTicketCreation.png";
import AdditionalSettings from "../../assets/CreateEvent/OSDAdditionalSettings.png";
import GoLveNow from "../../assets/CreateEvent/OSDGoLiveNow.png";

const Privacy = () => {
  return (
    <div className={classes.MainContainer}>
      <div
        style={{
          paddingLeft: "50px",
          paddingTop: "10px",
          paddingBottom: "10px",
        }}
      >
        <button
          className={classes.ButtonGreen}
          onClick={() => {
            window.location.href = "/myaccount?view=create";
          }}
        >
          Create your Event
        </button>
      </div>
      <h1 style={{ weight: "600", fontSize: "34px", paddingTop: "10px" }}>
        Event Creation basics
      </h1>
      <div>
        <CreateEventVideo />
      </div>
      <div style={{ fontWeight: "600", paddingBottom: "10px" }}>
        Step-by-step instructions
      </div>

      <ol type="1">
        <li>
          <p>Log in to your Open Seat Direct account.</p>
        </li>
        <li>
          <p>
            Click on <span style={{ fontWeight: "600" }}>Create Event</span>,
            which will take you to the event creation screen.
          </p>
          <p>
            <img
              src={CreateEvent}
              alt="Ticket Type"
              style={{ width: "400px", height: "auto" }}
            ></img>
          </p>
        </li>
        <li>
          <p>
            Add <span style={{ fontWeight: "600" }}>Event Title</span> - a
            descriptive title for your Ticketed Event, ie "Holiday Networking
            Gathering 2021".
          </p>
        </li>
        <li>
          <p>
            Select an <span style={{ fontWeight: "600" }}>Event Type</span>
            <ul type="none" style={{ paddingLeft: "0px" }}>
              <li>
                - Live Event (for in-person or hybrid events - in-person and
                virtual)
              </li>
              <li> - Online Event (for virtual events, like Zoom calls)</li>
              <li>
                - To be announced (for events that you want to begin pre-selling
                tickets
              </li>
            </ul>
          </p>
        </li>
        <li>
          <p>
            Add <span style={{ fontWeight: "600" }}>Event Location</span>{" "}
            (Venue) information.
          </p>
        </li>
        <li>
          <p>
            Add <span style={{ fontWeight: "600" }}>Online Information</span>{" "}
            (such as an event landing page on your website, or if a virtual
            event you would add your link here).
          </p>
          <p>
            <img
              src={EventDetails1}
              alt="Ticket Type"
              style={{ width: "400px", height: "auto" }}
            ></img>
          </p>
        </li>
        <li>
          <p>
            Add <span style={{ fontWeight: "600" }}>Event Date and Time</span>.
          </p>
        </li>
        <li>
          <p>
            Add an <span style={{ fontWeight: "600" }}>Event image</span>.
          </p>
        </li>
        <li>
          <p>
            Add an <span style={{ fontWeight: "600" }}>Event Description</span>.
            Here is where you would use the text editor to add a longer-form
            description of the event.
          </p>
          <p>
            <img
              src={EventDetails2}
              alt="Ticket Type"
              style={{ width: "400px", height: "auto" }}
            ></img>
          </p>
        </li>
        <li>
          <p>
            Select an <span style={{ fontWeight: "600" }}>Event Category</span>.
          </p>
        </li>
        <li>
          <p>
            Add your <span style={{ fontWeight: "600" }}>Social Media</span>{" "}
            links, if applicable.
          </p>
          <p>
            <img
              src={EventDetails3}
              alt="Ticket Type"
              style={{ width: "400px", height: "auto" }}
            ></img>
          </p>
        </li>
        <li>
          <p>
            Create your custom{" "}
            <span style={{ fontWeight: "600" }}>Ticket Types</span>, for
            example, VIP, General Admission, etc.
            <ul type="none" style={{ paddingLeft: "0px" }}>
              <li>
                - Add quantity of that Ticket Type available, for example, 200
                General Admission tickets to sell.
              </li>
              <li>- Pro Plan Users only: add the Price of that Ticket Type</li>
              <li>
                - Click on{" "}
                <span style={{ fontWeight: "600" }}>
                  "Show Additional Features"
                </span>
              </li>
              <li>
                - Add a Ticket Description, for example, Ticket includes VIP
                access to the lounge and one drink ticket.
              </li>
              <li>
                - Add minimums and maximums per order, for example, a customer
                can not buy more than four tickets.
              </li>
              <li>
                - Pro Plan Users only: add Promotional Pricing offers such as{" "}
                <span style={{ fontWeight: "600" }}>"Promo Codes"</span> or{" "}
                <span style={{ fontWeight: "600" }}>
                  "Buy one, get one free"
                </span>{" "}
                offers.
              </li>
              <li>
                - Click on{" "}
                <span style={{ fontWeight: "600" }}>"Add A Ticket"</span> to add
                additional Ticket Types, and repeat the process.
              </li>
            </ul>
          </p>
          <p>
            <img
              src={TicketCreation}
              alt="Ticket Type"
              style={{ width: "400px", height: "auto" }}
            ></img>
          </p>
        </li>
        <li>
          <p>Select your refund policy.</p>
          <p>
            <img
              src={AdditionalSettings}
              alt="Ticket Type"
              style={{ width: "400px", height: "auto" }}
            ></img>
          </p>
        </li>
        <li>
          <p>
            On the top of your screen, select{" "}
            <span style={{ fontWeight: "600" }}>"Go Live Now"</span> to make
            your ticketed event live. You can also save it as a draft if you
            would like to finish later.
          </p>
          <p>
            <img
              src={GoLveNow}
              alt="Ticket Type"
              style={{ width: "400px", height: "auto" }}
            ></img>
          </p>
        </li>
      </ol>
      <p>
        <span style={{ fontWeight: "600" }}>Congratulations!</span> Your tickets
        are now created and you can start promoting and selling to your
        audience.
      </p>
      <div
        style={{
          paddingLeft: "50px",
          paddingTop: "10px",
          paddingBottom: "10px",
        }}
      >
        <button
          className={classes.ButtonGreen}
          onClick={() => {
            window.location.href = "/myaccount?view=create";
          }}
        >
          Create your Event
        </button>
      </div>
    </div>
  );
};

export default Privacy;
