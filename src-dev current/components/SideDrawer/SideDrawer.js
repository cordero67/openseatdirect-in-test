import React from 'react';
import { withRouter } from 'react-router-dom';

import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

//<i class="far fa-window-close"></i>

import logo from '../../assets/OpenSeatDirect/BlueLettering_TransparentBackground_1024.png';
//import logo from '../../assets/OpenSeatDirect/Black_and_White_TransparentBackground_1024.png';

import SideDrawerItems from './SideDrawerItems';
import Backdrop from '../UI/Backdrop/Backdrop';
import Logo from '../Logo/Logo';
import classes from './SideDrawer.module.css';
import Aux from '../../hoc/Auxiliary/Auxiliary';

const SideDrawer = ( { history, open, closed }) => {

    let attachedClasses = [classes.SideDrawer, classes.Close];
    if (open) {
        attachedClasses = [classes.SideDrawer, classes.Open];
    }

    return (
        <Aux>
            <Backdrop show={open} clicked={closed}/>
            <div className={attachedClasses.join(' ' )}>
                <div className={classes.Title}>
                    <div style={{paddingTop: "10px", paddingLeft: "12px", fontSize: "20px"}}>
                        <FontAwesomeIcon
                            size="2x"
                            color="white"
                            cursor = "pointer"
                            onClick={closed}
                            icon={faTimes}
                        />
                    </div>
                </div>
                <Nav>
                    <SideDrawerItems currentPage={history.location.pathname} clicked={closed}/>
                </Nav>
            </div>
        </Aux>
    );
};

export default withRouter(SideDrawer);

//<Logo source={logo} placement="side"/>