import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";

import { useOurApi } from "./apiUsers";
import { API } from "../../config";

import classes from "./Authentication.module.css";

const PasswordRecovery = () => {
  const [values, setValues] = useState({
    email: "",
  });

  const { email } = values;

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const url1 = `${API}/forgot`;
  const method1 = "POST";
  const body1 = null;
  const initialData1 = { status: true, message: "hi first time" };

  const { isLoading, hasError, setUrl, setBody, data, networkError } =
    useOurApi(method1, url1, myHeaders, body1, initialData1);

  const sysmessage = networkError
    ? "NetworkError...please check your connectivity"
    : "SYSTEM ERROR - please try again";

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const showError = () => {
    if (hasError) {
      return (
        <div style={{ color: "red", paddingBottom: "20px" }}>{sysmessage}</div>
      );
    } else if (data.status) {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          Please enter your email on file:
        </div>
      );
    } else {
      return (
        <div style={{ color: "red", paddingBottom: "20px" }}> {data.error}</div>
      );
    }
  };

  const showSuccess = (
    <div style={{ paddingBottom: "20px", width: "340px" }}>
      <div style={{ lineHeight: "20px", paddingBottom: "20px" }}>
        If there is an account associated with
      </div>
      <div style={{ color: "blue", paddingBottom: "20px" }}>{values.email}</div>
      <div style={{ lineHeight: "20px", paddingBottom: "20px" }}>
        you will receive a message with a password reset link.
      </div>
      <div>
        Back to{" "}
        <Link to="/signin" style={{ fontWeight: "600", color: "blue" }}>
          Signin
        </Link>
      </div>
    </div>
  );

  const recoverForm = (
    <Fragment>
      <div style={{ paddingBottom: "20px", width: "340px", height: "85px" }}>
        <label styles={{ fontSize: "15px" }}>E-mail Address</label>
        <input
          className={classes.InputBox}
          type="email"
          name="email"
          onChange={handleChange}
          value={email}
        />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            console.log("clicked button", {
              email: values.email,
            });
            setBody({
              email: values.email,
            });
          }}
        >
          SUBMIT YOUR REQUEST
        </button>
      </div>
    </Fragment>
  );

  const alternateInputs = (
    <div className={classes.Alternates}>
      <div>
        Back to{" "}
        <Link to="/signin" style={{ fontWeight: "600", color: "blue" }}>
          Sign In
        </Link>
      </div>
    </div>
  );

  const mainDisplay = () => {
    //NEED A BETTER TEST
    //without "data.message !== "hi first time it places the data object into local storage with every keystroke
    //this then generates an error in navigation component when it is looking for "role"
    if (data.status && data.message !== "hi first time") {
      return <Fragment>{showSuccess}</Fragment>;
    } else {
      return (
        <Fragment>
          {showError()}
          {recoverForm}
          {alternateInputs}
        </Fragment>
      );
    }
  };

  return (
    <div className={classes.MainContainer}>
      <div className={classes.BlankCanvas} style={{ height: "335px" }}>
        <div className={classes.Header}>Password Reset Request</div>
        <div className={classes.Section}>{mainDisplay()}</div>
      </div>
    </div>
  );
};

export default PasswordRecovery;
