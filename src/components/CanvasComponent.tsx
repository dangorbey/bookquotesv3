import { useRef, useEffect } from 'react';

type CanvasProps = {
  draw: (ctx: CanvasRenderingContext2D) => void;
};

const CanvasComponent: React.FC<CanvasProps> = ({ draw }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getDownloadCount = () => {
    const storedCount = localStorage.getItem('downloadCount');
    return storedCount ? parseInt(storedCount) : 0;
  }


  const setDownloadCount = (count: number) => {
    localStorage.setItem('downloadCount', count.toString());
  }


  const handleDownload = () => {
    if (canvasRef.current) {
      const canvas: HTMLCanvasElement = canvasRef.current;
      const dataURL = canvas.toDataURL();
      const link = document.createElement('a');
      link.href = dataURL;
      let currentCount = getDownloadCount();
      currentCount += 1;
      setDownloadCount(currentCount); // Store updated count
      link.download = `canvas-image-${currentCount}.png`; // Append count to filename
      link.click();
    }
  };


  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!;
    const context = canvas.getContext('2d')!;
    canvas.width = 1080;
    canvas.height = 1080;
    draw(context);
  }, [draw]);

  return (
    <>
      <canvas ref={canvasRef} width={1080} height={1080} />
      <div>
        <button onClick={handleDownload}>Download as Image</button>

      </div>
    </>

  )
};

export default CanvasComponent;