import React, { useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface SvgCanvasProps {
  svgElement: ReactNode;
}

const SvgCanvas: React.FC<SvgCanvasProps> = ({ svgElement }) => {
  const [canvasUrl, setCanvasUrl] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const convertToCanvas = () => {
    const container = containerRef.current;
    if (!container) return;

    const svgElement = container.children[0] as SVGSVGElement;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgSize = svgElement.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    img.src = 'data:image/svg+xml,' + encodeURIComponent(svgData);
    img.onload = () => {
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        setCanvasUrl(canvas.toDataURL('image/png'));
      }
    };
  };

  return (
    <div ref={containerRef}>
      {svgElement}
      <button onClick={convertToCanvas}>Convert to Canvas</button>
      {canvasUrl && (
        <>
          <img src={canvasUrl} alt="Converted Canvas" />
          <a href={canvasUrl} download="canvas.png">
            <button>Download Canvas</button>
          </a>
        </>
      )}
    </div>
  );
};

export default SvgCanvas;
