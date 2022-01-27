import React, { useState, useEffect, Fragment } from "react";
import queryString from "query-string";

import Spinner from "../../components/UI/Spinner/SpinnerNew";

import { API } from "../../config";

import stripeImg from "../../assets/Stripe/Stripe wordmark - blurple (small).png";

import classes from "./Authentication.module.css";

const Authentication = () => {
  const [subIntent, setSubIntent] = useState();
  console.log("subIntent: ", subIntent);

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    vendorIntent: "",
    temporary: "",
    reissued: false,
    //
    confirmation: "",
    resent: false,
    username: "",
    resetToken: "",
    sessionToken: "",
    userId: "",
    accountNum: "",
  });

  // transaction status variable
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    error: false,
  });

  const [display, setDisplay] = useState("spinner"); // spinner, signin, forgot, temporary, signup, confirmation, password, username, error

  const {
    name,
    email,
    password,
    temporary,
    reissued,
    //
    confirmation,
    resent,
    username,
    resetToken,
    sessionToken,
    userId,
    accountNum,
  } = values;

  const { message, error } = submissionStatus;

  useEffect(() => {
    let startingView = queryString.parse(window.location.search).new;
    let initialView = queryString.parse(window.location.search).view;
    console.log("initialView: ", initialView);

    if (initialView === "signin") {
      console.log("going to signin");
      setDisplay("signin");
      //
    } else if (initialView === "free") {
      console.log("going to signup");
      setSubIntent("free");
      setDisplay("signup");
      console.log("subIntent: ", subIntent);
      //
    } else if (initialView === "paid") {
      console.log("going to signup");
      //assign vendor intent field to paid
      setSubIntent("paid");
      setDisplay("signup");
      console.log("subIntent: ", subIntent);
      //
    } else if (initialView === "gateway") {
      console.log("going to gateway");
      setSubIntent("paid");
      if (
        typeof window !== "undefined" &&
        localStorage.getItem(`user`) !== null
      ) {
        let tempUser = JSON.parse(localStorage.getItem("user"));
        console.log("tempUser: ", tempUser);
        if ("user" in tempUser && "token" in tempUser) {
          setValues({
            name: "",
            email: tempUser.user.email,
            password: "",
            vendorIntent: "",
            temporary: "",
            reissued: false,
            //
            confirmation: "",
            resent: false,
            username: tempUser.user.username,
            resetToken: "",
            sessionToken: tempUser.token,
            userId: tempUser.user.accountId._id,
            accountNum: tempUser.user.accountId.accountNum,
          });

          console.log("inside gtwy useEffect");
        }

        setDisplay("gateway");
      }

      setDisplay("gateway");
      //
    } else if (initialView === "stripe") {
      console.log("going to stripe");
      setDisplay("paidCongrats");
      //
    } else if (initialView === "error") {
      console.log("error");
      setDisplay("error");
      //
    } else if (!initialView) {
      if (
        typeof window !== "undefined" &&
        localStorage.getItem(`user`) !== null
      ) {
        let tempUser = JSON.parse(localStorage.getItem("user"));
        if ("user" in tempUser && "token" in tempUser) {
          window.location.href = "/myaccount";
        }
      } else {
        console.log("signin");
        setDisplay("signin");
      }
    } else {
      console.log("signin");
      setDisplay("signin");
    }
  }, []);

  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  const submitSignIn = () => {
    setDisplay("spinner");
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
        setDisplay("error");
      });
  };

  const submitForgot = () => {
    setDisplay("spinner");
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
        setDisplay("error");
      });
  };

  const submitTemporary = () => {
    setDisplay("spinner");
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
        setDisplay("error");
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
        setDisplay("error");
      });
  };

  const submitSignUp = () => {
    setDisplay("spinner");
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signup/email`;
    let information = {
      email: email,
      vendorIntent: subIntent,
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
        setDisplay("error");
      });
  };

  const submitConfirmation = () => {
    setDisplay("spinner");
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
        setDisplay("error");
      });
  };

  const submitPassword = () => {
    setDisplay("spinner");
    setSubmissionStatus({
      message: "",
      error: false,
    });
    //
    //
    //
    //
    //
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
        setDisplay("error");
      });
  };

  const submitStripe = () => {
    setDisplay("spinner");
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${sessionToken}`);
    //myHeaders.append("Access-Control-Allow-Origin", "*");
    console.log("myHeaders: ", myHeaders);

    console.log(
      "Account Number: ",
      accountNum,
      " sessionToken: ",
      sessionToken
    );

    let url = `${API}/accounts/${accountNum}/subscription/stripe/onboard1-genlink`;
    //let url = `${API}/stripetest`;
    //let url = ""

    let fetchBody = {
      method: "POST",
      headers: myHeaders,
    };
    console.log("fetching with: ", url, fetchBody);

    fetch(url, fetchBody)
      .then((res) => res.json())
      .then((response) => {
        console.log("made it inside the .then");
        window.location.href = response.url;
      })
      .catch(function (err) {
        console.info(err + " url: " + url);
      });
    /*
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        //handleUsername(data);
      })
      .catch((error) => {
        console.log("freeTicketHandler() error.message: ", error.message);
        setSubmissionStatus({
          message: "Server is down, please try later",
          error: true,
        });
        setDisplay("error");
      });
      */
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
        setDisplay("error");
      });
  };

  const handleSignIn = (data) => {
    if (data.status) {
      localStorage.setItem("user", JSON.stringify(data)); // KEEP
      setValues({
        name: "",
        email: "",
        password: "",
        vendorIntent: "",
        temporary: "",
        reissued: false,
        //
        confirmation: "",
        resent: false,
        username: "",
        resetToken: "",
        sessionToken: "",
        userId: "",
        accountNum: "",
      });
      redirectUser();
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      setDisplay("signin");
      console.log("ERROR: ", data.error);
    }
  };

  const handleForgot = (data) => {
    if (data.status) {
      setValues({
        name: "",
        email: data.user.email,
        password: "",
        vendorIntent: "",
        temporary: "",
        reissued: false,
        //
        confirmation: "",
        resent: false,
        username: "",
        resetToken: "",
        sessionToken: "",
        userId: "",
        accountNum: "",
      });
      setDisplay("temporary");
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      setDisplay("forgot");
      console.log("ERROR: ", data.error);
    }
  };

  const handleTemporary = (data) => {
    if (data.status) {
      localStorage.setItem("user", JSON.stringify(data)); // KEEP
      setValues({
        name: "",
        email: "",
        password: "",
        vendorIntent: "",
        temporary: "",
        reissued: false,
        //
        confirmation: "",
        resent: false,
        username: "",
        resetToken: "",
        sessionToken: "",
        userId: "",
        accountNum: "",
      });
      redirectUser();
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      setDisplay("temporary");
      console.log("ERROR: ", data.error);
    }
  };

  const handleReissue = (data) => {
    if (data.status) {
      //
      setValues({
        name: "",
        email: data.user.email,
        password: "",
        vendorIntent: "",
        temporary: "",
        reissued: true,
        //
        confirmation: "",
        resent: false,
        username: "",
        resetToken: "",
        sessionToken: "",
        userId: "",
        accountNum: "",
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
    console.log("data: ", data);
    console.log("data.status: ", data.status);
    if (data.status) {
      console.log("inside true handleSignUp");
      setValues({
        name: "",
        email: data.user.email,
        password: "",
        // need to capture vendotIntent field from server response object
        vendorIntent: subIntent,
        temporary: "",
        reissued: false,
        //
        confirmation: "",
        resent: false,
        username: data.user.username,
        resetToken: "",
        sessionToken: "",
        userId: "",
        accountNum: "",
      });
      console.log("inside true handleSignUp");
      console.log("SUCCESS");
      setDisplay("confirmation");
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      setDisplay("signup");
      console.log("ERROR: ", data.error);
    }
  };

  const handleConfirmation = (data) => {
    console.log("data: ", data);
    if (data.status) {
      //
      localStorage.setItem("user", JSON.stringify(data)); // KEEP
      setValues({
        name: "",
        email: data.user.email,
        password: "",
        // need to capture vendotIntent field from server response object
        vendorIntent: subIntent,
        temporary: "",
        reissued: false,
        //
        confirmation: "",
        resent: false,
        username: data.user.username,
        resetToken: data.user.passwordToken,
        sessionToken: "",
        userId: data.user.accountId._id,
        accountNum: data.user.accountId.accountNum,
      });
      console.log("SUCCESS");
      setDisplay("password");
    } else {
      console.log("Inside handleConfirmation false");
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      setDisplay("confirmation");
      console.log("ERROR: ", data.error);
    }
  };

  const handlePassword = (data) => {
    console.log("data: ", data);
    console.log("STATUS: ", data.status);
    if (data.status) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      console.log("user from local storage: ", tempUser);
      tempUser.token = data.token;
      localStorage.setItem("user", JSON.stringify(tempUser));
      setValues({
        name: "",
        email: email,
        password: "",
        vendorIntent: "",
        temporary: "",
        reissued: false,
        //
        confirmation: "",
        resent: false,
        username: username,
        resetToken: "",
        sessionToken: data.token,
        userId: userId,
        accountNum: accountNum,
      });
      console.log("SUCCESS");
      if (subIntent === "paid") {
        setDisplay("gateway");
      } else if (subIntent === "free") {
        setDisplay("freeCongrats");
        console.log("CONGRATULATIONS");
      }
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      setDisplay("password");
      console.log("ERROR: ", data.error);
    }
  };

  const handleUsername = (data) => {
    //
    if (data.status) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      tempUser.user.username = data.result.username;
      localStorage.setItem("user", JSON.stringify(tempUser));
      setValues({
        name: "",
        email: "",
        password: "",
        vendorIntent: "",
        temporary: "",
        reissued: false,
        //
        confirmation: "",
        resent: false,
        username: "",
        resetToken: "",
        sessionToken: "",
        userId: "",
        accountNum: "",
      });
      redirectUser();
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      setDisplay("username");
      console.log("ERROR: ", data.error);
    }
  };

  const resetValues = () => {
    setValues({
      name: "",
      email: "",
      password: "",
      vendorIntent: "",
      temporary: "",
      reissued: false,
      //
      confirmation: "",
      resent: false,
      username: "",
      resetToken: "",
      sessionToken: "",
      userId: "",
      accountNum: "",
    });
  };

  const handleResend = (data) => {
    if (data.status) {
      //
      setValues({
        name: "",
        email: data.user.email,
        password: "",
        vendorIntent: "",
        temporary: "",
        reissued: false,
        //
        confirmation: "",
        resent: true,
        username: username,
        resetToken: "",
        sessionToken: "",
        userId: "",
        accountNum: "",
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

  const redirectUser = () => {
    console.log("Redirect user");
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("user") !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      if ("token" in tempUser && "user" in tempUser) {
        window.location.href = "/myaccount";
      } else {
        setSubmissionStatus({
          message: "Server error please try again",
          error: true,
        });
        setDisplay("error");
      }
    } else {
      setSubmissionStatus({
        message: "Server error please try again",
        error: true,
      });
      setDisplay("error");
    }
  };

  const showDetail = () => {
    if (error) {
      return (
        <div style={{ color: "red", fontSize: "14px", paddingBottom: "20px" }}>
          {message}
        </div>
      );
      //
      //
      //
      //
      //
      //
    } else if (
      display === "signin" ||
      display === "forgot" ||
      display === "signup" ||
      display === "password"
    ) {
      return null;
    } else if (display === "temporary" && !reissued) {
      console.log("values: ", values);
      return (
        <Fragment>
          <div style={{ fontSize: "16px", paddingBottom: "10px" }}>
            Enter the 6-digit code sent to:
          </div>
          <div style={{ fontSize: "16px", paddingBottom: "20px" }}>{email}</div>
        </Fragment>
      );
    } else if (display === "temporary" && reissued) {
      console.log("values: ", values);
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          Confirmation code resent to your email.
        </div>
      );
    } else if (display === "confirmation" && !resent) {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          Enter the 6-digit code sent to your email:
        </div>
      );
    } else if (display === "confirmation" && resent) {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          A new 6-digit code was sent to your email,
          <br></br>
          please enter it below:
        </div>
      );
    } else if (display === "gateway") {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          The payment gateway determines how you will instantly receive revenues
          from ticket sales.
        </div>
      );
    } else if (display === "freeCongrats") {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          You have successfully signed up for a free account.
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
          SIGN IN TO YOUR ACCOUNT
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
          SUBMIT YOUR EMAIL
        </button>
      </div>
    </Fragment>
  );

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

  const gatewayForm = (
    <Fragment>
      <div style={{ paddingTop: "10px", paddingBottom: "10px" }}>
        <button
          style={{
            background: "white",
            width: "160",
            border: "none",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <img
            src={stripeImg}
            alt="STRIPE"
            width="160"
            height="120"
            cursor="pointer"
            onClick={() => {
              console.log("selecting Stripe");
              submitStripe();
            }}
          ></img>
        </button>
        <button
          style={{
            background: "white",
            width: "160",
            border: "none",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <img
            src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
            alt="PAYPAL"
            width="160"
            height="120"
            cursor="pointer"
            onClick={() => {
              console.log("selecting PayPal");
              setDisplay("paypal");
            }}
          ></img>
        </button>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.CancelButton}
          onClick={() => {
            redirectUser();
          }}
        >
          STAY WITH COMMUNITY ACCOUNT
        </button>
      </div>
    </Fragment>
  );

  const freeCongratsForm = (
    <Fragment>
      <div style={{ paddingTop: "10px", paddingBottom: "10px" }}></div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.CancelButton}
          onClick={() => {
            setDisplay("gateway");
          }}
        >
          I WANT TO UPGRADE MY ACCOUNT
        </button>
        <button
          className={classes.CancelButton}
          onClick={() => {
            window.location.href = "/myaccount";
          }}
        >
          GO TO MY DASHBOARD
        </button>
      </div>
    </Fragment>
  );

  const paidCongratsForm = (
    <Fragment>
      <div style={{ paddingTop: "10px", paddingBottom: "10px" }}></div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.CancelButton}
          onClick={() => {
            window.location.href = "/myaccount";
          }}
        >
          GO TO MY DASHBOARD
        </button>
      </div>
    </Fragment>
  );

  const paypalForm = (
    <Fragment>
      <div style={{ paddingTop: "10px", paddingBottom: "10px" }}></div>

      <div style={{ paddingBottom: "20px", width: "700px", height: "85px" }}>
        <label style={{ width: "700px", fontSize: "15px" }}>
          Paypal Client ID <span style={{ color: "red" }}>* </span>
        </label>
        <input
          onFocus={() => {
            setValues({ ...values, inputError: "" });
          }}
          style={{
            border: "1px solid #8DADD4",
            borderRadius: "0px",
            backgroundColor: "#EFF3FA",
            width: "700px",
            height: "40px",
            paddingLeft: "10px",
          }}
          type="text"
          name="paypalExpress_client_id"
          onChange={handleChange}
          //value={paypalExpress_client_id}
        />
      </div>
      <div>
        <label style={{ width: "700px", fontSize: "15px" }}>
          Paypal Secret <span style={{ color: "red" }}>* </span>
        </label>
        <input
          onFocus={() => {
            setValues({ ...values, inputError: "" });
          }}
          style={{
            border: "1px solid #8DADD4",
            borderRadius: "0px",
            backgroundColor: "#EFF3FA",
            width: "700px",
            height: "40px",
            paddingLeft: "10px",
          }}
          type="text"
          name="paypalExpress_client_secret"
          onChange={handleChange}
          //value={paypalExpress_client_secret}
        />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.CancelButton}
          onClick={() => {
            setDisplay("paidCongrats");
          }}
        >
          SUBMIT PAYPAL INFORMATION
        </button>
      </div>
    </Fragment>
  );

  const detailsForm = (
    <Fragment>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.CancelButton}
          onClick={() => {
            setDisplay("gateway");
            //redirectUser();
          }}
        >
          CONTINUE
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
            window.location.href = "/";
          }}
        >
          CONTINUE
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
            setDisplay("forgot");
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
            setDisplay("signup");
          }}
        >
          Create account
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
            setDisplay("signin");
          }}
        >
          Sign In
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
            setDisplay("signin");
          }}
        >
          Sign In
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
  const spinnerDisplay = () => {
    if (display === "spinner") {
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
    if (display === "signin") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Welcome back</div>
          </div>
          <div>
            {showDetail()}
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
    if (display === "forgot") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Trouble logging in?</div>
          </div>
          <div>
            {showDetail()}
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
    if (display === "temporary") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Enter confirmation code</div>
          </div>
          <div>
            {showDetail()}
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
    if (display === "signup") {
      console.log("inside signup display");
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Tell us about yourself</div>
          </div>
          <div>
            {showDetail()}
            {signUpForm}
            {alternateSignUpInputs}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const confirmationDisplay = () => {
    if (display === "confirmation") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Enter confirmation code</div>
          </div>
          <div>
            {showDetail()}
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
    if (display === "password") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Create your password</div>
          </div>
          <div>
            {showDetail()}
            {passwordForm}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const gatewayDisplay = () => {
    if (display === "gateway") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Select a Payment Gateway</div>
          </div>
          <div>
            {showDetail()}
            {gatewayForm}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const freeCongratsDisplay = () => {
    if (display === "freeCongrats") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Success you know have a free account</div>
          </div>
          <div>
            {showDetail()}
            {freeCongratsForm}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const paidCongratsDisplay = () => {
    if (display === "paidCongrats") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Success you know have a paid account</div>
          </div>
          <div>
            {showDetail()}
            {paidCongratsForm}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const paypalDisplay = () => {
    if (display === "paypal") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            Please provide the ClientId and Secret from your PayPal merchant
            account.
          </div>
          <div>
            {showDetail()}
            {paypalForm}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const subDetailsDisplay = () => {
    if (display === "details") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Pro-Plan details</div>
          </div>
          <div>
            {/*showDetail()*/}
            {detailsForm}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const errorDisplay = () => {
    if (display === "error") {
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
        {spinnerDisplay()}
        {signInDisplay()}
        {forgotDisplay()}
        {temporaryDisplay()}
        {signUpDisplay()}
        {confirmationDisplay()}
        {passwordDisplay()}
        {gatewayDisplay()}
        {paypalDisplay()}
        {subDetailsDisplay()}
        {freeCongratsDisplay()}
        {paidCongratsDisplay()}
        {errorDisplay()}
      </div>
    </div>
  );
};

export default Authentication;
