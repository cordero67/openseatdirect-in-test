import queryString from "query-string";

export const getStatus = () => {
  //global get status function

  let status_string = queryString.parse(window?.location?.search)?.userstatus;
  let status = Number.parseInt(status_string); // returns 0 if Nan or empty

  if (!isNaN(status)) return status;

  status = JSON.parse(localStorage.getItem("user"))?.user?.accountId?.status;

  if (isNaN(status)) {
    return 0;
  } else {
    return status;
  }
};
