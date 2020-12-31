import React, { useState } from 'react';

const SliderContent = (props) => {
    const styleTransform = `translateX(-${props.translate}px)`;
    const styleTransition = `transform ease-out ${props.transition}s`;
    const styleWidth = `${props.width}`
    const styleColor = `${props.color}`

    return (
        <div
            style={{
                transform: styleTransform,
                transition: styleTransition,
                height: "100%",
                width: styleWidth,
                color: props.color,
                display: "flex"
            }}>
                {props.children}
                <br></br>
                SliderContent component another
            </div>
    )
}

export default SliderContent