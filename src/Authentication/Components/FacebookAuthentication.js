import React from "react";
//import FacebookLogin from "react-facebook-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;
const API = process.env.REACT_APP_API_URL;

//        cssClass="my-facebook-button-class"
//        icon="fa-facebook"

function MyFBLogin(props) {
  const facebookResponse = async (response) => {
    console.log("FB  response :", response);
    // accessToken, dta_access_experation_time,graphDomain,id, name, signedRequest, userID
    let body = {
      accessToken: response?.accessToken,
      userID: response?.userID,
    };

    if (
      typeof window !== "undefined" &&
      localStorage.getItem(`affiliate`) !== null
    ) {
      body.affiliate = JSON.parse(localStorage.getItem("affiliate"));
    }

    console.log("fb body: ", body);
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = `${API}/auth/sso/facebook`;

    fetch(url, {
      method: "post",
      headers: myHeaders,
      body: JSON.stringify(body),
    })
      .then(handleErrors)
      .then((response) => {
        console.log("then response: ", response);
        return response.json();
      })
      .then((data) => {
        console.log("facebook login success return from server:", data);
        if (!data.status) {
          console.log("NOT ALL GOOD");
          props.error(data.error);
        } else {
          localStorage.setItem("user", JSON.stringify(data));
          console.log("ALL GOOD: ", data);
          if (!data.firstTime && props.authOrigin) {
            console.log("LOGGING IN");
            window.location.href = "/";
          } else {
            console.log("SIGNING UP");
            props.success(data);
          }
        }
      })
      .catch((error) => {
        console.log("error.message: ", error.message);
        props.error("System error please try again");
      });
  };

  const handleErrors = (response) => {
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  };

  return (
    <div style={{ height: "40px" }}>
      <FacebookLogin
        appId={FACEBOOK_APP_ID}
        autoLoad={false}
        callback={facebookResponse}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            style={{
              height: "40px",
              width: "105px",
              backgroundColor: "#fff",
              border: "1px solid #F7F7F7",
              color: "rgb(0, 0, 0, 0.54)",
              boxShadow:
                "rgb(0, 0, 0, 0.24) 0 2px 2px 0, rgb(0, 0, 0, 0.24) 0 0px 1px 0",
              borderRadius: "2px",
              fontWeight: "500",
              fontFamily: "Roboto, sans-serif",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto auto",
              }}
            >
              <div
                style={{
                  paddingTop: "5px",
                  fontSize: "20px",
                  color: "#4267B2",
                }}
              >
                <ion-icon name="logo-facebook"></ion-icon>
              </div>
              <div
                style={{
                  paddingTop: "7px",
                }}
              >
                Facebook
              </div>
            </div>
          </button>
        )}
        icon="fa-facebook"
      />
    </div>
  );
}

export default MyFBLogin;
