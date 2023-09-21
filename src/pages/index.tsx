import Head from "next/head";
import styles from "./index.module.css";
import { SignInButton, SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

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
            Welcome to Dan&apos;s super cool site.
          </p>
          <p className={styles.directions}>
            Please sign in to continue.
          </p>
          <div style={{ height: '5px' }}></div>
          <div className={styles.buttonHolder}>
            <SignedOut>
              <SignInButton afterSignInUrl="/danapp/highlights" afterSignUpUrl="/danapp/highlights">
                <button className={styles.signIn}>Sign In</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <SignOutButton>
                <button className={styles.signIn}>Sign Out</button>
              </SignOutButton>
              <Link className={styles.signIn} href="/danapp/highlights">Highlights</Link>
            </SignedIn>
          </div>
        </div>
      </main >
    </>
  );
}