import React from 'react';
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

    return (
        <ul className={classes.HeaderItems}>
            <li>
                <NavLink
                    to="/events"
                    style={isActive(props.currentPage, "/events")}
                >EVENTS
                </NavLink>
            </li>

            <li>
                <NavLink
                    to="/eventspast"
                    style={isActive(props.currentPage, "/eventspast")}
                >PAST EVENTS
                </NavLink>
            </li>

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