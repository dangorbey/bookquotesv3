import 'context-filter-polyfill';
import Navbar from "~/components/Navbar";
import styles from './vision.module.css';
// import CanvasComponent from "~/components/CanvasComponent";
import SVGDownloadComponent from '~/components/SVGDownloadComponent';
// import * as StackBlur from 'stackblur-canvas';


// function surroundWithLorem() {
//   const lorem = "Nullam tempus eget erat a scelerisque. Curabitur ut dolor id est eleifend eleifend ut ut nibh. Nulla leo neque, faucibus non nulla vel, blandit convallis nunc. Pellentesque quis blandit libero. ";

//   return (
//     <div className={styles.textFrame}>
//       <div className={styles.content}>
//         <div className={styles.blur}>{lorem}</div>
//         <div className={styles.quote}>Thus in love the free-lovers say: ‘Let us have the splendor of offering ourselves without the peril of committing ourselves; let us see whether <span className={styles.highlight}>one cannot commit suicide an unlimited number of times.</span></div>
//         <div className={styles.blur}>{lorem}</div>
//       </div>
//       <div className={`${styles.content} ${styles.mirror}`}>
//         <div>{lorem + lorem + lorem}</div>
//       </div>
//     </div>
//   );
// }

export default function Page() {

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.canvasFrame}>
          <SVGDownloadComponent />
        </div>
      </div>
    </div>
  );

}