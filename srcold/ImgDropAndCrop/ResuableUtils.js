// Converts a Base64-encoded string to a File object
export function base64StringtoFile (base64String, filename) {
  var arr = base64String.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, {type: mime})
}

// Downloads a Base64-encoded file
export function downloadBase64File (base64Data, filename) {
  var element = document.createElement('a')
  element.setAttribute('href', base64Data)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

// Extracts a Base64 Image's File Extension
export function extractImageFileExtensionFromBase64 (base64Data) {
  return base64Data.substring('data:image/'.length, base64Data.indexOf(';base64'))
}

// Converts a Base64 Image to Canvas with a Crop
export function image64toCanvasRef (canvasRef, image64, percentCrop) {
  const canvas = canvasRef // document.createElement('canvas');
//  const canvas = document.createElement('canvas');
  canvas.width = percentCrop.width
  canvas.height = percentCrop.height
  const ctx = canvas.getContext('2d')
  const image = new Image()
  image.src = image64
  image.onload = function () {
    ctx.drawImage(
      image,
      percentCrop.x,
      percentCrop.y,
      percentCrop.width,
      percentCrop.height,
      0,
      0,
      percentCrop.width,
      percentCrop.height
    )
  }
}

// Converts a Base64 Image to Canvas with a Crop MM on 2 by 1 aspect
export function image64toCanvasRef2 (canvasRefPreview, image64, percentCrop) {
  //console.log ("** image64toCanvasRef2");
//  let wi  = image64.width;
//  let hi = image64.height; 
//  console.log ("image64 w h = ", wi, hi);
  const image = new Image();
//  const canvas = canvasRef // document.createElement('canvas');
  const ctx = canvasRefPreview.getContext('2d');

  image.onload = function () {
    //console.log (" >percentCrop:", percentCrop);
    //console.log ("***** : image.width:", image.width);
    //console.log ("***** : image.height:", image.height);
    //console.log ("***** : percentCrop.width:", percentCrop.width);
    //console.log ("***** : percentCrop.height:", percentCrop.height);
    const W = image.width;
    const H = image.height;
    /*console.log  (" ARGS:", 
      percentCrop.x*W*.01,    //OK
      percentCrop.y*H*.01,
      percentCrop.width*W*.01,
      percentCrop.height*H*.01,
      0,0,
      300,
      150);*/

  //from https://stackoverflow.com/questions/31910043/html5-canvas-drawimage-draws-image-blurry
//    ctx.imageSmoothingEnabled = false;
    // pixcelCrop is in % but input should be in px
    ctx.drawImage(
      image,
      percentCrop.x*W*.01,
      percentCrop.y*H*.01,
      percentCrop.width*W*.01,
      percentCrop.height*H*.01,
      0,0,      // the x an y coordinates where to place the image on the canvas
      300,      // 300 The width of the image to use (stretch or reduce the image)
      150       // 150 The height of the image to use (stretch or reduce the image)
    );
  };

  image.src = image64;  // must be after image.onload
}

//https://stackoverflow.com/questions/19262141/resize-image-with-javascript-canvas-smoothly

// Converts a Base64 Image to Canvas with a Crop MM on 2 by 1 aspect using 
//  using smoothing algo for betting looking final image

export function image64toCanvasRef3 (canvasRefPreview, image64, percentCrop) {
  //console.log ("** image64toCanvasRef3");
  const image = new Image();
  const ctx = canvasRefPreview.getContext('2d');

  image.onload = function() {
      const W = image.width;
      const H = image.height;  

//      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(
          image,
          Math.floor(percentCrop.x*W*.01),
          Math.floor(percentCrop.y*H*.01),
          Math.floor(percentCrop.width*W*.01),
          Math.floor(percentCrop.height*H*.01),
          0 ,0, 300,150
      )
    }

    image.src = image64;  // must
}

export function image64toCanvasRef4 (canvasRefPreview, image64, percentCrop) {
  //console.log ("** image64toCanvasRef4 44");
  const image = new Image();
  const ctx = canvasRefPreview.getContext('2d');

  image.onload = function() {
      let oc = document.createElement('canvas'),
          octx = oc.getContext('2d');

      let finalWidth = 300;
      var cur = {
        width: Math.floor(image.width * 0.5),
        height: Math.floor(image.height * 0.5)
      }

      oc.width = cur.width;
      oc.height = cur.height;

//      octx.drawImage(img, 0, 0, cur.width, cur.height);
      let W = cur.width;
      let H = cur.height;

      // initial  crop
      octx.drawImage(
          image,
          Math.floor(percentCrop.x*W*.01),
          Math.floor(percentCrop.y*H*.01),
          Math.floor(percentCrop.width*W*.01),
          Math.floor(percentCrop.height*H*.01),
          0,0,
          Math.floor(percentCrop.width*W*.01),
          Math.floor(percentCrop.height*H*.01)
      );

      let cnt = 0;
      while (cur.width * 0.5 > finalWidth) {
        //console.log ("looping:",  cnt++, cur.width, cur.height, finalWidth);
        cur = {
          width: Math.floor(cur.width * 0.5),
          height: Math.floor(cur.height * 0.5)
        };
        octx.drawImage(oc, 0, 0, cur.width * 2, cur.height * 2, 0, 0, cur.width, cur.height);
        //console.log (" ending loop with oc.width, oc.height:", oc.width, oc.height);
      }
       //console.log ("final step:", cur.width, cur.height, 0, 0, finalWidth, finalWidth/2);
      ctx.drawImage(oc, 0, 0, cur.width, cur.height, 0, 0,  finalWidth, finalWidth/2);
    }

    image.src = image64;  // must
}

export function imagetoNaturalCanvas(canvasRef, imageSrc, percentCrop) {

  const tmpCanvas = canvasRef;
  //console.log ("in imagetoNaturalCanvas: canvasRef=", tmpCanvas);

  const image = new Image();
  const ctx = tmpCanvas.getContext("2d");
  
  image.onload = function() {
    const W = image.naturalWidth;
    const H = image.naturalHeight;
    ctx.drawImage(
      image,
      Math.ceil(percentCrop.x*W*.01),
      Math.ceil(percentCrop.y*H*.01),
      Math.ceil(percentCrop.width*W*.01),
      Math.ceil(percentCrop.height*H*.01),
      0,0,
      Math.ceil(percentCrop.width*W*.01),
      Math.ceil(percentCrop.height*H*.01)
    );
  }

  image.src = imageSrc;

}