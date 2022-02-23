import React, { useEffect, useState } from "react";

import { API } from "../../config.js";

import ResetModal from "./Modals/ResetModal";

import classes from "./Account.module.css";

const Account = (props) => {
  console.log("PROPS ACCOUNT: ", props);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    token: "",
  });
  const [modalStatus, setModalStatus] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState("free");

  useEffect(() => {
    //
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      let tempAccountId = tempUser.user.accountId;
      console.log("tempUser: ", tempUser);
      let tempUserInfo = {
        firstname: tempUser.user.firstname,
        lastname: tempUser.user.lastname,
        email: tempUser.user.email,
        username: tempUser.user.username,
        id: tempUser.user._id,
        token: tempUser.token,
      };
      console.log("tempUserInfo: ", tempUserInfo);
      setUserInfo(tempUserInfo);
      if (tempAccountId.status === 8) {
        setSubscriptionType("paid");
        console.log("PAID");
      } else console.log("STILL FREE");
    } else {
      window.location.href = "/auth";
    }
    //
  }, []);

  const handleErrors = (response) => {
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  const requestChange = () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userInfo.token}`);
    let url = `${API}/auth/password/sendcode`;
    let fetcharg = {
      method: "POST",
      headers: myHeaders,
    };
    console.log("url: ", url);
    console.log("fetcharg: ", fetcharg);

    fetch(url, fetcharg)
      .then(handleErrors)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("fetch return got back data:", data);

        setModalStatus(true);
      })
      .catch((error) => {
        console.log("passwordReset() error.message: ", error.message);
        //setDisplay("connection")
      });
  };

  const subscription = () => {
    if (subscriptionType === "free") {
      return "Free Forever Plan";
    } else if (subscriptionType === "paid") {
      return "Pro Plan";
    }
  };

  const upgrade = () => {
    console.log("Subscription type: ", subscriptionType);
    if (subscriptionType === "free") {
      return (
        <a
          style={{
            fontSize: "16px",
            color: "blue",
            border: "none",
            backgroundColor: "white",
            cursor: "pointer",
            display: "inlineBlock",
            outline: "none",
          }}
          href="/auth?view=upgrade"
          target="_blank"
          rel="noreferrer"
        >
          Upgrade to Pro Plan
        </a>
      );
    } else if (subscriptionType === "paid") {
      return null;
    }
  };

  return (
    <div>
      <div className={classes.DisplayPanelTitle}>Account Settings</div>
      <div className={classes.DisplayPanel} style={{ paddingTop: "20px" }}>
        <div style={{ fontWeight: "600" }}>
          Personal Information{" "}
          <button
            className={classes.PasswordButton}
            onClick={() => {
              //requestChange();
            }}
          >
            edit
          </button>
        </div>
        <div>First Name: {userInfo.firstname}</div>
        <div>Last Name: {userInfo.lastname}</div>
        <div>User Name: {userInfo.username}</div>
        <div>E-mail: {userInfo.email}</div>
        <br></br>
        <div style={{ fontWeight: "600" }}>
          Organization Information{" "}
          <button
            className={classes.PasswordButton}
            onClick={() => {
              //requestChange();
            }}
          >
            edit
          </button>
        </div>
        <div>Name:</div>
        <div>E-mail:</div>
        <div>Phone Number:</div>
        <div>Website:</div>
        <br></br>
        <button
          className={classes.PasswordButton}
          onClick={() => {
            requestChange();
          }}
        >
          Change Password
        </button>
        <br></br>
        <br></br>
        <div>Plan: {subscription()}</div>
        <br></br>
        <button className={classes.PasswordButton}>{upgrade()}</button>
      </div>

      <ResetModal
        show={modalStatus}
        start={"confirmation"}
        closeModal={() => {
          setModalStatus(false);
        }}
      />
    </div>
  );
};

export default Account;
