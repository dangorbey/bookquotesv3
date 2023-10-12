import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { api } from '~/utils/api';
import styles from './id.module.css';


type Quote = {
  id: number;
  content: string;
};

const EditQuotePage: React.FC = () => {

  const colors = [
    "#35ffe5",
    "#35ff80",
    "#ff77cd",
    "#ffe536",
  ]

  const router = useRouter();
  const { id } = router.query;

  const [quote, setQuote] = useState<Quote | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [selected, setSelected] = useState<string>(colors[0]!);

  const { data, error, isLoading } = api.quotes.getById.useQuery({ id: id as string });

  useEffect(() => {
    if (data) {
      setQuote(data.quote);
      if (data.quote.highlightColor) {
        setSelected(data.quote.highlightColor);
      }
    }
  }, [data]);


  const updateMutation = api.quotes.update.useMutation();

  const handleSave = () => {
    void (async () => {
      if (!quote) return;

      try {
        const updatedQuote = await updateMutation.mutateAsync({
          id: String(quote.id),
          content: quote.content,
          highlightColor: selected  // Add this line
        });
        setQuote(updatedQuote);
        void router.push('/danapp/quotes');
      } catch (error) {
        console.error("Failed to update the quote:", error);
      }
    })();
  };


  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    // Introduce a short delay before exiting edit mode
    setTimeout(() => {
      setIsEditing(false);
    }, 150);
  };

  const renderParsedContent = (content: string) => {
    const lorem = "Nullam tempus eget erat a scelerisque. Curabitur ut dolor id est eleifend eleifend ut ut nibh. Nulla leo neque, faucibus non nulla vel, blandit convallis nunc. Pellentesque quis blandit libero. ";

    return (
      <div className={styles.textFrame}>
        <div className={styles.content}>
          <div className={styles.blur}>{lorem + lorem + lorem}</div>
          <div className={styles.quote}>
            <br />
            {content.split('\n').map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {line.split(/(\*\*.*?\*\*)/g).map((text, index) => {
                  if (!text) return null; // Handle possible undefined

                  if (text.startsWith('**') && text.endsWith('**')) {
                    return (
                      <span
                        className={styles.highlight}
                        style={{ backgroundColor: selected }}
                        key={index}
                      >
                        {text.slice(2, -2)}
                      </span>
                    );
                  }
                  return text;
                })}
                <br />
                <br />
              </Fragment>
            ))}
          </div>
          <div className={styles.blur}>{lorem}</div>
        </div>
        <div className={`${styles.content} ${styles.mirror}`}>
          <div>{lorem + lorem + lorem}</div>
        </div>
      </div>
    );
  };

  // function surroundWithLorem() {
  //   const lorem = "Nullam tempus eget erat a scelerisque. Curabitur ut dolor id est eleifend eleifend ut ut nibh. Nulla leo neque, faucibus non nulla vel, blandit convallis nunc. Pellentesque quis blandit libero. ";

  //   return (
  //     <div className={styles.textFrame}>
  //       <div className={styles.content}>
  //         <div className={styles.blur}>{lorem}</div>
  //         <div className={styles.quote}>sd</div>
  //         <div className={styles.blur}>{lorem}</div>
  //       </div>
  //       <div className={`${styles.content} ${styles.mirror}`}>
  //         <div>{lorem + lorem + lorem}</div>
  //       </div>
  //     </div>
  //   );
  // }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading the quote</div>;

  return (
    <div className={styles.container}>
      {isEditing ? (
        <textarea
          autoFocus
          className={styles.quoteEdit}
          value={quote?.content ?? ''}
          onChange={(e) => setQuote({ ...quote!, content: e.target.value })}
          onBlur={handleBlur}
        />
      ) : (
        <>
          <div
            className={styles.quote}
            onClick={handleEdit}
          >
            <div className={styles.quoteContent}>
              {renderParsedContent(quote?.content ?? '')}
            </div>

            <span className={styles.hoverText}>Click on the quote to edit</span>
          </div>

        </>
      )}

      <div style={{ height: '20px' }}></div>
      <div className={styles.colors}>
        {colors.map((color, index) => (
          <button
            key={index}
            style={{ backgroundColor: color }}
            className={`${styles.cButton} ${selected === color ? styles.selected : ''}`}
            onClick={() => setSelected(color)}
          />
        ))}
      </div>
      <div style={{ height: '20px' }}></div>
      <button onClick={handleSave}>Save</button>

    </div >
  );
}

export default EditQuotePage;