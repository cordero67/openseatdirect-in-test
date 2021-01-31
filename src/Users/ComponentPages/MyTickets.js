import React, { useState } from "react";

import classes from "./MyTickets.module.css";

const MyTickets = (props) => {
    return (
        <div>
            <div className={classes.DisplayPanelTitle}>
                My Tickets
            </div>
            <div className={classes.DisplayPanel}>
                <div style={{fontSize: "24px"}}>Coming soon!!!</div>
            </div>
        </div>
    )
}

export default MyTickets;