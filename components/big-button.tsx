import styles from "./big-button.module.css";

type BigButtonProps = {
  children: React.ReactNode,
  callback?: () => void 
}

export default function BigButton({ children, callback = () => {} }: BigButtonProps) {
  
  return (
    <button
      className={styles.bigbutton}
      onClick={callback}
    >
      {children}
    </button>
  );
}
