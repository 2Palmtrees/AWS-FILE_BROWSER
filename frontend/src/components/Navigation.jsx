import { useContext } from 'react';
import styles from './Navigation.module.css';
import { S3Context } from '../store/s3-context';

export default function Navigation() {
  const { prefix, fetchObjects } = useContext(S3Context);

  let folderNames = [];
  let crumbsArray = [
    {
      folderName: 'Home',
      folderLink: '',
    },
  ];

  folderNames = prefix.split('/').slice(0, -1);

  if (folderNames.length > 0) {
    let prev = '';
    let deepCrumbs = folderNames.map((folderName) => {
      const folderLink = prev + folderName + '/';
      prev = folderName + '/';
      let crumb = {
        folderName,
        folderLink,
      };
      return crumb;
    });
    crumbsArray = crumbsArray.concat(deepCrumbs);
  }

  // console.log('CRUMSARRAY', crumbsArray);

  return (
    <nav className={styles.crumbs}>
      <ol>
        {crumbsArray.map((crumb, i) => {
          if (i === crumbsArray.length - 1) {
            return (
              <li key={i} className={styles.crumb}>
                {crumb.folderName}
              </li>
            );
          }
          return (
            <li key={i} className={styles.crumb}>
              <button
                onClick={() => fetchObjects({ prefix: crumb.folderLink })}
              >
                {crumb.folderName}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
