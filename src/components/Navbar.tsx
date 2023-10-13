import React from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { useRouter } from "next/router";
import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const router = useRouter();

  const navItems = [
    // { path: "/danapp/highlights", label: "highlights" },
    { path: "/danapp/dbTests", label: "dbTests" },
    { path: "/danapp/quotes", label: "quotes" },
    { path: "/danapp/vision", label: "vision" },
    { path: "/danapp/loading", label: "loading" }
  ];

  const isCurrentPath = (path: string) => {
    return router.pathname === path;
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.menu}>
          <ul className={styles.navList}>
            {navItems.map(item => (
              <li className={isCurrentPath(item.path) ? styles.active : ""} key={item.path}>
                <Link href={item.path}>{item.label}</Link>
              </li>
            ))}
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
