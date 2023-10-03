import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import styles from './id.module.css';

type Quote = {
  id: number;
  content: string;
};

const EditQuotePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [quote, setQuote] = useState<Quote | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { data, error, isLoading } = api.quotes.getById.useQuery({ id: id as string });

  useEffect(() => {
    if (data) {
      setQuote(data.quote);
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

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const renderParsedContent = (content: string) => {
    const regex = /(\*\*.*?\*\*)/g;
    const splitText = content.split(regex);

    return (
      <>
        {splitText.map((text, index) => {
          if (text.startsWith('**') && text.endsWith('**')) {
            return <span className={styles.highlight} key={index}>{text.slice(2, -2)}</span>;
          }
          return text;
        })}
      </>
    );
  };

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
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
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
        <div className={`${styles.blue} ${styles.cButton}`}></div>
        <div className={`${styles.green} ${styles.cButton}`}></div>
        <div className={`${styles.pink} ${styles.cButton}`}></div>
        <div className={`${styles.yellow} ${styles.cButton}`}></div>
      </div>
      <div style={{ height: '20px' }}></div>
      <button onClick={handleSave}>Save</button>
    </div >

  );
}

export default EditQuotePage;


// const renderParsedContent = (content: string) => {
//   const regex = /(\*\*.*?\*\*)/g;
//   const splitText = content.split(regex);

//   const renderedContent = splitText.map((text, index) => {
//     if (text.startsWith('**') && text.endsWith('**')) {
//       return <span className={styles.highlight} key={index}>{text.slice(2, -2)}</span>;
//     }

//     // Parse newline characters and return them as line breaks
//     const lines = text.split('\n').map((line, lineIndex) => (
//       <div key={lineIndex}>
//         {line}
//         {lineIndex !== text.split('\n').length - 1 && <br />}
//       </div>
//     ));

//     return lines;
//   });

//   return <>{renderedContent}</>;
// };