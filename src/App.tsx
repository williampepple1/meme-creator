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

  const drawTextBackground = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number) => {
    ctx.font = '30px Arial';
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const padding = 10;
    ctx.fillStyle = 'white';
    const xPos = x - textWidth / 2 - padding;
    const yPos = y - 30;
    ctx.fillRect(xPos, yPos, textWidth + padding * 2, 40);
  };

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
      ctx.textAlign = 'center';

      if (topText) {
        drawTextBackground(ctx, topText, canvas.width / 2, 40);
        ctx.fillStyle = 'black';
        ctx.fillText(topText, canvas.width / 2, 40);
      }

      if (bottomText) {
        drawTextBackground(ctx, bottomText, canvas.width / 2, canvas.height - 20);
        ctx.fillStyle = 'black';
        ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20);
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
    <div className="p-4 max-w-md mx-auto">
      <ToastContainer />
      <div className="flex flex-col gap-4">
        <input type="file" className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" onChange={handleImageChange} />
        <input
          type="text"
          placeholder="Top text"
          className="input input-bordered w-full max-w-xs"
          value={topText}
          onChange={(e) => setTopText(e.target.value)}
        />
        <input
          type="text"
          placeholder="Bottom text"
          className="input input-bordered w-full max-w-xs"
          value={bottomText}
          onChange={(e) => setBottomText(e.target.value)}
        />
        <div className="flex gap-4">
          <button className="btn btn-primary" onClick={drawImageWithText}>Add Text</button>
          <button className="btn btn-secondary" onClick={downloadMeme}>Download Meme</button>
        </div>
      </div>
      {imageSrc && !textAdded && <img src={imageSrc} alt="Uploaded" className="mt-4 mx-auto max-w-xs rounded-lg shadow-lg" />}
      <canvas ref={canvasRef} className={`mt-4 ${textAdded ? 'block' : 'hidden'} mx-auto`} />
    </div>
  );
};

export default App;
