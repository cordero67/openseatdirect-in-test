import React, { useState, useEffect } from "react";
import queryString from "query-string";
import ReactHtmlParser from "react-html-parser";
import { Link, Redirect } from "react-router-dom";
import { Form } from "react-bootstrap";

import { resetPassword, changePassword, authenticate, isAuthenticated } from "./apiUsers";

import classes from "./User.module.css";

const PasswordReset = () => {
  const [values, setValues] = useState({
    token: "",
    email: "",
    password: "",
    error: "",
    loading: false,
    redirectToReferrer: false,
  });

  // destructors the "values" object
  const { token, email, password, error, loading, redirectToReferrer } = values;

  // destructoring of "user" object in "localStorage" "data" variable
  const { user: user } = isAuthenticated();


  // omit this intial call to the server to verify token
  // have it go straight to the panel that asks for the new password
  // send new password, email and token in final and only fetch
  useEffect(() => {
    let tokenNum = (queryString.parse(window.location.search).token);
    let emailAddress = (queryString.parse(window.location.search).email);
    console.log("TokenNum: ", tokenNum);
    console.log("Email address: ", emailAddress);
    setValues({
      ...values,
      token: tokenNum,
      email: emailAddress,
    });
    resetPassword({ token: tokenNum, email: emailAddress })

  }, []);

  const handleChange = (event) => {
    setValues({
      ...values,
      error: false,
      [event.target.name]: event.target.value,
    });
    console.log("values: ", values)
  };

  const submitValues = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    changePassword({ email: email, newPassword: password, token: token })
    /*
    .then((data) => {
      console.log("Inside recover function response")
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        console.log("signIn return object: ", data);
        authenticate(data, () => {
          setValues({ ...values, redirectToReferrer: true });
        });
      }
    });
    */
  };

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showLoading = () =>
    loading && (
      <div className="aler alert-info">
        <h2>Loading...</h2>
      </div>
    );

  const redirectUser = () => {
    console.log("entering redirect user");
    if (redirectToReferrer) {
      console.log("entering if statement within redirect user");
      if (user && user.role === 2) {
        return <Redirect to="/admindevents" />;
      } else if (user && user.role === 1) {
        return <Redirect to="/vendorevents" />;
      } else if (user && user.role === 0) {
        return <Redirect to="/userdashboard" />;
      }
    }
    // need to address this situation
    if (isAuthenticated()) {
      return <Redirect to="/" />;
    }
  };

  const passwordForm = () => (
    <form>
      <div className="form-group">
        <input
          type="email"
          name="password"
          placeholder="Minimum 8 characters: alphanumeric"
          className="form-control"
          onChange={handleChange}
          value={password}
        />
      </div>

      <div>Confirmation email will be sent once password is updated.</div>
      <br></br>
      <button onClick={submitValues} className="btn btn-primary">
        Submit
      </button>
    </form>
  );

  return (
    <div className={classes.MainContainer}>
      <div className={classes.BlankCanvas} style={{ height: "375px" }}>
        <br></br>
        <div className={classes.Header}>Password Reset</div>
        <br></br>
        <div className={classes.Section}>
          <div>Please enter your new password:</div>
          <br></br>
          {showLoading()}
          {showError()}
          {passwordForm()}
          {redirectUser()}
        </div>
        <br></br>
        <div className={classes.Section}>
          Still remember your original password.
          <br></br>Go back to{" "}
          <Link to="/signin" style={{ color: "blue" }}>
            Sign In.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
