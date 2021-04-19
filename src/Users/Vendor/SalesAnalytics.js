import React, { useEffect, useState, Fragment } from "react";
import { PieChart } from "react-minimal-pie-chart";

import dateFnsFormat from "date-fns/format";

import classes from "./SalesAnalytics.module.css";

const SalesAnalytics = (props) => {
  const [salesTotals, setSalesTotals] = useState({
    ticketsSold: 0,
    ticketsRemaining: 0,
    grossRevenues: 0,
    netRevenues: 0,
    orders: 0,
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

  const [onlinePayments, setOnlinePayments] = useState({
    online: 0,
  });

  const [offlinePayments, setOfflinePayments] = useState({
    cash: 0,
    CashApp: 0,
    Venmo: 0,
    PayPal: 0,
    Bitcoin: 0,
    Ethereum: 0,
    other: 0,
  });

  const [codes, setCodes] = useState([
    {
      postalCode: "",
      ticketsPurchased: 0,
      salesRevenues: 0,
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
    },
  ]);

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
    let tempTicketTotals = []; // temp hold of specifc event's ticket details
    let tempRemaining = 0; // temp hold of tickets remaining

    tempTicketTotals = populateEventTickets(props.event.tickets);

    props.event.tickets.forEach((ticket) => {
      tempRemaining += ticket.remainingQuantity;
    });

    // finds the specific event within the events object
    // extracts the event details and tickets information
    //let tempEvents = JSON.parse(localStorage.getItem("events"));
    let tempTicketsSold = 0;
    let tempGrossRevenues = 0;
    let tempNetRevenues = 0;

    props.orders.forEach((order, index) => {
      if ("order_qrTickets" in order) {
        order.order_qrTickets.forEach((ticketOrder, index) => {
          tempTicketsSold += 1;
          tempGrossRevenues += ticketOrder.fullPrice;
        });
      }
      tempNetRevenues += order.order_totalAmount;
    });

    props.orders.forEach((order, index) => {
      if ("order_qrTickets" in order) {
        order.order_qrTickets.forEach((ticketOrder) => {
          tempTicketTotals.forEach((ticket, index) => {
            if (ticket.ticketId === ticketOrder.ticketId) {
              tempTicketTotals[index].ticketsSold += 1;
              tempTicketTotals[index].grossRevenues += ticketOrder.fullPrice;
              tempTicketTotals[index].netRevenues += ticketOrder.fullPrice;
            }
          });
        });
      }
    });

    setSalesTotals({
      ...salesTotals,
      ticketsSold: tempTicketsSold,
      ticketsRemaining: tempRemaining,
      grossRevenues: tempGrossRevenues,
      netRevenues: tempNetRevenues,
      orders: props.orders.length,
    });

    setTicketTotals(tempTicketTotals);

    // builds the "codes" array
    // checks that every unique name only appears once in the array
    let tempCodes = [];
    props.orders.forEach((order) => {
      let match = false;
      let matchIndex;
      let newCode = order.gwAddr_postcode;

      tempCodes.forEach((extCode, index) => {
        if (extCode.postalCode === newCode) {
          match = true;
          matchIndex = index;
        }
      });

      if (!match) {
        tempCodes.push({
          postalCode: order.gwAddr_postcode,
          ticketsPurchased: order.order_numTickets,
          salesRevenues: order.order_totalAmount,
        });
      } else {
        tempCodes[matchIndex].ticketsPurchased += order.order_numTickets;
        tempCodes[matchIndex].salesRevenues += order.order_totalAmount;
      }
    });
    setCodes(tempCodes);

    // builds the "buyers" array
    // checks that every unique name only appears once in the array
    let tempBuyers = [];
    props.orders.forEach((order) => {
      let match = false;
      let matchIndex;
      let newEmail = order.order_email;

      tempBuyers.forEach((extBuyer, index) => {
        if (extBuyer.email === newEmail) {
          match = true;
          matchIndex = index;
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
    setBuyers(tempBuyers);

    // "createdAtTime" is the time in milliseconds of the event creation date
    let createdAtTime = new Date(
      dateFnsFormat(new Date(props.event.createdAt), "MM/dd/yy")
    ).getTime();

    // "nowTime" is the time in milliseconds of now()
    let nowTime = new Date(dateFnsFormat(new Date(), "MM/dd/yy")).getTime();

    let startTime = createdAtTime;
    // array to house the total ticket revenues and sales for each date
    let tempDateArray = [];

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
      startTime += 86400000;
      tempDateArray.push(tempElement);
    }

    // populating
    props.orders.forEach((order, index1) => {
      // determines the "orderTime" of each individual order
      let orderTime = new Date(order.order_createdAt).getTime();

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

    // array to house the total ticket revenues and sales for each date
    let tempOfflinePayments = offlinePayments;
    let tempOnlinePayments = onlinePayments;
    // populating
    props.orders.forEach((order, index1) => {
      if ("offlinePayment" in order) {
        order.offlinePayment.forEach((payment) => {
          if (payment.payMethod === "cash") {
            tempOfflinePayments.cash += parseFloat(payment.amt);
          }
          if (payment.payMethod === "CashApp") {
            tempOfflinePayments.CashApp += parseFloat(payment.amt);
          }
          if (payment.payMethod === "Venmo") {
            tempOfflinePayments.Venmo += parseFloat(payment.amt);
          }
          if (payment.payMethod === "Paypal") {
            tempOfflinePayments.PayPal += parseFloat(payment.amt);
          }
          if (payment.payMethod === "Bitcoin") {
            tempOfflinePayments.Bitcoin += parseFloat(payment.amt);
          }
          if (payment.payMethod === "Ethereum") {
            tempOfflinePayments.Ethereum += parseFloat(payment.amt);
          }
          if (payment.payMethod === "other") {
            tempOfflinePayments.other += parseFloat(payment.amt);
          }
        });
      } else {
        tempOnlinePayments.online += parseFloat(order.order_totalAmount);
      }
    });
    setOnlinePayments(tempOnlinePayments);
    setOfflinePayments(tempOfflinePayments);
  }, []);

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

  const ticketsTable = () => {
    return (
      <div
        style={{
          paddingLeft: "30px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "320px 60px 60px 80px",
            columnGap: "10px",
            fontWeight: "600",
          }}
        >
          <div>Ticket Type</div>
          <div style={{ textAlign: "center" }}>Sold</div>
          <div style={{ textAlign: "center" }}>Remaining</div>
          <div style={{ textAlign: "center" }}>Revenue</div>
        </div>
        <div
          style={{
            borderTop: "1px solid black",
            borderBottom: "1px solid black",
            width: "550px",
          }}
        >
          <div>{tickets()}</div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "320px 60px 60px 80px",
            columnGap: "10px",
            fontWeight: "600",
            paddingBottom: "30px",
          }}
        >
          <div>Totals</div>
          <div style={{ textAlign: "center" }}>{salesTotals.ticketsSold}</div>
          <div style={{ textAlign: "center" }}>
            {salesTotals.ticketsRemaining}
          </div>
          <div style={{ textAlign: "right", paddingRight: "10px" }}>
            {parseFloat(salesTotals.grossRevenues).toFixed(2)}
          </div>
        </div>
      </div>
    );
  };

  const pieChart = (type) => {
    let pieData = [];
    let denomination;
    let totals = 0;
    if (type === "netRevenues") {
      ticketTotals.forEach((ticket, index) => {
        let tempEntry = {
          title: ticket.ticketName,
          value: ticket.netRevenues,
          color: colorSpec[index],
        };
        pieData.push(tempEntry);
        totals += ticket.netRevenues;
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
        totals += ticket.ticketsSold;
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
          `${((dataEntry.value * 100) / totals).toFixed(0)}%`
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

  const ticketsCharts = (
    <Fragment>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "200px 200px",
          columnGap: "50px",
          fontWeight: "600",
          textAlign: "center",
          textDecoration: "underline",
          paddingLeft: "80px",
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
          paddingLeft: "80px",
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
    </Fragment>
  );

  const dates = () => {
    return (
      <div>
        {dateSales.map((date, index) => {
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
              <div style={{ textAlign: "right", paddingRight: "10px" }}>
                {date.netRevenues.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const datesTable = () => {
    return (
      <div
        style={{
          paddingLeft: "30px",
        }}
      >
        <div
          style={{
            scrollbarWidth: "thin",
            overflowX: "auto",
            maxWidth: "600px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              display: "grid",
              columnGap: "10px",
              gridTemplateColumns: "200px 60px 60px 80px",
              fontWeight: "600",
            }}
          >
            <div style={{ textAlign: "left" }}>Date</div>
            <div style={{ textAlign: "center" }}>Orders</div>
            <div style={{ textAlign: "center" }}>Tickets</div>
            <div style={{ textAlign: "center" }}>Revenue</div>
          </div>

          <div
            style={{
              borderTop: "1px solid black",
              borderBottom: "1px solid black",
              maxHeight: "195px",
              width: "440px",
              scrollbarWidth: "thin",
              overflowY: "auto",
            }}
          >
            {dates()}
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
            <div style={{ textAlign: "center" }}>{props.orders.length}</div>
            <div style={{ textAlign: "center" }}>{salesTotals.ticketsSold}</div>
            <div style={{ textAlign: "right", paddingRight: "10px" }}>
              {parseFloat(salesTotals.netRevenues).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const datesCharts = () => {};

  const postalCodes = () => {
    return (
      <div>
        {codes.map((code, index) => {
          let tempPostalCode;
          if (code.postalCode === undefined) {
            tempPostalCode = "none";
          } else {
            tempPostalCode = code.postalCode;
          }
          return (
            <div
              style={{
                display: "grid",
                columnGap: "10px",
                gridTemplateColumns: "200px 100px 65px",
              }}
            >
              <div style={{ textAlign: "left" }}>{tempPostalCode}</div>
              <div style={{ textAlign: "center" }}>{code.ticketsPurchased}</div>

              <div style={{ textAlign: "right", paddingRight: "5px" }}>
                {code.salesRevenues.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const postalCodesTable = () => {
    return (
      <Fragment>
        <div
          style={{
            textAlign: "center",
            display: "grid",
            columnGap: "10px",
            gridTemplateColumns: "200px 100px 65px",
            fontWeight: "600",
            marginLeft: "30px",
          }}
        >
          <div style={{ textAlign: "left" }}>Postal Code</div>
          <div style={{ textAlign: "center" }}>Tickets</div>
          <div style={{ textAlign: "center" }}>Amount</div>
        </div>
        <div
          style={{
            borderTop: "1px solid black",
            borderBottom: "1px solid black",
            maxHeight: "100px",
            width: "395px",
            scrollbarWidth: "thin",
            overflowY: "auto",
            marginLeft: "30px",
            columnGap: "10px",
            marginBottom: "40px",
          }}
        >
          {postalCodes()}
        </div>
      </Fragment>
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
                gridTemplateColumns: "200px 100px 60px 65px",
              }}
            >
              <div style={{ textAlign: "left" }}>{buyer.email}</div>
              <div style={{ textAlign: "left" }}>
                {buyer.lastname}, {buyer.firstname}
              </div>
              <div style={{ textAlign: "center" }}>
                {buyer.ticketsPurchased}
              </div>

              <div style={{ textAlign: "right", paddingRight: "5px" }}>
                {buyer.salesRevenues.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const customersTable = () => {
    return (
      <Fragment>
        <div
          style={{
            textAlign: "center",
            display: "grid",
            columnGap: "10px",
            gridTemplateColumns: "200px 100px 60px 65px",
            fontWeight: "600",
            marginLeft: "30px",
          }}
        >
          <div style={{ textAlign: "left" }}>Email</div>
          <div style={{ textAlign: "left" }}>Last, First</div>
          <div style={{ textAlign: "center" }}>Tickets</div>
          <div style={{ textAlign: "center" }}>Amount</div>
        </div>
        <div
          style={{
            borderTop: "1px solid black",
            borderBottom: "1px solid black",
            maxHeight: "100px",
            width: "470px",
            scrollbarWidth: "thin",
            overflowY: "auto",
            marginLeft: "30px",
            marginBottom: "40px",
          }}
        >
          {customers()}
        </div>
      </Fragment>
    );
  };

  const customersCharts = () => {};

  const payments = () => {
    return (
      <div>
        <div
          style={{
            display: "grid",
            columnGap: "10px",
            gridTemplateColumns: "150px 65px",
          }}
        >
          <div style={{ fontWeight: "600" }}>Online Payments</div>
          <div style={{ textAlign: "right", paddingRight: "5px" }}>
            {onlinePayments.online.toFixed(2)}
          </div>
        </div>
        <div style={{ fontWeight: "600" }}>Offline</div>
        {Object.entries(offlinePayments).map(([key, val]) => {
          return (
            <div
              key={key}
              style={{
                display: "grid",
                columnGap: "10px",
                gridTemplateColumns: "150px 65px",
              }}
            >
              <div>{key}</div>
              <div style={{ textAlign: "right", paddingRight: "5px" }}>
                {val.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const paymentsTable = () => {
    return (
      <Fragment>
        <div
          style={{
            textAlign: "center",
            display: "grid",
            columnGap: "10px",
            gridTemplateColumns: "150px 65px",
            fontWeight: "600",
            marginLeft: "30px",
          }}
        >
          <div style={{ textAlign: "left" }}>Payment Method</div>
          <div style={{ textAlign: "center" }}>Amount</div>
        </div>
        <div
          style={{
            borderTop: "1px solid black",
            borderBottom: "1px solid black",
            width: "225px",
            marginLeft: "30px",
            marginBottom: "40px",
          }}
        >
          {payments()}
        </div>
      </Fragment>
    );
  };

  const tabTitle = (
    <div className={classes.DisplayPanelTitle}>
      {"eventTitle" in props.event ? (
        <div style={{ fontSize: "26px", fontWeight: "600" }}>
          {props.event.eventTitle}
        </div>
      ) : (
        <div>{null}</div>
      )}
      <div style={{ paddingTop: "5px" }}>
        <button
          className={classes.SwitchButton}
          onClick={() => {
            props.clicked("events");
          }}
        >
          Switch Event
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {tabTitle}{" "}
      <div className={classes.DisplayPanel}>
        <div
          className={classes.DisplayTitle}
          style={{
            fontSize: "18px",
            fontWeight: "600",
            paddingTop: "20px",
            paddingLeft: "30px",
          }}
        >
          Sales Analytics
        </div>
        <br></br>
        <div className={classes.DisplayTitle}>Net Sales</div>
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
            <div className={classes.NetSalesAmount} z>
              ${parseFloat(salesTotals.netRevenues).toFixed(2)}
            </div>
            <div className={classes.NetSalesCategory}>Total Revenue</div>
          </div>
          <div style={{ border: "1px solid grey" }}>
            <div className={classes.NetSalesAmount}>
              {salesTotals.ticketsSold}
            </div>
            <div className={classes.NetSalesCategory}>Tickets Sold</div>
          </div>
          <div
            style={{
              borderRight: "1px solid grey",
              borderTop: "1px solid grey",
              borderBottom: "1px solid grey",
            }}
          >
            <div className={classes.NetSalesAmount}>{props.orders.length}</div>
            <div className={classes.NetSalesCategory}>Total Orders</div>
          </div>
        </div>

        <div className={classes.DisplayTitle}>by Ticket Type</div>
        {ticketsTable()}
        {ticketsCharts}

        <div className={classes.DisplayTitle}>by Date</div>
        <div
          style={{
            paddingBottom: "40px",
          }}
        >
          {datesTable()}
          {/*datesCharts*/}
        </div>

        <div className={classes.DisplayTitle}>by Postal Code</div>
        {postalCodesTable()}
        {/*postalCodesChart*/}

        <div className={classes.DisplayTitle}>by Customer</div>
        {customersTable()}
        {/*customersCharts*/}

        <div className={classes.DisplayTitle}>by Payment Method</div>
        {paymentsTable()}
        {/*methodCharts*/}
      </div>
    </div>
  );
};

export default SalesAnalytics;
