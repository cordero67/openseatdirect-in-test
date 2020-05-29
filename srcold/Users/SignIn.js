import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { Form } from "react-bootstrap";

import { signin, authenticate, isAuthenticated } from "./apiUsers";

import classes from "./User.module.css";

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
        console.log('{"error":"Email and password do not match"}')
        console.log("err.error: ", err.error)
        console.log("err: ", err)
        setValues({ ...values, error: true, loading: false });
        //setValues({ ...values, error: err.error, loading: false });
      })
  };

  const showError = () => {
    console.log("entered 'showError()'");
    console.log("values.error: ", error);
    if (error) {
      console.log("Error in values state object");
      return (
         <div className="form-group" style={{color: "red"}}>
         Email and password do not match. Please try again.
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
        <h2>Loading...</h2>
      </div>
    );

  const redirectUser = () => {
    console.log("entering redirect user");
    console.log("redirectToReferrer: ",redirectToReferrer)
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
        <label className="text-muted" styles={{ fontSize: "16px" }}>
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
        <label className="text-muted">Password</label>
        <input
          type="password"
          name="password"
          className="form-control"
          onChange={handleChange}
          value={password}
        />
      </div>

      <div>
        Forgot your{" "}
        <Link to="/passwordrecovery" style={{ color: "blue" }}>
          password.
        </Link>
      </div>
      <br></br>
      <button onClick={submitValues} className="btn btn-primary">
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
            <div style={{color: "red"}}>Email and password do not match. Please try again.</div> :
            <div>Please sign in:</div>
          }
          
          <br></br>
          {signInForm()}
          {redirectUser()}
        </div>
        <br></br>
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

/*

          {showError()}
          {showLoading()}

    <Form>
      <Form.Group>
            <Form.Label>E-mail Address
            </Form.Label>
            <Form.Control/>
            <Form.Label>Password
            </Form.Label>
            <Form.Control/>
          </Form.Group>
          
        <button>
          SUBMIT
        </button>
      <br></br>
      <br></br>
      <div className={styles.Header}>
        Don't have an account, go to{" "}
        <span style={{color: "blue"}}> 
          <Link to="/signup">
            Sign Up.
          </Link>
        </span>
      </div>
    </Form>
    */
