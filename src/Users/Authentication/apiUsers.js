import { API } from "../../config";

import { useEffect, useState, useRef } from "react"; //HENRIK SOMMERFELD example

export const useOurApi = (initialMethod,initialUrl,initialHeaders,initialBody, initialData) => {
  const [url, setUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [fetchedData, setFetchedData] = useState(initialData);

  const [method, setMethod] = useState(initialMethod);
  const [headers, setHeaders] = useState(initialHeaders);
  const [body, setBody] = useState(initialBody);

  const isFirstRun = useRef(true);

  useEffect(() => {

    if (isFirstRun.current) {
      console.log ("first run in useOurApi's useEffect!")
      isFirstRun.current = false;
      return;
    }

    let unmounted = false;

    const handleFetchResponse = response => {
      if (unmounted) return initialData;

      setHasError(!response.ok);
      setIsLoading(false);
      return response.ok && response.json ? response.json() : initialData;
    };

    const fetchData = () => {
      setIsLoading(true);
      let fetcharg = {
            method: method,
            redirect: "follow"
      };
      if (headers) fetcharg.headers= headers;
      if (body) fetcharg.body = JSON.stringify (body);
      console.log("...fetching ", url, fetcharg);

      return fetch(url, fetcharg )
        .then(handleFetchResponse)
        .catch(handleFetchResponse);
    };

    if (initialUrl && !unmounted)
      fetchData().then(data => !unmounted && setFetchedData(data));

    return () => {
      unmounted = true;
    };
  }, [url, method,body]);

return { isLoading, hasError, setUrl, setBody, data: fetchedData };
};





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