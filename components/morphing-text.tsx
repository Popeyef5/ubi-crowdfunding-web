import Typewriter from "typewriter-effect";
import styles from "./morphing-text.module.css";
import recipients from "../assets/recipients";
import { shuffle } from "../lib/util";

export default function MorphingText() {
  const writeText = (typewriter) => {
    typewriter.start();
  };

  const strings = shuffle(recipients).map(s => `${s}.`);

  return (
    <div className={styles.text}>
      <div className={styles.fixed}>UBI for</div>
      <div className={styles.morphing}>
        <Typewriter
          onInit={writeText}
          options={{ loop: true, autoStart: true, strings }}
        />
      </div>
    </div>
  );
}
