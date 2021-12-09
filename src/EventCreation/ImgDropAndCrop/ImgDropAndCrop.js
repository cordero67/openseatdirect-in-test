import React, { Component, Fragment } from "react";
import Dropzone from "react-dropzone";

import ReactCrop from "react-image-crop";
import "./custom-image-crop.css";

import Backdrop from "./Backdrop";

import classes from "./Backdrop.module.css";

import {
  extractImageFileExtensionFromBase64,
  image64toCanvasRef2,
} from "./ResuableUtils";

import { Button } from "semantic-ui-react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

const imageMaxSize = 3000000; // bytes
const acceptedFileTypes =
  "image/gif, image/jpeg, image/png, image/svg+xml, image/webp";
const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => {
  return item.trim();
});

class ImgDropAndCrop extends Component {
  constructor(props) {
    super(props);
    this.imagePreviewCanvasRef = React.createRef();
    this.fileInputRef = React.createRef();
    this.state = {
      imgFile: null,
      imgSrc: null,
      imgSrcExt: null,
      imgSrcLoaded: false,
      editMode: false,
      crop: {
        aspect: 2 / 1,
        ruleOfThirds: true,
        x: 30,
        y: 30,
        width: 400,
        height: 200,
      },
      newimageData64: null,
      isCropping: false,
      percentCrop: {
        x: null,
        y: null,
        width: null,
        height: null,
      },
    };
  }

  IMAGE_WIDTH = 0;
  IMAGE_HEIGHT = 0;

  verifyFile = (files) => {
    if (files && files.length > 0) {
      const currentFile = files[0];
      if (!currentFile) {
        alert(" Only image files are allowed.");
        return false;
      }
      const currentFileType = currentFile.type;
      const currentFileSize = currentFile.size;
      if (currentFileSize > imageMaxSize) {
        let showmax = (imageMaxSize / 1000).toLocaleString("en");
        alert(
          "This file is not allowed. File size cannot exceed " +
            showmax +
            " Kbytes "
        );
        return false;
      }
      if (!acceptedFileTypesArray.includes(currentFileType)) {
        let showmax = (imageMaxSize / 1000).toLocaleString("en");
        alert(
          "File must be an image file with size no greater than " +
            showmax +
            " Kbytes "
        );
        return false;
      }
      return true;
    }
  };

  handleOnDrop = (files, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      this.verifyFile(rejectedFiles);
    }

    if (files && files.length > 0) {
      const isVerified = this.verifyFile(files);
      if (isVerified) {
        const currentFile = files[0];
        const myFileItemReader = new FileReader();
        myFileItemReader.addEventListener(
          "load",
          () => {
            const myResult = myFileItemReader.result;
            this.setState({
              imgFile: currentFile,
              imgSrc: myResult,
              imgSrcExt: extractImageFileExtensionFromBase64(myResult),
              isCropping: true,
            });
          },
          false
        );
        // added listener now reading file
        myFileItemReader.readAsDataURL(currentFile);
      }
    }
  };

  defaultCrop = (image) => {
    // sets the default crop. Centered and maximized space subject aspect ratio of 2
    const ASPECT_RATIO = 2 / 1;
    const w = image.width;
    const h = image.height;
    let xa, ya, wa, ha;
    // this is for a 2 by 1 crop
    if (w > ASPECT_RATIO * h) {
      // extra wide image
      ya = 0;
      xa = (w - ASPECT_RATIO * h) / 2;
      wa = ASPECT_RATIO * h;
      ha = h;
    } else {
      // narrow image
      xa = 0;
      ya = (h - w / ASPECT_RATIO) / 2;
      wa = w;
      ha = w / ASPECT_RATIO;
    }
    //console.log ("default crop: w h xa ya wa ha ", w, h, xa, ya, wa, ha);
    let { crop } = this.state;
    crop.aspect = ASPECT_RATIO;
    crop.ruleOfThirds = true;
    crop.x = xa;
    crop.y = ya;
    crop.width = wa;
    crop.height = ha;
    this.setState({ crop: crop });
  };

  handleImageLoaded = (image) => {
    let { percentCrop } = this.state;
    if (
      !(
        percentCrop.x === null ||
        percentCrop.y === null ||
        percentCrop.height === null ||
        percentCrop.width === null
      )
    ) {
      const w = image.width;
      const h = image.height;

      let { crop } = this.state;
      crop.aspect = 2;
      crop.ruleOfThirds = true;
      crop.x = percentCrop.x * w * 0.01;
      crop.y = percentCrop.y * h * 0.01;
      crop.width = percentCrop.width * w * 0.01;
      crop.height = percentCrop.height * h * 0.01;
      this.setState({ crop: crop });
    } else {
      this.defaultCrop(image);
    }
    const canvasRef = this.imagePreviewCanvasRef.current;
    const { imgSrc } = this.state;
    image64toCanvasRef2(canvasRef, imgSrc, percentCrop);
  };

  handleOnCropChange = (crop) => {
    this.setState({ crop: crop });
  };

  handleOnCropComplete = (crop, percentCrop) => {
    this.setState({ percentCrop: percentCrop });
    const canvasRef = this.imagePreviewCanvasRef.current;
    const { imgSrc } = this.state;
    image64toCanvasRef2(canvasRef, imgSrc, percentCrop);
  };

  handleCreateCroppedImage = async (event) => {
    event.preventDefault();
    const { imgSrc, imgFile, percentCrop } = this.state;
    const canvasRef = this.imagePreviewCanvasRef.current;
    if (canvasRef && imgSrc) {
      //const { imgSrcExt } = this.state;
      await image64toCanvasRef2(canvasRef, imgSrc, percentCrop);
      const tempImage = canvasRef.toDataURL("image/png"); // convert display to png always

      //      no need to create blob. now we send original image plus coordinats
      //      const imageBlob = await new Promise((resolve) =>
      //        canvasRef.toBlob(resolve, "image/png")
      //      );
      this.setState({ newimageData64: tempImage });
      //      this.props.change({ imgSrc: imgSrc, percentCrop: percentCrop }); // sends imageBlob to parent using change prop
      this.props.change({ imgFile: imgFile, percentCrop: percentCrop }); // sends image file handle to parent using change prop
    }
    this.setState({ isCropping: false });
  };

  handleClearToDefault = (event) => {
    if (event) event.preventDefault();
    const canvas = this.imagePreviewCanvasRef.current;
    if (!this.state.newimageData64 && canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.setState({
        imgSrc: null,
        imgSrcExt: null,
        crop: {
          aspect: 2 / 1,
          ruleOfThirds: true,
        },
        percentCrop: {
          x: null,
          y: null,
          width: null,
          height: null,
        },
      });
      this.fileInputRef.current.value = null;
    }
    this.setState({ isCropping: false });
  };

  newClear = (event) => {
    console.log("newClear", event);
    if (event) event.preventDefault();

    this.setState({
      imgSrc: null,
      imgSrcExt: null,
      crop: {
        aspect: 2 / 1,
        ruleOfThirds: true,
      },
      percentCrop: {
        x: null,
        y: null,
        width: null,
        height: null,
      },
    });
    this.fileInputRef.current.value = null;
    this.setState({
      newimageData64: null,
      isCropping: false,
    });

    ///  THIS LINE IS NEW CODE
    this.props.change(""); // sends empty imageBlob to parent using change prop
  };

  handleFileSelect = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const isVerified = this.verifyFile(files);
      if (isVerified) {
        // imageBase64Data
        const currentFile = files[0];
        const myFileItemReader = new FileReader();
        myFileItemReader.addEventListener(
          "load",
          () => {
            const myResult = myFileItemReader.result;
            this.setState({
              imgSrc: myResult,
              imgSrcExt: extractImageFileExtensionFromBase64(myResult),
            });
          },
          false
        );
        myFileItemReader.readAsDataURL(currentFile);
      }
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    //lifecycle function to update child state with props set by parent
    if (prevState.imgSrcLoaded) {
      // disable getDerivedStateFromProps after image is loaded once.
      return null; // we don't need this function in EventCreation, we need it in EventEdit
    }
    // this check is for eventCreation startup which does not have imagein
    if (!nextProps.imagein) {
      return null;
    }
    if (
      nextProps.imagein.isLoaded !== prevState.imgSrcLoaded ||
      nextProps.imagein.imgSrc !== prevState.imgSrc
    ) {
      return {
        imgSrc: nextProps.imagein.imgSrc,
        imgSrcLoaded: nextProps.imagein.isLoaded,
        newimageData64: nextProps.imagein.imgSrc,
      };
    } else return null;
  }

  render() {
    const { imgSrc, imgSrcLoaded } = this.state;
    if (!imgSrcLoaded) {
      return <p> Still Loading .... </p>;
    }

    const display = () => {
      if (imgSrc) {
        if (this.state.isCropping) {
          return (
            <div>
              <Backdrop />
              <div className={classes.CropBox}>
                <h2>Crop image</h2>
                <ReactCrop
                  style={{ zIndex: 800, maxHeight: "400px", maxWidth: "600px" }}
                  src={imgSrc}
                  crop={this.state.crop}
                  onImageLoaded={this.handleImageLoaded}
                  onComplete={this.handleOnCropComplete}
                  onChange={this.handleOnCropChange}
                />
                <div className={classes.CropBoxControls}>
                  <div
                    style={{
                      width: "150px",
                      textAlign: "right",
                      paddingTop: "5px",
                      paddingLeft: "5px",
                    }}
                  >
                    <Button
                      content="Cancel"
                      icon="cancel"
                      color="red"
                      onClick={this.handleClearToDefault}
                    />
                  </div>
                  <div
                    style={{
                      width: "150px",
                      textAlign: "left",
                      paddingTop: "5px",
                      paddingLeft: "5px",
                    }}
                  >
                    <Button
                      content="Create"
                      color="green"
                      onClick={this.handleCreateCroppedImage}
                    />
                  </div>
                </div>
              </div>
              <div>
                <canvas
                  className={classes.ImageBox}
                  ref={this.imagePreviewCanvasRef}
                ></canvas>
              </div>
            </div>
          );
        } else {
          return (
            <div>
              <div>
                <img
                  className={classes.ImageBox}
                  src={this.state.newimageData64}
                />
                <div className={classes.ImageControls}>
                  <button
                    style={{
                      fontSize: "15px",
                      color: "red",
                      border: "none",
                      backgroundColor: "#E7E7E7",
                      cursor: "pointer",
                      display: "inlineBlock",
                      outline: "none",
                    }}
                    onClick={this.newClear}
                  >
                    Delete Image
                  </button>
                  <button
                    style={{
                      fontSize: "15px",
                      color: "blue",
                      border: "none",
                      backgroundColor: "#E7E7E7",
                      cursor: "pointer",
                      display: "inlineBlock",
                      outline: "none",
                    }}
                    onClick={() => this.setState({ isCropping: true })}
                  >
                    Re-Adjust Image
                  </button>
                </div>
              </div>
            </div>
          );
        }
      } else {
        return (
          <div>
            <Dropzone
              onDrop={this.handleOnDrop}
              accept={acceptedFileTypes}
              multiple={false}
              maxSize={imageMaxSize}
              noKeyboard
            >
              {({ getRootProps, getInputProps, acceptedFiles }) => (
                <div
                  style={{
                    margin: "0px",
                    padding: "5px 5px",
                    border: "1px solid lightgrey",
                    backgroundColor: "white",
                    width: "412px",
                    height: "212px",
                    boxSizing: "borderBox",
                  }}
                  {...getRootProps({
                    className: "dropzone",
                  })}
                >
                  <input {...getInputProps()} />
                  <div
                    style={{
                      textAlign: "center",
                      color: "blue",
                      border: "1px dashed blue",
                      paddingTop: "10px",
                      width: "400px",
                      height: "200px",
                      boxSizing: "borderBox",
                      cursor: "pointer",
                    }}
                  >
                    <FontAwesomeIcon
                      size="4x"
                      cursor="pointer"
                      icon={faImage}
                    />
                    <br></br>
                    <br></br>
                    Drag 'n' drop your image file here
                    <br></br>or<br></br>
                    click to select an image file
                  </div>
                </div>
              )}
            </Dropzone>
          </div>
        );
      }
    };

    return (
      <Fragment>
        <span
          ref={this.fileInputRef}
          type="file"
          accept={acceptedFileTypes}
          multiple={false}
          onChange={this.handleFileSelect}
        ></span>
        {display()}
      </Fragment>
    );
  }
}

export default ImgDropAndCrop;
