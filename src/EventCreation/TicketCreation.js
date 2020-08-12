import React, { useState, useRef } from "react";

import TicketModal from "./Modals/TicketModal";
import PriceSettings from "./PriceSettings";

import classes from "./EventCreation.module.css";
import Aux from "../hoc/Auxiliary/Auxiliary";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faTrashAlt,
  faGripVertical,
  faCog
} from "@fortawesome/free-solid-svg-icons";

const TicketCreation = (props) => {

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


  const ticketTypeDisplay = (index) => {
    let display = (
      <Aux>
        {props.tickets.map((item, index) => {// defines warnings for ticket name, quantity and price
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
                      props.changeTicket(event, item.key);
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
                      props.changeTicket(event, item.key);
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
                      props.changeTicket(event, item.key);
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
                    onClick={(event) => props.changeSettings(event, item.key)}
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
                      props.showModal(item);
                      console.log("Ticket Detail: ", props.tickets);
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
                      props.deactivateModal(item);
                    }}
                    deleteTicket={() => {
                      console.log("Delete ticket", item.ticketName);
                      console.log("Ticket key", item.key);
                      props.delete(item.key);
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
              {item.settings ?
                <PriceSettings
                  ticket={item}
                  changeTicket={props.ticketChange}
                  switchSettings={props.switchSettings}
                  changeFeature={props.changeFeature}
                  switchPriceFeature={props.switchPriceFeature}
                  addPromoCode={props.addPromoCode}
                  changeArgument={props.changeArgument}
                /> :
              null}
              

            </Aux>
          )
        })}
      </Aux>
    );
    return display;
  };

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

    return (
        <Aux>
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
          </div>
        </Aux>
    )
};

export default TicketCreation;