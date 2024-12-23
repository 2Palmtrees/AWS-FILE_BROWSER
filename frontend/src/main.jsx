import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import S3ContextProvider from './store/s3-context.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <S3ContextProvider>
      <App />
    </S3ContextProvider>
  </StrictMode>
);
