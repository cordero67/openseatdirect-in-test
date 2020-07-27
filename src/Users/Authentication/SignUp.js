import React, { useState } from "react";
//import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";

//import { signin, authenticate } from "../../auth";
import { signup } from "./apiUsers";
import Aux from "../hoc/Auxiliary/Auxiliary";

import classes from "./authenticate.css";

var confirmEmail = "";

const SignUp = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "", // potentially do not need
    message: "", // potentially do not need
    success: false // potentially do not need
  });

  // destructors the "values" object
  const { name, email, password, error, message, success } = values;

  let  myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const url1 = `${API}/signin`;
  const method1 = "POST";
  const body1  = null;
  const initialData1 ={status: true, message:"hi first time"};

  const { isLoading, hasError, setUrl, setBody, data} = useOurApi("POST", url1, myHeaders, body1, initialData1);

  const submitValues = event => {
    event.preventDefault();
    // clears any previous error message
    setValues({ ...values, error: false });
    signup({ name: name, email: email, password: password })
      .then(data => {
        console.log("data: ", data);
        if (data.error) {
          // sets error if error returned
          console.log("data.error: ", data.error)
          setValues({ ...values, error: data.error, message: "invalid input, please fix errors", success: false });
        } else {
          // clears values if no error is returned
          console.log("No error")
          confirmEmail = email;
          setValues({
            ...values,
            name: "",
            email: "",
            password: "",
            error: "",
            message: "",
            success: true
          });
        }
      }
    )
    .catch(err => {
      console.log("error occurred: ", err);
      setValues({ ...values, error: err, message: "system error please try again", success: false });
    });
  };



  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {message}
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-info"
      style={{ display: success ? "" : "none" }}
    >
      To complete the sign-up process, please click the link in the e-mail sent to {confirmEmail}.
        <Link to="/signin">Signin</Link>
    </div>
  );

  const handleChange = (event) => {
    setValues({...values, error: false, [event.target.name]: event.target.value})
  }

  const signUpForm = () => (
    <Aux>
      <form>
        <div className="form-group">
          <label className="text-muted">Full Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            onChange={handleChange}
            value={name}
          />
        </div>

        <div className="form-group">
          <label className="text-muted">E-mail Address</label>
          <input
            type="email"
            name="email"
            className="form-control"
            onChange={handleChange}
            value={email}
          />
        </div>

        <div className="form-group">
          <label className="text-muted">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            onChange={handleChange}
            value={password}
            placeholder="Must contain a number and special character"
          />
        </div>

        <button onClick={submitValues} className="btn btn-primary">
          Submit
        </button>
        <br></br>
        <br></br>
      </form>
      <div className={classes.Section}>
        Already have an account, go to{" "}
        <Link to="/signin" style={{color: "blue"}}>
          Sign In.
        </Link>
      </div>
    </Aux>
  );

  const mainDisplay = () => {
    if (values.success) {
      return (
        showSuccess()
      )
    } else {
      return (
        <Aux>
          {showError()}
          {signUpForm()}
        </Aux>
      )
    }
  }

  return (
    <div className={classes.MainContainer}>
      <div className={classes.BlankCanvas} style={{height: "490px"}}>
        <br></br>
        <div className={classes.Header}>
          Welcome Aboard
        </div>
        <br></br>
        <div className={classes.Section}>
          <div>Please provide the following information:</div>
          <br></br>
          {mainDisplay()}
        </div>
      </div>
    </div>
  );
};

export default SignUp;