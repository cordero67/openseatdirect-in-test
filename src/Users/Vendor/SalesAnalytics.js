import React, { useEffect, useState, Fragment } from "react";
import { PieChart } from "react-minimal-pie-chart";

import dateFnsFormat from "date-fns/format";

import classes from "./SalesAnalytics.module.css";

const SalesAnalytics = (props) => {
  console.log("PROPS: ", props);

  // LOOKS GOOD
  const [salesTotals, setSalesTotals] = useState({
    ticketsSold: 0,
    ticketsRemaining: 0,
    grossRevenues: 0,
    netRevenues: 0,
    orders: 0,
  });

  // LOOKS GOOD
  // sets up array with first empty object
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

  // LOOKS GOOD
  const [onlinePayments, setOnlinePayments] = useState({
    online: 0,
  });

  // LOOKS GOOD
  const [offlinePayments, setOfflinePayments] = useState({
    cash: 0,
    CashApp: 0,
    Venmo: 0,
    PayPal: 0,
    Bitcoin: 0,
    Ethereum: 0,
    Dogecoin: 0,
    other: 0,
  });

  // LOOKS GOOD
  // sets up array with first empty object
  const [codes, setCodes] = useState([
    {
      postalCode: "",
      ticketsPurchased: 0,
      salesRevenues: 0,
    },
  ]);

  // LOOKS GOOD
  // sets up array with first empty object
  const [buyers, setBuyers] = useState([
    {
      email: "",
      firstname: "",
      lastname: "",
      ticketsPurchased: 0,
      salesRevenues: 0,
    },
  ]);

  // LOOKS GOOD
  // sets up array with first empty object
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

  // LOOKS GOOD
  const [selectedWedge, setSelectedWedge] = useState();

  // LOOKS GOOD
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

  const [sortCodesParameters, setSortCodesParameters] = useState({
    label: "salesRevenues",
    direction: "asc",
  });

  const [sortBuyersParameters, setSortBuyersParameters] = useState({
    label: "salesRevenues",
    direction: "asc",
  });

  // LOOKS GOOD
  // simply creates an array about individual ticket details
  const populateEventTickets = (tickets) => {
    const tempArray = [];
    tickets.forEach((ticket) => {
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
    console.log("Event Ticekts: ", tempArray);
    return tempArray;
  };

  useEffect(() => {
    // LOOKS GOOD
    let tempTicketTotals = []; // temp hold of specifc event's ticket details
    let tempRemaining = 0; // temp hold of all tickets remaining
    let tempTicketsSold = 0; // temp hold of all tickets sold
    let tempGrossRevenues = 0; // temp hold of all gross revenues
    let tempNetRevenues = 0; // temp hold of all net revenues

    // populates intial values in "ticketTotals" variables
    tempTicketTotals = populateEventTickets(props.event.tickets);

    // LOOKS GOOD
    // detemines the total number of tickets remaining for entire event
    props.event.tickets.forEach((ticket) => {
      tempRemaining += ticket.remainingQuantity;
    });
    console.log("Remaining Tickets: ", tempRemaining);

    // populates temp "ticketTotals" and temp "salesTotals" variables with information from "props.orders"
    props.orders.forEach((order) => {
      console.log("NEW ORDER: ", order);
      if ("qrTickets" in order) {
        order.qrTickets.forEach((ticketOrder) => {
          tempTicketsSold += 1;
          tempGrossRevenues += ticketOrder.fullPrice;

          tempTicketTotals.forEach((ticket, index) => {
            //console.log("ticketId: ", ticket.ticketId);
            //console.log("ticketId: ", ticketOrder.ticketId);
            if (ticket.ticketId === ticketOrder.ticketId) {
              tempTicketTotals[index].ticketsSold += 1;
              tempTicketTotals[index].grossRevenues += ticketOrder.fullPrice;
              tempTicketTotals[index].netRevenues += ticketOrder.fullPrice;
            }
          });
        });
        //console.log("order.totalPaidAmount: ", order.totalPaidAmount);
      }
      tempNetRevenues += order.totalPaidAmount;
    });
    console.log("tempTicketTotals: ", tempTicketTotals);

    setSalesTotals({
      ...salesTotals,
      ticketsSold: tempTicketsSold,
      ticketsRemaining: tempRemaining,
      grossRevenues: tempGrossRevenues,
      netRevenues: tempNetRevenues,
      orders: props.orders.length,
    });

    setTicketTotals(tempTicketTotals);

    // builds "codes" array
    // checks that every unique postal code appears once in array
    let tempCodes = [];
    props.orders.forEach((order) => {
      let match = false;
      let matchIndex;
      let newCode;
      if ("gwAddr_postcode" in order) {
        newCode = order.gwAddr_postcode;
      } else {
        newCode = "00000";
      }

      tempCodes.forEach((extCode, index) => {
        if (extCode.postalCode === newCode) {
          match = true;
          matchIndex = index;
        }
      });

      if (!match) {
        tempCodes.push({
          postalCode: newCode,
          ticketsPurchased: order.qty,
          salesRevenues: order.totalPaidAmount,
        });
      } else {
        tempCodes[matchIndex].ticketsPurchased += order.qty;
        tempCodes[matchIndex].salesRevenues += order.totalPaidAmount;
      }
    });
    console.log("CODES ARRAY: ", tempCodes);
    setCodes(tempCodes);

    // builds "buyers" array
    // checks that every unique buyer email appears once in array
    let tempBuyers = [];
    props.orders.forEach((order) => {
      let match = false;
      let matchIndex;
      let newEmail = order.email;

      tempBuyers.forEach((extBuyer, index) => {
        if (extBuyer.email === newEmail) {
          match = true;
          matchIndex = index;
        }
      });

      if (!match) {
        tempBuyers.push({
          email: order.email,
          firstname: order.firstname,
          lastname: order.lastname,
          ticketsPurchased: order.qty,
          salesRevenues: order.totalPaidAmount,
        });
      } else {
        tempBuyers[matchIndex].ticketsPurchased += order.qty;
        tempBuyers[matchIndex].salesRevenues += order.totalPaidAmount;
      }
    });
    console.log("temp buyers: ", tempBuyers);
    setBuyers(tempBuyers);

    // builds "dateSales" array
    let tempDateSales = [];

    // "startTime": time in milliseconds of event creation date
    let startTime = new Date(
      dateFnsFormat(new Date(props.event.createdAt), "MM/dd/yy")
    ).getTime();

    let nowTime = new Date(dateFnsFormat(new Date(), "MM/dd/yy")).getTime(); // time in milliseconds of now()
    // populates "tempDateSales" with array of empty objects, one per date
    while (startTime <= nowTime) {
      let tempElement = {};
      tempElement.startTime = startTime;
      tempElement.endTime = startTime + 86400000;
      tempElement.date = dateFnsFormat(new Date(startTime), "EEE: MM/dd/yy");
      tempElement.ticketsSold = 0;
      tempElement.grossRevenues = 0;
      tempElement.orders = 0;
      tempElement.netRevenues = 0;
      tempElement.displayDetail = false;
      startTime += 86400000;
      tempDateSales.push(tempElement);
    }

    // populates "dateSales" array
    props.orders.forEach((order) => {
      let orderTime = new Date(order.createdAt).getTime(); // "orderTime" of each individual order

      tempDateSales.forEach((date, index) => {
        if (orderTime >= date.startTime && orderTime < date.endTime) {
          tempDateSales[index].ticketsSold += order.qty;
          tempDateSales[index].orders += 1;
          tempDateSales[index].netRevenues += order.totalPaidAmount;
        }
      });
    });
    setDateSales(tempDateSales);

    // builds "onlinePayments" and "offlinePayments" arrays
    let tempOfflinePayments = offlinePayments;
    let tempOnlinePayments = onlinePayments;
    props.orders.forEach((order) => {
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
          if (payment.payMethod === "Dogecoin") {
            tempOfflinePayments.Dogecoin += parseFloat(payment.amt);
          }
          if (payment.payMethod === "other") {
            tempOfflinePayments.other += parseFloat(payment.amt);
          }
        });
      } else {
        tempOnlinePayments.online += parseFloat(order.totalPaidAmount);
      }
    });
    setOnlinePayments(tempOnlinePayments);
    setOfflinePayments(tempOfflinePayments);
  }, []);

  const compareValues = (key, order) => {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0;
      }
      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order === "desc" ? comparison * -1 : comparison;
    };
  };

  const updateValues = (newLabel, dataName) => {
    let newDirection;
    let temp;
    if (dataName === "buyers") {
      if (newLabel !== sortBuyersParameters.label) {
        newDirection = sortBuyersParameters.direction;
      } else if (sortBuyersParameters.direction === "asc") {
        newDirection = "desc";
      } else {
        newDirection = "asc";
      }
      console.log("SORTING BUYERS");
      temp = [...buyers];
      temp.sort(compareValues(newLabel, newDirection));
      setBuyers(temp);
      setSortBuyersParameters({ label: newLabel, direction: newDirection });
    } else if (dataName === "codes") {
      if (newLabel !== sortCodesParameters.label) {
        newDirection = sortCodesParameters.direction;
      } else if (sortCodesParameters.direction === "asc") {
        newDirection = "desc";
      } else {
        newDirection = "asc";
      }
      console.log("SORTING CODES");
      temp = [...codes];
      temp.sort(compareValues(newLabel, newDirection));
      setCodes(temp);
      setSortCodesParameters({ label: newLabel, direction: newDirection });
    }
  };

  const netTable = () => {
    return (
      <div className={classes.NetTableGrid}>
        <div
          style={{
            borderLeft: "1px solid grey",
            borderTop: "1px solid grey",
            borderBottom: "1px solid grey",
          }}
        >
          <div className={classes.NetSalesAmount}>
            ${parseFloat(salesTotals.netRevenues).toFixed(2)}
          </div>
          <div className={classes.NetSalesCategory}>Total Revenue</div>
        </div>
        <div style={{ border: "1px solid grey" }}>
          <div className={classes.NetSalesAmount}>
            {salesTotals.ticketsSold}
          </div>
          <div className={classes.NetSalesCategory}>Tickets Issued</div>
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
    );
  };

  const tickets = () => {
    console.log("TicketTotals: ", ticketTotals);
    return (
      <div>
        {ticketTotals.map((ticket, index) => {
          return (
            <div key={index} className={classes.TicketsGrid}>
              <div className={classes.TicketType}>
                <div
                  style={{ backgroundColor: colorSpec[index], width: "15px" }}
                />
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
      <div>
        <div className={classes.TicketsGrid} style={{ fontWeight: "600" }}>
          <div>Ticket Type</div>
          <div style={{ textAlign: "center" }}>Issued</div>
          <div style={{ textAlign: "center" }}>Remaining</div>
          <div style={{ textAlign: "center" }}>Revenue</div>
        </div>
        <div className={classes.TicketsSection}>
          <div>{tickets()}</div>
        </div>
        <div
          className={classes.TicketsGrid}
          style={{ fontWeight: "600", paddingBottom: "30px" }}
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
        className={classes.PieChart}
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
      <div className={classes.TicketChartsNameGrid}>
        <div>Tickets Issued</div>
        <div>Ticket Revenues</div>
      </div>
      <div className={classes.TicketChartsGrid}>
        <div className={classes.PieChartSection}>
          {salesTotals.ticketsSold > 0 ? (
            pieChart("ticketsSold")
          ) : (
            <div>NONE</div>
          )}
        </div>
        <div className={classes.PieChartSection}>
          {salesTotals.netRevenues > 0 ? (
            pieChart("netRevenues")
          ) : (
            <div style={{ paddingTop: "80px" }}>No Revenues to Display</div>
          )}
        </div>
      </div>
    </Fragment>
  );

  const dates = () => {
    return (
      <div>
        {dateSales.map((date, index) => {
          return (
            <div key={index} className={classes.DatesGrid}>
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
      <div>
        <div className={classes.DatesGrid} style={{ fontWeight: "600" }}>
          <div style={{ textAlign: "left" }}>Date</div>
          <div style={{ textAlign: "center" }}>Orders</div>
          <div style={{ textAlign: "center" }}>Tickets</div>
          <div style={{ textAlign: "center" }}>Revenue</div>
        </div>
        <div className={classes.DatesSection}>{dates()}</div>
        <div className={classes.DatesGrid} style={{ fontWeight: "600" }}>
          <div style={{ textAlign: "left" }}>Totals</div>
          <div style={{ textAlign: "center" }}>{props.orders.length}</div>
          <div style={{ textAlign: "center" }}>{salesTotals.ticketsSold}</div>
          <div style={{ textAlign: "right", paddingRight: "10px" }}>
            {parseFloat(salesTotals.netRevenues).toFixed(2)}
          </div>
        </div>
      </div>
    );
  };

  const postalCodes = () => {
    console.log("POSTAL CODES: ", codes);
    console.log("CODES: ", codes);
    return (
      <div>
        {codes.map((code, index) => {
          let tempPostalCode;
          if (code.postalCode === "00000") {
            tempPostalCode = "none";
          } else {
            tempPostalCode = code.postalCode;
          }
          return (
            <div key={index} className={classes.PostalCodesGrid}>
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
      <div>
        <div className={classes.PostalCodesGrid} style={{ fontWeight: "600" }}>
          <button
            className={classes.SortButton}
            name="postalCode"
            onClick={(e) => {
              updateValues(e.target.name, "codes");
            }}
            style={{ textAlign: "left" }}
          >
            Postal Code
          </button>
          <button
            className={classes.SortButton}
            name="ticketsPurchased"
            onClick={(e) => {
              updateValues(e.target.name, "codes");
            }}
            style={{ textAlign: "center" }}
          >
            Tickets
          </button>
          <button
            className={classes.SortButton}
            name="salesRevenues"
            onClick={(e) => {
              updateValues(e.target.name, "codes");
            }}
            style={{ textAlign: "center" }}
          >
            Amount
          </button>
        </div>
        <div className={classes.PostalCodesSection}>{postalCodes()}</div>
        <div className={classes.PostalCodesGrid} style={{ fontWeight: "600" }}>
          <div>Totals</div>
          <div style={{ textAlign: "center" }}>{salesTotals.ticketsSold}</div>
          <div style={{ textAlign: "right", paddingRight: "5px" }}>
            {parseFloat(salesTotals.netRevenues).toFixed(2)}
          </div>
        </div>
      </div>
    );
  };

  const customers = () => {
    return (
      <div>
        {buyers.map((buyer, index) => {
          console.log("Buyer: ", buyer);
          return (
            <div key={index} className={classes.CustomersGrid}>
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
      <div>
        <div className={classes.CustomersGrid} style={{ fontWeight: "600" }}>
          <button
            className={classes.SortButton}
            name="email"
            onClick={(e) => {
              updateValues(e.target.name, "buyers");
            }}
            style={{ textAlign: "left" }}
          >
            Email
          </button>
          <button
            className={classes.SortButton}
            name="lastname"
            onClick={(e) => {
              updateValues(e.target.name, "buyers");
            }}
            style={{ textAlign: "left" }}
          >
            Last, First
          </button>
          <button
            className={classes.SortButton}
            name="ticketsPurchased"
            onClick={(e) => {
              updateValues(e.target.name, "buyers");
            }}
            style={{ textAlign: "left" }}
          >
            Tickets
          </button>
          <button
            className={classes.SortButton}
            name="salesRevenues"
            onClick={(e) => {
              updateValues(e.target.name, "buyers");
            }}
            style={{ textAlign: "left" }}
          >
            Amount
          </button>
        </div>
        <div className={classes.CustomersSection}>{customers()}</div>
        <div className={classes.CustomersGrid} style={{ fontWeight: "600" }}>
          <div>Totals</div>
          <div></div>
          <div style={{ textAlign: "center" }}>{salesTotals.ticketsSold}</div>
          <div style={{ textAlign: "right", paddingRight: "5px" }}>
            {parseFloat(salesTotals.netRevenues).toFixed(2)}
          </div>
        </div>
      </div>
    );
  };

  const payments = () => {
    return (
      <div>
        <div className={classes.PaymentsGrid}>
          <div style={{ fontWeight: "600" }}>Online Payments</div>
          <div style={{ textAlign: "right", paddingRight: "5px" }}>
            {onlinePayments.online.toFixed(2)}
          </div>
        </div>
        <div style={{ fontWeight: "600" }}>Offline</div>
        {Object.entries(offlinePayments).map(([key, val]) => {
          return (
            <div key={key} className={classes.PaymentsGrid}>
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
        <div className={classes.PaymentsGrid} style={{ fontWeight: "600" }}>
          <div style={{ textAlign: "left" }}>Payment Method</div>
          <div style={{ textAlign: "center" }}>Amount</div>
        </div>
        <div className={classes.PaymentsSection}>{payments()}</div>
      </Fragment>
    );
  };

  const tabTitle = (
    <div className={classes.DisplayPanelTitle}>
      {"eventTitle" in props.event ? (
        <div className={classes.TabTitle}>{props.event.eventTitle}</div>
      ) : (
        <div>{null}</div>
      )}
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
      <div className={classes.DisplayPanel}>
        <div className={classes.DisplayTitle}>Sales Analytics</div>

        <div className={classes.SectionTitle}>Net Sales</div>
        <div className={classes.AnalyticsSection}>{netTable()}</div>

        <div className={classes.SectionTitle}>by Ticket Type</div>
        <div className={classes.AnalyticsSection}>
          {ticketsTable()}
          {ticketsCharts}
        </div>

        <div className={classes.SectionTitle}>by Date</div>
        <div className={classes.AnalyticsSection}>{datesTable()}</div>

        <div className={classes.SectionTitle}>by Postal Code</div>
        <div className={classes.AnalyticsSection}>{postalCodesTable()}</div>

        <div className={classes.SectionTitle}>by Customer</div>
        <div className={classes.AnalyticsSection}>{customersTable()}</div>

        <div className={classes.SectionTitle}>by Payment Method</div>
        <div className={classes.AnalyticsSection}>{paymentsTable()}</div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
