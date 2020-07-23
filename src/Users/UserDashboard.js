import React from "react";
//import { Link, Redirect } from "react-router-dom";
//import { Form } from "react-bootstrap";

import { API } from "../config";
//import { signin, authenticate, isAuthenticated } from "./apiUsers";

import classes from "./User.module.css";

const UserDashboard = () => {

    let TOKEN ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDlkNzIzN2VjODAwYjZlOTM1NTg4ODgiLCJpYXQiOjE1ODkyMDkwNjR9.C1Wu4geQWblwCOJMvEbjLwpZ8m6z4I2UDL5AtDhb1W4";
    let USER_ID ="5d9d7237ec800b6e93558888";
    //let SIGNOK  = false;
  

    function handleGetEvents() {   // txt == content of form input
        console.log (" in handleGetEvents");
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + TOKEN);
        console.log("TOKEN: ",TOKEN)
        let requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
        console.log (myHeaders);
        let fetchstr = `${API}/event/${USER_ID}`;
        console.log ("about to fetch: ", fetchstr, requestOptions );
        fetch(fetchstr, requestOptions)
          .then(response => response.text())
          .then(result => {
                  console.log(result);
                  //let js  = JSON.parse (result);
                  //refreshEventTable( EVENT_TABLE_ID,js);
                  //SIGNOK = true;
                  })
          .catch(error => {
            console.log('error', error);
            //SIGNOK = false;
          });
      }





  
    return (
      <div className={classes.DashboardContainer}>
        <div className={classes.DashboardCanvas}>
            <div className={classes.DashboardNavigation}>
                <div className={classes.NavigationItem}>
                    <div>Events</div>
                    <div>{handleGetEvents()}</div>
                </div>
                <div className={classes.NavigationItem}>Profile</div>
                <div className={classes.NavigationItem}>Password</div>
                <div className={classes.NavigationItem}>Payment Gateway</div>
                <div className={classes.NavigationItem}>Create Event</div>
                <div className={classes.NavigationItem}>Social Media Links</div>
            </div>
            <div className={classes.DashboardMain}>
                <div>User Dashboard: Coming Soon!!!</div>
                <div>Account Information</div>
                <div>Purchase History</div>
                <div>Ticket Wallet</div>
            </div>
        </div>
      </div>
    );
  };

export default UserDashboard;