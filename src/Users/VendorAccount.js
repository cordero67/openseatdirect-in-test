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
                Account Settings
              </div>
            </div>
            <br></br>

            <div
              style={{
                fontSize: "26px",
                paddingTop: "20px",
                paddingLeft: "20px",
                paddingRight: "30px",
                paddingBottom: "5px",
              }}
            >
              <div style={{ fontSize: "20px" }}>Payment Information</div>

              <div style={{ paddingLeft: "20px" }}>
                <div
                  style={{
                    display: "grid",
                    columnGap: "5px",
                    backgroundColor: "#f8f8f8",
                    paddingTop: "20px",
                    fontSize: "16px",
                    width: "400px",
                    gridTemplateColumns: "105px 250px",
                  }}
                >
                  <div style={{ paddingTop: "5px", textAlign: "right" }}>
                    Paypal Email:
                  </div>
                  <div style={{ paddingTop: "5px" }}>johndoe@xmail.com</div>
                </div>
                <div
                  style={{
                    display: "grid",
                    columnGap: "5px",
                    backgroundColor: "#f8f8f8",
                    paddingTop: "20px",
                    fontSize: "16px",
                    width: "400px",
                    gridTemplateColumns: "105px 250px",
                  }}
                >
                  <div>
                    <button
                      className="btn btn-primary"
                      style={{
                        width: "70px",
                        backgroundColor: "green",
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
              <br></br>
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
              <div style={{ fontSize: "20px" }}>Payment Gateway</div>

              <div style={{ paddingLeft: "20px" }}>
                <div
                  style={{
                    display: "grid",
                    columnGap: "5px",
                    backgroundColor: "#f8f8f8",
                    paddingTop: "20px",
                    fontSize: "16px",
                    width: "400px",
                    gridTemplateColumns: "105px 250px",
                  }}
                >
                  <div style={{ paddingTop: "5px", textAlign: "right" }}>
                    Gateway:
                  </div>
                  <div style={{ paddingTop: "5px" }}>
                    PayPal Express Buttons
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    columnGap: "5px",
                    backgroundColor: "#f8f8f8",
                    paddingTop: "20px",
                    fontSize: "16px",
                    width: "910px",
                    gridTemplateColumns: "105px 800px",
                  }}
                >
                  <div style={{ paddingTop: "5px", textAlign: "right" }}>
                    Client ID:
                  </div>
                  <div style={{ paddingTop: "5px" }}>
                    AQdWzLz5fiOs9ub51DS_ndZDPJZ7rtpZF1ul4fvErAIsv-lrAuMshmlJLKX5gB5OZtwdyqUHmfuenYgj
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    columnGap: "5px",
                    backgroundColor: "#f8f8f8",
                    paddingTop: "20px",
                    fontSize: "16px",
                    width: "910px",
                    gridTemplateColumns: "105px 800px",
                  }}
                >
                  <div style={{ paddingTop: "5px", textAlign: "right" }}>
                    Secret:
                  </div>
                  <div style={{ paddingTop: "5px" }}>
                    EGZD8GX7Mn_BmmlNUoG83pAxsn9BBv0BFu3ysBRG9ThIb8qLY940ssZEU-X4lBT6iKnI0v44haXdod8X
                  </div>
                  <div
                    style={{
                      paddingTop: "20px",
                    }}
                  >
                    <button
                      className="btn btn-primary"
                      style={{
                        width: "70px",
                        backgroundColor: "green",
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
              <br></br>
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
              <div style={{ fontSize: "20px" }}>Social Media Links</div>
              <div style={{ paddingLeft: "20px" }}>
                <div
                  style={{
                    display: "grid",
                    columnGap: "5px",
                    backgroundColor: "#f8f8f8",
                    paddingTop: "20px",
                    fontSize: "16px",
                    width: "400px",
                    gridTemplateColumns: "95px 100px",
                  }}
                >
                  <div style={{ paddingTop: "5px", textAlign: "right" }}>
                    facebook:{" "}
                  </div>
                  <div style={{ paddingTop: "5px" }}>
                    www.facebook.com/acmepromotions
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    columnGap: "5px",
                    fontSize: "16px",
                    backgroundColor: "#f8f8f8",
                    paddingTop: "20px",
                    fontSize: "16px",
                    width: "400px",
                    gridTemplateColumns: "95px 100px",
                  }}
                >
                  <div style={{ paddingTop: "5px", textAlign: "right" }}>
                    linkedin:{" "}
                  </div>
                  <div style={{ paddingTop: "5px" }}>
                    www.linkedin.com/acmepromotions
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    columnGap: "5px",
                    backgroundColor: "#f8f8f8",
                    paddingTop: "20px",
                    fontSize: "16px",
                    width: "400px",
                    gridTemplateColumns: "95px 100px",
                  }}
                >
                  <div style={{ paddingTop: "5px", textAlign: "right" }}>
                    twitter:{" "}
                  </div>
                  <div style={{ paddingTop: "5px" }}>
                    www.twitter.com/acmepromotions
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    columnGap: "5px",
                    backgroundColor: "#f8f8f8",
                    paddingTop: "20px",
                    fontSize: "16px",
                    width: "400px",
                    gridTemplateColumns: "95px 100px",
                  }}
                >
                  <div style={{ paddingTop: "5px", textAlign: "right" }}>
                    instagram:{" "}
                  </div>
                  <div style={{ paddingTop: "5px" }}>
                    www.instagram.com/acmepromotions
                  </div>
                </div>
                <div
                  style={{
                    paddingTop: "20px",
                  }}
                >
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "70px",
                      backgroundColor: "green",
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
              <br></br>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorAccount;
