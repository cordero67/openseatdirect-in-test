import React, { useState, useEffect, Fragment } from "react";
//

import Spinner from "../../components/UI/Spinner/SpinnerNew";

import { API } from "../../config";

import Backdrop from "./Backdrop";
import classes from "./AuthenticationModal.module.css";

const Authentication = (props) => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    temporary: "",
    reissued: false,
    expired: false,
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

  const [modalSetting, setModalSetting] = useState(props.start); // signin, forgot, temporary, signup, confirmation, password, username, error

  const {
    name,
    email,
    password,
    temporary,
    reissued,
    expired,
    confirmation,
    resent,
    username,
    resetToken,
    sessionToken,
    userId,
  } = values;

  const { message, error } = submissionStatus;
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

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

  const submitPassword = () => {
    setModalSetting("spinner");
    setSubmissionStatus({
      message: "",
      error: false,
    });

    console.log("email: ", email);
    console.log("resetToken: ", resetToken);
    console.log("password: ", password);

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signup/password`;
    let information = {
      email: email,
      passwordToken: resetToken,
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

  const handleSignIn = (data) => {
    if (data.status) {
      localStorage.setItem("user", JSON.stringify(data));
      setValues({
        name: "",
        email: "",
        password: "",
        temporary: "",
        reissued: false,
        expired: false,
        confirmation: "",
        resent: false,
        username: "",
        resetToken: "",
        sessionToken: "",
        userId: "",
      });
      closeModal(false);
      //props.submit();
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      setModalSetting("signin");
      console.log("ERROR: ", data.error);
    }
  };

  const handleForgot = (data) => {
    if (data.status) {
      setValues({
        name: "",
        email: data.user.email,
        password: "",
        temporary: "",
        reissued: false,
        expired: false,
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

  const handleTemporary = (data) => {
    if (data.status) {
      localStorage.setItem("user", JSON.stringify(data));
      setValues({
        name: "",
        email: "",
        password: "",
        temporary: "",
        reissued: false,
        expired: false,
        confirmation: "",
        resent: false,
        username: "",
        resetToken: "",
        sessionToken: "",
        userId: "",
      });
      closeModal(false);
      //props.submit();
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      setModalSetting("temporary");
      console.log("ERROR: ", data.error);
    }
  };

  const handleReissue = (data) => {
    if (data.status) {
      //localStorage.setItem("user", JSON.stringify(data));
      setValues({
        name: "",
        email: data.user.email,
        password: "",
        temporary: "",
        reissued: true,
        expired: false,
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

  const handleSignUp = (data) => {
    if (data.status) {
      setValues({
        name: "",
        email: data.user.email,
        password: "",
        temporary: "",
        reissued: false,
        expired: false,
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

  const handleConfirmation = (data) => {
    if (data.status) {
      // ADDED on 1/9/22
      localStorage.setItem("user", JSON.stringify(data)); // KEEP
      setValues({
        name: "",
        email: data.user.email,
        password: "",
        temporary: "",
        reissued: false,
        //expired: false,
        confirmation: "",
        resent: false,
        username: data.user.username,
        resetToken: data.user.passwordToken,
        sessionToken: "",
        userId: "",
      });
      console.log("SUCCESS");
      setModalSetting("password");
    } else {
      console.log("Inside handleConfirmation false");
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      setModalSetting("confirmation");
      console.log("ERROR: ", data.error);
    }
  };

  const handlePassword = (data) => {
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
        expired: false,
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
      setModalSetting("password");
      console.log("ERROR: ", data.error);
    }
  };

  const handleUsername = (data) => {
    console.log("Inside handleUsername");
    if (data.status) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      tempUser.user.username = data.result.username;
      localStorage.setItem("user", JSON.stringify(tempUser));
      setValues({
        name: "",
        email: "",
        password: "",
        temporary: "",
        reissued: false,
        expired: false,
        confirmation: "",
        resent: false,
        username: "",
        resetToken: "",
        sessionToken: "",
        userId: "",
      });
      console.log("You successfully hit Change now");
      closeModal(false);
      //props.submit();
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      console.log("You successfully hit Change now");
      setModalSetting("username");
      console.log("ERROR: ", data.error);
    }
  };

  const resetValues = () => {
    setValues({
      name: "",
      email: "",
      password: "",
      temporary: "",
      reissued: false,
      expired: false,
      confirmation: "",
      resent: false,
      username: "",
      resetToken: "",
      sessionToken: "",
      userId: "",
    });
  };

  const handleResend = (data) => {
    if (data.status) {
      //localStorage.setItem("user", JSON.stringify(data));
      setValues({
        name: "",
        email: data.user.email,
        password: "",
        temporary: "",
        reissued: false,
        expired: false,
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
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  const showError = () => {
    if (error) {
      return (
        <div style={{ color: "red", fontSize: "14px", paddingBottom: "20px" }}>
          {message}
        </div>
      );
    } else if (modalSetting === "signup" && expired) {
      return (
        <div style={{ color: "red", fontSize: "16px", paddingBottom: "20px" }}>
          Timer has expired, please resubmit your email:
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
          Log in
        </button>
      </div>
    </Fragment>
  );

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
          Submit email
        </button>
      </div>
    </Fragment>
  );

  const temporaryForm = (
    <Fragment>
      <div style={{ paddingBottom: "20px", width: "100%", height: "85px" }}>
        <label style={{ fontSize: "15px" }}>Confirmation Code</label>
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
          Submit confirmation code
        </button>
      </div>
    </Fragment>
  );

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
          Submit email
        </button>
      </div>
    </Fragment>
  );

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
          Submit code
        </button>
      </div>
    </Fragment>
  );

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
          Register password
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
          Change username
        </button>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.CancelButton}
          onClick={() => {
            closeModal(false);
            //props.submit();
          }}
        >
          Next
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
            closeModal();
          }}
        >
          Continue
        </button>
      </div>
    </Fragment>
  );

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
          Sign up
        </button>
      </div>
    </div>
  );

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
          Log in
        </button>
      </div>
    </div>
  );

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
          Log in
        </button>
      </div>
    </div>
  );

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

  const closeModal = (exit) => {
    resetValues();
    setSubmissionStatus({
      message: "",
      error: false,
    });
    setModalSetting(props.start);
    props.closeModal(exit);
  };

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

  const signInDisplay = () => {
    if (modalSetting === "signin") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Log in</div>
            <div style={{ textAlign: "right" }}>
              <ion-icon
                style={{
                  fontWeight: "600",
                  fontSize: "28px",
                  color: "black",
                  paddingBottom: "5px",
                }}
                name="close-outline"
                cursor="pointer"
                onClick={() => {
                  closeModal(true);
                }}
              />
            </div>
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

  const forgotDisplay = () => {
    if (modalSetting === "forgot") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Trouble logging in?</div>
            <div style={{ textAlign: "right" }}>
              <ion-icon
                style={{ fontWeight: "600", fontSize: "28px", color: "black" }}
                name="close-outline"
                cursor="pointer"
                onClick={() => {
                  closeModal(true);
                }}
              />
            </div>
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

  const temporaryDisplay = () => {
    if (modalSetting === "temporary") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Enter confirmation code</div>
            <div style={{ textAlign: "right" }}>
              <ion-icon
                style={{ fontWeight: "600", fontSize: "28px", color: "black" }}
                name="close-outline"
                cursor="pointer"
                onClick={() => {
                  closeModal(true);
                }}
              />
            </div>
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

  const signUpDisplay = () => {
    if (modalSetting === "signup") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Sign up</div>
            <div style={{ textAlign: "center" }}>
              <ion-icon
                style={{
                  fontWeight: "600",
                  fontSize: "28px",
                  color: "black",
                  paddingBottom: "5px",
                }}
                name="close-outline"
                cursor="pointer"
                onClick={() => {
                  closeModal(true);
                }}
              />
            </div>
          </div>
          <div>
            {showError()}
            {signUpForm}
            {props.start === "signin" ? alternateSignUpInputs : null}
          </div>
        </div>
      );
    } else return null;
  };

  const confirmationDisplay = () => {
    if (modalSetting === "confirmation") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Enter confirmation code</div>
            <div style={{ textAlign: "right" }}>
              <ion-icon
                style={{ fontWeight: "600", fontSize: "28px", color: "black" }}
                name="close-outline"
                cursor="pointer"
                onClick={() => {
                  closeModal(true);
                }}
              />
            </div>
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

  const passwordDisplay = () => {
    if (modalSetting === "password") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Create your password</div>
            <div style={{ textAlign: "right" }}>
              <ion-icon
                style={{ fontWeight: "600", fontSize: "28px", color: "black" }}
                name="close-outline"
                cursor="pointer"
                onClick={() => {
                  closeModal(true);
                }}
              />
            </div>
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
            <div style={{ textAlign: "right" }}>
              <ion-icon
                style={{ fontWeight: "600", fontSize: "28px", color: "black" }}
                name="close-outline"
                cursor="pointer"
                onClick={() => {
                  closeModal(true);
                }}
              />
            </div>
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
            <div style={{ textAlign: "right" }}>
              <ion-icon
                style={{ fontWeight: "600", fontSize: "28px", color: "black" }}
                name="close-outline"
                cursor="pointer"
                onClick={() => {
                  closeModal(true);
                }}
              />
            </div>
          </div>
          <div>{errorForm}</div>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <Fragment>
      <Backdrop show={props.show} clicked={props.modalClosed}></Backdrop>
      <div
        style={{
          transform: props.show ? "translateY(0)" : "translateY(-100vh)",
          opacity: props.show ? "1" : "0",
          fontSize: "20px",
        }}
        className={classes.Modal}
      >
        {spinnerDisplay()}
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
