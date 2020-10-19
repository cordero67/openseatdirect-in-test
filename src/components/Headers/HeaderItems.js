import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { isAuthenticated } from '../../Users/apiUsers';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import classes from './HeaderItems.module.css';

// determines if current menu item, i.e. "<NavLink>" is the active link
// "page" represents the actual active path
// "path" represents the path defined in the respective "<NavLink>"
const isActive = (page, path) => {
    if (page === path) {
        return { color: "#007BFF" };
    } else {
        return { color: "#000" };
    }
};

const NavigationItems = (props) => {

    const [isResizing, setIsResizing] = useState(false);
    //const [screenSize, setScreenSize] = useState(window.innerWidth);
    const [screenSize, setScreenSize] = useState(500);
    console.log("screenSize: ", screenSize)
    
    const stylingUpdate = (inWidth) => {
        console.log("stylingUpdate in Header")
        setIsResizing(true);
        setScreenSize(inWidth);
        setIsResizing(false);
        console.log("screenSize in Header: ", screenSize)
    };

    return (
        <ul className={classes.HeaderItems}>
            <li>
                <NavLink
                    to="/events"
                    style={isActive(props.currentPage, "/events")}
                >EVENTS
                </NavLink>
            </li>

            {screenSize === 400 ? (
            <li>
                <NavLink
                    to="/eventspast"
                    style={isActive(props.currentPage, "/eventspast")}
                >PAST EVENTS
                </NavLink>
            </li>)

            : null}

            {!isAuthenticated() && 
                <li>
                    <NavLink
                        to="/signin"
                        style={isActive(props.currentPage, "/signin")}
                    >SIGN IN
                    </NavLink>
                </li>
            }

            {isAuthenticated() && 
                <li>
                    <NavLink
                        to="/signin"
                        onClick={props.signOut}
                        style={{color: "#000"}}
                    >SIGN OUT
                    </NavLink>
                </li>
            }


        </ul>
    )
}

export default NavigationItems;