import React, { useState } from "react";

import Aux from "../../hoc/Auxiliary/Auxiliary";

import classes from "./BuyerDashboard.module.css";

const TicketWallet = (props) => {
    return (
        <div>
            <div className={classes.DisplayPanelTitle}>
            TICKET WALLET
            </div>
            <div className={classes.DisplayPanel}>
                <div style={{fontSize: "24px"}}>Comming soon!!!</div>
            </div>
        </div>
    )
}

export default TicketWallet;