import React, { Component } from 'react'

import ImgDropAndCrop from './ImgDropAndCrop'

class ImageSelector extends Component {
  render () {
    return (
      <div style={{ textAlign: "center"}}>
        <ImgDropAndCrop />
      </div>
    )
  }
}

export default ImageSelector;