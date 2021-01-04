import React, { useEffect, useState, Fragment } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Button } from "semantic-ui-react";

import { API } from "../../config";
import ReceiptModal from "./Modals/ReceiptModal";

import classes from "./IssueTickets.module.css";

const ManualOrderEntry = (props) => {
  const [selectedEventTitle, setSelectedEventTitle] = useState(""); //event details of a single selected event

  
  const [selectedEventDetails, setSelectedEventDetails] = useState({}); //event details of a single selected event
  const [ticketDetails, setTicketDetails] = useState([]); //ticket details of a single selected event
  const [order, setOrder] = useState({
    recipient: {
      firstName: "",
      lastName: "",
      email: ""
    },
    tickets: []
  }); //manual generated ticket order

  const [orderView, setOrderView] = useState("complete"); // complete, noTickets, or noEventSelected
  const [modalView, setModalView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  
  
  useEffect(() => {
    setIsLoading(true);
    if (typeof window !== "undefined" && localStorage.getItem(`user`) !== null) {

      if (localStorage.getItem(`events`) !== null) {
        let storedEvents = JSON.parse(localStorage.getItem("events"));
        let storedOrders = JSON.parse(localStorage.getItem("orders"));

          if (localStorage.getItem(`eventNum`) !== null) {
            let storedEventNum = JSON.parse(localStorage.getItem("eventNum"));
            let eventExists = false;
            let ordersExist = false;

            storedEvents.forEach((event, index) => {
              if (event.eventNum === storedEventNum) {
                loadEventData(storedEventNum);
                eventExists = true;
                loadEventTitle(storedEventNum)

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
      window.location.href = "/signin";
    }

    setIsLoading(false);
  }, []);



  const loadEventTitle = (eventNum) => {
    let tempEvents = JSON.parse(localStorage.getItem("events"));
    tempEvents.forEach((event, index) => {
      if (event.eventNum === eventNum) {
        setSelectedEventTitle(event.eventTitle);
      }
    })
  }

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

  const orderDisplay = () => {
    if (orderView === "complete") {
      return (
        <div>
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
                        /*
                        onChange={(event) => {changeTicket(event, ticket.key)}}
                        */
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
                        /*
                        onChange={(event) => {changeTicket(event, ticket.key)}}
                        */
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
                        /*
                        onChange={(event) => {changeTicket(event, ticket.key)}}
                        */
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
                        /*
                        onChange={(event) => {changeTicket(event, ticket.key)}}
                        */
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
                          /*
                          onChange={(event) => {changeTicket(event, ticket.key)}}
                          */
                      ><option>cash</option>
                      </select>
                    </div>
                    <div style={{paddingRight: "10px", textAlign: "right", fontWeight: "400"}}>{parseFloat(ticket.subTotal).toFixed(2)}</div>

                  </div>
                  <div className={classes.ChargedPriceWarning}>
                    {ticket.chargedPriceWarning}
                  </div>
                </div>
              )
            })}
          </div>
          <div className={classes.TicketCartButtons}>
            <div style={{width: "320px"}}>
              <Button
                style={{backgroundColor: "#fff", border: "1px solid blue", color: "blue", fontWeight: "600", height: "30px", paddingTop: "7px"}}
                disabled={false}
                icon="edit"
                content="SEE RECEIPT"
                onClick={() => {setModalView(true)}}
              />
            </div>
          </div>
      </div>)
    } else {
      return null;
    }
  }
  
  const receiptModalDisplay = () => {
    if (modalView) {
      return (
        <Fragment>
          <ReceiptModal
            show={true}
            status={modalView}
            title={selectedEventDetails.eventTitle}
            dateTime={selectedEventDetails.startDateTime}
            details={order}
            close={() => {setModalView(false)}}
          ></ReceiptModal>
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
        {receiptModalDisplay()}
      </div>
    )
  }
  
  const tabTitle = (
    <div className={classes.DashboardHeader}>
      {(!isLoading && "eventTitle" in selectedEventDetails) ?
      <div style={{fontSize: "26px", fontWeight: "600"}}>{selectedEventDetails.eventTitle}</div> :
      <div><br>
      </br></div>}
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