import React, { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";

import classes from "./SalesAnalytics.module.css";

const SalesAnalytics = (props) => {
  const [displayView, setDisplayView] = useState("spinner"); // spinner,
  //const [buyerInfo, setBuyerInfo] = useState();
  const [eventDetails, setEventDetails] = useState({});
  const [eventTickets, setEventTickets] = useState([{ ticketName: "GA" }]);
  const [eventOrders, setEventOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRevenues, setTotalRevenues] = useState();
  const [totalTickets, setTotalTickets] = useState();
  const [ticketSalesChart, setTicketSalesChart] = useState([]);
  const [ticketPaymentChart, setTicketPaymentChart] = useState([]);

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

  useEffect(() => {
    setIsLoading(true);

    let tempEventDetails = {};
    let tempEventTickets = [];
    let tempEventOrders = [];
    let tempEvents = JSON.parse(localStorage.getItem("events"));
    tempEvents.forEach((event, index) => {
      if (event.eventNum === 59490622550) {
        //if (order.eventNum === 5198198061) {
        tempEventDetails = event;
        tempEventTickets = event.tickets;
      }
    });
    let tempOrders = JSON.parse(localStorage.getItem("orders"));
    tempOrders.forEach((order, index) => {
      if (order.eventNum === 59490622550) {
        //if (order.eventNum === 5198198061) {
        tempEventOrders.push(order);
      }
    });

    // add ticketsSold and ticketRevenue fields into tempEventTickets
    tempEventTickets.forEach((ticket, index) => {
      tempEventTickets[index].ticketsSold = 0;
      tempEventTickets[index].ticketRevenue = 0;
    });

    console.log("Event Details: ", tempEventDetails);
    console.log("Event Tickets: ", tempEventTickets);
    console.log("Event Orders: ", tempEventOrders);

    setEventDetails(tempEventDetails);
    setEventTickets(tempEventTickets);
    setEventOrders(tempEventOrders);

    let tempTicketArray = [];
    let tempTotalTickets = 0;
    let tempTotalRevenues = 0;
    let tempData = [];

    tempEventOrders.forEach((order, index) => {
      if ("order_ticketItems" in order) {
        //console.log("order_ticketItems: ", order.order_ticketItems);
        order.order_ticketItems.forEach((ticketOrder, index) => {
          console.log("ticketOrder: ", ticketOrder);
          tempEventTickets.forEach((ticket, index) => {
            console.log("ticket: ", ticket);
            if (ticket._id === ticketOrder.ticketId) {
              console.log("made a ticket id match");
              console.log("ticket._id: ", ticket._id);
              console.log("ticketOrder.ticketId: ", ticketOrder.ticketId);
              console.log(
                "tempEventTickets[index].ticketsSold: ",
                tempEventTickets[index].ticketsSold
              );
              console.log("ticketOrder.qty: ", ticketOrder.qty);
              tempEventTickets[index].ticketsSold += ticketOrder.qty;
              tempEventTickets[index].ticketRevenue += ticketOrder.subtotal;
              console.log(
                "tempEventTickets[index].ticketsSold: ",
                tempEventTickets[index].ticketsSold
              );
            }
          });
          console.log("ticketOrder.subtotal: ", ticketOrder.subtotal);
          tempTotalRevenues += ticketOrder.subtotal;
          tempTotalTickets += ticketOrder.qty;
        });
      }
    });

    // populate Slaes Chart data
    tempEventTickets.forEach((ticket, index) => {
      //if (parseFloat(ticket.ticketRevenue) !== 0) {
      let tempEntry = {
        title: ticket.ticketName,
        value: ticket.ticketRevenue,
        color: colorSpec[index],
      };
      tempData.push(tempEntry);
      console.log("tempEntry: ", tempEntry);
      //}
    });

    console.log("Event Tickets: ", tempEventTickets);
    setEventTickets(tempEventTickets);

    console.log("Ticket Sales Chart Data: ", tempData);
    setTicketSalesChart(tempData);

    setTotalRevenues(tempTotalRevenues);
    setTotalTickets(tempTotalTickets);

    setIsLoading(false);
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
                gridTemplateColumns: "300px 60px 60px 80px",
                paddingLeft: "30px",
              }}
            >
              <div
                style={{ textAlign: "left" }}
                onClick={() => {
                  setSelectedWedge(index);
                }}
              >
                {ticket.ticketName}
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

  return (
    <div>
      <div className={classes.DisplayPanelTitle} style={{ fontSize: "18px" }}>
        Sales Analytics
      </div>
      <br></br>
      <div
        className={classes.DisplayPanelTitle}
        style={{ fontSize: "16px", paddingLeft: "30px", paddingBottom: "10px" }}
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
                paddingTop: "10px",
              }}
            >
              ${totalRevenues}
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

      <div
        className={classes.DisplayPanelTitle}
        style={{ fontSize: "16px", paddingLeft: "30px", paddingBottom: "10px" }}
      >
        Sales by Ticket Type
      </div>
      <div className={classes.DisplayPanel}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "300px 60px 60px 80px",
            columnGap: "10px",
            borderBottom: "1px solid black",
            marginLeft: "30px",
            marginRight: "calc(100vw - 560px",
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
              gridTemplateColumns: "300px 60px 60px 80px",
              columnGap: "10px",
            }}
          >
            <div>{tickets()}</div>
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
        style={{ fontSize: "16px", paddingLeft: "30px", paddingBottom: "10px" }}
      >
        Sales by Payment Method
      </div>
    </div>
  );
};

export default SalesAnalytics;