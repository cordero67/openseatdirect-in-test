import { API } from "../../config";
import { each, isObject } from "underscore";

const handleErrors = (response) => {
  console.log("Inside 'apiCore' 'handleErrors()'", response);
  console.log("Inside 'apiCore' 'handleErrors()'");
  //console.log("json response: ", expandedLog(response, 1));
  if (!response.ok) {
    //console.log("response was false!");
    //console.log("response.status: ", response.status);
    throw Error(response.status);
  }
  return response;
};

// USED BY CURRENT CODE APRIL 17, 2021
// extracts specific event data, non-transactional
export const getEventData = (eventId) => {
  return fetch(`${API}/events/${eventId}`, {
    method: "GET",
  })
    .then(handleErrors)
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      throw Error(err);
    });
};

// USED BY CURRENT CODE APRIL 17, 2021
export const getEventImage = (eventId) => {
  console.log("Inside apiCore and the 'getEventImage' function call");
  return fetch(`${API}/event/photo/e/${eventId}`, {
    method: "GET",
  })
    .then(handleErrors)
    .then((response) => {
      console.log("Inside apiCore and the 'getEventImage' .then block");
      console.log("response: ", response, " response.url: ", response.url);
      return response.url;
    })
    .catch((err) => {
      console.log("jumping here", err);
      throw Error(err);
    });
};

var expandedLog = (function () {
  var MAX_DEPTH = 100;

  return function (item, depth) {
    depth = depth || 0;

    if (depth > MAX_DEPTH) {
      console.log(item);
      return;
    }

    if (isObject(item)) {
      each(item, function (value, key) {
        console.group(key + " : " + typeof value);
        expandedLog(value, depth + 1);
        console.groupEnd();
      });
    } else {
      console.log(item);
    }
  };
})();

// *********
// NEED TO ADJUST
// PayPal Smart button fetch api
export const expressPaymentOnSuccess = (paymentTicketData) => {
  return (
    fetch(`${API}/paypal/expressPayment`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentTicketData),
    })
      .then(handleErrors)
      .then((response) => {
        //console.log("response: ", response)
        return response.json();
      })
      // NEED TO RETURN ERROR STATEMENT THAT BACKEND IS DOWN
      .catch((err) => {
        console.log("fetch API/paypal/expressPayment): ERROR THROWN", err);
        throw Error(err);
      })
  );
};

// PayPal Smart button fetch api
export const paymentOnSuccess = (paypalOrderDetails, customerInformation) => {
  console.log("paypalOrderDetails: ", paypalOrderDetails);
  if ("sessionToken" in customerInformation) {
    console.log("User is logged in");
    let orderDetails = {
      orderDetails: {
        paypalOrderDetails: paypalOrderDetails,
      },
    };
    return (
      fetch(`${API}/paypal/signedPayment/${customerInformation.userId}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${customerInformation.sessionToken}`,
        },
        body: JSON.stringify(orderDetails),
      })
        .then(handleErrors)
        .then((response) => {
          return response.json();
        })
        // NEED TO RETURN ERROR STATEMENT THAT BACKEND IS DOWN
        .catch((err) => {
          console.log("fetch API/paypal/guestPayment): ERROR THROWN", err);
          throw Error(err);
        })
    );
  } else {
    console.log("User is NOT logged in");
    let orderDetails = {
      orderDetails: {
        guestInfo: customerInformation,
        paypalOrderDetails: paypalOrderDetails,
      },
    };
    return (
      fetch(`${API}/paypal/guestPayment`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetails),
      })
        .then(handleErrors)
        .then((response) => {
          return response.json();
        })
        // NEED TO RETURN ERROR STATEMENT THAT BACKEND IS DOWN
        .catch((err) => {
          console.log("fetch API/paypal/guestPayment): ERROR THROWN", err);
          throw Error(err);
        })
    );
  }
};
