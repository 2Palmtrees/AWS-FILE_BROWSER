/* eslint-disable react/prop-types */
import { useContext } from 'react';
import Delete from './Delete';
import Edit from './Edit';
import { S3Context } from '../../store/s3-context';

import styles from './Item.module.css';

export default function Item({ item }) {
  const { fetchObjects } = useContext(S3Context);
  let itemType = 'files';
  if (item.key.endsWith('/')) {
    itemType = 'folders';
  }

  function handleClickFile(file) {
    console.log('Clicked object with key:', file.key);
  }

  function handleClickFolder(folder) {
    fetchObjects({ prefix: folder.key });
  }

  return (
    <li className={styles.Item}>
      <menu className={styles.ItemMenu}>
        <Delete item={item} />
        <Edit item={item} />
      </menu>

      {itemType === 'folders' ? (
        <button
          className={styles.FolderButton}
          onClick={() => handleClickFolder(item)}
        >
          {item.folderName}
        </button>
      ) : (
        <button
          className={styles.FileButton}
          onClick={() => handleClickFile(item)}
        >
          <img src={item.url} alt={item.key} />
        </button>
      )}
    </li>
  );
}
