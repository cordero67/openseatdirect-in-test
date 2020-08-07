import React, { useState } from "react";

import Aux from "../../hoc/Auxiliary/Auxiliary";

import classes from "./VendorDashboard.module.css";

const Events = (props) => {
    return (
        <div>
            <div className={classes.DisplayPanelTitle}>
                EVENTS
            </div>
            <div className={classes.DisplayPanel}>
                <div style={{fontSize: "24px"}}>Coming soon!!!</div>
            </div>
        </div>
    )
}

export default Events;