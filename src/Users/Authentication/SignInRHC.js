import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";

import { useSignin } from "./apiUsers";
import { isAuthenticated } from "../apiUsers";
import Spinner from "../../components/UI/Spinner/SpinnerNew";

import classes from "../User.module.css";

const SignIn = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    //redirectToDashboard: false,
  });
  const { email, password } = values;
  //const { email, password, redirectToDashboard } = values;

  const [userData, setUserData] = useState()
  //const [initialRender, setInitialRender] = useState(true)

  // destructoring of "user" object in "localStorage" "data" variable
  const { user: user } = isAuthenticated();

  const { message, isLoading, hasError, setRefreshCounter} = useSignin(userData);
  //const { message, isLoading, hasError, redirect, setRefreshCounter} = useSigninOld(userData);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const Header = (
    <div className={classes.SignInHeader}>Welcome back!</div>
  ) 

  const signInForm = () => {
    console.log("i'm here")
    if (isLoading) {
      return (
        <div style={{ height: "240px", paddingTop: "75px"}}>
          <Spinner/>
        </div>
      )
    } else {
      return (
        <div style={{ height: "240px"}}>
          {hasError ?
            <div style={{color: "red"}}>{message}</div> :
            <div>Please sign in:</div>
          }
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
            console.log("clicked button");
            setUserData({
              email: values.email,
              password: values.password,
            })
            //setInitialRender(false);
            setRefreshCounter(Math.random());
          }}
          className="btn btn-primary">
            Submit
          </button>
        </div>
      )
    }
  }
  
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
        {Header}
        {signInForm()}
        {alteranteInputs}
      </div>
    </div>
  );
}

export default SignIn

/*
  const redirectUser = () => {
    console.log("user: ", user)
    console.log("message: ", message)
    console.log("data: ", data)

    if (redirect) {
      console.log("entering if statement within redirect data");
      console.log("data: ", data)
      console.log("data.user: ", data.user)
      //console.log("data.user.role: ", data.user.role)
          /*
      if (user && user.role === 1) {
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
  
    */