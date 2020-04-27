import React, { useState } from 'react';
import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

import Aux from '../../hoc/Auxiliary/Auxiliary';
import classes from './SideDrawerItems.module.css';

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

const SideDrawerItems = (props) => {

    const [showSubItems, setShowSubItems] = useState(false);

    const changeShowItems = (setting) => {
        setShowSubItems(setting);
    }

    return (
        <ul className={classes.SideItems}>
            <li>
                <NavLink
                    to="/events"
                    style={isActive(props.currentPage, "/events")}
                    onClick={props.clicked}
                >EVENTS
                </NavLink>
            </li>

            <li>
                <NavLink
                    to="/eventcreation"
                    style={isActive(props.currentPage, "/eventcreation")}
                    onClick={props.clicked}
                >EVENT CREATION
                </NavLink>
            </li>

            <li>
                <NavLink
                    to="/"
                    style={isActive(props.currentPage, "/")}
                    onClick={props.clicked}
                >DASHBOARD
                </NavLink>
            </li>

            <li>
                <div className={classes.Title}>
                    <div>OPENSEATDIRECT</div>
                    {showSubItems ? 
                    (<FontAwesomeIcon
                        cursor = "pointer"
                        onClick={() => changeShowItems(false)}
                        icon={faMinus}
                    />) : (<FontAwesomeIcon
                        cursor = "pointer"
                        onClick={() => changeShowItems(true)}
                        icon={faPlus}
                    />)}
                </div>
            </li>

            <div>
                {showSubItems ? 
                    (<Aux>
                        <div style={{borderBottom: "1px solid lightgrey", paddingLeft: "20px"}}>
                            <li style={{borderBottom: "1px solid lightgrey"}}>
                                <NavLink
                                    to="/"
                                    style={isActive(props.currentPage, "/")}
                                    onClick={props.clicked}
                                    exact
                                >HOME
                                </NavLink>
                            </li>
                            <li style={{borderBottom: "1px solid lightgrey"}}>
                                <NavLink
                                    to="/video"
                                    style={isActive(props.currentPage, "/video")}
                                    onClick={props.clicked}
                                    exact
                                >ABOUT US
                                </NavLink>
                            </li>
                            <li style={{borderBottom: "0px"}}>
                                <NavLink
                                    to="/contactus"
                                    style={isActive(props.currentPage, "/contactus")}
                                    onClick={props.clicked}
                                    exact
                                >CONTACT US
                                </NavLink>
                            </li>
                        </div>
                    </Aux>)
                 : null}
            </div>

            <li>
                <NavLink
                    to="/"
                    style={isActive(props.currentPage, "/")}
                    onClick={props.clicked}
                >SIGN OUT
                </NavLink>
            </li>

        </ul>
    )
}

export default SideDrawerItems;