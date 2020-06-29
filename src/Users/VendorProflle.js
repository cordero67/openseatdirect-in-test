import React, { useState, useEffect } from "react";

import VendorNavigation from "./VendorNavigation";

import { API } from "../config";
import classes from "./User.module.css";

const VendorAccount = () => {
  //const [vendorInfo, setVendorInfo] = useState();
  //const [eventDetails, setEventDetails] = useState();
  const [isLoading, setIsLoading] = useState(true);

  let vendorInfo = {};
  let tempUser = {};
  tempUser = JSON.parse(localStorage.getItem("user"));
  vendorInfo.token = tempUser.token;
  vendorInfo.name = tempUser.user.name;
  vendorInfo.email = tempUser.user.email;
  vendorInfo.role = tempUser.user.role;
  vendorInfo.id = tempUser.user._id;

  useEffect(() => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + vendorInfo.token);
    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    let fetchstr =
      `${API}/event/all/${vendorInfo.id}`;
    console.log("about to fetch: ", fetchstr, requestOptions);
    fetch(fetchstr, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        let js = JSON.parse(result);
        console.log("eventDetails: ", js);
        //setEventDetails(js);
        //SIGNOK = true;
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        //SIGNOK = false;
        setIsLoading(false);
      });
  }, []);

  const summaryPanel = () => {
    if (!isLoading) {
      return (
        <div style={{ fontSize: "26px" }}>
          <div
            style={{
              paddingBottom: "20px",
              borderBottom: "1px solid lightgrey",
            }}
          >
            Account Settings
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className={classes.DashboardContainer}>
      <div className={classes.DashboardCanvas}>
        <div className={classes.DashboardTitle}>
          {vendorInfo.name} Dashboard
        </div>
        <div className={classes.DashboardMain}>
          <div className={classes.DashboardNavigation}>
            <VendorNavigation></VendorNavigation>
          </div>
          <div className={classes.DashboardPanel}>
            <div
              style={{
                fontSize: "26px",
                paddingTop: "20px",
                paddingLeft: "20px",
                paddingRight: "30px",
              }}
            >
              <div
                style={{
                  paddingBottom: "20px",
                  borderBottom: "1px solid lightgrey",
                }}
              >
                Profile
              </div>
            </div>
            <div
              style={{
                fontSize: "26px",
                paddingTop: "20px",
                paddingLeft: "20px",
                paddingRight: "30px",
                paddingBottom: "5px",
              }}
            >
              <div style={{ fontSize: "20px" }}>Password Reset</div>
              <br></br>

              <form style={{ paddingLeft: "20px" }}>
                <div className="form-group">
                  <label style={{ fontSize: "12px" }}>Current Password</label>
                  <input
                    style={{ width: "350px" }}
                    type="text"
                    name="name"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: "12px" }}>New Password</label>
                  <input
                    style={{ width: "350px" }}
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Must contain a number and special character"
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: "12px" }}>
                    Re-Enter New Password
                  </label>
                  <input
                    style={{ width: "350px" }}
                    type="password"
                    name="password"
                    className="form-control"
                  />
                </div>

                <button className="btn btn-primary">Submit</button>
              </form>
            </div>
            <br></br>

          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorAccount;
