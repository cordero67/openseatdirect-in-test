import React, { useEffect, useState, Fragment } from "react";

import { API } from "../../config";
import EventsModal from "./Modals/EventsModal";
import OrderModal from "./Modals/OrderModal"; 

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import classes from "./ControlPanel.module.css";
import { Button } from "semantic-ui-react";


let vendorInfo = {};

const EventDashboard = (props) => {

  const [eventsList, setEventsList] = useState([]);//


  //const [eventDetails, setEventDetails] = useState({});//
  let selectedEventDetails = {
    eventTitle: "Dummy event"
  };

  const [ticketDetails, setTicketDetails] = useState([]);//



  const [newTickets, setNewTickets] = useState({}); // ticket input variable
  const [order, setOrder] = useState({
    recipient: {},
    tickets: []
  });

  const [showEventModal, setShowEventModal] = useState(true);
  const [showOrderSummary, setShowOrderSummary] = useState(false)

  const [isLoading, setIsLoading] = useState(false);//
  const [isSuccessfull, setIsSuccessfull] = useState(false);//

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
            // setEventDetails(event);

            // stores all specific event data received from server
            selectedEventDetails = event;
            console.log("selectedEventDetails: ", selectedEventDetails)

            let tempTicketDetails = [];

            // for selected event, ticket information is stored in "ticketsDetails" object
            if (event.tickets.length > 0) {
              console.log("Ticket length: ", event.tickets.length)
              event.tickets.forEach((ticket, index) => {

                // constructs price function data
                let tempPriceFunction = false;
                let tempPriceFunctionForm;
                let tempPromoCodes = [];
                let tempPriceFeature;
                let tempPriceSummary;

                if ("priceFunction" in ticket) {
                  tempPriceFunction = true;
                  tempPriceFunctionForm = ticket.priceFunction.form
                  if (ticket.priceFunction.form === "promo") {
                    tempPromoCodes = ticket.priceFunction.args.promocodes;
                    tempPriceSummary = `(Full price: $${parseFloat(ticket.currentTicketPrice).toFixed(2)})`

                  } else if (ticket.priceFunction.form === "twofer") {
                    tempPriceFeature = ticket.priceFunction.args;
                    tempPriceSummary = `(Full price: $${parseFloat(ticket.currentTicketPrice).toFixed(2)}, Buy ${parseInt(tempPriceFeature.buy)} for $${parseFloat(tempPriceFeature.for).toFixed(2)})`

                  } else if (ticket.priceFunction.form === "bogo" && ticket.priceFunction.args.discount === "1")  {
                    tempPriceFeature = ticket.priceFunction.args;
                    tempPriceSummary = `(Full price: $${parseFloat(ticket.currentTicketPrice).toFixed(2)}, Buy ${parseInt(tempPriceFeature.buy)} get ${parseInt(tempPriceFeature.get)} for FREE)`

                  } else if (ticket.priceFunction.form === "bogo")  {
                    tempPriceFeature = ticket.priceFunction.args;
                    tempPriceSummary = `(Full price: $${parseFloat(ticket.currentTicketPrice).toFixed(2)}, Buy ${parseInt(tempPriceFeature.buy)} get ${parseInt(tempPriceFeature.get)} for a ${tempPriceFeature.discount * 100}% discount)`

                  } else {
                    tempPriceSummary = `(Full price: $${parseFloat(ticket.currentTicketPrice).toFixed(2)})`

                  }
                } else {
                  tempPriceSummary = `(Full price: $${parseFloat(ticket.currentTicketPrice).toFixed(2)})`

                }
                let newTicketKey = Math.floor(Math.random() * 1000000000000000);
                
                // new object added to "ticketDetails" object
                tempTicketDetails.push({
                  key: newTicketKey,
                  ticketName: ticket.ticketName,
                  ticketPrice: ticket.currentTicketPrice,
                  ticketQuantity: ticket.remainingQuantity,
                  currency: ticket.currency,
                  priceFunction: tempPriceFunction,
                  priceFunctionForm: tempPriceFunctionForm,
                  promoCodes: tempPromoCodes,
                  priceFeature: tempPriceFeature,
                  priceSummary: tempPriceSummary
                })
              })
            }
            console.log("Ticket Details: ", tempTicketDetails)
            // populates tickets object with selected event
            setTicketDetails(tempTicketDetails);

            // populates newtickets object with first ticket type
            if (tempTicketDetails.length >= 1) {
              let newTicketKey = Math.floor(Math.random() * 1000000000000000);
              let tempNewTickets = {};

              tempNewTickets.key = newTicketKey;
              tempNewTickets.ticketName = tempTicketDetails[0].ticketName;
              console.log("tempTicketDetails[0]: ", tempTicketDetails[0])
              tempNewTickets.availTickets = tempTicketDetails[0].ticketQuantity;
              tempNewTickets.fullPrice = tempTicketDetails[0].ticketPrice;
              tempNewTickets.compTicket = false;
              tempNewTickets.priceSummary = tempTicketDetails[0].priceSummary;
              tempNewTickets.numTickets = 0;
              tempNewTickets.chargedPrice = tempTicketDetails[0].ticketPrice;
              tempNewTickets.subTotal = 0;
              tempNewTickets.paymentType = "cash";
              console.log("tempNewTickets: ", tempNewTickets);
              setNewTickets(tempNewTickets);
            }
            setIsSuccessfull(true);
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

  const resetNewTickets = () => {
    let newTicketKey = Math.floor(Math.random() * 1000000000000000);
    let tempNewTickets = {};
    
    tempNewTickets.key = newTicketKey;
    tempNewTickets.ticketName = ticketDetails[0].ticketName;
    tempNewTickets.availTickets = ticketDetails[0].ticketQuantity;
    tempNewTickets.fullPrice = ticketDetails[0].ticketPrice;
    tempNewTickets.priceSummary = ticketDetails[0].priceSummary;
    tempNewTickets.numTickets = 0;
    tempNewTickets.chargedPrice = ticketDetails[0].ticketPrice;
    tempNewTickets.compTicket = false;
    tempNewTickets.subTotal = 10;
    tempNewTickets.paymentType = "cash";
    console.log("tempNewTickets: ", tempNewTickets);
    setNewTickets(tempNewTickets);
  }

    const editEvent = (item) => {
      window.location.href = `/eventedit/?eventID=${selectedEventDetails.eventNum}`;
      }

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
            if (ticket.chargedPrice !== "FREE") {
              orderTotal = (orderTotal + (ticket.chargedPrice * ticket.numTickets))
            };
            //console.log("orderTotal: ", orderTotal)
            return (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "300px 100px 90px 90px 60px",
                    height: "28px"
                  }}
                >
                  <div>
                  {ticket.ticketName}</div>
                  <div>
                  {ticket.numTickets}</div>
                  <div>
                  {ticket.chargedPrice === "FREE" ? "FREE" : parseInt(ticket.chargedPrice).toFixed(2)}</div>
                  <div>
                  {ticket.chargedPrice === "FREE" ? "0.00" : parseInt(ticket.chargedPrice * ticket.numTickets).toFixed(2)}</div>
                  <div style={{textAlign: "center"}}>
                  <FontAwesomeIcon
                      color="blue"
                      cursor="pointer"
                      onClick={() => {
                        //props.showModal(item);
                        //console.log("Ticket Detail: ", props.tickets);
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
            gridTemplateColumns: "490px 60px",
            width: "660px",
            fontWeight: "600",
            paddingTop: "10px",
            paddingBottom: "10px",
            paddingLeft: "20px"
          }}
        >
          <div>Order Total</div>
          <div>{parseFloat(orderTotal).toFixed(2)}</div>
        </div>
        </Fragment>)
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

    const changeNewTickets = (event) => {
      console.log("Event name: ", event.target.name);
      console.log("Event value: ", event.target.value);
      let tempNewTickets = {...newTickets};
      if (event.target.name === "ticketName") {
        tempNewTickets.ticketName = event.target.value
        ticketDetails.forEach((ticket, index) => {
          if (ticket.ticketName === event.target.value) {
            console.log("We have a match: ", ticket)
            resetNewTickets();
            console.log("newTickets: ", newTickets)
          }
        })
      } else if (event.target.name === "numTickets") {
        tempNewTickets.numTickets = parseInt(event.target.value);
        tempNewTickets.subTotal = tempNewTickets.numTickets * tempNewTickets.chargedPrice;
        if(newTickets.compTicket) {
          tempNewTickets.subTotal = 0.00;
        }
      } else if (event.target.name === "chargedPrice") {
        tempNewTickets.chargedPrice = event.target.value
        tempNewTickets.subTotal = tempNewTickets.numTickets * tempNewTickets.chargedPrice;
      } else if (event.target.name === "compTicket") {
        tempNewTickets.compTicket = !newTickets.compTicket
        if (tempNewTickets.compTicket) {
          tempNewTickets.chargedPrice = "FREE";
          tempNewTickets.subTotal = 0.00;
        } else {
          console.log("tempNewTickets.chargedPrice: ", tempNewTickets.chargedPrice)
          tempNewTickets.chargedPrice = newTickets.fullPrice;
          tempNewTickets.subTotal = parseFloat(tempNewTickets.chargedPrice) * parseFloat(tempNewTickets.numTickets);
        }
      }
      console.log("tempNewTickets: ", tempNewTickets)
      setNewTickets(tempNewTickets)
    }

    const reviewOrder = () => {
      setShowOrderSummary(true);
    }

    const availTicketsSelect = () => {
      console.log("newTickets.numTickets: ", newTickets.numTickets)
      let ticketLength = new Array(newTickets.numTickets);
      console.log("ticketLength: ", ticketLength.length);
      return null;
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

    const addTickets = (event) => {
      let tempOrder = {...order};
      let tempTickets = [...tempOrder.tickets];
      tempTickets.push(newTickets);
      tempOrder.tickets = tempTickets;
      console.log("tempTickets: ", tempTickets);
      console.log("tempOrder: ", tempOrder);
      setOrder(tempOrder);
      resetNewTickets();
    }

    
/*
    const addTickets = () => {
      console.log("Add to order");
      let tempOrderDetails = [...orderDetails];
      tempOrderDetails.push(newTickets);
      console.log("tempOrderDetails: ", tempOrderDetails);
      setOrderDetails(tempOrderDetails);
    }
*/

    const recipientDisplay = () => {
      return (
          <div
            style={{
              width: "970px",
              borderBottom: "1px solid #E0E0E0",
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

    const addOrderDisplay = () => {
      if (isSuccessfull && !isLoading) {
        return (
          <div
            style={{
              width: "970px",
              borderBottom: "1px solid #E0E0E0",
              paddingTop: "20px",
              paddingBottom: "20px",
              paddingLeft: "20px"
            }}
          >
            <div style={{fontSize: "16px", fontWeight: "600", paddingBottom: "15px"}}>Add Ticket(s) to Order:</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "270px 100px 80px 45px 140px 80px",
                fontWeight: "600",
                paddingBottom: "5px",
                paddingLeft: "20px"
              }}
            >
              <div>Ticket Type (Select One)</div>
              <div># Tickets</div>
              <div>Price</div>
              <div>Comp</div>
              <div style={{paddingLeft: "10px"}}>Payment Type</div>
              <div>Total</div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "270px 100px 80px 45px 140px 80px",
                fontWeight: "400",
                paddingBottom: "5px",
                paddingLeft: "20px"
              }}>

              <div>
                <select
                  style={{width: "250px", height: "25px", border: "0.5px solid grey"}}
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
                  style={{width: "80px", height: "25px", paddingLeft: "5px", textAlign: "right", border: "0.5px solid grey"}}
                  type="number"
                  value={parseInt(newTickets.numTickets)}
                  name="numTickets"
                  required
                  onChange={changeNewTickets}
                >
                  {availTicketsSelect()};
                  <option>0</option>
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
                  style={{width: "70px", height: "25px", paddingRight: "7px",
                  textAlign: "center", border: "0.5px solid grey"}}
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
                  paddingLeft: "8px"
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
                  //defaultChecked={false}
                  onChange={changeNewTickets} 
                >
                
                </input>
              </div>
              <div style={{paddingLeft: "10px"}}>
                <select
                  
                  style={{
                    border: "0.5px solid grey",
                    width: "110px",
                    height: "25px"
                  }}
                    type="payment"
                    name="paymentType"
                    required
                    disabled={newTickets.compTicket}
                    onChange={changeNewTickets}
                >
                  <option>Cash US$</option>
                  <option>CashApp</option>
                  <option>Venmo</option>
                  <option>BitCoin</option>
                  <option>Ehtereum</option>
                  <option>Other</option>
                </select>
              </div>
              <div style={{textAlign: "right"}}>{newTickets.subTotal}</div>
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
              disabled={newTickets.numTickets === 0}
              content="Add to Order"
              onClick={addTickets}
            />
          </div>
        
        </div>)
      }
    }

    const orderDisplay = () => {
      if (isSuccessfull && !isLoading) {
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
                gridTemplateColumns: "300px 100px 90px 90px 60px",
                width: "660px",
                borderBottom: "1px solid black",
                fontWeight: "600",
                paddingBottom: "10px",
                paddingLeft: "20px"
              }}
            >
              <div>Ticket Type</div>
              <div># Tickets</div>
              <div>Price</div>
              <div>Total</div>
              <div>Delete</div>
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
                content="Submit Order"
                onClick={reviewOrder}
              />
            </div>
          </div>
        )
      } else {
        return null;
      }
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
              deleteTicket={() => {
                console.log("Delete ticket");
                console.log("Ticket key");
                //props.delete(item.key);
              }}
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
                      <div style={{fontSize: "22px", fontWeight: "600"}}>{!isLoading && isSuccessfull ? selectedEventDetails.eventTitle : "empty"}</div>
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
                                            setShowEventModal(!showEventModal)}}
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





/*

    const changeGA = () => {
      setShowGA(!showGA)
    }

    const changeGAComp = () => {
      setShowGAComp(!showGAComp)
    }

    const changeGAFull = () => {
      setShowGAFull(!showGAFull)
    }

    const changeGACustom = () => {
      setShowGACustom(!showGACustom)
    }

    const changeVIP = () => {
      setShowVIP(!showVIP)
    }

    const changeVIPComp = () => {
      setShowVIPComp(!showVIPComp)
    }

    const changeVIPFull = () => {
      setShowVIPFull(!showVIPFull)
    }

    const changeVIPCustom = () => {
      setShowVIPCustom(!showVIPCustom)
    }

    const changeBox = () => {
      setShowBox(!showBox)
    }

    const changeBoxComp = () => {
      setShowBoxComp(!showBoxComp)
    }

    const changeBoxFull = () => {
      setShowBoxFull(!showBoxFull)
    }

    const changeBoxCustom = () => {
      setShowBoxCustom(!showBoxCustom)
    }

    const paymentDisplay = () => {
      return (
        <div
          style={{
            display: "grid",
            gridGap: "10px",
            gridTemplateColumns: "120px 150px",
            width: "970px",
            borderBottom: "1px solid #E0E0E0",
            paddingTop: "20px",
            paddingBottom: "20px",
            paddingLeft: "20px"
          }}
        >
          
          <div style={{fontSize: "16px", fontWeight: "600"}}>Payment Type:</div>

          <select
            type="payment"
            name="paymentType"
            required
          >
            <option>Cash US$</option>
            <option>CashApp</option>
            <option>Venmo</option>
            <option>BitCoin</option>
            <option>Ehtereum</option>
            <option>Other</option>
          </select>

        </div>
      )
    }



                <div style={{fontWeight: "600", fontSize: "18px", paddingLeft: "30px"}}>Details</div>
                    <div style={{fontSize: "14x", fontWeight: "400", paddingLeft: "30px"}}>Sun, Dec 27, 2020 7:00 PM</div>
                    
                    <div style={{fontSize: "14x", fontWeight: "400", paddingLeft: "30px"}}>{selectedEventDetails.startDateTime}</div>
                    <div style={{fontSize: "14x", fontWeight: "400", paddingLeft: "30px"}}>{selectedEventDetails.eventNum}</div>
                    <div style={{fontSize: "14x", fontWeight: "400", paddingLeft: "30px"}}>{selectedEventDetails.locationVenueName}</div>
                    <div style={{fontSize: "14x", fontWeight: "400", paddingLeft: "30px"}}>Event Status: Live</div>


                <button
                                        style={{
                                            fontSize: "14px",
                                            textAlign: "left",
                                            fontWeight: "400",
                                            paddingLeft: "30px",
                                            backgroundColor: "white",
                                            color: "blue",
                                            border: "none",
                                            cursor: "pointer",
                                            display: "inlineBlock",
                                            outline: "none",
                                        }}
                                        onClick={() => {
                                          
                                          window.location.href = `/eventedit/?eventID=${selectedEventDetails.eventNum}`}}
                                    >
                                        Edit Event
                                    </button>
                <br></br>
                <br></br>

                <div style={{fontWeight: "600", fontSize: "18px", paddingLeft: "30px"}}>Sales by Ticket Type</div>

                    <div style={{fontSize: "14x", fontWeight: "400", paddingLeft: "30px"}}>
                      {selectedEventDetails.tickets.map((ticket,index) => {
                        return <div>{ticket.ticketName}</div>
                      })}
                    </div>
                    <br></br>
                    <br></br>
                

                <div style={{fontWeight: "600", fontSize: "18px", paddingLeft: "30px"}}>Sales by Payment Type</div>
                <br></br>
                <br></br>
                
                <div style={{fontWeight: "600", fontSize: "18px", paddingLeft: "30px"}}>Current Ticket Promotions</div>
                <br></br>
                <br></br>






                <div style={{display: "grid", gridTemplateColumns: "20px 800px", paddingLeft: "50px"}}>
                  <input
                    type="checkbox"
                    id="generalAdmission"
                    name="generalAdmission"
                    value="Bike"
                    
                    //checked={this.state.isGoing}
                    onChange={changeGA} 
                    
                    >
                  
                  </input>
                  <label for="generalAdmission">General Admission:</label>
                </div>


                <div>
                  {showGA ?
                    (
                        <div>
                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "300px 360px",
                                    fontWeight: "400",
                                    border: "1px solid black"
                                  }}
                                >
                                      <div style={{display: "grid", gridTemplateColumns: "20px 120px  ", paddingLeft: "70px"}}>
                                        <input
                                          type="checkbox"
                                          id="GAComp"
                                          name="GAComp"
                                          value="GAComplimentary"
                                          onChange={changeGAComp}
                                        ></input>
                                        <label for="GAComp">Complimentary</label>
                                      </div>

                                      {showGAComp ? (
                                        <div
                                          style={{
                                            display: "grid",
                                            gridTemplateColumns: "120px 120px 120px",
                                            fontWeight: "400",
                                            border: "1px solid black"
                                          }}>
                                            <div>
                                              <select
                                                style={{width: "65px"}}
                                                type="number"
                                                name="ticketAmount"
                                                required
                                              >
                                                <option>0</option>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                                <option>6</option>
                                              </select>
                                            </div>
                                            <div>
                                              FREE
                                            </div>
                                                
                                            <div>
                                              $0.00
                                            </div>
                                          </div>
                                      ) :
                                        null
                                      }


                                </div>


                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "300px 360px",
                                    fontWeight: "400",
                                    border: "1px solid black"
                                  }}
                                >
                                      <div style={{display: "grid", gridTemplateColumns: "20px 120px  ", paddingLeft: "70px"}}>
                                        <input
                                          type="checkbox"
                                          id="GAFull"
                                          name="GAFull"
                                          value="GAFullPriced"
                                          onChange={changeGAFull}
                                        ></input>
                                        <label for="GAFull">Full Priced</label>
                                      </div>

                                      {showGAFull ? (
                                        <div
                                          style={{
                                            display: "grid",
                                            gridTemplateColumns: "120px 120px 120px",
                                            fontWeight: "400",
                                            border: "1px solid black"
                                          }}>
                                            <div>
                                              <select
                                                style={{width: "65px"}}
                                                type="number"
                                                name="ticketAmount"
                                                required
                                              >
                                                <option>0</option>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                                <option>6</option>
                                              </select>
                                            </div>
                                            <div>
                                              $10.00
                                            </div>
                                                
                                            <div>
                                              $20.00
                                            </div>
                                          </div>
                                      ) :
                                        null
                                      }


                                </div>


                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "300px 360px",
                                    fontWeight: "400",
                                    border: "1px solid black"
                                  }}
                                >
                                      <div style={{display: "grid", gridTemplateColumns: "20px 120px  ", paddingLeft: "70px"}}>
                                        <input
                                          type="checkbox"
                                          id="GACustom"
                                          name="GACustom"
                                          value="GACustomPricing"
                                          onChange={changeGACustom}
                                        ></input>
                                        <label for="GACustom">Custom Pricing</label>
                                      </div>

                                      {showGACustom ? (
                                        <div
                                          style={{
                                            display: "grid",
                                            gridTemplateColumns: "120px 120px 120px",
                                            fontWeight: "400",
                                            border: "1px solid black"
                                          }}>
                                            <div>
                                              <select
                                                style={{width: "65px"}}
                                                type="number"
                                                name="ticketAmount"
                                                required
                                              >
                                                <option>0</option>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                                <option>6</option>
                                              </select>
                                            </div>
                                            <div>

                                            <input
                                              style={{width: "60px", border: "1px solid grey"}}
                                                type="text"
                                                name="message"
                                              />
                                            </div>
                                                
                                            <div>
                                              $20.00
                                            </div>
                                          </div>
                                      ) :
                                        null
                                      }


                                </div>


                        </div>




                  ) :
                    null
                  }
                </div>

                          */



            /*
        } else if (!isLoading && isSuccessfull) {
            //console.log("eventDescriptions.length: zero: ", eventDescriptions.length);
            console.log("zero events");
            return (
                <div style={{ textAlign: "center", fontSize: "20px" }}>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>You currently have no events.
                </div>
            )
        } else if (!isLoading && !isSuccessfull) {
            return (
                <div className={classes.SystemDownMessage}>
                    <br></br>
                    <br></br>
                    <br></br>
                    <div className={classes.SummaryHeader}>
                        System error please reload/refresh this page.
                    </div>
                    
                    <br></br>
                    <div style={{textAlign: "center"}}>
                        <Button className={classes.EventsButton}
                            style={{
                                backgroundColor: "white",
                                border: "1px solid blue",
                                color: "blue",
                                padding: "0px"
                            }}
                            content="Reload Page"
                            onClick={() => {
                                window.location.reload();
                                return false;
                            }}
                        />
                    </div>
                </div>
            )
        } else {
            return null;
        }
        */