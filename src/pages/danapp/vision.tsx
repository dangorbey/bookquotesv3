import Image from 'next/image'
import Navbar from "~/components/Navbar";
import pic from '/public/Quote Ref-003.png'
import styles from './vision.module.css'

export default function Page() {
  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.imageTitle}>v1 visual style:</h1>
        <div className={styles.imageWrapper}>
          <Image
            src={pic}
            alt='Quote Visual Reference'
            className={styles.quote}
            placeholder="blur"
          />
        </div>
      </div>
    </div>
  )
}
