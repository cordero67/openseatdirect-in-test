import { API } from "../../config";

import { useEffect, useState, useRef } from "react"; //HENRIK SOMMERFELD example

// USED BY CURRENT CODE APRIL 17, 2021
export const useOurApi = (
  initialMethod,
  initialUrl,
  initialHeaders,
  initialBody,
  initialData
) => {
  const [url, setUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [fetchedData, setFetchedData] = useState(initialData);

  const [method, setMethod] = useState(initialMethod);
  const [headers, setHeaders] = useState(initialHeaders);
  const [body, setBody] = useState(initialBody);

  const [networkError, setNetworkError] = useState(false);

  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      console.log("first run in useOurApi's useEffect!");
      isFirstRun.current = false;
      return;
    }

    let unmounted = false;

    const handleFetchResponse = (response) => {
      console.log(" in handleFetchResponse...");

      if (unmounted) return initialData;

      setHasError(!response.ok);

      if (typeof response.ok === "undefined") {
        setNetworkError(true);
        console.log("undefined response = newtwork error!");
      } else {
        setNetworkError(false);
        console.log("defined response");
      }

      setIsLoading(false);
      return response.ok && response.json ? response.json() : initialData;
    };

    const fetchData = () => {
      setIsLoading(true);
      let fetcharg = {
        method: method,
        redirect: "follow",
      };
      if (headers) fetcharg.headers = headers;
      if (body) fetcharg.body = JSON.stringify(body);
      console.log("...fetching ", url, fetcharg);

      return fetch(url, fetcharg)
        .then(handleFetchResponse)
        .catch(handleFetchResponse);
    };

    if (initialUrl && !unmounted)
      fetchData().then((data) => !unmounted && setFetchedData(data));

    return () => {
      unmounted = true;
    };
  }, [url, body]);
  console.log("isLoading: ", isLoading);
  console.log("hasError: ", hasError);
  console.log("fetchedData: ", fetchedData);
  console.log("networkError: ", networkError);
  return {
    isLoading,
    hasError,
    setUrl,
    setBody,
    data: fetchedData,
    networkError,
  };
};

const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.status);
  }
  return response;
};

export const paypalSubscriptionDetails = (subscriptionData, userid, token) => {
  console.log("inside paypalSubscriptionDetails");
  const authstring = `Bearer ${token}`;

  return (
    fetch(`${API}/paypal/subscription/${userid}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authstring,
      },
      body: JSON.stringify(subscriptionData),
    })
      .then(handleErrors)
      .then((response) => {
        console.log("success in sending paypal object to server");
        return response.json();
      })
      // NEED TO RETURN ERROR STATEMENT THAT BACKEND IS DOWN
      .catch((err) => {
        console.log("fetch API/paypal/expressPayment): ERROR THROWN", err);
        throw Error(err);
      })
  );
};
