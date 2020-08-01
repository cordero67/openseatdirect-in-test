import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useOurApi } from "./apiUsers";
import { API } from "../../config";

import Aux from "../../hoc/Auxiliary/Auxiliary";

import classes from "../User.module.css";

const PasswordRecovery = () => {
  const [values, setValues] = useState({
    email: ""
  });

  const { email } = values;

  let  myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const url1 = `${API}/forgot`;
  //CAN'T THIS BE USED IN LINE 31
  const method1 = "POST";
  const body1  = null;
  const initialData1 ={status: true, message:"hi first time"};

  const { isLoading, hasError, setUrl, setBody, data, networkError} = useOurApi(method1, url1,myHeaders,body1, initialData1);

  const sysmessage = networkError ? "NetworkError...please check your connectivity" : "SYSTEM ERROR - please try again";

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const showError = () => {
    if (hasError) {
      return (
        <div style={{color: "red"}}> {sysmessage}</div>
      )
    } else if (data.status) {
      return (
        <div>Please enter your email on file:</div>
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
      To complete the sign-up process, please click the link in the e-mail sent to {values.confirmEmail}.
        <Link to="/signin">Signin</Link>
    </div>
  );

  const recoverForm = (
    <Aux>
      <div className="form-group">
        <br></br>
        <label styles={{ fontSize: "16px" }}>
          E-mail Address
        </label>
        <input
          type="email"
          name="email"
          className="form-control"
          onChange={handleChange}
          value={email}
        />
      </div>

      <div>A temporary password will be sent to your mailbox.</div>
      <br></br>
      <button onClick={() => {
        console.log("clicked button",{
          email: values.email
        });
        setBody({
          email: values.email
        })
      }}
      className="btn btn-primary">
        Submit New
      </button>
    </Aux>
  );
  
  const alternateInputs = (
    <div>
        <div className={classes.Section}>
            Back to{" "}
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
        <div>
          <div>
            {showError()}
            {recoverForm}
          </div>
          <br></br>
          {alternateInputs}
        </div>
      )
    }
  }

  return (
    <div className={classes.MainContainer}>
      <div className={classes.BlankCanvas} style={{height: "490px"}}>
        <br></br>
        <div className={classes.Header}>
          Password Reset Request
        </div>
        <br></br>
        <div className={classes.Section}>
          {mainDisplay()}
        </div>
      </div>
    </div>
  );
};

export default PasswordRecovery;