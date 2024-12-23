/* eslint-disable react/prop-types */
import New from './New';
import styles from './ObjectsHeader.module.css';

export default function ObjectsHeader({
  title,
  newTitle,
  newTooltipText,
  newItemType,
}) {
  return (
    <header className={styles.Header}>
      <h2>{title}</h2>
      <menu>
        <New
          title={newTitle}
          tooltipText={newTooltipText}
          itemType={newItemType}
        />
      </menu>
    </header>
  );
}
