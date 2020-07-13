import React, { Component } from 'react'
import Dropzone from 'react-dropzone'

import ReactCrop from 'react-image-crop'
import './custom-image-crop.css';


import Backdrop from './Backdrop';
import Aux from "../hoc/Auxiliary/Auxiliary";

import classes from "./Backdrop.module.css";

//import {base64StringtoFile,
//    downloadBase64File,
 //   extractImageFileExtensionFromBase64,
//    image64toCanvasRef,image64toCanvasRef2} from './ResuableUtils'


import {extractImageFileExtensionFromBase64,image64toCanvasRef4,image64toCanvasRef2,image64toCanvasRef3, imagetoNaturalCanvas} from './ResuableUtils';

import { Button } from 'semantic-ui-react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

const imageMaxSize = 1000000 // bytes
//const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'

// see https://github.com/jshttp/mime-db
// types from: http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types

// 'image/bmp, image/cgm, image/g3fax,image/gif,image/ief,image/jpeg,image/ktx,image/png,
// image/prs.btif, image/sgi, image/svg+xml, image/tiff,image/vnd.adobe.photoshop,
// mime type                                    extension
//  image/gif                                        gif;
//  image/jpeg                                       jpeg jpg;
//  image/png                                        png;
//  image/svg+xml                                    svg svgz;
//  image/tiff                                       tif tiff;
//  image/vnd.wap.wbmp                               wbmp;
//  image/webp                                       webp;
const acceptedFileTypes = 'image/gif, image/jpeg, image/png, image/svg+xml, image/webp';
const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => {return item.trim()})

class ImgDropAndCrop extends Component {
    constructor(props){
        super(props);
        //console.log("this.props: ", this.props);
        //console.log("props.photoData: ", props.info);
        this.imagePreviewCanvasRef = React.createRef();
        this.fileInputRef = React.createRef();
        //console.log("init:this.imagePreviewCanvasRef.current:", this.imagePreviewCanvasRef.current);
        this.state = {
            imgSrc: null,
            imgSrcExt: null,
            imgSrcLoaded: false,
            editMode: false,
            crop: {
                aspect: 2/1,
                ruleOfThirds: true,
                x:30,
                y:30,
                width: 400,
                height: 200
            },
            newimageData64: null,
            isCropping: false, 
            percentCrop: {
                x: null,
                y: null,
                width: null,
                height: null
            }
        }
        //console.log("state ending in constructor: ", this.state)
    }
    
    IMAGE_WIDTH = 0;
    IMAGE_HEIGHT = 0;

    verifyFile = (files) => {
        //console.log ("files>> ", files);
        if (files && files.length > 0){
            const currentFile = files[0];
            //console.log ("files[0]>> ", currentFile);
            if (!currentFile){
                alert(" Only image files are allowed.")
                return false               
            };
            const currentFileType = currentFile.type;
            const currentFileSize = currentFile.size;
            if(currentFileSize > imageMaxSize) {
                let showmax = (imageMaxSize/1000).toLocaleString('en');
                alert("This file is not allowed. File size cannot exceed " + showmax + " Kbytes ");
                return false
            }
            if (!acceptedFileTypesArray.includes(currentFileType)){
                let showmax = (imageMaxSize/1000).toLocaleString('en');
                alert("File must be an image file with size no greater than " + showmax + " Kbytes ");
                return false
            }
            return true
        }
    }

    handleOnDrop = (files, rejectedFiles) => {
        //console.log ("in handleOnDrop");
        //console.log ("files = ", files); // MM
        //console.log ("rejected =", rejectedFiles); // MM

        if (rejectedFiles && rejectedFiles.length > 0){
            this.verifyFile(rejectedFiles)
        }

        if (files && files.length > 0){
            const isVerified = this.verifyFile(files)
            if (isVerified){
                const currentFile = files[0];
                const myFileItemReader = new FileReader();
                myFileItemReader.addEventListener("load", ()=>{
                    const myResult = myFileItemReader.result;
                    this.setState({
                        imgSrc: myResult,
                        imgSrcExt: extractImageFileExtensionFromBase64(myResult),
                        isCropping: true
                    })
                }, false);
                // added listener now reading file
                myFileItemReader.readAsDataURL(currentFile);
            }
        }
    }

    defaultCrop = (image) => {
        // sets the default crop. Centered and maximized space subject aspect ratio of 2
        const ASPECT_RATIO = 2/1;
        //console.log("**defaultCrop");
        const w  = image.width;
        const h  = image.height;
        let xa,ya,wa,ha;
        // this is for a 2 by 1 crop
        if (w > ASPECT_RATIO * h) { // extra wide image
            //console.log ("exta wide..");
            ya = 0;
            xa = (w - (ASPECT_RATIO*h))/2;
            wa = ASPECT_RATIO*h;
            ha = h;
        } else {             // narrow image
            //console.log ("exta narrow..");
            xa = 0;
            ya = (h - (w/ASPECT_RATIO))/2;
            wa = w;
            ha = w/ASPECT_RATIO;
        };
        //console.log ("default crop: w h xa ya wa ha ", w, h, xa, ya, wa, ha);
        let {crop}= this.state;
        crop.aspect=ASPECT_RATIO;
        crop.ruleOfThirds= true;
        crop.x=xa;
        crop.y=ya;
        crop.width=wa ;
        crop.height = ha;
        this.setState({crop:crop})
        //console.log ("setting default crop:", crop);

    }

    handleImageLoaded = (image) => {
        //console.log("**handleimageLoaded", image);
        let{percentCrop} = this.state;
        //console.log("handleimageLoaded percentCrop: ",percentCrop)        
        if (!(
            percentCrop.x === null ||
            percentCrop.y === null ||
            percentCrop.height === null ||
            percentCrop.width === null
        )) {
            const w  = image.width;
            const h  = image.height;
            //console.log("inside handleImageLoaded  image width, height = ", w,h);

            let {crop} = this.state;
            crop.aspect = 2;
            crop.ruleOfThirds = true;
            crop.x = percentCrop.x * w * .01;
            crop.y = percentCrop.y * h * .01;
            crop.width = percentCrop.width * w * .01;
            crop.height = percentCrop.height * h * .01;     
            this.setState({crop:crop})
            //console.log ("setting crop:", crop);
        } else {
            this.defaultCrop (image);   
        };
        const canvasRef = this.imagePreviewCanvasRef.current;
        const {imgSrc}  = this.state;
        image64toCanvasRef2(canvasRef, imgSrc, percentCrop);

        //https://www.npmjs.com/package/react-image-crop return false as per documentation
        // must return false in this callback if you are changing the crop object.
//        return false;  /this works without false!!
    }

    handleOnCropChange = (crop) => {
        //console.log("**handleOnCropChange",crop);
//        console.log ("this.imagePreviewCanvasRef:", this.imagePreviewCanvasRef);
//        console.log ("this.state:", this.state);
        //this.props.change(crop);
        this.setState({crop:crop})
    }

    handleOnCropComplete = (crop, percentCrop) =>{
        //console.log("handleOnCropCompleted crop, percentCrop:", crop, percentCrop);
        this.setState({percentCrop: percentCrop});
        const canvasRef = this.imagePreviewCanvasRef.current;
        const {imgSrc}  = this.state;
        image64toCanvasRef2(canvasRef, imgSrc, percentCrop);
  //      console.log("Before imagePreviewCanvasRef: ",this.imagePreviewCanvasRef);
  //      console.log ("magePreviewCanvasRef.current.width and height" ,this.imagePreviewCanvasRef.current.width,this.imagePreviewCanvasRef.current.height)
    }


    handleCreateCroppedImage = async (event) => {
        //console.log ("in handleCreateCroppedImage..");
        event.preventDefault()
        const {imgSrc,percentCrop} = this.state;
        const canvasRef = this.imagePreviewCanvasRef.current;        
//        console.log(">>>canvasRef, imgSrc",canvasRef,imgSrc);
        if (canvasRef && imgSrc) { 
            const {imgSrcExt} =  this.state;
            await image64toCanvasRef2(canvasRef, imgSrc, percentCrop);
//            const tempImage = canvasRef.toDataURL('image/' +imgSrcExt);
            const tempImage = canvasRef.toDataURL('image/png');

//            const imageBlob = await new Promise((resolve) => canvasRef.toBlob(resolve, "image/png"));
            const imageBlob = await new Promise((resolve) => canvasRef.toBlob(resolve, "image/png"));
//            this.setState({newimageData64: tempImage});  
//            const tempImage = URL.createObjectURL(imageBlob);
            this.setState({newimageData64: tempImage});  
            this.props.change(imageBlob);  // sends imageBlob to parent using change prop
        }

        this.setState({isCropping: false});
    }

    handleClearToDefault = event =>{
        //console.log ("handleClearToDefault", event);

        if (event) event.preventDefault();
        const canvas = this.imagePreviewCanvasRef.current;
        if ((!this.state.newimageData64) && canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            this.setState({
                imgSrc: null,
                imgSrcExt: null,
                crop: {
                    aspect: 2/1,
                    ruleOfThirds: true
                },
                percentCrop: {
                    x: null,
                    y: null,
                    width: null,
                    height: null
                }
            })
            this.fileInputRef.current.value = null
            
        }
        this.setState({isCropping: false});
    }

    newClear = event =>{
        //console.log ("newClear", event);
        if (event) event.preventDefault()

        this.setState({
            imgSrc: null,
            imgSrcExt: null,
            crop: {
                aspect: 2/1,
                ruleOfThirds: true
            },
            percentCrop: {
                x: null,
                y: null,
                width: null,
                height: null
            }
        })
        this.fileInputRef.current.value = null;
        this.setState({
            newimageData64: null,
            isCropping: false
        });
    }

    handleFileSelect = event => {
        //console.log ("handleFileSelect", event);
        const files = event.target.files
        if (files && files.length > 0){
            const isVerified = this.verifyFile(files)
            if (isVerified){
                // imageBase64Data 
                const currentFile = files[0]
                const myFileItemReader = new FileReader()
                myFileItemReader.addEventListener("load", ()=>{
                    // console.log(myFileItemReader.result)
                    const myResult = myFileItemReader.result
                    this.setState({
                        imgSrc: myResult,
                        imgSrcExt: extractImageFileExtensionFromBase64(myResult)
                    })
                }, false)
                myFileItemReader.readAsDataURL(currentFile)
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        //lifecycle function to update child state with props set by parent
        //console.log ("in getderivedStateFromProps > nextprop: ", nextProps);
        //console.log ("in getderivedStateFromProps > prevProps:  ", prevState);
        //console.log ("nextProps.imagein!==prevState.imgSrc  :", nextProps.imagein!==prevState.imgSrc);
        if (prevState.imgSrcLoaded){ // disable getDerivedStateFromProps after image is loaded once. 
            return null;            // we don't need this function in EventCreation, we need it in EventEdit
        }
        // this check is for eventCreation startup which does not have imagein
        if (!nextProps.imagein ){
            return null;
        };
        if((nextProps.imagein.isLoaded!==prevState.imgSrcLoaded) || nextProps.imagein.imgSrc!==prevState.imgSrc){
            //console.log("state change");
                return {
                    imgSrc: nextProps.imagein.imgSrc,
                    imgSrcLoaded: nextProps.imagein.isLoaded,
                    newimageData64: nextProps.imagein.imgSrc
                };
        }
        else return null;
    }

    render () {
        const {imgSrc,imgSrcLoaded} = this.state;
        //console.log ("in imgDropandCrop render imgSrcLoaded=",imgSrcLoaded);
 //       console.log ("in imgDropandCrop render imgSrc=",imgSrc);
//        console.log ("in imgDropandCrop render this.state.newimageData64=",this.state.newimageData64);


        if (!imgSrcLoaded) {
            return <p> Still Loading .... </p>
        }

        const display = () => {
            if (imgSrc) {
                if(this.state.isCropping) {
                    return (
                        <div>
                            <Backdrop/>
                            <div className={classes.CropBox}>
                                <h2>Crop image</h2>
                                <ReactCrop 
                                    style={{zIndex: 800, maxHeight: "400px", maxWidth: "600px"}}
                                    src={imgSrc} 
                                    crop={this.state.crop} 
                                    onImageLoaded={this.handleImageLoaded}
                                    onComplete = {this.handleOnCropComplete}
                                    onChange={this.handleOnCropChange}
                                />
                                <div  className={classes.CropBoxControls}>
                                    <div style={{width: "150px", textAlign: "right", paddingTop: "5px", paddingLeft: "5px"}}>
                                        <Button
                                            content="Cancel"
                                            icon="cancel"
                                            color="red"
                                            onClick={this.handleClearToDefault}
                                        />
                                    </div>  
                                    <div style={{width: "150px", textAlign: "left", paddingTop: "5px", paddingLeft: "5px"}}>
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
                                    ref={this.imagePreviewCanvasRef}>
                                </canvas>
                            </div>
                        </div>
                    )
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
                                            outline: "none"
                                            }}
                                        onClick={this.newClear}
                                    >Delete Image</button>
                                    <button
                                        style={{
                                            fontSize: "15px",
                                            color: "blue",
                                            border: "none",
                                            backgroundColor: "#E7E7E7",
                                            cursor: "pointer",
                                            display: "inlineBlock",
                                            outline: "none"
                                            }}
                                        onClick={() => this.setState({isCropping: true})}
                                    >Re-Adjust Image</button>
                                </div>
                            </div>
                        </div>
                    )
                }
            } else {
                return (
                    <div>
                        <Dropzone
                            onDrop={this.handleOnDrop}
                            accept={acceptedFileTypes}
                            multiple={false} 
                            maxSize={imageMaxSize} noKeyboard>
                            {({getRootProps, getInputProps,acceptedFiles}) => (
                                <div 
                                    style={{margin: "0px",
                                            padding: "5px 5px",
                                            border: "1px solid lightgrey",
                                            backgroundColor: "white",
                                            width: "412px",
                                            height: "212px",
                                            boxSizing: "borderBox"}}
                                        {...getRootProps({
                                            className: 'dropzone'
                                        })}
                                    >
                                    <input {...getInputProps()} />
                                    <div
                                        style={{textAlign: "center",
                                        color: "blue",
                                        border: "1px dashed blue",
                                        paddingTop: "10px",
                                        width: "400px",
                                        height: "200px",
                                        boxSizing: "borderBox",
                                        cursor: "pointer"}}>
                                        <FontAwesomeIcon
                                            size = '4x'
                                            cursor = "pointer"
                                            icon={faImage}/>
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
                )
            }
        }

        return (
            <Aux>
                <span
                    ref={this.fileInputRef}
                    type='file'
                    accept={acceptedFileTypes}
                    multiple={false}
                    onChange={this.handleFileSelect}
                ></span>
                {display()}
            </Aux>
        )
    }
}

export default ImgDropAndCrop