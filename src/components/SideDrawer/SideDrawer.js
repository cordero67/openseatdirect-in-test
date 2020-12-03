import React from 'react';
import { withRouter } from 'react-router-dom';

import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

//<i class="far fa-window-close"></i>

import logo from '../../assets/OpenSeatDirect/BlueLettering_TransparentBackground_1024.png';

import SideDrawerItems from './SideDrawerItems';
import Backdrop from '../UI/Backdrop/Backdrop';
import Logo from '../Logo/Logo';
import classes from './SideDrawer.module.css';
import Aux from '../../hoc/Auxiliary/Auxiliary';

const SideDrawer = ( props ) => {

    let attachedClasses = [classes.SideDrawer, classes.Close];
    if (props.open) {
        attachedClasses = [classes.SideDrawer, classes.Open];
    }

    return (
        <Aux>
            <Backdrop show={props.open} clicked={props.closed}/>
            <div className={attachedClasses.join(' ' )}>
                <div className={classes.Title}>
                    <Logo source={logo} placement="side"/>
                    <div style={{paddingTop: "10px", paddingLeft: "12px", fontSize: "20px"}}>
                    <FontAwesomeIcon
                        size="1x"
                        color="grey"
                        cursor = "pointer"
                        onClick={props.closed}
                        icon={faTimes}
                    />
                    </div>
                </div>
                <Nav>
                    <SideDrawerItems clicked={props.closed}/>
                </Nav>
            </div>
        </Aux>
    );
};

export default withRouter(SideDrawer);