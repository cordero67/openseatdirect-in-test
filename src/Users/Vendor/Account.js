import React, { useEffect, useState } from "react";

import { API } from "../../config.js";

import PersonalModal from "./Modals/PersonalModal";
import ResetModal from "./Modals/ResetModal";
import OpennodeModal from "./Modals/OpennodeModal";
import PaypalModal from "./Modals/PaypalModal";

import { getStatus } from "../../Resources/Utils";

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
  const [modalStatus, setModalStatus] = useState("none");
  const [subscriptionType, setSubscriptionType] = useState("free");

  const updateUserInfo = () => {
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
        accountName: tempUser.user.accountId.accountName,
        accountEmail: tempUser.user.accountId.accountEmail,
        paymentGateway: tempUser.user.accountId.paymentGatewayType,
        cryptoGateway: tempUser.user.accountId.cryptoGatewayType,
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
  };

  useEffect(() => {
    updateUserInfo();
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

        setModalStatus("reset");
      })
      .catch((error) => {
        console.log("reset() error.message: ", error.message);
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
        <div>
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
          <br></br>
          <br></br>
        </div>
      );
    } else if (subscriptionType === "paid") {
      return null;
    }
  };

  const paymentDetails = () => {
    if (getStatus() === 8 && userInfo.paymentGateway) {
      return (
        <div>
          Payment Gateway: {userInfo.paymentGateway}{" "}
          {userInfo.paymentGateway === "PayPalExpress" ? (
            <button
              className={classes.PasswordButton}
              onClick={() => {
                setModalStatus("paypal");
              }}
            >
              {" "}
              Update
            </button>
          ) : null}
        </div>
      );
    } else if (getStatus() === 8) {
      return <div>Payment Gateway: NONE </div>;
    } else return null;
  };

  const cryptoDetails = () => {
    console.log("userInfo.cryptoGateway: ", userInfo.cryptoGateway);
    if (
      getStatus() === 8 &&
      userInfo.cryptoGateway &&
      userInfo.cryptoGateway !== "NONE"
    ) {
      return (
        <div>
          Crypto Gateway: {userInfo.cryptoGateway}{" "}
          <button
            className={classes.PasswordButton}
            onClick={() => {
              setModalStatus("opennode");
            }}
          >
            {" "}
            Update
          </button>
        </div>
      );
    } else if (getStatus() === 8) {
      return (
        <div>
          Crypto Gateway: NONE{" "}
          <button
            className={classes.PasswordButton}
            onClick={() => {
              setModalStatus("opennode");
            }}
          >
            {" "}
            Add
          </button>
        </div>
      );
    } else return null;
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
              setModalStatus("personal");
            }}
          >
            EDIT
          </button>
        </div>
        <div>First Name: {userInfo.firstname}</div>
        <div>Last Name: {userInfo.lastname}</div>
        <div>User Name: {userInfo.username}</div>
        <div>E-mail: {userInfo.email}</div>

        <br></br>
        <div style={{ fontWeight: "600" }}>Organization Information</div>
        <div>Name: {userInfo.accountName}</div>
        <div>E-mail: {userInfo.accountEmail}</div>
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
        <div style={{ fontWeight: "600" }}>Plan Details</div>
        <div>Plan Type: {subscription()}</div>
        <button className={classes.PasswordButton}>{upgrade()}</button>

        <br></br>
        <div>{paymentDetails()}</div>
        <div>{cryptoDetails()}</div>
        <div></div>
      </div>
      <PersonalModal
        show={modalStatus === "personal"}
        closeModal={() => {
          setModalStatus("none");
        }}
      />
      <ResetModal
        show={modalStatus === "reset"}
        start={"confirmation"}
        closeModal={() => {
          setModalStatus("none");
        }}
      />
      <PaypalModal
        show={modalStatus === "paypal"}
        closeModal={() => {
          setModalStatus("none");
        }}
      />
      <OpennodeModal
        show={modalStatus === "opennode"}
        closeModal={() => {
          updateUserInfo();
          setModalStatus("none");
        }}
      />
    </div>
  );
};

export default Account;
