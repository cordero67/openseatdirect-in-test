// google signin

import { GoogleLogin } from "react-google-login";
import { useState } from "react";
import { faCss3 } from "@fortawesome/free-brands-svg-icons";

//const clientId =  '707788443358-u05p46nssla3l8tmn58tpo9r5sommgks.apps.googleusercontent.com';
//const clientId ='853998692526-q4q1cbd6lenh71q829jcr3gg110frde1.apps.googleusercontent.com';
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const APIURL = process.env.REACT_APP_API_URL;

function MyGoogleLogin(props) {
  console.log("First login: ", props.firstLogin);

  const handleOnSuccess = async (googleData) => {
    console.log("Inside handleOnSuccess, props.firstLogin: ", props.firstLogin);
    //if (!props.firstLogin) {
    console.log("Login Success: currentUser:", googleData);
    alert(`GOOGLE Login successfull.`);

    if (props.signin) {
      console.log("SIGNING IN");
    } else {
      console.log("SIGNING UP");
    }

    try {
      const res = await fetch(APIURL + "/auth/signi/google/tokensignin", {
        method: "post",
        body: JSON.stringify({
          token: googleData.tokenId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("got login credentials here:", data);

      localStorage.setItem("user", JSON.stringify(data));
      console.log("ALL GOOD");

      if (props.signin) {
        console.log("SIGNING IN");
        window.location.href = "/myaccount";
      } else {
        console.log("SIGNING UP");
        props.success();
      }
    } catch {
      console.log("NOT ALL GOOD");
      //props.changeFirstLogin();
      props.error();
    }

    //}
    //props.changeFirstLogin();
    //else {
    //  console.log("CHANGING LOGIN STATUS");
    //  props.changeFirstLogin();
    //}
    console.log("DONE WITH FETCH");
  };

  const handleOnFailure = (res) => {
    console.log("Login failed: res:", res);
    alert(`Failed to login.`);
    props.error();
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        //buttonText="Continue with Google"
        buttonText={null}
        autoLoad={false}
        disabled={false}
        onSuccess={handleOnSuccess}
        onFailure={handleOnFailure}
        cookiePolicy={"single_host_origin"}
        style={{ marginTop: "100px" }}
        isSignedIn={true}
      />
    </div>
  );
}

export default MyGoogleLogin;
