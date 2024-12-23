/* eslint-disable react/prop-types */
import List from './List';
import ObjectsHeader from './ObjectsHeader';

export default function Files({ items }) {
  return (
    <section>
      <ObjectsHeader
        title={items.length > 0 ? 'Available files' : 'No files here.'}
        newItemType='files'
        newTitle='New file'
        newTooltipText='Add a new file'
      />
      {items.length > 0 && <List items={items} />}
    </section>
  );
}
