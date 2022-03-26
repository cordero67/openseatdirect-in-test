import React from "react";
import ReactDOM from "react-dom";
import FacebookLogin from "react-facebook-login";

const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;
const APIURL = process.env.REACT_APP_API_URL;

//        cssClass="my-facebook-button-class"
//        icon="fa-facebook"

function MyFBLogin() {
  const responseFacebook = (response) => {
    console.log(response);
  };

  return (
    <div style={{ height: "40px" }}>
      <FacebookLogin
        appId={FACEBOOK_APP_ID}
        autoLoad={true}
        fields="name,email,picture"
        callback={responseFacebook}
        //cssClass="my-facebook-button-class"
        cssClass={{ width: "80px" }}
        icon="fa-facebook"
      />
    </div>
  );
}

export default MyFBLogin;
