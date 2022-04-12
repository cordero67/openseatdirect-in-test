import React, { useState, useEffect, Fragment } from "react";

import Spinner from "../../components/UI/Spinner/SpinnerNew";

import { API } from "../../config";

import classes from "./Components.module.css";

const OrganizationDisplay = (props) => {
  console.log("props: ", props);
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    error: false,
  });
  const { message, error } = submissionStatus;

  const [orgValues, setOrgValues] = useState({
    accountName: "",
    accountEmail: "",
    accountPhone: "",
    accountUrl: "",
    accountNum: "",
    userId: "",
    sessionToken: "",
  });

  const handleOrgValueChange = (event) => {
    setOrgValues({
      ...orgValues,
      [event.target.name]: event.target.value,
    });
  };

  const initializeOrgValues = () => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("user") !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      if ("user" in tempUser && "accountId" in tempUser.user) {
        let tempOrgValues = {};
        if (tempUser.user.accountId.accountName) {
          tempOrgValues.accountName = tempUser.user.accountId.accountName;
        } else {
          tempOrgValues.accountName = "";
        }
        if (tempUser.user.accountId.accountEmail) {
          tempOrgValues.accountEmail = tempUser.user.accountId.accountEmail;
        } else {
          tempOrgValues.accountEmail = "";
        }
        if (tempUser.user.accountId.accountPhone) {
          tempOrgValues.accountPhone = tempUser.user.accountId.accountPhone;
        } else {
          tempOrgValues.accountPhone = "";
        }
        if (tempUser.user.accountId.accountUrl) {
          tempOrgValues.accountUrl = tempUser.user.accountId.accountUrl;
        } else {
          tempOrgValues.accountUrl = "";
        }
        if (tempUser.token) {
          tempOrgValues.sessionToken = tempUser.token;
        } else {
          tempOrgValues.sessionToken = "";
        }
        if (tempUser.user.accountId._id) {
          tempOrgValues.userId = tempUser.user.accountId._id;
        } else {
          tempOrgValues.userId = "";
        }
        if (tempUser.user.accountId.accountNum) {
          tempOrgValues.accountNum = tempUser.user.accountId.accountNum;
        } else {
          tempOrgValues.accountNum = "";
        }
        setOrgValues(tempOrgValues);
        console.log("tempOrgValues: ", tempOrgValues);
      }
    } else {
      console.log("no user object");
    }
  };

  useEffect(() => {
    initializeOrgValues();
  }, []);

  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  const handleOrganization = (data) => {
    if (data.status) {
      let tempData = JSON.parse(localStorage.getItem("user"));
      tempData.user.accountId.accountName = data.result.accountName;
      tempData.user.accountId.accountEmail = data.result.accountEmail;
      tempData.user.accountId.accountPhone = data.result.accountPhone;
      tempData.user.accountId.accountEmail = data.result.accountEmail;
      tempData.user.accountId.accountUrl = data.result.accountUrl;
      localStorage.setItem("user", JSON.stringify(tempData));
      props.submit();
      props.spinnerChange(false);
    } else {
      console.log("error: ", data.error);
      setSubmissionStatus({
        message: data.error,
        error: true,
      });
      props.spinnerChange(false);
    }
  };

  const submitOrganization = () => {
    console.log("orgValues: ", orgValues);
    props.spinnerChange(true);
    setSubmissionStatus({
      message: "",
      error: false,
    });
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const authstring = `Bearer ${orgValues.sessionToken}`;
    myHeaders.append("Authorization", authstring);
    let url = `${API}/accounts/${orgValues.accountNum}`;
    let fetcharg = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        accountName: orgValues.accountName,
        accountEmail: orgValues.accountEmail,
        accountPhone: orgValues.accountPhone,
        accountUrl: orgValues.accountUrl,
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
        handleOrganization(data);
      })
      .catch((error) => {
        console.log("error.message: ", error.message);
        props.showError();
        props.spinnerChange(false);
      });
  };

  const organizationForm = () => {
    const regName = /^.{1,64}$/;
    const regEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regPhone =
      /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    const regUrl =
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

    let disabledName;
    let disabledEmail;
    let disabledPhone;
    let disabledUrl;

    if (
      orgValues.accountName === "" ||
      (orgValues.accountName && !regName.test(orgValues.accountName))
    ) {
      console.log("disabledName true");
      disabledName = true;
    } else {
      console.log("disabledName false");
      disabledName = false;
    }

    if (
      orgValues.accountEmail === "" ||
      (orgValues.accountEmail && !regEmail.test(orgValues.accountEmail))
    ) {
      console.log("disabledEmail true");
      disabledEmail = true;
    } else {
      console.log("disabledEmail false");
      disabledEmail = false;
    }

    if (
      orgValues.accountPhone !== "" &&
      orgValues.accountPhone &&
      !regPhone.test(orgValues.accountPhone)
    ) {
      console.log("disabledPhone true");
      disabledPhone = true;
    } else {
      console.log("disabledPhone false");
      disabledPhone = false;
    }

    if (
      orgValues.accountUrl !== "" &&
      orgValues.accountUrl &&
      !regUrl.test(orgValues.accountUrl)
    ) {
      console.log("disabledUrl true");
      disabledUrl = true;
    } else {
      console.log("disabledUrl false");
      disabledUrl = false;
    }

    let disabled =
      disabledName || disabledEmail || disabledPhone || disabledUrl;

    let nameBorder = disabledName ? { border: "1px solid red" } : null;
    let emailBorder = disabledEmail ? { border: "1px solid red" } : null;
    let phoneBorder = disabledPhone ? { border: "1px solid red" } : null;
    let urlBorder = disabledUrl ? { border: "1px solid red" } : null;

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
            Organization Name <span style={{ color: "red" }}>* </span>
          </label>
          <input
            onFocus={() => {
              setSubmissionStatus({
                message: "",
                error: false,
              });
            }}
            className={classes.InputBox}
            style={nameBorder}
            max={"5"}
            type="text"
            name="accountName"
            onChange={handleOrgValueChange}
            value={orgValues.accountName}
          />
          {disabledName ? (
            <div style={{ paddingTop: "5px" }}>
              <span className={classes.RedText}>
                A minimum of 1 character is required
              </span>
            </div>
          ) : null}
        </div>
        <div style={{ paddingBottom: "20px", width: "340px" }}>
          <label style={{ width: "340px", fontSize: "15px" }}>
            Organization E-mail <span style={{ color: "red" }}>* </span>
          </label>
          <input
            onFocus={() => {
              setSubmissionStatus({
                message: "",
                error: false,
              });
            }}
            className={classes.InputBox}
            style={emailBorder}
            type="text"
            name="accountEmail"
            onChange={handleOrgValueChange}
            value={orgValues.accountEmail}
          />
          {disabledEmail ? (
            <div style={{ paddingTop: "5px" }}>
              <span className={classes.RedText}>
                A valid email address is required
              </span>
            </div>
          ) : null}
        </div>
        <div style={{ paddingBottom: "20px", width: "340px" }}>
          <label style={{ width: "340px", fontSize: "15px" }}>
            Phone Number
          </label>
          <input
            onFocus={() => {
              setSubmissionStatus({
                message: "",
                error: false,
              });
            }}
            className={classes.InputBox}
            style={phoneBorder}
            type="text"
            name="accountPhone"
            onChange={handleOrgValueChange}
            value={orgValues.accountPhone}
          />
          {disabledPhone ? (
            <div style={{ paddingTop: "5px" }}>
              <span className={classes.RedText}>Not a valid phone number</span>
            </div>
          ) : null}
        </div>
        <div>
          <label style={{ width: "340px", fontSize: "15px" }}>Website</label>
          <input
            onFocus={() => {
              setSubmissionStatus({
                message: "",
                error: false,
              });
            }}
            className={classes.InputBox}
            style={urlBorder}
            type="text"
            name="accountUrl"
            onChange={handleOrgValueChange}
            value={orgValues.accountUrl}
          />
          {disabledUrl ? (
            <div style={{ paddingTop: "5px" }}>
              <span className={classes.RedText}>
                Not a valid website address
              </span>
            </div>
          ) : null}
        </div>
        <div style={{ textAlign: "center", paddingTop: "20px" }}>
          <button
            className={buttonClass}
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                submitOrganization();
              }
            }}
          >
            Submit your information
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
                initializeOrgValues();
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
      <div className={classes.BlankCanvas} style={{ height: "451px" }}>
        <Spinner />
      </div>
    );
  } else {
    return (
      <div className={classes.BlankCanvas}>
        {header()}
        <div>
          {errorText()}
          {organizationForm()}
        </div>
      </div>
    );
  }
};

export default OrganizationDisplay;
