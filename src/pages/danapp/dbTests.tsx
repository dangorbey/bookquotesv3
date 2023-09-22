import { UserButton, currentUser, useAuth, useSession, useUser } from "@clerk/nextjs";
import Link from "next/link";
import styles from "./dbtests.module.css";
import { RouterOutputs, api } from "~/utils/api";
import { useState } from "react";

const CreatePostWizard = () => {
  const { user } = useUser();
  const [input, setInput] = useState("");

  const { mutate } = api.quotes.create.useMutation();

  if (!user) return null;

  return <div>
    <div style={{ height: '1px', backgroundColor: "#e9e9e9", margin: "20px" }}></div>
    <p>Hi {user.firstName}, write a quote!</p>
    <div style={{ height: '10px' }}></div>
    <input placeholder="Type your quote..."
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
    <button onClick={() => mutate({ content: input })}>Submit</button>
  </div>
}

type QuoteWithUser = RouterOutputs["quotes"]["getAll"][number];

const QuoteView = (props: QuoteWithUser) => {
  const { quote, author } = props;

  return (
    <div style={{ padding: '10px', border: "#e9e9e9 solid 1px", margin: "10px" }}>
      <img style={{ width: "50px", borderRadius: "100%" }} src={author.profileImage} />
      <div>{`@${author.username}`}</div>
      {quote.content}
    </div>
  )

}



export default function Page() {

  // const { user } = useUser();

  const { data, isLoading } = api.quotes.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Something went wrong</div>;

  return (
    <>
      <div className={styles.appContainer}>
        <header className={styles.header}>
          <nav className={styles.nav}>
            <p className={styles.pageTitle}>db Tests</p>
            <Link className={styles.navLink} href="/danapp/highlights">Highlights</Link>
          </nav>
          <div className={styles.usrBtn}>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.dbTest}>
              {...data?.map((fullQuote) => (
                <QuoteView {...fullQuote} key={fullQuote.quote.id} />

              ))}

              <CreatePostWizard />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}