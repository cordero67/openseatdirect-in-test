import { API } from "../../config";

import { useEffect, useState } from "react"; //HENRIK SOMMERFELD example

/*  Example
    initialUrl: "/_api/jobs"
    initialData: [] //usually empty array or object
*/

export const useSignin = (user, initialRender, counter) => { //HENRIK SOMMERFELD example
  const [refreshCounter, setRefreshCounter] = useState(counter);
  const [isLoading, setIsLoading] = useState(true); //HENRIK SOMMERFELD example
  const [hasError, setHasError] = useState(false); //HENRIK SOMMERFELD example
  const [fetchedData, setFetchedData] = useState(""); //HENRIK SOMMERFELD example
  console.log("entered useSignin")
  console.log("user: ", user)
  console.log("counter: ", counter)

  useEffect(() => { //HENRIK SOMMERFELD example
    console.log("entered useEffect of useSignin")

    if (counter > 0) {
      setRefreshCounter(counter => counter + 1)
    }

    const handleFetchResponse = response => { //HENRIK SOMMERFELD example
      console.log("entered handleFetchResponse of useSignin")
      console.log("response: ", response)
      setHasError(!response.ok); //HENRIK SOMMERFELD example
      setIsLoading(false); //HENRIK SOMMERFELD example
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

    if (user && !initialRender) {//HENRIK SOMMERFELD example
      console.log("NOT Initial render")
      fetchData().then(message => setFetchedData(message)); //HENRIK SOMMERFELD example
    } else {
      console.log("Initial render")
      setIsLoading(false);
    }

    //return () => { //HENRIK SOMMERFELD example
    //}; //HENRIK SOMMERFELD example
  }, [refreshCounter]); //HENRIK SOMMERFELD example

  return { message: fetchedData, isLoading, hasError}; //HENRIK SOMMERFELD example
}; //HENRIK SOMMERFELD example










export const useSignin2 = (user) => { //HENRIK SOMMERFELD example
  const [number, setNumber] = useState(1);
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