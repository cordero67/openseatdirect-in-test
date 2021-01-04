import React from "react";

import Aux from "../../hoc/Auxiliary/Auxiliary";

import { Form, Radio } from 'semantic-ui-react';

const RadioForm = (props) => {

    const formField = () => {
        return (
            <Aux>
                {props.details.map((item, index) => {
                    return (
                        <Form.Field
                            key={index}
                            style={{height: "30px", lineHeight: "30px", margin: "0px"}}>
                            <Radio
                                style={{fontSize: "15px"}}
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
        <Form style={{
            border: "1px solid #8DADD4",
            backgroundColor: "#EFF3FA",
            padding: "10px 10px 10px 10px",
            fontSize: "16px",
        }}>
            {formField()}
        </Form>
    )

}

export default RadioForm;