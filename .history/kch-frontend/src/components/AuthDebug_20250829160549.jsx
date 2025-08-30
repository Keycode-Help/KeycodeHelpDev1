import React from 'react';
import { useAuth } from '../context/AuthContext';

const AuthDebug = () => {
  const { user, isAuthenticated, isInitialized } = useAuth();

  // Helper function to get cookie info
  const getCookieInfo = () => {
    const cookies = document.cookie.split(';');
    const cookieMap = {};
    cookies.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookieMap[name] = value.substring(0, 20) + (value.length > 20 ? '...' : '');
      }
    });
    return cookieMap;
  };

  // Helper function to get localStorage info
  const getLocalStorageInfo = () => {
    const authUser = localStorage.getItem('auth_user');
    const authToken = localStorage.getItem('auth_token');
    return {
      auth_user: authUser ? JSON.parse(authUser).email : null,
      auth_token: authToken ? authToken.substring(0, 20) + '...' : null
    };
  };

  if (!isInitialized) {
    return <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
      🔄 Initializing authentication...
    </div>;
  }

  return (
    <div className="p-4 bg-gray-100 border border-gray-400 rounded text-sm font-mono">
      <h3 className="font-bold mb-2">🔐 Authentication Debug Info</h3>
      
      <div className="mb-2">
        <strong>State:</strong> {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
      </div>
      
      <div className="mb-2">
        <strong>User:</strong> {user ? `${user.email} (${user.role})` : 'None'}
      </div>
      
      <div className="mb-2">
        <strong>Cookies:</strong>
        <pre className="mt-1 text-xs">
          {JSON.stringify(getCookieInfo(), null, 2)}
        </pre>
      </div>
      
      <div className="mb-2">
        <strong>LocalStorage:</strong>
        <pre className="mt-1 text-xs">
          {JSON.stringify(getLocalStorageInfo(), null, 2)}
        </pre>
      </div>
      
      <div className="text-xs text-gray-600">
        This debug info will help troubleshoot authentication persistence issues.
      </div>
    </div>
  );
};

export default AuthDebug;
