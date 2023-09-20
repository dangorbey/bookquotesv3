import Head from "next/head";
import styles from "./index.module.css";
import { SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {

  return (
    <>
      <Head>
        <title>Dan tries CSS again</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1>Hi there!</h1>
          <p>
            Welcome to Dan's super cool site.
          </p>
          <p className={styles.directions}>
            Please sign in to continue.
          </p>
          <div style={{ height: '5px' }}></div>
          <div className={styles.buttonHolder}>
            <SignInButton>
              <button className={styles.signIn}>Sign In</button>
            </SignInButton>
            {/* <SignOutButton>
              <button className={styles.signIn}>Sign Out</button>
            </SignOutButton> */}
          </div>
        </div>
      </main >
    </>
  );
}