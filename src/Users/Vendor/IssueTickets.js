import React, { useEffect, useState, Fragment } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Button } from "semantic-ui-react";

import { API } from "../../config";
import OrderModal from "./Modals/OrderModal";

import classes from "./IssueTickets.module.css";

const ManualOrderEntry = (props) => {
  const [selectedEventDetails, setSelectedEventDetails] = useState({}); //event details of a single selected event
  const [ticketDetails, setTicketDetails] = useState([]); //ticket details of a single selected event
  const [order, setOrder] = useState({
    recipient: {
      firstName: "",
      lastName: "",
      email: "",
      message: ""
    },
    tickets: []
  }); //manual generated ticket order

  const [orderView, setOrderView] = useState("complete"); // complete, noTickets, or noEventSelected
  const [modalView, setModalView] = useState("hide");
  const [isLoading, setIsLoading] = useState(false);

  const [recipientFirstNameWarning, setRecipientFirstNameWarning] = useState(false);
  const [recipientLastNameWarning, setRecipientLastNameWarning] = useState(false);
  const [recipientEmailWarning, setRecipientEmailWarning] = useState(false);
  const [recipientMessageWarning, setRecipientMessageWarning] = useState(false);

  const paymentTypes = ["cash", "CashApp", "Venmo", "Paypal", "Bitcoin", "Ethereum", "other"]

  const loadEventData = (eventNum) => {
    let tempEvents = JSON.parse(localStorage.getItem("events"));

    tempEvents.forEach((event, index) => {
      if (event.eventNum === eventNum) {
        setSelectedEventDetails(event);
        let tempTicketDetails = [];

        if ("tickets" in event && event.tickets.length > 0) {
          event.tickets.forEach((ticket, index) => {
            let ticketsAvailableArray = [];
            let maxAmount;
            let i;

            if (ticket.maxTicketsAllowedPerOrder) {
              maxAmount = Math.min(
                ticket.maxTicketsAllowedPerOrder,
                ticket.remainingQuantity
              );
            } else {
              maxAmount = Math.min(10, ticket.remainingQuantity);
            }

            for (i = 1; i <= maxAmount; i++) {
              ticketsAvailableArray.push(i);
            }
            let newTicketKey = Math.floor(Math.random() * 1000000000000000);
            tempTicketDetails.push({
              key: newTicketKey,
              ticketName: ticket.ticketName,
              ticketId: ticket._id,
              ticketPrice: ticket.currentTicketPrice,
              ticketQuantity: ticket.remainingQuantity,
              maxTicketsAvailable: ticketsAvailableArray,
              currency: ticket.currency
            })
          })
        }

        setTicketDetails(tempTicketDetails);

        if (tempTicketDetails.length > 0) {
          let addedTicket = newTicket(tempTicketDetails[0]);
          let tempOrder={...order};
          tempOrder.tickets=[addedTicket]
          setOrder(tempOrder);
        }
      }
    })
  }
  
  const newTicket = (ticket) => {
    let ticketKey = Math.floor(Math.random() * 1000000000000000);
    let addedTicket = {};
    addedTicket.key = ticketKey;
    addedTicket.ticketName = ticket.ticketName;
    addedTicket.ticketId = ticket.ticketId;
    addedTicket.availTickets = ticket.ticketQuantity;
    addedTicket.faceValue = parseFloat(ticket.ticketPrice).toFixed(2);
    addedTicket.numTickets = 1;
    addedTicket.maxTicketsAvailable = ticket.maxTicketsAvailable;
    addedTicket.chargedPrice = parseFloat(ticket.ticketPrice).toFixed(2);
    addedTicket.chargedPriceWarning = "";
    addedTicket.compTicket = false;
    addedTicket.subTotal = parseFloat(addedTicket.numTickets) * parseFloat(addedTicket.chargedPrice);
    addedTicket.priceInput = "ticket";
    addedTicket.paymentType = "cash";
    console.log("addedTicket: ", addedTicket);
    return addedTicket;
  }
  
  useEffect(() => {
    setIsLoading(true);
    if (typeof window !== "undefined" && localStorage.getItem(`user`) !== null) {

      if (localStorage.getItem(`events`) !== null) {
        let storedEvents = JSON.parse(localStorage.getItem("events"));

        if (storedEvents.length > 0) {
          
          if (localStorage.getItem(`eventNum`) !== null) {
            let storedEventNum = JSON.parse(localStorage.getItem("eventNum"));
            let eventExists = false;
            storedEvents.forEach((event, index) => {
              if (event.eventNum === storedEventNum) {
                loadEventData(storedEventNum);
                eventExists = true;

                if ("tickets" in event && event.tickets.length > 0) {
                  setOrderView("complete");

                } else {
                  setOrderView("noTickets");
                }
              }
            })

            if (!eventExists) {
              props.clicked("events")
            }

          } else {
            setOrderView("noEventSelected");
          }

        } else {
          props.clicked("events")
        }

      } else {
        props.clicked("events")
      }
        
    } else {
      window.location.href = "/signin";
    }

    setIsLoading(false);
  }, []);

  const orderDisplay = () => {
    if (orderView === "complete") {
      return (
        <div>
          {recipientDisplay()}
          {ticketCart()}
        </div>
      )
    } else if (orderView === "noEventSelected") {
      return (
        <div style={{fontSize: "16px", paddingLeft: "20px"}}>
          <div  style={{paddingTop: "20px"}}>
            You must first
            <button
              className={classes.NoButton}
              onClick={() => {props.clicked("events")}}
            >
            {" "}select{" "}
            </button>
            an event
          </div>
        </div>
      )
    } else if (orderView === "noTickets") {
      return (
        <div  style={{fontSize: "16px", paddingLeft: "20px"}}>
          <div  style={{paddingTop: "20px"}}>There are no tickets associated with this event.</div>
          <div  style={{paddingTop: "20px"}}>
            Either
            <button
              className={classes.NoButton}
              onClick={editEvent}
            >
            {" "}edit{" "}
            </button>
            this event to include tickets.
          </div>
          <div  style={{paddingTop: "20px"}}
            >Or,
            <button
              className={classes.NoButton}
              onClick={() => {props.clicked("events")}}
            >
            {" "}select{" "}
            </button>
            a different event.
          </div>
        </div>
      )
    }
    else {
      return null;
    }
  }
  
  const handleErrors = response => {
    console.log ("inside handleErrors ", response);
    if (!response.ok) {
        throw Error(response.status);
    }
    return response;
  };

  const submitOrder = () => {
    let newOrder = {};
    let ticketArray = [];
    newOrder.firstName = order.recipient.firstName;
    newOrder.lastName = order.recipient.lastName;
    newOrder.email = order.recipient.email;
    newOrder.message = order.recipient.message;
    newOrder.eventNum = selectedEventDetails.eventNum;
    
    order.tickets.forEach((ticket, index) => {
      let tempObject = {};
      tempObject.key = ticket.key;
      tempObject.ticketID = ticket.ticketId;
      tempObject.ticketsSelected = ticket.numTickets;
      tempObject.ticketName = ticket.ticketName;
      if (ticket.chargedPrice === "0.00") {
        tempObject.ticketPrice = 0;
        tempObject.paymentMethod = "cash";
      } else {
        tempObject.ticketPrice = ticket.chargedPrice;
        tempObject.paymentMethod = ticket.paymentType;
      }
      ticketArray.push(tempObject);
    });
    
    newOrder.tickets = ticketArray;
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let url = `${API}/free/manualTickets`;
    let fetcharg ={
        method: "POST",
        headers: myHeaders,
        body:JSON.stringify (newOrder),
    };
    console.log("fetching with: ", url, fetcharg);
    
    // NEED TO EDIT START
    fetch(url, fetcharg )
    .then(handleErrors)
    .then ((response)=>{
        console.log ("then response: ", response);
        return response.json()})
    .then ((data)=>{
        console.log ("fetch return got back data:", data);
        setModalView("confirmation")
    })
    .catch ((error)=>{
        console.log("freeTicketHandler() error.message: ", error.message);
        setModalView("error")
    })
  }
  // NEED TO EDIT END

  const addNewTicket = () => {
    if (ticketDetails.length > 0) {
      let addedTicket = newTicket(ticketDetails[0])
      let tempOrder={...order};
      let tempTickets=[...tempOrder.tickets];
      tempTickets.push(addedTicket)
      tempOrder.tickets=tempTickets
      setOrder(tempOrder);
    }
  }
  
  const changeTicket = (event, key) => {
    let tempOrder = {...order};
    let tempTickets = [...tempOrder.tickets];

    let priceRegex = /^(0|0\.|0\.[0-9]|0\.[0-9][0-9]|\.|\.[0-9]|\.[0-9][0-9]|[1-9][0-9]+|[1-9][0-9]+\.|[1-9][0-9]+\.[0-9]|[1-9][0-9]+\.[0-9][0-9]|[0-9]| [0-9]\.|[0-9]\.[0-9]|[0-9]\.[0-9][0-9]|)$/;

    tempTickets.forEach((ticket, index) => {
      if (ticket.key === key) {

        if (event.target.name === "ticketName") {
          ticket.ticketName = event.target.value;

          ticketDetails.forEach((eventTicket, index) => {
            if (eventTicket.ticketName === event.target.value) {
              ticket.ticketName = eventTicket.ticketName;
              ticket.ticketId = eventTicket.ticketId;
              ticket.availTickets = eventTicket.ticketQuantity;
              ticket.maxTicketsAvailable = eventTicket.maxTicketsAvailable;
              ticket.faceValue = parseFloat(eventTicket.ticketPrice).toFixed(2);
              if (ticket.compTicket) {
                ticket.chargedPrice = parseFloat(0).toFixed(2);
              } else {
                ticket.chargedPrice = parseFloat(eventTicket.ticketPrice).toFixed(2);
              }
              ticket.chargedPriceWarning = "";
              ticket.paymentType = "cash";
              ticket.subTotal = parseFloat(ticket.numTickets) * parseFloat(ticket.chargedPrice);
            }
          })

        } else if (event.target.name === "numTickets") {
          ticket.numTickets = event.target.value;
          ticket.subTotal = parseFloat(ticket.numTickets) * parseFloat(ticket.chargedPrice);

        } else if (event.target.name === "compTicket") {
          ticket.compTicket = !ticket.compTicket
          if (!ticket.compTicket) {
            ticket.chargedPrice = parseFloat(ticket.faceValue).toFixed(2);
            ticket.paymentType = "cash";
          } else {
            ticket.chargedPrice = parseFloat(0).toFixed(2);
            ticket.paymentType = "cash";
          }
          ticket.chargedPriceWarning = "";
          ticket.subTotal = parseFloat(ticket.numTickets) * parseFloat(ticket.chargedPrice);

        } else if (event.target.name === "chargedPrice") {
          ticket.chargedPrice = event.target.value;
          if (ticket.chargedPrice === "") {
            ticket.chargedPriceWarning = ""
            ticket.subTotal = parseFloat(0).toFixed(2);

          } else if (isNaN(ticket.chargedPrice)) {
            ticket.chargedPriceWarning = "Not a valid number";
            ticket.subTotal = "NaN"

          } else if (priceRegex.test(ticket.chargedPrice)){
            ticket.chargedPriceWarning = ""
            ticket.subTotal = parseFloat(ticket.numTickets) * parseFloat(ticket.chargedPrice);

          } else {
            ticket.chargedPriceWarning = "Not a valid price"
            ticket.subTotal = parseFloat(ticket.numTickets) * parseFloat(ticket.chargedPrice);
          }

        } else if (event.target.name === "paymentType") {
          ticket.paymentType = event.target.value;
        }
      }
    })

    tempOrder.tickets = tempTickets
    setOrder(tempOrder);
  }
  
  const deleteTickets = (key) => {
    if (order.tickets.length === 1) {
      console.log("Only 1 ticket in order")
      let addedTicket = newTicket(ticketDetails[0]);
      let tempOrder={...order};
      tempOrder.tickets=[addedTicket]
      setOrder(tempOrder);
    } else {
      let tempOrder = {...order};
      let tempTickets = [...tempOrder.tickets]
      tempTickets.forEach((ticket, index) => {
        if (ticket.key === key) {
          tempTickets.splice(index, 1);
        }
      })
      tempOrder.tickets = tempTickets;
      setOrder(tempOrder)
    }
  };

  const editEvent = () => {
    let eventNum = JSON.parse(localStorage.getItem("eventNum"));
    window.location.href = `/eventedit/?eventID=${eventNum}`;
  }

  const ticketCart = () => {
    if (!isLoading && ticketDetails.length > 0) {
      return (
        <div className={classes.CartDisplay}>
          <div style={{fontSize: "16px", fontWeight: "600", paddingBottom: "15px"}}>Ticket Cart</div>
          <div className={classes.TicketHeaders}>
            <div>Ticket Type</div>
            <div style={{textAlign: "center"}}># Tickets</div>
            <div style={{textAlign: "center"}}>Comp</div>
            <div style={{textAlign: "center"}}>Price</div>
            <div style={{paddingLeft: "10px"}}>Payment Type</div>
            <div style={{textAlign: "center"}}>Total</div>
          </div>
          <div style={{width: "680px", borderBottom: "1px solid black", paddingTop: "10px"}}>
            {order.tickets.map(ticket => {
              let priceBox;
              if (ticket.chargedPriceWarning === "") {
                priceBox = classes.PriceBox;
              } else {
                priceBox = classes.PriceBoxWarning;
              }
              return (
                <div>
                  <div className={classes.TicketCart}>
                    <div>
                      <select
                        className={classes.TicketNameSelect}
                        type="text"
                        name="ticketName"
                        required
                        value={ticket.ticketName}
                        onChange={(event) => {
                          changeTicket(event, ticket.key)
                        }}
                      >
                        {ticketDetails.map(ticket2 => {return (<option>{ticket2.ticketName}</option>)})}
                      </select>
                    </div>
                    <div>
                      <select
                        className={classes.TicketNumberSelect}
                        type="number"
                        name="numTickets"
                        value={ticket.numTickets}
                        required
                        onChange={(event) => {changeTicket(event, ticket.key)}}
                      >
                        {ticket.maxTicketsAvailable.map(number => {return <option>{number}</option>})}
                      </select>
                    </div>
                    <div style={{paddingTop: "2.5px", paddingLeft: "12px"}}>
                      <input
                        type="checkbox"
                        id=""
                        name="compTicket"
                        className={classes.Checkbox}
                        checked={ticket.compTicket}
                        onChange={(event) => {changeTicket(event, ticket.key)}}
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
                        onChange={(event) => {changeTicket(event, ticket.key)}}
                      />
                    </div>
                    <div style={{paddingLeft: "10px"}}>
                      <select
                      className={classes.PaymentTypeSelect}
                          type="payment"
                          name="paymentType"
                          required
                          disabled={ticket.compTicket}
                          value={ticket.paymentType}
                          onChange={(event) => {changeTicket(event, ticket.key)}}
                      >
                        {paymentTypes.map((type, index) => {return <option>{type}</option>})}
                      </select>
                    </div>
                    <div style={{paddingRight: "10px", textAlign: "right", fontWeight: "400"}}>{parseFloat(ticket.subTotal).toFixed(2)}</div>
                    <div style={{textAlign: "center"}}>
                      <FontAwesomeIcon
                        color="blue"
                        cursor="pointer"
                        onClick={() => {deleteTickets(ticket.key)}}
                        icon={faTrashAlt}
                      />
                    </div>
                  </div>
                  <div className={classes.ChargedPriceWarning}>
                    {ticket.chargedPriceWarning}
                  </div>
                </div>
              )
            })}
          </div>
          <div className={classes.TicketCartButtons}>
            <div style={{width: "320px", textAlign: "right"}}>
              <Button
                className={classes.RegularButton}
                style={{fontWeight: "600", paddingTop: "8px"}}
                icon="plus square outline"
                basic
                color="green"
                content="Additional Ticket"
                onClick={addNewTicket}
              />
            </div>
            <div style={{width: "320px"}}>
              <Button
                style={{backgroundColor: "#fff", border: "1px solid blue", color: "blue", fontWeight: "600", height: "30px", paddingTop: "7px"}}
                disabled={validOrder()}
                icon="edit"
                content="Preview Order"
                onClick={() => {setModalView("review")}}
              />
            </div>
          </div>
          <div className={classes.ValidOrder}>
            {validOrder() ? "complete fields identified above" : null}
          </div>
      </div>)
    } else {
      return null;
    }
  }

  const validOrder = () => {
    let invalid = true;
    let ticketWarnings = false;
    order.tickets.forEach((ticket) => {
      if (ticket.chargedPriceWarning) {ticketWarnings = true}
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
    if (tempRecipient.firstName === "" || tempRecipient.lastName === "" ||
      tempRecipient.email === "" || !regsuper.test(tempRecipient.email)
    ) {
      tempRecipient.completed = false;
    } else {
      tempRecipient.completed = true;
    }
    tempOrder.recipient = tempRecipient;
    setOrder(tempOrder)
  }
  
  const displayMessage = (limit, variable) => {
    if (variable && variable.length >= limit) {
      return (
        <div className={classes.WarningRed} style={{fontWeight: "700"}}>
          Maximum characters used
        </div>
      );
    } else if (variable && variable.length >= limit - 10) {
      return (
        <div className={classes.WarningRed}>
          Remaining {limit - variable.length}
        </div>
      );
    } else if (variable) {
      return (
        <div className={classes.WarningBlack}>
          Remaining {limit - variable.length}
        </div>
      );
    } else {
      return (
        <div className={classes.WarningBlack}>
          Remaining {limit}
        </div>
      );
    }
  };
  
  const recipientDisplay = () => {
    let firstNameBox;
    let lastNameBox;
    let emailBox;
    let emailWarning;

    const regsuper = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
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
        <div className={classes.WarningText}>
          Not a valid email address
        </div>
      )
    } else if (recipientEmailWarning) {
      emailWarning = displayMessage(64, order.recipient.email)
    } else {
      emailWarning = null
    }

    if (ticketDetails.length > 0) {
      return (
        <div className={classes.RecipientDisplay}>
          <div style={{fontSize: "16px", fontWeight: "600", paddingBottom: "15px"}}>
            Ticket Recipient
          </div>
          <div className={classes.NameGrid}>
            <div>
              <label style={{fontSize: "15px", margin: "0px", paddingBottom: "5px"}}>
                First Name<span style={{color: "red"}}>*</span>
              </label>
              <input className={firstNameBox}
                type="text"
                name="firstName"
                placeholder="Limit 32 characters"
                value={order.recipient.firstName}
                maxLength="64"
                onFocus={() => setRecipientFirstNameWarning(true)}
                onBlur={() => setRecipientFirstNameWarning(false)}
                onChange={updateRecipient}
              />
              {recipientFirstNameWarning ? displayMessage(64, order.recipient.firstName) : null}
            </div>
            <div>
              <label style={{fontSize: "15px", margin: "0px", paddingBottom: "5px"}}>
                Last Name<span style={{color: "red"}}>*</span>
              </label>
              <input className={lastNameBox}
                type="text"
                name="lastName"
                placeholder="Limit 32 characters"
                value={order.recipient.lastName}
                maxLength="64"
                onFocus={() => setRecipientLastNameWarning(true)}
                onBlur={() => setRecipientLastNameWarning(false)}
                onChange={updateRecipient}
              />
              {recipientLastNameWarning ? displayMessage(64, order.recipient.lastName) : null}
            </div>
          </div>
          <div style={{width: "660px", paddingBottom: "10px"}}>
            <label style={{fontSize: "15px", margin: "0px", paddingBottom: "5px"}}>
              Email Address<span style={{color: "red"}}>*</span>
            </label>
            <input
              className={emailBox}
              type="email"
              name="email"
              placeholder="Limit 64 characters"
              value={order.recipient.email}
              maxLength="64"
              onFocus={() => setRecipientEmailWarning(true)}
              onBlur={() => setRecipientEmailWarning(false)}
              onChange={updateRecipient}
            />
            <div>{emailWarning}</div>
          </div>
          <div style={{width: "660px", paddingBottom: "0px"}}>
            <label style={{fontSize: "15px", margin: "0px", paddingBottom: "5px"}}>
              Message <span style={{fontStyle: "italic"}}>(internal use only)</span>
            </label>
            <input
              className={classes.InputBox}
              type="text"
              name="message"
              value={order.recipient.message}
              maxLength="64"
              onFocus={() => setRecipientMessageWarning(true)}
              onBlur={() => setRecipientMessageWarning(false)}
              placeholder="Limit 64 characters"
              onChange={updateRecipient}
            />
            {recipientMessageWarning ? displayMessage(64, order.recipient.message) : null}
          </div>
        </div>
      )
    } else return null
  }
  
  const orderModalDisplay = () => {
    if (modalView === "review" || modalView === "confirmation" || modalView === "error") {
      return (
        <Fragment>
          <OrderModal
            show={true}
            status={modalView}
            title={selectedEventDetails.eventTitle}
            dateTime={selectedEventDetails.startDateTime}
            details={order}
            edit={() => {setModalView("hide")}}
            close={() => {
              let tempOrder={...order};
              tempOrder.recipient={
                firstName: "",
                lastName: "",
                email: "",
                message: ""
              };
              tempOrder.tickets=[newTicket(ticketDetails[0])];
              setOrder(tempOrder);
              setModalView("hide");
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
        <div style={{fontWeight: "600", fontSize: "18px"}}>Issue Tickets</div>
        {orderDisplay()}
        {orderModalDisplay()}
      </div>
    )
  }
  
  const tabTitle = (
    <div className={classes.DashboardHeader}>
      {(!isLoading && "eventTitle" in selectedEventDetails) ?
      <div style={{fontSize: "26px", fontWeight: "600"}}>{selectedEventDetails.eventTitle}</div> :
      <div><br></br></div>}
      <div style={{paddingTop: "5px"}}>
      <button
        className={classes.SwitchButton}
        onClick={() => {props.clicked("events")}}
      >
        Switch Event
      </button>
      </div>
    </div>
  )
  
  return (
    <div>
      {tabTitle}
      {mainDisplay()}
    </div>
  )
}

export default ManualOrderEntry;