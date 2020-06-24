import React, { Component } from 'react'
import Dropzone from 'react-dropzone'

import ReactCrop from 'react-image-crop'
import './custom-image-crop.css';


import Backdrop from './Backdrop';
import Aux from "../hoc/Auxiliary/Auxiliary";

import classes from "./Backdrop.module.css";

import {base64StringtoFile,
    downloadBase64File,
    extractImageFileExtensionFromBase64,
    image64toCanvasRef,image64toCanvasRef2} from './ResuableUtils'

import { Button } from 'semantic-ui-react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

const imageMaxSize = 1000000 // bytes
const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'
const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => {return item.trim()})

class ImgDropAndCrop extends Component {
    constructor(props){
        super(props)
        console.log("this.props: ", this.props)
        //console.log("props.photoData: ", props.info);
        this.imagePreviewCanvasRef = React.createRef()
        this.fileInputRef = React.createRef()
        console.log("NO new image info found")
        this.state = {
            imgSrc: null,
            imgSrcExt: null,
            imgSrcLoaded: false,
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
            pixelcrop: {
                x: null,
                y: null,
                width: null,
                height: null
            }
        }
        console.log("state ending in constructor: ", this.state)
    }
    
    IMAGE_WIDTH = 0;
    IMAGE_HEIGHT = 0;


    verifyFile = (files) => {
        if (files && files.length > 0){
            const currentFile = files[0]
            const currentFileType = currentFile.type
            const currentFileSize = currentFile.size
            if(currentFileSize > imageMaxSize) {
                alert("This file is not allowed. " + currentFileSize + " bytes is too large")
                return false
            }
            if (!acceptedFileTypesArray.includes(currentFileType)){
                alert("This file is not allowed. Only images are allowed.")
                return false
            }
            return true
        }
    }

    handleOnDrop = (files, rejectedFiles) => {
        console.log (files); // MM
        console.log ("rejected files are ", rejectedFiles); // MM
        if (rejectedFiles && rejectedFiles.length > 0){
            this.verifyFile(rejectedFiles)
        }

        if (files && files.length > 0){
            const isVerified = this.verifyFile(files)
            if (isVerified){
                const currentFile = files[0]
                const myFileItemReader = new FileReader()
                myFileItemReader.addEventListener("load", ()=>{
                    const myResult = myFileItemReader.result
                    this.setState({
                        imgSrc: myResult,
                        imgSrcExt: extractImageFileExtensionFromBase64(myResult),
                        isCropping: true
                    })
                }, false)
                myFileItemReader.readAsDataURL(currentFile)
            }
        }
    }

    defaultCrop = (image) => {
        // sets the default crop. Centered and maximized space subject aspect ratio of 2
        const ASPECT_RATIO = 2/1;
        console.log("**defaultCrop", image);
        const w  = image.width;
        const h  = image.height;
        let xa,ya,wa,ha;
        // this is for a 2 by 1 crop
        if (w > ASPECT_RATIO * h) { // extra wide image
            console.log ("exta wide..");
            ya = 0;
            xa = (w - (ASPECT_RATIO*h))/2;
            wa = ASPECT_RATIO*h;
            ha = h;
        } else {             // narrow image
            console.log ("exta narrow..");
            xa = 0;
            ya = (h - (w/ASPECT_RATIO))/2;
            wa = w;
            ha = w/ASPECT_RATIO;
        };
        console.log ("default crop: w h xa ya wa ha ", w, h, xa, ya, wa, ha);
        let {crop}= this.state;
        crop.aspect=ASPECT_RATIO;
        crop.ruleOfThirds= true;
        crop.x=xa;
        crop.y=ya;
        crop.width=wa ;
        this.setState({crop:crop})
    }

    handleImageLoaded = (image) => {
        console.log("**handleimageLoaded", image);
        let{pixelcrop} = this.state;
        console.log("handleimageLoader pixelcrop: ",pixelcrop)        
        if (!(
            pixelcrop.x === null ||
            pixelcrop.y === null ||
            pixelcrop.height === null ||
            pixelcrop.width === null
        )) {
            console.log("inside handleImageLoaded if statement")
            const w  = image.width;
            const h  = image.height;
            let {crop} = this.state;
            crop.aspect = 2;
            crop.ruleOfThirds = true;
            crop.x = pixelcrop.x * w * .01;
            crop.y = pixelcrop.y * h * .01;
            crop.width = pixelcrop.width * w * .01;
            crop.height = pixelcrop.height * h * .01;     
            this.setState({crop:crop})
        } else {
            this.defaultCrop (image);   
        }
    }

    handleOnCropChange = (crop) => {
        console.log("**handleOnCropChange", crop)
        //this.props.change(crop);
        this.setState({crop:crop})
    }

    handleOnCropComplete = (crop, pixelCrop) =>{
        this.setState({pixelcrop: pixelCrop});//
        console.log("pixelCrop: ", pixelCrop)
        console.log("handleOnCropCompleted crop:", crop);
        const canvasRef = this.imagePreviewCanvasRef.current;//
        this.props.change(this.imagePreviewCanvasRef.current);
        const {imgSrc} = this.state;//
        image64toCanvasRef2(canvasRef, imgSrc, pixelCrop, crop);//
        console.log("Before imagePreviewCanvasRef: ",this.imagePreviewCanvasRef);
        console.log ("magePreviewCanvasRef.current.width and height" ,this.imagePreviewCanvasRef.current.width,this.imagePreviewCanvasRef.current.height)
    }

    handleCreateCroppedImage = async (event) => {
        event.preventDefault()
        const {imgSrc} = this.state;
        if (imgSrc) {
            const canvasRef = this.imagePreviewCanvasRef.current;        
            const {imgSrcExt} =  this.state;
            const tempImage = canvasRef.toDataURL('image/jpeg', 0.5);
            this.setState({newimageData64: tempImage});
            console.log("newimageData64: ", this.state.newimageData64)
            console.log("newimageData64: ", tempImage)
            console.log("tempImage typeof: ", typeof tempImage)
            //this.props.change(canvasRef);
            console.log("height: ", tempImage.height)
            console.log("width: ", tempImage.width)
        }
        this.setState({isCropping: false});
    }

    handleClearToDefault = event =>{
        console.log ("handleClearToDefault", event);

        if (event) event.preventDefault()
        if (this.state.newimageData64 === null) {
        //if (!this.imagePreviewCanvasRef) {
            const canvas = this.imagePreviewCanvasRef.current
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            this.setState({
                imgSrc: null,
                imgSrcExt: null,
                crop: {
                    aspect: 2/1,
                    ruleOfThirds: true
                },
                pixelcrop: {
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
        console.log ("newClear", event);
        if (event) event.preventDefault()

        this.setState({
            imgSrc: null,
            imgSrcExt: null,
            crop: {
                aspect: 2/1,
                ruleOfThirds: true
            },
            pixelcrop: {
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
        console.log ("handleFileSelect", event);
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
        console.log ("in getderivedStateFromProps > nextprop: ", nextProps);
        console.log ("in getderivedStateFromProps > prevProps:  ", prevState);
        console.log ("nextProps.imagein!==prevState.imgSrc  :", nextProps.imagein!==prevState.imgSrc);
        // this check is for eventCreation startup which does not have imagein
        if (!nextProps.imagein ){
            return null;
        };
        if((nextProps.imagein.isLoaded!==prevState.imgSrcLoaded) || nextProps.imagein.imgSrc!==prevState.imgSrc){
            console.log("state change");
                return {
                    imgSrc: nextProps.imagein.imgSrc,
                    imgSrcLoaded: nextProps.imagein.isLoaded
                };
        }
        else return null;
    }


    render () {
        const {imgSrc,isLoading,imgSrcLoaded} = this.state;
        if (!imgSrcLoaded) {
            return <p> Still Loading .... </p>
        }

        const display = () => {
                if (imgSrc !== null) {
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
                                        onComplete = {async (crop, pixelCrop)=>{
                                            await this.handleOnCropComplete(crop, pixelCrop);
                                            this.props.change(this.imagePreviewCanvasRef.current);
                                            }}
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
                                    <img className={classes.ImageBox}
//                                        src={this.state.newimageData64}
                                        src={imgSrc}
                                        alt="Event Logo Coming Soon!!!"
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