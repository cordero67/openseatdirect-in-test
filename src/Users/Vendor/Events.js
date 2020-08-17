import React, { useState } from "react";

import Aux from "../../hoc/Auxiliary/Auxiliary";

import classes from "./VendorDashboard.module.css";

const Events = (props) => {
    return (
        <div>
            <div className={classes.DisplayPanelTitle}>
                EVENTS
            </div>
            <div className={classes.DisplayPanel2}>
                <div className={classes.MainDisplayHeader}>
                    <div style={{ textAlign: "center" }}>Date</div>
                    <div></div>
                    <div className={classes.Expand}>Event</div>
                    <div style={{ textAlign: "center" }}>Status</div>
                    <div style={{ textAlign: "center" }}>Edit</div>
                </div>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <div style={{ textAlign: "center", fontSize: "20px" }}>You currently have no events.</div>
            </div>
        </div>
    )
}

export default Events;