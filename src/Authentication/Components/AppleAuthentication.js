import React from "react";
import AppleSignin from "react-apple-signin-auth";

const APPLE_CLIENT_ID = process.env.REACT_APP_APPLE_CLIENT_ID;
const API = process.env.REACT_APP_API_URL;

//        cssClass="my-facebook-button-class"
//        icon="fa-facebook"

function MyAppleSigninButton(props) {
  const appleResponse = async (response) => {
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
    let url = `${API}/auth/sso/apple`;

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
        console.log("apple login success return from server:", data);
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

  const onError = (appleError) => {
    console.log("apple error 70", appleError);
    console.error(appleError);
    props.error("Apple signin system error. Please try again");
  };

  console.log("APPLE_CLIENT_ID=", APPLE_CLIENT_ID, " API=", API);
  return (
    <div style={{ height: "40px" }}>
      <AppleSignin
        /** Auth options passed to AppleID.auth.init() */
        authOptions={{
          /** Client ID - eg: 'com.example.com' */
          //MM            clientId: "254DW3GMRJ.com.openseatdirect.ticketapp",
          clientId: APPLE_CLIENT_ID,
          /** Requested scopes, seperated by spaces - eg: 'email name' */
          scope: "email name",
          /** Apple's redirectURI - must be one of the URIs you added to the serviceID - the undocumented trick in apple docs is that you should call auth from a page that is listed as a redirectURI, localhost fails */
          //MM            redirectURI: 'https://api.bondirectly.com',
          redirectURI: API,
          /** State string that is returned with the apple response */
          state: "state",
          /** Nonce */
          //            nonce: 'nonce', // sha256(nonce)
          /** Uses popup auth instead of redirection */
          //            usePopup: ${authOptions.usePopup},
          usePopup: true,
        }} // REQUIRED
        /** General props */
        uiType="dark"
        /** className */
        className="apple-auth-btn"
        /** Removes default style tag */
        noDefaultStyle={false}
        /** Allows to change the button's children, eg: for changing the button text */
        buttonExtraChildren="Continue with Apple"
        /** Extra controlling props */
        /** Called upon signin success in case authOptions.usePopup = true -- which means auth is handled client side */
        //MM        onSuccess={(response) => console.log(response)} // default = undefined
        onSuccess={appleResponse} // default = undefined
        /** Called upon signin error */
        //  MM    onError={(error) => console.error(error)} // default = undefined
        onError={onError} // default = undefined
        /** Skips loading the apple script if true */
        skipScript={false} // default = undefined
        /** Apple image props */
        // MM     iconProp={{ style: { marginTop: '10px' } }} // default = undefined
        iconprop={{ style: { marginTop: "10px" } }} // default = undefined
        /** render function - called with all props - can be used to fully customize the UI by rendering your own component  */
        render={(props) => (
          <button
            {...props}
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
                }}
              >
                <ion-icon name="logo-apple"></ion-icon>
              </div>
              <div
                style={{
                  paddingTop: "7px",
                }}
              >
                Apple
              </div>
            </div>
          </button>
        )}
      />
    </div>
  );
}

export default MyAppleSigninButton;
