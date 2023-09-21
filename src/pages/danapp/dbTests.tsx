import { UserButton, currentUser } from "@clerk/nextjs";
import Link from "next/link";
import styles from "./dbtests.module.css";
import { api } from "~/utils/api";




export default function Page() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const test = api.greeting.greeting.useQuery({ name: "Fred" });

  // const user = await currentUser();

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
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
              <br ></br>
              <br ></br>
              {test.data ? test.data.text : "Loading tRPC query..."}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}