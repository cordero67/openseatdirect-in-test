/* global google */

import React, { Component,useEffect } from "react";

import { BrowserRouter } from "react-router-dom";

import Routes from "./components/Routes/Routes";

import GoogleOneTapLogin from 'react-google-one-tap-login';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID
const API_URL  = process.env.REACT_APP_API_URL


function  googleOneTap ({ client_id, auto_select = false, cancel_on_tap_outside = false, context = 'signin' }, callback) {
    const contextValue = ['signin', 'signup', 'use'].includes(context) ? context : 'signin';
    let googleScript = document.createElement('script');
    googleScript.setAttribute('src', 'https://accounts.google.com/gsi/client');
    document.head.appendChild(googleScript)
    window.onload = function () {
      if (client_id) {
        window.google.accounts.id.initialize({
          client_id: client_id,
          callback: callback,
          auto_select: auto_select,
          cancel_on_tap_outside: cancel_on_tap_outside,
          context: contextValue
        });
        window.google.accounts.id.prompt();
      } else {
        console.error('client_id is missing');
      }
    };
  }


  console.log("path=", API_URL+"/auth/signin/google/tokensignin");


//https://www.intricatecloud.io/2020/12/passwordless-sign-in-with-google-one-tap-for-web/

const onOneTapSignedIn = response =>{
   console.log ("1t respose", response);
  }

const  handleOnSuccess = (googleData) => {
        console.log('Login Success: currentUser:', googleData);
        alert(
        `Logged in successfully welcome ${googleData.email}`
      );
    // fetch jwt
    console.log ("about to fetch:",API_URL+'/auth/signin/google/onetap' )
    fetch (API_URL+'/auth/signin/google/onetap',{
        method:"post",
        body: JSON.stringify ({
            google_data:googleData,
        }),
        headers:{
            'Content-Type':'application/json',
        },
    }).then ((res)=>res.json())
    .then ((data) =>{
      console.log ("got login credentials here:", data)
      //setLoginData (data);
     // localStorage.setItem ('loginData', JSON.stringify (data));
    }).catch ((err)=>{
      console.log ("err3333>>", err)
    })
  }

class App extends Component {


  removeScript = (scriptToremove) => {
    let allsuspects=document.getElementsByTagName("script");
    for (let i=allsuspects.length; i>=0; i--){
    if (allsuspects[i] && allsuspects[i].getAttribute("src")!==null 
      && allsuspects[i].getAttribute("src").indexOf(`${scriptToremove}`)                !== -1 ){
           allsuspects[i].parentNode.removeChild(allsuspects[i])
        }    
    }
  }

  GSI = "https://accounts.google.com/gsi/client";

  gcall (x){
    console.log (x)
  }


  
  componentDidMount(){
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    document.head.appendChild(script)
    window.onload = function () {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
//          login_uri: API_URL+"/auth/signin/google/tokensignin",
//          ux_mode:"redirect"
          callback:  handleOnSuccess,
//          auto_select: auto_select,
//          cancel_on_tap_outside: cancel_on_tap_outside,
//          context: contextValue
        });
        window.google.accounts.id.prompt (noti =>{
        console.log ("noti22", noti);
        });
    }
  }

    
   componentWillUnmount () {
      this.removeScript(this.GSI)
  }
  

  handleOnFailure (res)  {
    console.log('Login failed: res:', res);
    alert(`Failed to login.`
    );
  }


//        <GoogleOneTapLogin 
//          onError={this.handleOnFailure} 
//          onSuccess={this.handleOnSuccess} 
//          googleAccountConfigs={{ client_id:GOOGLE_CLIENT_ID}} 
//          />

  render() {
    return (
      <div>
        <BrowserRouter>
          <Routes></Routes>
        </BrowserRouter>
      </div>
    );  
  }
}

export default App;

// Polo Blue (OSD light blue): #8DADD4 rgb(141,173,212)
// lightest blue complement: #E1EAF4 rgb(225,234,244)

// Endeavour (OSD dark blue): #2F5596 rgb(47,85,150)
// lightest blue complement: #E0E8F5 rgb(224,232,245)

// Black Pearl: #0B1423 rgb(11,20,35)
// lightest blue complement 1: #EFF3FA rgb(239,243,250)

// Raven (grayish): #677080 rgb(103,112,128)

//button red: #B80000 rgb(184,0,0)
//button green: #008F00 rgb(0,143,0)
//button blue: #0000CC rgb(0,0,204)

/*
  "For event creators and promoters
  stuck with money-grabbing ticket platforms,
  OpenSeatDirect is a DIY alternative solution that
  allows them to get cash deposits at the time of sale
  and eliminate customer fees."
*/

/*
  A subscription-based DIY alternative
  solution that eliminates traditional
  ticketing middlemen allowing you to
  interact directly with your fans and
  control the entire ticketing process.
*/

/*

.ButtonBlue {
  height: 40px;
  width: 150px;
  background-color: #0000F5;
  color: #fff;
  border: 1px solid black;
  outline: none;
}
.ButtonBlue:hover {
  background-color: #0000CC;
  color: #fff;
  border: 1px solid black;
  outline: none;
}
.ButtonBlue:active {
  background-color: #0000A3;
  color: #fff;
  border: 1px solid black;
  outline: none;
}

.ButtonGreen {
  height: 40px;
  width: 150px;
  background-color: #00A300;
  color: #fff;
  border: 1px solid black;
  outline: none;
}
.ButtonGreen:hover {
  background-color: #007A00;
  color: #fff;
  border: 1px solid black;
  outline: none;
}
.ButtonGreen:active {
  background-color: #005200;
  color: #fff;
  border: 1px solid black;
  outline: none;
}

.ButtonRed {
  height: 40px;
  width: 150px;
  background-color: #CC0000;
  color: #fff;
  border: 1px solid black;
  outline: none;
}
.ButtonRed:hover {
  background-color: #A30000;
  color: #fff;
  border: 1px solid black;
  outline: none;
}
.ButtonRed:active {
  background-color: #7A0000;
  color: #fff;
  border: 1px solid black;
  outline: none;
}

.ButtonGrey {
  height: 40px;
  width: 150px;
  background-color: #999999;
  color: white;
  border: 1px solid black;
  outline: none;
  font-size: 16px;
}
.ButtonGrey:hover {
  background-color: #858585;
  color: white;
  border: 1px solid black;
  outline: none;
}
.ButtonGrey:active {
  background-color: #707070;
  color: white;
  border: 1px solid black;
  outline: none;
}
.SubmitButton {
  border: 1px solid black;
  border-radius: 0px;
  color: #fff;
  background-color: #2F5596;
  width: 340px;
  height: 40px;
  font-size: 14px;
}
.SubmitButton:hover {
  background-color: #1D355D;
  color: #fff;
  border: 1px solid black;
  font-weight: 500;
}
.SubmitButton:active {
  background-color: #fff;
  color: #2F5596;
  border: 2px solid #2F5596;
  font-weight: 600;
}
*/
