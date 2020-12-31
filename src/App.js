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
