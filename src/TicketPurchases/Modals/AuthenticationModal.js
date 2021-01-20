import React, { useState, Fragment } from "react";
import { Redirect, Link } from "react-router-dom";

import { API } from "../../config";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import Backdrop from "./Backdrop";
import classes from "./AuthenticationModal.module.css";

const Authentication = (props) => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    temporary: "",
    reissued: false,
    confirmation: "",
    resent: false,
    username: "",
    vendorIntent: false,
    resetToken: "",
    sessionToken: "",
    userId: ""
  });

  // transaction status variable
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    error: false
  });

  const [modalSetting, setModalSetting] = useState("signin") // signin, forgot, temporary, signup, confirmation, password, username, error

  const { name, email, password, temporary, reissued, confirmation, resent, username, vendorIntent, resetToken, sessionToken, userId } = values;

  const { message, error } = submissionStatus;

  const handleErrors = response => {
    console.log ("inside handleErrors ", response);
    if (!response.ok) {
        throw Error(response.status);
    }
    return response;
  };

  // LOOKS GOOD
  const submitSignIn = () => {
    setSubmissionStatus({
      message: "",
      error: false
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signin_email`;
    let information = {
      email: email,
      password: password
    }
    let fetchBody ={
        method: "POST",
        headers: myHeaders,
        body:JSON.stringify (information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information)
    fetch(url, fetchBody )
    .then(handleErrors)
    .then ((response)=>{
      console.log ("then response: ", response);
      return response.json()})
    .then ((data)=>{
      console.log ("fetch return got back data:", data);
      handleSignIn(data)
    })
    .catch ((error)=>{
      console.log("freeTicketHandler() error.message: ", error.message);
      setSubmissionStatus({
        message: "Server down please try again",
        error: true
      });
      setModalSetting("error")
    })
  }

  // LOOKS GOOD
  const submitForgot = () => {
    setSubmissionStatus({
      message: "",
      error: false
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/send_access_code2`;
    let information = {
      email: email
    }
    let fetchBody ={
      method: "POST",
      headers: myHeaders,
      body:JSON.stringify (information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information)
    fetch(url, fetchBody )
    .then(handleErrors)
    .then ((response)=>{
      console.log ("then response: ", response);
      return response.json()})
    .then ((data)=>{
      console.log ("fetch return got back data:", data);
      handleForgot(data)
    })
    .catch ((error)=>{
      console.log("freeTicketHandler() error.message: ", error.message);
      setSubmissionStatus({
        message: "Server is down, please try later",
        error: true
      });
      setModalSetting("error")
    })
  }

  // LOOKS GOOD
  const submitTemporary = () => {
    setSubmissionStatus({
      message: "",
      error: false
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/confirm_access_code2`;
    let information = {
      email: email,
      confirm_code: temporary,
    }
    let fetchBody ={
      method: "POST",
      headers: myHeaders,
      body:JSON.stringify (information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information)
    fetch(url, fetchBody )
    .then(handleErrors)
    .then ((response)=>{
      console.log ("then response: ", response);
      return response.json()})
    .then ((data)=>{
      console.log ("fetch return got back data:", data);
      handleTemporary(data)
    })
    .catch ((error)=>{
      console.log("freeTicketHandler() error.message: ", error.message);
      setSubmissionStatus({
        message: "Server is down, please try later",
        error: true
      });
      setModalSetting("error")
    })
  }

  // LOOKS GOOD
  const submitReissue = () => {
    setSubmissionStatus({
      message: "",
      error: false
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/send_access_code2`;
    let information = {
      email: email
    }
    let fetchBody ={
      method: "POST",
      headers: myHeaders,
      body:JSON.stringify (information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information)
    fetch(url, fetchBody )
    .then(handleErrors)
    .then ((response)=>{
      console.log ("then response: ", response);
      return response.json()})
    .then ((data)=>{
      console.log ("fetch return got back data:", data);
      handleReissue(data)
    })
    .catch ((error)=>{
      console.log("freeTicketHandler() error.message: ", error.message);
      setSubmissionStatus({
        message: "Server is down, please try later",
        error: true
      });
      setModalSetting("error")
    })
  }

  // LOOKS GOOD
  const submitSignUp = () => {
    setSubmissionStatus({
      message: "",
      error: false
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signup1_email`;
    let information = {
      email: email,
      vendorIntent: false
    }
    let fetchBody ={
      method: "POST",
      headers: myHeaders,
      body:JSON.stringify (information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information)
    fetch(url, fetchBody )
    .then(handleErrors)
    .then ((response)=>{
      console.log ("then response: ", response);
      return response.json()})
    .then ((data)=>{
      console.log ("fetch return got back data:", data);
      handleSignUp(data)
    })
    .catch ((error)=>{
      console.log("freeTicketHandler() error.message: ", error.message);
      setSubmissionStatus({
        message: "Server is down, please try later",
        error: true
      });
      setModalSetting("error")
    })
  }

  // LOOKS GOOD
  const submitConfirmation = () => {
    setSubmissionStatus({
      message: "",
      error: false
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signup2_confirm`;
    let information = {
      email: email,
      confirm_code: confirmation,
      vendorIntent: false
    }
    let fetchBody ={
      method: "POST",
      headers: myHeaders,
      body:JSON.stringify (information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information)
    fetch(url, fetchBody )
    .then(handleErrors)
    .then ((response)=>{
      console.log ("then response: ", response);
      return response.json()})
    .then ((data)=>{
      console.log ("fetch return got back data:", data);
      handleConfirmation(data)
    })
    .catch ((error)=>{
      console.log("freeTicketHandler() error.message: ", error.message);
      setSubmissionStatus({
        message: "Server is down, please try later",
        error: true
      });
      setModalSetting("error")
    })
  }

  // LOOKS GOOD
  const submitPassword = () => {
    setSubmissionStatus({
      message: "",
      error: false
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signup3_password`;
    let information = {
      email: email,
      resetPasswordToken: resetToken,
      password: password,
      vendorIntent: false
    }
    let fetchBody ={
      method: "POST",
      headers: myHeaders,
      body:JSON.stringify (information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information)
    fetch(url, fetchBody )
    .then(handleErrors)
    .then ((response)=>{
      console.log ("then response: ", response);
      return response.json()})
    .then ((data)=>{
      console.log ("fetch return got back data:", data);
      handlePassword(data)
    })
    .catch ((error)=>{
      console.log("freeTicketHandler() error.message: ", error.message);
      setSubmissionStatus({
        message: "Server is down, please try later",
        error: true
      });
      setModalSetting("error")
    })
  }

  // LOOKS GOOD
  const submitUsername = () => {
    setSubmissionStatus({
      message: "",
      error: false
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${sessionToken}`);
    let url = `${API}/auth/update_username/${userId}`;
    let information = {
      email: email,
      username: username
    }
    console.log("myHeaders: ", myHeaders)
    let fetchBody ={
      method: "POST",
      headers: myHeaders,
      body:JSON.stringify (information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information)
    fetch(url, fetchBody )
    .then(handleErrors)
    .then ((response)=>{
      console.log ("then response: ", response);
      return response.json()})
    .then ((data)=>{
      console.log ("fetch return got back data:", data);
      handleUsername(data)
    })
    .catch ((error)=>{
      console.log("freeTicketHandler() error.message: ", error.message);
      setSubmissionStatus({
        message: "Server is down, please try later",
        error: true
      });
      setModalSetting("error")
    })
  }

  // LOOKS GOOD
  const submitResend = () => {
    setSubmissionStatus({
      message: "",
      error: false
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/resend_confirm_code`;
    let information = {
      email: email
    }
    let fetchBody ={
      method: "POST",
      headers: myHeaders,
      body:JSON.stringify (information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information)
    fetch(url, fetchBody )
    .then(handleErrors)
    .then ((response)=>{
      console.log ("then response: ", response);
      return response.json()})
    .then ((data)=>{
      console.log ("fetch return got back data:", data);
      handleResend(data)
    })
    .catch ((error)=>{
      console.log("freeTicketHandler() error.message: ", error.message);
      setSubmissionStatus({
        message: "Server is down, please try later",
        error: true
      });
      setModalSetting("error")
    })
  }

  // LOOKS GOOD
  const handleSignIn = (data) => {
    if (data.status) {
      localStorage.setItem("user", JSON.stringify(data));
      setValues({
        name: "",
        email: "",
        password: "",
        temporary: "",
        reissued: false,
        confirmation: "",
        resent: false,
        username: "",
        vendorIntent: false,
        resetToken: "",
        sessionToken: "",
        userId: ""
      });
      console.log("SUCCESS")
      props.submitOrder();
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true
      });
      console.log("ERROR: ", data.error)
    }
  }

  // LOOKS GOOD
  const handleForgot = (data) => {
    if (data.status) {
      setValues({
        name: "",
        email: data.user.email,
        password: "",
        temporary: "",
        reissued: false,
        confirmation: "",
        resent: false,
        username: "",
        vendorIntent: false,
        resetToken: "",
        sessionToken: "",
        userId: ""
      });
      console.log("SUCCESS")
      setModalSetting("temporary")
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true
      });
      console.log("ERROR: ", data.error)
    }
  }

  // LOOKS GOOD
  const handleTemporary = (data) => {
    if (data.status) {
      localStorage.setItem("user", JSON.stringify(data));
      setValues({
        name: "",
        email: "",
        password: "",
        temporary: "",
        reissued: false,
        confirmation: "",
        resent: false,
        username: "",
        vendorIntent: false,
        resetToken: "",
        sessionToken: "",
        userId: ""
      });
      console.log("SUCCESS")
      props.submitOrder();

    } else {
      setSubmissionStatus({
        message: data.error,
        error: true
      });
      console.log("ERROR: ", data.error)
    }
  }

  // LOOKS GOOD
  const handleReissue = (data) => {
    if (data.status) {
      localStorage.setItem("user", JSON.stringify(data));
      setValues({
        name: "",
        email: data.user.email,
        password: "",
        temporary: "",
        reissued: true,
        confirmation: "",
        resent: false,
        username: "",
        vendorIntent: false,
        resetToken: "",
        sessionToken: "",
        userId: ""
      });
      console.log("SUCCESS")
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true
      });
      console.log("ERROR: ", data.error)
    }
  }

  // LOOKS GOOD
  const handleSignUp = (data) => {
    if (data.status) {
      setValues({
        name: "",
        email: data.user.email,
        password: "",
        temporary: "",
        reissued: false,
        confirmation: "",
        resent: false,
        username: data.user.username,
        vendorIntent: data.user.vendorIntent,
        resetToken: "",
        sessionToken: "",
        userId: ""
      });
      console.log("SUCCESS")
      setModalSetting("confirmation")
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true
      });
      console.log("ERROR: ", data.error)
    }
  }

  // LOOKS GOOD
  const handleConfirmation = (data) => {
    if (data.status) {
      setValues({
        name: "",
        email: data.user.email,
        password: "",
        temporary: "",
        reissued: false,
        confirmation: "",
        resent: false,
        username: data.user.username,
        vendorIntent: data.user.vendorIntent,
        resetToken: data.user.resetPasswordToken,
        sessionToken: "",
        userId: ""
      });
      console.log("SUCCESS")
      setModalSetting("password")
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true
      });
      console.log("ERROR: ", data.error)
    }
  }

  // LOOKS GOOD
  const handlePassword = (data) => {
    if (data.status) {
      localStorage.setItem("user", JSON.stringify(data));
      setValues({
        name: "",
        email: data.user.email,
        password: "",
        temporary: "",
        reissued: false,
        confirmation: "",
        resent: false,
        username: data.user.username,
        vendorIntent: data.user.vendorIntent,
        resetToken: "",
        sessionToken: data.token,
        userId: data.user._id
      });
      console.log("SUCCESS")
      setModalSetting("username")
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true
      });
      console.log("ERROR: ", data.error)
    }
  }

  // LOOKS GOOD
  const handleUsername = (data) => {
    console.log("Inside handleUsername")
    if (data.status) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      tempUser.user = data.user;
      localStorage.setItem("user", JSON.stringify(tempUser));
      setValues({
        name: "",
        email: "",
        password: "",
        temporary: "",
        reissued: false,
        confirmation: "",
        resent: false,
        username: "",
        vendorIntent: false,
        resetToken: "",
        sessionToken: "",
        userId: ""
      });
      console.log("SUCCESS")
      props.submitOrder();

    } else {
      setSubmissionStatus({
        message: data.error,
        error: true
      });
      console.log("ERROR: ", data.error)
    }
  }

  // LOOKS GOOD
  const resetValues = () => {
    setValues({
      name: "",
      email: "",
      password: "",
      temporary: "",
      reissued: false,
      confirmation: "",
      resent: false,
      username: "",
      vendorIntent: false,
      resetToken: "",
      sessionToken: "",
      userId: ""
    })
  }

  // LOOKS GOOD
  const handleResend = (data) => {
    if (data.status) {
      localStorage.setItem("user", JSON.stringify(data));
      setValues({
        name: "",
        email: data.user.email,
        password: "",
        temporary: "",
        reissued: false,
        confirmation: "",
        resent: true,
        username: data.user.username,
        vendorIntent: false,
        resetToken: data.user.resetPasswordToken,
        sessionToken: "",
        userId: ""
      });
      console.log("SUCCESS")
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true
      });
      console.log("ERROR: ", data.error)
    }
  }

  // LOOKS GOOD
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  // LOOKS GOOD
  const showError = () => {
    if (error) {
      return (
        <div style={{color: "red", fontSize: "14px", paddingBottom: "20px"}}>{message}</div>
      )
    } else if (modalSetting === "signin" || modalSetting === "forgot"|| modalSetting === "signup" || modalSetting === "password") {  
      return (
        <div style={{fontSize: "16px", paddingBottom: "20px"}}>Please provide the following:</div>
      )
    } else if (modalSetting === "temporary" && !reissued) {
      console.log("modalSetting === 'temporary' && !reissued")
      console.log("values: ", values)
      return (
        <div style={{fontSize: "16px", paddingBottom: "20px"}}>
          Temporary password sent to your email,
          <br></br>
          please enter it below:
        </div>
      )
    } else if (modalSetting === "temporary" && reissued) {
      console.log("modalSetting === 'temporary' && reissued")
      console.log("values: ", values)
      return (
        <div style={{fontSize: "16px", paddingBottom: "20px"}}>
          Temporary password resent to your email,
          <br></br>
          please enter it below:
        </div>
      )
    } else if (modalSetting === "confirmation" && !resent) {
      return (
        <div style={{fontSize: "16px", paddingBottom: "20px"}}>Enter the 6-digit code sent to your email:</div>
      )
    } else if (modalSetting === "confirmation" && resent) {
      return (
        <div style={{fontSize: "16px", paddingBottom: "20px"}}>
          A new 6-digit code was sent to your email,
          <br></br>
          please enter it below:
        </div>
      )
    } else if (modalSetting === "username") {
      return (
        <div style={{fontSize: "16px", paddingBottom: "20px"}}>
          Default username provided below.
          <br></br>
          Submit a new username if desired:
        </div>
      )
    }
  };

  // LOOKS GOOD
  const signInForm = (
    <Fragment>
      <div style={{paddingBottom: "20px", width: "100%", height: "85px"}}>
        <label style={{fontSize: "15px"}}>E-mail Address</label>
        <input
          className={classes.InputBox}
          type="email"
          name="email"
          onChange={handleChange}
          value={email}
        />
      </div>

      <div style={{paddingBottom: "20px", width: "100%", height: "85px"}}>
        <label style={{fontSize: "15px"}}>Password</label>
        <input
          className={classes.InputBox}
          type="password"
          name="password"
          onChange={handleChange}
          value={password}
        />
      </div>
      <div style={{paddingTop: "10px"}}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            submitSignIn()
          }}
        >
          SIGN IN TO YOUR ACCOUNT
        </button>
      </div>
    </Fragment>
  );

  // LOOKS GOOD
  const forgotForm = (
    <Fragment>
      <div style={{paddingBottom: "20px", width: "100%", height: "85px"}}>
        <label style={{fontSize: "15px"}}>E-mail Address</label>
        <input
          className={classes.InputBox}
          type="email"
          name="email"
          onChange={handleChange}
          value={email}
        />
      </div>
      <div style={{paddingTop: "10px"}}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            submitForgot()
        }}>
          SUBMIT YOUR EMAIL
        </button>
      </div>
    </Fragment>
  );

  // LOOKS GOOD
  const temporaryForm = (
    <Fragment>
      <div style={{paddingBottom: "20px", width: "100%", height: "85px"}}>
        <label style={{fontSize: "15px"}}>Temporary Password</label>
        <input
          className={classes.InputBox}
          type="text"
          name="temporary"
          onChange={handleChange}
          value={temporary}
        />
      </div>
      <div style={{paddingTop: "10px"}}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            submitTemporary();
        }}>
          SUBMIT TEMPORARY PASSWORD
        </button>
      </div>
    </Fragment>
  );

  // LOOKS GOOD
  const signUpForm = (
    <Fragment>
      <div style={{paddingBottom: "20px", width: "100%", height: "85px"}}>
        <label style={{fontSize: "15px"}}>E-mail Address</label>
        <input
          className={classes.InputBox}
          type="email"
          name="email"
          onChange={handleChange}
          value={email}
        />
      </div>
      <div style={{paddingTop: "10px"}}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            submitSignUp()
        }}>
          CREATE YOUR ACCOUNT
        </button>
      </div>
    </Fragment>
  );

  // LOOKS GOOD
  const confirmationForm = (
    <Fragment>
      <div style={{paddingBottom: "20px", width: "100%", height: "85px"}}>
        <label style={{fontSize: "15px"}}>Confirmation Number</label>
        <input
          className={classes.InputBox}
          type="text"
          name="confirmation"
          onChange={handleChange}
          value={confirmation}
        />
      </div>
      <div style={{paddingTop: "10px"}}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            submitConfirmation();
        }}>
          SUBMIT YOUR CODE
        </button>
      </div>
    </Fragment>
  );

  // LOOKS GOOD
  const passwordForm = (
    <Fragment>
      <div style={{paddingBottom: "20px", width: "100%", height: "85px"}}>
        <label style={{fontSize: "15px"}}>Password</label>
        <input
          className={classes.InputBox}
          type="text"
          name="password"
          onChange={handleChange}
          value={password}
        />
      </div>
      <div style={{paddingTop: "10px"}}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            console.log("clicked submit button")
            submitPassword();
        }}>
          REGISTER YOUR PASSWORD
        </button>
      </div>
    </Fragment>
  );

  // LOOKS GOOD
  const usernameForm = (
    <Fragment>
      <div style={{paddingBottom: "20px", width: "100%", height: "85px"}}>
        <label style={{fontSize: "15px"}}>Username</label>
        <input
          className={classes.InputBox}
          type="text"
          name="username"
          onChange={handleChange}
          value={username}
        />
      </div>
      <div style={{paddingTop: "10px"}}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            console.log("clicked submit button")
            submitUsername();
        }}>
          CHANGE YOUR USERNAME
        </button>
      </div>
      <div style={{paddingTop: "10px"}}>
        <button
          className={classes.CancelButton}
          onClick={() => {
            console.log("clicked skip button")
            props.submitOrder();
        }}>
          CHANGE IT LATER
        </button>
      </div>
    </Fragment>
  );

  // LOOKS GOOD
  const errorForm = (
    <Fragment>
      <div style={{fontSize: "16px", color: "red", paddingBottom: "20px", width: "340px", height: "40px"}}>
        Please try again later
      </div>
      <div style={{paddingTop: "10px"}}>
        <button
          className={classes.SubmitButton}
          onClick={() => {

            closeModal()
        }}>
          CONTINUE
        </button>
      </div>
    </Fragment>
  );

  // LOOKS GOOD
  const alternateSignInInputs = (
    <div className={classes.Alternates}>
      <div style={{textAlign: "left"}}>
        <button
          className={classes.BlueText}
          onClick={() => {
            resetValues();
            setModalSetting("forgot");
          }}
        >
          Forgot password?
        </button>
      </div>
      <div style={{textAlign: "right"}}>
        <button
          className={classes.BlueText}
          onClick={() => {
            resetValues();
            setModalSetting("signup")
          }}
        >
          Create account
        </button>
      </div>
    </div>
  )

  // LOOKS GOOD
  const alternateTemporaryInputs = (
    <div className={classes.Alternates}>
      <div style={{textAlign: "left"}}>
        <button
          className={classes.BlueText}
          onClick={() => {
            console.log("clicked resend button")
            submitReissue();
          }}
        >
          Resend password
        </button>
      </div>
      <div style={{textAlign: "right"}}>
        Back to{" "}
        <button
          className={classes.BlueText}
          onClick={() => {
            setModalSetting("signin")
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  )

  // LOOKS GOOD
  const alternateSignUpInputs = (
    <div className={classes.Alternates}>
      <div style={{textAlign: "left"}}>
        Back to{" "}
        <button
          className={classes.BlueText}
          onClick={() => {
            setModalSetting("signin")
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  )

  // LOOKS GOOD
  const alternateConfirmationInputs = (
    <div className={classes.Alternates}>
      <div style={{textAlign: "left"}}>
        <button
          className={classes.BlueText}
          onClick={() => {
            submitResend();
          }}
        >
          Resend code
        </button>
      </div>
    </div>
  )

  // LOOKS GOOD
  const closeModal = () => {
    resetValues();
    setSubmissionStatus({
      message: "",
      error: false
    });
    setModalSetting("signin");
    props.closeModal()
  }

  // LOOKS GOOD
  const signInDisplay = () => {
    if (modalSetting === "signin") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Welcome back</div>
            <div style={{textAlign: "right"}}>
              <FontAwesomeIcon
                size="1x"
                color="black"
                cursor = "pointer"
                onClick={() => {
                  closeModal()
                }}
                icon={faTimes}
              />
            </div>
          </div>
          <div>
            {showError()}
            {signInForm}
            {alternateSignInInputs}
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  // LOOKS GOOD
  const forgotDisplay = () => {
    if (modalSetting === "forgot") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Need a temporary password?</div>
            <div style={{textAlign: "right"}}>
              <FontAwesomeIcon
                size="1x"
                color="black"
                cursor = "pointer"
                onClick={() => {
                  closeModal()
                }}
                icon={faTimes}
              />
            </div>
          </div>
          <div>
            {showError()}
            {forgotForm}
            {alternateSignUpInputs}
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  // LOOKS GOOD
  const temporaryDisplay = () => {
    if (modalSetting === "temporary") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Enter temporary password</div>
            <div style={{textAlign: "right"}}>
              <FontAwesomeIcon
                size="1x"
                color="black"
                cursor = "pointer"
                onClick={() => {
                  closeModal()
                }}
                icon={faTimes}
              />
            </div>
          </div>
          <div>
            {showError()}
            {temporaryForm}
            {alternateTemporaryInputs}
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  // LOOKS GOOD
  const signUpDisplay = () => {
    if (modalSetting === "signup") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Tell us about yourself</div>
            <div style={{textAlign: "right"}}>
              <FontAwesomeIcon
                size="1x"
                color="black"
                cursor = "pointer"
                onClick={() => {
                  closeModal()
                }}
                icon={faTimes}
              />
            </div>
          </div>
          <div>
            {showError()}
            {signUpForm}
            {alternateSignUpInputs}
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  // LOOKS GOOD
  const confirmationDisplay = () => {
    if (modalSetting === "confirmation") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Enter confirmation code</div>
            <div style={{textAlign: "right"}}>
              <FontAwesomeIcon
                size="1x"
                color="black"
                cursor = "pointer"
                onClick={() => {
                  closeModal()
                }}
                icon={faTimes}
              />
            </div>
          </div>
          <div>
            {showError()}
            {confirmationForm}
            {alternateConfirmationInputs}
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  // LOOKS GOOD
  const passwordDisplay = () => {
    if (modalSetting === "password") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Create your password</div>
            <div style={{textAlign: "right"}}>
              <FontAwesomeIcon
                size="1x"
                color="black"
                cursor = "pointer"
                onClick={() => {
                  closeModal()
                }}
                icon={faTimes}
              />
            </div>
          </div>
          <div>
            {showError()}
            {passwordForm}
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  // LOOKS GOOD
  const usernameDisplay = () => {
    if (modalSetting === "username") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Change your username</div>
            <div style={{textAlign: "right"}}>
              <FontAwesomeIcon
                size="1x"
                color="black"
                cursor = "pointer"
                onClick={() => {
                  closeModal()
                }}
                icon={faTimes}
              />
            </div>
          </div>
          <div>
            {showError()}
            {usernameForm}
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  // LOOKS GOOD
  const errorDisplay = () => {
    if (modalSetting === "error") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>System Error</div>
            <div style={{textAlign: "right"}}>
              <FontAwesomeIcon
                size="1x"
                color="black"
                cursor = "pointer"
                onClick={() => {
                  closeModal()
                }}
                icon={faTimes}
              />
            </div>
          </div>
          <div>
            {errorForm}
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  // LOOKS GOOD
  return (
    <Fragment>
      <Backdrop show={props.show} clicked={props.modalClosed}></Backdrop>
      <div
        style={{
          transform: props.show ? "translateY(0)" : "translateY(-100vh)",
          opacity: props.show ? "1" : "0",
          fontSize: "20px"
        }}
        className={classes.Modal}
      >
        {signInDisplay()}
        {forgotDisplay()}
        {temporaryDisplay()}
        {signUpDisplay()}
        {confirmationDisplay()}
        {passwordDisplay()}
        {usernameDisplay()}
        {errorDisplay()}
      </div>
    </Fragment>
  );
};

export default Authentication;