import { API } from "../../config";

export const signout = (callback) => {
  // checks if the "window" object exists
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    localStorage.removeItem("orders");
    localStorage.removeItem("events");
    callback();
    return fetch(`${API}/auth/signout`, {
      method: "GET",
    })
      .then((response) => {
        console.log("signout", response);
      })
      .catch((err) => console.log(err));
  }
};
