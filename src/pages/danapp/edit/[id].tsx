import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { api } from '~/utils/api';
import styles from './id.module.css';

type Quote = {
  id: number;
  authorId?: string;  // Add this if needed
  content: string;
  highlightColor: string | null | undefined;
};

const COLORS: string[] = [
  "#35ffe5",
  "#35ff80",
  "#ff77cd",
  "#ffe536"
];

const EditQuotePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [quote, setQuote] = useState<Quote | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [selected, setSelected] = useState<string>(COLORS[0] as string);

  const { data, error, isLoading } = api.quotes.getById.useQuery({ id: id as string });

  useEffect(() => {
    if (data) {
      setQuote({ ...data.quote, highlightColor: data.quote.highlightColor || undefined });
      if (data.quote.highlightColor) {
        setSelected(data.quote.highlightColor);
      } else {
        setSelected(COLORS[0] as string);

      }
    }

  }, [data]);

  const updateMutation = api.quotes.update.useMutation();

  const handleSave = async () => {
    if (!quote) return;
    try {
      const updatedQuote = await updateMutation.mutateAsync({
        id: String(quote.id),
        content: quote.content,
        highlightColor: selected
      });

      if (updatedQuote) {
        setQuote({
          id: updatedQuote.id,
          content: updatedQuote.content,
          highlightColor: updatedQuote.highlightColor || undefined
        });
      }

      router.push('/danapp/quotes');
    } catch (err) {
      console.error("Failed to update the quote:", err);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleBlur = () => setTimeout(() => setIsEditing(false), 150);

  const renderParsedContent = (content: string) => (
    <>
      {content.split('\n').map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {line.split(/(\*\*.*?\*\*)/g).map((text, index) => text.startsWith('**') && text.endsWith('**') ? (
            <span key={index} className={styles.highlight} style={{ backgroundColor: selected }}>
              {text.slice(2, -2)}
            </span>
          ) : text)}
          <br />
        </Fragment>
      ))}
    </>
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading the quote</div>;

  return (
    <div className={styles.container}>
      {isEditing ? (
        <textarea
          autoFocus
          className={styles.quoteEdit}
          value={quote?.content ?? ''}
          onChange={(e) => setQuote(prev => ({ ...prev!, content: e.target.value }))}
          onBlur={handleBlur}
        />
      ) : (
        <div className={styles.quote} onClick={handleEdit}>
          <div className={styles.quoteContent}>{renderParsedContent(quote?.content ?? '')}</div>
          <span className={styles.hoverText}>Click on the quote to edit</span>
        </div>
      )}

      <div style={{ height: '20px' }}></div>

      <div className={styles.colors}>
        {COLORS.map((color, index) => (
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
