import { API } from "../../config";

import { useEffect, useState } from "react"; //HENRIK SOMMERFELD example

export const useSignin = (userData) => { //HENRIK SOMMERFELD example
  const [refreshCounter, setRefreshCounter] = useState();
  const [isLoading, setIsLoading] = useState(true); //HENRIK SOMMERFELD example
  const [hasError, setHasError] = useState(false); //HENRIK SOMMERFELD example
  const [fetchedData, setFetchedData] = useState(""); //HENRIK SOMMERFELD example
  let data;
  console.log("entered useSignin")
  console.log("userData: ", userData)

  useEffect(() => { //HENRIK SOMMERFELD example
    let unmounted = false;
    console.log("entered useEffect of useSignin")

    const handleFetchResponse = response => { //HENRIK SOMMERFELD example
      console.log("entered handleFetchResponse of useSignin")
      console.log("response: ", response)
      setHasError(!response.ok); //HENRIK SOMMERFELD example
      setIsLoading(false); //HENRIK SOMMERFELD example
      return response.ok && response.json ? response.json() : "Email and password mismatch"; //HENRIK SOMMERFELD example
    }; //HENRIK SOMMERFELD example

    const fetchData = () => { //HENRIK SOMMERFELD example
      console.log("entered fetchData of useSignin")
      setIsLoading(true); //HENRIK SOMMERFELD example

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      return fetch(`${API}/signin`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(userData),
      })
      .then(handleFetchResponse) //HENRIK SOMMERFELD example
      .catch(handleFetchResponse); //HENRIK SOMMERFELD example

    }; //HENRIK SOMMERFELD example

    if (userData && !unmounted) {//HENRIK SOMMERFELD example
      console.log("NOT Initial render")
      fetchData().then(message => setFetchedData(message)); //HENRIK SOMMERFELD example
    } else {
      console.log("Initial render")
      setIsLoading(false);
    }

    return () => { //HENRIK SOMMERFELD example
      unmounted = true; //HENRIK SOMMERFELD example
    }; //HENRIK SOMMERFELD example
  }, [refreshCounter]); //HENRIK SOMMERFELD example
  
  console.log("fetchedData: ", fetchedData)

  return { message: fetchedData, isLoading, hasError, setRefreshCounter}; //HENRIK SOMMERFELD example
}; //HENRIK SOMMERFELD example





























export const useSigninOld = (userData, initialRender) => { //HENRIK SOMMERFELD example
  const [refreshCounter, setRefreshCounter] = useState();
  const [isLoading, setIsLoading] = useState(true); //HENRIK SOMMERFELD example
  //const [redirect, setRedirect] = useState(false); //HENRIK SOMMERFELD example
  const [hasError, setHasError] = useState(false); //HENRIK SOMMERFELD example
  const [fetchedData, setFetchedData] = useState(""); //HENRIK SOMMERFELD example
  let data;
  console.log("entered useSignin")
  console.log("userData: ", userData)

  useEffect(() => { //HENRIK SOMMERFELD example
    console.log("entered useEffect of useSignin")

    const handleFetchResponse = response => { //HENRIK SOMMERFELD example
      console.log("entered handleFetchResponse of useSignin")
      console.log("response: ", response)
      setHasError(!response.ok); //HENRIK SOMMERFELD example
      //setRedirect(response.ok);
      setIsLoading(false); //HENRIK SOMMERFELD example
      return response.ok && response.json ? response.json() : "Email and password mismatch"; //HENRIK SOMMERFELD example
    }; //HENRIK SOMMERFELD example

    const fetchData = () => { //HENRIK SOMMERFELD example
      console.log("entered fetchData of useSignin")
      setIsLoading(true); //HENRIK SOMMERFELD example

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      return fetch(`${API}/signin`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(userData),
      })
      .then(handleFetchResponse) //HENRIK SOMMERFELD example
      .catch(handleFetchResponse); //HENRIK SOMMERFELD example

    }; //HENRIK SOMMERFELD example

    if (userData && !initialRender) {//HENRIK SOMMERFELD example
      console.log("NOT Initial render")
      fetchData().then(message => setFetchedData(message)); //HENRIK SOMMERFELD example
    } else {
      console.log("Initial render")
      setIsLoading(false);
    }

    //return () => { //HENRIK SOMMERFELD example
    //}; //HENRIK SOMMERFELD example
  }, [refreshCounter]); //HENRIK SOMMERFELD example
  
  console.log("fetchedData: ", fetchedData)
/*
  if(redirect === true && typeof window !== "undefined") {
    console.log("fetchedData: ", fetchedData);
    console.log("JSON.stringify(data): ", JSON.stringify(fetchedData));
    localStorage.setItem("user", JSON.stringify(fetchedData));
    data = JSON.parse(localStorage.getItem("user"))
    console.log("data: ", data)

  }
  */

  return { message: fetchedData, isLoading, hasError, setRefreshCounter}; //HENRIK SOMMERFELD example
}; //HENRIK SOMMERFELD example












/*
export const signin = (user) => { //HENRIK SOMMERFELD example
  const [isLoading, setIsLoading] = useState(true); //HENRIK SOMMERFELD example
  const [hasError, setHasError] = useState(false); //HENRIK SOMMERFELD example
  const [fetchedData, setFetchedData] = useState(""); //HENRIK SOMMERFELD example

  useEffect(() => { //HENRIK SOMMERFELD example
    console.log("entered useEffect of useSignin")

    const handleFetchResponse = response => { //HENRIK SOMMERFELD example
      console.log("entered handleFetchResponse of useSignin")
      console.log("response: ", response)
      setHasError(!response.ok); //HENRIK SOMMERFELD example
      setIsLoading(false); //HENRIK SOMMERFELD example
      //return response.ok && response.json ? response.json() : user; //HENRIK SOMMERFELD example
      return response.ok && response.json ? "Success!!!!" : "Email and password mismatch"; //HENRIK SOMMERFELD example
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
      fetchData().then(message => setFetchedData(message)); //HENRIK SOMMERFELD example
    }

    return () => { //HENRIK SOMMERFELD example
    }; //HENRIK SOMMERFELD example
  }, []); //HENRIK SOMMERFELD example

  return { message: fetchedData, isLoading, hasError}; //HENRIK SOMMERFELD example
}; //HENRIK SOMMERFELD example
*/