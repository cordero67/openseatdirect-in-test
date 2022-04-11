import React, { useState, useEffect, Fragment } from "react";

import Spinner from "../../components/UI/Spinner/SpinnerNew";

import { API } from "../../config";

import classes from "./Components.module.css";

const PersonalDisplay = (props) => {
  console.log("props: ", props);
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    error: false,
  });
  const { message, error } = submissionStatus;

  const [subValues, setSubValues] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    userId: "",
    sessionToken: "",
  });

  const handleSubValueChange = (event) => {
    setSubValues({
      ...subValues,
      [event.target.name]: event.target.value,
    });
  };

  const initializeSubValues = () => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("user") !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      console.log("tempUser: ", tempUser);
      if ("user" in tempUser && "accountId" in tempUser.user) {
        let tempSubValues = {};
        if (tempUser.user.firstname) {
          tempSubValues.firstName = tempUser.user.firstname;
        } else {
          tempSubValues.firstName = "";
        }
        if (tempUser.user.lastname) {
          tempSubValues.lastName = tempUser.user.lastname;
        } else {
          tempSubValues.lastName = "";
        }
        if (tempUser.user.username) {
          tempSubValues.userName = tempUser.user.username;
        } else {
          tempSubValues.userName = "";
        }
        if (tempUser.user._id) {
          tempSubValues.userId = tempUser.user._id;
        } else {
          tempSubValues.userId = "";
        }
        if (tempUser.token) {
          tempSubValues.sessionToken = tempUser.token;
        } else {
          tempSubValues.sessionToken = "";
        }
        setSubValues(tempSubValues);
        console.log("tempSubValues: ", tempSubValues);
      }
    } else {
      console.log("no user object");
    }
  };

  useEffect(() => {
    initializeSubValues();
  }, []);

  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  const handlePersonal = (data) => {
    if (data.status) {
      let tempData = JSON.parse(localStorage.getItem("user"));
      tempData.user.firstname = data.result.firstname;
      tempData.user.lastname = data.result.lastname;
      tempData.user.username = data.result.username;
      localStorage.setItem("user", JSON.stringify(tempData));
      props.submit();
      props.spinnerChange(false);
    } else {
      console.log("errmsg: ", data.message);
      setSubmissionStatus({
        message: data.message,
        error: true,
      });
      props.spinnerChange(false);
    }
  };

  const submitPersonal = () => {
    console.log("subValues: ", subValues);
    props.spinnerChange(true);
    setSubmissionStatus({
      message: "",
      error: false,
    });
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const authstring = `Bearer ${subValues.sessionToken}`;
    myHeaders.append("Authorization", authstring);
    let url = `${API}/user/${subValues.userId}`;

    let fetcharg = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        firstname: subValues.firstName,
        lastname: subValues.lastName,
        username: subValues.userName,
      }),
    };
    console.log("fetching with: ", url, fetcharg);
    fetch(url, fetcharg)
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data on PayPal:", data);
        handlePersonal(data);
      })
      .catch((error) => {
        console.log("error.message: ", error.message);
        props.showError();
        props.spinnerChange(false);
      });
  };

  const personalForm = () => {
    let disabled = true;
    if (true) {
      disabled = false;
    }
    let buttonClass;
    if (disabled) {
      buttonClass = classes.ButtonBlueOpac;
    } else {
      buttonClass = classes.ButtonBlue;
    }
    return (
      <Fragment>
        <div style={{ paddingBottom: "20px", width: "340px" }}>
          <label style={{ width: "340px", fontSize: "15px" }}>
            First Name <span style={{ color: "red" }}>* </span>
          </label>
          <input
            onFocus={() => {
              setSubmissionStatus({
                message: "",
                error: false,
              });
            }}
            className={classes.InputBox}
            type="text"
            name="firstName"
            onChange={handleSubValueChange}
            value={subValues.firstName}
          />
        </div>
        <div style={{ paddingBottom: "20px", width: "340px" }}>
          <label style={{ width: "340px", fontSize: "15px" }}>
            Last Name <span style={{ color: "red" }}>* </span>
          </label>
          <input
            onFocus={() => {
              setSubmissionStatus({
                message: "",
                error: false,
              });
            }}
            className={classes.InputBox}
            type="text"
            name="lastName"
            onChange={handleSubValueChange}
            value={subValues.lastName}
          />
        </div>
        <div>
          <label style={{ fontSize: "15px" }}>
            User Name <span style={{ color: "red" }}>* </span>
          </label>
          <input
            onFocus={() => {
              setSubmissionStatus({
                message: "",
                error: false,
              });
            }}
            className={classes.InputBox}
            type="text"
            name="userName"
            onChange={handleSubValueChange}
            value={subValues.userName}
          />
        </div>
        <div style={{ textAlign: "center", paddingTop: "20px" }}>
          <button
            className={buttonClass}
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                submitPersonal();
              }
            }}
          >
            Submit Your Information
          </button>
        </div>
      </Fragment>
    );
  };

  const errorText = () => {
    if (error) {
      return <div className={classes.ErrorText}>{message}</div>;
    } else {
      return null;
    }
  };

  const header = () => {
    if (props.authOrigin !== true) {
      return (
        <div className={classes.HeaderModal}>
          <div>Edit Your Information</div>
          <div style={{ textAlign: "right", top: "10%" }}>
            <ion-icon
              className={classes.CloseIcon}
              name="close-outline"
              cursor="pointer"
              onClick={() => {
                initializeSubValues();
                setSubmissionStatus({
                  message: "",
                  error: false,
                });
                props.close();
              }}
            />
          </div>
        </div>
      );
    } else {
      return <div className={classes.Header}>Edit Your Information</div>;
    }
  };

  if (props.spinner) {
    return (
      <div className={classes.BlankCanvas} style={{ height: "363px" }}>
        <Spinner />
      </div>
    );
  } else {
    return (
      <div className={classes.BlankCanvas}>
        {header()}
        <div>
          {errorText()}
          {personalForm()}
        </div>
      </div>
    );
  }
};

export default PersonalDisplay;
