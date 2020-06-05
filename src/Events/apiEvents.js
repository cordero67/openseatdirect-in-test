import { API } from "../config";

const handleErrors = response => {
// back-end server is down, i.e. response is "undefined"
// "ERROR" will be "err"
console.log("Inside 'apiCore' 'handleErrors()'", response);
//console.log("json response: ", expandedLog(response, 1));
if (!response.ok) {
    console.log("response was false!");
    //console.log("response.status: ", response.status);
    throw Error(response.status);
}
return response;
};

// extracts specific event data, non-transactional
export const getEventData = eventId => {
    return fetch(`${API}/event/e/${eventId}`, {
        method: "GET"
    })
    .then(handleErrors)
    .then(response => {
        console.log("response from getEventData: ", response);
        //console.log("response.json() from getEventData: ", response.json());
        return response.json();
    })
    .catch(err => {
        console.log("Inside '.catch' block of 'getEventData()', this is the error:", err);
        throw Error(err);
    });
};

export const getEventImage = eventId => {
    console.log("Inside apiCore and the 'getEventImage' function call");
    return fetch(`${API}/event/photo/e/${eventId}`, {
      method: "GET"
    })
    .then(handleErrors)
    .then(response => {
    console.log("Inside apiCore and the 'getEventImage' .then block");
    console.log("response: ", response, " response.url: ", response.url);
    return response.url;
    })
    .catch(err => {
    console.log("jumping here", err);
    throw Error(err);
    });
};