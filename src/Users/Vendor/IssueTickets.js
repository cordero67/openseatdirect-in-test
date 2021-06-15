import React, { useEffect, useState, Fragment } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import { API } from "../../config";
import OrderModal from "./Modals/OrderModal";
//
//
import classes from "./IssueTickets.module.css";

const IssueTickets = (props) => {
  const [modalView, setModalView] = useState("none");
  const [eventDetails, setEventDetails] = useState({}); //event details of a single selected event
  const [ticketDetails, setTicketDetails] = useState([]); //ticket details of a single selected event
  const [order, setOrder] = useState({
    recipient: {
      firstname: "",
      lastname: "",
      email: "",
      message: "",
    },
    tickets: [],
  }); //manual generated ticket order

  const [customerInformation, setCustomerInformation] = useState({});

  const [recipientFirstNameWarning, setRecipientFirstNameWarning] =
    useState(false);
  const [recipientLastNameWarning, setRecipientLastNameWarning] =
    useState(false);
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

  // LOOKS GOOD: 1/26/21
  const loadEventData = () => {
    setEventDetails(props.event);
    let tempTicketDetails = [];

    if ("tickets" in props.event && props.event.tickets.length > 0) {
      props.event.tickets.forEach((ticket) => {
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
          currency: ticket.currency,
        });
      });
    }

    setTicketDetails(tempTicketDetails);

    // creates an empty ticket order populated with ticket[0]
    if (tempTicketDetails.length > 0) {
      let addedTicket = newTicket(tempTicketDetails[0]);
      let tempOrder = { ...order };
      tempOrder.tickets = [addedTicket];
      setOrder(tempOrder);
    }
  };

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
      let tempUser = JSON.parse(localStorage.getItem("user"));
      setCustomerInformation({
        sessionToken: tempUser.token,
        userId: tempUser.user._id,
      });

      loadEventData(props.event.eventNum);
    } else {
      window.location.href = "/auth";
    }
  }, [props]);

  // LOOKS GOOD: 1/29/21
  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  const submitOrder = (allTotal) => {
    console.log("allTotal: ", allTotal);
    let newOrder = {};
    let ticketArray = [];
    newOrder.firstname = order.recipient.firstname;
    newOrder.lastname = order.recipient.lastname;
    newOrder.email = order.recipient.email;
    newOrder.message = order.recipient.message;
    newOrder.eventNum = eventDetails.eventNum;

    order.tickets.forEach((ticket) => {
      let tempObject = {};
      tempObject.key = ticket.key;
      tempObject.ticketID = ticket.ticketId;
      tempObject.ticketsSelected = ticket.numTickets;
      tempObject.ticketName = ticket.ticketName;
      if (ticket.chargedPrice === "0.00") {
        tempObject.ticketPrice = 0;
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

  // LOOKS GOOD: 1/26/21
  const addNewTicket = () => {
    if (ticketDetails.length > 0) {
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
    let tempTickets = [...tempOrder.tickets];

    let priceRegex =
      /^(0|0\.|0\.[0-9]|0\.[0-9][0-9]|\.|\.[0-9]|\.[0-9][0-9]|[1-9][0-9]+|[1-9][0-9]+\.|[1-9][0-9]+\.[0-9]|[1-9][0-9]+\.[0-9][0-9]|[0-9]| [0-9]\.|[0-9]\.[0-9]|[0-9]\.[0-9][0-9]|)$/;

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
          if (!ticket.compTicket) {
            ticket.chargedPrice = parseFloat(ticket.faceValue).toFixed(2);
          } else {
            ticket.chargedPrice = parseFloat(0).toFixed(2);
          }
          ticket.paymentType = "cash";
          ticket.chargedPriceWarning = "";
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
        } else if (event.target.name === "paymentType") {
          ticket.paymentType = event.target.value;
        }
      }
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
      tempTickets.forEach((ticket, index) => {
        if (ticket.key === key) {
          tempTickets.splice(index, 1);
        }
      });
      tempOrder.tickets = tempTickets;
      setOrder(tempOrder);
    }
  };

  // LOOK GOOD: 1/27/21
  const validOrder = () => {
    let invalid = true;
    let ticketWarnings = false;
    order.tickets.forEach((ticket) => {
      if (ticket.chargedPriceWarning) {
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

  // LOOKS GOOD: 1/27/21
  const controlButtons = (
    <Fragment>
      <div className={classes.TicketCartButtons}>
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
        </div>
      </div>
      <div className={classes.ValidOrder}>
        {validOrder() ? "complete fields identified above" : null}
      </div>
    </Fragment>
  );

  const ticketCart = () => {
    if (ticketDetails.length > 0) {
      return (
        <div className={classes.CartDisplay}>
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
            {order.tickets.map((ticket, index) => {
              let priceBox;
              if (ticket.chargedPriceWarning === "") {
                priceBox = classes.PriceBox;
              } else {
                priceBox = classes.PriceBoxWarning;
              }
              return (
                <div key={index}>
                  <div className={classes.TicketCart}>
                    <div>
                      <select
                        className={classes.TicketNameSelect}
                        type="text"
                        name="ticketName"
                        required
                        value={ticket.ticketName}
                        onChange={(event) => {
                          changeTicket(event, ticket.key);
                        }}
                      >
                        {ticketDetails.map((ticket2, index) => {
                          return (
                            <option key={index}>{ticket2.ticketName}</option>
                          );
                        })}
                      </select>
                    </div>
                    <div>
                      <select
                        className={classes.TicketNumberSelect}
                        type="number"
                        name="numTickets"
                        value={ticket.numTickets}
                        required
                        onChange={(event) => {
                          changeTicket(event, ticket.key);
                        }}
                      >
                        {ticket.maxTicketsAvailable.map((number, index) => {
                          return <option key={index}>{number}</option>;
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
                      <input
                        type="checkbox"
                        id=""
                        name="compTicket"
                        className={classes.Checkbox}
                        checked={ticket.compTicket}
                        onChange={(event) => {
                          changeTicket(event, ticket.key);
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
                          return <option key={index}>{type}</option>;
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
                        icon={faTrashAlt}
                      />
                    </div>
                  </div>
                  <div className={classes.ChargedPriceWarning}>
                    {ticket.chargedPriceWarning}
                  </div>
                </div>
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
    const regsuper =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let tempOrder = { ...order };
    let tempRecipient = { ...tempOrder.recipient };

    tempRecipient[event.target.name] = event.target.value;
    if (
      tempRecipient.firstname === "" ||
      tempRecipient.lastname === "" ||
      tempRecipient.email === "" ||
      !regsuper.test(tempRecipient.email)
    ) {
      tempRecipient.completed = false;
    } else {
      tempRecipient.completed = true;
    }
    tempOrder.recipient = tempRecipient;
    setOrder(tempOrder);
  };

  // LOOKS GOOD: 1/27/21
  const displayMessage = (limit, variable) => {
    if (variable && variable.length >= limit) {
      return (
        <div className={classes.WarningRed} style={{ fontWeight: "700" }}>
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
      return <div className={classes.WarningBlack}>Remaining {limit}</div>;
    }
  };

  // LOOKS GOOD: 1/27/21
  const recipientDisplay = () => {
    let emailBox;
    let emailWarning;

    const regsuper =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (order.recipient.email !== "" && !regsuper.test(order.recipient.email)) {
      emailBox = classes.EmailBoxWarning;
    } else {
      emailBox = classes.EmailBox;
    }

    if (order.recipient.email && !regsuper.test(order.recipient.email)) {
      emailWarning = (
        <div className={classes.WarningText}>Not a valid email address</div>
      );
    } else if (recipientEmailWarning) {
      emailWarning = displayMessage(64, order.recipient.email);
    } else {
      emailWarning = null;
    }

    if (ticketDetails.length > 0) {
      return (
        <div className={classes.RecipientDisplay}>
          <div
            style={{
              fontSize: "16px",
              fontWeight: "600",
              paddingBottom: "15px",
            }}
          >
            Ticket Recipient
          </div>
          <div className={classes.NameGrid}>
            <div>
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
                type="text"
                name="firstname"
                placeholder="Limit 32 characters"
                value={order.recipient.firstname}
                maxLength="64"
                onFocus={() => setRecipientFirstNameWarning(true)}
                onBlur={() => setRecipientFirstNameWarning(false)}
                onChange={updateRecipient}
              />
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
                type="text"
                name="lastname"
                placeholder="Limit 32 characters"
                value={order.recipient.lastname}
                maxLength="64"
                onFocus={() => setRecipientLastNameWarning(true)}
                onBlur={() => setRecipientLastNameWarning(false)}
                onChange={updateRecipient}
              />
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
          <div style={{ width: "660px", paddingBottom: "0px" }}>
            <label
              style={{ fontSize: "15px", margin: "0px", paddingBottom: "5px" }}
            >
              Message{" "}
              <span style={{ fontStyle: "italic" }}>(internal use only)</span>
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
      return (
        <OrderModal
          show={true}
          status={modalView}
          title={eventDetails.eventTitle}
          dateTime={eventDetails.startDateTime}
          details={order}
          edit={() => {
            setModalView("none");
          }}
          close={(type) => {
            let tempOrder = { ...order };
            tempOrder.recipient = {
              firstname: "",
              lastname: "",
              email: "",
              message: "",
            };
            tempOrder.tickets = [newTicket(ticketDetails[0])];
            setOrder(tempOrder);
            setModalView("none");
            if (type === "confirmation") {
              props.confirmed();
            }
          }}
          submit={submitOrder}
        />
      );
    } else {
      return null;
    }
  };

  // LOOKS GOOD: 1/26/21
  const mainDisplay = () => {
    return (
      <div style={{ paddingTop: "20px", paddingLeft: "30px" }}>
        <div style={{ fontWeight: "600", fontSize: "18px" }}>Issue Tickets</div>
        {recipientDisplay()}
        {ticketCart()}
        {orderModalDisplay()}
      </div>
    );
  };

  // LOOKS GOOD: 1/26/21
  const tabTitle = (
    <div className={classes.DisplayPanelTitle}>
      {"eventTitle" in eventDetails ? (
        <div style={{ fontSize: "26px", fontWeight: "600" }}>
          {eventDetails.eventTitle}
        </div>
      ) : (
        <div>{null}</div>
      )}{" "}
      <div style={{ paddingTop: "5px" }}>
        <button
          className={classes.SwitchButton}
          onClick={() => {
            props.toEvents("events");
          }}
        >
          Switch Event
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {tabTitle}
      <div className={classes.DisplayPanel}>{mainDisplay()}</div>
    </div>
  );
};

export default IssueTickets;
