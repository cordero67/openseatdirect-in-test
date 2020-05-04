import React, { useState } from "react";

import ReactHtmlParser from 'react-html-parser';

import { Editor } from '@tinymce/tinymce-react';
import DateSelector from './DateSelector';
import TimeSelector from './TimeSelector';
import TimeZoneSelector from './TimeZoneSelector';
import CountrySelector from './CountrySelector';
import CurrencySelector from './CurrencySelector';
import CategorySelector from "./CategorySelector";
import RadioForm from './RadioForm';
import ImgDropAndCrop from '../ImgDropAndCrop/ImgDropAndCrop'

import classes from './EventCreation.module.css';
import Aux from "../hoc/Auxiliary/Auxiliary";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faTrashAlt, faGripVertical, faCog } from "@fortawesome/free-solid-svg-icons";
import { Button, Popup } from 'semantic-ui-react';
import { faFacebook, faInstagram, faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";

const EventCreation = () => {

    const [textEditor, setTextEditor] = useState("");

    const handleEditorChange = (editorContent) => {
        setTextEditor(editorContent);
    };

    // stores all Event Description variables
    const [eventDescription, setEventDescription] = useState({
        eventTitle: "",
        eventType: "live",
        onlineInfo: "",
        liveInfo: "",
        location: {
            venue: "",
            address1: "",
            address2: "",
            additional: "",
            city: "",
            state: "",
            postalCode: "",
            country: ""
        },
        startDate: (new Date(new Date().toDateString())),
        startTime: "",
        startDateTime: "",
        endDate: (new Date(new Date().toDateString())),
        endTime: "",
        endDateTime: "",
        timeZone: '',
        eventImage: "",
        shortDescription: "",
        longDescription: "",
        eventCategory: "",
        facebookUrl: "",
        twitterUrl: "",
        linkedinUrl: "",
        instagramUrl: "",
        eventUrl: "",
        vanityUrl: "",
        refundPolicy: "none",
        ticketDelivery: "print"
    });

    // stores all Ticket Details variables
    const [ticketDetails, setTicketDetails] = useState([{
        key: "1",
        ticketName: "",
        ticketQuantity: "",
        ticketPrice: "",
        currency: "",
        settings: false,
        ticketDescription: "",
        orderMin: "",
        orderMax: "",
        ticketsRemaining: "never",
        priceFeature: "none",
        promoCodes: [{key: "1", name: "", amount: "", percent: ""}],
        promoCodeNames: [],
        promoCodeWarning: "",
        functionArgs: {},
    }]);

    // EVENT DESCRIPTION HANDLERS
    const changeEventDescription = (event) => {
        let tempInfo = {...eventDescription};
        tempInfo[event.target.name] = event.target.value;
        if (event.target.name === "eventTitle") {
            tempInfo.vanityUrl = event.target.value
                .replace(/\s+/g, '-')
                .replace(/[^a-zA-Z0-9-]/g, "")
                .toLowerCase();
        }
        setEventDescription(tempInfo);
        console.log("Event Description: ", tempInfo)
    }

    const changeEventDescriptionRadio = (event, value, name) => {
        let tempDescription = {...eventDescription};
        tempDescription[name] = value.value;
        setEventDescription(tempDescription);
        console.log("Event Description: ", tempDescription)
    }

    // TICKET DETAILS HANDLERS
    const ticketsRemainingChange = (event, value, key) => {
        let tempDetails = [...ticketDetails];
        tempDetails.forEach( item => {
            if (item.key === key) {
                item.ticketsRemaining = value.value;
            }
        })
        setTicketDetails(tempDetails);
        console.log("Ticket Details: ", ticketDetails)
    }

    const changeTicketDetail = (event, id) => {
        let tempTicketDetails = [...ticketDetails];
        tempTicketDetails.forEach( item => {
            if (item.key === id) {
                item[event.target.name] = event.target.value;
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
    
    const changeArgument = (event, key) => {
        let tempDetails = [...ticketDetails];
        tempDetails.forEach( item => {
            if (item.key === key) {
                item.functionArgs[event.target.name] = event.target.value;
            }
        })
        setTicketDetails(tempDetails);
        console.log("Ticket Details: ", tempDetails)
    }

    // STOPPED
    const priceFeatureChangeHandler = (event, value, key) => {
      let tempDetails = [...ticketDetails];
        tempDetails.forEach( item => {
            if (item.key === key) {
                item.priceFeature = value;
                item.promoCodes = [{key: "1", name: "", amount: "", percent: ""}];
                item.promoCodeNames = [];
                item.promoCodeWarning = "";
                item.functionArgs = {};
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
            currency: "",
            settings: false,
            ticketDescription: "",
            orderMin: "",
            orderMax: "",
            ticketsRemaining: "never",
            priceFeature: "none",
            promoCodes: [{key: newPromoKey, name: "", amount: "", percent: ""}],
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
                    ticketsRemaining: "never",
                    priceFeature: "none",
                    promoCodes: [{key: "1", name: "", amount: "", percent: ""}],
                    promoCodeNames: [],
                    promoCodeWarning: "",
                    functionArgs: {}
                }
            ])
        } else {
            let tempTicketDetails = [...ticketDetails];
            tempTicketDetails.forEach( (item, index) => {
                if (item.key === id) {
                    //let removed = tempTicketDetails.splice(index,1);
                    tempTicketDetails.splice(index,1);
                }
            })
            setTicketDetails(tempTicketDetails);
            console.log("Ticket Details: ", tempTicketDetails)
        }
    }

    const deletePromoCode = (event, ticket, promoKey) => {
        if (ticket.promoCodes.length === 1) {
            // delete all promoCode info and set back to default in this specific ticket
            console.log("Only one promo code, therefore set to default");

            let tempTicketDetails = [...ticketDetails];
            tempTicketDetails.forEach( (item, index) => {
                if (item.key === ticket.key) {
                    console.log("ticket match at position ", index);
                    console.log("these are the promo codes in this ticket: ", item.promoCodes);
                    item.promoCodes = [{key: "1", name: "", amount: "", percent: ""}];
                    console.log("new promo codes in this ticket: ", item.promoCodes);
                }
            setTicketDetails(tempTicketDetails);
            })
        } else {
            // delete specifc promoCode in this specific ticket
            console.log("More than one promo code, therefore delete this promo code");

            let tempTicketDetails = [...ticketDetails];
            tempTicketDetails.forEach( (item, index1) => {
                if (item.key === ticket.key) {
                    console.log("ticket match at position ", index1);
                    console.log("these are the promo codes in this ticket: ", item.promoCodes)
                    let tempCodes = [...item.promoCodes];
                    tempCodes.forEach( (code, index2) => {
                        if (code.key === promoKey) {
                            console.log("current promo match at position ", index2);
                            //let removed = tempCodes.splice(index2,1);
                            tempCodes.splice(index2,1);
                            console.log("updated promo match at position ", tempCodes);
                        }
                    item.promoCodes = tempCodes;
                    })
                    console.log("new promo codes in this ticket: ", item.promoCodes);
                }
            })
            setTicketDetails(tempTicketDetails);
        }
    }

    const switchPriceFeature = (event, key) => {
        let tempDetails = [...ticketDetails];
        tempDetails.forEach( item => {
            if (item.key === key) {
                item.priceFeature = "none";
                item.promoCodes = [{key: "", name: "", amount: "", percent: ""}];
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
                let newPromo = {key: newPromoKey, name: "", amount: "", percent: ""};
                item.promoCodes.push(newPromo);
            }
        })
        setTicketDetails(tempDetails);
        console.log("Ticket Details: ", tempDetails)
    }

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

    const changePromoCodesPercent = (event, ticketKey, promoKey) => {
        let tempDetails = [...ticketDetails];
        tempDetails.forEach( item => {
            console.log("Inside changePromoCodesPercent");
            if (item.key === ticketKey) {
                let tempCodes = [...item.promoCodes]
                tempCodes.forEach( code => {
                    if( code.key === promoKey) {
                        code.amount = "";
                        code.percent = event.target.value;
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
                        code.percent = "";
                        code.amount = event.target.value;
                    }
                })
                item.promoCodes = tempCodes;
            }
        })
        setTicketDetails(tempDetails);
        console.log("Ticket Details: ", tempDetails)
    }

    const changeTime = (event, type) => {
        let tempInfo = {...eventDescription};
        console.log("inside changeTime")
        if (type === "start") {
            tempInfo.startTime = event.target.value;
            console.log("startTime: ", tempInfo.startTime)
            console.log("startDate: ", tempInfo.startDate)
            console.log("start date with time: ", (new Date(tempInfo.startDate.getTime() + parseInt(tempInfo.startTime))));
        } else if (type === "end") {
            tempInfo.endTime = event.target.value;
            console.log("endTime: ", tempInfo.endTime)
            console.log("endDate: ", tempInfo.endDate)
            console.log("start date with time: ", (new Date(tempInfo.endDate.getTime() + parseInt(tempInfo.endTime))));
        }
        setEventDescription(tempInfo);
    }

    const changeTimeZone = (value) => {
        let tempInfo = {...eventDescription};
        tempInfo.timeZone = value;
        setEventDescription(tempInfo);
    }

    const changeEventCategory = (event) => {
        let tempInfo = {...eventDescription};
        tempInfo.eventCategory = event.target.value;
        setEventDescription(tempInfo);
    }

    const changeLongDescription = (event) => {
        let tempInfo = {...eventDescription};
        tempInfo.longDescription = event.target.value;
        setEventDescription(tempInfo);
    }

    const changeCurrency = (event, id) => {
        let tempTicketDetails = [...ticketDetails];
        tempTicketDetails.forEach( item => {
            if (item.key === id) {
                item.currency = event.target.value;
            }
        })
        setTicketDetails(tempTicketDetails);
        console.log("Ticket Details: ", ticketDetails);
    }

    const promoCodesDisplay = (ticket) => {
        let display = (
            <div>
                {ticket.promoCodes.map( (item, index) => {
                    let finalPrice = "";
                    if (item.amount !== "" && item.percent === "") {
                        finalPrice = (ticket.ticketPrice - item.amount).toFixed(2);
                    } else if (item.percent !== "" && item.amount === "") {
                        finalPrice = (ticket.ticketPrice * (1 - item.percent/100)).toFixed(2);
                    }

                    return (
                        <Aux key={index}>
                            <div style={{
                                display: `grid`,
                                gridTemplateColumns: "180px 165px 30px 115px 180px 25px",
                                padding: "0px 10px 0px 35px",
                                boxSizing: "borderBox",
                                backgroundColor: "#E7E7E7", 
                                height: "50px",
                                fontSize: "16px"}}>
                                <div style={{
                                    padding: "0px 0px 0px 0px",
                                    textAlign: "left"
                                }}>
                                    <input style={{
                                        padding: "9px 10px",
                                        border: "1px solid lightgrey",
                                        boxSizing: "borderBox",
                                        textAlign: "left",
                                        width: "150px",
                                        height: "40px"}}
                                        type="text"
                                        id="promoName"
                                        placeholder="unique name"
                                        value={item.name}
                                        onChange={event => {changePromoCodesName(event, ticket.key, item.key)}}
                                    >
                                    </input>
                                </div>

                                <div style={{
                                    margin: "0px 10px 20px 0px",
                                    border: "1px solid lightgrey",
                                    boxSizing: "borderBox",
                                    backgroundColor: "white",
                                    display: `grid`,
                                    gridTemplateColumns: "70px 80px"}}>
                                    <div style={{
                                        padding: "9px 0px 9px 0px",
                                        textAlign: "center",
                                        boxSizing: "borderBox"}}>
                                    {ticket.currency === "" ? "USD $" : ticket.currency}
                                    </div>
                                    <input style={{
                                        padding: "9px 5px 9px 0px",
                                        textAlign: "right",
                                        border: "0px solid lightgrey",
                                        boxSizing: "borderBox"}}
                                        type="text"
                                        id="promoAmount"
                                        placeholder=""
                                        value={item.amount}
                                        onChange={event => {changePromoCodesAmount(event, ticket.key, item.key)}}
                                    >
                                    </input>
                                </div>

                                <div style={{paddingTop: "10px"}}>OR</div>

                                <div style={{
                                    margin: "0px 10px 20px 0px",
                                    border: "1px solid lightgrey",
                                    boxSizing: "borderBox",
                                    backgroundColor: "white",
                                    display: `grid`,
                                    width: "90px",
                                    gridTemplateColumns: "55px 30px"}}>
                                    <input style={{
                                        padding: "9px 5px 9px 0px",
                                        textAlign: "right",
                                        border: "0px solid lightgrey",
                                        boxSizing: "borderBox"}}
                                        type="text"
                                        id="promoPercent"
                                        placeholder=""
                                        value={item.percent}
                                        onChange={event => {changePromoCodesPercent(event, ticket.key, item.key)}}
                                    >
                                    </input>
                                    <div style={{
                                        padding: "9px 0px 9px 0px",
                                        textAlign: "center",
                                        boxSizing: "borderBox"}}>%
                                    </div>
                                </div>

                                <div style={{
                                    padding: "10px 10px 0px 0px",
                                    textAlign: "center"
                                }}>{finalPrice}
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
                            boxSizing: "borderBox",                   
                            fontWeight: 600}}>
                            Promotional Pricing (<span style={{fontStyle: "italic"}}>optional </span>): please select one
                        </div>
                    </div>
                    <div style={{
                        padding: "5px 10px 0px 30px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7",
                        height: "30px"}}>
                        <button className={classes.PriceFeatureButton}
                        onClick={event => priceFeatureChangeHandler(event, "promo", ticket.key)}>Promo Code(s)</button>
                    </div>
                    <div style={{
                        padding: "5px 10px 0px 30px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7",
                        height: "30px"}}>
                        <button className={classes.PriceFeatureButton}
                        onClick={event => priceFeatureChangeHandler(event, "bogof", ticket.key)}>Buy One Get One Free</button>
                    </div>
                    <div style={{
                        padding: "5px 10px 0px 30px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7",
                        height: "30px"}}>
                        <button className={classes.PriceFeatureButton}
                        onClick={event => priceFeatureChangeHandler(event, "bogod", ticket.key)}>Buy One Get One at a Discount</button>
                    </div>
                    <div style={{
                        padding: "5px 10px 0px 30px",
                        boxSizing: "borderBox",
                        backgroundColor: "#E7E7E7",
                        height: "30px"}}>
                        <button className={classes.PriceFeatureButton}
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
                            Promo Codes Price Feature{" "}
                            <Popup 
                                position="right center"
                                content="Additional information"
                                header="Promo Codes"
                                trigger={<FontAwesomeIcon
                                    color = "blue"
                                    cursor = "pointer"
                                    icon={faInfoCircle}/>} />
                        </div>
                    </div>

                    <div style={{
                        display: `grid`,
                        gridTemplateColumns: "180px 310px 180px",
                        padding: "5px 10px 5px 35px",
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
                            Discount Amount
                        </div>
                        <div style={{
                            boxSizing: "borderBox",
                            fontWeight: 400}}>
                            Final Discounted Price
                        </div>
                    </div>

                    {promoCodesDisplay(ticket)}

                    <div style={{
                        display: `grid`,
                        gridTemplateColumns: "250px 250px",
                        padding: "5px 10px 5px 35px",
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
                        <button className={classes.FeatureButton} style={{padding: "0px", textAlign: "left"}}

                        onClick={event => switchPriceFeature(event, ticket.key)}>Select different promotion</button>
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
                                id="functionArgBuyBogof"
                                placeholder="# of tickets"
                                name="buy"
                                value={ticket.functionArgs.buy}
                                onChange={event => {changeArgument(event, ticket.key)}}
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
                                id="functionArgGetBogof"
                                placeholder="# of tickets"
                                name="get"
                                value={ticket.functionArgs.get}
                                onChange={event => {changeArgument(event, ticket.key)}}
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
                        <button className={classes.FeatureButton}
                        onClick={event => switchPriceFeature(event, ticket.key)}>Select different promotion</button>
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
                                id="functionArgBuyBogod"
                                placeholder="# of tickets"
                                name="buy"
                                value={ticket.functionArgs.buy}
                                onChange={event => {changeArgument(event, ticket.key)}}
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
                                id="functionArgGetBogod"
                                placeholder="# of tickets"
                                name="get"
                                value={ticket.functionArgs.get}
                                onChange={event => {changeArgument(event, ticket.key)}}
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
                                id="functionArgDiscountBogod"
                                placeholder="percentage"
                                name="discount"
                                value={ticket.functionArgs.discount}
                                onChange={event => {changeArgument(event, ticket.key)}}
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
                        <button className={classes.FeatureButton}
                        onClick={event => switchPriceFeature(event, ticket.key)}>Select different promotion</button>
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
                                id="functionArgBuy2fer"
                                placeholder="# of tickets"
                                name="buy"
                                value={ticket.functionArgs.buy}
                                onChange={event => {changeArgument(event, ticket.key)}}
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
                                id="functionArgFor2fer"
                                placeholder="# of tickets"
                                name="for"
                                value={ticket.functionArgs.for}
                                onChange={event => {changeArgument(event, ticket.key)}}
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
                        <button className={classes.FeatureButton}
                        onClick={event => switchPriceFeature(event, ticket.key)}>Select different promotion</button>
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
                    boxSizing: "borderBox"}}>

                    <div style={{
                        padding: "10px 10px 0px 25px",
                        boxSizing: "borderBox",          
                        fontWeight: 600}}>
                        Currency
                    </div>
                </div>


                <div className={classes.InputBox}>
                    <CurrencySelector
                    value={ticket.currency === "" ? "default" : ticket.currency}
                    change={event => {
                        changeCurrency(event, ticket.key);
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
                        id="ticketDescription"
                        placeholder="Brief description of ticket and what it includes: limit 1000 characters"
                        name="ticketDescription"
                        value={ticket.ticketDescription}
                        onChange={event => {changeTicketDetail(event, ticket.key)}}
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
                        Tickets Allowed per Order
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
                            id="orderMin"
                            placeholder="# of tickets"
                            name="orderMin"
                            value={ticket.orderMin}
                            onChange={event => {changeTicketDetail(event, ticket.key)}}
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
                            id="orderMax"
                            placeholder="# of tickets"
                            name="orderMax"
                            value={ticket.orderMax}
                            onChange={event => {changeTicketDetail(event, ticket.key)}}
                        >
                        </input>
                        {" "}ticket(s)
                    </div>
                </div>

                <div className={classes.SectionTitle}>Tickets Remaining Display</div>
                <RadioForm
                    details={ticketsRemaining}
                    group='eventTypeGroup'
                    current={ticket.ticketsRemaining}
                    change={(event, value) => ticketsRemainingChange(event, value, ticket.key)}
                />

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
                    >^ Minimize features</button>
                </div>
            </div>
        )
    }
    
    const ticketTypeDisplay = () => {
        let display = (
            <div>
                {ticketDetails.map( (item, index) => {
                    
                    return (
                        <div key={index}>
                            <div style={{
                                display: `grid`,
                                gridTemplateColumns: "360px 100px 165px 80px 80px",
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
                                        id="ticketName"
                                        placeholder="GA, VIP, etc: limit 32 characters"
                                        name="ticketName"
                                        value={item.ticketName}
                                        onChange={event => {changeTicketDetail(event, item.key)}}
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
                                        width: "90px",
                                        height: "40px"}}
                                        type="text"
                                        id="ticketQuantity"
                                        placeholder="100"
                                        name="ticketQuantity"
                                        value={item.ticketQuantity}
                                        onChange={event => {changeTicketDetail(event, item.key)}}
                                    >
                                    </input>
                                </div>

                                <div style={{
                                    margin: "10px 5px",
                                    border: "1px solid lightgrey",
                                    boxSizing: "borderBox",
                                    display: `grid`,
                                    gridTemplateColumns: "70px 80px"}}>
                                    <div style={{
                                        padding: "9px 0px 9px 0px",
                                        textAlign: "center",
                                        boxSizing: "borderBox"}}>
                                    {item.currency === "" ? "USD $" : item.currency}
                                    </div>
                                    <input style={{
                                        padding: "9px 5px 9px 0px",
                                        textAlign: "right",
                                        border: "0px solid lightgrey",
                                        boxSizing: "borderBox"}}
                                        type="text"
                                        id="ticketPice"
                                        placeholder="10.00"
                                        name="ticketPrice"
                                        value={item.ticketPrice}
                                        onChange={event => {changeTicketDetail(event, item.key)}}
                                    >
                                    </input>
                                </div>

                                <div style={{
                                    padding: "20px 5px",
                                    boxSizing: "borderBox",
                                    textAlign: "center"}}>
                                        <FontAwesomeIcon
                                            color = "blue"
                                            cursor = "pointer"
                                            onClick={event => switchTicketSettings(event, item.key)}
                                            icon={faCog}/>
                                </div>

                                <div style={{
                                    padding: "20px 5px",
                                    boxSizing: "borderBox",
                                    textAlign: "center"}}>
                                        <FontAwesomeIcon
                                            color = "blue"
                                            cursor = "pointer"
                                            onClick={event => deleteTicket(event, item.key)}
                                            icon={faTrashAlt}/>
                                </div>
                                
                            </div>
                            {item.settings ? additionalSettings(item) : null}
                        </div>
                    )
                })}
            </div>
        );
        return display;
    }

    const changeEventDate = (day, fieldName) => {
        let tempDescription = {...eventDescription};
        // removes the time from the Date object
        let tempDate = (new Date(day.toDateString()));
        //console.log("day: ", day)
        if(fieldName === "start") {
            //console.log("Start Date Change Info")
            tempDescription.startDate = tempDate;
            //let newDate = new Date(tempDescription.startDate);
            //console.log(newDate);
            console.log("start date: ", tempDescription.startDate)
            if (tempDescription.startDate > tempDescription.endDate) {
                tempDescription.endDate = tempDate;
                console.log("end date: ", tempDescription.endDate)
            }
        } else if (fieldName === "end") {
            //console.log("End Date Change Info")
            tempDescription.endDate = tempDate;
            //let newDate = new Date(tempDescription.startDate);
            //console.log(newDate);
            console.log("end date: ", tempDescription.endDate)
        }
        setEventDescription(tempDescription);
        console.log("tempDescription: ",tempDescription)
    }

    const [eventTitleWarning, setEventTitleWarning] = useState(false);
    const [shortDescriptionWarning, setShortDescriptionWarning] = useState(false);
    const [eventLocationWarning, setEventLocationWarning] = useState(false);
    const [eventAddress1Warning, setEventAddress1Warning] = useState(false);
    const [eventAddress2Warning, setEventAddress2Warning] = useState(false);
    const [eventAdditionalWarning, setEventAdditionalWarning] = useState(false);

    const displayMessage = (limit, variable) => {
        if (variable.length >= limit) {
            return (
                <div style={{paddingLeft: "10px", height: "14px", color: "red", fontSize: "12px", fontWeight: "700"}}>
                    Maximum characters used
                </div>
            )
        } else if (variable.length >= (limit - 10)) {
            return (
                <div style={{paddingLeft: "10px", height: "14px", color: "red", fontSize: "12px"}}>
                    Remaining {limit - variable.length}
                </div>
            )
        } else {
            return (
                <div style={{paddingLeft: "10px", height: "14px", color: "black", fontSize: "12px"}}>
                    Remaining {limit - variable.length}
                </div>
            )
        }
    }

    const eventTypeList = [
        {label: 'Live Event only', value:'live'},
        {label: 'Online Event only', value:'online'},
        {label: 'Both Live and Online Event', value:'both'}
    ]

    const ticketsRemaining = [
        {label: 'Never show number of tickets remaining', value:'never'},
        {label: 'Always show number of tickets remaining', value:'always'}
    ]

    const refundPolicyList = [
        {label: '1 day: Attendees can receive refunds up to 1 day before your event start date.', value:'1day'},
        {label: '7 days: Attendees can receive refunds up to 7 days before your event start date.', value:'7days'},
        {label: '30 days: Attendees can receive refunds up to 30 days before your event start date.', value:'30days'},
        {label: 'Undefined: I will respond to attendee refund requests on a case by case basis.', value:'case'},
        {label: 'No refunds: No refunds at any time.', value:'none'}
    ]

    const ticketDeliveryList = [
        {label: 'Print-at-home paper ticket to be emailed', value:'print'},
        {label: 'Mobile only', value:'mobile'}
    ]

    return (
        <div className={classes.MainContainer}>
            <div className={classes.MainGrid}>
                <div className={classes.GridTitle}>
                    <div
                        style={{paddingTop: "10px"}}>Event Creation</div>
                        <div className={classes.ButtonBox} >
                        <button
                            style={{
                                border: "2px solid green",
                                borderRadius: "4px",
                                color: "green",
                                backgroundColor: "white",
                                height: "30px",
                                width: "100px"}}
                        >Save</button>
                    </div>
                    <div className={classes.ButtonBox} >
                        <button
                            style={{
                                border: "2px solid blue",
                                borderRadius: "4px",
                                color: "blue",
                                backgroundColor: "white",
                                height: "30px",
                                width: "100px"}}
                        >Preview</button>
                    </div>
                    <div className={classes.ButtonBox} >
                        <button
                            style={{
                                border: "2px solid red",
                                borderRadius: "4px",
                                color: "red",
                                backgroundColor: "white",
                                height: "30px",
                                width: "100px"}}
                        >Go Live!!!</button>
                    </div>

                </div>


                    <div className={classes.CategoryTitle} style={{width: "140px"}}>Event Details</div>
                    <div style={{border: "1px solid grey"}}>
                        <div className={classes.SectionTitleTight}>Event Title</div>

                        <div className={classes.InputBox}>
                            <input className={classes.InputBoxContent} style={{width: "600px"}}
                                onFocus={() => setEventTitleWarning(true)}
                                onBlur={() => setEventTitleWarning(false)}
                                type="text"
                                id="eventTitle"
                                maxLength = "75"
                                placeholder="Short title of event: limit 75 characters"
                                name="eventTitle"
                                value={eventDescription.eventTitle}
                                onChange={event => {changeEventDescription(event)}}
                            >
                            </input>
                            {eventTitleWarning ? displayMessage(75, eventDescription.eventTitle) : null}
                        </div>

                        <div className={classes.SectionTitle}>Event Type: please select one</div>
                        <RadioForm
                            details={eventTypeList}
                            group='eventTypeGroup'
                            current={eventDescription.eventType}
                            change={(event, value) => changeEventDescriptionRadio(event, value, "eventType")}
                        />

                        {(eventDescription.eventType === "live" || eventDescription.eventType === "both") ?
                            <Aux>
                                <div className={classes.SectionTitleTight}>Event Location</div>

                                <div className={classes.InputBoxTight}>
                                    <input className={classes.InputBoxContent} style={{width: "600px"}}
                                        onFocus={() => setEventLocationWarning(true)}
                                        onBlur={() => setEventLocationWarning(false)}
                                        type="text"
                                        id="locationVenue"
                                        maxLength = "140"
                                        placeholder="Venue Name: limit 140 characters"
                                        value={eventDescription.location.venue}
                                        onChange={(event) => {
                                            let tempDescription = {...eventDescription};
                                            tempDescription.location.venue = event.target.value;
                                            setEventDescription(tempDescription)
                                        }}
                                    >
                                    </input>
                                    {eventLocationWarning ? displayMessage(140, eventDescription.location.venue) : null}
                                </div>

                                <div className={classes.InputBoxTight}>
                                    <input className={classes.InputBoxContent} style={{width: "600px"}}
                                        onFocus={() => setEventAddress1Warning(true)}
                                        onBlur={() => setEventAddress1Warning(false)}
                                        type="text"
                                        id="locationAddress1"
                                        maxLength = "32"
                                        placeholder="Address1: limit 32 characters"
                                        value={eventDescription.location.address1}
                                        onChange={(event) => {
                                            let tempDescription = {...eventDescription};
                                            tempDescription.location.address1 = event.target.value;
                                            setEventAddress1Warning(tempDescription)
                                        }}
                                    >
                                    </input>
                                    {eventAddress1Warning ? displayMessage(32, eventDescription.location.address1) : null}
                                </div>

                                <div className={classes.InputBoxTight}>
                                    <input className={classes.InputBoxContent} style={{width: "600px"}}
                                        onFocus={() => setEventAddress2Warning(true)}
                                        onBlur={() => setEventAddress2Warning(false)}
                                        type="text"
                                        id="locationAddress2"
                                        maxLength = "32"
                                        placeholder="Address2: limit 32 characters"
                                        value={eventDescription.location.address2}
                                        onChange={(event) => {
                                            let tempDescription = {...eventDescription};
                                            tempDescription.location.address2 = event.target.value;
                                            setEventAddress2Warning(tempDescription)
                                        }}
                                    >
                                    </input>
                                    {eventAddress2Warning ? displayMessage(32, eventDescription.location.address2) : null}
                                </div>

                                <div className={classes.InputBoxTight}>
                                    <input className={classes.InputBoxContent} style={{width: "600px"}}
                                        type="text"
                                        id="locationCity"
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

                                <div className={classes.InputBoxTight} style={{
                                    display: `grid`,
                                    gridTemplateColumns: "300px 300px"}}>
                                    <input className={classes.InputBoxContent} style={{width: "295px"}}
                                        type="text"
                                        id="locationState"
                                        placeholder="State/Province"
                                        value={eventDescription.location.state}
                                        onChange={(event) => {
                                            let tempDescription = {...eventDescription};
                                            tempDescription.location.state = event.target.value;
                                            setEventDescription(tempDescription)
                                        }}
                                    ></input>
                                
                                    <input className={classes.InputBoxContent} style={{width: "300px"}}
                                        type="text"
                                        id="locationPostalCode"
                                        placeholder="Zip/Postal"
                                        value={eventDescription.location.postalCode}
                                        onChange={(event) => {
                                            let tempDescription = {...eventDescription};
                                            tempDescription.location.postalCode = event.target.value;
                                            setEventDescription(tempDescription)
                                        }}
                                    ></input>
                                </div>

                                <div className={classes.InputBoxTight}>
                                    <CountrySelector
                                        className={classes.InputBoxContent} style={{width: "600px"}}
                                        getTimeZone={changeTimeZone}
                                        defaultValue=""
                                        onChange={(event) => {
                                            let tempDescription = {...eventDescription};
                                            tempDescription.location.country = event.target.value;
                                            setEventDescription(tempDescription);
                                            console.log("Country: ",event.target.value)
                                        }}
                                    />
                                </div>

                                <div className={classes.InputBox}>
                                    <input className={classes.InputBoxContent} style={{width: "600px"}}
                                        onFocus={() => setEventAdditionalWarning(true)}
                                        onBlur={() => setEventAdditionalWarning(false)}
                                        type="text"
                                        id="locationAddressAdditional"
                                        maxLength = "64"
                                        placeholder="Notes: 'e.g. Enter through backdoor' limit 64 characters"
                                        value={eventDescription.location.additional}
                                        onChange={(event) => {
                                            let tempDescription = {...eventDescription};
                                            tempDescription.location.additional = event.target.value;
                                            setEventAdditionalWarning(tempDescription)
                                        }}
                                    >
                                    </input>
                                    {eventAdditionalWarning ? displayMessage(64, eventDescription.location.additional) : null}
                                </div>
                            </Aux>
                        : null}



                        {(eventDescription.eventType === "online" || eventDescription.eventType === "both" ) ?
                            <Aux>
                                <div className={classes.SectionTitleTight}>Online Instructions</div>

                                <div className={classes.InputBox}>
                                    <input className={classes.InputBoxContent} style={{width: "600px"}}
                                        type="text"
                                        id="onlineInfo"
                                        placeholder="Please provide additional online inforamtion"
                                        value={eventDescription.onlineInfo}
                                        onChange={(event) => {
                                            let tempDescription = {...eventDescription};
                                            tempDescription.onlineInfo = event.target.value;
                                            setEventDescription(tempDescription)
                                        }}
                                    >
                                    </input>
                                </div>
                            </Aux>
                        : null}




                        <div className={classes.SectionTitle}>Event Dates and Time</div>
                        <div className={classes.DateTimeHeader}>
                            <div>Start Date</div>
                            <div>Start Time</div>
                            <div>End Date</div>
                            <div>End Time</div>
                            <div>Time Zone</div>
                        </div>

                        <div className={classes.DateTimeInputs}>
                            <DateSelector
                                type={"startDate"}
                                startDate={eventDescription.startDate}
                                current={eventDescription.startDate}
                                change={(date) => changeEventDate(date, "start")}
                                beforeDate={new Date()}
                            />
                            <TimeSelector
                                value={eventDescription.startTime}
                                change={(event) => changeTime(event, "start")}
                                startDate={eventDescription.startDate}
                                startTime={eventDescription.startTime}
                                endDate={eventDescription.endDate}
                            />
                            <DateSelector
                                type={"endDate"}
                                startDate={eventDescription.startDate}
                                current={eventDescription.endDate}
                                change={(date) => changeEventDate(date, "end")}
                                beforeDate={eventDescription.startDate}
                            />
                            <TimeSelector
                                value={eventDescription.startTime}
                                change={(event) => changeTime(event, "end")}
                                startDate={parseInt(eventDescription.startDate)}
                                startTime={parseInt(eventDescription.startTime)}
                                endDate={eventDescription.endDate}
                            />
                            <TimeZoneSelector
                                getTimeZone={changeTimeZone}
                                defaultValue="Eastern Time - New York"/>
                        </div>
                            
                        <div className={classes.SectionTitleTight}>Event Image{" "}
                            <Popup 
                                position="right center"
                                content="Additional information"
                                header="Event Image"
                                trigger={<FontAwesomeIcon
                                    color = "blue"
                                    cursor = "pointer"
                                    icon={faInfoCircle}/>} />
                        </div>

                        <div style={{
                            height: "227px",
                            fontSize: "16px",
                            padding: "5px 10px 10px 25px",
                            boxSizing: "borderBox",
                            backgroundColor: "#E7E7E7"}}>
                            <ImgDropAndCrop/>
                        </div>

                        <div className={classes.SectionTitleTight}>Event Short Description</div>
                        <div className={classes.TextBox}>
                            <textarea style={{
                                padding: "9px 10px",
                                border: "1px solid lightgrey",
                                boxSizing: "borderBox",
                                lineHeight: "1.75",
                                height: "80px",
                                width: "600px",
                                resize: "vertical"}}
                                onFocus={() => setShortDescriptionWarning(true)}
                                onBlur={() => setShortDescriptionWarning(false)}
                                type="text"
                                id="shortDescription"
                                maxLength = "140"
                                placeholder="Short description of event for social media posts: limit 140 characters"
                                name="shortDescription"
                                value={eventDescription.shortDescription}
                                onChange={event => {changeEventDescription(event)}}
                            >
                            </textarea>
                            {shortDescriptionWarning ? displayMessage(140, eventDescription.shortDescription) : null}
                        </div>

                        <div className={classes.SectionTitleTight}>Event Long Description</div>
                        <div style={{
                            padding: "5px 270px 10px 25px",
                            border: "0px solid green",
                            boxSizing: "borderBox",
                            height: "auto",
                            backgroundColor: "#E7E7E7"}}>
                                <Editor
                                    apiKey="ttpinnmm4af9xd288fuugwgjzwm9obqnitncxdeutyvvqhba"
                                    onEditorChange={handleEditorChange}
                                    plugins="wordcount autoresize"
                                    init={{
                                        toolbar: 'undo redo | fontsizeselect fontselect | bold italic underline | forecolor ',
                                        toolbar_items_size: 'small',
                                        autoresize_bottom_margin: 0,
                                        padding: "0 0 0 0",
                                        min_height: 250,
                                        max_height: 400,
                                        icons: "jam",
                                        skin: "fabric",
                                        resize: true,
                                        menubar: 'edit format'
                                    }}
                                />
                        </div>

                        <div className={classes.SectionTitleTight}>Event Category</div>
                        <div className={classes.InputBox} >
                            <CategorySelector
                                onChange={event => {
                                    changeEventCategory(event);
                                }}/>
                        </div>

                        <div className={classes.SectionTitleTight}>Social Media Links</div>
                        <div className={classes.SocialMediaLink} style={{height: "45px"}}>
                        <FontAwesomeIcon
                            className={classes.SocialMediaIcon}
                            style={{color: "#43609c"}}
                            icon={faFacebook}/>
                            <div className={classes.SocialMediaName}>facebook.com/{" "}</div>
                            <input className={classes.InputBoxContent} style={{width: "400px"}}
                                type="text"
                                id="facebookUrl"
                                placeholder="your facebook address"
                                name="facebookUrl"
                                value={eventDescription.facebookUrl}
                                onChange={event => {changeEventDescription(event)}}
                            >
                            </input>
                        </div>

                        <div className={classes.SocialMediaLink} style={{height: "45px"}}>
                            <FontAwesomeIcon
                                className={classes.SocialMediaIcon}
                                style={{color: "#0084b4"}}
                                icon={faTwitter}/>
                            <div className={classes.SocialMediaName}>twitter.com/{" "}</div>
                            <input className={classes.InputBoxContent} style={{width: "400px"}}
                                type="text"
                                id="twitterUrl"
                                placeholder="your twitter address"
                                name="twitterUrl"
                                value={eventDescription.twitterUrl}
                                onChange={event => {changeEventDescription(event)}}
                            >
                            </input>
                        </div>
                        
                        <div className={classes.SocialMediaLink} style={{height: "45px"}}>
                            <FontAwesomeIcon
                                className={classes.SocialMediaIcon}
                                style={{color: "#0e76a8"}}
                                icon={faLinkedin}/>
                            <div className={classes.SocialMediaName}>linkedin.com/{" "}</div>
                            <input className={classes.InputBoxContent} style={{width: "400px"}}
                                type="text"
                                id="linkedinUrl"
                                placeholder="your linkedin address"
                                name="linkedinUrl"
                                value={eventDescription.linkedinUrl}
                                onChange={event => {changeEventDescription(event)}}
                            >
                            </input>
                        </div>

                        <div className={classes.SocialMediaLink} style={{height: "55px"}}>
                            <FontAwesomeIcon
                                className={classes.SocialMediaIcon}
                                style={{color: "#8a3ab9"}}
                                icon={faInstagram}/>
                            <div className={classes.SocialMediaName}>instagram.com/{" "}</div>
                            <input className={classes.InputBoxContent} style={{width: "400px"}}
                                type="text"
                                id="instagramUrl"
                                placeholder="your instagram address"
                                name="instagramUrl"
                                value={eventDescription.instagramUrl}
                                onChange={event => {changeEventDescription(event)}}
                            >
                            </input>
                        </div>

                        <div className={classes.SectionTitleTight}>Event URL{" "}
                                <Popup 
                                    position="right center"
                                    content="Additional information"
                                    header="Event Url"
                                    trigger={<FontAwesomeIcon
                                        color = "blue"
                                        cursor = "pointer"
                                        icon={faInfoCircle}/>} />
                        </div>
                        <div className={classes.InputBox}>
                            <input className={classes.InputBoxContent} style={{width: "400px"}}
                                type="text"
                                id="eventUrl"
                                placeholder="your event's website address"
                                name="eventUrl"
                                value={eventDescription.eventUrl}
                                onChange={event => {changeEventDescription(event)}}
                            >
                            </input>
                        </div>

                        <div className={classes.SectionTitleTight}>Customize OpenSeatDirect Vanity URL</div>
                        <div style={{
                            display: `grid`,
                            gridTemplateColumns: "220px 300px",
                            height: "55px",
                            fontSize: "16px",
                            padding: "5px 10px 10px 35px",
                            boxSizing: "borderBox",
                            backgroundColor: "#E7E7E7"}}>
                            <div className={classes.SocialMediaName}>www.openseatdirect.com/et/{" "}</div>
                            <input className={classes.InputBoxContent} style={{width: "400px"}}
                                type="text"
                                id="vanityUrl"
                                placeholder="vanity address for Event Description page url"
                                name="vanityUrl"
                                value={eventDescription.vanityUrl}
                                onChange={event => {changeEventDescription(event)}}
                            >
                            </input>
                        </div>
                    </div>

                <br></br>
                <div className={classes.CategoryTitle} style={{width: "160px"}}>Ticket Creation</div>

                <div style={{border: "1px solid grey"}}>
                    <div style={{
                        display: `grid`,
                        gridTemplateColumns: "360px 100px 165px 80px",
                        height: "40px",
                        fontSize: "15px",
                        backgroundColor: "#E7E7E7",
                        boxSizing: "borderBox"}}>

                        <div style={{
                            padding: "10px 10px 10px 25px",
                            boxSizing: "borderBox",                   
                            fontWeight: 600}}>
                            Ticket Name
                        </div>

                        <div style={{
                            padding: "10px 10px 10px 5px",
                            boxSizing: "borderBox",                   
                            fontWeight: 600}}>
                            Quantity
                        </div>

                        <div style={{
                            padding: "10px 10px 10px 5px",
                            boxSizing: "borderBox",
                            fontWeight: 600}}>
                            Price
                        </div>

                        <div style={{
                            padding: "10px 10px 10px 5px",
                            boxSizing: "borderBox",
                            fontWeight: 600}}>
                            Features
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
                <div className={classes.CategoryTitle} style={{width: "195px"}}>Additional Settings</div>
                <div style={{border: "1px solid grey"}}>
                    <div className={classes.SectionTitle}>Refund Policy: please select one</div>
                    <RadioForm
                        details={refundPolicyList}
                        group='refundGroup'
                        current={eventDescription.refundPolicy}
                        change={(event, value) => changeEventDescriptionRadio(event, value, "refundPolicy")}

                    />
                    <div className={classes.SectionTitle}>Ticket delivery: please select one</div>
                    <RadioForm
                        details={ticketDeliveryList}
                        group='ticketGroup'
                        current={eventDescription.ticketDelivery}
                        change={(event, value) => changeEventDescriptionRadio(event, value, "ticketDelivery")}

                    />
                </div>
                <div style={{margin: "auto", textAlign: "center"}}>
                    <div className={classes.GridBottom}>
                        <div className={classes.ButtonBox} >
                            <button
                                style={{
                                    border: "2px solid green",
                                    borderRadius: "4px",
                                    color: "green",
                                    backgroundColor: "white",
                                    height: "30px",
                                    width: "100px"}}
                            >Save</button>
                        </div>
                        <div className={classes.ButtonBox} >
                            <button
                                style={{
                                    border: "2px solid blue",
                                    borderRadius: "4px",
                                    color: "blue",
                                    backgroundColor: "white",
                                    height: "30px",
                                    width: "100px"}}
                            >Preview</button>
                        </div>
                        <div className={classes.ButtonBox} >
                            <button
                                style={{
                                    border: "2px solid red",
                                    borderRadius: "4px",
                                    color: "red",
                                    backgroundColor: "white",
                                    height: "30px",
                                    width: "100px"}}
                            >Go Live!!!</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventCreation;
