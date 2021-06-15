import React, { useEffect, useState } from "react";

import { API } from "../../config.js";

import ResetModal from "./Modals/ResetModal";

import classes from "./Account.module.css";

const Account = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    token: "",
  });
  const [modalStatus, setModalStatus] = useState(false);

  useEffect(() => {
    //
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`user`) !== null
    ) {
      let tempUser = JSON.parse(localStorage.getItem("user"));
      let tempUserInfo = {
        email: tempUser.user.email,
        firstname: tempUser.user.firstname,
        lastname: tempUser.user.lastname,
        id: tempUser.user._id,
        token: tempUser.token,
      };
      console.log("tempUserInfo: ", tempUserInfo);
      setUserInfo(tempUserInfo);
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
    // NEW FUTE api
    //let url = `${API}/auth/password/sendcode`;
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
      });
  };

  return (
    <div>
      <div className={classes.DisplayPanelTitle}>Account Settings</div>
      <div className={classes.DisplayPanel}>
        <div>First Name: {userInfo.firstname}</div>
        <br></br>
        <div>Last Name: {userInfo.lastname}</div>
        <br></br>
        <div>E-mail: {userInfo.email}</div>
        <br></br>
        <button
          className={classes.PasswordButton}
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
