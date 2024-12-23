/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { S3Context } from '../../store/s3-context';
import FilePicker from '../input/FilePicker';

export default function Form({
  onSubmit,
  title,
  item,
  itemType,
  pickedFile,
  setPickedFile,
  onReset,
}) {
  const { inputErrors, fetchStatus, prefix } = useContext(S3Context);

  function errorIndex(name) {
    return inputErrors.errors?.errors.findIndex((e) => e.path === name);
  }

  return (
    <form onSubmit={onSubmit} encType='multipart/form-data' id='form'>
      <h2>{title}</h2>
      {inputErrors && <p className='form-error'>{inputErrors.message}</p>}

      {itemType === 'folders' ? (
        <>
          <fieldset className='fieldset-text'>
            <label htmlFor='name'>Name:</label>
            <input
              id='name'
              type='text'
              name='folderName'
              defaultValue={item ? item.folderName : ''}
            />
          </fieldset>
          {inputErrors && errorIndex('folderName') >= 0 && (
            <p className='form-error'>
              {inputErrors.errors?.errors[errorIndex('folderName')].msg}
            </p>
          )}
        </>
      ) : (
        <>
          {item && (
            <fieldset className='fieldset-image'>
              <div className='image-preview'>
                <img width='128px' src={item.url} alt='to replace image' />
                <p>image to replace</p>
              </div>
            </fieldset>
          )}
          <FilePicker pickedFile={pickedFile} setPickedFile={setPickedFile} />
        </>
      )}
      <input type='hidden' name='prefix' value={prefix} />
      <input type='hidden' name='itemType' value={itemType} />

      <div className='form-actions'>
        <button type='reset' onClick={onReset}>
          Cancel
        </button>
        <button
          disabled={fetchStatus === 'uploading' || fetchStatus === 'deleting'}
          type='submit'
        >
          {fetchStatus === 'uploading'
            ? 'Uploading...'
            : fetchStatus === 'deleting'
            ? 'Deleting...'
            : 'Submit'}
        </button>
      </div>
      
    </form>
  );
}
