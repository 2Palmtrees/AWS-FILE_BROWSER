/* eslint-disable react/prop-types */
import { useContext, useRef } from 'react';

import styles from './FilePicker.module.css';
import { S3Context } from '../../store/s3-context';

export default function FilePicker({ setPickedFile, pickedFile }) {
  const pickedRef = useRef();
  const { resetError, inputErrors, fetchStatus } = useContext(S3Context);

  function handleChange() {
    setPickedFile(pickedRef.current.files[0]);
  }

  return (
    <fieldset className={styles.Fieldset}>
      <input
        hidden
        type='file'
        name='file'
        ref={pickedRef}
        onChange={handleChange}
      />
      {!pickedFile && (
        <button type='button' onClick={() => pickedRef.current.click()}>
          Pick a file
        </button>
      )}
      {pickedFile && (
        <div className={styles.Preview}>
          <img
            width='128px'
            src={URL.createObjectURL(pickedFile)}
            alt='preview'
            onClick={() => pickedRef.current.click()}
          />
          <p>image to upload (click on image to select a different one)</p>
        </div>
      )}
    </fieldset>
  );
}
