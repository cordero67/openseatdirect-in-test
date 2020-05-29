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
export function image64toCanvasRef (canvasRef, image64, pixelCrop) {
  const canvas = canvasRef // document.createElement('canvas');
//  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  const ctx = canvas.getContext('2d')
  const image = new Image()
  image.src = image64
  image.onload = function () {
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    )
  }
}

// Converts a Base64 Image to Canvas with a Crop MM on 2 by 1 aspect
export function image64toCanvasRef2 (canvasRef, image64, pixelCrop) {
  console.log ("** image64toCanvasRef2");
  const image = new Image();
  image.src = image64;
  const canvas = canvasRef // document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  console.log ( "canvas w h:",canvas.width, canvas.height);

  image.onload = function () {
    console.log (" >pixelCrop:", pixelCrop);
    console.log ("***** : image.width:", image.width);
    console.log ("***** : image.height:", image.height);
    console.log ("***** : pixelCrop.width:", pixelCrop.width);
    console.log ("***** : pixelCrop.height:", pixelCrop.height);
    const W = image.width;
    const H = image.height;
    console.log  (" ARGS:", 
      pixelCrop.x*W*.01,    //OK
      pixelCrop.y*H*.01,
      pixelCrop.width*W*.01,
      pixelCrop.height*H*.01,
      0,0,
      pixelCrop.width*W*.01,
      pixelCrop.height*H*.01);

    // pixcelCrop is in % but input should be in px
    ctx.drawImage(
      image,
      pixelCrop.x*W*.01,
      pixelCrop.y*H*.01,
      pixelCrop.width*W*.01,
      pixelCrop.height*H*.01,
      0,0,
      300,
      150
    );
  }
}