/* eslint-disable react/prop-types */
import Navigation from './Navigation';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.Header}>
      <h1>AWS File Browser</h1>
      <Navigation />
    </header>
  );
}
