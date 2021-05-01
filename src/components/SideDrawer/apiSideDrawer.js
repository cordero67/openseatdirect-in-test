import { API } from "../../config";

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
