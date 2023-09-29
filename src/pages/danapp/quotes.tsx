import Link from "next/link";
import Navbar from "~/components/Navbar";
import { api } from "~/utils/api";

function QuoteListPage() {
  const { data, isLoading } = api.quotes.getUserQuotes.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div>
      <div>
        <Navbar />
      </div>
      {data.map((fullQuote) => (
        <div key={fullQuote.quote.id}>
          {fullQuote.quote.content}
          <Link href={`/danapp/edit/${fullQuote.quote.id}`}>Edit</Link>
        </div>
      ))}
    </div>
  );
}

export default QuoteListPage;
