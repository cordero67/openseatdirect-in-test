import { API } from "../config";

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

const handleErrors = (response) => {
  console.log("Inside 'apiCore' 'handleErrors()'", response);
  if (!response.ok) {
    throw Error(response.status);
  }
  return response;
};

// extracts specific event data, non-transactional
export const getEventData = (eventId) => {
  return fetch(`${API}/events/${eventId}`, {
    method: "GET",
  })
    .then(handleErrors)
    .then((response) => {
      console.log("response from getEventData: ", response);
      return response.json();
    })
    .catch((err) => {
      console.log(
        "Inside '.catch' block of 'getEventData()', this is the error:",
        err
      );
      throw Error(err);
    });
};

// REFACTORED
// retrieves all public event data (less image), non-transactional
export const getAllEventDataXXXXX = () => {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow", // what is this and when is it required
  };
  let fetchstr = `${API}/events`;

  return fetch(fetchstr, requestOptions)
    .then(handleErrors)
    .then((response) => response.text())
    .then((result) => {
      let js = JSON.parse(result);
      return js;
    })
    .catch((error) => {
      console.log("Inside getAllEventData .catch", error);
      throw Error(error);
    });
};

// REFACTORED
// retrieves all public event data (less image), non-transactional
export const getAllPastEventDataXXX = () => {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow", // what is this and when is it required
  };

  let fetchstr = `${API}/events?past=true`;

  return fetch(fetchstr, requestOptions)
    .then(handleErrors)
    .then((response) => response.text())
    .then((result) => {
      let js = JSON.parse(result);
      return js;
    })
    .catch((error) => {
      console.log("Inside getAllEventData .catch", error);
      throw Error(error);
    });
};
