import Link from "next/link";
import Navbar from "~/components/Navbar";
import { api } from "~/utils/api";
import styles from "./quotes.module.css";

function QuoteListPage() {
  const { data, isLoading } = api.quotes.getUserQuotes.useQuery();

  // Function to highlight content within asterisks
  const formatQuoteContent = (content: string) => {
    // Using regex to replace **some content** with <span className={styles.highlight}>some content</span>
    return content.replace(/\*\*(.*?)\*\*/g, `<span class="${styles.highlight}">$1</span>`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div>
      <Navbar />
      {isLoading && <div>Loading...</div>}
      {!data && <div>Something went wrong</div>}
      <div className={styles.container}>
        {data?.map((fullQuote) => (
          <div className={styles.quote} key={fullQuote.quote.id}>
            {/* Using dangerouslySetInnerHTML to render the formatted content */}
            <div dangerouslySetInnerHTML={{ __html: formatQuoteContent(fullQuote.quote.content) }}></div>
            <div style={{ height: '10px' }}></div>
            <Link className={styles.edit} href={`/danapp/edit/${fullQuote.quote.id}`}>Edit</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuoteListPage;
