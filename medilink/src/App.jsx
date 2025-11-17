import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import AppRouter from './router/router';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
