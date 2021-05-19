import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faGripVertical, faCog } from "@fortawesome/free-solid-svg-icons";

import CurrencySelector from './CurrencySelector';
import RadioForm from './RadioForm';

import classes from './EventCreationOLD.module.css';

const TicketType = (props) => {

    //const additionalSettings = ticket => {
    //    props.additional(ticket);
    //    console.log("Want additional settings")
    //    console.log("ticket, ",ticket)
   // }

    const additionalSettings = (ticket) => {
        //console.log("Value: ", value)

        

    const ticketsRemaining = [
        {label: 'Never show number of tickets remaining', value:'never'},
        {label: 'Always show number of tickets remaining', value:'always'}
    ]
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
                        name="currency"
                    />
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
                />

                {/*priceFeatureSettings(ticket)*/}
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
                    >^ Minimize features</button>
                </div>
            </div>
        )
    }
    /*
                        <CurrencySelector
                    value={ticket.currency === "" ? "default" : ticket.currency}
                    name="currency"
                    change={event => {
                        changeTicketDetail(event, ticket.key);
                    }}/>

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

                <RadioForm
                    details={ticketsRemaining}
                    group='eventTypeGroup'
                    current={ticket.ticketsRemaining}
                    change={(event, value) => changeTicketsRemainingView(event, value, ticket.key)}
                />


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
                    */

    return (
        <div key={props.key}>
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
                        value={props.ticket.ticketName}
                        onChange={event => {props.change(event);
                            console.log("Quantity event: ", event.target.value)}}
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
                        value={props.ticket.ticketQuantity}
                        onChange={event => {props.change(event);
                            console.log("Quantity event: ", event.target.value)}}
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
                    {props.ticket.currency === "" ? "USD $" : props.ticket.currency}
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
                        value={props.ticket.ticketPrice}
                        onChange={event => {props.change(event)}}
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
                            onClick={event => {props.switch()}}
                            icon={faCog}/>
                </div>

                <div style={{
                    padding: "20px 5px",
                    boxSizing: "borderBox",
                    textAlign: "center"}}>
                        <FontAwesomeIcon
                            color = "blue"
                            cursor = "pointer"
                            onClick={event => {props.delete()}}
                            icon={faTrashAlt}/>
                </div>
            </div>
            {props.ticket.settings ? additionalSettings(props.ticket) : null}
        </div>
    );
}

export default TicketType;