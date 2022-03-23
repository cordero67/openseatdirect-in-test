import React, { Fragment } from "react";

import Spinner from "../../components/UI/Spinner/SpinnerNew";
import { API } from "../../config";

import classes from "../AuthenticationModal.module.css";

const PasswordDisplay = (props) => {
  console.log("props: ", props);
  const handleErrors = (response) => {
    console.log("inside handleErrors ", response);
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  const submitPassword = () => {
    props.spinnerChange(true);
    props.submission({
      message: "",
      error: false,
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/signup/password`;
    let information = {
      email: props.email,
      passwordToken: props.resetToken,
      password: props.password,
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
        console.log("error.message: ", error.message);
        props.submission({
          message: "Server down please try again",
          error: true,
        });
        props.displayChange("error");
      })
      .finally(() => {
        props.spinnerChange(false);
      });
  };

  const passwordForm = (
    <Fragment>
      <div style={{ paddingBottom: "20px", width: "100%", height: "85px" }}>
        <label style={{ fontSize: "15px" }}>Password</label>
        <input
          className={classes.InputBox}
          type="text"
          name="password"
          onChange={props.inputChange}
          onFocus={() => {
            props.submission({ message: "", error: false });
          }}
          value={props.password}
        />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <button
          className={classes.ButtonBlue}
          onClick={() => {
            submitPassword();
          }}
        >
          REGISTER YOUR PASSWORD
        </button>
      </div>
    </Fragment>
  );

  const handlePassword = (data) => {
    console.log("data: ", data);
    console.log("STATUS: ", data.status);
    if (data.status) {
      console.log("Inside if statement");
      let tempUser = JSON.parse(localStorage.getItem("user"));
      tempUser.token = data.token;
      localStorage.setItem("user", JSON.stringify(tempUser));
      /*
      props.values({
        name: "",
        email: props.email,
        password: "",
        temporary: "",
        reissued: false,
        confirmation: "",
        resent: false,
        username: props.username,
        resetToken: "",
        sessionToken: data.token,
        userId: data.user._id,
        accountNum: data.user.accountId.accountNum,
      });*/
      //props.submit();
    } else {
      props.submission({
        message: data.error,
        error: true,
      });
      props.displayChange("password");
      console.log("ERROR: ", data.error);
    }
  };

  const showError = () => {
    if (props.error) {
      return (
        <div
          style={{
            color: "red",
            fontSize: "14px",
            lineHeight: "25px",
            paddingBottom: "20px",
          }}
        >
          {props.message}
        </div>
      );
    } else {
      return null;
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
        <div className={classes.Header}>
          <div>Create your password</div>
        </div>
        <div>
          {showError()}
          {passwordForm}
        </div>
      </div>
    );
  }
};

export default PasswordDisplay;
