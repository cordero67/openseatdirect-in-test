import React, { useState, useEffect } from "react";

import { API } from "../config";

import AdminNavigation from "./AdminNavigation";

import classes from "./User.module.css";

const AdminAccount = () => {
  //const [vendorInfo, setVendorInfo] = useState();
  const [eventDetails, setEventDetails] = useState();
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
        setEventDetails(js);
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
        <div className={classes.DashboardTitle}>OSD Admin Dashboard</div>
        <div className={classes.DashboardMain}>
          <div className={classes.DashboardNavigation}>
            <AdminNavigation></AdminNavigation>
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
                Account Settings
              </div>
            </div>
            <div
              style={{
                fontSize: "26px",
                paddingTop: "20px",
                paddingLeft: "20px",
                paddingRight: "30px",
              }}
            >
              <div style={{ paddingTop: "20px", fontSize: "22px" }}>
                Password Reset
              </div>
              <br></br>
            </div>
            <div
              style={{
                fontSize: "26px",
                paddingTop: "20px",
                paddingLeft: "20px",
                paddingRight: "30px",
              }}
            >
              <div style={{ paddingTop: "20px", fontSize: "22px" }}>
                Payment Information
              </div>
              <br></br>
            </div>
            <div
              style={{
                fontSize: "26px",
                paddingTop: "20px",
                paddingLeft: "20px",
                paddingRight: "30px",
              }}
            >
              <div style={{ paddingTop: "20px", fontSize: "22px" }}>
                Payment Gateway
              </div>
              <br></br>
            </div>
            <div
              style={{
                fontSize: "26px",
                paddingTop: "20px",
                paddingLeft: "20px",
                paddingRight: "30px",
              }}
            >
              <div style={{ paddingTop: "20px", fontSize: "22px" }}>
                Social Media Links
              </div>
              <br></br>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccount;
