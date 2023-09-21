import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import styles from "./dbtests.module.css";

export default function Page() {
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
              <p>Let&apos;s save some text to the db.</p>
              <div style={{ height: '20px' }}></div>
              <form>
                <label htmlFor="text">Text</label>
                <input type="text" id="text" name="text" />
                <button type="submit">Submit</button>

              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}