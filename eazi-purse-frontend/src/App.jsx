import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from "./router/route.jsx";
import React from 'react';
import { Toaster } from 'react-hot-toast';

function App() {
  const [hasServerError, setHasServerError] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Global fetch error handler
  React.useEffect(() => {
    const origFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await origFetch(...args);
        if (!response.ok && response.status >= 500) {
          setHasServerError(true);
        }
        return response;
      } catch (err) {
        if (!navigator.onLine) {
          setIsOnline(false);
        } else {
          setHasServerError(true);
        }
        throw err;
      }
    };
    return () => {
      window.fetch = origFetch;
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">No Internet Connection</h1>
          <p className="text-white/60">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  if (hasServerError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Server Error</h1>
          <p className="text-white/60">Something went wrong. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App; 