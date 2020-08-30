import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useOurApi } from "./apiUsers";
import { API } from "../../config";

import Aux from "../../hoc/Auxiliary/Auxiliary";

import classes from "../User.module.css";

const SignUp = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: ""
  });

  const { name, email, password } = values;

  let  myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const url1 = `${API}/signup`;
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
  }

  const showError = () => {
    if (hasError) {
      return (
        <div style={{color: "red"}}> {sysmessage}</div>
      )
    } else if (data.status) {
      return (
        <div>Please provide the following information:</div>
      )
    } else {
      return (
        <div style={{color: "red"}}> {data.error}</div>
      )
    }
  };

  const showSuccess = (
    <div>
      <div>To complete the sign-up process, please click the link in the e-mail sent to your inbox:</div>
      <br></br>
      <div>{values.email}.</div>
      <br></br>
      <div>Back to <Link to="/signin" style={{color: "blue"}}>Signin</Link></div>
    </div>
  );

  const signUpForm = (
    <Aux>
      <div className="form-group">
        <br></br>
        <label styles={{ fontSize: "16px" }}>
          Full Name
        </label>
        <input
          type="text"
          name="name"
          className="form-control"
          onChange={handleChange}
          value={name}
        />
      </div>

      <div className="form-group">
        <label>E-mail Address</label>
        <input
          type="email"
          name="email"
          className="form-control"
          onChange={handleChange}
          value={email}
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          className="form-control"
          onChange={handleChange}
          value={password}
          placeholder="Must contain a number and special character"
        />
      </div>

      <button onClick={() => {
        console.log("clicked button",{
          name: values.name,
          email: values.email,
          password: values.password,
        });
        setBody({
          name: values.name,
          email: values.email,
          password: values.password,
        })
      }}
      className="btn btn-primary">
        Submit
      </button>
    </Aux>
  );
  
  const alternateInputs = (
    <div>
      <div className={classes.Section}>
        Already have an account, go to{" "}
        <Link to="/signin" style={{color: "blue"}}>
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
            {signUpForm}
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
          Come Aboard!!!
        </div>
        <br></br>
        <div className={classes.Section}>
          {mainDisplay()}
        </div>
      </div>
    </div>
  );
};

export default SignUp;