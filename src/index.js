import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Global resets and fonts
import App from './App';
// This is the "Heart" of your login system. Without this, 
// your project won't know if a user is an Admin or a Customer.
import { AuthProvider } from './context/AuthContext';
// Import the Global OAuth Provider to handle third-party identity lifecycles
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* 🔒 Global Security Layer: Locks third-party authentication context to your verified Client ID */}
    <GoogleOAuthProvider clientId="715694544162-5o84adq0s3lc0aqr90jhbpfgjdkq4gh1.apps.googleusercontent.com">
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);