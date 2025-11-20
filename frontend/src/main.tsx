import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from "react-router-dom";

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error("Root element with id 'root' not found. Make sure your index.html contains <div id=\"root\"></div>.");
}

ReactDOM.createRoot(rootEl).render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);
