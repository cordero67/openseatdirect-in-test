import React, { useState } from "react";

import { API } from "../../config.js";

import ResetModal from "./Modals/ResetModal";

import classes from "./Account.module.css";

const Account = () => {
  const [userInfo, setUserInfo] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [modalStatus, setModalStatus] = useState(false);

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

    let url = `${API}/auth/change_password/${userInfo.id}`;
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
      })
      .finally(() => {
        //purchaseConfirmHandler()
      });
  };

  return (
    <div>
      <div className={classes.DisplayPanelTitle}>Account Settings</div>
      <div className={classes.DisplayPanel}>
        <div>First Name: {isLoading ? null : userInfo.firstname}</div>
        <br></br>
        <div>Last Name: {isLoading ? null : userInfo.lastname}</div>
        <br></br>
        <div>E-mail: {isLoading ? null : userInfo.email}</div>
        <br></br>
        <button
          onClick={() => {
            requestChange();
          }}
        >
          Change Password
        </button>
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
