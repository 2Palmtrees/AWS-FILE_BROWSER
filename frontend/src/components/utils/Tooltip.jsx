/* eslint-disable react/prop-types */
import styles from './Tooltip.module.css'

export default function Tooltip({tooltipText, children}) {
  return (
    <div className={styles.Tooltip}>
      <span>{tooltipText}</span>
      {children}
    </div>
  );
}
