import React, { useState } from "react";

import Aux from "../../hoc/Auxiliary/Auxiliary";

import classes from "./ControlPanel.module.css";

const Profile = (props) => {
    return (
        <div>
            <div className={classes.DisplayPanelTitle}>
                PROFILE
            </div>
            <div className={classes.DisplayPanel}>
                <div>Name:{" "}{props.isLoading ? null : props.name}</div>
                <br></br>
                <div>E-mail:{" "}{props.isLoading ? null : props.email}</div>
            </div>
        </div>
    )
}

export default Profile;