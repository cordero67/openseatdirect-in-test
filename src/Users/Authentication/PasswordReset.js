import React, { useState, useEffect } from "react";
import queryString from "query-string";
import { Link, Redirect } from "react-router-dom";

import { useOurApi } from "./apiUsers";
import { API } from "../../config";

import Aux from "../../hoc/Auxiliary/Auxiliary";

import classes from "../User.module.css";

const PasswordReset = () => {
  const [values, setValues] = useState({
    token: "",
    email: "",
    newpassword: ""
  });

  // destructors the "values" object
  const { token, email, newpassword } = values;

  useEffect(() => {
    let tokenNum = (queryString.parse(window.location.search).token);
    let emailAddress = (queryString.parse(window.location.search).email);
    console.log("TokenNum: ", tokenNum);
    console.log("Email address: ", emailAddress);
    setValues({
      ...values,
      token: tokenNum,
      email: emailAddress,
      newpassword: ""
    });

  }, []);

  let  myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const url1 = `${API}/updatePasswordViaEmail`;
  const method1 = "POST";
  const body1  = null;
  const initialData1 ={status: true, message:"hi first time"};

  const { isLoading, hasError, setUrl, setBody, data, networkError} = useOurApi(method1, url1,myHeaders,body1, initialData1);

  const sysmessage = networkError ? "NetworkError...please check your connectivity" : "SYSTEM ERROR - please try again";

  const handleChange = (event) => {
    console.log("event.target.name: ", event.target.name)
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const showError = () => {
    if (hasError) {
      return (
        <div style={{color: "red"}}> {sysmessage}</div>
      )
    } else if (data.status) {
      return (
        <div>Please enter your new password:</div>
      )
    } else {
      return (
        <div style={{color: "red"}}> {data.error}</div>
      )
    }
  };

  const showSuccess = (
    <div
      className="alert alert-info"
    >
      Your password has been reset. Please go to
        <Link to="/signin">Signin</Link>.
    </div>
  );

  const passwordForm = (
    <Aux>
      <div className="form-group">
        <input
          type="text"
          name="newpassword"
          placeholder="Minimum 8 characters: alphanumeric"
          className="form-control"
          onChange={handleChange}
          value={newpassword}
        />
      </div>

      <button onClick={() => {
        console.log("clicked button",{
          token: values.token,
          email: values.email,
          newpassword: values.newpassword,
        });
        setBody({
          token: values.token,
          email: values.email,
          newpassword: values.newpassword,
        })
      }}
      className="btn btn-primary">
        Submit
      </button>
      <br></br>
    </Aux>
  );
  
  const alternateInputs = (
    <div>
      <div className={classes.Section}>
        Still remember your original password.
        <br></br>Go back to{" "}
        <Link to="/signin" style={{ color: "blue" }}>
          Sign In.
        </Link>
      </div>
    </div>
  );

  const mainDisplay = () => {
    //NEED A BETTER TEST
    //without "data.message !== "hi first time it places the data object into local storage with every keystroke
    //this then generates an error in navigation component when it is looking for "role"
    if (data.status && data.message !== "hi first time") {
      return (
        <Aux>
          {showSuccess}
        </Aux>
      )
    } else {
      return (
        <Aux>
          {showError()}
          {passwordForm}
          {alternateInputs}
        </Aux>
      )
    }
  }

  return (
    <div className={classes.MainContainer}>
      <div className={classes.BlankCanvas} style={{height: "490px"}}>
        <br></br>
        <div className={classes.Header}>
          Come Aboard!!!
        </div>
        <br></br>
        <div className={classes.Section}>
          <br></br>
          {mainDisplay()}
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;