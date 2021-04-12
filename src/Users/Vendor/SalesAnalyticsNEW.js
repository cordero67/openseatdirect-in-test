import React, { useEffect, useState, Fragment } from "react";
import { PieChart } from "react-minimal-pie-chart";

import dateFnsFormat from "date-fns/format";

import classes from "./SalesAnalytics.module.css";
import { faBomb } from "@fortawesome/free-solid-svg-icons";

const SalesAnalytics = (props) => {
  const [displayView, setDisplayView] = useState("spinner"); // spinner,

  // contains straight values from localStorage
  const [eventDetails, setEventDetails] = useState({});
  const [eventOrders, setEventOrders] = useState([]);

  const [salesTotals, setSalesTotals] = useState({
    ticketsSold: 0,
    ticketsRemaining: 0,
    grossRevenues: 0,
    netRevenues: 0,
    orders: 0,
    ticketTypes: [
      {
        ticketId: "", //
        ticketName: "", //
        grossRevenues: 0, //
        netRevenues: 0, //
        ticketsSold: 0, //
        ticketsRemaining: 0, //
      },
    ],
  });

  const [ticketTotals, setTicketTotals] = useState([
    {
      ticketName: "", //
      ticketId: "", //
      currency: "0",
      faceValue: 0,
      ticketsSold: 0, //
      ticketsRemaining: 0, //
      grossRevenues: 0, //
      netRevenues: 0, //
    },
  ]);

  const [buyers, setBuyers] = useState([
    {
      email: "",
      firstname: "",
      lastname: "",
      ticketsPurchased: 0,
      salesRevenues: 0,
    },
  ]);

  const [dateSales, setDateSales] = useState([
    {
      date: 0,
      startTime: 0,
      endTime: 0,
      ticketsSold: 0,
      orders: 0,
      grossRevenues: 0,
      netRevenues: 0,
      displayDetail: false,
      ticketSales: [
        {
          ticketId: "",
          ticketName: "",
          ticketsSold: 0,
          grossRevenues: 0,
          netRevenues: 0,
        },
      ],
    },
  ]);

  // look to deprecate this variable
  const [dateArray, setDateArray] = useState([]);

  let colorSpec = [
    "#FFC921",
    "#FFFF00",
    "#ADFF2F",
    "#4CBB17",
    "#00FFFF",
    "#056BE7",
    "#8A2BE2",
    "#A0309B",
    "#C71585",
    "#FF0000",
    "#FF6600",
    "#FF9817",
  ];

  const populateEventTickets = (tickets) => {
    const tempArray = [];
    tickets.forEach((ticket, index) => {
      let tempElement = {};
      tempElement.ticketName = ticket.ticketName;
      tempElement.ticketId = ticket._id;
      tempElement.currency = ticket.currency;
      tempElement.faceValue = ticket.currentTicketPrice;
      tempElement.ticketsSold = 0;
      tempElement.ticketsRemaining = ticket.remainingQuantity;
      tempElement.grossRevenues = 0;
      tempElement.netRevenues = 0;
      tempArray.push(tempElement);
    });
    return tempArray;
  };

  useEffect(() => {
    let tempEventDetails = {}; // temp hold of specifc event's details
    let tempEventOrders = []; // temp hold of specifc event's orders
    let tempTicketTotals = []; // temp hold of specifc event's ticket details

    // SHOULD BE ABLE TO DEPRECATE THIS LINE
    let tempEventTickets = [];

    // finds the specific event within the events object
    // extracts the event details and tickets information
    let tempEvents = JSON.parse(localStorage.getItem("events"));
    tempEvents.forEach((event, index) => {
      if (event.eventNum === 59490622550) {
        //if (event.eventNum === 96587655611) {
        console.log("This event: ", event);
        tempEventDetails = event;
        setEventDetails(tempEventDetails);

        tempTicketTotals = populateEventTickets(event.tickets);
        console.log("temp tickets: ", tempTicketTotals);

        // SHOULD BE ABLE TO DEPRECATE THESE TWO LINES
        tempEventTickets = event.tickets;
        console.log("Event Tickets: ", tempEventTickets);
      }
    });

    // finds orders for specific event
    // extracts the orders information
    let tempOrders = JSON.parse(localStorage.getItem("orders"));
    tempOrders.forEach((order, index) => {
      if (order.eventNum === 59490622550) {
        //if (order.eventNum === 96587655611) {
        tempEventOrders.push(order);
      }
    });
    console.log("Event Orders: ", tempEventOrders);
    setEventOrders(tempEventOrders);

    let tempTicketsSold = 0;
    let tempGrossRevenues = 0;
    let tempNetRevenues = 0;
    let tempOrderNetRevenues = 0;

    tempEventOrders.forEach((order, index) => {
      if ("order_qrTickets" in order) {
        order.order_qrTickets.forEach((ticketOrder, index) => {
          tempTicketTotals.forEach((ticket, index) => {
            if (ticket.ticketId === ticketOrder.ticketId) {
              tempTicketTotals[index].ticketsSold += 1;
              tempTicketTotals[index].grossRevenues += ticketOrder.fullPrice;
              tempTicketTotals[index].netRevenues += ticketOrder.sellingPrice;
            }
          });
          tempTicketsSold += 1;
          tempGrossRevenues += ticketOrder.fullPrice;
          tempNetRevenues += ticketOrder.sellingPrice;
        });
      }
      tempOrderNetRevenues += order.order_totalAmount;
    });

    //
    //
    //
    //
    //
    //
    //
    //
    // builds the "buyers" array
    // checks that every unique only appears once in the array
    let tempBuyers = [];
    tempEventOrders.forEach((order) => {
      let match = false;
      let matchIndex;

      let newEmail = order.order_email;
      console.log("newEmail: ", newEmail);

      tempBuyers.forEach((extBuyer, index) => {
        console.log("extBuyer.email: ", extBuyer.email);
        if (extBuyer.email === newEmail) {
          match = true;
          matchIndex = index;
          console.log("THIS EMAIL ALREADY EXISTS");
        } else {
          console.log("New Email");
        }
      });

      if (!match) {
        tempBuyers.push({
          email: order.order_email,
          firstname: order.order_firstName,
          lastname: order.order_lastName,
          ticketsPurchased: order.order_numTickets,
          salesRevenues: order.order_totalAmount,
        });
      } else {
        tempBuyers[matchIndex].ticketsPurchased += order.order_numTickets;
        tempBuyers[matchIndex].salesRevenues += order.order_totalAmount;
      }
    });
    console.log("tempBuyers: ", tempBuyers);
    setBuyers(tempBuyers);

    setSalesTotals({
      ...salesTotals,
      ticketsSold: tempTicketsSold,
      grossRevenues: tempGrossRevenues,
      netRevenues: tempNetRevenues,
      orderNetRevenues: tempOrderNetRevenues,
      orders: tempOrders.length,
    });

    setTicketTotals(tempTicketTotals);

    // "createdAtTime" is the time in milliseconds of the event creation date
    let createdAtTime = new Date(
      dateFnsFormat(new Date(tempEventDetails.createdAt), "MM/dd/yy")
    ).getTime();
    console.log("createdAtTime: ", createdAtTime);

    // "nowTime" is the time in milliseconds of now()
    let nowTime = new Date(dateFnsFormat(new Date(), "MM/dd/yy")).getTime();
    console.log("nowTime: ", nowTime);

    // array to house the total ticket revenue and sale for each ticket type
    let tempField = [];

    // populates "tempField" with an array of empty objects, one for each ticket type
    tempEventTickets.forEach((ticket, index) => {
      let tempElement = {
        ticketName: ticket.ticketName, //
        ticketId: ticket._id, //
        ticketsSold: 0, //
        grossRevenues: 0,
        netRevenues: 0,
      };
      tempField.push(tempElement);
    });
    console.log("tempField: ", tempField);

    // array to house the total ticket revenues and sales for each date
    let tempDateArray = [];

    let startTime = createdAtTime;

    // populates "tempDateArray" with an array of empty objects, one for each date
    while (startTime <= nowTime) {
      let tempElement = {};
      tempElement.startTime = startTime; //
      tempElement.endTime = startTime + 86400000; //
      tempElement.date = dateFnsFormat(
        //
        new Date(startTime),
        "EEE: MM/dd/yy"
      );
      tempElement.ticketsSold = 0; //
      tempElement.grossRevenues = 0; //
      tempElement.orders = 0; //
      tempElement.netRevenues = 0; //
      tempElement.displayDetail = false; //
      tempElement.ticketSales = tempField; //
      startTime += 86400000;
      tempDateArray.push(tempElement);
    }

    // populating
    tempEventOrders.forEach((order, index1) => {
      // determines the "orderTIme" of each individual order
      let orderTime = new Date(order.order_createdAt).getTime();

      console.log("order: ", order);

      tempDateArray.forEach((date, index2) => {
        if (orderTime >= date.startTime && orderTime < date.endTime) {
          tempDateArray[index2].ticketsSold += order.order_numTickets;
          tempDateArray[index2].orders += 1;
          tempDateArray[index2].netRevenues += order.order_totalAmount;
        }
      });
    });
    console.log("tempDateArray: ", tempDateArray);
    setDateSales(tempDateArray);
  }, []);

  // space
  // space
  // space

  const [selectedWedge, setSelectedWedge] = useState();

  const tickets = () => {
    return (
      <div>
        {ticketTotals.map((ticket, index) => {
          return (
            <div
              key={index}
              style={{
                textAlign: "center",
                display: "grid",
                columnGap: "10px",
                gridTemplateColumns: "320px 60px 60px 80px",
                paddingLeft: "30px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "20px 320px",
                }}
              >
                <div
                  style={{ backgroundColor: colorSpec[index], width: "15px" }}
                ></div>
                <button
                  className={classes.TableLine}
                  cursor="pointer"
                  onMouseEnter={() => {
                    setSelectedWedge(index);
                  }}
                  onMouseLeave={() => {
                    setSelectedWedge();
                  }}
                >
                  {ticket.ticketName}
                </button>
              </div>
              <div style={{ textAlign: "center" }}>{ticket.ticketsSold}</div>
              <div style={{ textAlign: "center" }}>
                {ticket.ticketsRemaining}
              </div>
              <div style={{ textAlign: "right", paddingRight: "10px" }}>
                {parseFloat(ticket.netRevenues).toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const dates = () => {
    let ordersTotal = 0;
    let totalTickets = 0;
    let totalRevenue = 0;
    return (
      <div
        style={{
          marginLeft: "30px",
          marginRight: "calc(100vw - 470px)",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            borderBottom: "1px solid black",
          }}
        >
          {dateSales.map((date, index) => {
            if (date.ticketsSold > 0) {
              ordersTotal += 1;
              totalTickets += date.ticketsSold;
              totalRevenue += date.netRevenues;
            }
            return (
              <div
                key={index}
                style={{
                  textAlign: "center",
                  display: "grid",
                  columnGap: "10px",
                  gridTemplateColumns: "200px 60px 60px 80px",
                }}
              >
                <div style={{ textAlign: "left" }}>{date.date}</div>
                <div style={{ textAlign: "center" }}>{date.orders}</div>
                <div style={{ textAlign: "center" }}>{date.ticketsSold}</div>
                <div style={{ textAlign: "right", paddingRight: "15px" }}>
                  {date.netRevenues.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "grid",
            columnGap: "10px",
            gridTemplateColumns: "200px 60px 60px 80px",
            fontWeight: "600",
          }}
        >
          <div>Totals</div>
          <div style={{ textAlign: "center" }}>{ordersTotal}</div>
          <div style={{ textAlign: "center" }}>{totalTickets}</div>
          <div style={{ textAlign: "right", paddingRight: "15px" }}>
            {totalRevenue.toFixed(2)}
          </div>
        </div>
      </div>
    );
  };

  const customers = () => {
    return (
      <div>
        {buyers.map((buyer, index) => {
          return (
            <div
              style={{
                display: "grid",
                columnGap: "10px",
                gridTemplateColumns: "200px 100px 60px 60px",
              }}
            >
              <div style={{ textAlign: "left" }}>{buyer.email}</div>
              <div style={{ textAlign: "left" }}>
                {buyer.lastname}, {buyer.firstname}
              </div>
              <div style={{ textAlign: "center" }}>
                {buyer.ticketsPurchased}
              </div>

              <div style={{ textAlign: "right", paddingRight: "15px" }}>
                {buyer.salesRevenues.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const pieChart = (type) => {
    let pieData = [];
    let denomination;
    if (type === "netRevenues") {
      ticketTotals.forEach((ticket, index) => {
        let tempEntry = {
          title: ticket.ticketName,
          value: ticket.netRevenues,
          color: colorSpec[index],
        };
        pieData.push(tempEntry);
      });
      denomination = "$";
    } else if ((type = "ticketsSold")) {
      ticketTotals.forEach((ticket, index) => {
        let tempEntry = {
          title: ticket.ticketName,
          value: ticket.ticketsSold,
          color: colorSpec[index],
        };
        pieData.push(tempEntry);
      });
      denomination = "";
    }

    return (
      <PieChart
        style={{
          fontFamily:
            '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
          fontSize: "6px",
        }}
        data={pieData}
        onClick={(e, segmentIndex) => {
          console.log("Clicked wedge ", segmentIndex);
        }}
        radius={PieChart.defaultProps.radius - 6}
        lineWidth={60}
        segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
        segmentsShift={(index) => (index === selectedWedge ? 6 : 1)}
        animate
        label={({ dataEntry }) =>
          `${denomination}${Math.round(dataEntry.value)}`
        }
        labelPosition={100 - 60 / 2}
        labelStyle={{
          fill: "#black",
          opacity: 0.75,
          pointerEvents: "none",
        }}
      />
    );
  };

  return (
    <div>
      <div
        className={classes.DisplayPanelTitle}
        style={{
          fontSize: "18px",
          fontWeight: "600",
          paddingTop: "30px",
          paddingLeft: "30px",
        }}
      >
        Sales Analytics
      </div>
      <br></br>
      <div
        className={classes.DisplayPanelTitle}
        style={{
          fontSize: "16px",
          fontWeight: "600",
          paddingLeft: "30px",
          paddingBottom: "10px",
        }}
      >
        Net Sales
      </div>

      <div className={classes.DisplayPanel}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "175px 175px 175px",
            paddingLeft: "30px",
            paddingRight: "30px",
            paddingBottom: "30px",
          }}
        >
          <div
            style={{
              borderLeft: "1px solid grey",
              borderTop: "1px solid grey",
              borderBottom: "1px solid grey",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontSize: "18px",
                fontWeight: "600",
                paddingTop: "15px",
              }}
            >
              ${parseFloat(salesTotals.orderNetRevenues).toFixed(2)}
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: "12px",
                paddingBottom: "10px",
              }}
            >
              Total Revenues
            </div>
          </div>
          <div style={{ border: "1px solid grey" }}>
            <div
              style={{
                textAlign: "center",
                fontSize: "18px",
                fontWeight: "600",
                paddingTop: "15px",
              }}
            >
              {salesTotals.ticketsSold}
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: "12px",
                paddingBottom: "10px",
              }}
            >
              Tickets Sold
            </div>
          </div>
          <div
            style={{
              borderRight: "1px solid grey",
              borderTop: "1px solid grey",
              borderBottom: "1px solid grey",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontSize: "18px",
                fontWeight: "600",
                paddingTop: "15px",
              }}
            >
              {eventOrders.length}
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: "12px",
                paddingBottom: "10px",
              }}
            >
              Total Orders
            </div>
          </div>
        </div>
      </div>

      <div className={classes.DisplayPanel}>
        <div
          className={classes.DisplayPanelTitle}
          style={{
            fontSize: "16px",
            fontWeight: "600",
            paddingLeft: "30px",
            paddingBottom: "10px",
          }}
        >
          Sales by Ticket Type
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "320px 60px 60px 80px",
            columnGap: "10px",
            borderBottom: "1px solid black",
            fontWeight: "600",
            marginLeft: "30px",
            marginRight: "calc(100vw - 595px)",
          }}
        >
          <div>Ticket Name</div>
          <div style={{ textAlign: "center" }}>Sold</div>
          <div style={{ textAlign: "center" }}>Remaining</div>
          <div style={{ textAlign: "center" }}>Revenue</div>
        </div>
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "340px 60px 60px 80px",
              columnGap: "10px",
              paddingBottom: "30px",
            }}
          >
            <div>{tickets()}</div>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 200px",
            columnGap: "50px",
            fontWeight: "600",
            textAlign: "center",
            textDecoration: "underline",
            paddingLeft: "100px",
            paddingBottom: "5px",
          }}
        >
          <div>Tickets Sold</div>
          <div>Ticket Revenues</div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 200px",
            columnGap: "50px",
            fontWeight: "600",
            paddingLeft: "100px",
            paddingBottom: "20px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              width: "200px",
              paddingBottom: "20px",
            }}
          >
            {pieChart("ticketsSold")}
          </div>
          <div
            style={{
              textAlign: "center",
              width: "200px",
              paddingBottom: "20px",
            }}
          >
            {pieChart("netRevenues")}
          </div>
        </div>
      </div>

      <div
        className={classes.DisplayPanelTitle}
        style={{
          fontSize: "16px",
          fontWeight: "600",
          paddingTop: "20px",
          paddingLeft: "30px",
          paddingBottom: "10px",
        }}
      >
        Sales by Date
      </div>
      <div>
        <div
          style={{
            textAlign: "center",
            display: "grid",
            columnGap: "10px",
            gridTemplateColumns: "200px 60px 60px 80px",
            borderBottom: "1px solid black",
            fontWeight: "600",
            marginLeft: "30px",
            marginRight: "calc(100vw - 470px)",
          }}
        >
          <div style={{ textAlign: "left" }}>Date</div>
          <div style={{ textAlign: "center" }}>Orders</div>
          <div style={{ textAlign: "center" }}>Tickets</div>
          <div style={{ textAlign: "center" }}>Revenues</div>
        </div>
      </div>
      {dates()}

      <div
        className={classes.DisplayPanelTitle}
        style={{
          fontSize: "16px",
          fontWeight: "600",
          paddingLeft: "30px",
          paddingBottom: "10px",
        }}
      >
        Customer Sales
      </div>

      <div
        style={{
          borderBottom: "1px solid black",
          marginLeft: "30px",
          marginRight: "calc(100vw - 470px)",
          marginBottom: "40px",
        }}
      >
        {customers()}
      </div>

      <div
        className={classes.DisplayPanelTitle}
        style={{
          fontSize: "16px",
          fontWeight: "600",
          paddingLeft: "30px",
          paddingBottom: "40px",
        }}
      >
        Sales by Payment Method
      </div>
    </div>
  );
};

export default SalesAnalytics;
