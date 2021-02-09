import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";

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

import Routes from "./components/Routes/Routes";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes></Routes>
      </BrowserRouter>
    );
  }
}

export default App;
