import React from "react";
import { useSignin } from "./apiUsers";
//import { Spinner } from "../Common/Components/Spinner";
//import { ErrorMessage } from "../Common/Components/ErrorMessage";
//import { JobFeed } from "./JobFeed";

const Jobs2 = () => {
  //const url = `/_api/jobs`;
  let myEmail = "rafaelc@openseatdirect.com";
  let myPassword = "Blackhawks2013";
  let user = ({ email: myEmail, password: myPassword });
  console.log("user: ", user);
  const { message, isLoading, hasError } = useSignin(user);

  if (isLoading) {
      return <div>isLoading</div>;
  }

  if (hasError)
    return (
      <div>
        <div>{message}</div>
      </div>
    )

  return (
    <div>
      <div>{message}</div>
    </div>
  );
}

export default Jobs2