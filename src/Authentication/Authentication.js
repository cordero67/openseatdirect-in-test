import React, { useState, useEffect, Fragment } from "react";
import queryString from "query-string";

import SignInDisplay from "./Components/SignInDisplay";
import ForgotDisplay from "./Components/ForgotDisplay";
import TemporaryDisplay from "./Components/TemporaryDisplay";
import SignUpDisplay from "./Components/SignUpDisplay";
import ConfirmationDisplay from "./Components/ConfirmationDisplay";
import PasswordDisplay from "./Components/PasswordDisplay";
import PaypalDisplay from "./Components/PaypalDisplay";
import OpennodeDisplay from "./Components/OpennodeDisplay";
import SubscriptionDisplay from "./Components/SubscriptionDisplay";

import Spinner from "../components/UI/Spinner/SpinnerNew";
import { getStatus } from "../Resources/Utils";

import { API, PAYPAL_USE_SANDBOX, OPENNODE_USE_TEST } from "../config";

import stripeImg from "../assets/Stripe/Stripe wordmark - blurple (small).png";
import payPalImg from "../assets/PayPal/PayPal.PNG";
import opennodeImg from "../assets/Opennode/opennodeBtc.png";

import classes from "./Authentication.module.css";

const Authentication = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [initialView, setInitialView] = useState(
    queryString.parse(window.location.search).view
  );

  const [authValues, setAuthValues] = useState({
    email: "",
    password: "",
    temporary: "",
    reissued: false,
    confirmation: "",
    resent: false,
    resetToken: "",
    sessionToken: "",
    accountNum: "",
  });

  const {
    email,
    password,
    temporary,
    reissued,
    confirmation,
    resent,
    resetToken,
    sessionToken,
    accountNum,
  } = authValues;

  // UPDATE WHEN A NEW PAYPAL PLAN IS INTRODUCED
  const [subValues, setSubValues] = useState({
    inputError: "",
    paypalExpress_client_id: "", // vendor's clientID not OSD's
    paypalExpress_client_secret: "", // vendor's secret not OSD's
    opennode_invoice_API_KEY: "", // vendors opennode api key
    opennode_auto_settle: "", // vendors request convesion to USD or keep in BTC?
    opennode_dev: "", // Boolean: dev=true for testnet BTC
  });

  const {
    inputError,
    paypalExpress_client_id,
    paypalExpress_client_secret,
    opennode_invoice_API_KEY,
    opennode_auto_settle,
    opennode_dev,
  } = subValues;

  // transaction status variable
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    error: false,
    redirect: "",
  });

  const { message, error, redirect } = submissionStatus;
  const [display, setDisplay] = useState("spinner"); // spinner, signin, forgot, temporary, signup, confirmation, password, error

  // edit so that it is driven by the "status" value
  const updateSubValues = () => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("user") !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      if ("user" in tempUser && "accountId" in tempUser.user) {
        let tempBuyerInfo = {};
        // populates the "tempBuyerInfo" (and "values") object with "user" object info
        if (tempUser.user.accountId?.status) {
          tempBuyerInfo.status = tempUser.user.accountId.status;
        }
        if (tempUser.user.accountId?.paypalExpress_client_id) {
          tempBuyerInfo.paypalExpress_client_id =
            tempUser.user.accountId.paypalExpress_client_id;
        }
        if (tempUser.user.accountId?.paypalExpress_client_secret) {
          tempBuyerInfo.paypalExpress_client_secret =
            tempUser.user.accountId.paypalExpress_client_secret;
        }
        if (tempUser.user.accountId?.opennode_invoice_API_KEY) {
          tempBuyerInfo.opennode_invoice_API_KEY =
            tempUser.user.accountId.opennode_invoice_API_KEY;
        }
        if (tempUser.user.accountId?.opennode_auto_settle) {
          tempBuyerInfo.opennode_auto_settle =
            tempUser.user.accountId.opennode_auto_settle;
        }
        if (tempUser.user.accountId?.opennode_dev) {
          tempBuyerInfo.opennode_auto_settle =
            tempUser.user.accountId.opennode_dev;
        }
        if (OPENNODE_USE_TEST === true) {
          tempBuyerInfo.opennode_dev = true;
        } else {
          tempBuyerInfo.opennode_dev = false;
        }
        tempBuyerInfo.opennode_auto_settle = true;

        setSubValues(tempBuyerInfo);
        console.log("tempBuyerInfo: ", tempBuyerInfo);
      }
    } else {
      console.log("no user object");
    }
  };

  const updateAuthValues = () => {
    let tempUser = JSON.parse(localStorage.getItem("user"));
    localStorage.setItem("user", JSON.stringify(tempUser));
    setAuthValues({
      name: "", //
      email: tempUser.user.email, //
      password: "", //
      temporary: "", //
      reissued: false, //
      expired: false, //
      confirmation: "", //
      resent: false, //
      resetToken: tempUser.user.passwordToken, //
      sessionToken: tempUser.token,
      accountNum: tempUser.user.accountId.accountNum, //
    });
  };

  useEffect(() => {
    console.log("initialView: ", initialView);
    let view = queryString.parse(window.location.search).view;
    console.log("view: ", view);
    setInitialView(view);
    let fullUser = false;

    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      console.log("tempUser: ", tempUser);
      let status = getStatus();
      console.log("getStatus: ", getStatus());
      if ("user" in tempUser && "token" in tempUser) {
        fullUser = true;
        console.log("We have a fullUser");
      }
      if (status === 8) {
        window.location.href = "/myaccount";
      } else if (initialView === "upgrade") {
        console.log("initialView: ", initialView, ", upgrade");
        updateSubValues();
        if ((status === 1 || status === 4 || status === 6) && fullUser) {
          updateAuthValues();
          setDisplay("gateway");
        } else if (status === 5 && fullUser) {
          updateAuthValues();
          setDisplay("subscription");
        } else if (
          "user" in tempUser &&
          "passwordToken" in tempUser.user &&
          !("token" in tempUser)
        ) {
          updateAuthValues();
          setDisplay("password");
        } else {
          console.log("going to signin");
          setDisplay("signin");
        }
      } else if (initialView === "free") {
        console.log("initialView: ", initialView, ", free");
        updateSubValues();
        if ((status === 1 || status === 4 || status === 6) && fullUser) {
          updateAuthValues();
          setDisplay("gateway");
        } else if (status === 5 && fullUser) {
          updateAuthValues();
          setDisplay("subscription");
        } else if (
          "user" in tempUser &&
          "passwordToken" in tempUser.user &&
          !("token" in tempUser)
        ) {
          updateAuthValues();
          setDisplay("password");
        } else {
          setDisplay("signup");
        }
      } else if (initialView === "paid") {
        console.log("initialView: ", initialView, ", paid");
        updateSubValues();
        if ((status === 1 || status === 4 || status === 6) && fullUser) {
          updateAuthValues();
          setDisplay("gateway");
        } else if (status === 5 && fullUser) {
          updateAuthValues();
          setDisplay("subscription");
        } else if (
          "user" in tempUser &&
          "passwordToken" in tempUser.user &&
          !("token" in tempUser)
        ) {
          updateAuthValues();
          setDisplay("password");
        } else {
          setDisplay("signup");
        }
      } else {
        console.log("initialView: ", initialView, ", NONE");
        updateSubValues();
        if ((status === 1 || status === 4 || status === 6) && fullUser) {
          updateAuthValues();
          setDisplay("gateway");
        } else if (status === 5 && fullUser) {
          updateAuthValues();
          setDisplay("subscription");
        } else if (
          "user" in tempUser &&
          "passwordToken" in tempUser.user &&
          !("token" in tempUser)
        ) {
          updateAuthValues();
          setDisplay("password");
        } else {
          console.log("going to signin");
          setDisplay("signin");
        }
      }
    } else {
      if (initialView === "paid" || initialView === "free") {
        console.log("going to signup");
        setDisplay("signup");
      } else {
        console.log("going to signin");
        setDisplay("signin");
      }
    }
  }, []);

  const radioChangeSubValues = (event, value, name) => {
    let tempSubValues = { ...subValues };
    tempSubValues[name] = value.value;
    setSubValues(tempSubValues);
  };

  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  const submitStripe = () => {
    setShowSpinner(true);
    setSubmissionStatus({
      message: "",
      error: false,
      redirect: "",
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${sessionToken}`);
    console.log("myHeaders: ", myHeaders);

    console.log(
      "Account Number: ",
      accountNum,
      " sessionToken: ",
      sessionToken
    );

    console.log("authValues: ", authValues);

    let url = `${API}/accounts/${accountNum}/subscription/stripe/onboard1-genlink`;
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
    };
    console.log("fetching with: ", url, fetchBody);

    fetch(url, fetchBody)
      .then(handleErrors)
      .then((res) => res.json())
      .then((response) => {
        console.log("made it inside the .then");
        window.location.href = response.url;
      })
      .catch(function (err) {
        console.info(err + " url: " + url);
        setSubmissionStatus({
          message: "Stripe connection is down, please try later",
          error: true,
          redirect: "gateway",
        });
        setDisplay("error");
        setShowSpinner(false);
      })
      .finally(() => {});
  };

  const resetValues = () => {
    setAuthValues({
      email: "",
      password: "",
      temporary: "",
      reissued: false,
      confirmation: "",
      resent: false,
      resetToken: "",
      sessionToken: "",
      accountNum: "",
    });
  };

  const handleAuthValueChange = (event) => {
    setAuthValues({
      ...authValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubValueChange = (event) => {
    setSubValues({
      ...subValues,
      [event.target.name]: event.target.value,
    });
  };

  const redirectUser = () => {
    console.log("Redirect user");
    let status = getStatus();
    if (status === 8) {
      console.log("going to myaccount");
      window.location.href = "/myaccount";
    } else if (
      (status === 1 || status === 4 || status === 5 || status === 6) &&
      initialView === "free"
    ) {
      console.log("going to free congrats");
      setDisplay("freeCongrats");
      setShowSpinner(false);
    } else if (
      (status === 1 || status === 4 || status === 6) &&
      (initialView === "upgrade" || initialView === "paid")
    ) {
      console.log("going to gateway");
      setDisplay("gateway");
      setShowSpinner(false);
    } else if (
      status === 5 &&
      (initialView === "upgrade" || initialView === "paid")
    ) {
      console.log("going to subscription");
      setDisplay("subscription");
      setShowSpinner(false);
    } else if (status === 1 || status === 4 || status === 5 || status === 6) {
      console.log("going to myaccount");
      window.location.href = "/myaccount";
    } else {
      setSubmissionStatus({
        message: "Server error please try again",
        error: true,
        redirect: display,
      });
      console.log("error");
      setDisplay("error");
      setShowSpinner(false);
    }
  };

  const showDetail = () => {
    if (error) {
      return (
        <div
          style={{
            color: "red",
            fontSize: "14px",
            lineHeight: "25px",
            paddingBottom: "20px",
          }}
        >
          {message}
        </div>
      );
    } else if (display === "gateway") {
      return (
        <div
          style={{
            fontSize: "16px",
            liineHeight: "25px",
            paddingBottom: "20px",
          }}
        >
          Link to Stripe or Paypal to get paid instantly in cash, or Opennode
          for bitcoin payments.
        </div>
      );
    } else if (display === "freeCongrats") {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          <div>You now have a Free Forever Plan!</div>
          <div style={{ lineHeight: "25px" }}>
            You can issue an unlimited amount of free tickets.
          </div>
          <div>
            More details on this plan{" "}
            <a
              href="https://www.openseatdirect.com/#pricing-plans"
              target="blank"
              rel="noreferrer"
            >
              here
            </a>
            .
          </div>
        </div>
      );
    } else if (display === "paidCongrats") {
      return (
        <div style={{ fontSize: "16px", paddingBottom: "20px" }}>
          <div>You now have a Pro Plan!</div>
          <div style={{ lineHeight: "25px" }}>
            You can issue an unlimited amount of free tickets.
          </div>
          <div>
            More details on this plan{" "}
            <a
              href="https://www.openseatdirect.com/#pricing-plans"
              target="blank"
              rel="noreferrer"
            >
              here
            </a>
            .
          </div>
        </div>
      );
    }
  };

  const gatewayForm = (
    <Fragment>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "165px 165px",
          columnGap: "10px",
          paddingTop: "10px",
          paddingBottom: "10px",
        }}
      >
        <button
          style={{
            background: "white",
            width: "160",
            border: "1px solid lightgrey",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <img
            src={stripeImg}
            alt="STRIPE"
            width="140px"
            height="auto"
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
            border: "1px solid lightgrey",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <img
            src={payPalImg}
            alt="PAYPAL"
            width="140px"
            height="auto"
            cursor="pointer"
            onClick={() => {
              console.log("selecting PayPal");
              setDisplay("paypal");
            }}
          ></img>
        </button>
      </div>

      <div
        style={{
          width: "165px",
          textAlign: "center",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "89px",
        }}
      >
        <button
          style={{
            background: "white",
            width: "160",
            border: "1px solid lightgrey",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <img
            src={opennodeImg}
            alt="OPENNODE"
            width="150px"
            height="auto"
            cursor="pointer"
            onClick={() => {
              console.log("selecting Opennode");
              setDisplay("opennode");
            }}
          ></img>
        </button>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.ButtonGrey}
          onClick={() => {
            if (initialView === "upgrade") {
              window.close();
            } else {
              redirectUser();
            }
          }}
        >
          STAY WITH FREE FOREVER PLAN
        </button>
      </div>
    </Fragment>
  );

  const freeCongratsForm = (
    <Fragment>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.ButtonBlue}
          onClick={() => {
            setDisplay("gateway");
          }}
        >
          UPGRADE TO A PRO PLAN
        </button>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.ButtonGrey}
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
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.ButtonGrey}
          onClick={() => {
            window.location.href = "/myaccount";
          }}
        >
          GO TO MY DASHBOARD
        </button>
      </div>
    </Fragment>
  );

  const errorForm = () => {
    return (
      <Fragment>
        <div style={{ paddingTop: "10px" }}>
          <button
            className={classes.ButtonBlue}
            onClick={() => {
              console.log("redirect: ", redirect);
              let newDisplay = redirect;
              setSubmissionStatus({
                message: "",
                error: false,
                redirect: "",
              });
              setDisplay(newDisplay);
            }}
          >
            TRY AGAIN NOW
          </button>
        </div>
        <div style={{ paddingTop: "10px" }}>
          <button
            className={classes.ButtonGrey}
            onClick={() => {
              window.location.href = "/myaccount";
            }}
          >
            TRY AGAIN LATER
          </button>
        </div>
      </Fragment>
    );
  };

  const signInDisplay = () => {
    if (display === "signin") {
      return (
        <SignInDisplay
          authOrigin={true}
          //close={closeModal} NOT IN AUTH
          email={email}
          password={password}
          message={message}
          //expired={expired} NOT IN AUTH
          error={error}
          spinner={showSpinner}
          inputChange={handleAuthValueChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(display) => setDisplay(display)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          values={(input) => setAuthValues(input)}
          resetValues={() => resetValues()}
          submit={() => redirectUser()}
        ></SignInDisplay>
      );
    } else {
      return null;
    }
  };

  const forgotDisplay = () => {
    if (display === "forgot") {
      return (
        <ForgotDisplay
          authOrigin={true}
          //close={closeModal} NOT IN AUTH
          email={email}
          message={message}
          //expired={expired} NOT IN AUTH
          error={error}
          spinner={showSpinner}
          inputChange={handleAuthValueChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(display) => setDisplay(display)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          values={(input) => setAuthValues(input)}
          resetValues={() => resetValues()}
        ></ForgotDisplay>
      );
    } else {
      return null;
    }
  };

  const temporaryDisplay = () => {
    if (display === "temporary") {
      return (
        <TemporaryDisplay
          authOrigin={true}
          //close={closeModal} NOT IN AUTH
          email={email}
          message={message}
          reissued={reissued}
          temporary={temporary}
          error={error}
          spinner={showSpinner}
          inputChange={handleAuthValueChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setDisplay(modal)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          values={(input) => setAuthValues(input)}
          resetValues={() => resetValues()}
          submit={() => redirectUser()}
        ></TemporaryDisplay>
      );
    } else {
      return null;
    }
  };

  const signUpDisplay = () => {
    if (display === "signup") {
      return (
        <SignUpDisplay
          authOrigin={true}
          //close={closeModal} NOT IN AUTH
          email={email}
          message={message}
          password={password}
          //expired={expired} NOT IN AUTH
          error={error}
          spinner={showSpinner}
          inputChange={handleAuthValueChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setDisplay(modal)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          values={(input) => setAuthValues(input)}
          resetValues={() => resetValues()}
          submit={() => redirectUser()}
        ></SignUpDisplay>
      );
    } else {
      return null;
    }
  };

  const confirmationDisplay = () => {
    if (display === "confirmation") {
      return (
        <ConfirmationDisplay
          //close={closeModal} NOT IN AUTH
          email={email}
          error={error}
          message={message}
          authOrigin={true}
          resent={resent}
          confirmation={confirmation}
          spinner={showSpinner}
          inputChange={handleAuthValueChange}
          updateSub={updateSubValues}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setDisplay(modal)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          values={(input) => setAuthValues(input)}
        ></ConfirmationDisplay>
      );
    } else {
      return null;
    }
  };

  const passwordDisplay = () => {
    if (display === "password") {
      return (
        <PasswordDisplay
          //close={closeModal} NOT IN AUTH
          email={email}
          error={error}
          message={message}
          authOrigin={true}
          password={password}
          resetToken={resetToken}
          spinner={showSpinner}
          inputChange={handleAuthValueChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setDisplay(modal)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          values={(input) => setAuthValues(input)}
          submit={() => {
            console.log("inside submit");
            console.log("initial view: ", initialView);
            if (initialView === "paid" || initialView === "upgrade") {
              setDisplay("gateway");
            } else {
              setDisplay("freeCongrats");
            }
          }}
        ></PasswordDisplay>
      );
    } else {
      return null;
    }
  };

  const gatewayDisplay = () => {
    let height = {};
    if (!error) {
      height = { height: "535px" };
    }
    if (display === "gateway") {
      if (showSpinner) {
        return (
          <div className={classes.BlankCanvas} style={height}>
            <Spinner />
          </div>
        );
      } else {
        return (
          <div className={classes.BlankCanvas} style={height}>
            <div className={classes.Header}>
              <div>How to Get Paid Instantly.</div>
            </div>
            <div>
              {showDetail()}
              {gatewayForm}
            </div>
          </div>
        );
      }
    } else {
      return null;
    }
  };

  const freeCongratsDisplay = () => {
    let height = {};
    if (!error) {
      height = { height: "290px" };
    }
    if (display === "freeCongrats") {
      if (showSpinner) {
        return (
          <div className={classes.BlankCanvas} style={height}>
            <Spinner />
          </div>
        );
      } else {
        return (
          <div className={classes.BlankCanvas} style={height}>
            <div className={classes.Header}>
              <div>Success!</div>
            </div>
            <div>
              {showDetail()}
              {freeCongratsForm}
            </div>
          </div>
        );
      }
    } else {
      return null;
    }
  };

  const paidCongratsDisplay = () => {
    let height = {};
    if (!error) {
      height = { height: "240px" };
    }
    if (display === "paidCongrats") {
      if (showSpinner) {
        return (
          <div className={classes.BlankCanvas} style={height}>
            <Spinner />
          </div>
        );
      } else {
        return (
          <div className={classes.BlankCanvas} style={height}>
            <div className={classes.Header}>
              <div>Success!</div>
            </div>
            <div>
              {showDetail()}
              {paidCongratsForm}
            </div>
          </div>
        );
      }
    } else {
      return null;
    }
  };

  const paypalDisplay = () => {
    if (display === "paypal") {
      return (
        <PaypalDisplay
          authOrigin={true} //YES
          //close={closeModal} NOT IN AUTH
          initial={initialView}
          error={error} //YES
          message={message} //YES
          client={paypalExpress_client_id} //YES
          secret={paypalExpress_client_secret} //YES
          sandbox={PAYPAL_USE_SANDBOX} //YES
          sessionToken={authValues.sessionToken} //YES
          accountNum={authValues.accountNum} //YES
          spinner={showSpinner} //YES
          inputChange={handleSubValueChange} //YES
          spinnerChange={(value) => setShowSpinner(value)} //YES
          displayChange={(modal) => setDisplay(modal)} //YES
          submission={(input) => {
            //YES
            setSubmissionStatus(input);
          }}
          submit={() => {
            //YES
            if (getStatus() === 8) {
              setDisplay("paidCongrats");
            } else if (getStatus() === 5) {
              setDisplay("subscription");
            } else if (
              getStatus() === 1 ||
              getStatus() === 4 ||
              getStatus() === 6
            ) {
              setDisplay("gateway");
            } else setDisplay("signin");
          }}
          redirect={() => {
            if (getStatus() !== 0) {
              window.location.href = "/myaccount";
            } else {
              setDisplay("signup");
            }
          }}
        ></PaypalDisplay>
      );
    } else {
      return null;
    }
  };

  const opennodeDisplay = () => {
    if (display === "opennode") {
      return (
        <OpennodeDisplay
          authOrigin={true}
          //close={closeModal} NOT IN AUTH
          initial={initialView}
          error={error}
          message={message}
          apiKey={opennode_invoice_API_KEY}
          settle={opennode_auto_settle}
          dev={opennode_dev}
          sessionToken={authValues.sessionToken}
          accountNum={authValues.accountNum}
          spinner={showSpinner}
          inputChange={handleSubValueChange}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setDisplay(modal)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
          radioChange={(event, value, message) => {
            radioChangeSubValues(event, value, message);
          }}
          submit={() => {
            if (getStatus() === 8) {
              setDisplay("paidCongrats");
            } else if (getStatus() === 5) {
              setDisplay("subscription");
            } else if (
              getStatus() === 1 ||
              getStatus() === 4 ||
              getStatus() === 6
            ) {
              setDisplay("gateway");
            } else setDisplay("signin");
          }}
          redirect={() => {
            if (getStatus() !== 0) {
              window.location.href = "/myaccount";
            } else {
              setDisplay("signup");
            }
          }}
        ></OpennodeDisplay>
      );
    } else {
      return null;
    }
  };

  const subscriptionDisplay = () => {
    if (display === "subscription") {
      return (
        <SubscriptionDisplay
          subValues={subValues}
          changeSubValues={(values) => {
            setSubValues(values);
          }}
          //authOrigin={true}
          //initial={initialView}
          sessionToken={authValues.sessionToken}
          accountNum={authValues.accountNum}
          spinner={showSpinner}
          spinnerChange={(value) => setShowSpinner(value)}
          displayChange={(modal) => setDisplay(modal)}
          submission={(input) => {
            setSubmissionStatus(input);
          }}
        ></SubscriptionDisplay>
      );
    } else {
      return null;
    }
  };

  const errorDisplay = () => {
    let height = {};
    if (!error) {
      height = { height: "340px" };
    }
    if (display === "error") {
      if (showSpinner) {
        return (
          <div className={classes.BlankCanvas} style={height}>
            <Spinner />
          </div>
        );
      } else {
        return (
          <div className={classes.BlankCanvas} style={height}>
            <div className={classes.Header}>
              <div>System Error</div>
            </div>
            <div>{errorForm()}</div>
          </div>
        );
      }
    } else {
      return null;
    }
  };

  return (
    <div className={classes.MainContainer}>
      <div className={classes.Modal}>
        {signInDisplay()}
        {forgotDisplay()}
        {temporaryDisplay()}
        {signUpDisplay()}
        {confirmationDisplay()}
        {passwordDisplay()}
        {gatewayDisplay()}
        {paypalDisplay()}
        {opennodeDisplay()}
        {subscriptionDisplay()}
        {freeCongratsDisplay()}
        {paidCongratsDisplay()}
        {errorDisplay()}
      </div>
    </div>
  );
};

export default Authentication;
