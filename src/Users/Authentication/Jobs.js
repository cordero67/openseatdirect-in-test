import React, { useState } from "react";
import { useSignin } from "./apiUsers";
//import { Spinner } from "../Common/Components/Spinner";
//import { ErrorMessage } from "../Common/Components/ErrorMessage";
//import { JobFeed } from "./JobFeed";

const Jobs = () => {
  console.log("rendering")
  //const url = `/_api/jobs`;

  let myEmail = "rafaelc@openseatdirect.com";
  let myPassword = "Blackhawks2012";

  const [initialRender, setInitialRender] = useState(true)
  console.log("initialRender: ", initialRender)

  //const [counter, setCounter] = useState(0)
  //console.log("counter: ", counter)
  //let counter = Math.random();

  let user = ({ email: myEmail, password: myPassword });
  console.log("user: ", user);

  //useSignin(user, initialRender, counter);

  console.log("before useSignin");
  const { message, isLoading, hasError, setRefreshCounter } = useSignin(user, initialRender);
  console.log("after useSignin");

  const submitData = () => {
    console.log("clicked button")
  }

  if (isLoading) {
    return (
      <div>
        <button onClick={() => {
          console.log("clicked button");
          setInitialRender(false);
          setRefreshCounter(Math.random())
        }}>
          Submit
        </button>
        <div>isLoading</div>
      </div>
    )
  }

  if (hasError)
    return (
      <div>
        <button onClick={() => {
          console.log("clicked button");
          setInitialRender(false);
          setRefreshCounter(Math.random())
        }}>
        Submit
        </button>
        <input>Email</input>
        <input>Password</input>
        <div>{message}</div>
      </div>
    )

  return (
    <div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <button onClick={() => {
        console.log("clicked button");
        setInitialRender(false);
        setRefreshCounter(Math.random());
      }}>
        Submit another
      </button>
      <div>{message}</div>
    </div>
  );
}

export default Jobs