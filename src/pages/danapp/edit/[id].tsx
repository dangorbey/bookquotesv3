import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { api } from '~/utils/api';
import styles from './id.module.css';
import Navbar from '~/components/Navbar';
import * as htmlToImage from 'html-to-image';
import { LoremIpsum } from 'lorem-ipsum';

type Quote = {
  id: number;
  content: string;
};

const EditQuotePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [quote, setQuote] = useState<Quote | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);

  const { data } = api.quotes.getById.useQuery({
    id: id as string,
  });

  useEffect(() => {
    if (data) {
      setQuote(data.quote);
    }
  }, [data]);

  useEffect(() => {
    // A function to check if all images are loaded
    const imagesLoaded = () => {
      const images = document.querySelectorAll("img");
      for (const img of images) {
        if (!img.complete) {
          return false;
        }
      }
      return true;
    };

    // A function to execute when images are loaded
    const executeWhenImagesLoaded = () => {
      generateImageFromQuote();
    };

    // Only execute if quote and images are loaded
    if (quote && imagesLoaded()) {
      executeWhenImagesLoaded();
    } else { // Otherwise, add a load event listener to the window object
      window.addEventListener("load", executeWhenImagesLoaded);
      return () => {
        window.removeEventListener("load", executeWhenImagesLoaded);
      };
    }
  }, [quote]); // Added quote as a dependency

  // updates quote on backend
  const updateMutation = api.quotes.update.useMutation();

  // saves quote and leaves edit window
  const handleSave = () => {
    void (async () => {
      if (!quote) return;

      try {
        const updatedQuote = await updateMutation.mutateAsync({
          id: String(quote.id),
          content: quote.content,
          highlightColor: "#35ffe5"
        });
        setQuote(updatedQuote);
        void router.push('/danapp/quotes');
      } catch (error) {
        console.error("Failed to update the quote:", error);
      }
    })();
  };

  const generateImageFromQuote = () => {
    const offscreenElement = document.getElementById("capture");

    if (offscreenElement) {
      htmlToImage.toPng(offscreenElement)
        .then(dataUrl => {
          setImageURL(dataUrl);
        })
        .catch(error => {
          console.error('Error capturing the element:', error);
        });
    } else {
      console.error('Capture element not found');
    }
  };

  const [loremText, setLoremText] = useState('');

  useEffect(() => {
    // Only generate the text if it hasn't been generated yet
    if (!loremText) {
      const lorem = new LoremIpsum();
      setLoremText(lorem.generateParagraphs(3));
    }
  }, [loremText]);

  function parseContent(content: string) {
    const lines = content.split(/(?:\r\n|\r|\n)/g);
    return lines.map((line, i) => (
      <Fragment key={i}>
        {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <span className={styles.highlight} key={j}>
                {part.substring(2, part.length - 2)}
              </span>
            );
          }
          return part;
        })}
        <br />
      </Fragment>
    ));
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.loadFrame}>

          {imageURL ? (
            <img src={imageURL} className={styles.generatedImage} alt="Generated Quote" />
          ) : (
            <>
              <div className={styles.spinner}></div>
              <div className={styles.loadText}>Loading Image...</div>
            </>
          )}

        </div>
        <div className={styles.buttons}>
          <button onClick={handleSave}>
            Save
          </button>
          <button onClick={generateImageFromQuote}>
            Generate Image
          </button>
        </div >
      </div>

      <div className={styles.tempCenter}>
        <div className={styles.offscreenFrame}>
          <div id="capture" className={styles.capture}>
            <div className={styles.quoteFrame}>

              <div className={styles.lorem}>{loremText}</div>

              <br />

              <div className={styles.quote}>
                {quote && parseContent(quote.content)}
              </div>

              <br />

              <div className={styles.lorem}>{loremText}</div>

            </div>

            <div className={styles.mirrorWrapper}>
              <div className={styles.mirror}>{loremText + loremText}</div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}

export default EditQuotePage;