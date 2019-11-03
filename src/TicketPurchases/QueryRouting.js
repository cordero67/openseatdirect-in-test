import React, { Component } from "react";
import queryString from "query-string";

import { getEventData } from "./apiCore";

const EVENTVALUES = {
  eventID: "",
  eventName: ""
};

class QueryRouting extends Component {
  state = {
    value: ""
  };

  componentDidMount() {
    console.log("Query search value:", window.location.search);

    this.setState({ value: queryString.parse(window.location.search) });
    EVENTVALUES.eventID = queryString.parse(window.location.search).eventID;
    EVENTVALUES.eventName = queryString.parse(window.location.search).name;

    console.log("EventID from queryString: ", this.state.value.eventID);
    console.log("Name from queryString: ", this.state.value.name);
    console.log("state value variable: ", this.state.value);
    this.eventData(queryString.parse(window.location.search).eventID);
  }

  // defines the function that retrieves the Braintree token
  // this represents parts "1" and "2" of the Braintree interaction
  eventData = eventID => {
    getEventData(eventID)
      .then(res => {
        console.log("Event Data Received", res);
      })
      .catch(err2 => {
        console.log("Event Data NOT Recevied");
      });
  };

  render() {
    return (
      <div>
        <h2>Inside Query Routing Component</h2>
        <h4>
          Query String using "window.location.search": {window.location.search}
        </h4>
        <h4>
          EventID using "queryString":{" "}
          {queryString.parse(window.location.search).eventID}
        </h4>
        <h4>
          Name using "queryString":{" "}
          {queryString.parse(window.location.search).name}
        </h4>
        <h4>Event using "value": {this.state.value.eventID}</h4>
        <h4>Name using "value": {this.state.value.name}</h4>
        <h4>Event from "EVENTVALUES": {EVENTVALUES.eventID}</h4>
        <h4>Name from "EVENTVALUES": {EVENTVALUES.eventName}</h4>
      </div>
    );
  }
}
export default QueryRouting;
