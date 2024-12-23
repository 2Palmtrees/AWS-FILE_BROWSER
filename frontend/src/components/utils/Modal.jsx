import { useRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

function Modal({ ref, children, onReset }) {
  const dialog = useRef();

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();
      },
      close() {
        dialog.current.close();
      },
    };
  });

  return createPortal(
    <dialog ref={dialog} className={styles.Modal} onClose={onReset}>
      {children}
    </dialog>,
    document.getElementById('modal')
  );
}

export default Modal;
