//ENTIRE CODE HAS BEEN CHECKED VERSUS ORIGINAL
//EXCEPT FOR <PriceFeatureSettings/> SECTION LABELED BELOW

import React, { useState, useRef } from "react";

import PriceFeatureSettings from "./PriceFeatureSettings";

import classes from "./EventCreation.module.css";

const PriceSettings = (props) => {
    // defines warnings for order min and max
    let orderRegex = /^(0|[1-9]|[1-9][0-9]+)$/;

    // determines if a min or max field warning is required
    if(!props.ticket.minTicketsAllowedPerOrder) {
        props.ticket.minWarning = false;
    } else {
        props.ticket.minWarning = !orderRegex.test(props.ticket.minTicketsAllowedPerOrder);
      console.log("ticket.minWarning: ",props.ticket.minWarning)
    }

    if(!props.ticket.maxTicketsAllowedPerOrder) {
        props.ticket.maxWarning = false;
    } else {
        props.ticket.maxWarning = !orderRegex.test(props.ticket.maxTicketsAllowedPerOrder);
      console.log("ticket.maxWarning: ",props.ticket.maxWarning)
    }

    // defines styling for the order min and max boxes
    let tempMinWarning;
    let tempMaxWarning;
    
    if (props.ticket.minWarning) {
      tempMinWarning = classes.OrderBoxWarning;
    } else {
      tempMinWarning = classes.OrderBox;
    }
    
    if (props.ticket.maxWarning) {
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
                    value={props.ticket.ticketDescription}
                    onChange={(event) => {
                        props.changeTicket(event, props.ticket.key);
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
                    value={props.ticket.minTicketsAllowedPerOrder}
                    onChange={(event) => {
                        console.log("ticket: ", props.ticket)
                        props.changeTicket(event, props.ticket.key);
                    }}
                    ></input>{" "}
                    ticket(s)
                </div>
                <div>
                    Maximum{" "}
                    <input
                        className={tempMaxWarning}
                        type="text"
                        id="maxTicketsAllowedPerOrder"
                        placeholder="# of tickets"
                        name="maxTicketsAllowedPerOrder"
                        value={props.ticket.maxTicketsAllowedPerOrder}
                        onChange={(event) => {
                            console.log("ticket: ", props.ticket)
                            props.changeTicket(event, props.ticket.key);
                        }}
                    ></input>{" "}
                    ticket(s)
                </div>
            </div>

            {props.ticket.minWarning || props.ticket.maxWarning
                ? <div className={classes.OrderLineWarning}
            >
                <div style={{ paddingLeft: "5px"}}> {props.ticket.minWarning ? "Not a whole number" : null}</div>
                <div style={{ paddingRight: "5px", textAlign: "left"}}> {props.ticket.maxWarning ? "Not a whole number" : null}</div>
            </div>
                : null
            }

            <PriceFeatureSettings
                ticket={props.ticket}
                changeFeature={props.changeFeature}
                switchPriceFeature={props.switchPriceFeature}
                addPromoCode={props.addPromoCode}
                changeArgument={props.changeArgument}
                changePromoCodesName={props.changePromoCodesName}
                changePromoCodesAmount={props.changePromoCodesAmount}
                changePromoCodesPercent={props.changePromoCodesPercent}
                deletePromoCode={props.deletePromoCode}
            />

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
                    onClick={(event) =>
                        props.switchSettings(event, props.ticket.key)
                    }
                >
                    ^ Minimize additional ticket features
                </button>
            </div>
        </div>
    )
};

export default PriceSettings;