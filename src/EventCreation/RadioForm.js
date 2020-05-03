import React, { useState } from "react";

import classes from './EventCreation.module.css';
import Aux from "../hoc/Auxiliary/Auxiliary";

import { Form, Radio } from 'semantic-ui-react';

const RadioForm = (props) => {

    const formField = () => {
        return (
            <Aux>
                {props.details.map((item, index) => {
                    return (
                        <Form.Field key={index} style={{height: "30px", padding: "5px", margin: "0px"}}>
                            <Radio style={{fontSize: "16px"}}
                                label={item.label}
                                name={props.group}
                                value={item.value}
                                checked={props.current === item.value}
                                onChange={ (event, { value }) => props.change(event, { value })}
                            />
                        </Form.Field>
                    )
                })}
            </Aux>
        )
    }

    return (
        <Form style={{padding: "0px 0px 0px 35px", fontSize: "16px", backgroundColor: "#E7E7E7"}}>
            {formField()}
        </Form>
    )

}

export default RadioForm;