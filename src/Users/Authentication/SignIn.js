import React, { useState} from "react";
import { Redirect, Link } from "react-router-dom";

import { useOurApi } from "./apiUsers";
import { API } from "../../config";
import Spinner from "../../components/UI/Spinner/SpinnerNew";

import Aux from "../../hoc/Auxiliary/Auxiliary";

import classes from "../User.module.css";

const SignIn = () => {
  const [values, setValues] = useState({
    email: "",
    password: ""
  });
  const { email, password } = values;

  let  myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const url1 = `${API}/signin`;
  const method1 = "POST";
  const body1  = null;
  const initialData1 ={status: true, message:"hi first time"};

  const { isLoading, hasError, setUrl, setBody, data, networkError} = useOurApi(method1, url1,myHeaders,body1, initialData1);

  const sysmessage = networkError ? "NetworkError...please check your connectivity": "SYSTEM ERROR - please try again";

  //NEED A BETTER TEST
  //without "!data.message" it places the data object into local storage with every keystroke
  //this then generates an error in navigation component when it is looking for "role"
  if (typeof window !== "undefined" && data.status && !hasError && !data.message) {
    // places "data" return object into local storage
    localStorage.setItem("user", JSON.stringify(data));
    let tempData = JSON.parse(localStorage.getItem("user"));
    console.log("tempData: ", tempData)
    // determines dashboard based on user's role
    if (tempData.user.accountId && tempData.user.accountId.status === 7) {
      return <Redirect to="/vendordashboard" />;
    } else {
      return <Redirect to="/buyerdashboard" />;
    }
  }

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
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
  
  const alternateInputs = (
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
        <div className={classes.Header}>
          Welcome back!!!
        </div>
        <br></br>
        <div>
          {hasError ?
            <div style={{color: "red"}}> {sysmessage}</div> :
            data.status ? <div>Please sign in:</div> : <div style={{color: "red"}}> {data.error}</div>
          }
          {signInForm}
        </div>
        <br></br>
        {alternateInputs}
      </div>
    </div>
  );
}

export default SignIn