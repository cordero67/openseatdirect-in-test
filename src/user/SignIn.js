import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import { signin, authenticate, isAuthenticated } from "./apiUser";

import styles from "./User.module.css";

const SignIn = () => {
  const [values, setValues] = useState({
    // HARDCODED: REMOVE AFTER TESTING IS COMPLETE
    email: "rafael.cordero@ymail.com",
    password: "abcd1234",

    // HARDCODED: REMOVE AFTER TESTING IS COMPLETE

    // HARDCODED: REMOVE AFTER TESTING IS COMPLETE
    error: "",
    loading: false,
    redirectToReferrer: false
  });

  // destructors the "values" object
  const { email, password, loading, error, redirectToReferrer } = values;

  // destructoring of "user" object in "localStorage" "data" variable
  const { user: user } = isAuthenticated();

  const handleChange = name => event => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signin({ email: email, password: password }).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        console.log("signIn return object: ", data);
        authenticate(data, () => {
          // all other "values" properties are not changed nor cleared
          setValues({
            ...values,
            redirectToReferrer: true
          });
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
    if (redirectToReferrer) {
      if (user && user.role === 2) {
        return <Redirect to="/admindashboard" />;
      } else if (user && user.role === 1) {
        return <Redirect to="/userdashboard" />;
      } else {
        {
          return <Redirect to="/mydashboard" />;
        }
      }
    }

    if (isAuthenticated()) {
        return <Redirect to="/" />
    }
  };

  const signInForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">E-mail Address</label>
        <input
          type="email"
          className="form-control"
          onChange={handleChange("email")}
          value={email}
          placeholder="E-mail Address"
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          type="password"
          className="form-control"
          onChange={handleChange("password")}
          value={password}
          placeholder="Password"
        />
      </div>

      <button onClick={clickSubmit} className="btn btn-primary">
        Submit
      </button>
    </form>
  );

  return (
    <div className={styles.MainContainer}>
      <div className={styles.BlankCanvas}>
        <br></br>
        <div>Sign In Page</div>
        {showLoading()}
        {showError()}
        {signInForm()}
        {redirectUser()}
      </div>
    </div>
  );
};

export default SignIn;
