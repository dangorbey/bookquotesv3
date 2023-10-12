import { useEffect } from 'react';
import Navbar from "~/components/Navbar";
import styles from './vision.module.css';
import * as htmlToImage from 'html-to-image';


function surroundWithLorem() {
  const lorem = "Nullam tempus eget erat a scelerisque. Curabitur ut dolor id est eleifend eleifend ut ut nibh. Nulla leo neque, faucibus non nulla vel, blandit convallis nunc. Pellentesque quis blandit libero. ";

  return (
    <div className={styles.textFrame}>
      <div className={styles.content}>
        <div className={styles.blur}>{lorem}</div>
        <div className={styles.quote}>Thus in love the free-lovers say: ‘Let us have the splendor of offering ourselves without the peril of committing ourselves; let us see whether <span className={styles.highlight}>one cannot commit suicide an unlimited number of times.</span></div>
        <div className={styles.blur}>{lorem}</div>
      </div>
      <div className={`${styles.content} ${styles.mirror}`}>
        <div>{lorem + lorem + lorem}</div>
      </div>
    </div>
  );
}

export default function Page() {

  useEffect(() => {
    const element = document.querySelector("." + styles.frame);
    const imageContainer = document.getElementById('imageContainer');

    if (imageContainer) {
      imageContainer.innerHTML = '<div>Loading...</div>';
    }

    if (element) {
      htmlToImage.toPng(element as HTMLElement)
        .then(dataUrl => {
          const img = new Image();
          img.src = dataUrl;
          img.style.display = 'block';
          img.style.width = '100%';

          if (imageContainer) {
            imageContainer.innerHTML = '';
            imageContainer.appendChild(img);
          } else {
            console.error('Image container not found')
          }

          (element as HTMLElement).style.display = 'none';
        })
        .catch(error => {
          console.error('Error capturing the element:', error);
        });
    }

  }, []);

  return (
    <div>
      <div>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.frame}>
            {surroundWithLorem()}
          </div>
          <div className={styles.imageContainer} id="imageContainer"></div>
        </div>
      </div >
    </div>
  )
}