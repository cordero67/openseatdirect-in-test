import { API } from "../../config";

import { useEffect, useState, useRef } from "react"; //HENRIK SOMMERFELD example

export const useOurApi2 = (
  initialMethod,
  initialUrl,
  initialHeaders,
  initialBody,
  initialData
) => {
  const [url2, setUrl2] = useState(initialUrl);
  const [isLoading2, setIsLoading2] = useState(true);
  const [hasError2, setHasError2] = useState(false);
  const [fetchedData2, setFetchedData2] = useState(initialData);

  const [method, setMethod] = useState(initialMethod);
  const [headers, setHeaders] = useState(initialHeaders);
  const [body2, setBody2] = useState(initialBody);

  const [networkError2, setNetworkError2] = useState(false);

//  const isFirstRun = useRef(true);

  useEffect(() => {
//    if (isFirstRun.current) {
//      console.log("first run in useOurApi's useEffect!");
//      isFirstRun.current = false;
//      return;
//    }

    let unmounted = false;

    const handleFetchResponse = (response) => {
      console.log(" in handleFetchResponse...");

      if (unmounted) return initialData;

      setHasError2(!response.ok);

      if (typeof response.ok === "undefined") {
        setNetworkError2(true);
        console.log("undefined response = newtwork error!");
      } else {
        setNetworkError2(false);
        console.log("defined response");
      }

      setIsLoading2(false);
      return response.ok && response.json ? response.json() : initialData;
    };

    const fetchData = () => {
      setIsLoading2(true);
      let fetcharg = {
        method: method,
        redirect: "follow",
      };
      if (headers) fetcharg.headers = headers;
      if (body2) fetcharg.body = JSON.stringify(body2);
      console.log("...fetching ", url2, fetcharg);

      return fetch(url2, fetcharg)
        .then(handleFetchResponse)
        .catch(handleFetchResponse);
    };

    if (initialUrl && !unmounted)
      fetchData().then((data) => !unmounted && setFetchedData2(data));

    return () => {
      unmounted = true;
    };
  }, [url2, body2]);

  console.log("url: ", url2);
  console.log("isLoading2: ", isLoading2);
  console.log("hasError2: ", hasError2);
  console.log("fetchedData2: ", fetchedData2);
  console.log("networkError2: ", networkError2);
  return {
    isLoading2,
    hasError2,
    setUrl2,
    setBody2,
    data2: fetchedData2,
    networkError2,
  };
};

