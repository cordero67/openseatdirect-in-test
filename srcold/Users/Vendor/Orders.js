import React, { useState } from "react";

import Aux from "../../hoc/Auxiliary/Auxiliary";

import classes from "./VendorDashboard.module.css";

const Orders = (props) => {
    return (
        <div>
            <div className={classes.DisplayPanelTitle}>
                ORDERS
            </div>
            <div className={classes.DisplayPanel}>
                <div style={{fontSize: "24px"}}>Coming soon!!!</div>
            </div>
        </div>
    )
}

export default Orders;