/* eslint-disable react/prop-types */
import List from './List';
import ObjectsHeader from './ObjectsHeader';

export default function Folders({ items }) {
  return (
    <section>
      <ObjectsHeader
        title={items.length > 0 ? 'Available folders' : 'No folders here.'}
        newItemType='folders'
        newTitle='New folder'
        newTooltipText='Add a new folder'
      />
      {items.length > 0 && <List items={items} />}
    </section>
  );
}
