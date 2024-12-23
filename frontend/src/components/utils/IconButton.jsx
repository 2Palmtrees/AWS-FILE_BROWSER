/* eslint-disable react/prop-types */
import styles from './IconButton.module.css';

export default function IconButton({ children, onClick }) {
  return (
    <button className={styles.IconButton} onClick={onClick}>
      {children}
    </button>
  );
}
