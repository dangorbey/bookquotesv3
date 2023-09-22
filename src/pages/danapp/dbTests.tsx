import { UserButton, currentUser, useAuth, useSession, useUser } from "@clerk/nextjs";
import Link from "next/link";
import styles from "./dbtests.module.css";
import { RouterOutputs, api } from "~/utils/api";

const CreatePostWizard = () => {
  const { user } = useUser();

  if (!user) return null;

  return <div>
    <p>Hi {user.firstName}!</p>
    <div style={{ height: '10px' }}></div>
    <input placeholder="Type your quote..." />
  </div>
}

type QuoteWithUser = RouterOutputs["quotes"]["getAll"][number];

const QuoteView = (props: QuoteWithUser) => {
  const { quote, author } = props;

  return (
    <div>
      <img style={{ width: "50px", borderRadius: "100%" }} src={author.profileImage} />
      <div>{`@${author.username}`}</div>
      {quote.content}
    </div>
  )

}

// const QuoteView = (props: { quotes: QuoteWithUser }) => {
//   const { quote, author } = props;

//   return (
//     <div key={author}>
//       <img src={author.profilePictureUrl} />
//       <div>
//         {quote.quote}
//       </div>
//     </div>
//   )
// }


export default function Page() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  // const test = api.greeting.greeting.useQuery({ name: "Fred" });
  // const user = currentUser();
  const { user } = useUser();

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

              {/* <CreatePostWizard /> */}
              {/* {hello.data ? hello.data.greeting : "Loading tRPC query..."} */}
              {/* {data?.map((quote) => (
                <div key={quote.author?.id}>{quote.quote.name}</div>
              ))} */}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}