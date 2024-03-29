import { useEffect, useState } from "react"; //HENRIK SOMMERFELD example
                                            //https://www.henriksommerfeld.se/error-handling-with-fetch/
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

  //  const isFirstRun = useRef(true);

  useEffect(() => {
    //    if (isFirstRun.current) {
    //      console.log("first run in useOurApi's useEffect!");
    //      isFirstRun.current = false;
    //      return;
    //    }

    let unmounted = false;

    const handleFetchResponse = (response) => {

      if (unmounted) return initialData;

      setHasError(!response.ok);

      if (typeof response.ok === "undefined") {
        setNetworkError(true);
      } else {
        setNetworkError(false);
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

  return {
    isLoading,
    hasError,
    setUrl,
    setBody,
    data: fetchedData,
    networkError,
  };
};
