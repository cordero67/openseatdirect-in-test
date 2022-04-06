import React, { useState, useEffect, Fragment } from "react";
import ConfirmUpdateDisplay from "../../../Authentication/Components/ConfirmUpdateDisplay";
import ResetDisplay from "../../../Authentication/Components/ResetDisplay";
import ErrorDisplay from "../../../Authentication/Components/ErrorDisplay";

import { API } from "../../../config";

import Backdrop from "./Backdrop";
import classes from "./ResetModal.module.css";

const Reset = (props) => {
  const [showSpinner, setShowSpinner] = useState(false);

  const [subValues, setSubValues] = useState({
    accountNum: "",
    sessionToken: "",
  });

  const [display, setDisplay] = useState("confirmUpdate"); // spinner, signin, forgot, temporary, signup, confirmation, password, error

  const [values, setValues] = useState({
    email: "",
    password: "",
    temporary: "",
    reissued: false,
    confirmation: "",
    resent: false,
    resetToken: "",
    expired: "",
    sessionToken: "",
    accountNum: "",
  });

  const [redirect, setRedirect] = useState("");

  const {
    email,
    password,
    temporary,
    reissued,
    confirmation,
    resent,
    resetToken,
    expired,
    sessionToken,
    accountNum,
  } = values;

  // transaction status variable
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    error: false,
  });
  const { message, error } = submissionStatus;

  // LOOKS GOOD
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      let tempValues = { ...values };
      tempValues.sessionToken = tempUser.token;
      setValues(tempValues);
    } else {
      window.location.href = "/auth";
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
  const submitExpired = () => {
    console.log("values: ", values);
    setSubmissionStatus({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${values.sessionToken}`);
    let url = `${API}/auth/password/sendcode`;
    let fetchBody = {
      method: "POST",
      headers: myHeaders,
    };
    console.log("url: ", url);
    console.log("fetcharg: ", fetchBody);

    fetch(url, fetchBody)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);
        handleExpired(data);
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

  const handleExpired = (data) => {
    if (data.status) {
      resetValues();
      console.log("SUCCESS");
      setDisplay("confirmUpdate");
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
    let tempValues = {
      password: "",
      confirmation: "",
      resent: false,
      resetToken: "",
      sessionToken: values.sessionToken,
    };
    setValues(tempValues);
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
    }
  };

  const expiredForm = (
    <Fragment>
      <div style={{ width: "100%", paddingBottom: "10px", fontSize: "16px" }}>
        Would you still like to set your password?
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.OSDBlueButton}
          onClick={() => {
            console.log("clicked yes button");
            submitExpired();
          }}
        >
          Yes resend code
        </button>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.ButtonGrey}
          onClick={() => {
            closeModal();
          }}
        >
          Not at this time
        </button>
      </div>
    </Fragment>
  );

  // LOOKS GOOD
  const closeModal = () => {
    resetValues();
    setSubmissionStatus({
      message: "",
      error: false,
    });
    setDisplay("confirmUpdate");
    props.closeModal();
  };

  const expiredDisplay = () => {
    if (display === "expired") {
      return (
        <div className={classes.BlankCanvas}>
          <div className={classes.Header}>
            <div>Time expired</div>
          </div>
          <div>
            {showError()}
            {expiredForm}
          </div>
        </div>
      );
    } else return null;
  };

  const confirmUpdateDisplayNEW = () => {
    if (display === "confirmUpdate") {
      return (
        <ConfirmUpdateDisplay
          close={closeModal} //
          sessionToken={sessionToken} //
          email={email} //
          accountNumber={accountNum} //
          resent={resent} //
          confirmation={confirmation} //
          spinner={showSpinner} //
          inputChange={handleChange} //
          spinnerChange={(value) => setShowSpinner(value)} //
          displayChange={(modal) => setDisplay(modal)} //
          showError={() => {
            //
            console.log("showError");
            setRedirect("confirmUpdate");
            setDisplay("error");
          }}
          values={(input) => setValues(input)} //
        ></ConfirmUpdateDisplay>
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
          now={() => {
            console.log("NOW");
            setDisplay(redirect);
          }}
          later={() => {
            console.log("LATER");
            closeModal();
          }}
        ></ErrorDisplay>
      );
    } else {
      return null;
    }
  };

  const resetDisplay = () => {
    if (display === "reset") {
      return (
        <ResetDisplay
          authOrigin={true}
          close={closeModal} //
          password={password} //
          resetToken={resetToken} //
          sessionToken={sessionToken} //
          spinner={showSpinner} //
          inputChange={handleChange} //
          spinnerChange={(value) => setShowSpinner(value)} //
          displayChange={(modal) => setDisplay(modal)} //
          showError={() => {
            //
            console.log("showError");
            setRedirect("reset");
            setDisplay("error");
          }}
        ></ResetDisplay>
      );
    } else {
      return null;
    }
  };

  return (
    <Fragment>
      <Backdrop show={props.show} clicked={null}></Backdrop>
      <div
        style={{
          transform: props.show ? "translateY(0)" : "translateY(-100vh)",
          opacity: props.show ? "1" : "0",
          fontSize: "20px",
        }}
        className={classes.Modal}
      >
        {confirmUpdateDisplayNEW()}
        {resetDisplay()}
        {expiredDisplay()}
        {errorDisplay()}
      </div>
    </Fragment>
  );
};

export default Reset;
