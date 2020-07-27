import React, { useState} from "react";
import { Redirect, Link } from "react-router-dom";

import { useSignin , useOurApi} from "./apiUsers";
import { isAuthenticated } from "../apiUsers";
import Spinner from "../../components/UI/Spinner/SpinnerNew";

import classes from "../User.module.css";

import { API } from "../../config";

const SignIn = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    redirectToDashboard: false,
  });
  const { email, password, redirectToDashboard } = values;

  // destructoring of "user" object in "localStorage" "data" variable
  const { user: user } = isAuthenticated();
  console.log("user: ", user)

//useOurApi = (initialUrl, initialMethod, initialHeaders,initialBody, initialData)

  let  myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const url1 = `${API}/signin`;
  const method1 = "POST";
  const body1  = null;
  const initialData1 ={status: true, message:" hi first time"};
  const initRender = true;
  //export const useOurApi = (method,initialUrl, headers,initialBody, initialData) => {

  const { isLoading, hasError, setUrl, setBody, data} = useOurApi("POST", url1,myHeaders,body1, initialData1);
  console.log("data: ", data)

  if (typeof window !== "undefined" && data.status && !hasError) {
    localStorage.setItem("user", JSON.stringify(data));
  }

  if (data.status) {
    const { user: user } = isAuthenticated();
    console.log("user: ", user);
    console.log("status: ", data.status);
    console.log("token: ", data.token);
    console.log("user: ", data.user);
  }

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };


  const signInForm = (
    <div>
      <div className="form-group">
        <br></br>
        <label styles={{ fontSize: "16px" }}>
          Email Address
        </label>
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
        />
      </div>

      <button onClick={() => {
        console.log("clicked button",{
          email: values.email,
          password: values.password,
        });
        setBody({
          email: values.email,
          password: values.password,
        })
      }}
      className="btn btn-primary">
        Submit
      </button>
    </div>
  );
  
  const alteranteInputs = (
    <div>
      <div className={classes.Section}>
        Forgot your{" "}
        <Link to="/passwordrecovery" style={{ color: "blue" }}>
          password.
        </Link>
      </div>
      <div className={classes.Section}>
        Don't have an account, go to{" "}
        <Link to="/signup" style={{ color: "blue" }}>
          Sign Up.
        </Link>
      </div>
    </div>
  )

  return (
    <div className={classes.MainContainer}>
      <div className={classes.BlankCanvas} style={{height: "450px"}}>
        <br></br>
        <div className={classes.Header}>Welcome back!</div>
        <br></br>
        <div>
          {hasError ?
            <div style={{color: "red"}}>{"SYSTEM ERROR - please try again"}</div> :
            data.status ? <div>Please sign in:</div> : <div style={{color: "red"}}> {data.error}</div>
          }
          {signInForm}
        </div>
        {alteranteInputs}
      </div>
    </div>
  );
}

export default SignIn