import Link from "next/link";
import Navbar from "~/components/Navbar";
import { api } from "~/utils/api";
import styles from "./quotes.module.css";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";

const defaultQuote = "1. Click to edit!\n\n2. Any text you place **within two sets of asterisks** will be highlighted!\n\n3. Have fun!"

function QuoteListPage() {
  const { data, isLoading, refetch } = api.quotes.getUserQuotes.useQuery();
  const { mutate } = api.quotes.create.useMutation();
  const router = useRouter();
  const { user } = useUser();

  const handleCreateNewQuote = () => {
    if (!user) return;

    mutate(
      { content: defaultQuote },
      {
        onSuccess: (data) => {
          if (data?.id) {
            void router.push(`/danapp/edit/${data.id}`);
          } else {
            console.error("Failed to get the ID of the new quote.");
          }
        },
        onError: (error) => {
          console.error("Error creating a new quote:", error);
        },
      }
    );
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

  const { mutate: deleteMutate } = api.quotes.delete.useMutation();

  const handleDeleteQuote = (quoteId: number) => {
    if (!user) return;

    const isConfirmed = window.confirm("Are you sure you want to delete this quote?");

    if (!isConfirmed) return;

    deleteMutate(
      { id: quoteId.toString() },
      {
        onSuccess: () => {
          void refetch();
        },
        onError: (error) => {
          console.error("Error deleting the quote:", error);
        },
      }
    );
  };

  return (
    <div>
      <Navbar />

      <div className={styles.createButtonContainer}>
        <button
          className={styles.createButton}
          onClick={() => { void handleCreateNewQuote(); }}
        >
          Create a new quote!
        </button>

      </div>

      {isLoading && <div className={styles.loading}>Loading...</div>}

      {!data && !isLoading && <div>Something went wrong</div>}

      {data && (
        <div className={styles.container}>
          {data.map((fullQuote) => (
            <div className={styles.quote} key={fullQuote.quote.id}>
              <div>{formatQuoteContent(fullQuote.quote.content, fullQuote.quote.highlightColor ?? "#FFFF77")}</div>
              <div style={{ height: '15px' }}></div>
              <div className={styles.qButtons}>
                <button className={styles.commonButtonStyle}>
                  <Link className={styles.edit} href={`/danapp/edit/${fullQuote.quote.id}`}>Edit</Link>
                </button>
                <button
                  className={`${styles.commonButtonStyle} ${styles.deleteButton}`}
                  onClick={() => handleDeleteQuote(fullQuote.quote.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default QuoteListPage;