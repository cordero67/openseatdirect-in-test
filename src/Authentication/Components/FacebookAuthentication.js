import React from "react";
import FacebookLogin from "react-facebook-login";

const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;
const API = process.env.REACT_APP_API_URL;

//        cssClass="my-facebook-button-class"
//        icon="fa-facebook"

function MyFBLogin(props) {

const facebookResponse = async (response) => {
  console.log("FB  response :", response);

  let body = { 
    accessToken: response?.accessToken, 
    userId:      response?.userID
  };

  if (typeof window !== "undefined" && localStorage.getItem(`affiliate`) !== null) {
      body.affiliate =  JSON.parse(localStorage.getItem("affiliate"));
  };

  console.log("fb body: ", body);
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  let url = `${API}/auth/sso/facebooklogin`;
  
  fetch(url, {
    method: "post",
    headers:myHeaders,
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
        props.error(data.error)
      } else {
        localStorage.setItem("user", JSON.stringify(data));
        console.log("ALL GOOD: ", data);
        if (!data.firstTime && props.authOrigin) {
          console.log("LOGGING IN");
          window.location.href = "/";
        } else {
          console.log("SIGNING UP");
          props.success(data);
        };
      }
    })
    .catch((error) => {
      console.log("error.message: ", error.message);
      props.error("System error please try again");
    }); 
}

const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.status);
  }
  return response;
};

// autoLoad={true}

  return (
    <div style={{ height: "40px" }}>
      <FacebookLogin
        appId={FACEBOOK_APP_ID}
        autoLoad={false}
        callback={facebookResponse}
        cssClass={{ width: "80px" }}
        icon="fa-facebook"
      />
    </div>
  );
}

export default MyFBLogin;
