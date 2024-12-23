/* eslint-disable react/prop-types */
import Item from './Item';

import styles from './List.module.css';

export default function List({ items }) {
  return (
    <ul className={styles.List}>
      {items.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </ul>
  );
}
