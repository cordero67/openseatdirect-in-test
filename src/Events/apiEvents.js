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

// USED BY CURRENT CODE APRIL 17, 2021
// extracts specific event data, non-transactional
export const getEventData = (eventId) => {
  return fetch(`${API}/event/e/${eventId}`, {
    method: "GET",
  })
    .then(handleErrors)
    .then((response) => {
      console.log("response from getEventData: ", response);
      //console.log("response.json() from getEventData: ", response.json());
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

// USED BY CURRENT CODE APRIL 17, 2021
// NEED TO REFACTOR TO NEW TEMPLATE
// retrieves image for a specific event
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
      console.log("Inside catch", err);
      throw Error(err);
    });
};

// USED BY CURRENT CODE APRIL 17, 2021
// REFACTORED
// retrieves all public event data (less image), non-transactional
export const getAllEventData = () => {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow", // what is this and when is it required
  };

  //let fetchstr = `${API}/event/all`;
  let fetchstr = `${API}/pevents`;

  return fetch(fetchstr, requestOptions)
    .then(handleErrors)
    .then((response) => response.text())
    .then((result) => {
      let js = JSON.parse(result);
      //js.sort(compareValues("startDateTime", "asc"));
      //console.log("eventDescriptions ordered: ", js);
      return js;
    })
    .catch((error) => {
      console.log("Inside getAllEventData .catch", error);
      throw Error(error);
    });
};

// USED BY CURRENT CODE APRIL 17, 2021
// REFACTORED
// retrieves all public event data (less image), non-transactional
export const getAllPastEventData = () => {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow", // what is this and when is it required
  };

  let fetchstr = `${API}/event/allpast`;

  return fetch(fetchstr, requestOptions)
    .then(handleErrors)
    .then((response) => response.text())
    .then((result) => {
      let js = JSON.parse(result);
      //js.sort(compareValues("startDateTime", "asc"));
      //console.log("eventDescriptions ordered: ", js);
      return js;
    })
    .catch((error) => {
      console.log("Inside getAllEventData .catch", error);
      throw Error(error);
    });
};
