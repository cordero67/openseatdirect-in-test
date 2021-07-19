import { API } from "../config";

const handleErrors = (response) => {
  console.log("Inside 'apiUsers' 'handleErrors()'", response);
  if (!response.ok) {
    console.log("response: ", response);
    throw Error(response.status);
  }
  return response;
};

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
    redirect: "follow",
  })
    .then(handleErrors)
    .then((response) => {
      console.log("success");
      console.log("response: ", response);
      return response.json();
    })
    .catch((err) => {
      console.log("failure");
      console.log(err);
      throw err;
    });
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
      console.log("response: ", response);

      console.log("success");
      return response.json();
    })
    .catch((err) => {
      console.log("failure");
      console.log(err);
      throw Error(err);
    });
};

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

export const recoverPassword = (user) => {
  console.log("inside recoverPassword");
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let apiurl;
  apiurl = `${API}/forgot`;

  return fetch(apiurl, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(user),
    redirect: "follow",
  })
    .then(handleErrors)
    .then((response) => {
      console.log("success");
      console.log("response: ", response);
      return response.json();
    })
    .catch((err) => {
      console.log("failure");
      console.log(err);
      throw err;
    });
};

export const resetPassword = (user) => {
  console.log("inside resetPassword");
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let apiurl;
  apiurl = `${API}/auth/reset?token=${user.token}&email=${user.email}`;
  console.log("apiurl: ", apiurl);

  return fetch(apiurl, {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  })
    .then(handleErrors)
    .then((response) => {
      console.log("success");
      //console.log("response: ", response)
      return response.json();
    })
    .catch((err) => {
      console.log("failure");
      console.log(err);
      throw err;
    });
};

export const changePassword = (user) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  console.log("user: ", user);

  let apiurl;
  apiurl = `${API}/updatePasswordViaEmail`;
  console.log("apiurl: ", apiurl);

  return fetch(apiurl, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(user),
    redirect: "follow",
  })
    .then(handleErrors)
    .then((response) => {
      console.log("success");
      console.log("response: ", response);
      return response.json();
    })
    .catch((err) => {
      console.log("failure");
      console.log(err);
      throw err;
    });
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
  if (typeof window !== "undefined" && localStorage.getItem("user")) {
    return JSON.parse(localStorage.getItem("user"));
  } else {
    return false;
  }
};

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
