import React, { useEffect, useState, Fragment } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import { API } from "../../config";
import OrderModal from "./Modals/OrderModal";
import Spinner from "../../components/UI/Spinner/Spinner";

import classes from "./IssueTickets.module.css";

const IssueTickets = (props) => {
  const [display, setDisplay] = useState("spinner"); //main, spinner, connection
  const [modalView, setModalView] = useState("none");
<<<<<<< HEAD

=======
  
>>>>>>> master
  const [selectedEventDetails, setSelectedEventDetails] = useState({}); //event details of a single selected event
  const [ticketDetails, setTicketDetails] = useState([]); //ticket details of a single selected event
  const [order, setOrder] = useState({
    recipient: {
      firstname: "",
      lastname: "",
      email: "",
<<<<<<< HEAD
      message: "",
    },
    tickets: [],
=======
      message: ""
    },
    tickets: []
>>>>>>> master
  }); //manual generated ticket order

  const [customerInformation, setCustomerInformation] = useState({});

  // THESE LOOK GOOD: 1/29/21
<<<<<<< HEAD
  const [recipientFirstNameWarning, setRecipientFirstNameWarning] = useState(
    false
  );
  const [recipientLastNameWarning, setRecipientLastNameWarning] = useState(
    false
  );
  const [recipientEmailWarning, setRecipientEmailWarning] = useState(false);
  const [recipientMessageWarning, setRecipientMessageWarning] = useState(false);

  const paymentTypes = [
    "cash",
    "CashApp",
    "Venmo",
    "Paypal",
    "Bitcoin",
    "Ethereum",
    "Dogecoin",
    "other",
  ];
=======
  const [recipientFirstNameWarning, setRecipientFirstNameWarning] = useState(false);
  const [recipientLastNameWarning, setRecipientLastNameWarning] = useState(false);
  const [recipientEmailWarning, setRecipientEmailWarning] = useState(false);
  const [recipientMessageWarning, setRecipientMessageWarning] = useState(false);

  const paymentTypes = ["cash", "CashApp", "Venmo", "Paypal", "Bitcoin", "Ethereum", "other"]
>>>>>>> master

  // LOOKS GOOD: 1/26/21
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
<<<<<<< HEAD
              currency: ticket.currency,
            });
          });
=======
              currency: ticket.currency
            })
          })
>>>>>>> master
        }

        setTicketDetails(tempTicketDetails);

        if (tempTicketDetails.length > 0) {
          let addedTicket = newTicket(tempTicketDetails[0]);
<<<<<<< HEAD
          let tempOrder = { ...order };
          tempOrder.tickets = [addedTicket];
          setOrder(tempOrder);
        }
      }
    });
  };

=======
          let tempOrder={...order};
          tempOrder.tickets=[addedTicket]
          setOrder(tempOrder);
        }
      }
    })
  }
  
>>>>>>> master
  // LOOKS GOOD: 1/26/21
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
<<<<<<< HEAD
    addedTicket.subtotal =
      parseFloat(addedTicket.numTickets) * parseFloat(addedTicket.chargedPrice);
    addedTicket.priceInput = "ticket";
    addedTicket.paymentType = "cash";
    return addedTicket;
  };

  // LOOKS GOOD: 1/26/21
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
=======
    addedTicket.subtotal = parseFloat(addedTicket.numTickets) * parseFloat(addedTicket.chargedPrice);
    addedTicket.priceInput = "ticket";
    addedTicket.paymentType = "cash";
    return addedTicket;
  }
  
  // LOOKS GOOD: 1/26/21
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(`user`) !== null) {
>>>>>>> master
      if (
        localStorage.getItem(`events`) !== null &&
        localStorage.getItem(`eventNum`) !== null
      ) {
        let storedEvents = JSON.parse(localStorage.getItem("events"));

        let storedEventNum = JSON.parse(localStorage.getItem("eventNum"));

        let tempUser = JSON.parse(localStorage.getItem("user"));
<<<<<<< HEAD
        setCustomerInformation({
          sessionToken: tempUser.token,
          userId: tempUser.user._id,
        });

        storedEvents.forEach((event) => {
          if (event.eventNum === storedEventNum) {
            loadEventData(storedEventNum);
          }
        });
      } else {
        props.clicked("events");
      }
=======
          setCustomerInformation({
            sessionToken: tempUser.token,
            userId: tempUser.user._id
        });




        storedEvents.forEach(event => {
          if (event.eventNum === storedEventNum) {
            loadEventData(storedEventNum);
          }
        })

      } else {
        props.clicked("events")
      }
        
>>>>>>> master
    } else {
      window.location.href = "/auth";
    }
    setDisplay("main");
  }, []);
<<<<<<< HEAD

  // LOOKS GOOD: 1/29/21
  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
=======
  
  // LOOKS GOOD: 1/29/21
  const handleErrors = response => {
    console.log ("inside handleErrors ", response);
    if (!response.ok) {
        throw Error(response.status);
>>>>>>> master
    }
    return response;
  };

  const submitOrder = (allTotal) => {
<<<<<<< HEAD
    console.log("allTotal: ", allTotal);
=======
    console.log("allTotal: ", allTotal)
>>>>>>> master
    let newOrder = {};
    let ticketArray = [];
    newOrder.firstname = order.recipient.firstname;
    newOrder.lastname = order.recipient.lastname;
    newOrder.email = order.recipient.email;
    newOrder.message = order.recipient.message;
    newOrder.eventNum = selectedEventDetails.eventNum;
<<<<<<< HEAD

    order.tickets.forEach((ticket) => {
=======
    
    order.tickets.forEach(ticket => {
>>>>>>> master
      let tempObject = {};
      tempObject.key = ticket.key;
      tempObject.ticketID = ticket.ticketId;
      tempObject.ticketsSelected = ticket.numTickets;
      tempObject.ticketName = ticket.ticketName;
      if (ticket.chargedPrice === "0.00") {
        tempObject.ticketPrice = 0;
<<<<<<< HEAD
        tempObject.payMethod = "cash";
        tempObject.amt = 0;
      } else {
        tempObject.ticketPrice = ticket.chargedPrice;
        tempObject.payMethod = ticket.paymentType;
        tempObject.amt = ticket.chargedPrice * ticket.numTickets;
      }
      ticketArray.push(tempObject);
    });

    newOrder.totalAmount = allTotal;
    newOrder.tickets = ticketArray;
    console.log("newOrder: ", newOrder);
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      `Bearer ${customerInformation.sessionToken}`
    );

    let url = `${API}/tixorder/offline_order/${customerInformation.userId}`;
    let fetcharg = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(newOrder),
    };
    console.log("fetching with: ", url, fetcharg);

    fetch(url, fetcharg)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        setModalView("confirmation");
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setModalView("error");
      });
  };
=======
        tempObject.paymentMethod = "cash";
      } else {
        tempObject.ticketPrice = ticket.chargedPrice;
        tempObject.paymentMethod = ticket.paymentType;
      }
      ticketArray.push(tempObject);
    });
    
    newOrder.totalAmount = allTotal;
    newOrder.tickets = ticketArray;
    console.log("newOrder: ", newOrder)
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${customerInformation.sessionToken}`);

    let url = `${API}/tixorder/manual_order/${customerInformation.userId}`;
    let fetcharg ={
      method: "POST",
      headers: myHeaders,
      body:JSON.stringify (newOrder),
    };
    console.log("fetching with: ", url, fetcharg);
    
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
>>>>>>> master

  // LOOKS GOOD: 1/26/21
  const addNewTicket = () => {
    if (ticketDetails.length > 0) {
<<<<<<< HEAD
      let addedTicket = newTicket(ticketDetails[0]);
      let tempOrder = { ...order };
      let tempTickets = [...tempOrder.tickets];
      tempTickets.push(addedTicket);
      tempOrder.tickets = tempTickets;
      setOrder(tempOrder);
    }
  };

  // I THINK THIS LOOKS GOOD: 1/27/21
  const changeTicket = (event, key) => {
    let tempOrder = { ...order };
=======
      let addedTicket = newTicket(ticketDetails[0])
      let tempOrder={...order};
      let tempTickets=[...tempOrder.tickets];
      tempTickets.push(addedTicket)
      tempOrder.tickets=tempTickets
      setOrder(tempOrder);
    }
  }
  
  // I THINK THIS LOOKS GOOD: 1/27/21
  const changeTicket = (event, key) => {
    let tempOrder = {...order};
>>>>>>> master
    let tempTickets = [...tempOrder.tickets];

    let priceRegex = /^(0|0\.|0\.[0-9]|0\.[0-9][0-9]|\.|\.[0-9]|\.[0-9][0-9]|[1-9][0-9]+|[1-9][0-9]+\.|[1-9][0-9]+\.[0-9]|[1-9][0-9]+\.[0-9][0-9]|[0-9]| [0-9]\.|[0-9]\.[0-9]|[0-9]\.[0-9][0-9]|)$/;

    tempTickets.forEach((ticket, index) => {
      if (ticket.key === key) {
<<<<<<< HEAD
=======

>>>>>>> master
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
<<<<<<< HEAD
                ticket.chargedPrice = parseFloat(
                  eventTicket.ticketPrice
                ).toFixed(2);
              }
              ticket.chargedPriceWarning = "";
              ticket.paymentType = "cash";
              ticket.subtotal =
                parseFloat(ticket.numTickets) * parseFloat(ticket.chargedPrice);
            }
          });
        } else if (event.target.name === "numTickets") {
          ticket.numTickets = event.target.value;
          ticket.subtotal =
            parseFloat(ticket.numTickets) * parseFloat(ticket.chargedPrice);
        } else if (event.target.name === "compTicket") {
          ticket.compTicket = !ticket.compTicket;
=======
                ticket.chargedPrice = parseFloat(eventTicket.ticketPrice).toFixed(2);
              }
              ticket.chargedPriceWarning = "";
              ticket.paymentType = "cash";
              ticket.subtotal = parseFloat(ticket.numTickets) * parseFloat(ticket.chargedPrice);
            }
          })

        } else if (event.target.name === "numTickets") {
          ticket.numTickets = event.target.value;
          ticket.subtotal = parseFloat(ticket.numTickets) * parseFloat(ticket.chargedPrice);

        } else if (event.target.name === "compTicket") {
          ticket.compTicket = !ticket.compTicket
>>>>>>> master
          if (!ticket.compTicket) {
            ticket.chargedPrice = parseFloat(ticket.faceValue).toFixed(2);
          } else {
            ticket.chargedPrice = parseFloat(0).toFixed(2);
          }
          ticket.paymentType = "cash";
          ticket.chargedPriceWarning = "";
<<<<<<< HEAD
          ticket.subtotal =
            parseFloat(ticket.numTickets) * parseFloat(ticket.chargedPrice);
        } else if (event.target.name === "chargedPrice") {
          ticket.chargedPrice = event.target.value;
          if (ticket.chargedPrice === "") {
            ticket.chargedPriceWarning = "";
            ticket.subtotal = parseFloat(0).toFixed(2);
          } else if (isNaN(ticket.chargedPrice)) {
            ticket.chargedPriceWarning = "Not a valid number";
            ticket.subtotal = "NaN";
          } else if (priceRegex.test(ticket.chargedPrice)) {
            ticket.chargedPriceWarning = "";
            ticket.subtotal =
              parseFloat(ticket.numTickets) * parseFloat(ticket.chargedPrice);
          } else {
            ticket.chargedPriceWarning = "Not a valid price";
            ticket.subtotal =
              parseFloat(ticket.numTickets) * parseFloat(ticket.chargedPrice);
          }
=======
          ticket.subtotal = parseFloat(ticket.numTickets) * parseFloat(ticket.chargedPrice);

        } else if (event.target.name === "chargedPrice") {
          ticket.chargedPrice = event.target.value;
          if (ticket.chargedPrice === "") {
            ticket.chargedPriceWarning = ""
            ticket.subtotal = parseFloat(0).toFixed(2);

          } else if (isNaN(ticket.chargedPrice)) {
            ticket.chargedPriceWarning = "Not a valid number";
            ticket.subtotal = "NaN"

          } else if (priceRegex.test(ticket.chargedPrice)) {
            ticket.chargedPriceWarning = ""
            ticket.subtotal = parseFloat(ticket.numTickets) * parseFloat(ticket.chargedPrice);

          } else {
            ticket.chargedPriceWarning = "Not a valid price"
            ticket.subtotal = parseFloat(ticket.numTickets) * parseFloat(ticket.chargedPrice);
          }

>>>>>>> master
        } else if (event.target.name === "paymentType") {
          ticket.paymentType = event.target.value;
        }
      }
<<<<<<< HEAD
    });

    tempOrder.tickets = tempTickets;
    setOrder(tempOrder);
  };

  // I THINK THIS LOOKS GOOD: 1/27/21
  const deleteTickets = (key) => {
    if (order.tickets.length === 1) {
      console.log("Only 1 ticket in order");
      let addedTicket = newTicket(ticketDetails[0]);
      let tempOrder = { ...order };
      tempOrder.tickets = [addedTicket];
      setOrder(tempOrder);
    } else {
      let tempOrder = { ...order };
      let tempTickets = [...tempOrder.tickets];
=======
    })

    tempOrder.tickets = tempTickets
    setOrder(tempOrder);
  }
  
  // I THINK THIS LOOKS GOOD: 1/27/21
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
>>>>>>> master
      tempTickets.forEach((ticket, index) => {
        if (ticket.key === key) {
          tempTickets.splice(index, 1);
        }
<<<<<<< HEAD
      });
      tempOrder.tickets = tempTickets;
      setOrder(tempOrder);
=======
      })
      tempOrder.tickets = tempTickets;
      setOrder(tempOrder)
>>>>>>> master
    }
  };

  // LOOK GOOD: 1/27/21
  const validOrder = () => {
    let invalid = true;
    let ticketWarnings = false;
    order.tickets.forEach((ticket) => {
      if (ticket.chargedPriceWarning) {
<<<<<<< HEAD
        ticketWarnings = true;
      }
    });
    if (
      order.tickets.length > 0 &&
      order.recipient.completed === true &&
      !ticketWarnings
    ) {
      invalid = false;
    }
    return invalid;
  };
=======
        ticketWarnings = true
      }
    })
    if(order.tickets.length > 0 && order.recipient.completed === true && !ticketWarnings) {
      invalid = false;
    }
    return invalid;
  }
>>>>>>> master

  // LOOKS GOOD: 1/27/21
  const controlButtons = (
    <Fragment>
      <div className={classes.TicketCartButtons}>
<<<<<<< HEAD
        <div style={{ width: "320px", textAlign: "right" }}>
          <button className={classes.ButtonGreen} onClick={addNewTicket}>
            ADDITIONAL TICKET
          </button>
        </div>
        <div style={{ width: "320px" }}>
          <button
            className={
              !validOrder() ? classes.ButtonBlue : classes.ButtonBlueOpac
            }
            disabled={validOrder()}
            onClick={() => {
              setModalView("review");
            }}
          >
            PREVIEW ORDER
          </button>
=======
        <div style={{width: "320px", textAlign: "right"}}>
          <button
            className={classes.ButtonGreen}
            onClick={addNewTicket}
          >ADDITIONAL TICKET</button>
        </div>
        <div style={{width: "320px"}}>
          <button className={!validOrder() ? classes.ButtonBlue : classes.ButtonBlueOpac}
            disabled={validOrder()}
            onClick={() => {setModalView("review")}}
          >PREVIEW ORDER</button>
>>>>>>> master
        </div>
      </div>
      <div className={classes.ValidOrder}>
        {validOrder() ? "complete fields identified above" : null}
      </div>
    </Fragment>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> master

  const ticketCart = () => {
    if (display === "main" && ticketDetails.length > 0) {
      return (
        <div className={classes.CartDisplay}>
<<<<<<< HEAD
          <div
            style={{
              fontSize: "16px",
              fontWeight: "600",
              paddingBottom: "15px",
            }}
          >
            Ticket Cart
          </div>
          <div className={classes.TicketHeaders}>
            <div>Ticket Type</div>
            <div style={{ textAlign: "center" }}># Tickets</div>
            <div style={{ textAlign: "center" }}>Comp</div>
            <div style={{ textAlign: "center" }}>Price</div>
            <div style={{ paddingLeft: "10px" }}>Payment Type</div>
            <div style={{ textAlign: "center" }}>Total</div>
          </div>
          <div
            style={{
              width: "680px",
              borderBottom: "1px solid black",
              paddingTop: "10px",
            }}
          >
            {order.tickets.map((ticket) => {
=======
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
>>>>>>> master
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
<<<<<<< HEAD
                          changeTicket(event, ticket.key);
                        }}
                      >
                        {ticketDetails.map((ticket2, index) => {
                          return (
                            <option key={index}>{ticket2.ticketName}</option>
                          );
                        })}
=======
                          changeTicket(event, ticket.key)
                        }}
                      >
                        {ticketDetails.map((ticket2, index) => {return (<option key={index}>{ticket2.ticketName}</option>)})}
>>>>>>> master
                      </select>
                    </div>
                    <div>
                      <select
                        className={classes.TicketNumberSelect}
                        type="number"
                        name="numTickets"
                        value={ticket.numTickets}
                        required
<<<<<<< HEAD
                        onChange={(event) => {
                          changeTicket(event, ticket.key);
                        }}
                      >
                        {ticket.maxTicketsAvailable.map((number) => {
                          return <option>{number}</option>;
                        })}
                      </select>
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        paddingTop: "5px",
                        paddingLeft: "12px",
                      }}
                    >
=======
                        onChange={(event) => {changeTicket(event, ticket.key)}}
                      >
                        {ticket.maxTicketsAvailable.map(number => {return <option>{number}</option>})}
                      </select>
                    </div>
                    <div style={{fontSize: "12px", paddingTop: "5px", paddingLeft: "12px"}}>
>>>>>>> master
                      <input
                        type="checkbox"
                        id=""
                        name="compTicket"
                        className={classes.Checkbox}
                        checked={ticket.compTicket}
<<<<<<< HEAD
                        onChange={(event) => {
                          changeTicket(event, ticket.key);
                        }}
=======
                        onChange={(event) => {changeTicket(event, ticket.key)}}
>>>>>>> master
                      />
                    </div>
                    <div>
                      <input
                        className={priceBox}
                        type="number decimal"
                        step=".01"
                        name="chargedPrice"
<<<<<<< HEAD
                        disabled={ticket.compTicket}
                        value={ticket.chargedPrice}
                        onChange={(event) => {
                          changeTicket(event, ticket.key);
                        }}
                      />
                    </div>
                    <div style={{ paddingLeft: "10px" }}>
                      <select
                        className={classes.PaymentTypeSelect}
                        type="payment"
                        name="paymentType"
                        required
                        disabled={ticket.compTicket}
                        value={ticket.paymentType}
                        onChange={(event) => {
                          changeTicket(event, ticket.key);
                        }}
                      >
                        {paymentTypes.map((type, index) => {
                          return <option>{type}</option>;
                        })}
                      </select>
                    </div>
                    <div
                      style={{
                        paddingTop: "4px",
                        fontSize: "16px",
                        paddingRight: "10px",
                        textAlign: "right",
                        fontWeight: "400",
                      }}
                    >
                      {parseFloat(ticket.subtotal).toFixed(2)}
                    </div>
                    <div style={{ textAlign: "center", paddingTop: "4px" }}>
                      <FontAwesomeIcon
                        color="blue"
                        cursor="pointer"
                        onClick={() => {
                          deleteTickets(ticket.key);
                        }}
=======
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
                    <div style={{paddingTop: "4px", fontSize: "16px", paddingRight: "10px", textAlign: "right", fontWeight: "400"}}>{parseFloat(ticket.subtotal).toFixed(2)}</div>
                    <div style={{textAlign: "center", paddingTop: "4px"}}>
                      <FontAwesomeIcon
                        color="blue"
                        cursor="pointer"
                        onClick={() => {deleteTickets(ticket.key)}}
>>>>>>> master
                        icon={faTrashAlt}
                      />
                    </div>
                  </div>
                  <div className={classes.ChargedPriceWarning}>
                    {ticket.chargedPriceWarning}
                  </div>
                </div>
<<<<<<< HEAD
              );
            })}
          </div>
          {controlButtons}
        </div>
      );
    } else {
      return null;
    }
  };

  // LOOKS GOOD: 1/27/21
  const updateRecipient = (event) => {
    const regsuper = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let tempOrder = { ...order };
    let tempRecipient = { ...tempOrder.recipient };

    tempRecipient[event.target.name] = event.target.value;
    if (
      tempRecipient.firstname === "" ||
      tempRecipient.lastname === "" ||
      tempRecipient.email === "" ||
      !regsuper.test(tempRecipient.email)
=======
              )
            })}
          </div>
          {controlButtons}
      </div>)
    } else {
      return null;
    }
  }
  
  // LOOKS GOOD: 1/27/21
  const updateRecipient = (event) => {
    const regsuper = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let tempOrder = {...order};
    let tempRecipient = {...tempOrder.recipient};

    tempRecipient[event.target.name] = event.target.value;
    if (tempRecipient.firstname === "" || tempRecipient.lastname === "" ||
      tempRecipient.email === "" || !regsuper.test(tempRecipient.email)
>>>>>>> master
    ) {
      tempRecipient.completed = false;
    } else {
      tempRecipient.completed = true;
    }
    tempOrder.recipient = tempRecipient;
<<<<<<< HEAD
    setOrder(tempOrder);
  };

=======
    setOrder(tempOrder)
  }
  
>>>>>>> master
  // LOOKS GOOD: 1/27/21
  const displayMessage = (limit, variable) => {
    if (variable && variable.length >= limit) {
      return (
<<<<<<< HEAD
        <div className={classes.WarningRed} style={{ fontWeight: "700" }}>
=======
        <div className={classes.WarningRed} style={{fontWeight: "700"}}>
>>>>>>> master
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
<<<<<<< HEAD
      return <div className={classes.WarningBlack}>Remaining {limit}</div>;
    }
  };

=======
      return (
        <div className={classes.WarningBlack}>
          Remaining {limit}
        </div>
      );
    }
  };
  
>>>>>>> master
  // LOOKS GOOD: 1/27/21
  const recipientDisplay = () => {
    let emailBox;
    let emailWarning;

    const regsuper = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
<<<<<<< HEAD

=======
    
>>>>>>> master
    if (order.recipient.email !== "" && !regsuper.test(order.recipient.email)) {
      emailBox = classes.EmailBoxWarning;
    } else {
      emailBox = classes.EmailBox;
    }

    if (order.recipient.email && !regsuper.test(order.recipient.email)) {
      emailWarning = (
<<<<<<< HEAD
        <div className={classes.WarningText}>Not a valid email address</div>
      );
    } else if (recipientEmailWarning) {
      emailWarning = displayMessage(64, order.recipient.email);
    } else {
      emailWarning = null;
=======
        <div className={classes.WarningText}>
          Not a valid email address
        </div>
      )
    } else if (recipientEmailWarning) {
      emailWarning = displayMessage(64, order.recipient.email)
    } else {
      emailWarning = null
>>>>>>> master
    }

    if (ticketDetails.length > 0) {
      return (
        <div className={classes.RecipientDisplay}>
<<<<<<< HEAD
          <div
            style={{
              fontSize: "16px",
              fontWeight: "600",
              paddingBottom: "15px",
            }}
          >
=======
          <div style={{fontSize: "16px", fontWeight: "600", paddingBottom: "15px"}}>
>>>>>>> master
            Ticket Recipient
          </div>
          <div className={classes.NameGrid}>
            <div>
<<<<<<< HEAD
              <label
                style={{
                  fontSize: "15px",
                  margin: "0px",
                  paddingBottom: "5px",
                }}
              >
                First Name<span style={{ color: "red" }}>*</span>
              </label>
              <input
                className={classes.FirstNameBox}
=======
              <label style={{fontSize: "15px", margin: "0px", paddingBottom: "5px"}}>
                First Name<span style={{color: "red"}}>*</span>
              </label>
              <input className={classes.FirstNameBox}
>>>>>>> master
                type="text"
                name="firstname"
                placeholder="Limit 32 characters"
                value={order.recipient.firstname}
                maxLength="64"
                onFocus={() => setRecipientFirstNameWarning(true)}
                onBlur={() => setRecipientFirstNameWarning(false)}
                onChange={updateRecipient}
              />
<<<<<<< HEAD
              {recipientFirstNameWarning
                ? displayMessage(64, order.recipient.firstname)
                : null}
            </div>
            <div>
              <label
                style={{
                  fontSize: "15px",
                  margin: "0px",
                  paddingBottom: "5px",
                }}
              >
                Last Name<span style={{ color: "red" }}>*</span>
              </label>
              <input
                className={classes.LastNameBox}
=======
              {recipientFirstNameWarning ?
                displayMessage(64, order.recipient.firstname) :
                null
              }
            </div>
            <div>
              <label style={{fontSize: "15px", margin: "0px", paddingBottom: "5px"}}>
                Last Name<span style={{color: "red"}}>*</span>
              </label>
              <input className={classes.LastNameBox}
>>>>>>> master
                type="text"
                name="lastname"
                placeholder="Limit 32 characters"
                value={order.recipient.lastname}
                maxLength="64"
                onFocus={() => setRecipientLastNameWarning(true)}
                onBlur={() => setRecipientLastNameWarning(false)}
                onChange={updateRecipient}
              />
<<<<<<< HEAD
              {recipientLastNameWarning
                ? displayMessage(64, order.recipient.lastname)
                : null}
            </div>
          </div>
          <div style={{ width: "660px", paddingBottom: "10px" }}>
            <label
              style={{ fontSize: "15px", margin: "0px", paddingBottom: "5px" }}
            >
              Email Address<span style={{ color: "red" }}>*</span>
=======
              {recipientLastNameWarning ? displayMessage(64, order.recipient.lastname) : null}
            </div>
          </div>
          <div style={{width: "660px", paddingBottom: "10px"}}>
            <label style={{fontSize: "15px", margin: "0px", paddingBottom: "5px"}}>
              Email Address<span style={{color: "red"}}>*</span>
>>>>>>> master
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
<<<<<<< HEAD
          <div style={{ width: "660px", paddingBottom: "0px" }}>
            <label
              style={{ fontSize: "15px", margin: "0px", paddingBottom: "5px" }}
            >
              Message{" "}
              <span style={{ fontStyle: "italic" }}>(internal use only)</span>
=======
          <div style={{width: "660px", paddingBottom: "0px"}}>
            <label style={{fontSize: "15px", margin: "0px", paddingBottom: "5px"}}>
              Message <span style={{fontStyle: "italic"}}>(internal use only)</span>
>>>>>>> master
            </label>
            <input
              className={classes.MessageBox}
              type="text"
              name="message"
              value={order.recipient.message}
              maxLength="64"
              onFocus={() => setRecipientMessageWarning(true)}
              onBlur={() => setRecipientMessageWarning(false)}
              placeholder="Limit 64 characters"
              onChange={updateRecipient}
            />
<<<<<<< HEAD
            {recipientMessageWarning
              ? displayMessage(64, order.recipient.message)
              : null}
          </div>
        </div>
      );
    } else return null;
  };

  // LOOKS GOOD: 1/27/21
  const orderModalDisplay = () => {
    if (
      modalView === "review" ||
      modalView === "confirmation" ||
      modalView === "error"
    ) {
=======
            {recipientMessageWarning ? displayMessage(64, order.recipient.message) : null}
          </div>
        </div>
      )
    } else return null
  }
  
  // LOOKS GOOD: 1/27/21
  const orderModalDisplay = () => {
    if (modalView === "review" || modalView === "confirmation" || modalView === "error") {
>>>>>>> master
      return (
        <OrderModal
          show={true}
          status={modalView}
          title={selectedEventDetails.eventTitle}
          dateTime={selectedEventDetails.startDateTime}
          details={order}
<<<<<<< HEAD
          edit={() => {
            setModalView("none");
          }}
          close={() => {
            let tempOrder = { ...order };
            tempOrder.recipient = {
              firstname: "",
              lastname: "",
              email: "",
              message: "",
            };
            tempOrder.tickets = [newTicket(ticketDetails[0])];
=======
          edit={() => {setModalView("none")}}
          close={() => {
            let tempOrder={...order};
            tempOrder.recipient={
              firstname: "",
              lastname: "",
              email: "",
              message: ""
            };
            tempOrder.tickets=[newTicket(ticketDetails[0])];
>>>>>>> master
            setOrder(tempOrder);
            setModalView("none");
          }}
          submit={submitOrder}
        />
<<<<<<< HEAD
      );
    } else {
      return null;
    }
  };

=======
      )
    } else {
      return null;
    }
  }
  
>>>>>>> master
  // LOOKS GOOD: 1/26/21
  const mainDisplay = () => {
    if (display === "main") {
      return (
<<<<<<< HEAD
        <div style={{ paddingTop: "20px", paddingLeft: "30px" }}>
          <div style={{ fontWeight: "600", fontSize: "18px" }}>
            Issue Tickets
          </div>
=======
        <div style={{paddingTop: "20px", paddingLeft: "30px"}}>
          <div style={{fontWeight: "600", fontSize: "18px"}}>Issue Tickets</div>
>>>>>>> master
          {recipientDisplay()}
          {ticketCart()}
          {orderModalDisplay()}
        </div>
<<<<<<< HEAD
      );
    } else return null;
  };

  // LOOKS GOOD: 1/26/21
  const loadingSpinner = () => {
    if (display === "spinner") {
      return (
        <div style={{ paddingTop: "60px" }}>
          <Spinner />
        </div>
      );
    } else {
      return null;
    }
  };

  // LOOKS GOOD: 1/26/21
  const tabTitle = (
    <div className={classes.DisplayPanelTitle}>
      {display !== "spinner" && "eventTitle" in selectedEventDetails ? (
        <div style={{ fontSize: "26px", fontWeight: "600" }}>
          {selectedEventDetails.eventTitle}
        </div>
      ) : (
        <div>{null}</div>
      )}
    </div>
  );

=======
      )
    } else return null;
  }

  // LOOKS GOOD: 1/26/21
  const loadingSpinner = () => {
      if (display === "spinner") {
      return (
        <div style={{paddingTop: "60px"}}>
          <Spinner/>
        </div>
      )
      } else {
          return null
      }
  }
  
  // LOOKS GOOD: 1/26/21
  const tabTitle = (
    <div className={classes.DisplayPanelTitle}>
      {(display !== "spinner" && "eventTitle" in selectedEventDetails) ?
      <div style={{fontSize: "26px", fontWeight: "600"}}>{selectedEventDetails.eventTitle}</div> :
      <div>{null}</div>}
    </div>
  )
  
>>>>>>> master
  return (
    <div>
      {tabTitle}
      <div className={classes.DisplayPanel}>
        {loadingSpinner()}
        {mainDisplay()}
      </div>
    </div>
<<<<<<< HEAD
  );
};

export default IssueTickets;
=======
  )
}

export default IssueTickets;
>>>>>>> master
