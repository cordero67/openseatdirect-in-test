import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";

// Polo Blue (OSD light blue): #8DADD4 rgb(141,173,212)
// Endeavour (OSD dark blue): #2F5596 rgb(47,85,150)

// Raven (grayish): #677080 rgb(103,112,128)
// Black Pearl: #0B1423 rgb(11,20,35)

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
