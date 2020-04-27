import React, { Component } from 'react'

import Backdrop from './Backdrop';
import Aux from '../Auxiliary';

import classes from "./Backdrop.module.css";


class Test extends Component {
    render () {

        return (
        <Aux>
                    <Backdrop show={true} clicked={this.changeBackground}/>
                    <div className={classes.Editor}>Something</div>

        </Aux>
        )
    }
}

export default Test;