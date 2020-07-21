import { API } from "../config";

const handleErrors = response => {
  console.log("Inside 'apiUsers' 'handleErrors()'", response);
  if (!response.ok) {
    throw Error(response.status);
  }
  return response;
};

export const signin = (user) => {
  return fetch(`${API}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then(handleErrors)
    .then((response) => {
      console.log("success");
      return response.json();
    })
    .catch((err) => {
      console.log("failure");
      console.log(err);
      throw Error(err);
    });
};

//{"error":"Email and password do not match"}


export const signup = (user) => {
  var myHeaders = new Headers();
  //myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");

  let apiurl;
  apiurl = `${API}/signup`;

  return fetch(apiurl, {
    method: "POST",
    headers: myHeaders,
    //headers: {
    //  Accept: "application/json",
    //  "Content-Type": "application/json",
    //},
    body: JSON.stringify(user),
    redirect: "follow"
  })
    .then(handleErrors)
    .then((response) => {
      console.log("success");
      console.log("response: ", response)
      return response.json();
    })
    .catch((err) => {
      console.log("failure");
      console.log(err);
      throw err;
    });
};

/*
    .then(handleErrors)
    .then((response) => {
      console.log("response in create", response);
      return response.json();
    })
    .then((res) => {
      console.log("Event was saved/went live");
      console.log("res: ", res);
      
      if (!res.done && res.friendlyMessage) {
        console.log("Inside: res.done ",res.done," res.friendlyMessage ", res.friendlyMessage)
        tempStatus.status = "error";
        tempStatus.errorMessage = res.friendlyMessage;
      } else if(!res.done && res.error) {
        console.log("Inside: res.done ",res.done," res.friendlyMessage ", res.friendlyMessage)
        tempStatus.status = "error";
        tempStatus.errorMessage = res.error;
      } else if(!res.done && !res.friendlyMessage) {
        console.log("Inside: res.done ",res.done," res.friendlyMessage ", res.friendlyMessage)
        tempStatus.status = "failure";
      }
      setEventStatus(tempStatus);
      return res;
    })
    .catch((err) => {
      console.log("Inside the .catch")
      console.log("**ERROR THROWN", err);
      tempStatus.status = "failure";
      setEventStatus(tempStatus);
    });
  }
}
*/

export const signout = (callback) => {
  // checks if the "window" object exists
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
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

/*
export const isAuthenticated = () => {
  if (
    typeof window !== "undefined" &&
    localStorage.getItem(`user`) !== null
  ) {
    return JSON.parse(localStorage.getItem("user"));
  } else {
    window.location.href = "/signin";
  }
};
*/


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
export const getAllEventData = (userId) => {
  return fetch(`${API}/event/list/${userId}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log("jumping here", err);
    });
};
