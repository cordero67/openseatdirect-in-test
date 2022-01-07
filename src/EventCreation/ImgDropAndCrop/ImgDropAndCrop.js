import React, { Component, Fragment } from "react";
import Dropzone from "react-dropzone";

import ReactCrop from "react-image-crop";
//import "./custom-image-crop.css";
//import 'react-image-crop/dist/ReactCrop.css';
//import 'react-image-crop/lib/ReactCrop.scss';
import "./mmcustom-image-crop.css"; //  mm copy of new react-image-crop/dist/ReactCrop.css lastest version

import Backdrop from "./Backdrop";

import classes from "./Backdrop.module.css";

import {
  extractImageFileExtensionFromBase64,
  image64toCanvasRef2b,
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
      imgDim:{      // original dimensions of imported image
        W:null,
        H:null
      },   
      imgSrc: null,
      imgSrcExt: null,
      imgSrcLoaded: false,
      editMode: false,
      crop: {
        aspect: 2,
        unit:'%',     // defaults to 'px' so use non-default
        x: null,
        y: null,
        width: null
      },
      newimageData64: null,
      isCropping: false,
      percentCrop: {
        aspect: 2,
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
          "This file is too big. File size cannot exceed " +
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


/////// from:  https://codesandbox.io/s/72py4jlll6?file=/src/index.js:1226-2420
  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            //reject(new Error('Canvas is empty'));
            console.error('Canvas is empty');
            return;
          }
          blob.name = fileName;
          window.URL.revokeObjectURL(this.fileUrl);
          this.fileUrl = window.URL.createObjectURL(blob);
          resolve(this.fileUrl);
        },
        'image/jpeg',
        1
      );
    });
  }


  handleOnImageLoaded = (image) => {
    let { crop, percentCrop } = this.state;
      const ASPECT_RATIO = 2;
      const w = image.width;
      const h = image.height;
      let {imgDim} = this.state;
      imgDim.W = w;
      imgDim.H = h;
      this.setState ({imgDim:imgDim});    // save original image dimensions
    console.log (">>>>>>>>>>in handleOnImageLoaded w crop=", crop,"imgDim=", imgDim ,"percentCrop", percentCrop );

    if (
        crop.x === null ||
        crop.y === null ||
        crop.width === null 
    ) {
      // DEFAULT CROP 
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
        console.log ("default crop: w h xa ya wa ha ", w, h, xa, ya, wa, ha);
//        crop.aspect = ASPECT_RATIO;
        percentCrop.unit='%';      //MUST INCLUDE units beause it defaults to 'px'
        percentCrop.aspect = ASPECT_RATIO;
        percentCrop.x = 100*xa/w;
        percentCrop.y = 100*ya/h;
        percentCrop.width = 100*wa/w;
        percentCrop.height= 100*ha/h;

        crop.aspect = ASPECT_RATIO;
        crop.unit='px';      //MUST INCLUDE units beause it defaults to 'px'
        crop.x = xa;
        crop.y = ya;
        crop.width = wa;
        crop.height = ha;

//        crop.height = 100*ha/h;     // let it calcuate width based on aspect ratio

        const canvasRef = this.imagePreviewCanvasRef.current;
        const { imgSrc } = this.state;
        console.log (">>>22222222>>>>>>>in handleImageLoaded w FINAL crop=", crop,"imgDim=", imgDim );
        image64toCanvasRef2(canvasRef, imgSrc, percentCrop);
        //must return false https://www.npmjs.com/package/react-image-crop
        //Note that you must return false in this callback if you are changing the crop object.
        this.setState({ crop: percentCrop});
        return false; // Return false when setting crop state in here.
    } else {
        const canvasRef = this.imagePreviewCanvasRef.current;
        const { imgSrc } = this.state;
        console.log (">>>333333333333>>>>>>>in handleImageLoaded w FINAL crop=", crop,"imgDim=", imgDim );
        image64toCanvasRef2(canvasRef, imgSrc, percentCrop);
        // dont need to return false because we're not resetting crop
    }
  };


  handleOnCropChange = (crop,percentCrop) => {
    console.log (">>>>>>>>>>in handleOnCropChange crop=", crop,"percentCrop=",percentCrop);
    // save percent not crop
    this.setState({ crop: crop, percentCrop: percentCrop });
  };

//  handleOnCropComplete = (crop, percentCrop) => {
  handleOnCropComplete = (crop,percentCrop) => {

    console.log (">>>>>>>>>>in handleOnCropComplete", crop, "percentCrop=",percentCrop);

    const canvasRef = this.imagePreviewCanvasRef.current;
    const { imgSrc } = this.state;
    image64toCanvasRef2(canvasRef, imgSrc,percentCrop);
//    this.setState({ percentCrop: percentCrop });
  };

  handleCreateCroppedImage = async (event) => {
    event.preventDefault();
    const { imgSrc, imgFile, percentCrop,imgDim} = this.state;

    console.log (">>>>>>>>>>in handleCreateCroppedImage w event", event, "imgFile=", imgFile, "pctcrop=", percentCrop ,"imdim=",imgDim );


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

      let photoMetaData ={W:imgDim.W, H:imgDim.H ,
                          xp0: percentCrop.x, yp0:percentCrop.y,
                          wp:percentCrop.width, hp:percentCrop.height};
      this.props.change({ imgFile: imgFile, percentCrop:percentCrop, photoMetaData:photoMetaData }); // sends image file handle to parent using change prop
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
          aspect: 2,
          unit:"%",
          x:null,
          y:null,
          height:null,
          width:null
        },
        percentCrop: {
          aspect: 2,
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
          aspect: 2,
          unit:"px",
          x:null,
          y:null,
          height:null,
          width:null
      },
//      percentCrop: {
//        x: null,
//        y: null,
//        width: null,
//        height: null,
//      },
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

  ///////////////

  componentDidMount(){
    // this code is copied from ReusableUtils.js  image64toCanvasRef2
//    const { imgSrc, percentCrop} = this.state;
    const { imgSrc, crop} = this.state;
    console.log ("in componentDidMount w imgSrc=", imgSrc, " crop=", crop);
    if (!imgSrc) return null;   // exist asap if no image. which is the case in CreateEvent

    const image = new Image();
    const  canvas=document.createElement("canvas");
    const ctx=canvas.getContext("2d");

    
//    const scope = this;

    image.onload = ()=> {
      const W = image.width;
      const H = image.height;
      ctx.drawImage(
        image,
        crop.x * W * 0.01,
        crop.y * H * 0.01,
        crop.width * W * 0.01,
        crop.height * H * 0.01,
        0,
        0, // the x an y coordinates where to place the image on the canvas
        300, // 300 The width of the image to use (stretch or reduce the image)
        150 // 150 The height of the image to use (stretch or reduce the image)
      );

      const tempImage = canvas.toDataURL('image/jpeg');
      this.setState({ newimageData64: tempImage });
    };
    image.src = imgSrc;

  }



//////////////

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log ("in getDerivedStaeFromProps nextProps=",nextProps, " prevState=", prevState);
    //lifecycle function to update child state with props set by parent
    if (prevState.imgSrcLoaded) {
    console.log (">>>EXITING prevState.imgSrcLoaded in getDerivedStaeFromProps");

      // disable getDerivedStateFromProps after image is loaded once.
      return null; // we don't need this function in EventCreation, we need it in EventEdit
    }
    // this check is for eventCreation startup which has isCreateEvent=true
    if (nextProps.isCreateEvent) {
      console.log (">>>EXITING nextProps.isCreateEvent in getDerivedStaeFromProps");
      return null;
    }
    if (
      nextProps.photoData.isLoaded !== prevState.imgSrcLoaded ||
      nextProps.photoData.imgSrc !== prevState.imgSrc
    ) {
      if (nextProps.photoData.percentCrop){
          nextProps.photoData.percentCrop.unit='%';
          nextProps.photoData.percentCrop.aspect=2;
          return {
            imgSrc:       nextProps.photoData.imgSrc,
            imgSrcLoaded: nextProps.photoData.isLoaded,
            crop:  nextProps.photoData.percentCrop
        //        newimageData64: nextProps.photoData.imgSrc,
          }
        } else {
          return {
            imgSrc:       nextProps.photoData.imgSrc,
            imgSrcLoaded: nextProps.photoData.isLoaded
          }
        }
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
                <h2>Crop your event image</h2>
                <ReactCrop
//                  style={{ zIndex: 800, resizeMode:"contain", maxHeight: "100%", maxWidth: "600px" }}
 //                 style={{ zIndex: 800, maxHeight: "600px", maxWidth:"600px" }}

                  src={imgSrc}
                  crop={this.state.crop}
                  ruleOfThirds
                  onImageLoaded={this.handleOnImageLoaded}
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
                  alt=""
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
