import Navbar from "~/components/Navbar";
import styles from "./autoSave.module.css";

export default function Page() {
  return (

    <>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.quoteInput}>
          Dog please,
          <br />
          I don't understand why this won't work... This is some text.
          <br />
          <br />
          -- ahh yes... love you
        </div>
      </div>
    </>
  )
}



// export default function Page() {

//   return (
//     <>
//       <Head>
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//       </Head>
//       <Navbar />
//       <main className={styles.appContainer}>
//         <div className={styles.main}>
//           <div
//             contentEditable={true}
//             placeholder="Type your quote..."
//             className={styles.quoteInput}
//           />
//         </div>
//       </main>
//     </>
//   );
// }



// <div className={styles.title}>
//             Write your quote below.
//           </div>
//           <div className={styles.directions}>Text between <span className={styles.highlight}>**sets of asterisks**</span> will be highlighted.</div>
//           <div style={{ height: '20px' }}></div>
// <button>Save</button>

