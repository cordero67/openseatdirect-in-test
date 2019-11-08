import React, { Component } from "react";
import queryString from "query-string";

import { getEventData } from "./apiCore";

const EVENTVALUES = {
  eventID: ""
};

class QueryRouting extends Component {
  state = {
    value: ""
  };

  componentDidMount() {
    console.log("Query search value:", window.location.search);

    this.setState({ value: queryString.parse(window.location.search).eventID });
    EVENTVALUES.eventID = queryString.parse(window.location.search).eventID;

    console.log("state.value: ", this.state.value);
    console.log("EVETVALUES.eventID: ", EVENTVALUES.eventID);

    this.eventData(queryString.parse(window.location.search).eventID);
  }

  // defines the function that retrieves the Braintree token
  // this represents parts "1" and "2" of the Braintree interaction
  eventData = eventID => {
    getEventData(eventID)
      .then(res => {
        console.log("Event Data Received NOW", res);
        console.log("Ticket Info: ", res.ticket);
        console.log("Event Title: ", res.eventTitle);
      })
      .catch(err => {
        console.log("In the catch");
        console.log("Event Data NOTTTT Recevied");
      });
  };

  render() {
    return (
      <div>
        <h2>Inside Query Routing Component</h2>
        <h3>URL: {window.location.href}</h3>
        <h4>
          Query String using "window.location.search": {window.location.search}
        </h4>
        <h4>Event using "value": {this.state.value}</h4>
        <h4>Event from "EVENTVALUES": {EVENTVALUES.eventID}</h4>
      </div>
    );
  }
}
export default QueryRouting;
