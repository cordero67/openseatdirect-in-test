import React, { useState, useEffect, Fragment } from "react";
import queryString from "query-string";
import { Link } from "react-router-dom";

import { useOurApi } from "./apiUsers";
import { API } from "../../config";

import classes from "./Authentication.module.css";

const PasswordReset = () => {
  const [values, setValues] = useState({
    token: "",
    email: "",
    newpassword: "",
  });

  const { token, email, newpassword } = values;

  useEffect(() => {
    let tokenNum = queryString.parse(window.location.search).token;
    let emailAddress = queryString.parse(window.location.search).email;
    setValues({
      ...values,
      token: tokenNum,
      email: emailAddress,
      newpassword: "",
    });
  }, []);

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const url1 = `${API}/updatePasswordViaEmail`;
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
        <div style={{ color: "red", paddingBottom: "20px" }}> {sysmessage}</div>
      );
    } else if (data.status) {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          Please enter your new password:
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
        Your password has been reset.
      </div>
      <div>
        Back to{" "}
        <Link to="/signin" style={{ fontWeight: "600", color: "blue" }}>
          Signin
        </Link>
      </div>
    </div>
  );

  const passwordForm = (
    <Fragment>
      <div style={{ paddingBottom: "20px", width: "340px", height: "60px" }}>
        <input
          className={classes.InputBox}
          type="text"
          name="newpassword"
          placeholder="Minimum 8 characters: alphanumeric"
          onChange={handleChange}
          value={newpassword}
        />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            console.log("clicked button", {
              token: values.token,
              email: values.email,
              newpassword: values.newpassword,
            });
            setBody({
              token: values.token,
              email: values.email,
              newpassword: values.newpassword,
            });
          }}
        >
          SUBMIT YOUR NEW PASSWORD
        </button>
      </div>
    </Fragment>
  );

  const alternateInputs = (
    <Fragment>
      <div className={classes.Alternates}>
        Still remember your original password.
      </div>
      <div className={classes.Section}>
        Go back to{" "}
        <Link to="/signin" style={{ fontWeight: "600", color: "blue" }}>
          Sign In.
        </Link>
      </div>
    </Fragment>
  );

  const mainDisplay = () => {
    //NEED A BETTER TEST
    //without "data.message !== "hi first time it places the data object into local storage with every keystroke
    //this then generates an error in navigation component when it is looking for "role"
    if (data.status && data.message !== "hi first time") {
      return <Fragment>{showSuccess}</Fragment>;
    } else {
      return (
        <div>
          <div>
            {showError()}
            {passwordForm}
          </div>
          {alternateInputs}
        </div>
      );
    }
  };

  return (
    <div className={classes.MainContainer}>
      <div className={classes.BlankCanvas} style={{ height: "330px" }}>
        <div className={classes.Header}>Reset Password</div>
        <div className={classes.Section}>{mainDisplay()}</div>
      </div>
    </div>
  );
};

export default PasswordReset;
