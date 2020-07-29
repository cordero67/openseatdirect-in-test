import React, { useState, useEffect } from "react";
import queryString from "query-string";
import { Link, Redirect } from "react-router-dom";

import { useOurApi } from "./apiUsers";
import { API } from "../../config";

import Aux from "../../hoc/Auxiliary/Auxiliary";

import classes from "../User.module.css";

const PasswordReset = () => {
  const [values, setValues] = useState({
    token: "",
    email: "",
    newpassword: ""
  });

  // destructors the "values" object
  const { token, email, newpassword } = values;

  useEffect(() => {
    let tokenNum = (queryString.parse(window.location.search).token);
    let emailAddress = (queryString.parse(window.location.search).email);
    console.log("TokenNum: ", tokenNum);
    console.log("Email address: ", emailAddress);
    setValues({
      ...values,
      token: tokenNum,
      email: emailAddress,
      newpassword: newpassword
    });
    //resetPassword({ token: tokenNum, email: emailAddress })

  }, []);

  let  myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const url1 = `${API}/signin`;
  const method1 = "POST";
  const body1  = null;
  const initialData1 ={status: true, message:"hi first time"};

  const { isLoading, hasError, setUrl, setBody, data, networkError} = useOurApi(method1, url1,myHeaders,body1, initialData1);

  const sysmessage = networkError ? "NetworkError...please check your connectivity" : "SYSTEM ERROR - please try again";

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const passwordForm = (
    <Aux>
      <div className="form-group">
        <input
          type="email"
          name="newpassword"
          placeholder="Minimum 8 characters: alphanumeric"
          className="form-control"
          onChange={handleChange}
          value={newpassword}
        />
      </div>

      <button onClick={() => {
        console.log("clicked button",{
          name: values.name,
          email: values.email,
          newpassword: values.newpassword,
        });
        setBody({
          token: values.token,
          email: values.email,
          newpassword: values.newpassword,
        })
      }}
      className="btn btn-primary">
        Submit
      </button>
      <br></br>
    </Aux>
  );
  
  const alteranteInputs = (
    <div>
      <div className={classes.Section}>
        Still remember your original password.
        <br></br>Go back to{" "}
        <Link to="/signin" style={{ color: "blue" }}>
          Sign In.
        </Link>
      </div>
    </div>
  );

  const showError = () => {
    if (hasError) {
      return (
        <div style={{color: "red"}}> {sysmessage}</div>
      )
    } else if (data.status) {
      return (
        <div>Please enter your new password:</div>
      )
    } else {
      return (
        <div style={{color: "red"}}> {data.error}</div>
      )
    }
  };

  const showSuccess = (
    <div
      className="alert alert-info"
    >
      Confirmation email will be sent once password is updated.
        <Link to="/signin">Signin</Link>
    </div>
  );
  
  
  //NEED A BETTER TEST
  //without "!data.message" it places the data object into local storage with every keystroke
  //this then generates an error in navigation component when it is looking for "role"
  if (typeof window !== "undefined" && data.status && !hasError && !data.message) {
    // places "data" return object into local storage
    localStorage.setItem("user", JSON.stringify(data));
    let tempData = JSON.parse(localStorage.getItem("user"));
    // determines dashboard based on user's role
    if (tempData.user.role === 1) {
      return <Redirect to="/vendorevents" />;
    } else if (tempData.user.role === 0) {
      return <Redirect to="/buyerdashboard" />;
    } else {
      return <Redirect to="/buyerdashboard" />;
    }
  }

  return (
    <div className={classes.MainContainer}>
      <div className={classes.BlankCanvas} style={{height: "450px"}}>
        <br></br>
        <div className={classes.Header}>
          Password Reset
        </div>
        <br></br>
        <div>
          {hasError ?
            <div style={{color: "red"}}> {sysmessage}</div> :
            data.status ? <div>Please enter your new password:</div> : <div style={{color: "red"}}> {data.error}</div>
          }
          {passwordForm}
        </div>
        <br></br>
        {alteranteInputs}
      </div>
    </div>
  );
};

export default PasswordReset;




  
  
  
  
  










      /*
  // destructoring of "user" object in "localStorage" "data" variable
  const { user: user } = isAuthenticated();



  const submitValues = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    changePassword({ email: email, newPassword: password, token: token })
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
    */
