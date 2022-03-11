import { useEffect, useState} from "react"; //HENRIK SOMMERFELD example

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

  console.log("url: ", url);
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
