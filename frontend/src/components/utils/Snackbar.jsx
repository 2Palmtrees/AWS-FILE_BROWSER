/* eslint-disable react/prop-types */
import clsx from 'clsx';
import styles from './Snackbar.module.css';
import { useEffect } from 'react';

export default function Snackbar({
  showToast,
  setShowToast,
  snackbarText,
  color,
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 2950);

    return () => {
      clearTimeout(timer);
    };
  }, [setShowToast, showToast]);

  return (
    <div
      className={clsx(
        styles.Snackbar,
        showToast && styles.Show,
        color === 'error' && styles.Error
      )}
    >
      {snackbarText}
    </div>
  );
}
