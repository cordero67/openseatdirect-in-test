import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";

import { useOurApi } from "./apiUsers";
import { API } from "../../config";

import classes from "./Authentication.module.css";

const SignUp = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    vendorIntent: false
  });

  const { name, email, password, vendorIntent } = values;

  let  myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const url1 = `${API}/signup`;
  const method1 = "POST";
  const body1  = null;
  const initialData1 ={status: true, message:"hi first time"};

  const { isLoading, hasError, setUrl, setBody, data, networkError} = useOurApi(method1, url1,myHeaders,body1, initialData1);

  const sysmessage = networkError ? "NetworkError...please check your connectivity" : "SYSTEM ERROR - please try again";

  const changeValues = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  }

  const changeIntent = () => {
    setValues({
      ...values,
      ["vendorIntent"]: !vendorIntent
    });
  }

  const showError = () => {
    if (hasError) {
      return (
        <div style={{color: "red", paddingBottom: "20px"}}> {sysmessage}</div>
      )
    } else if (data.status) {
      return (
        <div style={{fontSize: "16px", paddingBottom: "20px"}}>Please provide the following information:</div>
      )
    } else {
      return (
        <div style={{color: "red", paddingBottom: "20px"}}>{data.error}</div>
      )
    }
  };

  const showSuccess = (
    <div style={{paddingBottom: "20px", width: "340px"}}>
      <div style={{lineHeight: "20px", paddingBottom: "20px"}}>To complete the sign-up process, please click the link in the message sent to your e-mail inbox:</div>
      <div style={{color: "blue", paddingBottom: "20px"}}>{values.email}.</div>
      <div style={{lineHeight: "20px", paddingBottom: "20px"}}>Please check your spam/junk folder if you do not see our message in your main inbox.</div>
      <div style={{lineHeight: "20px", paddingBottom: "20px"}}>For "gmail" accounts, please check your "All Mail" folder.</div>
      <div>Back to <Link to="/signin" style={{fontWeight: "600", color: "blue"}}>Signin</Link></div>
    </div>
  );

  const disabledTest = () => {
    let result = false;
    if (name.length < 2) {
      result = true
    }
    if (email.length < 1) {
      result = true
    }
    if (password.length < 8) {
      result = true
    }
    return result;
  }

  const signUpForm = (
    <Fragment>
      <div style={{paddingBottom: "20px", width: "340px", height: "60px"}}>
        <div className={classes.InputCheckbox}>
          <input
            type="checkbox"
            id="vendorIntent"
            name="vendorIntent"
            value={false}
            onChange={() => {
              console.log("Changed checkbox")
              changeIntent()
            }}
          />
          <span></span>
          <label style={{paddingLeft: "10px"}}  for="vendorIntent">
            {" "}Sign Up to also <span style={{color: "#008F00", fontWeight: "600"}}>Create Events</span>
          </label>
        </div>
      </div>

      <div style={{paddingBottom: "20px", width: "340px", height: "85px"}}>
        <label style={{fontSize: "15px"}}>Full Name</label>
        <input
          className={classes.InputBox}
          type="text"
          name="name"
          onChange={changeValues}
          value={name}
          placeholder="Minimum 2 characters"
        />
      </div>

      <div style={{paddingBottom: "20px", width: "340px", height: "85px"}}>
        <label style={{fontSize: "15px"}}>E-mail Address</label>
        <input
          className={classes.InputBox}
          type="email"
          name="email"
          onChange={changeValues}
          value={email}
        />
      </div>

      <div style={{paddingBottom: "20px", width: "340px", height: "85px"}}>
        <label style={{fontSize: "15px"}}>Password</label>
        <input
          className={classes.InputBox}
          type="text"
          name="password"
          onChange={changeValues}
          value={password}
          placeholder="Minimum 8 characters, must include one number"
        />
      </div>
      <div style={{paddingTop: "10px"}}>
        <button
          className={classes.SubmitButton}
          style={{opacity: disabledTest() ? "0.7" : "1.0"}}
          disabled={disabledTest()}
          onClick={() => {
            setBody({
              name: name,
              email: email,
              password: password,
              vendorIntent: vendorIntent
            })
          }}>
          CREATE YOUR ACCOUNT
        </button>
      </div>
    </Fragment>
  );
  
  const alternateInputs = (
    <div className={classes.Alternates}>
      <div>
        Back to{" "}
        <Link to="/signin" style={{fontWeight: "600", color: "blue"}}>
          Sign In
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
        <Fragment>
          {showSuccess}
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          {showError()}
          {signUpForm}
          {alternateInputs}
        </Fragment>
      )
    }
  }

  return (
    <div className={classes.MainContainer}>
      <div className={classes.BlankCanvas}>
        <div className={classes.Header}>
          Tell us about yourself
        </div>
        <div className={classes.Section}>
          {mainDisplay()}
        </div>
      </div>
    </div>
  );
};

export default SignUp;