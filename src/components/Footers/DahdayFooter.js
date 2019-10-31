import React from "react";
import { NavLink } from "react-router-dom";

import OSDLogo from "../../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_32.png";
import dahdayLogo from "../../assets/dahday/dahday-white-logo-small.png";

const Footer = () => {
  return (
    <div className="col-2">
      <h6>
        Powered by
        <NavLink to="/" exact>
          <img src={OSDLogo} alt="OpenSeatDirect Logo" />
        </NavLink>
      </h6>
    </div>
  );
};

export default Footer;
