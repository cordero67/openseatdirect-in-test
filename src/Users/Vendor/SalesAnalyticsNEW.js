import React, { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";

import dateFnsFormat from "date-fns/format";

import classes from "./SalesAnalytics.module.css";

const SalesAnalytics = (props) => {
  const [displayView, setDisplayView] = useState("spinner"); // spinner,

  // contains straight values from localStorage
  const [eventDetails, setEventDetails] = useState({});
  const [eventTickets, setEventTickets] = useState([]);
  const [eventOrders, setEventOrders] = useState([]);

  const [saleTotals, setSalesTotals] = useState({
    ticketsSold: 0,
    ticketsRemaining: 0,
    grossRevenues: 0,
    netRevenues: 0,
    orders: 0,
    ticketTypes: [
      {
        ticketId: "",
        ticketName: "",
        grossRevenues: 0,
        netRevenues: 0,
        ticketsSold: 0,
        ticketsRemaining: 0,
      },
    ],
  });

  const [ticketTotals, setTicketTotals] = useState([
    {
      ticketName: "",
      ticketId: "",
      currency: "0",
      faceValue: 0,
      ticketsSold: 0,
      ticketsRemaining: 0,
      grossRevenues: 0,
      netRevenues: 0,
    },
  ]);

  const [dateSales, setDateSales] = useState([
    {
      date: 0,
      startTime: 0,
      endTime: 0,
      ticketsSold: 0,
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

  // look to deprecate these four variables
  const [totalRevenues, setTotalRevenues] = useState();
  const [totalTickets, setTotalTickets] = useState();
  const [ticketSalesChart, setTicketSalesChart] = useState([]);
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
    console.log("tempArray Ticket Totals: ", tempArray);
    //setTicketTotals(tempTicketTotals);
    return tempArray;
  };

  useEffect(() => {
    let tempEventDetails = {};
    let tempEventTickets = [];
    let tempEventOrders = [];

    let tempTicketTotals = [];
    console.log("temp tickets: ", tempTicketTotals);

    // finds the specific event within the events object
    // extracts the event details and tickets information
    let tempEvents = JSON.parse(localStorage.getItem("events"));
    console.log("tempEvents: ", tempEvents);
    tempEvents.forEach((event, index) => {
      if (event.eventNum === 59490622550) {
        //if (event.eventNum === 96587655611) {
        console.log("event: ", event);
        // SHOULD BE ABLE TO DEPRECATE THIS
        tempEventDetails = event;
        tempTicketTotals = populateEventTickets(event.tickets);
        console.log("temp tickets: ", tempTicketTotals);
        tempEventTickets = event.tickets;
      }
    });
    console.log("Event Details: ", tempEventDetails);
    setEventDetails(tempEventDetails);
    // SHOULD BE ABLE TO DEPRECATE THIS
    console.log("Event Tickets: ", tempEventTickets);
    setEventTickets(tempEventTickets);

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

    // SPACE
    // SPACE
    // SPACE
    // SPACE
    // SPACE

    let tempTicketsSold = 0;
    let tempGrossRevenues = 0;
    let tempNetRevenues = 0;

    /*
    ticketName: "",
    ticketId: "",
    currency: "0",
    faceValue: 0,
    ticketsSold: 0,
    ticketsRemaining: 0,
    grossRevenues: 0,
    netRevenues: 0,

    */

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
          //tempTotalRevenues += ticketOrder.subtotal;
          //tempTotalTickets += ticketOrder.qty;
        });
      }
    });

    console.log("tempTicketTotals: ", tempTicketTotals);

    // SPACE
    // SPACE
    // SPACE
    // SPACE
    // SPACE
    // SPACE
    // SPACE
    // SPACE
    // SPACE
    // SPACE

    let tempTotalTickets = 0;
    let tempTotalRevenues = 0;

    tempEventOrders.forEach((order, index) => {
      if ("order_ticketItems" in order) {
        order.order_ticketItems.forEach((ticketOrder, index) => {
          tempEventTickets.forEach((ticket, index) => {
            if (ticket._id === ticketOrder.ticketId) {
              tempEventTickets[index].ticketsSold += ticketOrder.qty;
              tempEventTickets[index].ticketRevenue += ticketOrder.subtotal;
            }
          });
          tempTotalRevenues += ticketOrder.subtotal;
          tempTotalTickets += ticketOrder.qty;
        });
      }
    });

    // I CAN DEPRECATE THIS ONCE THE NEW "ticketsTotal" VARIABLE IS POPULATED
    // add "ticketsSold" and "ticketRevenue" fields into tempEventTickets
    tempEventTickets.forEach((ticket, index) => {
      tempEventTickets[index].ticketsSold = 0;
      tempEventTickets[index].ticketRevenues = 0;
    });
    console.log("Event Tickets: ", tempEventTickets);
    setEventTickets(tempEventTickets);

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

    // populates "tempField" with an array of objects, one for each ticket type
    tempEventTickets.forEach((ticket, index) => {
      let tempElement = {
        ticketName: ticket.ticketName,
        ticketId: ticket._id,
        ticketsSold: 0,
        ticketGrossRevenue: 0,
        ticketNetRevenue: 0,
        ticketSales: [
          {
            email: "",
            tickets: 0,
            ticketGrossRevenue: 0,
            ticketNetRevenue: 0,
          },
        ],
      };
      tempField.push(tempElement);
    });
    console.log("tempField: ", tempField);

    // space
    // space
    // space
    // space
    // space
    // space

    let tempDateArray = [];

    let startTime = createdAtTime;

    while (startTime <= nowTime) {
      let tempElement = {};
      /*
      console.log(
        "time: ",
        startTime,
        " Date: ",
        dateFnsFormat(new Date(startTime), "MM/dd/yy")
      );
      */
      tempElement.startTime = startTime;
      tempElement.endTime = startTime + 86400000;
      tempElement.startDate = dateFnsFormat(
        new Date(startTime),
        "EEE: MM/dd/yy"
      );
      tempElement.ticketsSold = 0;
      tempElement.ticketSales = tempField;
      tempElement.displayDetail = false;
      startTime += 86400000;
      tempDateArray.push(tempElement);
    }

    console.log("tempDateArray: ", tempDateArray);

    setDateArray(tempDateArray);

    tempEventOrders.forEach((order, index1) => {
      let orderTime = new Date(order.order_createdAt).getTime();

      let match = false;
      tempDateArray.forEach((date, index2) => {
        if (orderTime >= date.startTime && orderTime < date.endTime) {
          /*
          console.log("We have a Match");
          console.log("End: ", date.endTime);
          console.log("Actual: ", orderTime);
          console.log("Start: ", date.startTime);
          console.log("tempDateArray[index2]: ", tempDateArray[index2]);
          */
          tempDateArray[index2].ticketsSold += order.order_numTickets;
          match = true;
        }
      });
    });
    console.log("tempDateArray: ", tempDateArray);

    setDateArray(tempDateArray);

    let tempData = [];

    // populate Sales Chart data
    tempEventTickets.forEach((ticket, index) => {
      //if (parseFloat(ticket.ticketRevenue) !== 0) {
      let tempEntry = {
        title: ticket.ticketName,
        value: ticket.ticketRevenue,
        color: colorSpec[index],
      };
      tempData.push(tempEntry);
      //console.log("tempEntry: ", tempEntry);
      //}
    });

    console.log("Event Tickets: ", tempEventTickets);
    setEventTickets(tempEventTickets);

    console.log("Ticket Sales Chart Data: ", tempData);
    setTicketSalesChart(tempData);

    setTotalRevenues(tempTotalRevenues);
    setTotalTickets(tempTotalTickets);
  }, []);

  const [selectedWedge, setSelectedWedge] = useState();

  const tickets = () => {
    return (
      <div>
        {eventTickets.map((ticket, index) => {
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
                {ticket.remainingQuantity}
              </div>
              <div style={{ textAlign: "right", paddingRight: "10px" }}>
                {parseFloat(ticket.ticketRevenue).toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const tickets2 = () => {
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
                  {ticket.name}
                </button>
              </div>
              <div style={{ textAlign: "center" }}>{ticket.sold}</div>
              <div style={{ textAlign: "center" }}>{ticket.remaining}</div>
              <div style={{ textAlign: "right", paddingRight: "10px" }}>
                {parseFloat(ticket.grossRevenue).toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const dates = () => {
    return (
      <div>
        {dateArray.map((date, index) => {
          return (
            <div
              key={index}
              style={{
                textAlign: "center",
                display: "grid",
                columnGap: "10px",
                gridTemplateColumns: "200px 60px",
                paddingLeft: "30px",
              }}
            >
              <div style={{ textAlign: "left" }}>{date.startDate}</div>
              <div style={{ textAlign: "center" }}>{date.ticketsSold}</div>
            </div>
          );
        })}
      </div>
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
                fontSize: "16px",
                fontWeight: "600",
                paddingTop: "10px",
              }}
            >
              ${parseFloat(totalRevenues).toFixed(2)}
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
                fontSize: "16px",
                fontWeight: "600",
                paddingTop: "10px",
              }}
            >
              {totalTickets}
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
                fontSize: "16px",
                fontWeight: "600",
                paddingTop: "10px",
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
              paddingBottom: "20px",
            }}
          >
            <div>{tickets()}</div>
          </div>
        </div>
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "340px 60px 60px 80px",
              columnGap: "10px",
              paddingBottom: "20px",
            }}
          >
            <div>{tickets2()}</div>
          </div>
        </div>
        <div
          style={{
            textAlign: "center",
            width: "200px",
            marginLeft: "195px",
            paddingBottom: "20px",
          }}
        >
          <PieChart
            style={{
              fontFamily:
                '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
              fontSize: "6px",
            }}
            data={ticketSalesChart}
            onClick={(e, segmentIndex) => {
              console.log("Clicked wedge ", segmentIndex);
            }}
            radius={PieChart.defaultProps.radius - 6}
            lineWidth={60}
            segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
            segmentsShift={(index) => (index === selectedWedge ? 6 : 1)}
            animate
            label={({ dataEntry }) => `$${Math.round(dataEntry.value)}`}
            labelPosition={100 - 60 / 2}
            labelStyle={{
              fill: "#black",
              opacity: 0.75,
              pointerEvents: "none",
            }}
          />
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
            gridTemplateColumns: "200px 60px",
            borderBottom: "1px solid black",
            fontWeight: "600",
            marginLeft: "30px",
            marginRight: "calc(100vw - 315px)",
          }}
        >
          <div style={{ textAlign: "left" }}>Date</div>
          <div style={{ textAlign: "center" }}>Sales</div>
        </div>
      </div>

      <div
        style={{
          paddingBottom: "40px",
        }}
      >
        {dates()}
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
