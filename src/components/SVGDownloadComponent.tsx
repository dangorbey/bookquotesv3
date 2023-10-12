import { useRef, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface ApiResponse {
  screenshot: string;
}


function getDownloadCount(): number {
  const storedCount = localStorage.getItem('downloadCount');
  return storedCount ? parseInt(storedCount) : 0;
}

function setDownloadCount(count: number) {
  localStorage.setItem('downloadCount', count.toString());
}

function wrapText(text: string, maxLength: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word: string) => {
    if ((currentLine + word).length < maxLength) {
      currentLine += word + ' ';
    } else {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    }
  });

  if (currentLine) {
    lines.push(currentLine.trim());
  }

  return lines;
}

const lorem = "Nullam tempus eget erat a scelerisque. Curabitur ut dolor id est eleifend eleifend ut ut nibh. Nulla leo neque, faucibus non nulla vel, blandit convallis nunc. Pellentesque quis blandit libero. ";
const quote = "Thus in love the free-lovers say: ‘Let us have the splendor of offering ourselves without the peril of committing ourselves; let us see whether one cannot commit suicide an unlimited number of times.";
const lines = wrapText(lorem + lorem + "\n\n" + quote + lorem, 45);
// const quoteLines = wrapText(quote, 40);
// const lines = wrapText("one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen", 15);



function SVGDownloadComponent() {

  // const textToDisplay = "Nullam tempus eget erat a scelerisque. Curabitur ut dolor id est eleifend eleifend ut ut nibh. Nulla leo neque, faucibus non nulla vel, blandit convallis nunc. Pellentesque quis blandit libero. ";
  const svgRef = useRef<SVGSVGElement>(null);
  const [url, setUrl] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');

  const handleCaptureScreenshot = async () => {
    const token = 'EFJAW33-85JMJE3-MNYZ5P2-FB7Q36C';
    const pageUrl = url || 'https://your-default-url.com';

    const apiEndpoint = `https://api.screenshotapi.net/screenshot?token=${token}&url=${encodeURIComponent(pageUrl)}&width=1200&height=800&fresh=true`;

    try {
      const response = await axios.get<ApiResponse>(apiEndpoint);
      setScreenshotUrl(response.data?.screenshot || '');
    } catch (error) {
      console.error('Failed to capture the screenshot', error);
    }
  };

  const handleButtonClick = () => {
    handleCaptureScreenshot().catch(error => {
      console.error('An error occurred while capturing the screenshot:', error);
    });
  };



  const handleDownload = () => {
    if (svgRef.current) {
      downloadSvgAsPng(svgRef.current);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL of the page hosting your SVG"
      />
      <button onClick={handleButtonClick}>
        Capture Screenshot
      </button>

      {screenshotUrl && (
        <div>
          <Image
            src={screenshotUrl}
            alt="SVG Screenshot"
            width={500} // specify a width
            height={300} // and a height
            layout="responsive" // this will keep the aspect ratio
          />
        </div>
      )}

      <svg ref={svgRef} viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="blurFilter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
          <pattern id="imagePattern" x="0" y="0" width="1" height="1" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
            <image href="/sprinkles.png" x="0" y="0" width="1000" height="1000" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="lightblue" />
        <rect width="100%" height="100%" fill="url(#imagePattern)" style={{ mixBlendMode: "multiply" }} />


        <text
          x="50%"
          y="0%"
          dominantBaseline="middle"
          textAnchor="start"
          fontFamily="dapifer"
          fontSize="50"
          filter="url(#blurFilter)"
        >
          {lines.map((line, index) => (
            <tspan key={index} x="50%" dy={index === 0 ? '0' : '1.2em'}>{line}</tspan>
          ))}
        </text>

      </svg>
      <button onClick={handleDownload}>Download as PNG</button>
    </div>
  );
}

function downloadSvgAsPng(svgEl: SVGSVGElement) {
  const data = new XMLSerializer().serializeToString(svgEl);
  const blob = new Blob([data], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx!.drawImage(img, 0, 0);
    canvas.toBlob((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob!);
      let currentCount = getDownloadCount();
      currentCount += 1;
      setDownloadCount(currentCount); // Store updated count
      link.download = `downloaded_image-${currentCount}.png`; // Append count to filename
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  img.src = url;
}

export default SVGDownloadComponent;
