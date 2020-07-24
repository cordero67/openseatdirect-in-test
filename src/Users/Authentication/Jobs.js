import React from "react";
import { useSignin } from "./apiUsers";
//import { Spinner } from "../Common/Components/Spinner";
//import { ErrorMessage } from "../Common/Components/ErrorMessage";
//import { JobFeed } from "./JobFeed";

const Jobs = () => {
  const url = `/_api/jobs`;
  const { data, isLoading, hasError } = useSignin(url, {});

  if (isLoading) {
      return <div>isLoading</div>;
  }

  if (hasError)
    return <div>System Error</div>;

  return (
    <div>
      <div>Success!!!</div>
    </div>
  );
}

export default Jobs