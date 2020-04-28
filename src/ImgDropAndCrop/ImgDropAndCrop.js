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
        this.imagePreviewCanvasRef = React.createRef()
        this.fileInputRef = React.createRef()
        this.state = {
            imgSrc: null,
            imgSrcExt: null,
            crop: {
                aspect: 2/1,
                ruleOfThirds: true,
                x:30,
                y:30,
                width: 400,
                height: 200
            },
            showModal: true,
            rafaelNewimageData64: ""
        }
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
                        imgSrcExt: extractImageFileExtensionFromBase64(myResult)
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
        this.defaultCrop (image);   
    }

    handleOnCropChange = (crop) => {
        console.log("**handleOnCropChange", crop)
        this.setState({crop:crop})
    }

    handleOnCropComplete = (crop, pixelCrop) =>{
        console.log("handleOnCropCompleted crop:", crop);
        const canvasRef = this.imagePreviewCanvasRef.current;
        const {imgSrc}  = this.state;
        image64toCanvasRef2(canvasRef, imgSrc, pixelCrop, crop);
        console.log("Before imagePreviewCanvasRef: ",this.imagePreviewCanvasRef);
        console.log ("magePreviewCanvasRef.current.width and height" ,this.imagePreviewCanvasRef.current.width,this.imagePreviewCanvasRef.current.height)
    }

    addImage = (event) => {
        event.preventDefault()
        const {imgSrc} = this.state;
        if (imgSrc) {
            const canvasRef = this.imagePreviewCanvasRef.current;        
            const {imgSrcExt} =  this.state;
            const tempImage = canvasRef.toDataURL('image/jpeg', 0.5);

            this.setState({rafaelNewimageData64: tempImage});
            console.log("rafaelNewimageData64: ", this.state.rafaelNewimageData64)
            console.log("rafaelNewimageData64: ", tempImage)
            console.log("height: ", tempImage.height)
            console.log("width: ", tempImage.width)
        }
        this.changeBackground();
    }

// NOT NECESSARY
/*
    handleDownloadClick = (event) => {
        console.log ("handleDownloadClick", event);
        event.preventDefault()
        const {imgSrc} = this.state;
        if (imgSrc) {
            //this.setState({})
            const canvasRef = this.imagePreviewCanvasRef.current;
            const {imgSrcExt} =  this.state;
            const imageData64 = canvasRef.toDataURL('image/' + imgSrcExt);
            
            const myFilename = "previewFile." + imgSrcExt;
            const myNewCroppedFile = base64StringtoFile(imageData64, myFilename);
            
            console.log("mynewCroppedFile.. SEND TO OSD SERVER", myNewCroppedFile);
            console.log("current imagePreviewCanvasRef: ", this.imagePreviewCanvasRef.current);

            // download file
            downloadBase64File(imageData64, myFilename);
            //this.handleClearToDefault();
            
        }
            this.changeBackground();
    }
    */

    handleClearToDefault = event =>{
        console.log ("handleClearToDefault", event);
        if (event) event.preventDefault()
        const canvas = this.imagePreviewCanvasRef.current
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        this.setState({
            imgSrc: null,
            imgSrcExt: null,
            crop: {
                aspect: 2/1,
                ruleOfThirds: true
            }
        })
        this.fileInputRef.current.value = null
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
            }
        })
        this.fileInputRef.current.value = null;
        this.setState({rafaelNewimageData64: ""});
        this.setState({showModal: true});
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

    changeBackground = () => {
        this.setState({showModal: !this.state.showModal})
    }

    render () {
        const {imgSrc} = this.state

        const display = () => {
            if (imgSrc !== null & this.state.showModal) {
                return (
                    <div>
                        <Backdrop show={this.state.showModal} clicked={this.changeBackground}/>
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
                                        icon="create image"
                                        color="green"
                                        onClick={this.addImage}
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
            } else if (imgSrc !== null & !this.state.showModal) {
                return (
                    <div>
                        <div>
                            <img className={classes.ImageBox}
                                src={this.state.rafaelNewimageData64}
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
                                    onClick={this.changeBackground}
                                >Re-Adjust Image</button>
                            </div>
                        </div>
                    </div>
                )
            } else  {
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