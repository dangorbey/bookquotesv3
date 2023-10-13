import Navbar from "~/components/Navbar";
import styles from './loading.module.css';
import { useEffect, useState } from "react";
import * as htmlToImage from 'html-to-image';
import Spacer from "~/components/Spacer";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOffscreen, setShowOffscreen] = useState(true); // New state for offscreen visibility
  const [generateImage, setGenerateImage] = useState(true); // New state to trigger image regeneration


  useEffect(() => {
    if (!generateImage) return; // Only run if generateImage is true

    const offscreenElement = document.querySelector("." + styles.offscreen);

    if (offscreenElement) {
      htmlToImage.toPng(offscreenElement as HTMLElement)
        .then(dataUrl => {
          const img = new Image();
          img.src = dataUrl;
          img.style.display = 'block';
          img.style.width = '100%';

          const imageContainer = document.getElementById('imageContainer');
          if (imageContainer) {
            imageContainer.innerHTML = '';
            imageContainer.appendChild(img);
            setIsLoading(false);
            // setShowOffscreen(false); // Hide offscreen after image is ready
          } else {
            console.error('Image container not found');
          }
        })
        .catch(error => {
          console.error('Error capturing the element:', error);
        });
    } else {
      console.error('Offscreen element not found');
    }
    setGenerateImage(false); // Reset generateImage state after image has been generated
  }, [generateImage]);

  const lorem = "Nullam tempus eget erat a scelerisque. Curabitur ut dolor id est eleifend eleifend ut ut nibh. Nulla leo neque, faucibus non nulla vel, blandit convallis nunc. Pellentesque quis blandit libero. ";

  const toggleOffscreenVisibility = () => {
    setShowOffscreen(prevState => !prevState);
  };

  const downloadImage = () => {
    const imageContainer = document.getElementById('imageContainer');
    if (imageContainer) {
      const img = imageContainer.getElementsByTagName('img')[0];
      if (img) {
        const link = document.createElement('a');
        link.href = img.src;

        // Retrieve and update download count from localStorage
        let downloadCount = localStorage.getItem('downloadCount');
        downloadCount = downloadCount ? (Number(downloadCount) + 1).toString() : '1';
        localStorage.setItem('downloadCount', downloadCount);

        link.download = `downloaded_image_${downloadCount}.png`;
        link.click();
      }
    }
  };


  return (
    <div>
      <Navbar />
      <div className={styles.container}>

        {isLoading ? (
          <div className={styles.loadFrame}>
            <div className={styles.spinner}></div>
            <div className={styles.loadText}>Loading Image...</div>
          </div>
        ) : null}

        <div className={styles.imageFrame}>
          <div id="imageContainer"></div>
        </div>

        <div>
          <button onClick={toggleOffscreenVisibility}>
            Toggle Offscreen Div Visibility
          </button>
          <button onClick={() => setGenerateImage(true)}>
            Regenerate Image
          </button>
          <button onClick={downloadImage}>
            Download Image
          </button>
        </div>

      </div>

      {/* Render offscreen div based on showOffscreen state */}
      {showOffscreen &&
        <div className={styles.offscreen}>
          <div className={styles.textFrame}>
            <div className={styles.content}>
              <div className={styles.blur}>{lorem}</div>
              <Spacer height={15} />
              <div className={styles.quote}>Thus in love the free-lovers say: ‘Let us have the splendor of offering ourselves without the peril of committing ourselves; let us see whether <span className={styles.highlight}>one cannot commit suicide an unlimited number of times.</span></div>
              <Spacer height={15} />
              <div className={styles.blur}>{lorem}</div>
            </div>
            <div className={`${styles.content} ${styles.mirror}`}>
              <div>{lorem + lorem + lorem}</div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

