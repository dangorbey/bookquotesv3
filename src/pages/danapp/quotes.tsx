import Link from "next/link";
import Navbar from "~/components/Navbar";
import { api } from "~/utils/api";
import styles from "./quotes.module.css";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";

const defaultQuote = "1. Click to edit!\n\n2. Any text you place **within two sets of asterisks** will be highlighted!\n\n3. Have fun!"

function QuoteListPage() {
  const { data, isLoading } = api.quotes.getUserQuotes.useQuery();
  const { mutate } = api.quotes.create.useMutation();
  const router = useRouter();
  const { user } = useUser();

  const handleCreateNewQuote = async () => {
    if (!user) return;

    try {
      await mutate(
        { content: defaultQuote },
        {
          onSuccess: (data) => {
            if (data?.id) {
              void router.push(`/danapp/edit/${data.id}`); // Explicitly ignore the promise
            } else {
              console.error("Failed to get the ID of the new quote.");
            }
          },
          onError: (error) => {
            console.error("Error creating a new quote:", error);
          },
        }
      );
    } catch (error) {
      console.error("Mutation error:", error);
    }
  };

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

      <div className={styles.createButtonContainer}>
        <button className={styles.createButton} onClick={handleCreateNewQuote}>Create a new quote!</button>
      </div>

      {isLoading && <div className={styles.loading}>Loading...</div>}

      {!data && !isLoading && <div>Something went wrong</div>}

      {data && (
        <div className={styles.container}>
          {data.map((fullQuote) => (
            <div className={styles.quote} key={fullQuote.quote.id}>
              <div>{formatQuoteContent(fullQuote.quote.content, fullQuote.quote.highlightColor ?? "#FFFF77")}</div>
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

