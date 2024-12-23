/* eslint-disable react/prop-types */
import { Pencil2Icon } from '@radix-ui/react-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import IconButton from '../utils/IconButton';
import Modal from '../utils/Modal';
import Tooltip from '../utils/Tooltip';
import { S3Context } from '../../store/s3-context';
import Form from './Form';

export default function Edit({ item }) {
  const [pickedFile, setPickedFile] = useState();
  const dialog = useRef();
  const { editItem, fetchStatus, resetError } = useContext(S3Context);

  let itemType = 'files';
  if (item.key.endsWith('/')) {
    itemType = 'folders';
  }

  function handleReset() {
    dialog.current.close();
    setPickedFile();
    resetError();
    document.getElementById('form').reset();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    editItem(item, fd, itemType);
  }

  useEffect(() => {
    if (fetchStatus === 'idle') {
      handleReset();
    }
  }, [fetchStatus]);

  return (
    <li>
      <Modal ref={dialog} onReset={handleReset}>
        <Form
          title='Edit'
          onSubmit={handleSubmit}
          onReset={handleReset}
          item={item}
          itemType={itemType}
          pickedFile={pickedFile}
          setPickedFile={setPickedFile}
        />
      </Modal>

      <Tooltip tooltipText='Edit'>
        <IconButton onClick={() => dialog.current.open()}>
          <Pencil2Icon />
        </IconButton>
      </Tooltip>
    </li>
  );
}
