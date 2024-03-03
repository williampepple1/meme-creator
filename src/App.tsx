import React, { useState, useRef, ChangeEvent } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [topText, setTopText] = useState<string>('');
  const [bottomText, setBottomText] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
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
    if (!imageSrc) {
      toast.error("Please upload an image to download your meme.");
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
    <div>
      <ToastContainer />
      <input type="file" onChange={handleImageChange} />
      <input
        type="text"
        placeholder="Top text"
        value={topText}
        onChange={(e) => setTopText(e.target.value)}
      />
      <input
        type="text"
        placeholder="Bottom text"
        value={bottomText}
        onChange={(e) => setBottomText(e.target.value)}
      />
      <button onClick={drawImageWithText}>Add Text</button>
      <button onClick={downloadMeme}>Download Meme</button>
      {imageSrc && <img src={imageSrc} alt="Uploaded" style={{ display: 'block', maxWidth: '100%', maxHeight: '500px', margin: '10px auto' }} />}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default App;
