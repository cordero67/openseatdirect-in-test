import React, { useState, useEffect } from "react";
import queryString from "query-string";

import SignInDisplay from "./Components/SignInDisplay";
import ForgotDisplay from "./Components/ForgotDisplay";
import ConfirmTempDisplay from "./Components/ConfirmTempDisplay";
import SignUpDisplay from "./Components/SignUpDisplay";
import ConfirmInitialDisplay from "./Components/ConfirmInitialDisplay";
import PasswordDisplay from "./Components/PasswordDisplay";
import FreeDisplay from "./Components/FreeDisplay";
import PaidDisplay from "./Components/PaidDisplay";
import GatewayDisplay from "./Components/GatewayDisplay";
import PayPalDisplay from "./Components/PayPalDisplay";
import OpenNodeDisplay from "./Components/OpenNodeDisplay";
import SubscriptionDisplay from "./Components/SubscriptionDisplay";
import ErrorDisplay from "./Components/ErrorDisplay";

import { getStatus } from "../Resources/Utils";

import classes from "./Authentication.module.css";

const Authentication = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const initialView = queryString.parse(window.location.search).view;
  const affiliate = queryString.parse(window.location.search).aff;

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

  const [redirect, setRedirect] = useState("");

  const [display, setDisplay] = useState("spinner"); // spinner, signin, forgot, temporary, signup, confirmation, password, error

  const updateAuthValues = () => {
    let tempUser = JSON.parse(localStorage.getItem("user"));
    localStorage.setItem("user", JSON.stringify(tempUser));
    setAuthValues({
      name: "",
      email: tempUser.user.email,
      password: "",
      temporary: "",
      reissued: false,
      expired: false,
      confirmation: "",
      resent: false,
      resetToken: tempUser.user.passwordToken,
      sessionToken: tempUser.token,
      accountNum: tempUser.user.accountId.accountNum,
    });
  };

  useEffect(() => {
    console.log("initialView: ", initialView);
    console.log("affiliate: ", affiliate);
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
        window.location.href = "/";
      } else if (initialView === "upgrade") {
        console.log("initialView: ", initialView, ", upgrade");
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
      } else if (initialView === "sub") {
        console.log("initialView: ", initialView, ", sub");
        if ((status === 1 || status === 4 || status === 5) && fullUser) {
          console.log("status = ", status);
          updateAuthValues();
          setDisplay("subscription");
        } else if (status === 6 && fullUser) {
          console.log("status = ", status);
          updateAuthValues();
          setDisplay("paidCongrats");
          console.log("status = ", status);
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

  const redirectUser = () => {
    console.log("Redirect user");
    let status = getStatus();
    if (status === 8) {
      if (initialView === "create") {
        console.log("going to createevent");
        window.location.href = "/createevent";
      } else {
        console.log("public events");
        window.location.href = "/";
      }
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
      if (initialView === "create") {
        console.log("going to createevent");
        window.location.href = "/createevent";
      } else {
        console.log("public events");
        window.location.href = "/";
      }
    } else if (
      initialView === "upgrade" ||
      initialView === "paid" ||
      initialView === "free"
    ) {
      setDisplay("signup");
      setShowSpinner(false);
    } else {
      setDisplay("signin");
      setShowSpinner(false);
    }
  };

  const signInDisplay = () => {
    if (display === "signin") {
      return (
        <SignInDisplay
          authOrigin={true} // AUTH
          //close={closeModal} // NOT IN AUTH
          //expired={expired} // NOT IN AUTH
          email={email} // AUTH
          password={password} // AUTH
          spinner={showSpinner} // AUTH
          inputChange={handleAuthValueChange} // AUTH
          spinnerChange={(value) => setShowSpinner(value)} // AUTH
          displayChange={(display) => setDisplay(display)} // AUTH
          showError={() => {
            // AUTH
            console.log("showError");
            setRedirect("signin");
            setDisplay("error");
          }}
          values={(input) => setAuthValues(input)} // AUTH
          resetValues={() => resetValues()} // AUTH
          submit={() => {
            console.log("going to redirectuser");
            redirectUser();
          }} // AUTH
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
          authOrigin={true} // IN AUTH
          //close={closeModal} NOT IN AUTH
          //expired={expired} NOT IN AUTH
          email={email} // IN AUTH
          spinner={showSpinner} // IN AUTH
          inputChange={handleAuthValueChange} // IN AUTH
          spinnerChange={(value) => setShowSpinner(value)} // IN AUTH
          displayChange={(display) => setDisplay(display)} // IN AUTH
          showError={() => {
            // AUTH
            console.log("showError");
            setRedirect("forgot");
            setDisplay("error");
          }}
          values={(input) => setAuthValues(input)} // IN AUTH
          resetValues={() => resetValues()} // IN AUTH
        ></ForgotDisplay>
      );
    } else {
      return null;
    }
  };

  const confirmTempDisplay = () => {
    if (display === "temporary") {
      return (
        <ConfirmTempDisplay
          authOrigin={true} // IN AUTH
          //close={closeModal} NOT IN AUTH
          //expired={expired} NOT IN AUTH
          email={email} // IN AUTH
          reissued={reissued} // IN AUTH
          temporary={temporary} // IN AUTH
          spinner={showSpinner} // IN AUTH
          inputChange={handleAuthValueChange} // IN AUTH
          spinnerChange={(value) => setShowSpinner(value)} // IN AUTH
          displayChange={(modal) => setDisplay(modal)} // IN AUTH
          showError={() => {
            // AUTH
            console.log("showError");
            setRedirect("temporary");
            setDisplay("error");
          }}
          values={(input) => setAuthValues(input)} // IN AUTH
          resetValues={() => resetValues()} // IN AUTH
          submit={() => redirectUser()} // AUTH
        ></ConfirmTempDisplay>
      );
    } else {
      return null;
    }
  };

  const signUpDisplay = () => {
    if (display === "signup") {
      return (
        <SignUpDisplay
          authOrigin={true} // AUTH
          //close={closeModal} NOT IN AUTH
          //expired={expired} NOT IN AUTH
          affiliate={affiliate} // AUTH
          email={email} // AUTH
          password={password}
          spinner={showSpinner} // AUTH
          inputChange={handleAuthValueChange} // AUTH
          spinnerChange={(value) => setShowSpinner(value)} // AUTH
          displayChange={(modal) => setDisplay(modal)} // AUTH
          showError={() => {
            // AUTH
            console.log("showError");
            setRedirect("signup");
            setDisplay("error");
          }}
          values={(input) => setAuthValues(input)} // AUTH
          resetValues={() => resetValues()} // AUTH
          submit={() => redirectUser()} // AUTH
        ></SignUpDisplay>
      );
    } else {
      return null;
    }
  };

  const confirmInitialDisplay = () => {
    if (display === "confirmation") {
      return (
        <ConfirmInitialDisplay
          authOrigin={true} // AUTH
          update={true} // IN UPDATE
          //close={closeModal} NOT IN AUTH
          //expired={expired} NOT IN AUTH
          sessionToken={authValues.sessionToken} // NOT IN AUTH
          email={email} // AUTH
          resent={resent} // AUTH
          confirmation={confirmation} // AUTH
          spinner={showSpinner} // AUTH
          inputChange={handleAuthValueChange} // AUTH
          spinnerChange={(value) => setShowSpinner(value)} // AUTH
          displayChange={(modal) => setDisplay(modal)} // AUTH
          showError={() => {
            // AUTH
            console.log("showError");
            setRedirect("confirmation");
            setDisplay("error");
          }}
          values={(input) => setAuthValues(input)} // AUTH
        ></ConfirmInitialDisplay>
      );
    } else {
      return null;
    }
  };

  const passwordDisplay = () => {
    if (display === "password") {
      return (
        <PasswordDisplay
          authOrigin={true} // AUTH
          //close={closeModal} NOT IN AUTH
          //expired={expired} NOT IN AUTH
          email={email} // AUTH
          password={password} // AUTH
          resetToken={resetToken} // AUTH
          spinner={showSpinner} // AUTH
          inputChange={handleAuthValueChange} // AUTH
          spinnerChange={(value) => setShowSpinner(value)} // AUTH
          displayChange={(modal) => setDisplay(modal)} // AUTH
          showError={() => {
            // AUTH
            console.log("showError");
            setRedirect("password");
            setDisplay("error");
          }}
          values={(input) => setAuthValues(input)} // AUTH
          submit={() => {
            // AUTH
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
    if (display === "gateway") {
      return (
        <GatewayDisplay
          authOrigin={true}
          initial={initialView} // AUTH
          spinner={showSpinner} // AUTH
          spinnerChange={(value) => setShowSpinner(value)} // AUTH
          sessionToken={authValues.sessionToken} // AUTH
          accountNum={authValues.accountNum} // AUTH
          displayChange={(modal) => setDisplay(modal)} // AUTH
          showError={() => {
            // AUTH
            console.log("showError");
            setRedirect("gateway");
            setDisplay("error");
          }}
          submit={() => redirectUser()} // AUTH
        ></GatewayDisplay>
      );
    } else {
      return null;
    }
  };

  const freeDisplay = () => {
    if (display === "freeCongrats") {
      console.log("showSpinner: ", showSpinner);
      return (
        <FreeDisplay
          authOrigin={true}
          initial={initialView} // AUTH
          displayChange={(modal) => setDisplay(modal)} // AUTH
        ></FreeDisplay>
      );
    } else {
      return null;
    }
  };

  const paidDisplay = () => {
    if (display === "paidCongrats") {
      return (
        <PaidDisplay authOrigin={true} initial={initialView}></PaidDisplay>
      );
    } else {
      return null;
    }
  };

  const payPalDisplay = () => {
    if (display === "paypal") {
      return (
        <PayPalDisplay
          authOrigin={true} // AUTH
          //close={closeModal} NOT IN AUTH
          initial={initialView} // AUTH
          sessionToken={authValues.sessionToken} // AUTH
          accountNum={authValues.accountNum} // AUTH
          spinner={showSpinner} // AUTH
          spinnerChange={(value) => setShowSpinner(value)} // AUTH
          showError={() => {
            // AUTH
            setRedirect("paypal");
            setDisplay("error");
          }}
          displayChange={(modal) => setDisplay(modal)} // AUTH
          submit={() => {
            // AUTH
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
            // AUTH
            if (getStatus() !== 0) {
              if (initialView === "create") {
                console.log("going to createevent");
                window.location.href = "/createevent";
              } else {
                console.log("public events");
                window.location.href = "/";
              }
            } else {
              setDisplay("signup");
            }
          }}
        ></PayPalDisplay>
      );
    } else {
      return null;
    }
  };

  const openNodeDisplay = () => {
    if (display === "opennode") {
      return (
        <OpenNodeDisplay
          authOrigin={true} // AUTH
          //close={closeModal} NOT IN AUTH
          initial={initialView} // AUTH
          sessionToken={authValues.sessionToken} // AUTH
          accountNum={authValues.accountNum} // AUTH
          spinner={showSpinner} // AUTH
          spinnerChange={(value) => setShowSpinner(value)} // AUTH
          displayChange={(modal) => setDisplay(modal)} // AUTH
          showError={() => {
            // AUTH
            console.log("showError");
            setRedirect("opennode");
            setDisplay("error");
          }}
          submit={() => {
            // AUTH
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
            // AUTH
            if (getStatus() !== 0) {
              if (initialView === "create") {
                console.log("going to createevent");
                window.location.href = "/createevent";
              } else {
                console.log("public events");
                window.location.href = "/";
              }
            } else {
              setDisplay("signup");
            }
          }}
        ></OpenNodeDisplay>
      );
    } else {
      return null;
    }
  };

  const subscriptionDisplay = () => {
    if (display === "subscription") {
      return (
        <SubscriptionDisplay
          authOrigin={true}
          sessionToken={authValues.sessionToken} // AUTH
          accountNum={authValues.accountNum} // AUTH
          spinner={showSpinner} // AUTH
          spinnerChange={(value) => setShowSpinner(value)} // AUTH
          displayChange={(modal) => setDisplay(modal)} // AUTH
          showError={() => {
            // AUTH
            console.log("showError");
            setRedirect("submission");
            setDisplay("error");
          }}
          submit={() => {
            // AUTH
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
        ></SubscriptionDisplay>
      );
    } else {
      return null;
    }
  };

  const errorDisplay = () => {
    if (display === "error") {
      return (
        <ErrorDisplay
          redirect={redirect}
          initial={initialView}
          now={() => {
            console.log("NOW");
            setDisplay(redirect);
          }}
          later={() => {
            if (
              redirect === "signin" ||
              redirect === "forgot" ||
              redirect === "temporary" ||
              redirect === "signup" ||
              redirect === "confirmation" ||
              redirect === "password"
            ) {
              window.location.href = "/";
            } else if (
              (redirect === "gateway" ||
                redirect === "opennode" ||
                redirect === "paypal" ||
                redirect === "subscription") &&
              initialView === "upgrade"
            ) {
              console.log("gateway");
              window.close();
            } else if (
              redirect === "gateway" ||
              redirect === "opennode" ||
              redirect === "paypal" ||
              redirect === "subscription"
            ) {
              console.log("LATER");
              if (initialView === "create") {
                console.log("going to createevent");
                window.location.href = "/createevent";
              } else {
                console.log("public events");
                window.location.href = "/";
              }
            }
          }}
        ></ErrorDisplay>
      );
    } else {
      return null;
    }
  };

  return (
    <div className={classes.MainContainer}>
      <div className={classes.Modal}>
        {signInDisplay()}
        {forgotDisplay()}
        {confirmTempDisplay()}
        {signUpDisplay()}
        {confirmInitialDisplay()}
        {passwordDisplay()}
        {freeDisplay()}
        {gatewayDisplay()}
        {payPalDisplay()}
        {openNodeDisplay()}
        {subscriptionDisplay()}
        {paidDisplay()}
        {errorDisplay()}
      </div>
    </div>
  );
};

export default Authentication;
/*
 */
