import React from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { useRouter } from "next/router";
import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const router = useRouter();

  const isCurrentPath = (path: string) => {
    return router.pathname === path;
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.menu}>
          <ul className={styles.navList}>
            <li className={isCurrentPath("/danapp/highlights") ? styles.active : ""}>
              <Link href="/danapp/highlights">highlights</Link>
            </li>
            <li className={isCurrentPath("/danapp/dbTests") ? styles.active : ""}>
              <Link href="/danapp/dbTests">dbTests</Link>
            </li>
            <li className={isCurrentPath("/danapp/quotes") ? styles.active : ""}>
              <Link href="/danapp/quotes">quotes</Link>
            </li>
          </ul>
          <div className={styles.button}>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
