import React, { useState, useEffect, Fragment } from "react";
import { Redirect } from "react-router-dom";
import queryString from "query-string";

import Spinner from "../../components/UI/Spinner/SpinnerNew";

import { API } from "../../config";

import classes from "./AuthenticationNEW.module.css";

const Authentication = () => {
  // LOOKS GOOD
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    temporary: "",
    reissued: false,
    confirmation: "",
    resent: false,
    username: "",
    resetToken: "",
    sessionToken: "",
    userId: "",
  });

  // transaction status variable
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    error: false,
  });

  const [modalSetting, setModalSetting] = useState("spinner"); // spinner, signin, forgot, temporary, signup, confirmation, password, username, error

  // LOOKS GOOD
  const {
    name,
    email,
    password,
    temporary,
    reissued,
    confirmation,
    resent,
    username,
    resetToken,
    sessionToken,
    userId,
  } = values;

  const { message, error } = submissionStatus;

  // LOOKS GOOD
  useEffect(() => {
    let startingView = queryString.parse(window.location.search).new;

    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      if ("accountId" in tempUser.user) {
        //if ("accountId" in tempUser.user && "token" in tempUser) {
        window.location.href = "/myaccount";
      } else {
        {
          startingView ? setModalSetting("signup") : setModalSetting("signin");
        }
      }
    } else {
      {
        startingView ? setModalSetting("signup") : setModalSetting("signin");
      }
    }
  }, []);

  // LOOKS GOOD
  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  // LOOKS GOOD
  const submitSignIn = () => {
    setModalSetting("spinner");
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signin/email`;
    let information = {
      email: email,
      password: password,
    };
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information);
    fetch(url, fetchBody)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        handleSignIn(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setSubmissionStatus({
          message: "Server down please try again",
          error: true,
        });
        setModalSetting("error");
      });
  };

  // LOOKS GOOD
  const submitForgot = () => {
    setModalSetting("spinner");
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signin/sendcode`;
    let information = {
      email: email,
    };
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(information),
    };
    console.log("fetching with: ", url, fetchBody);
    fetch(url, fetchBody)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        handleForgot(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setModalSetting("error");
      });
  };

  // LOOKS GOOD
  const submitTemporary = () => {
    setModalSetting("spinner");
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signin/confirmcode`;
    let information = {
      email: email,
      confirm_code: temporary,
    };
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information);
    fetch(url, fetchBody)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        handleTemporary(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setModalSetting("error");
      });
  };

  // LOOKS GOOD
  const submitReissue = () => {
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signin/sendcode`;
    let information = {
      email: email,
    };
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information);
    fetch(url, fetchBody)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        handleReissue(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setModalSetting("error");
      });
  };

  // LOOKS GOOD
  const submitSignUp = () => {
    setModalSetting("spinner");
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signup/email`;
    let information = {
      email: email,
    };
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information);
    fetch(url, fetchBody)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        handleSignUp(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setModalSetting("error");
      });
  };

  // LOOKS GOOD
  const submitConfirmation = () => {
    setModalSetting("spinner");
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signup/confirmcode`;
    let information = {
      email: email,
      confirm_code: confirmation,
    };
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information);
    fetch(url, fetchBody)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        handleConfirmation(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setModalSetting("error");
      });
  };

  // LOOKS GOOD
  const submitPassword = () => {
    setModalSetting("spinner");
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signup/password`;
    let information = {
      email: email,
      resetPasswordToken: resetToken,
      password: password,
    };
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information);
    fetch(url, fetchBody)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        handlePassword(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setModalSetting("error");
      });
  };

  const submitUsername = () => {
    setModalSetting("spinner");
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${sessionToken}`);
    let url = `${API}/user/${userId}`;
    let information = {
      username: username,
    };
    console.log("myHeaders: ", myHeaders);
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information);
    fetch(url, fetchBody)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        handleUsername(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setModalSetting("error");
      });
  };

  const submitResend = () => {
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signup/resendcode`;
    let information = {
      email: email,
    };
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(information),
    };
    console.log("fetching with: ", url, fetchBody);
    console.log("Information: ", information);
    fetch(url, fetchBody)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        handleResend(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setModalSetting("error");
      });
  };

  // LOOKS GOOD
  const handleSignIn = (data) => {
    if (data.status) {
      localStorage.setItem("user", JSON.stringify(data)); // KEEP
      setValues({
        name: "",
        email: "",
        password: "",
        temporary: "",
        reissued: false,
        confirmation: "",
        resent: false,
        username: "",
        resetToken: "",
        sessionToken: "",
        userId: "",
      });
      redirectUser();
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      setModalSetting("signin");
      console.log("ERROR: ", data.error);
    }
  };

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
        resetToken: "",
        sessionToken: "",
        userId: "",
      });
      setModalSetting("temporary");
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      setModalSetting("forgot");
      console.log("ERROR: ", data.error);
    }
  };

  // LOOKS GOOD
  const handleTemporary = (data) => {
    if (data.status) {
      localStorage.setItem("user", JSON.stringify(data)); // KEEP
      setValues({
        name: "",
        email: "",
        password: "",
        temporary: "",
        reissued: false,
        confirmation: "",
        resent: false,
        username: "",
        resetToken: "",
        sessionToken: "",
        userId: "",
      });
      redirectUser();
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      setModalSetting("temporary");
      console.log("ERROR: ", data.error);
    }
  };

  // LOOKS GOOD
  const handleReissue = (data) => {
    console.log("Inside handleReissue");
    if (data.status) {
      setValues({
        name: "",
        email: data.user.email,
        password: "",
        temporary: "",
        reissued: true,
        confirmation: "",
        resent: false,
        username: "",
        resetToken: "",
        sessionToken: "",
        userId: "",
      });
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      console.log("ERROR: ", data.error);
    }
  };

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
        resetToken: "",
        sessionToken: "",
        userId: "",
      });
      console.log("SUCCESS");
      setModalSetting("confirmation");
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      setModalSetting("signup");
      console.log("ERROR: ", data.error);
    }
  };

  // LOOKS GOOD
  const handleConfirmation = (data) => {
    data.user._id = data.user.accountId.updateUserId;
    localStorage.setItem("user", JSON.stringify(data)); // KEEP
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
        resetToken: data.user.resetPasswordToken,
        sessionToken: "",
        userId: "",
      });
      console.log("SUCCESS");
      setModalSetting("password");
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      setModalSetting("confirmation");
      console.log("ERROR: ", data.error);
    }
  };

  // LOOKS GOOD
  const handlePassword = (data) => {
    console.log("Inside handlePassword");
    console.log("STATUS: ", data.status);
    if (data.status) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      tempUser.token = data.token;
      localStorage.setItem("user", JSON.stringify(tempUser));
      setValues({
        name: "",
        email: email,
        password: "",
        temporary: "",
        reissued: false,
        confirmation: "",
        resent: false,
        username: username,
        resetToken: "",
        sessionToken: data.token,
        userId: data.user._id,
      });
      console.log("SUCCESS");
      setModalSetting("username");
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      console.log("ERROR: ", data.error);
    }
  };

  const handleUsername = (data) => {
    if (data.username) {
      // NEED TO CHANGE TO "data.status"
      let tempUser = JSON.parse(localStorage.getItem("user"));
      tempUser.user.username = data.username;
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
        resetToken: "",
        sessionToken: "",
        userId: "",
      });
      redirectUser();
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      console.log("ERROR: ", data.error);
    }
  };

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
      resetToken: "",
      sessionToken: "",
      userId: "",
    });
  };

  // LOOKS GOOD
  const handleResend = (data) => {
    if (data.status) {
      setValues({
        name: "",
        email: data.user.email,
        password: "",
        temporary: "",
        reissued: false,
        confirmation: "",
        resent: true,
        username: username,
        resetToken: "",
        sessionToken: "",
        userId: "",
      });
      console.log("SUCCESS");
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      console.log("ERROR: ", data.error);
    }
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  // LOOKS GOOD
  const redirectUser = () => {
    console.log("Redirect user");
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("user") !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      if (
        "token" in tempUser &&
        "user" in tempUser &&
        "accountId" in tempUser.user
      ) {
        window.location.href = "/myaccount";
      } else {
        setSubmissionStatus({
          message: "Server error please try again",
          error: true,
        });
        setModalSetting("error");
      }
    } else {
      setSubmissionStatus({
        message: "Server error please try again",
        error: true,
      });
      setModalSetting("error");
    }
  };

  // LOOKS GOOD
  const showError = () => {
    if (error) {
      return (
        <div style={{ color: "red", fontSize: "14px", paddingBottom: "20px" }}>
          {message}
        </div>
      );
    } else if (
      modalSetting === "signin" ||
      modalSetting === "forgot" ||
      modalSetting === "signup" ||
      modalSetting === "password"
    ) {
      return null;
    } else if (modalSetting === "temporary" && !reissued) {
      console.log("values: ", values);
      return (
        <Fragment>
          <div style={{ fontSize: "16px", paddingBottom: "10px" }}>
            Enter the 6-digit code sent to:
          </div>
          <div style={{ fontSize: "16px", paddingBottom: "20px" }}>{email}</div>
        </Fragment>
      );
    } else if (modalSetting === "temporary" && reissued) {
      console.log("values: ", values);
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          Confirmation code resent to your email.
        </div>
      );
    } else if (modalSetting === "confirmation" && !resent) {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          Enter the 6-digit code sent to your email:
        </div>
      );
    } else if (modalSetting === "confirmation" && resent) {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          A new 6-digit code was sent to your email,
          <br></br>
          please enter it below:
        </div>
      );
    } else if (modalSetting === "username") {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          Default username provided below.
          <br></br>
          Submit a new username if desired:
        </div>
      );
    }
  };

  // LOOKS GOOD
  const signInForm = (
    <Fragment>
      <div style={{ paddingBottom: "20px", width: "100%", height: "85px" }}>
        <label style={{ fontSize: "15px" }}>E-mail Address</label>
        <input
          className={classes.InputBox}
          type="email"
          name="email"
          onChange={handleChange}
          value={email}
        />
      </div>

      <div style={{ paddingBottom: "20px", width: "100%", height: "85px" }}>
        <label style={{ fontSize: "15px" }}>Password</label>
        <input
          className={classes.InputBox}
          type="password"
          name="password"
          onChange={handleChange}
          value={password}
        />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            submitSignIn();
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
      <div style={{ paddingBottom: "20px", width: "100%", height: "85px" }}>
        <label style={{ fontSize: "15px" }}>E-mail Address</label>
        <input
          className={classes.InputBox}
          type="email"
          name="email"
          onChange={handleChange}
          value={email}
        />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            submitForgot();
          }}
        >
          SUBMIT YOUR EMAIL
        </button>
      </div>
    </Fragment>
  );

  // LOOKS GOOD
  const temporaryForm = (
    <Fragment>
      <div style={{ paddingBottom: "20px", width: "100%", height: "85px" }}>
        <label style={{ fontSize: "15px" }}>Confirmation code</label>
        <input
          className={classes.InputBox}
          type="text"
          name="temporary"
          onChange={handleChange}
          value={temporary}
        />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            submitTemporary();
          }}
        >
          SUBMIT CONFIRMATION CODE
        </button>
      </div>
    </Fragment>
  );

  // LOOKS GOOD
  const signUpForm = (
    <Fragment>
      <div style={{ paddingBottom: "20px", width: "100%", height: "85px" }}>
        <label style={{ fontSize: "15px" }}>E-mail Address</label>
        <input
          className={classes.InputBox}
          type="email"
          name="email"
          onChange={handleChange}
          value={email}
        />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            submitSignUp();
          }}
        >
          SUBMIT YOUR EMAIL
        </button>
      </div>
    </Fragment>
  );

  // LOOKS GOOD
  const confirmationForm = (
    <Fragment>
      <div style={{ paddingBottom: "20px", width: "100%", height: "85px" }}>
        <label style={{ fontSize: "15px" }}>Confirmation Number</label>
        <input
          className={classes.InputBox}
          type="text"
          name="confirmation"
          onChange={handleChange}
          value={confirmation}
        />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            submitConfirmation();
          }}
        >
          SUBMIT YOUR CODE
        </button>
      </div>
    </Fragment>
  );

  // LOOKS GOOD
  const passwordForm = (
    <Fragment>
      <div style={{ paddingBottom: "20px", width: "100%", height: "85px" }}>
        <label style={{ fontSize: "15px" }}>Password</label>
        <input
          className={classes.InputBox}
          type="text"
          name="password"
          onChange={handleChange}
          value={password}
        />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            submitPassword();
          }}
        >
          REGISTER YOUR PASSWORD
        </button>
      </div>
    </Fragment>
  );

  const usernameForm = (
    <Fragment>
      <div style={{ paddingBottom: "20px", width: "100%", height: "85px" }}>
        <label style={{ fontSize: "15px" }}>Username</label>
        <input
          className={classes.InputBox}
          type="text"
          name="username"
          onChange={handleChange}
          value={username}
        />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            submitUsername();
          }}
        >
          CHANGE YOUR USERNAME
        </button>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.CancelButton}
          onClick={() => {
            redirectUser();
          }}
        >
          CHANGE IT LATER
        </button>
      </div>
    </Fragment>
  );

  const errorForm = (
    <Fragment>
      <div
        style={{
          fontSize: "16px",
          color: "red",
          paddingBottom: "20px",
          width: "340px",
          height: "40px",
        }}
      >
        Please try again later
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.SubmitButton}
          onClick={() => {
            window.location.href = "/events";
          }}
        >
          CONTINUE
        </button>
      </div>
    </Fragment>
  );

  // LOOKS GOOD
  const alternateSignInInputs = (
    <div className={classes.Alternates}>
      <div style={{ textAlign: "left" }}>
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
      <div style={{ textAlign: "right" }}>
        <button
          className={classes.BlueText}
          onClick={() => {
            resetValues();
            setModalSetting("signup");
          }}
        >
          Create account
        </button>
      </div>
    </div>
  );

  // LOOKS GOOD
  const alternateTemporaryInputs = (
    <div className={classes.Alternates}>
      <div style={{ textAlign: "left" }}>
        <button
          className={classes.BlueText}
          onClick={() => {
            submitReissue();
          }}
        >
          Resend code
        </button>
      </div>
      <div style={{ textAlign: "right" }}>
        Back to{" "}
        <button
          className={classes.BlueText}
          onClick={() => {
            setModalSetting("signin");
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );

  // LOOKS GOOD
  const alternateSignUpInputs = (
    <div className={classes.Alternates}>
      <div style={{ textAlign: "left" }}>
        Back to{" "}
        <button
          className={classes.BlueText}
          onClick={() => {
            setModalSetting("signin");
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );

  // LOOKS GOOD
  const alternateConfirmationInputs = (
    <div className={classes.Alternates}>
      <div style={{ textAlign: "left" }}>
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
  );

  // LOOKS GOOD
  const spinnerDisplay = () => {
    if (modalSetting === "spinner") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <Spinner />
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  // LOOKS GOOD
  const signInDisplay = () => {
    if (modalSetting === "signin") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Welcome back</div>
          </div>
          <div>
            {showError()}
            {signInForm}
            {alternateSignInInputs}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  // LOOKS GOOD
  const forgotDisplay = () => {
    if (modalSetting === "forgot") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Trouble logging in?</div>
          </div>
          <div>
            {showError()}
            {forgotForm}
            {alternateSignUpInputs}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  // LOOKS GOOD
  const temporaryDisplay = () => {
    if (modalSetting === "temporary") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Enter confirmation code</div>
          </div>
          <div>
            {showError()}
            {temporaryForm}
            {alternateTemporaryInputs}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  // LOOKS GOOD
  const signUpDisplay = () => {
    if (modalSetting === "signup") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Tell us about yourself</div>
          </div>
          <div>
            {showError()}
            {signUpForm}
            {alternateSignUpInputs}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  // LOOKS GOOD
  const confirmationDisplay = () => {
    if (modalSetting === "confirmation") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Enter confirmation code</div>
          </div>
          <div>
            {showError()}
            {confirmationForm}
            {alternateConfirmationInputs}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  // LOOKS GOOD
  const passwordDisplay = () => {
    if (modalSetting === "password") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Create your password</div>
          </div>
          <div>
            {showError()}
            {passwordForm}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const usernameDisplay = () => {
    if (modalSetting === "username") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Change your username</div>
          </div>
          <div>
            {showError()}
            {usernameForm}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const errorDisplay = () => {
    if (modalSetting === "error") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>System Error</div>
          </div>
          <div>{errorForm}</div>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className={classes.MainContainer}>
      <div className={classes.Modal}>
        {spinnerDisplay()} // LOOKS GOOD
        {signInDisplay()} // LOOKS GOOD
        {forgotDisplay()} // LOOKS GOOD
        {temporaryDisplay()} // LOOKS GOOD
        {signUpDisplay()} // LOOKS GOOD
        {confirmationDisplay()} // LOOKS GOOD
        {passwordDisplay()} // LOOKS GOOD
        {usernameDisplay()}
        {errorDisplay()}
      </div>
    </div>
  );
};

export default Authentication;
