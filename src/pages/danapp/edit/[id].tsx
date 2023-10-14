import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { api } from '~/utils/api';
import styles from './id.module.css';
import Navbar from '~/components/Navbar';
import * as htmlToImage from 'html-to-image';
import { LoremIpsum } from 'lorem-ipsum';
import EditQuoteModal from '~/components/EditQuoteModal';
import Spacer from '~/components/Spacer';

type Quote = {
  id: number;
  content: string;
};

// const colors = ["#35ffe5", "#35ff80", "#ff77cd", "#ffe536"];
const rgbaColors = ["rgba(53, 255, 229, 1)", "rgba(53, 255, 128, 1)", "rgba(255, 119, 205, 1)", "rgba(255, 229, 54, 1)"];

const EditQuotePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [quote, setQuote] = useState<Quote | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState<string>(rgbaColors[0]!); // State to handle selected color


  const { data } = api.quotes.getById.useQuery({
    id: id as string,
  });

  useEffect(() => {
    generateImageFromQuote();
  }, [selected]);

  useEffect(() => {
    if (data) {
      setQuote(data.quote);
      if (data.quote.highlightColor) {
        setSelected(data.quote.highlightColor); // Set selected color from fetched data
      }
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
          highlightColor: selected
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
            const matches = selected.match(/^rgba?\((\d+), (\d+), (\d+)(, [\d.]+)?\)$/);
            if (matches) {
              const [, r, g, b] = matches;
              const colorStops = [
                `rgba(${r}, ${g}, ${b}, 1) 0%`,  // Opacity 1
                `rgba(${r}, ${g}, ${b}, 0.5) 3%`, // Opacity 0.6
                `rgba(${r}, ${g}, ${b}, 0.9)` // Opacity 0.8
              ];
              return (
                <span
                  style={{
                    background: `linear-gradient(90deg, ${colorStops.join(', ')})`,
                  }}
                  className={styles.highlight}
                  key={j}>
                  {part.substring(2, part.length - 2)}
                </span>
              );
            }
          }
          return part;
        })}
        <br />
      </Fragment>
    ));
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleModalClose = () => {
    setIsEditing(false);
  };

  const handleModalSave = async (content: string) => {
    if (!quote) return;

    try {
      const updatedQuote = await updateMutation.mutateAsync({
        id: String(quote.id),
        content,
        highlightColor: selected // Save the selected highlight color
      });
      setQuote(updatedQuote);
      generateImageFromQuote(); // Re-generate the image
    } catch (error) {
      console.error("Failed to update the quote:", error);
    }
  };

  const generateFileName = (quoteContent: string, downloadCount: number) => {
    const firstWords = quoteContent.split(' ').slice(0, 2).join('_'); // Taking first two words
    return `Quote-${firstWords}-${downloadCount}.png`;
  };

  // Modified handleDownloadClick function
  const handleDownloadClick = () => {
    if (imageURL && quote) {
      // Getting the download count from local storage
      const storageKey = `quote_download_count_${quote.id}`;
      const previousCount = localStorage.getItem(storageKey) ?? '0';
      const downloadCount = parseInt(previousCount, 10) + 1;

      // Saving the new count back to local storage
      localStorage.setItem(storageKey, downloadCount.toString());

      // Generating the filename and initiating the download
      const fileName = generateFileName(quote.content, downloadCount);
      const downloadLink = document.createElement('a');
      downloadLink.href = imageURL;
      downloadLink.download = fileName;
      downloadLink.click();
    } else {
      console.error('No image available for download');
    }
  };


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
            Save Quote
          </button>
          <button onClick={generateImageFromQuote}>
            Reload Image
          </button>
          <button onClick={handleEditClick}>
            Edit Quote
          </button>
          <button onClick={handleDownloadClick}>
            Download Quote
          </button>
        </div >
        <Spacer height={20} />
        <div className={styles.buttons}>
          {rgbaColors.map((color, index) => (
            <button
              key={index}
              style={{ backgroundColor: color }}
              className={`${styles.cButton} ${selected === color ? styles.selected : ''}`}
              onClick={() => setSelected(color)}
            />
          ))}
        </div>
      </div>

      {isEditing && (
        <EditQuoteModal
          quote={quote}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}

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