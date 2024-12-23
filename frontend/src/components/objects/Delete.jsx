/* eslint-disable react/prop-types */
import { useContext, useRef } from 'react';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import IconButton from '../utils/IconButton';
import Modal from '../utils/Modal';
import Tooltip from '../utils/Tooltip';
import { S3Context } from '../../store/s3-context';

export default function Delete({ item }) {
  const dialog = useRef();
  const { fetchStatus, deleteItem } = useContext(S3Context);

  let itemType = 'files';
  if (item.key.endsWith('/')) {
    itemType = 'folders';
  }

  function handleReset() {
    dialog.current.close();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    deleteItem(item.key, itemType);
  }

  return (
    <li>
      <Modal ref={dialog} onReset={handleReset}>
        <form onSubmit={handleSubmit}>
          <h2>Delete</h2>

          {itemType === 'folders' ? (
            <p>
              Are you sure you want to delete this folder and all it&apos;s
              content in it? This can not be undone.
            </p>
          ) : (
            <p>
              Are you sure you want to delete this file? This can not be undone.
            </p>
          )}

          <div className='form-actions'>
            <button type='reset' onClick={handleReset}>
              Cancel
            </button>
            <button
              className='btn-danger'
              type='submit'
              disabled={fetchStatus === 'deleting'}
            >
              {fetchStatus === 'deleting' ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </form>
      </Modal>

      <Tooltip tooltipText='Delete'>
        <IconButton onClick={() => dialog.current.open()}>
          <CrossCircledIcon />
        </IconButton>
      </Tooltip>
    </li>
  );
}
