import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";

import { signin, authenticate, isAuthenticated } from "../apiUsers";
import { useSignin } from "./apiUsers";
import Spinner from "../../components/UI/Spinner/SpinnerNew";

import classes from "../User.module.css";

const SignIn = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    redirectToReferrer: false,
  });

  // destructors the "values" object
  const { email, password, error, loading, redirectToReferrer } = values;

  // destructoring of "user" object in "localStorage" "data" variable
  const { user: user } = isAuthenticated();

  const handleChange = (event) => {
    setValues({
      ...values,
      error: false,
      [event.target.name]: event.target.value,
    });
  };

  const submitValues = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signin({ email: email, password: password })
      .then((data) => {
        if (data.error) {
          console.log("data.error: ", data.error)
          setValues({ ...values, error: data.error, loading: false });
        } else {
          console.log("signIn return object: ", data);
          authenticate(data, () => {
            setValues({ ...values, redirectToReferrer: true });
          });
        }
      })
      .catch((err) => {
        //console.log("err: ", err)
        setValues({ ...values, error: true, loading: false });
      })
  };

  const submitValues2 = (event) => {
    event.preventDefault();
    console.log("Inside submitValues2")
    //useSignin();
    /*
    setValues({ ...values, error: false, loading: true });
    signin({ email: email, password: password })
      .then((data) => {
        if (data.error) {
          console.log("data.error: ", data.error)
          setValues({ ...values, error: data.error, loading: false });
        } else {
          console.log("signIn return object: ", data);
          authenticate(data, () => {
            setValues({ ...values, redirectToReferrer: true });
          });
        }
      })
      .catch((err) => {
        //console.log("err: ", err)
        setValues({ ...values, error: true, loading: false });
      })
      */
  };

  const showError = () => {
    //console.log("entered 'showError()'");
    //console.log("values.error: ", error);
    if (error) {
      console.log("Error in values state object");
      return (
         <div className="form-group" style={{color: "red"}}>
           Sign in error, please try again.
         {/*Email and password do not match. Please try again.*/}
         </div>
      )
    } else {
      console.log("NO Error in values state object");
      return null;
    }
  };

  const showLoading = () =>
    loading && (
      <div className="aler alert-info">
        <Spinner/>
      </div>
    );

  const redirectUser = () => {
    //console.log("entering redirect user");
    //console.log("redirectToReferrer: ",redirectToReferrer)
    if (redirectToReferrer) {
      console.log("entering if statement within redirect user");
      if (user && user.role === 2) {
        return <Redirect to="/adminevents" />;
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
      <br></br>
        <label styles={{ fontSize: "16px" }}>
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
      <button onClick={(event) => {
        submitValues(event);
        submitValues2(event);
      }}
      className="btn btn-primary">
        Submit
      </button>
    </form>
  );

  return (
    <div className={classes.MainContainer}>
      <div className={classes.BlankCanvas} style={{height: "450px"}}>
        <br></br>
        <div className={classes.Header}>Welcome Back</div>
        <br></br>
        <div className={classes.Section}>
          {values.error ?
            <div style={{color: "red"}}>
            Sign in error, please try again.
          {/*Email and password do not match. Please try again.*/}</div> :
            <div>Please sign in:</div>
          }
          {signInForm()}
          {redirectUser()}
        </div>
        <br></br>
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

      
    </div>
  );
};

export default SignIn;