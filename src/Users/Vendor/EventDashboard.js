import React, { useEffect, useState, Fragment } from "react";

import { API } from "../../config";
import EventsModal from "./Modals/EventsModal";
import OrderModal from "./Modals/OrderModal"; 

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import classes from "./EventDashboard.module.css";
import { Button } from "semantic-ui-react";

const EventDashboard = (props) => {

  const [selectedEventDetails, setSelectedEventDetails] = useState({});//

  const [eventsList, setEventsList] = useState([]);//

  const [ticketDetails, setTicketDetails] = useState([]);//

  const [order, setOrder] = useState({
    recipient: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
      completed: false
    },
    tickets: []
  });

  
  const [recipientFirstNameWarning, setRecipientFirstNameWarning] = useState(false);
  const [recipientLastNameWarning, setRecipientLastNameWarning] = useState(false);
  const [recipientEmailWarning, setRecipientEmailWarning] = useState(false);
  const [recipientMessageWarning, setRecipientMessageWarning] = useState(false);

  const [showEventsList, setShowEventsList] = useState(true);
  const [showOrderSummary, setShowOrderSummary] = useState(false)

  const [isLoading, setIsLoading] = useState(false);//

  useEffect(() => {
    setIsLoading(true);

    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) { if (localStorage.getItem(`events`) === null || localStorage.getItem(`eventNum`) === null ) {
        console.log("Events or Event Num DO NOT exist")
        props.clicked()
      } else {
        let tempEventNum = JSON.parse(localStorage.getItem("eventNum"));
        let tempEvents = JSON.parse(localStorage.getItem("events"));
        let tempEventsList = [];

        // maps through the entire "events" object to find the selected event
        tempEvents.forEach((event, index) => {

          // populates the "eventsList" array that allows for navigation to another event
          tempEventsList.push({eventNum: event.eventNum, eventTitle: event.eventTtile});

          if (event.eventNum === tempEventNum) {
            console.log("Found a match: ", event);

            // stores all specific event data received from server into "selectedEventDetails" object
            setSelectedEventDetails(event);
            console.log("selectedEventDetails: ", selectedEventDetails)

            let tempTicketDetails = [];

            // for selected event, tickets information is stored in "ticketsDetails" object
            if (event.tickets.length > 0) {
              
              // for selected event, tickets information is stored in "ticketsDetails" object
              event.tickets.forEach((ticket, index) => {
              
                // constructs price function data
                let tempPriceFeature;
                let tempPriceFeatureArgs;
                let tempPromoCodes = [];
                let tempPriceSummary;

                if ("priceFunction" in ticket) {
                  tempPriceFeature = ticket.priceFunction.form

                  if (ticket.priceFunction.form === "promo") {
                    tempPromoCodes = ticket.priceFunction.args.promocodes;
                    tempPriceSummary = `(Face value: $${parseFloat(ticket.currentTicketPrice).toFixed(2)})`

                  } else if (ticket.priceFunction.form === "twofer") {
                    tempPriceFeatureArgs = ticket.priceFunction.args;
                    tempPriceSummary = `(Face value: $${parseFloat(ticket.currentTicketPrice).toFixed(2)}, Buy ${parseInt(tempPriceFeatureArgs.buy)} for $${parseFloat(tempPriceFeatureArgs.for).toFixed(2)})`

                  } else if (ticket.priceFunction.form === "bogo" && ticket.priceFunction.args.discount === "1")  {
                    tempPriceFeatureArgs = ticket.priceFunction.args;
                    tempPriceSummary = `(Face value: $${parseFloat(ticket.currentTicketPrice).toFixed(2)}, Buy ${parseInt(tempPriceFeatureArgs.buy)} get ${parseInt(tempPriceFeatureArgs.get)} for FREE)`

                  } else if (ticket.priceFunction.form === "bogo")  {
                    tempPriceFeatureArgs = ticket.priceFunction.args;
                    tempPriceSummary = `(Face value: $${parseFloat(ticket.currentTicketPrice).toFixed(2)}, Buy ${parseInt(tempPriceFeatureArgs.buy)} get ${parseInt(tempPriceFeatureArgs.get)} for a ${tempPriceFeatureArgs.discount * 100}% discount)`

                  } else {
                    tempPriceSummary = `(Face value: $${parseFloat(ticket.currentTicketPrice).toFixed(2)})`

                  }
                } else {
                  tempPriceSummary = `(Face value: $${parseFloat(ticket.currentTicketPrice).toFixed(2)})`
                }
                console.log("tempPriceSummary: ", tempPriceSummary)

                let newTicketKey = Math.floor(Math.random() * 1000000000000000);
                
                // new object added to "ticketDetails" array
                tempTicketDetails.push({
                  key: newTicketKey,
                  ticketName: ticket.ticketName,
                  ticketId: ticket._id,
                  ticketPrice: ticket.currentTicketPrice,
                  ticketQuantity: ticket.remainingQuantity,
                  currency: ticket.currency,
                  priceFeature: tempPriceFeature,
                  priceFeatureArgs: tempPriceFeatureArgs,
                  promoCodes: tempPromoCodes,
                  priceSummary: tempPriceSummary
                })
              })
            }

            // populates "ticketDetails" array with selected event
            setTicketDetails(tempTicketDetails);
            console.log("Ticket Details: ", tempTicketDetails)

            // populates first element in tickets" array of "order" object
            if (tempTicketDetails.length >= 1) {
              let ticketKey = Math.floor(Math.random() * 1000000000000000);
              let firstTicket = {};
              console.log("tempTicketDetails[0]: ", tempTicketDetails[0])
              firstTicket.key = ticketKey;
              firstTicket.ticketName = tempTicketDetails[0].ticketName;
              firstTicket.ticketId = tempTicketDetails[0].ticketId;
              firstTicket.availTickets = tempTicketDetails[0].ticketQuantity;
              firstTicket.faceValue = parseFloat(tempTicketDetails[0].ticketPrice).toFixed(2);
              firstTicket.numTickets = 1;
              firstTicket.chargedPrice = parseFloat(tempTicketDetails[0].ticketPrice).toFixed(2);
              firstTicket.chargedPriceWarning = "";
              firstTicket.compTicket = false;
              firstTicket.priceSummary = tempTicketDetails[0].priceSummary;
              firstTicket.subTotal = parseFloat(firstTicket.numTickets) * parseFloat(firstTicket.chargedPrice);
              firstTicket.priceInput = "ticket";
              firstTicket.paymentType = "CashUSD";
              console.log("firstTicket: ", firstTicket);
              let tempOrder={...order};
              let tempTickets=[...tempOrder.tickets];
              tempTickets.push(firstTicket)
              console.log("tempTickets: ", tempTickets);
              tempOrder.tickets=tempTickets
              console.log("tempOrder: ", tempOrder);
              setOrder(tempOrder);
            }
          }
        })
        
        // populates the "eventsList" array that allows for navigation to another event
        setEventsList(tempEventsList);
        console.log("All Events: ", tempEventsList)
      }

    } else {
      window.location.href = "/signin";
    }

    setIsLoading(false);
  }, []);


  // NEED TO EDIT
  // clears entire "ticketInfo" object and "eventLogo", removes "cart" and "image" from "localStorage"
  const purchaseConfirmHandler = () => {
    setOrder({
      recipient: {
        firstName: "",
        lastName: "",
        email: "",
        message: "",
        completed: false
      },
      tickets: []
    })
    //let event = JSON.parse(localStorage.getItem("eventNum"));
    //localStorage.removeItem(`cart_${event}`);
    //localStorage.removeItem(`image_${event}`);
  };

  // NEED TO EDIT
  const handleErrors = response => {
    console.log ("inside handleErrors ", response);
    if (!response.ok) {
        throw Error(response.status);
    }
    return response;
  };

  // NEED TO EDIT
  const submitOrder = () => {
    let order = {};
    let ticketArray = [];
    order.firstName = order.recipient.firstName;
    order.lastName = order.recipient.lastName;
    order.email = order.recipient.email;
    order.message = order.recipient.message;
    order.eventNum = selectedEventDetails.eventNum;
    console.log("order: ", order)
    
    order.tickets.forEach((ticket, index) => {
      console.log("item #", index)
      let tempObject = {};
      tempObject.key = ticket.key;
      tempObject.ticketID = ticket.ticketId;
      tempObject.ticketsSelected = ticket.numTickets;
      if (ticket.price === "COMP") {
        tempObject.ticketPrice = 0;
        tempObject.paymentType = "COMP";
      } else {
        tempObject.ticketPrice = ticket.price;
        tempObject.paymentType = ticket.paymentType;
      }
      ticketArray.push(tempObject);
    });
    
    order.tickets = ticketArray;
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let url = `${API}/free/manualTickets`;
    let fetcharg ={
        method: "POST",
        headers: myHeaders,
        body:JSON.stringify (order),
    };
    console.log("fetching with: ", url, fetcharg);
    console.log("order: ", order)
    
    /**/
    fetch(url, fetcharg )
    .then(handleErrors)
    .then ((response)=>{
        console.log ("then response: ", response);
        return response.json()})
    .then ((data)=>{
        console.log ("fetch return got back data:", data);
        //setOrderStatus(true);
        //console.log("Order status: ", orderStatus);
        //onlyShowPurchaseConfirmation();
        purchaseConfirmHandler();
    })
    .catch ((error)=>{
        console.log("freeTicketHandler() error.message: ", error.message);
        //onlyShowPurchaseConfirmation();
        purchaseConfirmHandler();
    })
    
  }

  // NEED TO EDIT
  const reviewOrder = () => {
    console.log("order: ", order)
    setShowOrderSummary(true);
  }


  
  // UPDATED CODE
  const addNewTicket = () => {
    if (ticketDetails.length >= 1) {
      let ticketKey = Math.floor(Math.random() * 1000000000000000);
      let newTicket = {};
      console.log("ticketDetails[0]: ", ticketDetails[0])
      newTicket.key = ticketKey;
      newTicket.ticketName = ticketDetails[0].ticketName;
      newTicket.ticketId = ticketDetails[0].ticketId;
      newTicket.availTickets = ticketDetails[0].ticketQuantity;
      newTicket.faceValue = parseFloat(ticketDetails[0].ticketPrice).toFixed(2);
      newTicket.numTickets = 1;
      newTicket.chargedPrice = parseFloat(ticketDetails[0].ticketPrice).toFixed(2);
      newTicket.compTicket = false;
      newTicket.priceSummary = ticketDetails[0].priceSummary;
      newTicket.subTotal = parseFloat(newTicket.numTickets) * parseFloat(newTicket.chargedPrice);
      newTicket.priceInput = "ticket";
      newTicket.paymentType = "CashUSD";
      console.log("newTicket: ", newTicket);
      let tempOrder={...order};
      let tempTickets=[...tempOrder.tickets];
      tempTickets.push(newTicket)
      console.log("tempTickets: ", tempTickets);
      tempOrder.tickets=tempTickets
      console.log("tempNewOrder: ", tempOrder);
      setOrder(tempOrder);
    }
  }

  // UPDATED CODE
  const changeTicket = (event, key) => {
    console.log("changing ticket info")

    console.log("order: ", order);
    console.log("Event name: ", event.target.name);
    console.log("Event value: ", event.target.value);

    let tempOrder = {...order};
    let tempTickets = [...tempOrder.tickets];
    console.log("tempTickets: ", tempTickets)

    let priceRegex = /^(0|0\.|0\.[0-9]|0\.[0-9][0-9]|\.|\.[0-9]|\.[0-9][0-9]|[1-9][0-9]+|[1-9][0-9]+\.|[1-9][0-9]+\.[0-9]|[1-9][0-9]+\.[0-9][0-9]|[0-9]| [0-9]\.|[0-9]\.[0-9]|[0-9]\.[0-9][0-9]|)$/;

    tempTickets.forEach((ticket, index) => {
      if (ticket.key === key) {
        console.log("key: ", ticket.key)

        if (event.target.name === "ticketName") {
          console.log("ticketName");
          ticket.ticketName = event.target.value;

          ticketDetails.forEach((eventTicket, index) => {
            if (eventTicket.ticketName === event.target.value) {
              console.log("We have a match: ", ticket)
              ticket.ticketName = eventTicket.ticketName;
              ticket.ticketId = eventTicket.ticketId;
              ticket.availTickets = eventTicket.ticketQuantity;
              ticket.faceValue = parseFloat(eventTicket.ticketPrice).toFixed(2);
              //ticket.compTicket = false;
              //ticket.numTickets = 1;
              ticket.priceSummary = eventTicket.priceSummary;
              if (ticket.compTicket) {
                ticket.chargedPrice = parseFloat(0).toFixed(2);
              } else {
                ticket.chargedPrice = parseFloat(eventTicket.ticketPrice).toFixed(2);
              }
              ticket.chargedPriceWarning = "";
              ticket.paymentType = "CashUSD";
              ticket.subTotal = parseFloat(ticket.numTickets) * parseFloat(ticket.chargedPrice);
              console.log("ticket: ", ticket)
            }
          })

        } else if (event.target.name === "numTickets") {
          console.log("numTickets");
          ticket.numTickets = event.target.value;
          ticket.subTotal = parseFloat(ticket.numTickets) * parseFloat(ticket.chargedPrice);

        } else if (event.target.name === "compTicket") {
          console.log("compTicket");
          ticket.compTicket = !ticket.compTicket
          if (!ticket.compTicket) {
            ticket.chargedPrice = parseFloat(ticket.faceValue).toFixed(2);
          } else {
            ticket.chargedPrice = parseFloat(0).toFixed(2);
          }
          ticket.chargedPriceWarning = "";
          ticket.subTotal = parseFloat(ticket.numTickets) * parseFloat(ticket.chargedPrice);

        } else if (event.target.name === "chargedPrice") {
          console.log("chargedPrice");
          ticket.chargedPrice = event.target.value;
          if (ticket.chargedPrice === "") {
            //chargedPriceWarning = "empty value represents zero price"
            ticket.chargedPriceWarning = ""
            ticket.subTotal = parseFloat(0).toFixed(2);

          } else if (isNaN(ticket.chargedPrice)) {
            //chargedPriceWarning = "LETTERS ARE INCLUDED"
            ticket.chargedPriceWarning = "Not a valid number";
            ticket.subTotal = "NaN"

          } else if (priceRegex.test(ticket.chargedPrice)){
            //chargedPriceWarning = "max 2 decimals"
            ticket.chargedPriceWarning = ""
            ticket.subTotal = parseFloat(ticket.numTickets) * parseFloat(ticket.chargedPrice);

          } else {
            //chargedPriceWarning = "more than 2 decimals"
            ticket.chargedPriceWarning = "Not a valid price"
            ticket.subTotal = parseFloat(ticket.numTickets) * parseFloat(ticket.chargedPrice);
          }

        } else if (event.target.name === "paymentType") {
          console.log("paymentType");
          ticket.paymentType = event.target.value;
        }
      }
    })

    tempOrder.tickets = tempTickets
    console.log("tempOrder.tickets: ", tempOrder.tickets)
    console.log("tempOrder: ", tempOrder)
    setOrder(tempOrder);
  }

  // UPDATED CODE
  const deleteTickets = (key) => {
    console.log("order: ", order.tickets)
    console.log("key: ", key)
    if (order.tickets.length === 1) {
      console.log("Only 1 ticket in order")
      let ticketKey = Math.floor(Math.random() * 1000000000000000);
      let firstTicket = {};
      console.log("ticketDetails[0]: ", ticketDetails[0])
      firstTicket.key = ticketKey;
      firstTicket.ticketName = ticketDetails[0].ticketName;
      firstTicket.ticketId = ticketDetails[0].ticketId;
      firstTicket.availTickets = ticketDetails[0].ticketQuantity;
      firstTicket.faceValue = parseFloat(ticketDetails[0].ticketPrice).toFixed(2);
      firstTicket.numTickets = 1;
      firstTicket.chargedPrice = parseFloat(ticketDetails[0].ticketPrice).toFixed(2);
      firstTicket.compTicket = false;
      firstTicket.priceSummary = ticketDetails[0].priceSummary;
      firstTicket.subTotal = parseFloat(firstTicket.numTickets) * parseFloat(firstTicket.chargedPrice);
      firstTicket.priceInput = "ticket";
      firstTicket.paymentType = "CashUSD";
      console.log("firstTicket: ", firstTicket);
      let tempOrder={...order};
      let tempTickets=[...tempOrder.tickets];
      tempTickets = [firstTicket];
      console.log("tempTickets: ", tempTickets);
      tempOrder.tickets=tempTickets
      console.log("tempOrder: ", tempOrder);
      setOrder(tempOrder);
    } else {
      console.log("more than 1 ticket in order")
      let tempOrder = {...order};
      let tempTickets = [...tempOrder.tickets]
      tempTickets.forEach((ticket, index) => {
        console.log("ticket.key: ", ticket.key)
        if (ticket.key === key) {
          console.log("ticket.key: ", ticket.key)
          console.log("ticket: ", ticket)
          tempTickets.splice(index, 1);
        }
      })
      tempOrder.tickets = tempTickets;
      setOrder(tempOrder)
    }
  };

  // UPDATED CODE
  const ticketCart = () => {

    if (!isLoading) {
      return (
        <div
          style={{
            width: "690px",
            paddingTop: "20px",
            paddingBottom: "20px",
            marginLeft: "20px"
          }}
        >
          <div style={{fontSize: "16px", fontWeight: "600", paddingBottom: "15px"}}>Ticket Cart</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "260px 80px 45px 70px 110px 70px",
              gridGap: "10px",
              width: "680px",
              borderBottom: "1px solid black",
              fontWeight: "600",
              paddingBottom: "10px"
            }}
          >
            <div>Ticket Type</div>
            <div style={{textAlign: "center"}}># Tickets</div>
            <div style={{textAlign: "center"}}>Comp</div>
            <div style={{textAlign: "center"}}>Price</div>
            <div style={{paddingLeft: "10px"}}>Payment Type</div>
            <div style={{textAlign: "center"}}>Total</div>
          </div>
          <div
            style={{
              width: "680px",
              borderBottom: "1px solid black",
              paddingTop: "10px"
            }}>

            {order.tickets.map((ticket, index) => {

              let priceBox;
              
              if (ticket.chargedPriceWarning === "") {
                priceBox = classes.PriceBox;
              } else {
                priceBox = classes.PriceBoxWarning;
              }

              return (
                <div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "260px 80px 45px 70px 110px 70px 40px",
                      gridGap: "10px",
                      width: "680px",
                      fontWeight: "400"
                    }}
                  >
                    <div>
                      <select
                        style={{
                          width: "260px",
                          height: "25px", 
                          fontSize: "15px",
                          border: "0.5px solid grey"
                        }}
                        type="text"
                        name="ticketName"
                        required
                        value={ticket.ticketName}
                        onChange={(event) => {
                          changeTicket(event, ticket.key)
                        }}
                      >
                        {ticketDetails.map((ticket2, index2) => {
                          return (
                            <option>{ticket2.ticketName}</option>
                          )
                        })}

                      </select>
                    </div>
                    <div>
                      <select
                        style={{width: "80px", height: "25px", 
                        fontSize: "15px", paddingLeft: "5px", textAlign: "right", border: "0.5px solid grey"}}
                        type="number"
                        name="numTickets"
                        value={ticket.numTickets}
                        required
                        onChange={(event) => {
                          changeTicket(event, ticket.key)
                        }}
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                      </select>
                    </div>
                    <div
                      style={{
                        paddingTop: "2.5px",
                        paddingLeft: "12px"
                      }}
                    >
                      <input
                        type="checkbox"
                        id=""
                        name="compTicket"
                        style={{
                          outline: "0.5px solid lightgrey",
                          borderRadius: "0px",
                          width: "20px",
                          height: "20px"
                        }}
                        checked={ticket.compTicket}
                        onChange={(event) => {
                          changeTicket(event, ticket.key)
                        }}
                      />
                    </div>

                    <div>
                      <input
                        className={priceBox}
                        type="number decimal"
                        step=".01"
                        name="chargedPrice"
                        disabled={ticket.compTicket}  
                        value={ticket.chargedPrice}
                        onChange={(event) => {
                          changeTicket(event, ticket.key)
                        }}
                      />
                    </div>

                    <div style={{paddingLeft: "10px"}}>
                      <select
                        style={{
                          border: "0.5px solid grey",
                          width: "110px",
                          height: "25px",
                          fontSize: "15px"
                        }}
                          type="payment"
                          name="paymentType"
                          required
                          disabled={ticket.compTicket}
                          value={ticket.paymentType}
                          onChange={(event) => {
                            changeTicket(event, ticket.key)
                          }}
                      >
                        <option>CashUSD</option>
                        <option>CashApp</option>
                        <option>Venmo</option>
                        <option>Paypal</option>
                        <option>BitCoin</option>
                        <option>Ethereum</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div style={{paddingRight: "10px", textAlign: "right"}}>{parseFloat(ticket.subTotal).toFixed(2)}</div>
            
                    <div style={{textAlign: "center"}}>
                      <FontAwesomeIcon
                        color="blue"
                        cursor="pointer"
                        onClick={() => {
                          deleteTickets(ticket.key)
                        }}
                        icon={faTrashAlt}
                      />
                    </div>

                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "415px 200px"
                    }}>
                    <div
                      style={{
                        fontWeight: "400",
                        width: "680px",
                        textAlign: "left",
                        paddingBottom: "10px"
                      }}
                      >
                      {ticket.priceSummary}
                      </div>
                      <div
                        style={{
                          color: "red",
                          fontSize: "12px"
                        }}
                      >
                        {ticket.chargedPriceWarning}
                      </div>
                  </div>
                </div>
              )
            })}

          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "320px 320px",
              gridGap: "40px",
              width: "680px",
              fontWeight: "400",
              paddingTop: "20px",
              paddingBottom: "0px"
            }}>

            <div style={{width: "320px", textAlign: "right"}}>
              <Button
                style={{
                  backgroundColor: 'white',
                  border: "1px solid green",
                  color: "green",
                  fontSize: "15px",
                  fontWeight: "600",
                  width: "150px",
                  height: "30px",
                  margin: "auto",
                  textAlign: "center",
                  padding: "0px"
                }}
                //disabled={}
                content="Additional Ticket"
                onClick={addNewTicket}
              />
            </div>


          
            <div style={{width: "320px"}}>
              <Button
                style={{
                  backgroundColor: "blue",
                  border: "1px solid blue",
                  color: "white",
                  fontSize: "15px",
                  fontWeight: "600",
                  width: "150px",
                  height: "30px",
                  margin: "auto",
                  textAlign: "center",
                  padding: "0px"
                }}
                disabled={validOrder()}
                //disabled={order.tickets.length === 0 || order.recipient.completed === false}
                content="Review Order"
                onClick={reviewOrder}
              />
            </div>
          </div>

          <div
            style={{
              color: "red",
              fontSize: "12px",
              fontWeight: "400",
              paddingTop: "5px",
              paddingLeft: "360px"
            }}
          >
            {!order.recipient.completed ? "please correct input errors identified above" : null}
          </div>


      </div>)
    } else {
      return null;
    }
  }


  const validOrder = () => {
    let invalid = true;
    let ticketWarnings = false;
    order.tickets.forEach((ticket, index) => {
      if (ticket.chargedPriceWarning) {
        ticketWarnings = true;
      }
    })
    if(order.tickets.length > 0 && order.recipient.completed === true && !ticketWarnings) {
      invalid = false;
    }
    return invalid;
  }


  const updateRecipient = (event) => {
    const regsuper = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let tempOrder = {...order};
    let tempRecipient = {...tempOrder.recipient};

    tempRecipient[event.target.name] = event.target.value;
    if (tempRecipient.firstName === "" ||
      tempRecipient.lastName === "" ||
      tempRecipient.email === "" ||
      !regsuper.test(tempRecipient.email)
    ) {
      tempRecipient.completed = false;
    } else {
      tempRecipient.completed = true;
    }
    tempOrder.recipient = tempRecipient;
    console.log("tempRecipient: ", tempRecipient);
    console.log("tempOrder: ", tempOrder);
    setOrder(tempOrder)
  }



  const displayMessage = (limit, variable) => {
    if (variable && variable.length >= limit) {
      return (
        <div
          style={{
            paddingLeft: "10px",
            height: "14px",
            color: "red",
            fontSize: "12px",
            fontWeight: "700",
          }}
        >
          Maximum characters used
        </div>
      );
    } else if (variable && variable.length >= limit - 10) {
      return (
        <div
          style={{
            paddingLeft: "10px",
            height: "14px",
            color: "red",
            fontSize: "12px",
          }}
        >
          Remaining {limit - variable.length}
        </div>
      );
    } else if (variable) {
      return (
        <div
          style={{
            paddingLeft: "10px",
            height: "14px",
            color: "black",
            fontSize: "12px",
          }}
        >
          Remaining {limit - variable.length}
        </div>
      );
    } else {
      return (
        <div
          style={{
            paddingLeft: "10px",
            height: "14px",
            color: "black",
            fontSize: "12px",
          }}
        >
          Remaining {limit}
        </div>
      );
    }
  };




  const recipientDisplay = () => {

    // defines styling for recipient boxes
    let firstNameBox;
    let lastNameBox;
    let emailBox;
    let emailWarning;

    const regsuper = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    console.log("order.recipient: ", order.recipient);
    
    if (order.recipient.firstName === "") {
      firstNameBox = classes.FirstNameBoxWarning;
    } else {
      firstNameBox = classes.FirstNameBox;
    }
    
    if (order.recipient.lastName === "") {
      lastNameBox = classes.LastNameBoxWarning;
    } else {
      lastNameBox = classes.LastNameBox;
    }
    
    if (order.recipient.email === "" || !regsuper.test(order.recipient.email)) {
      emailBox = classes.EmailBoxWarning;
    } else {
      emailBox = classes.EmailBox;
    }

    if (order.recipient.email && !regsuper.test(order.recipient.email)) {
      emailWarning = (
        <div style={{color: "red", fontSize: "12px", paddingLeft: "10px", paddingBottom: "5px"}}>
          Not a valid email address
        </div>
      )
    } else if (recipientEmailWarning) {
      emailWarning = displayMessage(64, order.recipient.email)
    } else {
      emailWarning = null
    }

    return (
        <div
          style={{
            width: "690px",
            paddingTop: "20px",
            paddingBottom: "20px",
            paddingLeft: "20px"
          }}
        >
          <div style={{fontSize: "16px", fontWeight: "600", paddingBottom: "15px"}}>
            Recipient <span style={{fontSize: "15px", fontWeight: "400", fontStyle: "italic"}}><span style={{color: "red"}}>*</span>required</span>
          </div>

        <div style={{display: "grid", gridGap: "10px", gridTemplateColumns: "325px 325px", paddingBottom: "10px"}}>
          <div>
            <label style={{fontSize: "15px", margin: "0px", paddingBottom: "5px"}}>
              First Name<span style={{color: "red"}}>*</span>
            </label>
            <input className={firstNameBox}
              type="text"
              name="firstName"
              placeholder="Limit 32 characters"
              maxLength="64"
              onFocus={() => setRecipientFirstNameWarning(true)}
              onBlur={() => setRecipientFirstNameWarning(false)}
              onChange={updateRecipient}
            />
            {recipientFirstNameWarning
              ? displayMessage(64, order.recipient.firstName)
              : null
            }
          </div>

          <div>
            <label style={{fontSize: "15px", margin: "0px", paddingBottom: "5px"}}>
              Last Name<span style={{color: "red"}}>*</span>
            </label>
            <input className={lastNameBox}
              type="text"
              name="lastName"
              placeholder="Limit 32 characters"
              maxLength="64"
              onFocus={() => setRecipientLastNameWarning(true)}
              onBlur={() => setRecipientLastNameWarning(false)}
              onChange={updateRecipient}
            />
            {recipientLastNameWarning
              ? displayMessage(64, order.recipient.lastName)
              : null
            }
          </div>
        </div>
        <div style={{width: "660px", paddingBottom: "10px"}}>
          <div>
            <label style={{fontSize: "15px", margin: "0px", paddingBottom: "5px"}}>
              Email Address<span style={{color: "red"}}>*</span>
            </label>
            <input
              className={emailBox}
              type="email"
              name="email"
              placeholder="Limit 64 characters"
              maxLength="64"
              onFocus={() => setRecipientEmailWarning(true)}
              onBlur={() => setRecipientEmailWarning(false)}
              onChange={updateRecipient}
            />
            <div>{emailWarning}</div>
          </div>
        </div>


        <div style={{width: "660px", paddingBottom: "0px"}}>
          <div>
            <label style={{fontSize: "15px", margin: "0px", paddingBottom: "5px"}}>
              Message <span style={{fontStyle: "italic"}}>(internal use only)</span>
            </label>
            <input
              className={classes.InputBox}
              type="text"
              name="message"
              maxLength="64"
              onFocus={() => setRecipientMessageWarning(true)}
              onBlur={() => setRecipientMessageWarning(false)}
              placeholder="Limit 64 characters"
              onChange={updateRecipient}
            />
              {recipientMessageWarning
                ? displayMessage(64, order.recipient.message)
                : null
              }
          </div>
        </div>
      </div>
    )
  }

  const orderSummary = () => {
    if (showOrderSummary) {
      return (
        <Fragment>
          <OrderModal
            show={true}
            title={selectedEventDetails.eventTitle}
            details={order}
            closeModal={() => {
              setShowOrderSummary(false);
            }}
            submit={submitOrder}
          ></OrderModal>
        </Fragment>
      )
    } else {
      return null;
    }
  }

  const mainDisplay = () => {
    return (
      <div style={{paddingTop: "80px", paddingLeft: "30px"}}>
        <div style={{fontWeight: "600", fontSize: "18px"}}>Ticket Order Entry</div>
        {recipientDisplay()}
        {ticketCart()}
        {orderSummary()}
      </div>
    )
  }

  return (
    <div>
      <div className={classes.DisplayPanelTitle}>
          EVENT DASHBOARD
      </div>
      
      <div className={classes.DisplayPanel2}>
        <div className={classes.DashboardHeader}>
          <div style={{paddingBottom: "5px"}}>
            <div style={{fontSize: "22px", fontWeight: "600"}}>{!isLoading ? selectedEventDetails.eventTitle : "empty"}</div>
          </div>
          <div>
            <button
              style={{
                fontSize: "14px",
                textAlign: "left",
                fontWeight: "400",
                paddingLeft: "0px",
                color: "blue",
                border: "none",
                backgroundColor: "#E7E7E7",
                cursor: "pointer",
                display: "inlineBlock",
                outline: "none",
              }}
              onClick={() => {
                setShowEventsList(!showEventsList)
              }}
            >
              Switch Event
            </button>
          </div>
            {showEventsList ? null : null}
        </div>
        {mainDisplay()}
      </div>
    </div>
  )
}

export default EventDashboard;