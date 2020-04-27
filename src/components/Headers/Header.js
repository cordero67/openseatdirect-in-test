import React from 'react';

import { withRouter } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

import Logo from '../Logo/Logo';
import HeaderItems from './HeaderItems'
import classes from './Header.module.css';

const Header = ({ history, logo, positioning, clicked }) => {
  
  let headerDisplay;

  headerDisplay = (
    <header className={classes.Header} style={{position: positioning}}>
      <div>
        <Nav>
          <Logo source={logo} placement="header"/>
        </Nav>
      </div>
      <div className={classes.Navigation}>
        <Nav>
          <HeaderItems currentPage={history.location.pathname}/>
        </Nav>
      </div>
      <div className={classes.Toggle} onClick={clicked}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
  );
  
  return <div>{headerDisplay}</div>;
};

export default withRouter(Header);
