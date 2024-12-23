import { useContext, useEffect, useRef } from 'react';
import Header from './components/Header';
import { S3Context } from './store/s3-context';
import Modal from './components/utils/Modal';
import ErrorBlock from './components/utils/ErrorBlock';
import Folders from './components/objects/Folders';
import Files from './components/objects/Files';

function App() {
  const dialog = useRef();
  const { error, inputErrors, resetError, fetchStatus, folders, files } =
    useContext(S3Context);

  function handleReset() {
    dialog.current.close();
    resetError();
  }

  useEffect(() => {
    if (error && !inputErrors) {
      dialog.current.open();
    }
  }, [error]);

  return (
    <>
      <Header />
      <main>
        <>
          <Modal ref={dialog} onReset={handleReset}>
            {error && (
              <ErrorBlock
                title='An error occurred!'
                message={error.message}
                onConfirm={handleReset}
              />
            )}
          </Modal>
          {fetchStatus === 'fetching' && <p>Loading...</p>}

          {fetchStatus !== 'fetching' && (
            <>
              <Folders items={folders} />
              <Files items={files} />
            </>
          )}
        </>
      </main>
    </>
  );
}

export default App;
