import { GoogleLogin } from "react-google-login";
import { faCss3 } from "@fortawesome/free-brands-svg-icons";

//const clientId =  '707788443358-u05p46nssla3l8tmn58tpo9r5sommgks.apps.googleusercontent.com';
//const clientId ='853998692526-q4q1cbd6lenh71q829jcr3gg110frde1.apps.googleusercontent.com';
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
        if (!data.firstTime) {
          console.log("SIGNING IN");
          window.location.href = "/myaccount";
        } else {
          console.log("SIGNING UP");
          props.success();
        }
      }
    } catch {
      console.log("NOT ALL GOOD");
      props.error("System error please try again");
    }
    console.log("DONE WITH FETCH");
  };

  const handleOnFailure = (res) => {
    console.log("Login failed: res:", res);
    //alert(`Failed to login.`);
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
