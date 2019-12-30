import { API } from "../config";

/*
export const getAllUserEvents = (token) => {
    return fetch(`${API}/getAllUserEvents`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

api/event/list/5d940dd0bd171e791f566565

*/

// extracts all event data, non-transactional
export const getAllEventData = userId => {
  return fetch(`${API}/event/list/${userId}`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log("jumping here", err);
    });
};

export const signup = user => {
  return fetch(`${API}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      console.log("success");
      return response.json();
    })
    .catch(err => {
      console.log("failure");
      console.log(err);
    });
};

export const signin = user => {
  return fetch(`${API}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      console.log("success");
      return response.json();
    })
    .catch(err => {
      console.log("failure");
      console.log(err);
    });
};

export const signout = callback => {
  // checks if the "window" object exists
  if (typeof window !== "undefined") {
    // "localStorage" property allows access the Storage object for a document's origin
    // the stored data is saved across browser sessions and has no expiration time, even when window is closed
    // "removeItem()"removes stored token value in the "user" key
    localStorage.removeItem("user");
    callback();
    // makes request to backend to logout the user
    return fetch(`${API}/signout`, {
      method: "GET"
    })
      .then(response => {
        console.log("signout", response);
      })
      .catch(err => console.log(err));
  }
};

export const authenticate = (data, callback) => {
  // checks if the "window" object exists
  if (typeof window !== "undefined") {
    // "localStorage" property allows access the Storage object for a document's origin
    // the stored data is saved across browser sessions and has no expiration time, even when window is closed
    // "setItem()" adds a data item to "localStorage" with a key of "jwt" and a value of "JSON.stringify(data)"
    localStorage.setItem("user", JSON.stringify(data));
    callback();
  }
};

export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("user")) {
    return JSON.parse(localStorage.getItem("user"));
  } else {
    return false;
  }
};
