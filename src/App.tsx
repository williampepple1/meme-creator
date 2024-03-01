import React, { useState, useRef, ChangeEvent } from 'react';

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

  const drawImageWithText = () => {
    if (!imageSrc) return;
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
      ctx.textAlign = 'center';
      ctx.fillStyle = 'white';
      ctx.fillText(topText, canvas.width / 2, 40); // Positioning top text
      ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20); // Positioning bottom text
    };
    img.src = imageSrc;
  };

  const downloadMeme = () => {
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
      <canvas ref={canvasRef} style={{ display: 'block', margin: '0 auto' }} />
    </div>
  );
};

export default App;
