import { API } from "../config";

import { each, isObject } from "underscore";

// extracts specific event data, non-transactional
export const getEventData = eventId => {
  return fetch(`${API}/event/e/${eventId}`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log("jumping here", err);
    });
};

// extracts specific event data, non-transactional
export const getEventImage = eventId => {
  console.log("Inside apiCore and the 'getEventImage' function call");
  return fetch(`${API}/event/photo/e/${eventId}`, {
    method: "GET"
  })
    .then(response => {
      console.log("Inside apiCore and the 'getEventImage' .then block");
      return response.url;
    })
    .catch(err => {
      console.log("jumping here", err);
    });
};

var expandedLog = (function() {
  var MAX_DEPTH = 100;

  return function(item, depth) {
    depth = depth || 0;

    if (depth > MAX_DEPTH) {
      console.log(item);
      return;
    }

    if (isObject(item)) {
      each(item, function(value, key) {
        console.group(key + " : " + typeof value);
        expandedLog(value, depth + 1);
        console.groupEnd();
      });
    } else {
      console.log(item);
    }
  };
})();

const handleErrors = response => {
  // different error casses
  // back-end server is down, i.e. response is "undefined"
  // "ERROR" will be "err"
  console.log("apiCore handleErrors()", response);
  console.log("json response: ", expandedLog(response, 1));
  if (!response.ok) {
    console.log("response was false!");
    throw Error(response.status);
  }
  return response;
};

// *********
// NEED TO ADJUST
// CURRENTLY USING fetch(`${API}/braintree/expressPayment`)
// WILL BE CHANGED TO fetch(`${API}/paypal/expressPaymentPreOrder1`)
// RUNTIME ERROR CAUSED BY ".then(handleErrors)"
// PayPal Smart button fetch api
export const expressPaymentPreOrder1 = paymentTicketData => {
  return (
    fetch(`${API}/paypal/expressPayment`, {
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
        console.log(
          "fetch(`${API}/braintree/expressPayment`): ERROR THROWN",
          err
        );
        throw Error(err);
      })
  );
};

// *********
// NEED TO ADJUST
// CURRENTLY USING fetch(`${API}/braintree/expressPayment`)
// WILL BE CHANGED TO fetch(`${API}/paypal/expressPaymentOnSuccess`)
// RUNTIME ERROR CAUSED BY ".then(handleErrors)"
// PayPal Smart button fetch api
export const expressPaymentOnSuccess = paymentTicketData => {
  return (
    fetch(`${API}/paypal/expressPayment`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(paymentTicketData)
    })
      //.then(handleErrors)
      .then(response => {
        return response.json();
      })
      // NEED TO RETURN ERROR STATEMENT THAT BACKEND IS DOWN
      .catch(err => {
        console.log(
          "fetch(`${API}/braintree/expressPayment`): ERROR THROWN",
          err
        );
        throw Error(err);
      })
  );
};

// BrainTree fetch api
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
        console.log(
          "fetch(`${API}/braintree/expressPayment`): ERROR THROWN",
          err
        );
        throw Error(err);
      })
  );
};

// BrainTree fetch api
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
      console.log(
        "fetch(`${API}/braintree/getExpressToken`): ERROR THROWN",
        err
      );
      throw Error(err);
    });
};

// BrainTree fetch api
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

// BrainTree fetch api
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
