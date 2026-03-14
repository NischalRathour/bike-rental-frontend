import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Global resets and fonts
import App from './App';
// This is the "Heart" of your login system. Without this, 
// your project won't know if a user is an Admin or a Customer.
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);