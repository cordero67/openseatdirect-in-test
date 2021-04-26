import { API } from "../config";
/*
const handleErrors = (response) => {
  console.log("Inside 'apiUsers' 'handleErrors()'", response);
  if (!response.ok) {
    console.log("response: ", response);
    throw Error(response.status);
  }
  return response;
};
*/
// USED BY CURRENT CODE APRIL 17, 2021
export const signout = (callback) => {
  // checks if the "window" object exists
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    localStorage.removeItem("orders");
    localStorage.removeItem("events");
    callback();
    return fetch(`${API}/signout`, {
      method: "GET",
    })
      .then((response) => {
        console.log("signout", response);
      })
      .catch((err) => console.log(err));
  }
};

export const authenticate = (data, callback) => {
  // checks if the "window" object exists
  if (typeof window !== "undefined") {
    console.log("data: ", data);
    console.log("JSON.stringify(data): ", JSON.stringify(data));
    localStorage.setItem("user", JSON.stringify(data));
    callback();
  }
};

// USED BY CURRENT CODE APRIL 17, 2021
export const isAuthenticated = () => {
  // checks if the "window" object exists
  if (typeof window === "undefined") {
    return false;
  }
  if (localStorage.getItem("user")) {
    return JSON.parse(localStorage.getItem("user"));
  } else {
    return false;
  }
};
