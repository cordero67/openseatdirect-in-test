import React, { useState, useEffect, Fragment } from "react";

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
    vendorIntent: props.vendorIntent,
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
    vendorIntent,
    resetToken,
    sessionToken,
    userId,
  } = values;

  const { message, error } = submissionStatus;

  const getStatus = () => {
    let tempData = JSON.parse(localStorage.getItem("user"));
    if ("user" in tempData && "accountId" in tempData.user) {
      let tempAccountId = tempData.user.accountId;
      let hasLinkIds = false;
      let hasPaid = false;
      if (tempAccountId.ticketPlan === "free") {
        return 7;
      }
      if (tempAccountId.ticketPlan === "comp") {
        hasPaid = true;
      }
      if (
        "paymentGatewayType" in tempAccountId &&
        tempAccountId.paymentGatewayType === "PayPalExpress" &&
        "paypalExpress_client_id" in tempAccountId &&
        "string" === typeof tempAccountId.paypalExpress_client_id
      ) {
        hasLinkIds = true;
      }
      if (
        "paymentGatewayType" in tempAccountId &&
        tempAccountId.paymentGatewayType === "PayPalMarketplace" &&
        "paypal_merchant_id" in tempAccountId &&
        "string" === typeof tempAccountId.paypal_merchant_id
      ) {
        hasLinkIds = true;
      }
      if (
        "paypal_plan_id" in tempAccountId &&
        "string" === typeof tempAccountId.paypal_plan_id &&
        "accountPaymentStatus" in tempAccountId &&
        tempAccountId.accountPaymentStatus === "good"
      ) {
        hasPaid = true;
      }
      if (!hasPaid && !hasLinkIds) {
        return 4;
      }
      if (!hasPaid && hasLinkIds) {
        return 5;
      }
      if (hasPaid && !hasLinkIds) {
        return 6;
      }
      if (hasPaid && hasLinkIds) {
        return 8;
      }
      return 4;
    } else {
      return 0;
    }
  };

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      if (getStatus(tempUser.user) === 7 || getStatus(tempUser.user) === 8) {
        window.location.href = "/vendor";
      } else if (
        getStatus(tempUser.user) === 4 ||
        getStatus(tempUser.user) === 5 ||
        getStatus(tempUser.user) === 6 ||
        ("vendorIntent" in tempUser.user && tempUser.user.vendorIntent === true)
      ) {
        window.location.href = "/personal";
      } else {
        window.location.href = "/events";
      }
    }
  }, []);

  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  // LOOKS GOOD
  const submitSignIn = () => {
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signin_email`;
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
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // PROD HAS DIFFERENT API: `${API}/auth/send_access_code2`
    let url = `${API}/auth/send_access_code2`;
    //let url = `${API}/auth​/signin​/sendcode`;
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
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // PROD HAS DIFFERENT API: `${API}/auth/confirm_access_code2`
    let url = `${API}/auth/confirm_access_code2`;
    //let url = `${API}/auth/signin/confirmcode`;
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
    // PROD HAS DIFFERENT API: `${API}/auth/send_access_code2`
    let url = `${API}/auth/send_access_code2`;
    //let url = `${API}/auth/signin/sendcode`;
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
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // PROD HAS DIFFERENT API: `${API}/auth/signup1_email`
    let url = `${API}/auth/signup1_email`;
    //let url = `${API}/auth/signup/email`;
    let information = {
      email: email,
      vendorIntent: props.vendorIntent,
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
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // PROD HAS DIFFERENT API: `${API}/auth/signup2_confirm`
    let url = `${API}/auth/signup2_confirm`;
    //let url = `${API}/auth​/signup​/confirmcode`;
    let information = {
      email: email,
      confirm_code: confirmation,
      vendorIntent: props.vendorIntent,
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
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // PROD HAS DIFFERENT API: `${API}/auth/signup3_password`
    let url = `${API}/auth/signup3_password`;
    //let url = `${API}/auth/signup/password`;
    let information = {
      email: email,
      resetPasswordToken: resetToken,
      password: password,
      vendorIntent: props.vendorIntent,
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

  // LOOKS GOOD
  const submitUsername = () => {
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${sessionToken}`);
    // PROD HAS DIFFERENT API: `${API}/auth/update_username/${userId}`
    let url = `${API}/auth/update_username/${userId}`;
    //let url = `${API}/user/${userId}`;
    let information = {
      email: email,
      username: username,
    };
    console.log("myHeaders: ", myHeaders);
    let fetchBody = {
      method: "PATCH",
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
  // LOOKS GOOD
  const submitResend = () => {
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // PROD HAS DIFFERENT API: `${API}/auth/resend_confirm_code`
    let url = `${API}/auth/resend_confirm_code`;
    //let url = `${API}/auth/signup/resendcode`;
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
        vendorIntent: props.vendorIntent,
        resetToken: "",
        sessionToken: "",
        userId: "",
      });
      console.log("SUCCESS");
      props.submit();
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
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
        expired: false,
        confirmation: "",
        resent: false,
        username: "",
        vendorIntent: props.vendorIntent,
        resetToken: "",
        sessionToken: "",
        userId: "",
      });
      console.log("SUCCESS");
      setModalSetting("temporary");
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      console.log("ERROR: ", data.error);
    }
  };

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
        expired: false,
        confirmation: "",
        resent: false,
        username: "",
        vendorIntent: props.vendorIntent,
        resetToken: "",
        sessionToken: "",
        userId: "",
      });
      console.log("SUCCESS");
      props.submit();
    } else {
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      console.log("ERROR: ", data.error);
    }
  };

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
        expired: false,
        confirmation: "",
        resent: false,
        username: "",
        vendorIntent: props.vendorIntent,
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

  // LOOKS GOOD
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
        vendorIntent: data.user.vendorIntent,
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
      console.log("ERROR: ", data.error);
    }
  };
  // LOOKS GOOD
  const handleConfirmation = (data) => {
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
        vendorIntent: data.user.vendorIntent,
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
      console.log("ERROR: ", data.error);
    }
  };

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
        expired: false,
        confirmation: "",
        resent: false,
        username: data.user.username,
        vendorIntent: data.user.vendorIntent,
        resetToken: "",
        sessionToken: data.token,
        userId: data.user._id,
      });
      console.log("SUCCESS");
      setModalSetting("username");
    } else {
      if (data.code === 1401) {
        console.log("Status 1401 Error");
        let tempValues = { ...values };
        tempValues.email = "";
        tempValues.expired = true;
        setValues(tempValues);
        setModalSetting("signup");
      } else {
        setSubmissionStatus({
          message: data.error,
          error: true,
        });
        console.log("ERROR: ", data.error);
      }
    }
  };

  // LOOKS GOOD
  const handleUsername = (data) => {
    console.log("Inside handleUsername");
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
        expired: false,
        confirmation: "",
        resent: false,
        username: "",
        vendorIntent: props.vendorIntent,
        resetToken: "",
        sessionToken: "",
        userId: "",
      });
      console.log("SUCCESS");
      props.submit();
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
      expired: false,
      confirmation: "",
      resent: false,
      username: "",
      vendorIntent: props.vendorIntent,
      resetToken: "",
      sessionToken: "",
      userId: "",
    });
  };

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
        expired: false,
        confirmation: "",
        resent: true,
        username: data.user.username,
        vendorIntent: props.vendorIntent,
        resetToken: data.user.resetPasswordToken,
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

  // LOOKS GOOD
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  // LOOKS GOOD
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
      console.log("modalSetting === 'temporary' && !reissued");
      console.log("values: ", values);
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          Enter the 6-digit code sent to:
          <br></br>
          {email}
        </div>
      );
    } else if (modalSetting === "temporary" && reissued) {
      console.log("modalSetting === 'temporary' && reissued");
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

  // LOOKS GOOD
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
            props.submit();
          }}
        >
          CHANGE IT LATER
        </button>
      </div>
    </Fragment>
  );
  // LOOKS GOOD
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
  const closeModal = () => {
    resetValues();
    setSubmissionStatus({
      message: "",
      error: false,
    });
    setModalSetting(props.start);
    props.closeModal();
  };

  // LOOKS GOOD
  const signInDisplay = () => {
    if (modalSetting === "signin") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Welcome back</div>
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
                  closeModal();
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

  // LOOKS GOOD
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
                  closeModal();
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

  // LOOKS GOOD
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
                  closeModal();
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

  // LOOKS GOOD
  const signUpDisplay = () => {
    if (modalSetting === "signup") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Tell us about yourself</div>
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
                  closeModal();
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

  // LOOKS GOOD
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
                  closeModal();
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

  // LOOKS GOOD
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
                  closeModal();
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
  // LOOKS GOOD
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
                  closeModal();
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

  // LOOKS GOOD
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
                  closeModal();
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

  // LOOKS GOOD
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
