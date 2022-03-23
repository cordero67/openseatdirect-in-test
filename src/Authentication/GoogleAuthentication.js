import { GoogleLogin } from "react-google-login";
import { faCss3 } from "@fortawesome/free-brands-svg-icons";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const APIURL = process.env.REACT_APP_API_URL;

function MyGoogleLogin(props) {
  const handleOnSuccess = async (googleData) => {
    console.log("Login Success: currentUser:", googleData);
    try {
      const res = await fetch(APIURL + "/auth/signin/google/tokensignin", {
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

      if (!data.status) {
        console.log("NOT ALL GOOD");
        props.error(data.error);
      } else {
        localStorage.setItem("user", JSON.stringify(data));
        console.log("ALL GOOD: ", data);
        if (!data.firstTime && props.authOrigin) {
          console.log("LOGGING IN");
          window.location.href = "/myaccount";
        } else {
          console.log("SIGNING UP");
          props.success(data);
        }
      }
    } catch (er) {
      console.log("NOT ALL GOOD er=", er);
      props.error("System error please try again");
    }
    console.log("DONE WITH FETCH");
  };

  const handleOnFailure = (res) => {
    console.log("Login failed: res:", res);
    props.error("Google error please try again");
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Google"
        onSuccess={handleOnSuccess}
        onFailure={handleOnFailure}
        cookiePolicy={"single_host_origin"}
        style={{ marginTop: "100px" }}
      />
    </div>
  );
}

export default MyGoogleLogin;
