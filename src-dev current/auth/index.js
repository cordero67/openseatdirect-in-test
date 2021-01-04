import { API } from "../config";

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

export const signout = next => {
  // checks if the "window" object exists
  if (typeof window !== "undefined") {
    // "localStorage" property allows access the Storage object for a document's origin
    // the stored data is saved across browser sessions and has no expiration time, even when window is closed
    // "setItem()"removes stored token value in the "jwt" key
    localStorage.removeItem("jwt");
    next();
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

export const authenticate = (data, next) => {
  // checks if the "window" object exists
  if (typeof window !== "undefined") {
    // "localStorage" property allows access the Storage object for a document's origin
    // the stored data is saved across browser sessions and has no expiration time, even when window is closed
    // "setItem()" adds a data item to "localStorage" with a key of "jwt" and a value of "JSON.stringify(data)"
    localStorage.setItem("jwt", JSON.stringify(data));
    next();
  }
};

export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};
