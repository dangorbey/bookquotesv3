import { useRef } from 'react';
import type { ReactNode } from 'react';

interface SvgDownloaderProps {
  svgElement: ReactNode;
}

const SvgDownloader: React.FC<SvgDownloaderProps> = ({ svgElement }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const downloadImage = (format: 'png' | 'jpeg') => {
    const container = containerRef.current;
    if (!container) return;

    const svgElement = container.children[0] as SVGSVGElement;
    // Creating a canvas and setting its size
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgSize = svgElement.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;

    // Rendering SVG into the canvas
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    img.src = 'data:image/svg+xml,' + encodeURIComponent(svgData);
    img.onload = () => {
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imgURL = canvas.toDataURL('image/' + format);

        // Creating a link element to initiate the download
        const dlLink = document.createElement('a');
        dlLink.download = 'downloaded_image.' + format;
        dlLink.href = imgURL;
        dlLink.click();
      }
    };
  };

  return (
    <div ref={containerRef}>
      {svgElement}
      <button onClick={() => downloadImage('png')}>Download as PNG</button>
      <button onClick={() => downloadImage('jpeg')}>Download as JPEG</button>
    </div>
  );
};

export default SvgDownloader;
