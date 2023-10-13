import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import styles from './id.module.css';
import Navbar from '~/components/Navbar';
import * as htmlToImage from 'html-to-image';
import { LoremIpsum } from 'lorem-ipsum';

type Quote = {
  id: number;
  content: string;
};

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

const EditQuotePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [quote, setQuote] = useState<Quote | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);


  const { data, error, isLoading } = api.quotes.getById.useQuery({
    id: id as string,
  });

  useEffect(() => {
    if (data) {
      setQuote(data.quote);
    }
  }, [data]);

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
          setImageURL(dataUrl); // Updating imageURL state with the generated image data URL
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
                {quote?.content}
              </div>

              <br />

              <div className={styles.lorem}>{loremText}</div>

            </div>

            <div className={`${styles.content} ${styles.mirror}`}>
              <div>{loremText + loremText}</div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}

export default EditQuotePage;

