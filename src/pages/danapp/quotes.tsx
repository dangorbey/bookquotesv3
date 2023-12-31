import Link from "next/link";
import Navbar from "~/components/Navbar";
import Spacer from "~/components/Spacer";
import { api } from "~/utils/api";
import styles from "./quotes.module.css";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";

const defaultQuote = "Type your quote here! **Highlight** the important parts!"

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
            void router.push(`/danapp/edit/${data.id}?isNew=true`); // Add query parameter here
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
          <span style={{ fontSize: "x-large", paddingRight: "10px" }} >+</span>Create a new quote!
        </button>

      </div>

      {isLoading && <div className={styles.loading}>Loading...</div>}

      {!data && !isLoading && <div>Something went wrong</div>}

      {
        data && (
          <div className={styles.container}>
            {data.map((fullQuote) => (
              <div className={styles.quote} key={fullQuote.quote.id}>
                <div>{formatQuoteContent(fullQuote.quote.content, fullQuote.quote.highlightColor ?? "rgba(255, 229, 54, 1)")}</div>
                <div style={{ height: '15px' }}></div>
                <Spacer height={15}></Spacer>
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
        )
      }
    </div >
  );
}

export default QuoteListPage;