import React, { useState } from "react";
//import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";

//import { signin, authenticate } from "../../auth";
import { signup } from "./apiUser";

import styles from "./User.module.css";

var confirmEmail = "";

const SignUp = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false
  });

  // destructors the "values" object
  const { name, email, password, success, error } = values;

  /* alternate coding
    value={contactInformation.firstName}
    onChange={event =>
    setContactInformation({
        ...contactInformation,
        firstName: event.target.value
    })
*/

  // higher order function: returns a function
  const handleChange = name => event => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const clickSubmit = event => {
    event.preventDefault();
    // clears any previous error message
    setValues({ ...values, error: false });
    signup({ name: name, email: email, password: password }).then(data => {
      if (data.error) {
        // set error if error returned
        setValues({ ...values, error: data.error, success: false });
      } else {
        // clears values if no error is returned
        confirmEmail = email;
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          error: "",
          success: true
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

  const showSuccess = () => (
    <div
      className="alert alert-info"
      style={{ display: success ? "" : "none" }}
    >
      To complete the sign-up process, please click the link in the e-mail sent to {confirmEmail}. <Link to="/signin">Signin</Link>
    </div>
  );

  const signUpForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Full Name</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange("name")}
          value={name}
          placeholder="Full Name"
        />
      </div>

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
      <br></br>
      <br></br>
      <div className={styles.Header}>
        Already have an account, go to <span style={{color: "blue"}}>Sign-In.</span>
      </div>
    </form>
  );

  return (
    <div className={styles.MainContainer}>
      <div className={styles.BlankCanvas}>
        <br></br>
        <div className={styles.Header}>Sign Up</div>
        <br></br>
        {showSuccess()}
        {showError()}
        <div>{signUpForm()}</div>
      </div>
    </div>
  );
};

export default SignUp;
