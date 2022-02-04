// google signin

import { GoogleLogin } from 'react-google-login';
import {useState}  from 'react';

//const clientId =  '707788443358-u05p46nssla3l8tmn58tpo9r5sommgks.apps.googleusercontent.com';
// webtest 2022
//const clientId ='853998692526-q4q1cbd6lenh71q829jcr3gg110frde1.apps.googleusercontent.com';
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
const APIURL  = process.env.REACT_APP_API_URL

function MyGoogleLogin() {
    const [loginData, setLoginData] = useState(
        localStorage.getItem ('loginData') 
        ? JSON.parse (localStorage.getItem ('loginData'))
        : null 
    );

    const handleOnSuccess = async (googleData) => {
        console.log('Login Success: currentUser:', googleData);
        alert(
        `Logged in successfully welcome ${googleData.profileObj.name} 😍. \n See console for full profile object.`
    );
    // fetch jwt

    const res  = await fetch (APIURL+'/auth/signin/google/tokensignin',{
        method:"post",
        body: JSON.stringify ({
            token:googleData.tokenId,
        }),
        headers:{
            'Content-Type':'application/json',
        },
    });

    const data = await res.json();
    console.log ("got login credentials here:", data)

    setLoginData (data);
    localStorage.setItem ('loginData', JSON.stringify (data));

  }


  const handleOnFailure = (res) => {
    console.log('Login failed: res:', res);
    alert(`Failed to login.`
    );
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Continue with Google"
        onSuccess={handleOnSuccess}
        onFailure={handleOnFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={true}
      />
    </div>
  );
}

export default MyGoogleLogin;
