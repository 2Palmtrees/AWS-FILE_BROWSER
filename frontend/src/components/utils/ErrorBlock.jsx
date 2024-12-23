/* eslint-disable react/prop-types */
import styles from './ErrorBlock.module.css';

export default function ErrorBlock({ title, message, onConfirm }) {
  return (
    <div className={styles.Error}>
      <h2>{title}</h2>
      <p>{message}</p>
      {onConfirm && (
        <div className={styles.Actions}>
          <button onClick={onConfirm}>Ok</button>
        </div>
      )}
    </div>
  );
}
