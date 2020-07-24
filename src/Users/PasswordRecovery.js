import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { Form } from "react-bootstrap";

import { recoverPassword, authenticate, isAuthenticated } from "./apiUsers";

import classes from "./User.module.css";

const PasswordRecovery = () => {
  const [values, setValues] = useState({
    email: "",
    name: "",
    error: "",
    loading: false,
    redirectToReferrer: false,
  });

  // destructors the "values" object
  const { email, error, loading, redirectToReferrer } = values;

  // destructoring of "user" object in "localStorage" "data" variable
  const { user: user } = isAuthenticated();

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
    recoverPassword({ email: email })
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

  const signInForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted" styles={{ fontSize: "16px" }}>
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
      <button onClick={submitValues} className="btn btn-primary">
        Submit
      </button>
    </form>
  );

  return (
    <div className={classes.MainContainer}>
      <div className={classes.BlankCanvas} style={{ height: "375px" }}>
        <br></br>
        <div className={classes.Header}>Password Reset Request</div>
        <br></br>
        <div className={classes.Section}>
          <div>Please enter your email on file:</div>
          <br></br>
          {showError()}
          {signInForm()}
        </div>
        <br></br>
        <div className={classes.Section}>
          Back to{" "}
          <Link to="/signin" style={{ color: "blue" }}>
            Sign In.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecovery;


//{showLoading()}
//{redirectUser()}
