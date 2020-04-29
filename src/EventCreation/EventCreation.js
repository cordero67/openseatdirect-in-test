import React, { useState } from "react";

import { Editor } from '@tinymce/tinymce-react';
import ReactHtmlParser from 'react-html-parser';

import DateSelector from './DateSelector';
import TimeSelector from './TimeSelector';
import TimeZoneSelector from './TimeZoneSelector';
import CountrySelector from './CountrySelector';
import CategorySelector from "./CategorySelector";
import RadioForm from './RadioForm';

import ImgDropAndCrop from '../ImgDropAndCrop/ImgDropAndCrop'

import classes from './EventCreation.module.css';
import Aux from "../hoc/Auxiliary/Auxiliary";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faTrashAlt, faGripVertical, faCog } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Radio } from 'semantic-ui-react';
import { faFacebook, faInstagram, faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";

const EventCreation = () => {

    const [textEditor, setTextEditor] = useState("");
        const handleEditorChange = (editorContent) => {
        setTextEditor(editorContent);
    };

    // stores all Event Description variables
    const [eventDescription, setEventDescription] = useState({
        eventTitle: "",
        eventType: "",
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
        startDate: new Date(),
        startTime: "",
        endDate: new Date(),
        endTime: "",
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
        settings: false,
        ticketDescription: "",
        orderMin: "",
        orderMax: "",
        priceFeature: "none",
        promoCodes: [{key: "1", name: "", amount: ""}],
        promoCodeNames: [],
        promoCodeWarning: "",
        functionArgs: {},
    }]);

    const eventTypeChange = (event, value) => {
        console.log("Changing event type to ", value);
        let tempDescription = {...eventDescription};
        tempDescription.eventType = value.value;
        console.log("Changing event type to ", tempDescription.eventType);
        setEventDescription(tempDescription);
        console.log("Event Description ", tempDescription);
    }

    const refundPolicyChange = (event, value) => {
        console.log("Changing refund policy to ", value);
        let tempDescription = {...eventDescription};
        tempDescription.refundPolicy = value.value;
        console.log("Changing refund policy to ", tempDescription.refundPolicy);
        setEventDescription(tempDescription);
        console.log("Event Description ", tempDescription);
    }

    const ticketDeliveryChange = (event, value) => {
        console.log("Changing ticket delivery to ", value);
        let tempDescription = {...eventDescription};
        tempDescription.ticketDelivery = value.value;
        console.log("Changing ticket delivery to ", tempDescription.ticketDelivery);
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
            // delete all promoCode info and set back to default in this specific ticket
            console.log("Only one promo code, therefore set to default");

            let tempTicketDetails = [...ticketDetails];
            tempTicketDetails.forEach( (item, index) => {
                if (item.key === ticket.key) {
                    console.log("ticket match at position ", index);
                    console.log("these are the promo codes in this ticket: ", item.promoCodes);
                    item.promoCodes = [{key: "1", name: "", amount: ""}];
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
                            let removed = tempCodes.splice(index2,1);
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
                console.log("New ticket settings: ", item.settings);
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

    const changePromoCodesName = (event, ticketKey, promoKey) => {
        let tempDetails = [...ticketDetails];
        tempDetails.forEach( item => {
            console.log("Inside changePromoCodesName");
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
            console.log("Inside changePromoCodesName");
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

    const changeStartTime = (event) => {
        let tempInfo = {...eventDescription};
        tempInfo.startTime = event.target.value;
        setEventDescription(tempInfo);
    }

    const changeEndTime = (event) => {
        let tempInfo = {...eventDescription};
        tempInfo.endTime = event.target.value;
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

    const changeEventDescription = (event) => {
        let tempInfo = {...eventDescription};
        tempInfo[event.target.name] = event.target.value;
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
                                gridTemplateColumns: "180px 140px 30px 155px 180px 25px",
                                padding: "0px 10px 0px 35px",
                                border: "0px solid green",
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
                                        id="input box order min1"
                                        placeholder="unique name"
                                        value={item.name}
                                        onChange={event => {changePromoCodesName(event, ticket.key, item.key)}}
                                    >
                                    </input>
                                </div>
                                <div style={{
                                    padding: "0px 0px 0px 0px",
                                    textAlign: "left"
                                }}>
                                    <input style={{
                                        padding: "9px 10px",
                                        border: "1px solid lightgrey",
                                        boxSizing: "borderBox",
                                        textAlign: "left",
                                        width: "130px",
                                        height: "40px"}}
                                        type="text"
                                        id="input box order max1"
                                        placeholder="10.00"
                                        value={item.amount}
                                        onChange={event => {changePromoCodesAmount(event, ticket.key, item.key)}}
                                    >
                                    </input>
                                </div>
                                <div style={{paddingTop: "10px"}}>OR</div>
                                <div style={{
                                    padding: "0px 0px 0px 0px",
                                    textAlign: "left"
                                }}>
                                    <input style={{
                                        padding: "9px 10px",
                                        border: "1px solid lightgrey",
                                        boxSizing: "borderBox",
                                        textAlign: "left",
                                        width: "130px",
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
                                    padding: "0px 0px 0px 0px",
                                    textAlign: "left"
                                }}>
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
                            Advanced Pricing Features (<span style={{fontStyle: "italic"}}>optional </span>): please select one
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
                            <FontAwesomeIcon
                                color = "blue"
                                cursor = "pointer"
                                icon={faInfoCircle}/>
                        </div>
                    </div>


                    <div style={{
                        display: `grid`,
                        gridTemplateColumns: "180px 325px 180px",
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
                        <button className={classes.FeatureButton}
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
                        <button className={classes.FeatureButton}
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
                        <button className={classes.FeatureButton}
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

    const changeStartDate = (day, fieldName) => {
        let tempDescription = {...eventDescription};//
        let today = new Date();

        tempDescription.startDate = day;
        if (tempDescription.startDate > tempDescription.endDate) {
            tempDescription.endDate = day;
        }
        setEventDescription(tempDescription);//
    }

    const changeEndDate = (day) => {
        let tempDescription = {...eventDescription};//

        tempDescription.endDate = day;
        setEventDescription(tempDescription);//
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
                <div className={classes.GridTitle}>Event Creation</div>
                    <div className={classes.CategoryTitle} style={{width: "140px"}}>Event Details</div>
                    <div style={{border: "1px solid grey"}}>
                        <div className={classes.SectionTitleTight}>Event Title</div>

                        <div className={classes.InputBox}>
                            <input className={classes.InputBoxContent} style={{width: "600px"}}
                                onFocus={() => setEventTitleWarning(true)}
                                onBlur={() => setEventTitleWarning(false)}
                                type="text"
                                id="input box ticket description"
                                maxlength = "75"
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
                            change={eventTypeChange}
                        />

                        {(eventDescription.eventType === "live" || eventDescription.eventType === "both") ?
                            <Aux>
                                <div className={classes.SectionTitleTight}>Event Location</div>

                                <div className={classes.InputBoxTight}>
                                    <input className={classes.InputBoxContent} style={{width: "600px"}}
                                        onFocus={() => setEventLocationWarning(true)}
                                        onBlur={() => setEventLocationWarning(false)}
                                        type="text"
                                        id="input box ticket description"
                                        maxlength = "140"
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
                                        id="input box ticket description"
                                        maxlength = "32"
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
                                        id="input box ticket description"
                                        maxlength = "32"
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
                                        onFocus={() => setEventAdditionalWarning(true)}
                                        onBlur={() => setEventAdditionalWarning(false)}
                                        type="text"
                                        id="input box ticket description"
                                        maxlength = "64"
                                        placeholder="Additional instructions: limit 64 characters"
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

                            <div className={classes.InputBoxTight}>
                                <input className={classes.InputBoxContent} style={{width: "600px"}}
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

                            <div className={classes.InputBoxTight} style={{
                                display: `grid`,
                                gridTemplateColumns: "300px 300px"}}>
                                <input className={classes.InputBoxContent} style={{width: "295px"}}
                                    type="text"
                                    id="input box ticket description"
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
                                    id="input box ticket description"
                                    placeholder="Zip/Postal"
                                    value={eventDescription.location.postalCode}
                                    onChange={(event) => {
                                        let tempDescription = {...eventDescription};
                                        tempDescription.location.postalCode = event.target.value;
                                        setEventDescription(tempDescription)
                                    }}
                                ></input>
                            </div>

                            <div className={classes.InputBox}>
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
                        </Aux>
                        : null}

                    {(eventDescription.eventType == "online" || eventDescription.eventType == "both" ) ?
                        <Aux>
                            <div className={classes.SectionTitleTight}>Online Instructions</div>

                            <div className={classes.InputBox}>
                                <input className={classes.InputBoxContent} style={{width: "600px"}}
                                    type="text"
                                    id="input box ticket description"
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
                                change={(date) => changeStartDate(date, "start")}
                                beforeDate={new Date()}
                            />
                            <TimeSelector
                                onChange={changeStartTime}
                                start={""}
                                end={""}
                            />
                            <DateSelector
                                type={"endDate"}
                                startDate={eventDescription.startDate}
                                current={eventDescription.endDate}
                                change={changeEndDate}
                                beforeDate={eventDescription.startDate}
                            />
                            <TimeSelector
                                onChange={changeEndTime}
                                start={""}
                                end={""}
                            />
                            <TimeZoneSelector
                                getTimeZone={changeTimeZone}
                                defaultValue="Eastern Time - New York"/>
                        </div>
                        
                        <div className={classes.SectionTitleTight}>Event Image{" "}
                            <FontAwesomeIcon
                                color = "blue"
                                cursor = "pointer"
                                icon={faInfoCircle}/>
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
                            id="input box ticket description"
                            maxlength = "140"
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
                            id="input box ticket description"
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
                            id="input box ticket description"
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
                            id="input box ticket description"
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
                            id="input box ticket description"
                            placeholder="your instagram address"
                            name="instagramUrl"
                            value={eventDescription.instagramUrl}
                            onChange={event => {changeEventDescription(event)}}
                        >
                        </input>
                    </div>

                    <div className={classes.SectionTitleTight}>Event URL{" "}
                        <span className={classes.InfoIcon}>
                            <FontAwesomeIcon
                                color = "blue"
                                cursor = "pointer"
                                icon={faInfoCircle}/>
                        </span>

                    </div>
                    <div className={classes.InputBox}>
                        <input className={classes.InputBoxContent} style={{width: "400px"}}
                            type="text"
                            id="input box ticket description"
                            placeholder="your event's website address"
                            name="eventUrl"
                            value={eventDescription.eventUrl}
                            onChange={event => {changeEventDescription(event)}}
                        >
                        </input>
                    </div>

                    <div className={classes.SectionTitleTight}>OpenSeatDirect Vanity URL</div>
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
                            id="input box ticket description"
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
                        gridTemplateColumns: "360px 150px 225px 160px",
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
                            padding: "10px 10px 10px 10px",
                            boxSizing: "borderBox",
                            fontWeight: 600}}>
                            Price
                        </div>

                        <div style={{
                            padding: "10px 10px 10px 5px",
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
                <div className={classes.CategoryTitle} style={{width: "195px"}}>Additional Settings</div>
                <div style={{border: "1px solid grey"}}>
                    <div className={classes.SectionTitle}>Refund Policy: please select one</div>
                    <RadioForm
                        details={refundPolicyList}
                        group='refundGroup'
                        current={eventDescription.refundPolicy}
                        change={refundPolicyChange}
                    />
                    <div className={classes.SectionTitle}>Ticket delivery: please select one</div>
                    <RadioForm
                        details={ticketDeliveryList}
                        group='ticketGroup'
                        current={eventDescription.ticketDelivery}
                        change={ticketDeliveryChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default EventCreation;
