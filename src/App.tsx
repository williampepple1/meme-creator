import React, { useState, useRef, ChangeEvent, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [topText, setTopText] = useState<string>('');
  const [bottomText, setBottomText] = useState<string>('');
  const [textAdded, setTextAdded] = useState<boolean>(false); // Track if text has been added
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
        setTextAdded(false); // Reset text added flag on new image upload
      };
      reader.readAsDataURL(file);
    }
  };

  const drawTextBackground = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
    
    ) => {
    const words = text.split(' ');
    let line = '';
    let lines = 0;

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            line = words[n] + ' ';
            lines++;
        } else {
            line = testLine;
        }
    }
    lines++; // Add the last line

    // Assuming a padding of 10px around the text for the background
    const padding = 10;
    const backgroundHeight = lines * lineHeight + padding * 2; // Total height of the background
    const startY = y - lineHeight; // Adjust based on the text alignment

    // Draw the background
    ctx.fillStyle = 'white';
    ctx.fillRect(x - maxWidth / 2 - padding, startY, maxWidth + padding * 2, backgroundHeight);

    // Reset fillStyle for text drawing
    ctx.fillStyle = 'black';
}

  const drawWrappedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
    ) => {
    const words = text.split(' ');
    let line = '';
    let testLine = '';
    let testWidth = 0;

    for (let n = 0; n < words.length; n++) {
        testLine = line + words[n] + ' ';
        testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}


  const drawImageWithText = useCallback(() => {
    if (!imageSrc) {
      return;
    }
    setTextAdded(true); // Indicate that text has been added
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      return;
    }
    const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    const maxWidth = canvas.width - 40; // Adjust based on your canvas size
    const lineHeight = 35; // Adjust based on your font size

    if (topText) {
      const topY = 40; // Adjust based on where you want the top text to start
      drawTextBackground(ctx, topText, canvas.width / 2, topY, maxWidth, lineHeight);
      drawWrappedText(ctx, topText, canvas.width / 2, topY, maxWidth, lineHeight);
    }

    if (bottomText) {
      const bottomY = canvas.height - (lineHeight * 2); // Start position for bottom text, adjust as needed
      drawTextBackground(ctx, bottomText, canvas.width / 2, bottomY, maxWidth, lineHeight);
      drawWrappedText(ctx, bottomText, canvas.width / 2, bottomY, maxWidth, lineHeight);
    }
  };
  img.src = imageSrc;
}, [imageSrc, topText, bottomText]);

  useEffect(() => {
    if (imageSrc) {
      drawImageWithText();
    }
  }, [imageSrc, topText, bottomText, drawImageWithText]);

  const downloadMeme = () => {
    if (!imageSrc || !textAdded) {
      toast.error("Please upload an image and add text to download your meme.");
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = image;
    link.click();
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col justify-center items-center p-4">
      <ToastContainer />

      {/* Central Card Wrapper */}
      <div className="card bg-base-100 shadow-2xl w-full max-w-5xl">
        <div className="card-body">
          {/* Header */}
          <h1 className="text-4xl font-bold text-center text-primary mb-8">Meme Creator</h1>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Controls Section */}
            <div className="flex flex-col space-y-6">
              <h2 className="text-2xl font-semibold border-b border-secondary pb-2">Edit Your Meme</h2>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Upload Image</span>
              </label>
              <input type="file" onChange={handleImageChange} className="file-input file-input-bordered file-input-primary w-full" />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Top Text</span>
              </label>
              <input type="text" placeholder="Enter top text here..." value={topText} onChange={(e) => setTopText(e.target.value)} className="input input-bordered w-full" />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Bottom Text</span>
              </label>
              <input type="text" placeholder="Enter bottom text here..." value={bottomText} onChange={(e) => setBottomText(e.target.value)} className="input input-bordered w-full" />
            </div>

            <div className="card-actions justify-end mt-4">
              <button onClick={downloadMeme} className="btn btn-primary w-full sm:w-auto mt-4 text-primary-content">Download Meme</button>
            </div>
            </div>

            {/* Preview Section */}
            <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-secondary rounded-xl p-4 bg-base-200">
               <h2 className="text-2xl font-semibold mb-4 w-full text-center text-accent">Preview</h2>
              {!imageSrc && (
                <div className="text-center text-base-content/50 my-auto flex flex-col items-center">
                  <span className="text-4xl mb-2">📸</span>
                  <p>Upload an image to start creating your meme!</p>
                </div>
              )}

              {imageSrc && !textAdded && (
                 <img src={imageSrc} alt="Uploaded" className="max-w-full h-auto rounded-lg shadow-md border border-primary/20" />
              )}

              <canvas ref={canvasRef} className={`max-w-full h-auto rounded-lg shadow-md border border-primary/20 ${textAdded ? 'block' : 'hidden'}`} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
