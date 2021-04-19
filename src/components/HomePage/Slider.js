import React, { useState } from "react";

import SliderContent from "./SliderContent";
//import styled from '@emotion/styled';

const Slider = () => {
  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      Slider component
      <SliderContent translate="0" transition="0.45" width="600px" color="red">
        Slider content
      </SliderContent>
    </div>
  );
};

export default Slider;
