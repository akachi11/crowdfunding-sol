import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { CrowdFundingProvider } from './context/CrowdFundingContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <CrowdFundingProvider>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </CrowdFundingProvider>
);
