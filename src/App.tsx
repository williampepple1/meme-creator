import React, { useState, useRef, ChangeEvent } from 'react';
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

  const drawWrappedText = (ctx, text, x, y, maxWidth, lineHeight) => {
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


  const drawImageWithText = () => {
    if (!imageSrc) {
        toast.error("Please upload an image before adding text.");
        return;
    }
    setTextAdded(true); // Indicate that text has been added
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        ctx.font = '30px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';

        // Adjust these values as needed
        const maxWidth = canvas.width - 40; // 20px padding on each side
        const lineHeight = 35; // Adjust line height as needed
        const topY = 40; // Starting Y position for top text
        const bottomY = canvas.height - 20; // Starting Y position for bottom text, adjust as needed

        // Draw top text
        if (topText) {
            drawWrappedText(ctx, topText, canvas.width / 2, topY, maxWidth, lineHeight);
        }

        // Draw bottom text
        if (bottomText) {
            // This simply flips the bottom text upside down; you might want to adjust its calculation
            drawWrappedText(ctx, bottomText, canvas.width / 2, bottomY, maxWidth, lineHeight);
        }
    };
    img.src = imageSrc;
};


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
    <div className="flex justify-center items-center min-h-screen">
      <div className="p-4 space-y-4 max-w-md mx-auto">
        <ToastContainer />
        <input type="file" onChange={handleImageChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
        <input type="text" placeholder="Top text" value={topText} onChange={(e) => setTopText(e.target.value)} className="input input-bordered w-full max-w-xs" />
        <input type="text" placeholder="Bottom text" value={bottomText} onChange={(e) => setBottomText(e.target.value)} className="input input-bordered w-full max-w-xs" />
        <div className="flex gap-4 justify-center">
          <button onClick={drawImageWithText} className="btn btn-primary">Add Text</button>
          <button onClick={downloadMeme} className="btn btn-secondary">Download Meme</button>
        </div>
        {imageSrc && !textAdded && (
          <img src={imageSrc} alt="Uploaded" className="mt-4 mx-auto max-w-xs rounded-lg shadow-lg" />
        )}
        <canvas ref={canvasRef} className={`mt-4 ${textAdded ? 'block' : 'hidden'} mx-auto`} />
      </div>
    </div>
  );
};

export default App;
