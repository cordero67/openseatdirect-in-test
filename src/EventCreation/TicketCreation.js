//ENTIRE CODE HAS BEEN CHECKED VERSUS ORIGINAL
//EXCEPT FOR SMALL STYLING SECTION LABELED BELOW
//EXCEPT FOR <PriceSettings/> SECTION LABELED BELOW

import React, { Fragment } from "react";

import TicketModal from "./Modals/TicketModal";
import PriceSettings from "./PriceSettings";

import classes from "./EventCreation.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import {
  faTrashAlt,
  faGripVertical,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { Popup } from "semantic-ui-react";

const TicketCreation = (props) => {
  //console.log("Props: ", props);
  //console.log("Status: ", props.status);

  const ticketTypeDisplay = (index) => {
    //console.log("CURRENT STATUS = ", props.status);
    let display = (
      <Fragment>
        {props.tickets.map((item, index) => {
          // defines warnings for ticket name, quantity and price
          let nameRegex = /^[a-zA-Z0-9\-\s]+$/;
          let quantityRegex = /^(0|[1-9]|[1-9][0-9]+)$/;
          let priceRegex =
            /^(0|0\.|0\.[0-9]|0\.[0-9][0-9]|\.|\.[0-9]|\.[0-9][0-9]|[1-9][0-9]+|[1-9][0-9]+\.|[1-9][0-9]+\.[0-9]|[1-9][0-9]+\.[0-9][0-9]|[0-9]| [0-9]\.|[0-9]\.[0-9]|[0-9]\.[0-9][0-9]|)$/;

          // determines if a required field warning is required
          if (
            (item.ticketName === "" &&
              item.remainingQuantity === "" &&
              item.currentTicketPrice === "") ||
            (item.ticketName !== "" &&
              item.remainingQuantity !== "" &&
              item.currentTicketPrice !== "") ||
            (item.ticketName !== "" &&
              item.remainingQuantity !== "" &&
              props.status !== 8)
          ) {
            item.reqWarning = false;
            //console.log("No Req Warning necessary");
          } else {
            item.reqWarning = true;
            //console.log("No Req Warning IS Necessary");
          }

          // determines if a name, price or quantity field warning is required
          if (!item.ticketName) {
            item.nameWarning = false;
          } else {
            item.nameWarning = !nameRegex.test(item.ticketName);
          }

          if (!item.remainingQuantity) {
            item.quantityWarning = false;
          } else {
            item.quantityWarning = !quantityRegex.test(item.remainingQuantity);
          }
          //console.log("CURRENT STATUS = ", props.status);

          if (!item.currentTicketPrice || props.status !== 8) {
            //console.log("NO PRICE WARNING REQUIRED");
            item.priceWarning = false;
          } else {
            //console.log("PRICE WARNING IS REQUIRED");
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

          if (props.status !== 8) {
            tempPriceBox = classes.PriceBox;
            priceWarningText = "";
          } else if (item.priceWarning) {
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

          /*
    //XX START CODE REPLICATION REQUIRED
          // defines styling for the ticket name, quantity and price line
          let tempTicketStyling;
          if (dragging && dragItem.current === index) {
            tempTicketStyling = classes.DraggedTicketLine;
          } else {
            tempTicketStyling = classes.TicketLine;
          }       
    //XX END CODE REPLICATION REQUIRED
*/
          return (
            <Fragment key={index}>
              <div className={classes.TicketLine}>
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
                    onDragStart={(event) => {
                      props.handleDragStart(event, index);
                    }}
                    onDragEnter={
                      props.dragging
                        ? (event) => props.handleDragEnter(event, index)
                        : null
                    }
                    style={{
                      padding: "9px 0px 9px 3px",
                      boxSizing: "borderBox",
                    }}
                  >
                    <FontAwesomeIcon cursor="pointer" icon={faGripVertical} />
                  </div>

                  <input
                    className={tempNameBox}
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
                  <input
                    className={tempQuantityBox}
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
                  {props.status === 8 ? (
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
                  ) : (
                    <div
                      style={{
                        backgroundColor: "#E7E7E7",
                        padding: "9px 5px 9px 0px",
                        textAlign: "right",
                        borderStyle: "none",
                        outline: "none",
                        boxSizing: "borderBox",
                      }}
                    >
                      0.000
                    </div>
                  )}
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
                <Fragment>
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
                </Fragment>
              ) : null}

              {item.nameWarning ||
              item.priceWarning ||
              item.quantityWarning ||
              item.reqWarning ? (
                <div className={classes.TicketLineWarning}>
                  <div style={{ paddingLeft: "25px" }}> {nameWarningText}</div>
                  <div style={{ paddingLeft: "5px" }}>
                    {" "}
                    {quantityWarningText}
                  </div>
                  <div style={{ paddingRight: "5px", textAlign: "right" }}>
                    {" "}
                    {priceWarningText}
                  </div>
                </div>
              ) : null}

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
                    onClick={(event) => {
                      props.changeSettings(event, item.key);
                    }}
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
                    />{" "}
                    Show additional features
                  </button>
                ) : (
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
                    onClick={(event) => {
                      props.changeSettings(event, item.key);
                    }}
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
                      icon={faChevronUp}
                    />{" "}
                    Hide additional features
                  </button>
                )}
              </div>
              {item.settings ? (
                <PriceSettings
                  ticket={item}
                  changeTicket={props.changeTicket}
                  switchSettings={props.switchSettings}
                  changeFeature={props.changeFeature}
                  switchPriceFeature={props.switchPriceFeature}
                  addPromoCode={props.addPromoCode}
                  changeArgument={props.changeArgument}
                  changePromoCodesName={props.changePromoCodesName}
                  changePromoCodesAmount={props.changePromoCodesAmount}
                  changePromoCodesPercent={props.changePromoCodesPercent}
                  deletePromoCode={props.deletePromoCode}
                />
              ) : null}
            </Fragment>
          );
        })}
      </Fragment>
    );
    return display;
  };

  return (
    <Fragment>
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
            # Available<span style={{ color: "red" }}>*</span>{" "}
            <Popup
              position="right center"
              content="The total number of tickets available for sale"
              header="Total Ticket Quantity"
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
          <button
            className={classes.ButtonGreen}
            onClick={props.createNewTicketHandler}
          >
            ADD A TICKET
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default TicketCreation;
