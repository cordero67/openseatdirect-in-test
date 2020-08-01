import React, { useState } from "react";

import Aux from "../../hoc/Auxiliary/Auxiliary";

import classes from "./BuyerDashboard.module.css";

const VendorOnboarding = (props) => {
    return (
        <div>
            <div className={classes.DisplayPanelTitle}>
            VENDOR SIGNUP
            </div>
            <div className={classes.DisplayPanel}
            style={{textAlign: "center"}}>
                <br></br>
                <br></br>
                <br></br>
                <div style={{fontSize: "26px", fontWeight: "600"}}>3 easy steps to start selling tickets and receive your cash now!!!</div>
                <br></br>
                <br></br>
                <br></br>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "240px 240px 240px",
                    columnGap: "60px",
                    paddingLeft: "75px",
                    fontSize: "22px",
                    fontWeight: "600",
                    textAlign: "center"}}>
                    <div>Step 1</div>
                    <div>Step 2</div>
                    <div>Step 3</div>
                </div>
                <br></br>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "240px 240px 240px",
                    columnGap: "60px",
                    paddingLeft: "75px",
                    fontSize: "18px",
                    fontWeight: "600",
                    textAlign: "center"}}>
                    <div>Create a Vendor Account</div>
                    <div>Link your PayPal </div>
                    <div>Setup your first event</div>
                </div>
                <br></br>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "240px 240px 240px",
                    columnGap: "60px",
                    paddingLeft: "75px",
                    textAlign: "left"}}>
                    <div>Tell us about your organization start off with a free trial and chose a plan</div>
                    <div>Link your Paypal business account to your events’ checkout pages so ticket buyers’ money routes directly to you. OpenSeatDirect never touches money.</div>
                    <div>Go to your event creation screen to setup your first event, sell tickets and get your cash fast.</div>
                </div>






            </div>
        </div>
    )
}

export default VendorOnboarding;