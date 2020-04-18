import React, { useState } from "react";
import { Button, Form, Radio } from 'semantic-ui-react';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { formatDate, parseDate } from "react-day-picker/moment";
import "react-day-picker/lib/style.css";


import TimeSelector from './TimeSelector';
import CategorySelector from "./CategorySelector";

import Aux from "../hoc/Auxiliary/Auxiliary";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faGripVertical, faCog } from "@fortawesome/free-solid-svg-icons";

const EventCreation = () => {

    



const getFormattedDate = () => {
    let date = new Date();

    let year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    
    return month + '/' + day + '/' + year;
}


    // stores all Event Description variables
    const [eventDescription, setEventDescription] = useState({
        eventTitle: "",
        eventType: "none",
        onlineInfo: "",
        liveInfo: "",
        location: {
            venue: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            postalCode: "",
            country: ""
        },
        startDate: getFormattedDate(),
        startTime: "",
        endDate: getFormattedDate(),
        endTime: "",
        timeZone: '',
        eventImage: "",
        shortDescription: "",
        longDescription: "",
        eventCategory: "",
        facebookUrl: "",
        twitterUrl: "",
        instagramUrl: "",
        eventUrl: "",
        vanityUrl: "",
        refundPolicy: "none",
        ticketDelivery: "print"
    });

    // stores all Ticket Details variables
    const [ticketDetails, setTicketDetails] = useState([
        {
            key: "1",
            ticketName: "",
            ticketQuantity: "",
            ticketPrice: "",
            settings: false,
            ticketDescription: "",
            orderMin: "",
            orderMax: "",
            priceFeature: "none",
            promoCodes: [{key: "1", name: "", amount: ""}],
            promoCodeNames: [],
            promoCodeWarning: "",
            functionArgs: {},
        }
    ]);

    const refundPolicyChange = (event, value) => {
        let tempDescription = {...eventDescription};
        tempDescription.refundPolicy = value.value;
        setEventDescription(tempDescription);
        console.log("Event Description ", tempDescription);
    }

    const ticketDeliveryChange = (event, value) => {
        let tempDescription = {...eventDescription};
        tempDescription.ticketDelivery = value.value;
        setEventDescription(tempDescription);
        console.log("Event Description ", tempDescription);
    }

    const priceFeatureChangeHandler = (event, value, key) => {
      let tempDetails = [...ticketDetails];
        tempDetails.forEach( item => {
            if (item.key === key) {
                item.priceFeature = value;
                item.promoCodes = [{key: "1", name: "", amount: ""}];
                item.promoCodeNames = [];
                item.promoCodeWarning = "";
                item.functionArgs = {};
                if (value === "promo") {
                    item.promoCodes = [{key: "1", name: "", amount: ""}]
                }
                if(value === "bogof") {
                    item.functionArgs = {buy: "", get: "", discount: 1}
                }
                if(value === "bogod") {
                    item.functionArgs = {buy: "", get: "", discount: ""}
                }
                if(value === "twofer") {
                    item.functionArgs = {buy: "", for: ""}
                };
            }
        })
        setTicketDetails(tempDetails);
        console.log("Ticket Details: ", ticketDetails)
        
    }

    const createNewTicketHandler = () => {
        let newTicketKey = Math.floor(Math.random() * 1000000000000000);
        let newPromoKey = Math.floor(Math.random() * 1000000000000000);
        let newItem = 
        {
            key: newTicketKey,
            ticketName: "",
            ticketQuantity: "",
            ticketPrice: "",
            settings: false,
            ticketDescription: "",
            orderMin: "",
            orderMax: "",
            priceFeature: "none",
            promoCodes: [{key: newPromoKey, name: "", amount: ""}],
            promoCodeNames: [],
            promoCodeWarning: "",
            functionArgs: {}
        }
        let tempDetails = [...ticketDetails];
        tempDetails.push(newItem);
        setTicketDetails(tempDetails);
    }

    const deleteTicket = (event, id) => {
        if (ticketDetails.length === 1) {
            setTicketDetails([
                {
                    key: "1",
                    ticketName: "",
                    ticketQuantity: "",
                    ticketPrice: "",
                    settings: false,
                    ticketDescription: "",
                    orderMin: "",
                    orderMax: "",
                    priceFeature: "none",
                    promoCodes: [{key: "1", name: "", amount: ""}],
                    promoCodeNames: [],
                    promoCodeWarning: "",
                    functionArgs: {}
                }
            ])
        } else {
            let tempTicketDetails = [...ticketDetails];
            tempTicketDetails.forEach( (item, index) => {
                if (item.key === id) {
                    let removed = tempTicketDetails.splice(index,1);
                }
            })
            setTicketDetails(tempTicketDetails);
            console.log("Ticket Details: ", tempTicketDetails)
        }
    }

    const deletePromoCode = (event, ticket, promoKey) => {
        if (ticket.promoCodes.length === 1) {

            let tempTicketDetails = [...ticketDetails];
            tempTicketDetails.forEach( (item, index) => {
                if (item.key === ticket.key) {
                    item.promoCodes = [{key: "1", name: "", amount: ""}];
                }
            setTicketDetails(tempTicketDetails);
            })
        } else {

            let tempTicketDetails = [...ticketDetails];
            tempTicketDetails.forEach( (item, index1) => {
                if (item.key === ticket.key) {
                    let tempCodes = [...item.promoCodes];
                    tempCodes.forEach( (code, index2) => {
                        if (code.key === promoKey) {
                            let removed = tempCodes.splice(index2,1);
                        }
                    item.promoCodes = tempCodes;
                    })

                }
            })
            setTicketDetails(tempTicketDetails);
        }
    }

    const changeTicketDescriptionHandler = (event, id) => {
        let tempTicketDetails = [...ticketDetails];
        tempTicketDetails.forEach( item => {
            if (item.key === id) {
                item.ticketDescription = event.target.value;
            }
        })
        setTicketDetails(tempTicketDetails);
        console.log("Ticket Details: ", ticketDetails)
    }

    const changeOrderMinHandler = (event, id) => {
        let tempTicketDetails = [...ticketDetails];
        tempTicketDetails.forEach( item => {
            if (item.key === id) {
                item.orderMin = event.target.value;
            }
        })
        setTicketDetails(tempTicketDetails);
        console.log("Ticket Details: ", ticketDetails)
    }

    const changeOrderMaxHandler = (event, id) => {
        let tempTicketDetails = [...ticketDetails];
        tempTicketDetails.forEach( item => {
            if (item.key === id) {
                item.orderMax = event.target.value;
            }
        })
        setTicketDetails(tempTicketDetails);
        console.log("Ticket Details: ", ticketDetails)
    }

    const changeTicketNameHandler = (event, id) => {
        let tempTicketDetails = [...ticketDetails];
        tempTicketDetails.forEach( item => {
            if (item.key === id) {
                item.ticketName = event.target.value;
            }
        })
        setTicketDetails(tempTicketDetails);
        console.log("Ticket Details: ", ticketDetails)
    }

    const changeTicketQuantityHandler = (event, id) => {
        let tempTicketDetails = [...ticketDetails];
        tempTicketDetails.forEach( item => {
            if (item.key === id) {
                item.ticketQuantity = event.target.value;
            }
        })
        setTicketDetails(tempTicketDetails);
        console.log("Ticket Details: ", ticketDetails)
    }

    const changeTicketPriceHandler = (event, id) => {
        let tempTicketDetails = [...ticketDetails];
        tempTicketDetails.forEach( item => {
            if (item.key === id) {
                item.ticketPrice = event.target.value;
            }
        })
        setTicketDetails(tempTicketDetails);
        console.log("Ticket Details: ", ticketDetails)
    }

    const switchTicketSettings = (event, key) => {
        let tempTicketDetails = [...ticketDetails];
        tempTicketDetails.forEach( item => {
            if (item.key === key) {
                item.settings = !item.settings;
            }
        })
        setTicketDetails(tempTicketDetails);
        console.log("Ticket Details: ", ticketDetails)
    }

    const switchPriceFeature = (event, key) => {
        let tempDetails = [...ticketDetails];
        tempDetails.forEach( item => {
            if (item.key === key) {
                item.priceFeature = "none";
                item.promoCodes = [{key: "", name: "", amount: ""}];
                item.promoCodeNames = [];
                item.promoCodeWarning = "";
                item.functionArgs = {};
            }
        })
        setTicketDetails(tempDetails);
        console.log("Ticket Details: ", tempDetails)
    }

    const addPromoCode = (event, key) => {
        let newPromoKey = Math.floor(Math.random() * 1000000000000000);
        let tempDetails = [...ticketDetails];
        tempDetails.forEach( item => {
            if (item.key === key) {
                let newPromo = {key: newPromoKey, name: "", amount: ""};
                item.promoCodes.push(newPromo);
            }
        })
        setTicketDetails(tempDetails);
        console.log("Ticket Details: ", tempDetails)
    }

    const changeBuyArgument = (event, key) => {
        let tempDetails = [...ticketDetails];
        tempDetails.forEach( item => {
            if (item.key === key) {
                item.functionArgs.buy = event.target.value;
            }
        })
        setTicketDetails(tempDetails);
        console.log("Ticket Details: ", tempDetails)
    }

    const changeGetArgument = (event, key) => {
        let tempDetails = [...ticketDetails];
        tempDetails.forEach( item => {
            if (item.key === key) {
                item.functionArgs.get = event.target.value;
            }
        })
        setTicketDetails(tempDetails);
        console.log("Ticket Details: ", tempDetails)
    }

    const changeDiscountArgument = (event, key) => {
        let tempDetails = [...ticketDetails];
        tempDetails.forEach( item => {
            if (item.key === key) {
                item.functionArgs.discount = event.target.value;
            }
        })
        setTicketDetails(tempDetails);
        console.log("Ticket Details: ", tempDetails)
    }

    const changeForArgument = (event, key) => {
        let tempDetails = [...ticketDetails];
        tempDetails.forEach( item => {
            if (item.key === key) {
                item.functionArgs.for = event.target.value;
            }
        })
        setTicketDetails(tempDetails);
        console.log("Ticket Details: ", tempDetails)
    }


    //onChange={event => {changePromoCodesName(event, ticket.key, item.key)}}
    const changePromoCodesName = (event, ticketKey, promoKey) => {
        let tempDetails = [...ticketDetails];
        tempDetails.forEach( item => {
            if (item.key === ticketKey) {
                let tempCodes = [...item.promoCodes]
                tempCodes.forEach( code => {
                    if( code.key === promoKey) {
                        code.name = event.target.value;
                    }
                })
                item.promoCodes = tempCodes;
            }
        })
        setTicketDetails(tempDetails);
        console.log("Ticket Details: ", tempDetails)
    }

    const changePromoCodesAmount = (event, ticketKey, promoKey) => {
        let tempDetails = [...ticketDetails];
        tempDetails.forEach( item => {
            if (item.key === ticketKey) {
                let tempCodes = [...item.promoCodes]
                tempCodes.forEach( code => {
                    if( code.key === promoKey) {
                        code.amount = event.target.value;
                    }
                })
                item.promoCodes = tempCodes;
            }
        })
        setTicketDetails(tempDetails);
        console.log("Ticket Details: ", tempDetails)
    }

    const changeEventTitle = (event) => {
        let tempInfo = {...eventDescription};
        tempInfo.eventTitle = event.target.value;
        setEventDescription(tempInfo);
    }

    const changeEventType = (event, type) => {
        let tempInfo = {...eventDescription};
        tempInfo.eventType = type;
        setEventDescription(tempInfo);
        console.log("Event Details: ", tempInfo)
    }

    const changeStartDate = (event) => {
        let tempInfo = {...eventDescription};
        tempInfo.startDate = event.target.value;
        setEventDescription(tempInfo);
    }

    const changeStartTime = (event) => {
        let tempInfo = {...eventDescription};
        tempInfo.startTime = event.target.value;
        setEventDescription(tempInfo);
    }

    const changeEndDate = (event) => {
        let tempInfo = {...eventDescription};
        tempInfo.endDate = event.target.value;
        setEventDescription(tempInfo);
    }

    const changeEndTime = (event) => {
        let tempInfo = {...eventDescription};
        tempInfo.endTime = event.target.value;
        setEventDescription(tempInfo);
    }

    const changeTimeZone = (event) => {
        let tempInfo = {...eventDescription};
        tempInfo.timeZone = event.target.value;
        setEventDescription(tempInfo);
    }

    const changeEventCategory = (event) => {
        let tempInfo = {...eventDescription};
        tempInfo.eventCategory = event.target.value;
        setEventDescription(tempInfo);
    }

    const changeShortDescription = (event) => {
        let tempInfo = {...eventDescription};
        tempInfo.shortDescription = event.target.value;
        setEventDescription(tempInfo);
    }

    const changeLongDescription = (event) => {
        let tempInfo = {...eventDescription};
        tempInfo.longDescription = event.target.value;
        setEventDescription(tempInfo);
    }

    const changeFacebookUrl = (event) => {
        let tempInfo = {...eventDescription};
        tempInfo.facebookUrl = event.target.value;
        setEventDescription(tempInfo);
    }

    const changeTwitterUrl = (event) => {
        let tempInfo = {...eventDescription};
        tempInfo.twitterUrl = event.target.value;
        setEventDescription(tempInfo);
    }

    const changeInstagramUrl = (event) => {
        let tempInfo = {...eventDescription};
        tempInfo.instagramUrl = event.target.value;
        setEventDescription(tempInfo);
    }

    const changeEventUrl = (event) => {
        let tempInfo = {...eventDescription};
        tempInfo.eventUrl = event.target.value;
        setEventDescription(tempInfo);
    }

    const changeVanityUrl = (event) => {
        let tempInfo = {...eventDescription};
        tempInfo.vanityUrl = event.target.value;
        setEventDescription(tempInfo);
    }

    const promoCodesDisplay = (ticket) => {
        let display = (
            <div>
                {ticket.promoCodes.map( (item, index) => {
                    return (
                        <Aux>
                            <div style={{
                                display: `grid`,
                                gridTemplateColumns: "250px 250px 50px",
                                padding: "0px 10px 0px 25px",
                                border: "0px solid green",
                                boxSizing: "borderBox",
                                backgroundColor: "#E7E7E7",
                                height: "50px",
                                fontSize: "16px"}}>
                                <div style={{
                                    padding: "0px 10px 0px 5px",
                                    textAlign: "center"
                                }}>
                                    <input style={{
                                        padding: "9px 10px",
                                        border: "1px solid lightgrey",
                                        boxSizing: "borderBox",
                                        textAlign: "left",
                                        width: "150px",
                                        height: "40px"}}
                                        type="text"
                                        id="input box order min1"
                                        placeholder="unique name"
                                        value={item.name}
                                        onChange={event => {changePromoCodesName(event, ticket.key, item.key)}}
                                    >
                                    </input>
                                </div>
                                <div style={{
                                    padding: "0px 10px 0px 5px",
                                    textAlign: "center"
                                }}>
                                    <input style={{
                                        padding: "9px 10px",
                                        border: "1px solid lightgrey",
                                        boxSizing: "borderBox",
                                        textAlign: "left",
                                        width: "150px",
                                        height: "40px"}}
                                        type="text"
                                        id="input box order max1"
                                        placeholder="10.00"
                                        value={item.amount}
                                        onChange={event => {changePromoCodesAmount(event, ticket.key, item.key)}}
                                    >
                                    </input>
                                </div>
                                
                                <div style={{
                                    padding: "9px 0px 9px 3px",
                                    boxSizing: "borderBox",
                                    color: "blue"}}>
                                    <FontAwesomeIcon
                                        cursor = "pointer"
                                        onClick={event => deletePromoCode(event, ticket, item.key)}
                                        icon={faTrashAlt}/>
                                </div>

                            </div>
                        </Aux>
                    )
                })}
            </div>
        );
        return display;
    }

    const priceFeatureSettings = (ticket) => {
        if (ticket.priceFeature === "none") {
            return (
                <Aux>
                    <div style={{
                        height: "35px",
                        fontSize: "15px",
                        backgroundColor: "#E7E7E7",
                        borderTop: "1px solid lightgrey",
                        boxSizing: "borderBox"}}>

                        <div style={{
                            padding: "10px 10px 0px 25px",
                            border: "0px solid green",
                            boxSizing: "borderBox",                   
                            fontWeight: 600}}>
                            Advanced Pricing Features (<span style={{fontStyle: "italic"}}>optional </span>): please select one
                        </div>
                    </div>
                    <div style={{
                        padding: "5px 10px 0px 30px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7",
                        height: "30px"}}>
                        <button 
                            style={{
                                fontSize: "16px",
                                color: "blue",
                                border: "none",
                                backgroundColor: "#E7E7E7",
                                cursor: "pointer",
                                display: "inlineBlock",
                                outline: "none"
                            }}
                        onClick={event => priceFeatureChangeHandler(event, "promo", ticket.key)}>Promo Code(s)</button>
                    </div>
                    <div style={{
                        padding: "5px 10px 0px 30px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7",
                        height: "30px"}}>
                        <button 
                            style={{
                                fontSize: "16px",
                                color: "blue",
                                border: "none",
                                backgroundColor: "#E7E7E7",
                                cursor: "pointer",
                                display: "inlineBlock",
                                outline: "none"
                            }}
                        onClick={event => priceFeatureChangeHandler(event, "bogof", ticket.key)}>Buy One Get One Free</button>
                    </div>
                    <div style={{
                        padding: "5px 10px 0px 30px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7",
                        height: "30px"}}>
                        <button 
                            style={{
                                fontSize: "16px",
                                color: "blue",
                                border: "none",
                                backgroundColor: "#E7E7E7",
                                cursor: "pointer",
                                display: "inlineBlock",
                                outline: "none"
                            }}
                        onClick={event => priceFeatureChangeHandler(event, "bogod", ticket.key)}>Buy One Get One at a Discount</button>
                    </div>
                    <div style={{
                        padding: "5px 10px 0px 30px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7",
                        height: "30px"}}>
                        <button 
                            style={{
                                fontSize: "16px",
                                color: "blue",
                                border: "none",
                                backgroundColor: "#E7E7E7",
                                cursor: "pointer",
                                display: "inlineBlock",
                                outline: "none"
                            }}
                        onClick={event => priceFeatureChangeHandler(event, "twofer", ticket.key)}>Two for One</button>
                    </div>
                </Aux>
            )
        } else if (ticket.priceFeature === "promo") {
            return (
                <Aux>
                    <div style={{
                        height: "30px",
                        fontSize: "15px",
                        backgroundColor: "#E7E7E7",
                        borderTop: "1px solid lightgrey",
                        boxSizing: "borderBox"}}>

                        <div style={{
                            padding: "10px 10px 0px 25px",
                            boxSizing: "borderBox",
                            fontWeight: 600}}>
                            Promo Codes Price Feature
                        </div>
                    </div>


                    <div style={{
                        display: `grid`,
                        gridTemplateColumns: "250px 250px",
                        padding: "5px 10px 5px 74px",
                        height: "30px",
                        fontSize: "16px",
                        backgroundColor: "#E7E7E7",
                        boxSizing: "borderBox"}}>

                        <div style={{
                            boxSizing: "borderBox",
                            fontWeight: 400}}>
                            Promo Code
                        </div>

                        <div style={{
                            boxSizing: "borderBox",
                            fontWeight: 400}}>
                            Discounted Price
                        </div>
                    </div>

                    {promoCodesDisplay(ticket)}

                    <div style={{
                        display: `grid`,
                        gridTemplateColumns: "250px 250px",
                        padding: "5px 10px 5px 74px",
                        height: "30px",
                        fontSize: "15px",
                        backgroundColor: "#E7E7E7",
                        boxSizing: "borderBox"}}>
                        
                        <button 
                            style={{
                                padding: "0px",
                                fontSize: "15px",
                                color: "blue",
                                border: "none",
                                backgroundColor: "#E7E7E7",
                                cursor: "pointer",
                                display: "inlineBlock",
                                outline: "none",
                                textAlign: "left"
                            }}
                            onClick={event => addPromoCode(event, ticket.key)}>Add additional promo code
                        </button>

                        <button 
                            style={{
                                padding: "0px",
                                fontSize: "15px",
                                color: "blue",
                                border: "none",
                                backgroundColor: "#E7E7E7",
                                cursor: "pointer",
                                display: "inlineBlock",
                                outline: "none",
                                textAlign: "left"
                            }}
                        onClick={event => switchPriceFeature(event, ticket.key)}>Select different pricing feature</button>
                    </div>  
                </Aux>        
            )
        } else if (ticket.priceFeature === "bogof") {
            return (
                <Aux>
                    <div style={{
                        height: "30px",
                        fontSize: "15px",
                        backgroundColor: "#E7E7E7",
                        borderTop: "1px solid lightgrey",
                        boxSizing: "borderBox"}}>

                        <div style={{
                            padding: "10px 10px 0px 25px",
                            boxSizing: "borderBox",                   
                            fontWeight: 600}}>
                            Buy-One-Get-One-Free Price Feature
                        </div>
                    </div>

                    <div style={{
                        padding: "5px 10px 10px 35px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7",
                        height: "55px",
                        fontSize: "16px"}}>
                        <div>
                            Buy{" "}
                            <input style={{
                                padding: "9px 10px",
                                border: "1px solid lightgrey",
                                boxSizing: "borderBox",
                                width: "100px",
                                height: "40px"}}
                                type="text"
                                id="input box buy arg bogof"
                                placeholder="# of tickets"
                                value={ticket.functionArgs.buy}
                                onChange={event => {changeBuyArgument(event, ticket.key)}}
                            >
                            </input>
                            {" "}ticket(s) and get{" "}
                            <input style={{
                                padding: "9px 10px",
                                border: "1px solid lightgrey",
                                boxSizing: "borderBox",
                                width: "100px",
                                height: "40px"}}
                                type="text"
                                id="input box get arg bogof"
                                placeholder="# of tickets"
                                value={ticket.functionArgs.get}
                                onChange={event => {changeGetArgument(event, ticket.key)}}
                            >
                            </input>
                            {" "}ticket(s) for free.
                        </div>
                    </div>
                    <div style={{
                        padding: "0px 10px 0px 30px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7",
                        height: "30px"}}>
                        <button 
                            style={{
                                fontSize: "15px",
                                color: "blue",
                                border: "none",
                                backgroundColor: "#E7E7E7",
                                cursor: "pointer",
                                display: "inlineBlock",
                                outline: "none"
                            }}
                        onClick={event => switchPriceFeature(event, ticket.key)}>Select different pricing feature</button>
                    </div>
                </Aux>        
            )
        } else if (ticket.priceFeature === "bogod") {
            return (
                <Aux>
                    <div style={{
                        height: "30px",
                        fontSize: "15px",
                        backgroundColor: "#E7E7E7",
                        borderTop: "1px solid lightgrey",
                        boxSizing: "borderBox"}}>

                        <div style={{
                            padding: "10px 10px 0px 25px",
                            boxSizing: "borderBox",                   
                            fontWeight: 600}}>
                            Buy-One-Get-One-for-Discount Price Feature
                        </div>
                    </div>

                    <div style={{
                        padding: "5px 10px 10px 35px",
                        border: "0px solid green",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7",
                        height: "55px",
                        fontSize: "16px"}}>
                        <div>
                            Buy{" "}
                            <input style={{
                                padding: "9px 10px",
                                border: "1px solid lightgrey",
                                boxSizing: "borderBox",
                                width: "100px",
                                height: "40px"}}
                                type="text"
                                id="input box buy arg bogod"
                                placeholder="# of tickets"
                                value={ticket.functionArgs.buy}
                                onChange={event => {changeBuyArgument(event, ticket.key)}}
                            >
                            </input>
                            {" "}ticket(s) and buy an additional{" "}
                            <input style={{
                                padding: "9px 10px",
                                border: "1px solid lightgrey",
                                boxSizing: "borderBox",
                                width: "100px",
                                height: "40px"}}
                                type="text"
                                id="input box get arg bogod"
                                placeholder="# of tickets"
                                value={ticket.functionArgs.get}
                                onChange={event => {changeGetArgument(event, ticket.key)}}
                            >
                            </input>
                            {" "}ticket(s) for a{" "}
                            <input style={{
                                padding: "9px 10px",
                                border: "1px solid lightgrey",
                                boxSizing: "borderBox",
                                width: "100px",
                                height: "40px"}}
                                type="text"
                                id="input box for arg bogod"
                                placeholder="percentage"
                                value={ticket.functionArgs.discount}
                                onChange={event => {changeDiscountArgument(event, ticket.key)}}
                            >
                            </input>
                            {" "}discount.
                        </div>
                    </div>
                    <div style={{
                        padding: "0px 10px 0px 30px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7",
                        height: "30px"}}>
                        <button 
                            style={{
                                fontSize: "15px",
                                color: "blue",
                                border: "none",
                                backgroundColor: "#E7E7E7",
                                cursor: "pointer",
                                display: "inlineBlock",
                                outline: "none"
                            }}
                        onClick={event => switchPriceFeature(event, ticket.key)}>Select different pricing feature</button>
                    </div>
                </Aux>        
            )
        } else if (ticket.priceFeature === "twofer") {
            return (
                <Aux>
                    <div style={{
                        height: "30px",
                        fontSize: "15px",
                        backgroundColor: "#E7E7E7",
                        borderTop: "1px solid lightgrey",
                        boxSizing: "borderBox"}}>

                        <div style={{
                            padding: "10px 10px 0px 25px",
                            boxSizing: "borderBox",                   
                            fontWeight: 600}}>
                            Two-for-One Price Feature
                        </div>
                    </div>

                    <div style={{
                        padding: "5px 10px 10px 35px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7",
                        height: "55px",
                        fontSize: "16px"}}>
                        <div>
                            Buy{" "}
                            <input style={{
                                padding: "9px 10px",
                                border: "1px solid lightgrey",
                                boxSizing: "borderBox",
                                width: "100px",
                                height: "40px"}}
                                type="text"
                                id="input box buy arg twofer"
                                placeholder="# of tickets"
                                value={ticket.functionArgs.buy}
                                onChange={event => {changeBuyArgument(event, ticket.key)}}
                            >
                            </input>
                            {" "}ticket(s) for the price of{" "}
                            <input style={{
                                padding: "9px 10px",
                                border: "1px solid lightgrey",
                                boxSizing: "borderBox",
                                width: "100px",
                                height: "40px"}}
                                type="text"
                                id="input box for arg twofer"
                                placeholder="# of tickets"
                                value={ticket.functionArgs.for}
                                onChange={event => {changeForArgument(event, ticket.key)}}
                            >
                            </input>
                            {" "}ticket(s).
                        </div>
                    </div>
                    <div style={{
                        padding: "0px 10px 0px 30px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7",
                        height: "30px"}}>
                        <button 
                            style={{
                                fontSize: "15px",
                                color: "blue",
                                border: "none",
                                backgroundColor: "#E7E7E7",
                                cursor: "pointer",
                                display: "inlineBlock",
                                outline: "none"
                            }}
                        onClick={event => switchPriceFeature(event, ticket.key)}>Select different pricing feature</button>
                    </div>
                </Aux>        
            )
        } else {
            return (
                <Aux>
                    <div>Bad Pricing Option: Go back</div>                    
                    <div>
                        <button 
                            style={{
                                fontSize: "15px",
                                color: "blue",
                                border: "none",
                                backgroundColor: "white",
                                cursor: "pointer",
                                display: "inlineBlock",
                                outline: "none"
                            }}
                        onClick={event => switchPriceFeature(event, ticket.key)}>Select different pricing feature</button>
                    </div>
                </Aux>        
            )
        }
    }


    
    const additionalSettings = (ticket) => {
        return (
            <div>

                <div style={{
                    height: "30px",
                    fontSize: "15px",
                    backgroundColor: "#E7E7E7",
                    borderTop: "1px solid lightgrey",
                    borderBottom: "0px solid lightgrey",
                    boxSizing: "borderBox"}}>

                    <div style={{
                        padding: "10px 10px 0px 25px",
                        boxSizing: "borderBox",          
                        fontWeight: 600}}>
                        Ticket Description
                    </div>
                </div>
                <div style={{
                    padding: "5px 10px 10px 25px",
                    height: "110px",
                    boxSizing: "borderBox",
                    backgroundColor: "#E7E7E7"}}>
                    <textarea style={{
                        padding: "9px 10px",
                        border: "1px solid lightgrey",
                        boxSizing: "borderBox",
                        lineHeight: "1.75",
                        fontSize: "16px",
                        width: "600px",
                        height: "95px",
                        resize: "vertical"}}
                        type="text"
                        id="input box ticket description"
                        placeholder="Brief description of ticket and what it includes: limit 1000 characters"
                        value={ticket.ticketDescription}
                        onChange={event => {changeTicketDescriptionHandler(event, ticket.key)}}
                    >
                    </textarea>
                </div>

                <div style={{
                    height: "30px",
                    fontSize: "15px",
                    backgroundColor: "#E7E7E7",
                    borderTop: "1px solid lightgrey",
                    borderBottom: "0px solid lightgrey",
                    boxSizing: "borderBox"}}>

                    <div style={{
                        padding: "10px 10px 0px 25px",
                        boxSizing: "borderBox",                   
                        fontWeight: 600}}>
                        Order Size Restrictions
                    </div>
                </div>

                <div style={{
                    display: `grid`,
                    gridTemplateColumns: "300px 300px",
                    padding: "5px 10px 10px 35px",
                    boxSizing: "borderBox",
                    backgroundColor: "#E7E7E7",
                    height: "55px",
                    fontSize: "16px"}}>
                    <div>
                        Minimum{" "}
                        <input style={{
                            padding: "9px 10px",
                            border: "1px solid lightgrey",
                            boxSizing: "borderBox",
                            width: "100px",
                            height: "40px"}}
                            type="text"
                            id="input box order min2"
                            placeholder="# of tickets"
                            value={ticket.orderMin}
                            onChange={event => {changeOrderMinHandler(event, ticket.key)}}
                        >
                        </input>
                        {" "}ticket(s)
                    </div>
                    <div>
                        Maximum{" "}
                        <input style={{
                            padding: "9px 10px",
                            border: "1px solid lightgrey",
                            boxSizing: "borderBox",
                            width: "100px",
                            height: "40px"}}
                            type="text"
                            id="input box order max2"
                            placeholder="# of tickets"
                            value={ticket.orderMax}
                            onChange={event => {changeOrderMaxHandler(event, ticket.key)}}
                        >
                        </input>
                        {" "}ticket(s)
                    </div>
                </div>

                {priceFeatureSettings(ticket)}
                <div
                    style={{padding: "5px",
                    borderTop: "1px solid lightgrey",
                    height: "30px",
                    textAlign: "center"}}>
                    <button
                        style={{
                            fontSize: "15px",
                            color: "blue",
                            border: "none",
                            backgroundColor: "white",
                            cursor: "pointer",
                            display: "inlineBlock",
                            outline: "none"
                            }}
                        onClick={event => switchTicketSettings(event, ticket.key)}
                    >^ Minimize settings</button>
                </div>
            </div>
        )
    }
    
    const ticketTypeDisplay = () => {
        let display = (
            <div>
                {ticketDetails.map( (item, index) => {
                    return (
                        <Aux>
                            <div style={{
                                display: `grid`,
                                gridTemplateColumns: "360px 150px 225px 160px",
                                height: "60px",
                                fontSize: "16px",
                                borderTop: "1px solid lightgrey",
                                boxSizing: "borderBox"}}>

                                <div style={{
                                    padding: "10px 5px",
                                    boxSizing: "borderBox",
                                    display: `grid`,
                                    gridTemplateColumns: "20px 330px"}}>
                                    <div style={{
                                        padding: "9px 0px 9px 3px",
                                        boxSizing: "borderBox"}}>
                                    <FontAwesomeIcon
                                        cursor = "pointer"
                                        icon={faGripVertical}
                                    />
                                    </div>
                                    <input style={{
                                        padding: "9px 10px",
                                        border: "1px solid lightgrey",
                                        boxSizing: "borderBox"}}
                                        type="text"
                                        id="input box ticket name"
                                        placeholder="GA, VIP, etc: limit 32 characters"
                                        value={item.ticketName}
                                        onChange={event => {changeTicketNameHandler(event, item.key)}}
                                    >
                                    </input>
                                </div>

                                <div style={{
                                    padding: "10px 5px",
                                    boxSizing: "borderBox"}}>
                                    <input style={{
                                        padding: "9px 10px",
                                        border: "1px solid lightgrey",
                                        boxSizing: "borderBox",
                                        width: "140px",
                                        height: "40px"}}
                                        type="text"
                                        id="input box ticket quantity"
                                        placeholder="100"
                                        value={item.ticketQuantity}
                                        onChange={event => {changeTicketQuantityHandler(event, item.key)}}
                                    >
                                    </input>
                                </div>

                                <div style={{
                                    padding: "10px 5px",
                                    boxSizing: "borderBox",
                                    display: `grid`,
                                    gridTemplateColumns: "20px 195px"}}>
                                    <div style={{
                                        padding: "9px 0px 9px 5px",
                                        boxSizing: "borderBox"}}>
                                    $
                                    </div>
                                    <input style={{
                                        padding: "9px 10px",
                                        border: "1px solid lightgrey",
                                        boxSizing: "borderBox"}}
                                        type="text"
                                        id="input box ticket price"
                                        placeholder="10.00"
                                        value={item.ticketPrice}
                                        onChange={event => {changeTicketPriceHandler(event, item.key)}}
                                    >
                                    </input>
                                </div>

                                <div style={{
                                    padding: "10px 5px 10px 5px",
                                    boxSizing: "borderBox",
                                    display: `grid`,
                                    gridTemplateColumns: "50px 100px"}}>
                                    <div style={{
                                        padding: "9px 0px 9px 8px",
                                        boxSizing: "borderBox",
                                        color: "blue"}}>
                                        <FontAwesomeIcon
                                            cursor = "pointer"
                                            onClick={event => switchTicketSettings(event, item.key)}
                                            icon={faCog}/>
                                    </div>
                                    <div style={{
                                        padding: "9px 0px 9px 3px",
                                        boxSizing: "borderBox",
                                        color: "blue"}}>
                                        <FontAwesomeIcon
                                            cursor = "pointer"
                                            onClick={event => deleteTicket(event, item.key)}
                                            icon={faTrashAlt}/>
                                    </div>
                                </div>
                                
                            </div>
                            {item.settings ? additionalSettings(item) : null}
                        </Aux>
                    )
                })}
            </div>
        );
        return display;
    }



    const minStartDay = (days) => {
        let today = new Date();
        let number = days; // Days you want to subtract
        let date = new Date(today.getTime() - (number * 24 * 60 * 60 * 1000));
        return date;
    }

    const minEndDay = () => {
        let startDate = eventDescription.startDate
        let today = new Date();
        let date;
        if (startDate && startDate > today) {
            date = startDate;
        } else {
            date = today;
        }
        return date;
    }

    const startDateChange = (day) => {
        let tempDescription = {...eventDescription};
        let today = new Date();
        tempDescription.startDate = day;
        if (tempDescription.startDate > tempDescription.endDate) {
            tempDescription.endDate = day;
        }
        setEventDescription(tempDescription);
    }

    const endDateChange = (day) => {
        let tempDescription = {...eventDescription};
        tempDescription.endDate = day;
        setEventDescription(tempDescription);
    }

    return (
        <div style={{
            fontFamily: "'Roboto', sans-serif",
            backgroundColor: `#2f5596`,
            backgroundImage: `linear-gradient(180deg, #2f5596 0%, #000000 100%)`,
            paddingTop: `10px`,
            paddingLeft: `0px`,
            paddingRight: `0px`,
            paddingBottom: `10px`
        }}>

            <div style={{
                backgroundColor: `white`,
                paddingLeft: "15px",
                paddingRight: "15px",
                paddingBottom: "15px",
                margin: "auto",
                width: "930px",
                boxSizing: "borderBox",
                border: "1px solid grey"
            }}>
                <div style={{
                    margin: "10px 0px 0px 0px",
                    paddingLeft: "0px",
                    paddingRight: "10px",
                    paddingTop: "15px",
                    paddingBottom: "15px",
                    boxSizing: "borderBox",
                    fontSize: "30px",
                    fontWeight: "600",
                    height: "35px"}}>
                    Event Creation
                </div>

                <br></br>
                <div style={{
                    margin: "10px 0px 0px 0px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    paddingTop: "10px",
                    boxSizing: "borderBox",
                    fontSize: "20px",
                    fontWeight: "600",
                    height: "40px",
                    width: "140px",
                    backgroundColor: "black",
                    color: "white"}}>
                    Event Details
                </div>
                
                <div style={{border: "1px solid grey"}}>

                    <div style={{
                        height: "30px",
                        fontSize: "15px",
                        backgroundColor: "#E7E7E7",
                        borderTop: "1px solid lightgrey",
                        boxSizing: "borderBox"}}>

                        <div style={{
                            padding: "10px 10px 0px 25px",
                            boxSizing: "borderBox",          
                            fontWeight: 600}}>
                            Event Title
                        </div>
                    </div>
                    <div style={{
                        height: "55px",
                        fontSize: "16px",
                        padding: "5px 10px 10px 25px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7"}}>
                        <input style={{
                            padding: "9px 10px",
                            border: "1px solid lightgrey",
                            boxSizing: "borderBox",
                            height: "40px",
                            lineHeight: "1.75",
                            fontSize: "16px",
                            width: "600px"}}
                            type="text"
                            id="input box ticket description"
                            placeholder="Short title of event: limit 75 characters"
                            value={eventDescription.eventTitle}
                            onChange={event => {changeEventTitle(event)}}
                        >
                        </input>
                    </div>

                    

                    <div style={{
                        height: "35px",
                        fontSize: "15px",
                        backgroundColor: "#E7E7E7",
                        borderTop: "1px solid lightgrey",
                        boxSizing: "borderBox"}}>

                        <div style={{
                            padding: "10px 10px 0px 25px",
                            border: "0px solid green",
                            boxSizing: "borderBox",          
                            fontWeight: 600}}>
                            {eventDescription. eventType === "none" ? "Event Type: please select one" : null}
                            {eventDescription. eventType === "live" ? "Event Location" : null}
                            {eventDescription. eventType === "online" ? "Event Type" : null}
                        </div>
                    </div>


                    {eventDescription.eventType === "none" ?
                    <Aux>

                    <div style={{
                        padding: "5px 10px 0px 30px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7",
                        height: "30px"}}>
                        <button 
                            style={{
                                fontSize: "16px",
                                color: "blue",
                                border: "none",
                                backgroundColor: "#E7E7E7",
                                cursor: "pointer",
                                display: "inlineBlock",
                                outline: "none"
                            }}
                        onClick={event => changeEventType(event, "live")}>Live Event</button>
                    </div>


                                        <div style={{
                        padding: "5px 10px 0px 30px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7",
                        height: "30px"}}>
                        <button 
                            style={{
                                fontSize: "16px",
                                color: "blue",
                                border: "none",
                                backgroundColor: "#E7E7E7",
                                cursor: "pointer",
                                display: "inlineBlock",
                                outline: "none"
                            }}
                        onClick={event => changeEventType(event, "online")}>Online Event</button>
                    </div>
                    </Aux>
                     : null}         


                    {eventDescription.eventType === "live" ?
                    <Aux>
                    


                    <div style={{
                        height: "45px",
                        fontSize: "16px",
                        padding: "5px 10px 0px 25px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7"}}>
                        <input style={{
                            padding: "9px 10px",
                            border: "1px solid lightgrey",
                            boxSizing: "borderBox",
                            height: "40px",
                            lineHeight: "1.75",
                            fontSize: "16px",
                            width: "600px"}}
                            type="text"
                            id="input box ticket description"
                            placeholder="Venue Name: limit 140 characters"
                            value={eventDescription.location.venue}
                            onChange={(event) => {
                                let tempDescription = {...eventDescription};
                                tempDescription.location.venue = event.target.value;
                                setEventDescription(tempDescription)
                            }}
                        >
                        </input>
                    </div>

                    <div style={{
                        height: "45px",
                        fontSize: "16px",
                        padding: "5px 10px 0px 25px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7"}}>
                        <input style={{
                            padding: "9px 10px",
                            border: "1px solid lightgrey",
                            boxSizing: "borderBox",
                            height: "40px",
                            lineHeight: "1.75",
                            fontSize: "16px",
                            width: "600px"}}
                            type="text"
                            id="input box ticket description"
                            placeholder="Address: limit 32 characters"
                            value={eventDescription.location.address1}
                            onChange={(event) => {
                                let tempDescription = {...eventDescription};
                                tempDescription.location.address1 = event.target.value;
                                setEventDescription(tempDescription)
                            }}
                        >
                        </input>
                    </div>

                    <div style={{
                        height: "45px",
                        fontSize: "16px",
                        padding: "5px 10px 0px 25px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7"}}>
                        <input style={{
                            padding: "9px 10px",
                            border: "1px solid lightgrey",
                            boxSizing: "borderBox",
                            height: "40px",
                            lineHeight: "1.75",
                            fontSize: "16px",
                            width: "600px"}}
                            type="text"
                            id="input box ticket description"
                            placeholder="Address 2: limit 32 characters"
                            value={eventDescription.location.address2}
                            onChange={(event) => {
                                let tempDescription = {...eventDescription};
                                tempDescription.location.address2 = event.target.value;
                                setEventDescription(tempDescription)
                            }}
                        >
                        </input>
                    </div>


                    <div style={{
                        height: "45px",
                        fontSize: "16px",
                        padding: "5px 10px 0px 25px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7"}}>
                        <input style={{
                            padding: "9px 10px",
                            border: "1px solid lightgrey",
                            boxSizing: "borderBox",
                            height: "40px",
                            lineHeight: "1.75",
                            fontSize: "16px",
                            width: "600px"}}
                            type="text"
                            id="input box ticket description"
                            placeholder="City"
                            value={eventDescription.location.city}
                            onChange={(event) => {
                                let tempDescription = {...eventDescription};
                                tempDescription.location.city = event.target.value;
                                setEventDescription(tempDescription)
                            }}
                        >
                        </input>
                    </div>

                    <div style={{
                        display: `grid`,
                        gridTemplateColumns: "300px 300px",
                        height: "45px",
                        fontSize: "16px",
                        padding: "5px 10px 0px 25px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7"}}>
                        <div>
                            <input style={{
                                padding: "9px 10px",
                                border: "1px solid lightgrey",
                                boxSizing: "borderBox",
                                height: "40px",
                                lineHeight: "1.75",
                                fontSize: "16px",
                                width: "295px"}}
                                type="text"
                                id="input box ticket description"
                                placeholder="State"
                                value={eventDescription.location.state}
                                onChange={(event) => {
                                    let tempDescription = {...eventDescription};
                                    tempDescription.location.state = event.target.value;
                                    setEventDescription(tempDescription)
                                }}
                            >
                            </input>
                        </div>
                        <input style={{
                            padding: "9px 10px",
                            border: "1px solid lightgrey",
                            boxSizing: "borderBox",
                            height: "40px",
                            lineHeight: "1.75",
                            fontSize: "16px",
                            width: "300px"}}
                            type="text"
                            id="input box ticket description"
                            placeholder="Zip/Postal"
                            value={eventDescription.location.postalCode}
                            onChange={(event) => {
                                let tempDescription = {...eventDescription};
                                tempDescription.location.postalCode = event.target.value;
                                setEventDescription(tempDescription)
                            }}
                        >
                        </input>
                    </div>


                    <div style={{
                        height: "55px",
                        fontSize: "16px",
                        padding: "5px 10px 10px 25px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7"}}>
                        <input style={{
                            padding: "9px 10px",
                            border: "1px solid lightgrey",
                            boxSizing: "borderBox",
                            height: "40px",
                            lineHeight: "1.75",
                            fontSize: "16px",
                            width: "600px"}}
                            type="text"
                            id="input box ticket description"
                            placeholder="under construction"
                            value={eventDescription.location.country}
                            onChange={(event) => {
                                let tempDescription = {...eventDescription};
                                tempDescription.location.country = event.target.value;
                                setEventDescription(tempDescription)
                            }}
                        >
                        </input>
                    </div>
                    
                    <div style={{
                        padding: "0px 10px 0px 30px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7",
                        height: "30px"}}>
                        <button 
                            style={{
                                fontSize: "14px",
                                color: "blue",
                                border: "none",
                                backgroundColor: "#E7E7E7",
                                cursor: "pointer",
                                display: "inlineBlock",
                                outline: "none"
                            }}
                        onClick={event => changeEventType(event, "online")}>Change to Online Event</button>
                    </div>

                    </Aux>
                     : null}


                    {eventDescription.eventType === "online" ?
                    <Aux>

                    <div style={{
                        height: "30px",
                        fontSize: "16px",
                        padding: "5px 10px 0px 35px",
                        boxSizing: "borderBox",
                        fontWeight: "bold",
                        backgroundColor: "#E7E7E7"}}>
                    Online Event
                    </div>


                    <div style={{
                        padding: "5px 10px 0px 30px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7",
                        height: "30px"}}>
                        <button 
                            style={{
                                fontSize: "14px",
                                color: "blue",
                                border: "none",
                                backgroundColor: "#E7E7E7",
                                cursor: "pointer",
                                display: "inlineBlock",
                                outline: "none"
                            }}
                        onClick={event => changeEventType(event, "live")}>Change to Live Event</button>
                    </div>
                    </Aux>
                     : null}


                    <div style={{
                        height: "35px",
                        fontSize: "15px",
                        backgroundColor: "#E7E7E7",
                        borderTop: "1px solid lightgrey",
                        boxSizing: "borderBox"}}>

                        <div style={{
                            padding: "10px 10px 0px 25px",
                            border: "0px solid green",
                            boxSizing: "borderBox",          
                            fontWeight: 600}}>
                            Event Date and Time
                        </div>
                    </div>

                    <div style={{
                        display: `grid`,
                        gridTemplateColumns: "115px 120px 115px 120px 330px",
                        padding: "5px 10px 5px 35px",
                        height: "30px",
                        fontSize: "16px",
                        backgroundColor: "#E7E7E7",
                        border: "0px solid lightgrey",
                        boxSizing: "borderBox"}}>

                        <div style={{
                            border: "0px solid green",
                            boxSizing: "borderBox",
                            textAlign: "left",
                            fontWeight: 400}}>
                            Start Date
                        </div>

                        <div style={{
                            border: "0px solid green",
                            boxSizing: "borderBox",
                            textAlign: "left",
                            fontWeight: 400}}>
                            Start Time
                        </div>

                        <div style={{
                            border: "0px solid green",
                            boxSizing: "borderBox",
                            textAlign: "left",
                            fontWeight: 400}}>
                            End Date
                        </div>

                        <div style={{
                            border: "0px solid green",
                            boxSizing: "borderBox",
                            textAlign: "left",
                            fontWeight: 400}}>
                            End Time
                        </div>

                        <div style={{
                            border: "0px solid green",
                            boxSizing: "borderBox",
                            textAlign: "left",
                            fontWeight: 400}}>
                            Time Zone
                        </div>
                    </div>

                    <div style={{
                        display: `grid`,
                        gridTemplateColumns: "115px 120px 115px 120px 330px",
                        height: "50px",
                        fontSize: "16px",
                        padding: "0px 10px 10px 35px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7"}}>

                        <DayPickerInput
                        value={eventDescription.startDate}
                        inputProps={{ style: {
                            paddingLeft: 9,
                            border: "1px solid lightgrey",
                            boxSizing: "borderBox",
                            width: 110,
                            height: 40,
                            fontSize: "16px",
                            color: "black",
                            textAlign: "left",
                            cursor: "pointer"
                        } }}
                        
                        format="MM/DD/YYYY"
                        formatDate={formatDate}
                        parseDate={parseDate}
                        placeholder="select date"
                        onDayChange={startDateChange}
                        dayPickerProps={{
                            format: "MM-DD-YYYY",
                            disabledDays: {
                            before: new Date()
                            },
                        }}/>

                        <TimeSelector
                            onChange={event => {
                                changeStartTime(event);
                            }}
                            start={""}
                            end={""}
                        />

                        <DayPickerInput
                        value={eventDescription.endDate}
                        inputProps={{ style: {
                            paddingLeft: 9,
                            border: "1px solid lightgrey",
                            boxSizing: "borderBox",
                            width: 110,
                            height: 40,
                            fontSize: "16px",
                            color: "black",
                            textAlign: "left",
                            cursor: "pointer"
                        } }}
                        
                        format="MM/DD/YYYY"
                        formatDate={formatDate}
                        parseDate={parseDate}
                        placeholder="select date"
                        onDayChange={endDateChange}
                        dayPickerProps={{
                            format: "MM-DD-YYYY",
                            disabledDays: {
                            before: minEndDay()
                            },
                        }}/>

                        <TimeSelector
                            onChange={event => {
                                changeEndTime(event);
                            }}
                            start={""}
                            end={""}
                        />

                        <input style={{
                            padding: "9px 10px",
                            border: "1px solid lightgrey",
                            boxSizing: "borderBox",
                            height: "40px",
                            lineHeight: "1.75",
                            fontSize: "16px"}}
                            type="text"
                            id="input box ticket description"
                            placeholder="under construction"
                            value={eventDescription.timeZone}
                            onChange={event => {changeTimeZone(event)}}
                        >
                        </input>
                    </div>


                    <div style={{
                        height: "30px",
                        fontSize: "15px",
                        backgroundColor: "#E7E7E7",
                        borderTop: "1px solid lightgrey",
                        boxSizing: "borderBox"}}>

                        <div style={{
                            padding: "10px 10px 0px 25px",
                            border: "0px solid green",
                            boxSizing: "borderBox",          
                            fontWeight: 600}}>
                            Event Image
                        </div>
                    </div>
                    <div style={{
                        height: "165px",
                        fontSize: "16px",
                        padding: "5px 10px 10px 25px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7"}}>
                        <input style={{
                            padding: "9px 10px",
                            border: "1px solid lightgrey",
                            boxSizing: "borderBox",
                            height: "150px",
                            textAlign: "center",
                            fontSize: "16px",
                            width: "600px"}}
                            disabled
                            type="text"
                            id="input box ticket description"
                            placeholder="Add Image Here"
                        >
                        </input>
                    </div>

                    <div style={{
                        height: "30px",
                        fontSize: "15px",
                        backgroundColor: "#E7E7E7",
                        borderTop: "1px solid lightgrey",
                        boxSizing: "borderBox"}}>
                        <div style={{
                            padding: "10px 10px 0px 25px",
                            border: "0px solid green",
                            boxSizing: "borderBox",          
                            fontWeight: 600}}>
                            Event Short Description
                        </div>
                    </div>
                    <div style={{
                        padding: "5px 10px 10px 25px",
                        border: "0px solid green",
                        boxSizing: "borderBox",
                        height: "95px",
                        backgroundColor: "#E7E7E7"}}>
                        <textarea style={{
                            padding: "9px 10px",
                            border: "1px solid lightgrey",
                            boxSizing: "borderBox",
                            lineHeight: "1.75",
                            fontSize: "16px",
                            width: "600px",
                            height: "80px",
                            resize: "vertical"}}
                            type="text"
                            id="input box ticket description"
                            placeholder="Short description of event for social media posts: limit 140 characters"
                            value={eventDescription.shortDescription}
                            onChange={event => {changeShortDescription(event)}}
                        >
                        </textarea>
                    </div>

                    <div style={{
                        height: "30px",
                        fontSize: "15px",
                        backgroundColor: "#E7E7E7",
                        borderTop: "1px solid lightgrey",
                        boxSizing: "borderBox"}}>
                        <div style={{
                            padding: "10px 10px 0px 25px",
                            border: "0px solid green",
                            boxSizing: "borderBox",          
                            fontWeight: 600}}>
                            Event Long Description
                        </div>
                    </div>
                    <div style={{
                        padding: "5px 10px 10px 25px",
                        border: "0px solid green",
                        boxSizing: "borderBox",
                        height: "195px",
                        backgroundColor: "#E7E7E7"}}>
                        <textarea style={{
                            padding: "9px 10px",
                            border: "1px solid lightgrey",
                            boxSizing: "borderBox",
                            lineHeight: "1.75",
                            fontSize: "16px",
                            width: "600px",
                            height: "180px",
                            resize: "vertical"}}
                            type="text"
                            id="input box ticket description"
                            placeholder="Long description of event for Event Description page: limit 5000 characters"
                            value={eventDescription.longDescription}
                            onChange={event => {changeLongDescription(event)}}
                        >
                        </textarea>
                    </div>

                    <div style={{
                        height: "30px",
                        fontSize: "15px",
                        backgroundColor: "#E7E7E7",
                        borderTop: "1px solid lightgrey",
                        boxSizing: "borderBox"}}>
                        <div style={{
                            padding: "10px 10px 0px 25px",
                            border: "0px solid green",
                            boxSizing: "borderBox",          
                            fontWeight: 600}}>
                            Event Category
                        </div>
                    </div>

                    <div style={{
                        height: "55px",
                        fontSize: "16px",
                        padding: "5px 10px 10px 25px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7"}}>
                        <CategorySelector
                            onChange={event => {
                                changeEventCategory(event);
                            }}/>
                    </div>

                    <div style={{
                        height: "30px",
                        fontSize: "15px",
                        backgroundColor: "#E7E7E7",
                        borderTop: "1px solid lightgrey",
                        boxSizing: "borderBox"}}>
                        <div style={{
                            padding: "10px 10px 0px 25px",
                            border: "0px solid green",
                            boxSizing: "borderBox",          
                            fontWeight: 600}}>
                            Social Media Links
                        </div>
                    </div>
                    <div style={{
                        display: `grid`,
                        gridTemplateColumns: "120px 400px",
                        height: "45px",
                        fontSize: "16px",
                        padding: "5px 10px 0px 35px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7"}}>
                        <div style={{
                            padding: "11px 5px 0px 0px",
                            textAlign: "right"}}>
                            facebook.com/{" "}
                        </div>
                        <input style={{
                            padding: "9px 10px",
                            border: "1px solid lightgrey",
                            boxSizing: "borderBox",
                            height: "40px",
                            lineHeight: "1.75",
                            fontSize: "16px",
                            width: "400px"}}
                            type="text"
                            id="input box ticket description"
                            placeholder="your facebook address"
                            value={eventDescription.facebookUrl}
                            onChange={event => {changeFacebookUrl(event)}}
                        >
                        </input>
                    </div>

                    <div style={{
                        display: `grid`,
                        gridTemplateColumns: "120px 400px",
                        height: "45px",
                        fontSize: "16px",
                        padding: "5px 10px 0px 35px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7"}}>
                        <div style={{
                            padding: "11px 5px 0px 0px",
                            textAlign: "right"}}>
                            twitter.com/{" "}
                        </div>
                        <input style={{
                            padding: "9px 10px",
                            border: "1px solid lightgrey",
                            boxSizing: "borderBox",
                            height: "40px",
                            lineHeight: "1.75",
                            fontSize: "16px",
                            width: "400px"}}
                            type="text"
                            id="input box ticket description"
                            placeholder="your twitter address"
                            value={eventDescription.twitterUrl}
                            onChange={event => {changeTwitterUrl(event)}}
                        >
                        </input>
                    </div>
                    <div style={{
                        display: `grid`,
                        gridTemplateColumns: "120px 400px",
                        height: "55px",
                        fontSize: "16px",
                        padding: "5px 10px 10px 35px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7"}}>
                        <div style={{
                            padding: "11px 5px 0px 0px",
                            textAlign: "right"}}>
                            instagram.com/{" "}
                        </div>
                        <input style={{
                            padding: "9px 10px",
                            border: "1px solid lightgrey",
                            boxSizing: "borderBox",
                            height: "40px",
                            lineHeight: "1.75",
                            fontSize: "16px",
                            width: "400px"}}
                            type="text"
                            id="input box ticket description"
                            placeholder="your instagram address"
                            value={eventDescription.instagramUrl}
                            onChange={event => {changeInstagramUrl(event)}}
                        >
                        </input>
                    </div>

                    <div style={{
                        height: "30px",
                        fontSize: "15px",
                        backgroundColor: "#E7E7E7",
                        borderTop: "1px solid lightgrey",
                        boxSizing: "borderBox"}}>
                        <div style={{
                            padding: "10px 10px 0px 25px",
                            border: "0px solid green",
                            boxSizing: "borderBox",          
                            fontWeight: 600}}>
                            Event URL
                        </div>
                    </div>
                    <div style={{
                        height: "55px",
                        fontSize: "16px",
                        padding: "5px 10px 10px 25px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7"}}>
                        <input style={{
                            padding: "9px 10px",
                            border: "1px solid lightgrey",
                            boxSizing: "borderBox",
                            height: "40px",
                            lineHeight: "1.75",
                            fontSize: "16px",
                            width: "400px"}}
                            type="text"
                            id="input box ticket description"
                            placeholder="your event's website address"
                            value={eventDescription.eventUrl}
                            onChange={event => {changeEventUrl(event)}}
                        >
                        </input>
                    </div>

                    <div style={{
                        height: "30px",
                        fontSize: "15px",
                        backgroundColor: "#E7E7E7",
                        borderTop: "1px solid lightgrey",
                        boxSizing: "borderBox"}}>
                        <div style={{
                            padding: "10px 10px 0px 25px",
                            border: "0px solid green",
                            boxSizing: "borderBox",          
                            fontWeight: 600}}>
                            OpenSeatDirect Vanity URL
                        </div>
                    </div>
                    <div style={{
                        display: `grid`,
                        gridTemplateColumns: "220px 300px",
                        height: "55px",
                        fontSize: "16px",
                        padding: "5px 10px 10px 35px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7"}}>
                        <div style={{
                            padding: "11px 5px 0px 0px",
                            textAlign: "right"}}>
                            www.openseatdirect.com/et/{" "}
                        </div>
                        <input style={{
                            padding: "9px 10px",
                            border: "1px solid lightgrey",
                            boxSizing: "borderBox",
                            height: "40px",
                            lineHeight: "1.75",
                            fontSize: "16px",
                            width: "400px"}}
                            type="text"
                            id="input box ticket description"
                            placeholder="vanity address for Event Description page url"
                            value={eventDescription.vanityUrl}
                            onChange={event => {changeVanityUrl(event)}}
                        >
                        </input>
                    </div>
                </div>

                <br></br>
                <div style={{
                    margin: "10px 0px 0px 0px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    paddingTop: "10px",
                    boxSizing: "borderBox",
                    fontSize: "20px",
                    fontWeight: "600",
                    height: "40px",
                    width: "160px",
                    backgroundColor: "black",
                    color: "white"}}>
                    Ticket Creation
                </div>
                <div style={{border: "1px solid grey"}}>
                    <div style={{
                        display: `grid`,
                        gridTemplateColumns: "360px 150px 225px 160px",
                        height: "40px",
                        fontSize: "15px",
                        backgroundColor: "#E7E7E7",
                        boxSizing: "borderBox"}}>

                        <div style={{
                            padding: "10px 10px 10px 25px",
                            border: "0px solid green",
                            boxSizing: "borderBox",                   
                            fontWeight: 600}}>
                            Ticket Name
                        </div>

                        <div style={{
                            padding: "10px 10px 10px 5px",
                            border: "0px solid green",
                            boxSizing: "borderBox",                   
                            fontWeight: 600}}>
                            Quantity
                        </div>

                        <div style={{
                            padding: "10px 10px 10px 10px",
                            border: "0px solid green",
                            boxSizing: "borderBox",
                            fontWeight: 600}}>
                            Price
                        </div>

                        <div style={{
                            padding: "10px 5px 10px 5px",
                            border: "0px solid green",
                            boxSizing: "borderBox",
                            fontWeight: 600}}>
                            Settings
                        </div>

                    </div>
                    {ticketTypeDisplay()}

                    <div style={{
                        padding: "10px 5px 10px 5px",
                        borderTop: "1px solid lightgrey",
                        boxSizing: "borderBox",
                        height: "56px",
                        textAlign: "center",
                        fontWeight: 600}}>
                        <Button
                            content="Add a ticket"
                            icon="add circle"
                            color="green"
                            onClick={createNewTicketHandler}
                        />

                    </div>
                </div>

            
                <br></br>
                <div style={{
                    margin: "10px 0px 0px 0px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    paddingTop: "10px",
                    boxSizing: "borderBox",
                    fontSize: "20px",
                    fontWeight: "600",
                    height: "40px",
                    width: "195px",
                    backgroundColor: "black",
                    color: "white"}}>
                    Additional Settings
                </div>

                <div style={{border: "1px solid grey"}}>
                    <div style={{
                        height: "35px",
                        fontSize: "15px",
                        backgroundColor: "#E7E7E7",
                        boxSizing: "borderBox"}}>

                        <div style={{
                            padding: "10px 10px 0px 25px",
                            boxSizing: "borderBox",                   
                            fontWeight: 600}}>
                            Refund policy: please select one
                        </div>
                    </div>
                    
                    <Form style={{padding: "0px 0px 0px 35px", fontSize: "16px", backgroundColor: "#E7E7E7"}}>
                        <Form.Field style={{height: "30px", padding: "5px", margin: "0px"}}>
                            <Radio style={{fontSize: "16px"}}
                                label='1 day: Attendees can receive refunds up to 1 day before your event start date.'
                                name='refundGroup'
                                value='1day'
                                checked={eventDescription.refundPolicy === '1day'}
                                onChange={ (event, { value }) => refundPolicyChange(event, { value })}
                            />
                        </Form.Field>
                        <Form.Field style={{height: "30px", padding: "5px", margin: "0px"}}>
                            <Radio style={{fontSize: "16px"}}
                                label='7 days: Attendees can receive refunds up to 7 days before your event start date.'
                                name='refundGroup'
                                value='7days'
                                checked={eventDescription.refundPolicy === '7days'}
                                onChange={ (event, { value }) => refundPolicyChange(event, { value })}
                            />
                        </Form.Field>
                        <Form.Field style={{height: "30px", padding: "5px", margin: "0px"}}>
                            <Radio style={{fontSize: "16px"}}
                                label='30 days: Attendees can receive refunds up to 30 days before your event start date.'
                                name='refundGroup'
                                value='30days'
                                checked={eventDescription.refundPolicy === '30days'}
                                onChange={ (event, { value }) => refundPolicyChange(event, { value })}
                            />
                        </Form.Field>
                        <Form.Field style={{height: "30px", padding: "5px", margin: "0px"}}>
                            <Radio style={{fontSize: "16px"}}
                                label='Undefined: I will respond to attendee refund requests on a case by case basis.'
                                name='refundGroup'
                                value='case'
                                checked={eventDescription.refundPolicy === 'case'}
                                onChange={ (event, { value }) => refundPolicyChange(event, { value })}
                            />
                        </Form.Field>
                        <Form.Field style={{height: "30px", padding: "5px", margin: "0px"}}>
                            <Radio style={{fontSize: "16px"}}
                                label='No refunds: No refunds at any time.'
                                name='refundGroup'
                                value='none'
                                checked={eventDescription.refundPolicy === 'none'}
                                onChange={ (event, { value }) => refundPolicyChange(event, { value })}
                            
                        />
                        </Form.Field>
                    </Form>

                    <div style={{
                        height: "35px",
                        fontSize: "15px",
                        backgroundColor: "#E7E7E7",
                        borderTop: "1px solid lightgrey",
                        boxSizing: "borderBox"}}>

                        <div style={{
                            padding: "10px 10px 0px 25px",
                            border: "0px solid green",
                            boxSizing: "borderBox",                   
                            fontWeight: 600}}>
                            Ticket delivery: please select one
                        </div>
                    </div>
                    
                    <Form style={{padding: "0px 0px 0px 35px", fontSize: "16px", backgroundColor: "#E7E7E7"}}>
                        <Form.Field style={{height: "30px", padding: "5px", margin: "0px"}}>
                            <Radio style={{fontSize: "16px"}}
                                label='Print-at-home paper ticket to be emailed'
                                name='ticketGroup'
                                value='print'
                                checked={eventDescription.ticketDelivery === 'print'}
                                onChange={ (event, { value }) => ticketDeliveryChange(event, { value })}
                            />
                        </Form.Field>
                        <Form.Field style={{height: "30px", padding: "5px", margin: "0px"}}>
                            <Radio style={{fontSize: "16px"}}
                                label='Mobile only'
                                name='ticketGroup'
                                value='mobile'
                                checked={eventDescription.ticketDelivery === 'mobile'}
                                onChange={ (event, { value }) => ticketDeliveryChange(event, { value })}
                            />
                        </Form.Field>
                    </Form>

                </div>
            </div>
        </div>
    )
}

export default EventCreation;
