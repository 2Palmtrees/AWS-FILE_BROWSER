/* eslint-disable react/prop-types */
import { PlusIcon } from '@radix-ui/react-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import IconButton from '../utils/IconButton';
import Modal from '../utils/Modal';
import Tooltip from '../utils/Tooltip';
import { S3Context } from '../../store/s3-context';
import Form from './Form';

export default function New({ itemType, title, tooltipText }) {
  const [pickedFile, setPickedFile] = useState();
  const dialog = useRef();

  const { addItem, fetchStatus, resetError } = useContext(S3Context);

  function handleReset() {
    dialog.current.close();
    setPickedFile();
    resetError();
    document.getElementById('form').reset();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    // const data = Object.fromEntries(fd.entries());
    // console.log(data);

    addItem(fd, itemType);
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
          itemType={itemType}
          onReset={handleReset}
          onSubmit={handleSubmit}
          pickedFile={pickedFile}
          setPickedFile={setPickedFile}
          title={title}
        />
      </Modal>

      <Tooltip tooltipText={tooltipText}>
        <IconButton onClick={() => dialog.current.open()}>
          <PlusIcon />
        </IconButton>
      </Tooltip>
    </li>
  );
}
