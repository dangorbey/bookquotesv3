import Head from "next/head";
import styles from "./highlights.module.css";
import { useState } from "react";
import { colors } from "../utils/colors";
import { UserButton } from "@clerk/nextjs";


export default function Page() {

  const [selected, setSelected] = useState<number>(0);
  const selectedColor = selected !== null ? colors[selected] : undefined;

  return (
    <>
      <Head>
        <title>Dan tries CSS again</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Highlights Page</h1>
        <div className={styles.usrBtn}>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.highlight} style={{
          backgroundColor: selectedColor?.base ?? 'initial'
        }}>
          Highlight Colors
        </div>
        <div style={{ height: '20px' }}></div>
        <div className={styles.container}>
          {colors.map((color, index) => (
            <button
              key={index}
              data-selected={selected === index}
              className={styles.colorButton}
              style={{
                '--color-base': color.base,
                '--color-dark': color.dark,
                '--color-darkest': color.darkest
              } as React.CSSProperties}  // <-- assertion here
              onClick={() => setSelected(index)}
            />
          ))}
        </div>
      </main >
    </>
  );
}