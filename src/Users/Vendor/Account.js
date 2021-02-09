import React, { useEffect, useState } from "react";

import { API } from "../../config.js";

import ResetModal from "./Modals/ResetModal"; 

import classes from "./Account.module.css";

const Account = (props) => {

  const [userInfo, setUserInfo] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [modalStatus, setModalStatus] = useState(false);

  useEffect(() => {
      setIsLoading(true);
  
      if (
        typeof window !== "undefined" &&
        localStorage.getItem(`user`) !== null
      ) {
        let tempUser = JSON.parse(localStorage.getItem("user"));
        let tempUserInfo = {
          email: tempUser.user.email,
          name: tempUser.user.name,
          id: tempUser.user._id,
          token: tempUser.token
        }
        console.log("tempUserInfo: ", tempUserInfo)
        setUserInfo(tempUserInfo);
      } else {
        window.location.href = "/signin";
      }
      setIsLoading(false);
  }, []);


    /*
    router.post("/auth/change_password",requireSignin, isAuth,bodyParser,change_password);
router.post("/auth/confirm_password_reset_code3",requireSignin, isAuth,bodyParser,confirm_password_reset_code3);
router.post("/auth/create_new_password",requireSignin, isAuth,bodyParser,create_new_password);
router.post("/auth/resend_password_code3",requireSignin, isAuth,bodyParser,resend_password_code3);
*/


const handleErrors = response => {
  if (!response.ok) {throw Error(response.status)}
  return response;
};


  const requestChange = () => {
    console.log("inside requestChange")
    console.log("userInfo: ", userInfo)

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${userInfo.token}`);

    let url = `${API}/auth/change_password/${userInfo.id}`
    let fetcharg ={
        method: "POST",
        headers: myHeaders
    };
    console.log("url: ", url)
    console.log("fetcharg: ", fetcharg)


    fetch(url, fetcharg )
    .then(handleErrors)
    .then((response) => {return response.json()})
    .then((data) => {
      console.log ("fetch return got back data:", data);
      //setOrderStatus(data.status);
      //setDisplay("confirmation")
      setModalStatus(true)
    })
    .catch((error) => {
      console.log("passwordReset() error.message: ", error.message);
      //setDisplay("connection")
    })
    .finally(() => {
      //purchaseConfirmHandler()
    });

    
  }

  return (
    <div>
      <div className={classes.DisplayPanelTitle}>
          ACCOUNT SETTINGS
      </div>
      <div className={classes.DisplayPanel}>
          <div>Name:{" "}{isLoading ? null : userInfo.name}</div>
          <br></br>
          <div>E-mail:{" "}{isLoading ? null : userInfo.email}</div>
          <br></br>
          <button
            onClick={() => {
              requestChange();
            }}>
            Change Password
          </button>
      </div>


      <ResetModal
        show={modalStatus}
        start={"confirmation"}
        vendorIntent={false}
        closeModal={() => {
          setModalStatus(false)
        }}
        submit={() => {
          //freeTicketHandler(true)
        }}
      />

    </div>
  )
}

export default Account;