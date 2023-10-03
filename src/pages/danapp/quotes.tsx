import Link from "next/link";
import Navbar from "~/components/Navbar";
import { api } from "~/utils/api";
import styles from "./quotes.module.css";

function QuoteListPage() {
  const { data, isLoading } = api.quotes.getUserQuotes.useQuery();

  const formatQuoteContent = (content: string, highlightColor: string) => {
    const parts = content.split(/\*\*(.*?)\*\*/).map((part, index) =>
      index % 2 === 0 ? part : (
        <span
          className={styles.highlight}
          style={{ backgroundColor: highlightColor }}
          key={index}
        >
          {part}
        </span>
      )
    );

    return parts;
  };


  return (
    <div>
      <Navbar />

      {isLoading && <div className={styles.loading}>Loading...</div>}

      {!data && !isLoading && <div>Something went wrong</div>}

      {data && (
        <div className={styles.container}>
          {data.map((fullQuote) => (
            <div className={styles.quote} key={fullQuote.quote.id}>
              <div>{formatQuoteContent(fullQuote.quote.content, fullQuote.quote.highlightColor || "#FFFF77")}</div>
              <div style={{ height: '10px' }}></div>
              <Link className={styles.edit} href={`/danapp/edit/${fullQuote.quote.id}`}>Edit</Link>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default QuoteListPage;

