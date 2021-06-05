import React, { useState, Fragment } from "react";
import { Redirect, Link } from "react-router-dom";

import { useOurApi } from "./apiUsers";
import { API } from "../../config";

import classes from "./Authentication.module.css";

const SignIn = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const { email, password } = values;

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const url1 = `${API}/auth/signin_email`;
  const method1 = "POST";
  const body1 = null;
  const initialData1 = { status: true, message: "hi first time" };

  const { isLoading, hasError, setUrl, setBody, data, networkError } =
    useOurApi(method1, url1, myHeaders, body1, initialData1);

  const sysmessage = networkError
    ? "NetworkError...please check your connectivity"
    : "SYSTEM ERROR - please try again";

  const getStatus = (user) => {
    if ("accountId" in user && "status" in user.accountId) {
      return user.accountId.status;
    } else {
      return 0;
    }
  };

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
          Please provide the following information:
        </div>
      );
    } else {
      return (
        <div style={{ color: "red", paddingBottom: "20px" }}>{data.error}</div>
      );
    }
  };

  //NEED A BETTER TEST
  //without "!data.message" it places the data object into local storage with every keystroke
  //this then generates an error in navigation component when it is looking for "role"
  if (
    typeof window !== "undefined" &&
    data.status &&
    !hasError &&
    !data.message
  ) {
    localStorage.setItem("user", JSON.stringify(data));
    let tempUser = JSON.parse(localStorage.getItem("user"));
    if (getStatus(tempUser.user) === 7 || getStatus(tempUser.user) === 8) {
      return <Redirect to="/myaccount" />;
    } else if (
      getStatus(tempUser.user) === 4 ||
      getStatus(tempUser.user) === 5 ||
      getStatus(tempUser.user) === 6 ||
      ("vendorIntent" in tempUser.user && tempUser.user.vendorIntent === true)
    ) {
      return <Redirect to="/personal" />;
    } else {
      return <Redirect to="/events" />;
    }
  }

  const signInForm = (
    <Fragment>
      <div style={{ paddingBottom: "20px", width: "340px", height: "85px" }}>
        <label style={{ fontSize: "15px" }}>E-mail Address</label>
        <input
          className={classes.InputBox}
          type="email"
          name="email"
          onChange={handleChange}
          value={email}
        />
      </div>

      <div style={{ paddingBottom: "20px", width: "340px", height: "85px" }}>
        <label style={{ fontSize: "15px" }}>Password</label>
        <input
          className={classes.InputBox}
          type="password"
          name="password"
          onChange={handleChange}
          value={password}
        />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            console.log("clicked button", {
              email: values.email,
              password: values.password,
            });
            setBody({
              email: values.email,
              password: values.password,
            });
          }}
        >
          SIGN IN TO YOUR ACCOUNT
        </button>
      </div>
    </Fragment>
  );

  const alternateInputs = (
    <div className={classes.Alternates}>
      <Link to="/passwordrecovery" style={{ fontWeight: "600", color: "blue" }}>
        Forgot password?
      </Link>
      <Link
        to="/signup"
        style={{ fontWeight: "600", color: "blue", textAlign: "right" }}
      >
        Create account
      </Link>
    </div>
  );

  return (
    <div className={classes.MainContainer}>
      <div className={classes.BlankCanvas} style={{ height: "420px" }}>
        <div className={classes.Header}>Welcome back</div>
        <div>
          {showError()}
          {signInForm}
          {alternateInputs}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
