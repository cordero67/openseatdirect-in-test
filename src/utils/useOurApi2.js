import { useEffect, useState } from "react"; //HENRIK SOMMERFELD example
                                            //https://www.henriksommerfeld.se/error-handling-with-fetch/
export const useOurApi2 = (
  initialMethod2,
  initialUrl2,
  initialHeaders2,
  initialBody2,
  initialData2
) => {
  const [url2, setUrl2] = useState(initialUrl2);
  const [isLoading2, setIsLoading2] = useState(true);
  const [hasError2, setHasError2] = useState(false);
  const [fetchedData2, setFetchedData2] = useState(initialData2);

  const [method2, setMethod2] = useState(initialMethod2);
  const [headers2, setHeaders2] = useState(initialHeaders2);
  const [body2, setBody2] = useState(initialBody2);

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

      if (unmounted) return initialData2;

      setHasError2(!response.ok);

      if (typeof response.ok === "undefined") {
        setNetworkError2(true);
      } else {
        setNetworkError2(false);
      }

      setIsLoading2(false);
      return response.ok && response.json ? response.json() : initialData2;
    };

    const fetchData = () => {
      setIsLoading2(true);
      let fetcharg = {
        method: method2,
        redirect: "follow",
      };
      if (headers2) fetcharg.headers = headers2;
      if (body2) fetcharg.body = JSON.stringify(body2);
      console.log("...fetching ", url2, fetcharg);

      return fetch(url2, fetcharg)
        .then(handleFetchResponse)
        .catch(handleFetchResponse);
    };

    if (initialUrl2 && !unmounted)
      fetchData().then((data) => !unmounted && setFetchedData2(data));

    return () => {
      unmounted = true;
    };
  }, [url2, body2]);

  return {
    isLoading2,
    hasError2,
    setUrl2,
    setBody2,
    data2: fetchedData2,
    networkError2,
  };
};
