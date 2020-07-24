import { API } from "../../config";

import { useEffect, useState } from "react"; //HENRIK SOMMERFELD example

/*  Example
    initialUrl: "/_api/jobs"
    initialData: [] //usually empty array or object
*/

export const useSignin = (user) => { //HENRIK SOMMERFELD example
  const [isLoading, setIsLoading] = useState(true); //HENRIK SOMMERFELD example
  const [hasError, setHasError] = useState(false); //HENRIK SOMMERFELD example
  const [fetchedData, setFetchedData] = useState(); //HENRIK SOMMERFELD example

  useEffect(() => { //HENRIK SOMMERFELD example
    console.log("entered useEffect of useSignin")

    const handleFetchResponse = response => { //HENRIK SOMMERFELD example
      console.log("entered handleFetchResponse of useSignin")
      console.log("response: ", response)
      setHasError(!response.ok); //HENRIK SOMMERFELD example
      setIsLoading(false); //HENRIK SOMMERFELD example
      return response.ok && response.json ? response.json() : user; //HENRIK SOMMERFELD example
    }; //HENRIK SOMMERFELD example

    const fetchData = () => { //HENRIK SOMMERFELD example
      
      console.log("entered fetchData of useSignin")
      setIsLoading(true); //HENRIK SOMMERFELD example

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      return fetch(`${API}/signin`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(user),
      })
      .then(handleFetchResponse) //HENRIK SOMMERFELD example
      .catch(handleFetchResponse); //HENRIK SOMMERFELD example

    }; //HENRIK SOMMERFELD example


    if (user) {//HENRIK SOMMERFELD example
      console.log("entered 'if fetch' code")
      fetchData().then(data => setFetchedData(data)); //HENRIK SOMMERFELD example
    }

    return () => { //HENRIK SOMMERFELD example
    }; //HENRIK SOMMERFELD example
  }, []); //HENRIK SOMMERFELD example

  return { isLoading, hasError, data: fetchedData }; //HENRIK SOMMERFELD example
}; //HENRIK SOMMERFELD example








/*
export const signinOld = (user) => {
  console.log("inside recoverPassword")
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  return fetch(`${API}/signin`, {
    method: "POST",
    headers: myHeaders,
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



import { useEffect, useState } from "react"; //HENRIK SOMMERFELD example

  Example
    initialUrl: "/_api/jobs"
    initialData: [] //usually empty array or object

export const useSignin = (initialUrl, initialData) => { //HENRIK SOMMERFELD example
  // sets "url" to the value of url argument "initialUrl"
  const [url, setUrl] = useState(initialUrl); //HENRIK SOMMERFELD example
  const [isLoading, setIsLoading] = useState(true); //HENRIK SOMMERFELD example
  const [hasError, setHasError] = useState(false); //HENRIK SOMMERFELD example
  // sets "fetchedData" to the value of data argument "initialData"
  const [fetchedData, setFetchedData] = useState(initialData); //HENRIK SOMMERFELD example

  useEffect(() => { //HENRIK SOMMERFELD example
    //let unmounted = false; //HENRIK SOMMERFELD example

    const handleFetchResponse = response => { //HENRIK SOMMERFELD example
    // will return "initialData" if all the following conditions exist
    // "unmounted === false"
    // "response.ok === true"
    // "response.json === true"

      // if "unmounted" is "true" returns "initialData" argument
      //if (unmounted) return initialData; //HENRIK SOMMERFELD example

      // if "unmounted" is "false" returns "initialData" argument
      // sets "hasError" to opposite of "response.ok"
      setHasError(!response.ok); //HENRIK SOMMERFELD example
      // loading status is now "true"
      setIsLoading(false); //HENRIK SOMMERFELD example
      // if "response.ok" and "response.json" are "true" returns "response.json"
      // else returns "initialData"
      return response.ok && response.json ? response.json() : initialData; //HENRIK SOMMERFELD example
    }; //HENRIK SOMMERFELD example


    const fetchData = () => { //HENRIK SOMMERFELD example
      // loading status is now "true"
      setIsLoading(true); //HENRIK SOMMERFELD example
      // defines fetch with "url"
      return fetch(url, { credentials: 'include' }) //HENRIK SOMMERFELD example
        // alwauys jumps to "handleFetchResponse"
        .then(handleFetchResponse) //HENRIK SOMMERFELD example
        .catch(handleFetchResponse); //HENRIK SOMMERFELD example
    }; //HENRIK SOMMERFELD example


    // will only execute "fetchData" if "initialUrl" is defined and "unmounted === false"
    //if (initialUrl && !unmounted) //HENRIK SOMMERFELD example
    if (initialUrl) //HENRIK SOMMERFELD example
      // receives either "initialData" or "response.json()"
      // sets return to "fetchedData"
      //fetchData().then(data => !unmounted && setFetchedData(data)); //HENRIK SOMMERFELD example
      fetchData().then(data => setFetchedData(data)); //HENRIK SOMMERFELD example


    return () => { //HENRIK SOMMERFELD example
      //unmounted = true; //HENRIK SOMMERFELD example
    }; //HENRIK SOMMERFELD example
  }, [url]); //HENRIK SOMMERFELD example

  return { isLoading, hasError, setUrl, data: fetchedData }; //HENRIK SOMMERFELD example
}; //HENRIK SOMMERFELD example



export const recoverPassword = (user) => {
  console.log("inside recoverPassword")
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let apiurl;
  apiurl = `${API}/forgot`;

  //forgotpassword?token=f349ad4b9248f991e777b0ff64d1abc7aedab365&email=gual325@gmail.com

  return fetch(apiurl, {
    method: "POST",
    headers: myHeaders,
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


const handleErrors = response => {
  console.log("Inside 'apiUsers' 'handleErrors()'", response);
  if (!response.ok) {
    console.log("response: ", response)
    throw Error(response.status);
  }
  return response;
};
*/