import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';

type Quote = {
  id: number;  // Adjusted the type here
  content: string;
};

const EditQuotePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [quote, setQuote] = useState<Quote | null>(null);

  // Fetch the quote by ID
  const { data, error, isLoading } = api.quotes.getById.useQuery({ id: id as string });

  useEffect(() => {
    if (data) {
      setQuote(data.quote);
    }
  }, [data]);

  // Initialize the mutation hook for updating the quote
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
        void router.push('/danapp/quotes');  // Using 'void' here
      } catch (error) {
        console.error("Failed to update the quote:", error);
      }
    })();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading the quote</div>;

  return (
    <div>
      <textarea value={quote?.content ?? ''} onChange={(e) => setQuote({ ...quote!, content: e.target.value })} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default EditQuotePage;