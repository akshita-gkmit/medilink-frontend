import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import AppRouter from './router/router';

function App() {
  console.log('App component rendered');
  console.log('ENV:', import.meta.env.VITE_BASE_URL);
  
  return (
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
  );
}

export default App;