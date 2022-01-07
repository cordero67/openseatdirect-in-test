// Converts a Base64-encoded string to a File object
export function base64StringtoFile(base64String, filename) {
  var arr = base64String.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// Downloads a Base64-encoded file
export function downloadBase64File(base64Data, filename) {
  var element = document.createElement("a");
  element.setAttribute("href", base64Data);
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Extracts a Base64 Image's File Extension
export function extractImageFileExtensionFromBase64(base64Data) {
  return base64Data.substring(
    "data:image/".length,
    base64Data.indexOf(";base64")
  );
}

export function extractContextTypeFromBase64 (base64Data) {
  return base64Data.substring('data:'.length, base64Data.indexOf(';base64'))
}

export function extractHeaderFromBase64 (base64Data) {
  return base64Data.substring(0, base64Data.indexOf(';base64')+';base64'.length);
}


// Converts a Base64 Image to Canvas with a Crop
export function image64toCanvasRef(canvasRef, image64, percentCrop) {
  const canvas = canvasRef; // document.createElement('canvas');
  //  const canvas = document.createElement('canvas');
  canvas.width = percentCrop.width;
  canvas.height = percentCrop.height;
  const ctx = canvas.getContext("2d");
  const image = new Image();
  image.src = image64;
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
    );
  };
}

// Converts a Base64 Image to Canvas with a Crop MM on 2 by 1 aspect
export function image64toCanvasRef2(canvasRefPreview, image64, percentCrop) {
  const image = new Image();
  const ctx = canvasRefPreview.getContext("2d");

  image.onload = function () {
    const W = image.width;
    const H = image.height;
    ctx.drawImage(
      image, 
      percentCrop.x * W * 0.01,
      percentCrop.y * H * 0.01,
      percentCrop.width * W * 0.01,
      percentCrop.height * H * 0.01,
      0,
      0, // the x an y coordinates where to place the image on the canvas
      300, // 300 The width of the image to use (stretch or reduce the image)
      150 // 150 The height of the image to use (stretch or reduce the image)
    );
  };

  image.src = image64; // must be after image.onload
}

// based on :   https://codesandbox.io/s/72py4jlll6?file=/src/index.js:1522-1726
// Converts a Base64 Image to Canvas with a Crop MM on 2 by 1 aspect
export function image64toCanvasRef2b(canvasRefPreview, image64, crop) {
  const image = new Image();
  
  const pixelRatio = window.devicePixelRatio;
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const ctx = canvasRefPreview.getContext("2d");
 
  canvasRefPreview.width = crop.width * pixelRatio * scaleX;
  canvasRefPreview.height = crop.height * pixelRatio * scaleY;

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = 'high';


  image.onload = function () {
    ctx.drawImage(
      image, 
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0, // the x an y coordinates where to place the image on the canvas
      300 * scaleX, // 300 The width of the image to use (stretch or reduce the image)
      150 * scaleY // 150 The height of the image to use (stretch or reduce the image)
    );
  };

  image.src = image64; // must be after image.onload
}

// Converts a Base64 Image to Canvas with a Crop MM on 2 by 1 aspect using
//  using smoothing algo for betting looking final image
export function image64toCanvasRef3(canvasRefPreview, image64, percentCrop) {
  const image = new Image();
  const ctx = canvasRefPreview.getContext("2d");

  image.onload = function () {
    const W = image.width;
    const H = image.height;

    ctx.drawImage(
      image,
      Math.floor(percentCrop.x * W * 0.01),
      Math.floor(percentCrop.y * H * 0.01),
      Math.floor(percentCrop.width * W * 0.01),
      Math.floor(percentCrop.height * H * 0.01),
      0,
      0,
      300,
      150
    );
  };

  image.src = image64; // must
}

export function image64toCanvasRef4(canvasRefPreview, image64, percentCrop) {
  //console.log ("** image64toCanvasRef4 44");
  const image = new Image();
  const ctx = canvasRefPreview.getContext("2d");

  image.onload = function () {
    let oc = document.createElement("canvas"),
      octx = oc.getContext("2d");

    let finalWidth = 300;
    var cur = {
      width: Math.floor(image.width * 0.5),
      height: Math.floor(image.height * 0.5),
    };

    oc.width = cur.width;
    oc.height = cur.height;

    let W = cur.width;
    let H = cur.height;

    // initial  crop
    octx.drawImage(
      image,
      Math.floor(percentCrop.x * W * 0.01),
      Math.floor(percentCrop.y * H * 0.01),
      Math.floor(percentCrop.width * W * 0.01),
      Math.floor(percentCrop.height * H * 0.01),
      0,
      0,
      Math.floor(percentCrop.width * W * 0.01),
      Math.floor(percentCrop.height * H * 0.01)
    );

    while (cur.width * 0.5 > finalWidth) {
      //console.log ("looping:",  cnt++, cur.width, cur.height, finalWidth);
      cur = {
        width: Math.floor(cur.width * 0.5),
        height: Math.floor(cur.height * 0.5),
      };
      octx.drawImage(
        oc,
        0,
        0,
        cur.width * 2,
        cur.height * 2,
        0,
        0,
        cur.width,
        cur.height
      );
    }
    ctx.drawImage(
      oc,
      0,
      0,
      cur.width,
      cur.height,
      0,
      0,
      finalWidth,
      finalWidth / 2
    );
  };

  image.src = image64; // must
}

export function imagetoNaturalCanvas(canvasRef, imageSrc, percentCrop) {
  const tmpCanvas = canvasRef;
  const image = new Image();
  const ctx = tmpCanvas.getContext("2d");

  image.onload = function () {
    const W = image.naturalWidth;
    const H = image.naturalHeight;
    ctx.drawImage(
      image,
      Math.ceil(percentCrop.x * W * 0.01),
      Math.ceil(percentCrop.y * H * 0.01),
      Math.ceil(percentCrop.width * W * 0.01),
      Math.ceil(percentCrop.height * H * 0.01),
      0,
      0,
      Math.ceil(percentCrop.width * W * 0.01),
      Math.ceil(percentCrop.height * H * 0.01)
    );
  };

  image.src = imageSrc;
}


const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.status);
  }
  return response;
};



export function uploadImage1 (imgSrc, percentCrop) {
  //  let imgurl = "https://api.openseatdirect.com/upload";
  let imgurl = "http://localhost:8000/media/upload";
  //      percentCrop.x * W * 0.01,
  //      percentCrop.y * H * 0.01,
  //     percentCrop.width * W * 0.01,
  //     percentCrop.height * H * 0.01,
  let body = {
          imgPctX:   percentCrop.x,
          imgPctY:   percentCrop.y,
          imgPctW:   percentCrop.w,
          imgPctH:   percentCrop.h,
          imgSrc: imgSrc
  };        
  console.log ("about to fetch ", 
    imgurl,
    { method: "POST",
    //              headers: myHeaders,
      body: JSON.stringify(body),
      redirect: "follow",
    });
    
  let myHeaders2 = new Headers();
  myHeaders2.append("Content-Type", "application/json");

  fetch(imgurl, {
      method: "POST",
      headers: myHeaders2,
      body: JSON.stringify(body)
  //              redirect: "follow",
  })
  .then(handleErrors)
  .then((response) => {
      console.log("response in imgpost", response);
      return response.json();
  })
  .then((res) => {
    console.log ("res=", res);
  })
  .catch((err) => {
    console.log ("err")
  });
}



//export function  base64toBlob  (base64Data, contentType)  {
//from  https://newbedev.com/creating-a-blob-from-a-base64-string-in-javascript
// first extract file extension





const  base64DatatoBlob = (base64Data) =>  {
  // converts base64 with header to blob
  // first extract header
  
 // let fixext      =  extractImageFileExtensionFromBase64 (base64Data);
  let contentType =  extractContextTypeFromBase64 (base64Data);
  let header      =  extractHeaderFromBase64 (base64Data);
   return b64toBlob(base64Data.substring(header.length+1), contentType);
}


// see
//https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript

const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
  
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}



export const  uploadImage =  async (url, header, imgSrc, percentCrop) =>  {
  
  // uploads images to cdn, givel url and header 
    console.log("in uploadImage....");


    let formData = new FormData();

    formData.append("imgPctX",   percentCrop.x);
    formData.append("imgPctY",   percentCrop.y);
    formData.append("imgPctW",   percentCrop.width);
    formData.append("imgPctH",   percentCrop.height);
    formData.append("imgSrc", base64DatatoBlob (imgSrc));

    // Display the key/value pairs
    console.log ("formData ...>")
      for (var pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }
 
    let arg1 = {method: "POST",
                headers:header,
               body: formData
    };
 
    console.log ("about to fetch:", url, arg1);
    return fetch(url, arg1)
    .then(response =>{
      if (!response.ok) {
        throw Error(response.status);
      }
      return response;
    })
    .then((response) => {
        if (!response.ok){
          throw new Error ("NOT_OK")
        }
        console.log("response in imgpost", response);
        return response.json();
    })
    .then((res) => {
      console.log ("exiting uploadImage with res=", res);
      return res;
    })
    .catch((err) => {
      console.log ("err in updateload Image", err);
      return {status: false};
    });
  }