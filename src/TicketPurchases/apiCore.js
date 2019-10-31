import { API } from "../config";

let statement = {
  error: true,
  message: "buckle your seatbelts, there was an error"
};

// NEW api TO EXTRACT EVENT DATA FROM SERVER
export const getEventData = eventId => {
  return fetch(`${API}/eventId/${eventId}`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log("jumping here", err);
    });
};

const handleErrors = response => {
  // different error casses
  // back-end server is down, i.e. response is "undefined"
  // "ERROR" will be "err"
  console.log("Handle Error", response);
  if (!response.ok) throw Error(response.statusText);
  return response;
};

export const processExpressPayment = paymentTicketData => {
  return (
    fetch(`${API}/braintree/expressPayment`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(paymentTicketData)
    })
      .then(handleErrors)
      .then(response => {
        return response.json();
      })
      // NEED TO RETURN ERROR STATEMENT THAT BACKEND IS DOWN
      .catch(err => {
        console.log("SERVER MAYBE DOWN", err);
        throw Error(err);
      })
  );
};

export const getExpressBraintreeClientToken = () => {
  return fetch(`${API}/braintree/getExpressToken`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(handleErrors)
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log("child error thrown", err);
      throw Error(err);
    });
};

export const getBraintreeClientToken = (userId, token) => {
  return fetch(`${API}/braintree/getToken/${userId}`, {
    method: "GET",

    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(handleErrors)
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const processPayment = (userId, token, paymentData) => {
  return fetch(`${API}/braintree/payment/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(paymentData)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};
