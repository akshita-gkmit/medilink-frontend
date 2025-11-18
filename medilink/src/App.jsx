import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './context/authContext';
import AppRouter from './router/router';

function App() {
  return (
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
  );
}

export default App;