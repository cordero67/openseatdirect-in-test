import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { Form } from "react-bootstrap";
import moment from "moment";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faChevronUp,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";

import VendorNavigation from "./VendorNavigation";

import classes from "./User.module.css";

const VendorOrders = () => {
  //const [vendorInfo, setVendorInfo] = useState();
  const [vendorOrders, setVendorOrders] = useState();
  const [sortParameters, setSortParameters] = useState(
    {label: "createdAt", direction: "asc"}
  );

  let vendorInfo = {};
  let tempUser = {};
  tempUser = JSON.parse(localStorage.getItem("user"));
  vendorInfo.token = tempUser.token;
  vendorInfo.name = tempUser.user.name;
  vendorInfo.email = tempUser.user.email;
  vendorInfo.role = tempUser.user.role;
  vendorInfo.id = tempUser.user._id;

  const [isLoading, setIsLoading] = useState(true);

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
      //"https://www.openseatdirect.com/api/event/all/" + tempInfo.id;
  "https://www.openseatdirect.com/api/orders/" + vendorInfo.id;
    console.log("about to fetch: ", fetchstr, requestOptions);
    fetch(fetchstr, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        let js = JSON.parse(result);
        console.log("vendorOrders: ", js);

        //js.sort(compare);

        
        js.sort(compareValues(sortParameters.label, sortParameters.dir));

        setVendorOrders(js);
        //SIGNOK = true;
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        //SIGNOK = false;
        setIsLoading(false);
      });
  }, []);

  const compareValues = (key, order) => {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

  const updateValues = (newLabel) => {
    let newDirection;
    if (newLabel !== sortParameters.label) {
      newDirection = sortParameters.direction;
    } else if (sortParameters.direction === "asc") {
      newDirection = "desc";
    } else {
      newDirection = "asc";
    }

    console.log("Inside updateValues")
    console.log("label argument: ", newLabel)
    console.log("direction calculation: ", newDirection)
    let temp;
    temp = [...vendorOrders];
    temp.sort(compareValues(newLabel, newDirection));
    setVendorOrders(temp);
    setSortParameters(
      {label: newLabel, direction: newDirection}
    )
  }

  const mainDisplay = () => {
    if (!isLoading) {
      return (
        <div>
                          <div
                            style={{
                              zIndex: "200",
                              display: "grid",
                              position: "fixed",
                              top: "195px",
                              columnGap: "5px",
                              backgroundColor: "#f8f8f8",
                              borderBottom: "1px solid lightgrey",
                              width: "745px",
                              gridTemplateColumns: "180px 150px 260px 80px 10px",
                              fontSize: "15px",
                              paddingTop: "15px",
                              paddingBottom: "15px",
                              paddingLeft: "20px",
                              paddingRight: "30px",
                            }}
                          >

                         

                            <div className={classes.Expand}>Transaction{" "}
                              <button 
                                className={classes.SortButton}
                                name="createdAt"
                                onClick={(e) => {updateValues(e.target.name)}}
                              >
                                Date
                              </button>
                              /
                              <button 
                                className={classes.SortButton}
                                name="_id"
                                onClick={(e) => {updateValues(e.target.name)}}
                              >
                                ID
                              </button>
                            </div>

                            <div className={classes.Expand}>
                              <button 
                                className={classes.SortButton}
                                name="firstName"
                                onClick={(e) => {updateValues(e.target.name)}}
                              >
                                First
                              </button>
                              /
                              <button 
                                className={classes.SortButton}
                                name="lastName"
                                onClick={(e) => {updateValues(e.target.name)}}
                              >
                                Last
                              </button>
                              {" "}Name
                            </div>

                            <div className={classes.Expand}>
                              <button 
                                className={classes.SortButton}
                                name="email"
                                onClick={(e) => {updateValues(e.target.name)}}
                              >
                                Email
                              </button>
                            </div>

                            <div className={classes.Expand}>
                              <button 
                                className={classes.SortButton}
                                name="totalAmount"
                                onClick={(e) => {updateValues(e.target.name)}}
                              >
                                Amount
                              </button>
                            </div>

                            <div></div>
                          </div>

              <div style={{marginTop: "110px", overflowY: "auto"}}>
              {vendorOrders.map((item, index) => {
                console.log("item: ", item);
                console.log("date: ", moment(item.createdAt).format('MM/DD/YYYY'));
                let date = moment(item.createdAt).format('MM/DD/YYYY - h:mm a');
                return (
                  <div key={index}>
                              <div
                                style={{
                                  display: "grid",
                                  columnGap: "5px",
                                  backgroundColor: "#fff",
                              gridTemplateColumns: "180px 150px 260px 80px 10px",
                                  fontSize: "15px",
                                  paddingTop: "10px",
                                  paddingLeft: "20px",
                                  paddingBottom: "5px",
                                  paddingRight: "30px"
                                }}
                              >
                                <div>{date}<br></br><span style={{fontSize: "12px"}}>#{item._id}</span></div>
                                <div>{item.firstName}{" "}{item.lastName}</div>
                                <div>{item.email}</div>
                                <div>{item.paymentCurrency}{" "}{item.totalAmount}</div>
                                                                      <FontAwesomeIcon
                                        className={classes.faChevronUp}
                                        size=".875x"
                                        cursor = "pointer"
                                        icon={faChevronDown}
                                      />
                              </div>
                  </div>
                )
              })}
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
        <div className={classes.DashboardTitle}>{vendorInfo.name}{" "}Dashboard</div>
        <div className={classes.DashboardMain}>
          <div className={classes.DashboardNavigation}>
            <VendorNavigation></VendorNavigation>
          </div>
          <div className={classes.DashboardPanel}>
              <div
                style={{
                  position: "fixed",
                  top: "135px",
                  backgroundColor: "#fff",
                  zIndex: "200",
                  width: "745px",
                  fontSize: "26px",
                  paddingTop: "20px",
                  paddingLeft: "20px",
                  paddingRight: "30px",
                  paddingBottom: "20px",
                  borderBottom: "1px solid lightgrey",
                }}
              >
                Orders
              </div>
            <div
              style={{overflowY: "auto"}}>{mainDisplay()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorOrders;
