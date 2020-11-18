import React, { useEffect, useState, Fragment } from "react";

import { API } from "../../config";
import EventsModal from "./Modals/EventsModal";
import OrderModal from "./Modals/OrderModal"; 

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import classes from "./VendorAccountOLD.module.css";
import { Button } from "semantic-ui-react";


let vendorInfo = {};

const EventDashboard = (props) => {

  const [selectedEventDetails, setSelectedEventDetails] = useState({});//

  const [eventsList, setEventsList] = useState([]);//

  const [ticketDetails, setTicketDetails] = useState([]);//

  const [newTickets, setNewTickets] = useState({}); // ticket input variable

  const [order, setOrder] = useState({
    recipient: {},
    tickets: []
  });

  const [showEventModal, setShowEventModal] = useState(true);
  const [showOrderSummary, setShowOrderSummary] = useState(false)

  const [isLoading, setIsLoading] = useState(false);//
  //const [isSuccessfull, setIsSuccessfull] = useState(false);//

  useEffect(() => {
    setIsLoading(true);

    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) { if (localStorage.getItem(`events`) === null || localStorage.getItem(`eventNum`) === null ) {
        console.log("Events or Event Num DO NOT exist")
        props.clicked()
      } else {
        console.log("Events and Event Num exist")
        let tempEventNum = JSON.parse(localStorage.getItem("eventNum"));
        let tempEvents = JSON.parse(localStorage.getItem("events"));
        let tempEventsList = [];

        // maps through the entire "events" object to find the selected event
        tempEvents.forEach((event, index) => {

          // populates the "eventsList" object that allows for navigation to another event
          tempEventsList.push({eventNum: event.eventNum, eventTitle: event.eventTtile});

          if (event.eventNum === tempEventNum) {
            console.log("Found a match: ", event);

            // stores all specific event data received from server
            setSelectedEventDetails(event);
            console.log("selectedEventDetails: ", selectedEventDetails)

            let tempTicketDetails = [];

            // for selected event, ticket information is stored in "ticketsDetails" object
            if (event.tickets.length > 0) {
              console.log("Ticket length: ", event.tickets.length)
              event.tickets.forEach((ticket, index) => {
              console.log("ticket type number: ", index)
              
                // constructs price function data
                let tempPriceFeature;
                let tempPriceFeatureArgs;
                let tempPromoCodes = [];
                let tempPriceSummary;

                if ("priceFunction" in ticket) {
                  tempPriceFeature = ticket.priceFunction.form
                  console.log("ticket.priceFunction.form: ", ticket.priceFunction.form)

                  if (ticket.priceFunction.form === "promo") {
                    tempPromoCodes = ticket.priceFunction.args.promocodes;
                    tempPriceSummary = `(Full price: $${parseFloat(ticket.currentTicketPrice).toFixed(2)})`

                  } else if (ticket.priceFunction.form === "twofer") {
                    tempPriceFeatureArgs = ticket.priceFunction.args;
                    tempPriceSummary = `(Full price: $${parseFloat(ticket.currentTicketPrice).toFixed(2)}, Buy ${parseInt(tempPriceFeatureArgs.buy)} for $${parseFloat(tempPriceFeatureArgs.for).toFixed(2)})`

                  } else if (ticket.priceFunction.form === "bogo" && ticket.priceFunction.args.discount === "1")  {
                    tempPriceFeatureArgs = ticket.priceFunction.args;
                    tempPriceSummary = `(Full price: $${parseFloat(ticket.currentTicketPrice).toFixed(2)}, Buy ${parseInt(tempPriceFeatureArgs.buy)} get ${parseInt(tempPriceFeatureArgs.get)} for FREE)`

                  } else if (ticket.priceFunction.form === "bogo")  {
                    tempPriceFeatureArgs = ticket.priceFunction.args;
                    tempPriceSummary = `(Full price: $${parseFloat(ticket.currentTicketPrice).toFixed(2)}, Buy ${parseInt(tempPriceFeatureArgs.buy)} get ${parseInt(tempPriceFeatureArgs.get)} for a ${tempPriceFeatureArgs.discount * 100}% discount)`

                  } else {
                    tempPriceSummary = `(Full price: $${parseFloat(ticket.currentTicketPrice).toFixed(2)})`

                  }
                } else {
                  tempPriceSummary = `(Full price: $${parseFloat(ticket.currentTicketPrice).toFixed(2)})`
                }
                console.log("tempPriceSummary: ", tempPriceSummary)

                let newTicketKey = Math.floor(Math.random() * 1000000000000000);
                
                // new object added to "ticketDetails" object
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

            // populates tickets object with selected event
            setTicketDetails(tempTicketDetails);
            console.log("Ticket Details: ", tempTicketDetails)

            // populates "newtickets" object with info from first ticket type
            if (tempTicketDetails.length >= 1) {
              let newTicketKey = Math.floor(Math.random() * 1000000000000000);
              let tempNewTickets = {};
              console.log("tempTicketDetails[0]: ", tempTicketDetails[0])
              tempNewTickets.key = newTicketKey;
              tempNewTickets.ticketName = tempTicketDetails[0].ticketName;
              tempNewTickets.ticketId = tempTicketDetails[0].ticketId;
              tempNewTickets.availTickets = tempTicketDetails[0].ticketQuantity;
              tempNewTickets.fullPrice = tempTicketDetails[0].ticketPrice;
              tempNewTickets.numTickets = 1;
              tempNewTickets.chargedPrice = tempTicketDetails[0].ticketPrice;
              tempNewTickets.compTicket = false;
              tempNewTickets.priceSummary = tempTicketDetails[0].priceSummary;
              tempNewTickets.subTotal = tempNewTickets.numTickets * tempNewTickets.chargedPrice;
              tempNewTickets.paymentType = "Cash US$";
              console.log("tempNewTickets: ", tempNewTickets);
              setNewTickets(tempNewTickets);
            }
          }
        })
        
        // populates the "eventsList" object that allows for navigation to another event
        setEventsList(tempEventsList);
        console.log("All Events: ", tempEventsList)
      }

    } else {
      window.location.href = "/signin";
    }

    setIsLoading(false);
  }, []);

  const changeNewTickets = (event) => {
    console.log("Event name: ", event.target.name);
    console.log("Event value: ", event.target.value);
    let tempNewTickets = {...newTickets};

    if (event.target.name === "ticketName") {
      tempNewTickets.ticketName = event.target.value
      ticketDetails.forEach((ticket, index) => {
        if (ticket.ticketName === event.target.value) {
          console.log("We have a match: ", ticket)
          tempNewTickets.ticketName = ticket.ticketName;
          tempNewTickets.ticketId = ticket.ticketId;
          tempNewTickets.availTickets = ticket.ticketQuantity;
          tempNewTickets.fullPrice = ticket.ticketPrice;
          tempNewTickets.compTicket = false;
          tempNewTickets.priceSummary = ticket.priceSummary;
          tempNewTickets.numTickets = 1;
          tempNewTickets.chargedPrice = ticket.ticketPrice;
          tempNewTickets.paymentType = "Cash US$";
          tempNewTickets.subTotal = tempNewTickets.numTickets * tempNewTickets.chargedPrice;
          console.log("newTickets: ", tempNewTickets)
          setNewTickets(tempNewTickets);
        }
      })
    } else if (event.target.name === "numTickets") {
      tempNewTickets.numTickets = event.target.value;
      tempNewTickets.subTotal = tempNewTickets.numTickets * tempNewTickets.chargedPrice;
      if(newTickets.compTicket) {
        tempNewTickets.subTotal = 0.00;
      }
    } else if (event.target.name === "chargedPrice") {
      tempNewTickets.chargedPrice = event.target.value;
      tempNewTickets.subTotal = tempNewTickets.numTickets * tempNewTickets.chargedPrice;
    } else if (event.target.name === "compTicket") {
      tempNewTickets.compTicket = !newTickets.compTicket
      if (!newTickets.compTicket) {
        tempNewTickets.chargedPrice = "COMP";
        tempNewTickets.subTotal = 0.00;
      } else {
        console.log("tempNewTickets.chargedPrice: ", tempNewTickets.chargedPrice)
        tempNewTickets.chargedPrice = newTickets.fullPrice;
        tempNewTickets.subTotal = tempNewTickets.chargedPrice * tempNewTickets.numTickets;
      }
    } else if (event.target.name === "paymentType") {
      tempNewTickets.paymentType = event.target.value;
    }
    console.log("tempNewTickets: ", tempNewTickets)
    setNewTickets(tempNewTickets)
  }

  const resetNewTickets = () => {
    if (ticketDetails.length >= 1) {
      let newTicketKey = Math.floor(Math.random() * 1000000000000000);
      let tempNewTickets = {};
    
      tempNewTickets.key = newTicketKey;
      tempNewTickets.ticketName = ticketDetails[0].ticketName;
      tempNewTickets.ticketId = ticketDetails[0].ticketId;
      tempNewTickets.availTickets = ticketDetails[0].ticketQuantity;
      tempNewTickets.fullPrice = ticketDetails[0].ticketPrice;
      tempNewTickets.numTickets = 1;
      tempNewTickets.chargedPrice = ticketDetails[0].ticketPrice;
      tempNewTickets.compTicket = false;
      tempNewTickets.priceSummary = ticketDetails[0].priceSummary;
      tempNewTickets.subTotal = tempNewTickets.numTickets * tempNewTickets.chargedPrice;
      tempNewTickets.paymentType = "Cash US$";

      console.log("tempNewTickets: ", tempNewTickets);
      console.log("ticketDetails[index]: ", ticketDetails[0])

      setNewTickets(tempNewTickets);
    }
  }

  const addTickets = () => {
    let tempOrder = {...order};
    let tempTickets = [...tempOrder.tickets];
    let tempNewTickets = {};

    tempNewTickets.key = newTickets.key;
    tempNewTickets.ticketName = newTickets.ticketName;
    tempNewTickets.ticketId = newTickets.ticketId;
    tempNewTickets.numTickets = newTickets.numTickets;
    if (newTickets.chargedPrice == 0 || newTickets.chargedPrice === "COMP") {
      tempNewTickets.price = "COMP";
      tempNewTickets.subTotal = 0;
    } else {
      tempNewTickets.price = newTickets.chargedPrice;
      tempNewTickets.subTotal = newTickets.subTotal;
    }
    tempNewTickets.paymentType = newTickets.paymentType;

    tempTickets.push(tempNewTickets);
    tempOrder.tickets = tempTickets;

    console.log("tempTickets: ", tempTickets);
    console.log("tempOrder: ", tempOrder);

    setOrder(tempOrder);
    resetNewTickets();
  }

  const addOrderDisplay = () => {
    if (!isLoading) {
      return (
        <div
          style={{
            width: "970px",
            borderBottom: "1px solid black",
            paddingTop: "20px",
            paddingBottom: "20px",
            paddingLeft: "20px"
          }}
        >
          <div style={{fontSize: "16px", fontWeight: "600", paddingBottom: "15px"}}>Add Ticket(s) to Order:</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "260px 80px 70px 45px 110px 70px",
              gridGap: "10px",
              fontWeight: "600",
              paddingBottom: "5px",
              paddingLeft: "20px"
            }}
          >
            <div>Ticket Type (Select One)</div>
            <div style={{textAlign: "center"}}># Tickets</div>
            <div style={{textAlign: "center"}}>Price</div>
            <div style={{textAlign: "center"}}>Comp</div>
            <div style={{paddingLeft: "10px"}}>Payment Type</div>
            <div style={{textAlign: "center"}}>Total</div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "260px 80px 70px 45px 110px 70px",
              gridGap: "10px",
              fontWeight: "400",
              paddingBottom: "5px",
              paddingLeft: "20px"
            }}>
            <div>
              <select
                style={{width: "260px", height: "25px", 
                fontSize: "15px",border: "0.5px solid grey"}}
                type="text"
                name="ticketName"
                required
                value={newTickets.ticketName}
                onChange={changeNewTickets}
              >
                {ticketDetails.map((ticket, index) => {
                  return (
                    <option>{ticket.ticketName}</option>
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
                value={newTickets.numTickets}
                required
                onChange={changeNewTickets}
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
            <div>
              <input
                style={{
                  width: "70px",
                  height: "25px",
                  paddingRight: "7px",
                  textAlign: "center",
                  fontSize: "15px",
                  border: "0.5px solid grey"
                }}
                type="text"
                name="chargedPrice"
                disabled={newTickets.compTicket}  
                value={newTickets.chargedPrice}
                onChange={changeNewTickets}
              />
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
                checked={newTickets.compTicket}
                onChange={changeNewTickets} 
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
                  disabled={newTickets.compTicket}
                  value={newTickets.paymentType}
                  onChange={changeNewTickets}
              >
                <option>Cash US$</option>
                <option>CashApp</option>
                <option>Venmo</option>
                <option>Paypal</option>
                <option>BitCoin</option>
                <option>Ethereum</option>
                <option>Other</option>
              </select>
            </div>
            <div style={{paddingRight: "10px", textAlign: "right"}}>{parseFloat(newTickets.subTotal).toFixed(2)}</div>
          </div>
        <div
          style={{
            fontWeight: "400",
            width: "720px",
            textAlign: "left",
            paddingBottom: "20px",
            paddingLeft: "20px"
          }}
        >
          {newTickets.priceSummary}
        </div>
        <div style={{width: "425px", paddingLeft: "265px"}}>
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
            disabled={newTickets.numTickets === 0 || newTickets.chargedPrice === ""}
            content="Add to Order"
            onClick={addTickets}
          />
        </div>
      </div>)
    } else {
      return null;
    }
  }



  const deleteTickets = (key) => {
    console.log("order: ", order.tickets)
    console.log("key: ", key)
    // delete all promoCode info and set back to default in this specific ticket
    let tempOrder = {...order};
    let tempTickets = [...tempOrder.tickets]
    tempTickets.forEach((ticket, index) => {
      if (ticket.key === key) {
        console.log("ticket.key: ", ticket.key)
        console.log("ticket: ", ticket)
        tempTickets.splice(index, 1);
      }
    })
    tempOrder.tickets = tempTickets;
    setOrder(tempOrder)
  };




  const ticketsOrder = () => {
    if (order.tickets.length > 0) {
      let orderTotal = 0;
      return (
        <Fragment>
          <div style={{
            width: "660px",
            borderBottom: "1px solid black",
            paddingTop: "10px",
            paddingLeft: "20px"
          }}>
            {order.tickets.map((ticket, index) => {
              if (ticket.chargedPrice !== "COMP") {
                orderTotal = (orderTotal + ticket.subTotal)
              };
              return (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "260px 80px 70px 110px 70px 40px",
                    gridGap: "10px",
                    height: "28px"
                  }}
                >
                  <div>{ticket.ticketName}</div>
                  <div style={{textAlign: "center"}}>{ticket.numTickets}</div>
                  {ticket.price === "COMP" ? <div>COMP</div> : <div style={{textAlign: "right", paddingRight: "10px"}}>{parseFloat(ticket.price).toFixed(2)}</div>}
                  {ticket.price === "COMP" ? <div></div> : <div style={{paddingLeft: "20px"}}>{ticket.paymentType}</div>}
                  <div style={{textAlign: "right", paddingRight: "10px"}}>{parseFloat(ticket.subTotal).toFixed(2)}</div>
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
              )
            })}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "560px 70px",
              width: "660px",
              fontWeight: "600",
              paddingTop: "10px",
              paddingBottom: "10px",
              paddingLeft: "20px"
            }}
          >
            <div>Order Total</div>
            <div style={{textAlign: "right", paddingRight: "10px"}}>{parseFloat(orderTotal).toFixed(2)}</div>
          </div>
        </Fragment>
      )
    } else {
      return (
        <div style={{
          borderBottom: "1px solid black",
          width: "660px",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "20px",
          textAlign: "center"
        }}>
          There are no tickets in this order
        </div>
      )
    }
  }














    const reviewOrder = () => {
      setShowOrderSummary(true);
    }

    const mainDisplay = () => {
      return (
        <div style={{paddingTop: "80px", paddingLeft: "30px"}}>
          <div style={{fontWeight: "600", fontSize: "18px"}}>Ticket Order Entry</div>
          {recipientDisplay()}
          {addOrderDisplay()}
          {orderDisplay()}
          {orderSummary()}
        </div>
      )
    }

    const updateRecipient = (event) => {
      let tempOrder = {...order};
      let tempRecipient = {...tempOrder.recipient};
      tempRecipient[event.target.name] = event.target.value;
      tempOrder.recipient = tempRecipient;
      console.log("tempRecipient: ", tempRecipient);
      console.log("tempOrder: ", tempOrder);
      setOrder(tempOrder)
    }
    
    const recipientDisplay = () => {
      return (
          <div
            style={{
              width: "970px",
              borderBottom: "1px solid black",
              paddingTop: "20px",
              paddingBottom: "20px",
              paddingLeft: "20px"
            }}
          >
            <div style={{fontSize: "16px", fontWeight: "600", paddingBottom: "15px"}}>Recipient</div>

          <div style={{display: "grid", gridGap: "10px", gridTemplateColumns: "325px 325px", paddingBottom: "10px"}}>
            <div>
              <label style={{fontSize: "15px", margin: "0px", paddingBottom: "5px"}}>
                First Name<span style={{color: "red"}}>*</span>
              </label>
              <input
                style={{
                  border: "0.5px solid grey",
                  height: "30px",
                  width: "325px"
                }}
                type="text"
                name="firstName"
                onChange={updateRecipient}
              />
            </div>

            <div>
              <label style={{fontSize: "15px", margin: "0px", paddingBottom: "5px"}}>
                Last Name<span style={{color: "red"}}>*</span>
              </label>
              <input
                style={{
                  border: "0.5px solid grey",
                  height: "30px",
                  width: "325px"
                }}
                type="text"
                name="lastName"
                onChange={updateRecipient}
              />
            </div>
          </div>
          <div style={{width: "660px", paddingBottom: "10px"}}>
            <div>
              <label style={{fontSize: "15px", margin: "0px", paddingBottom: "5px"}}>
                Email Address<span style={{color: "red"}}>*</span>
              </label>
              <input
                style={{
                  border: "0.5px solid grey",
                  height: "30px",
                  width: "660px"
                }}
                type="email"
                name="email"
                onChange={updateRecipient}
              />
            </div>
          </div>
          <div style={{width: "660px", paddingBottom: "0px"}}>
            <div>
              <label style={{fontSize: "15px", margin: "0px", paddingBottom: "5px"}}>
                Internal Order Message (not provided to ticket buyer)
              </label>
              <input
                style={{
                  border: "0.5px solid grey",
                  height: "30px",
                  width: "660px"
                }}
                type="text"
                name="message"
                onChange={updateRecipient}
              />
            </div>
          </div>
          <div style={{paddingTop: "5px"}}>
            <span style={{color: "red"}}>*</span>{" "}required fields
          </div>
        </div>
      )
    }



  const orderDisplay = () => {
    if (!isLoading) {
      return (
        <div
          style={{
            backgroundColor: "#F5F5F5",
            width: "970px",
            paddingTop: "20px",
            paddingBottom: "20px",
            paddingLeft: "20px"
          }}
        >
          <div style={{fontSize: "16px", fontWeight: "600", paddingBottom: "15px"}}>Ticket(s) in Order:</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "260px 80px 70px 110px 70px",
              gridGap: "10px",
              width: "660px",
              borderBottom: "1px solid black",
              fontWeight: "600",
              paddingBottom: "10px",
              paddingLeft: "20px"
            }}
          >
            <div>Ticket Type</div>
            <div style={{textAlign: "center"}}># Tickets</div>
            <div style={{textAlign: "center"}}>Price</div>
            <div style={{paddingLeft: "10px"}}>Payment Type</div>
            <div style={{textAlign: "center"}}>Total</div>
          </div>
          {ticketsOrder()}

          <div style={{width: "425px", paddingTop: "20px", paddingLeft: "265px"}}>
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
              disabled={order.tickets.length === 0}
              content="Review Order"
              onClick={reviewOrder}
            />
          </div>
        </div>
      )
    } else {
      return null;
    }
  }

  const submitOrder = () => {
    let newOrder = {};
    let ticketArray = [];
    newOrder.firstName = order.recipient.firstName;
    newOrder.lastName = order.recipient.lastName;
    newOrder.email = order.recipient.email;
    newOrder.message = order.recipient.message;
    console.log("order: ", order.tickets)
    order.tickets.forEach((ticket, index) => {
      console.log("item #", index)
      let tempObject = {};
      tempObject.key = ticket.key;
      tempObject.ticketID = ticket.ticketId;
      tempObject.ticketsSelected = ticket.numTickets;
      tempObject.ticketPrice = ticket.chargedPrice;
      ticket.compTicket ? tempObject.paymentType = "comp" : tempObject.paymentType = ticket.paymentType;
      ticketArray.push(tempObject);
    });
    console.log("zero tickets:", ticketArray);
    order.tickets = ticketArray;
    console.log("orderobject: ", order)
    let  myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let url = `${API}/free/freeTickets`;
    let fetcharg ={
        method: "POST",
        headers: myHeaders,
        body:JSON.stringify (order),
    };
    console.log("fetching with: ", url, fetcharg);
    console.log("Manual ticket order: ", order)
    /*
    fetch(url, fetcharg )
    .then(handleErrors)
    .then ((response)=>{
        console.log ("then response: ", response);
        return response.json()})
    .then ((data)=>{
        console.log ("fetch return got back data:", data);
        setOrderStatus(true);
        console.log("Order status: ", orderStatus);
        //onlyShowPurchaseConfirmation();
        //purchaseConfirmHandler();
    })
    .catch ((error)=>{
        console.log("freeTicketHandler() error.message: ", error.message);
        //onlyShowPurchaseConfirmation();
        //purchaseConfirmHandler();
    })
    */
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
                        setShowEventModal(!showEventModal)
                      }}
                  >
                      Switch Event
                  </button>

                  </div>
                    {showEventModal ? null : null}
                </div>
                {mainDisplay()}
            </div>
        </div>
    )
}

export default EventDashboard;