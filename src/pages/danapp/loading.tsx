import Navbar from "~/components/Navbar";
import styles from './loading.module.css';
import { useEffect, useState } from "react";
import * as htmlToImage from 'html-to-image';

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOffscreen, setShowOffscreen] = useState(true); // New state for offscreen visibility

  useEffect(() => {
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
            setShowOffscreen(false); // Hide offscreen after image is ready
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
  }, []);

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
      </div>

      {/* Render offscreen div based on showOffscreen state */}
      {showOffscreen &&
        <div className={styles.offscreen}>
          Your content to capture goes here
          <h1>This is a test</h1>
          <p>Here is some super clarifying text. Hope this works for you Dan!</p>
        </div>
      }
    </div>
  );
}

