import React, { useRef, useEffect } from 'react'
import './Canvas.css'


const Canvas = props => {
  
  const canvasRef = useRef(null)
  

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    //Our first draw
    ctx.imageSmoothingEnabled = false;
    var imgW = 32;
    var imgH = 32;

    // generate a 20*20 ImageData full of noise
    // var data = new Uint8Array(imgW * imgH * 4);
    // crypto.getRandomValues(data);
    // var img = new ImageData(new Uint8ClampedArray(data.buffer), imgW, imgH);


    const inputData = props.data.input.map(v => v*255)
    const imageDataBuffer = new Uint8ClampedArray(32 * 32 * 4)

    for (let rowI=0; rowI<32; rowI++) {
        for (let colI=0; colI<32; colI++) {
            const pos = (rowI * 32 + colI) * 4
            imageDataBuffer[pos]   = inputData[rowI * 32 + colI]
            imageDataBuffer[pos+1] = inputData[rowI * 32 + colI + 1024]
            imageDataBuffer[pos+2] = inputData[rowI * 32 + colI + 2048]
            imageDataBuffer[pos+3] = 255
        }
    }

    var img = new ImageData(imageDataBuffer, imgW, imgH);

    // we use the main canvas as renderer
    ctx.putImageData(img, 0, 0);
    // Now we have an unscaled version of our ImageData
    // let's make the compositing mode to 'copy' so that our next drawing op erases whatever was there previously
    // just like putImageData would have done
    ctx.globalCompositeOperation = 'copy';
    // now we can draw ourself over ourself.    
    ctx.drawImage(canvas,
    0,0, img.width, img.height, // grab the ImageData part
    0,0, canvas.width, canvas.height // scale it
    );
  }, [props])
  
  return <canvas className="canvasImage" ref={canvasRef} {...props}/>
}

export default Canvas