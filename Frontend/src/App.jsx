import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ShopProvider>
          <Toaster
            position="center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          <AppRoutes />
        </ShopProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
