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

.ButtonRed {
  height: 40px;
  width: 127px;
  background-color: #B80000;
  color: #fff;
  border: 1px solid black;
  outline: none;
}
.ButtonRed:hover {
  background-color: #8F0000;
  color: #fff;
  border: 1px solid black;
  font-weight: 500;
  outline: none;
}
.ButtonRed:active {
  background-color: #fff;
  color: #B80000;
  border: 2px solid #B80000;
  font-weight: 600;
  outline: none;
}
.ButtonBlue {
  height: 40px;
  width: 127px;
  background-color: #0000CC;
  color: #fff;
  border: 1px solid black;
  outline: none;
}
.ButtonBlue:hover {
  background-color: #000066;
  color: #fff;
  border: 1px solid black;
  font-weight: 500;
  outline: none;
}
.ButtonBlue:active {
  background-color: #fff;
  color: #0000CC;
  border: 2px solid #0000CC;
  font-weight: 600;
  outline: none;
}
.ButtonGreen {
  height: 40px;
  width: 127px;
  background-color: #008F00;
  color: #fff;
  border: 1px solid black;
  outline: none;
}
.ButtonGreen:hover {
  background-color: #006600;
  color: #fff;
  border: 1px solid black;
  font-weight: 500;
  outline: none;
}
.ButtonGreen:active {
  background-color: #fff;
  color: #008F00;
  border: 2px solid #008F00;
  font-weight: 600;
  outline: none;
}
.ButtonGreenOpac {
  height: 40px;
  width: 200px;
  background-color: #008F00;
  opacity: 0.3;
  color: white;
  font-weight: 400;
  border: 1px solid grey;
  outline: none;
}
.ButtonGrey {
  height: 40px;
  width: 150px;
  background-color: #fff;
  color: black;
  border: 1px solid black;
  outline: none;
}
.ButtonGrey:hover {
  background-color: grey;
  color: white;
  border: 1px solid black;
  font-weight: 500;
  outline: none;
}
.ButtonGrey:active {
  background-color: lightgray;
  color: black;
  border: 2px solid black;
  font-weight: 600;
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
