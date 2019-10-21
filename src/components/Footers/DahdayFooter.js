import React from "react";
import { NavLink } from "react-router-dom";

import OSDLogo from "../../assets/BlueLettering_WhiteBackground/BlueLettering_WhiteBackground_32.png";
import dahdayLogo from "../../assets/dahday/dahday-white-logo-small.png";

const Footer = () => {
  return (
    <div className="row">
      <div className="col-2"></div>
      <div className="col-7">
        <h6>
          Presented by
          <a href="https://www.dahday.com/">
            <img src={dahdayLogo} alt="Dahday Logo" />
          </a>
        </h6>
      </div>
      <div className="col-2">
        <h6>
          Powered by
          <NavLink to="/" exact>
            <img src={OSDLogo} alt="OpenSeatDirect Logo" />
          </NavLink>
        </h6>
      </div>
    </div>
  );
};

export default Footer;
