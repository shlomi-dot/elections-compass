import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import ElectionsCompass from './ElectionsCompass.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ElectionsCompass />
    <Analytics />
  </React.StrictMode>
);